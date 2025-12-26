<template>
    <el-dialog title="导出" v-model="exportDialogVisible" width="35%" align-center destroy-on-close
        @closed="resetExportForm">

        <el-form-item label="导出范围:" class="compact-item" v-if="!disabled || exportRangeValue !== null">
            <el-select v-model="exportForm.type" placeholder="请选择导出范围"
                :disabled="disabled || exportRangeValue !== null">
                <el-option label="按勾选" :value="1" />
                <el-option label="按条件" :value="2" />
            </el-select>
        </el-form-item>

        <el-form-item label="导出格式:" class="compact-item">
            <el-select v-model="exportForm.templateName" placeholder="请选择导出格式">
                <el-option v-for="item in exportTypeOptions" :key="item.name" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <slot name="extraForm"></slot>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="exportDialogVisible = false">
                    {{ getButtonText('cancel') }}
                </el-button>
                <el-button type="primary" @click="handleExportConfirm">
                    {{ getButtonText('confirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, toRef } from 'vue';
import { ElLoading } from 'element-plus';
import { getTemplateApi } from '@/api/baseApi/index.js';
import { smartAlert } from '@/utils/genericMethods.js';
import { exportJobAddApi } from '@/api/sysApi/job.js';

/*-----------------------------------------
  Props (组件接收的参数说明)
-----------------------------------------*/
const props = defineProps({
    /**
     * 当前表格勾选的数据行数组
     * 用于“按勾选”导出时获取 ID
     */
    selectionRows: { type: Array, default: () => [] },

    /**
     * 页面查询条件的初始值对象
     * 用于“按条件”导出时传递筛选参数
     */
    initValues: { type: Object, default: () => ({}) },

    /**
     * 导出业务类型 ID (必填)
     * 用于区分不同的业务模块（如：300=库存导出，400=出库单导出等）
     * 同时用于获取对应的导出模板列表
     */
    exportType: { type: Number, required: true },

    /**
     * 是否禁用导出范围选择
     * 通常配合 exportRangeValue 使用，或用于特殊锁定场景
     */
    disabled: { type: Boolean, default: false },

    /**
     * 强制指定导出范围
     * 1: 强制按勾选
     * 2: 强制按条件
     * null: 用户可自由选择
     */
    exportRangeValue: { type: [Number, String, null], default: null },

    /**
     * ID 参数模式开关
     * false (默认): 传递 idList 数组 -> { idList: [1, 2, 3] }
     * true: 仅支持单选，传递单个 id -> { id: 1 }
     */
    useSingleId: { type: Boolean, default: false },

    /**
     * 导出请求成功后的回调函数
     * 接收参数: (response, requestParams)
     * 如果返回 Promise 且 resolve(true)，则组件不执行默认的下载/跳转逻辑
     */
    onExportSuccess: { type: Function, default: null },

    /**
     * 额外的自定义参数对象
     * 这些参数会合并到最终的 exportParam JSON 中
     * 例如：{ view: 'detail', source: 'pda' }
     */
    extraParams: { type: Object, default: () => ({}) }
});

/*-----------------------------------------
  组件内部状态变量
-----------------------------------------*/
const exportDialogVisible = ref(false); // 控制弹窗显示/隐藏
const exportForm = ref({
    type: '',          // 当前选择的导出范围 (1=按勾选, 2=按条件)
    templateName: ''   // 当前选中的模板 ID
});
const exportTypeOptions = ref([]); // 存储从后端获取的模板列表
const lastType = ref(null);        // 缓存上一次的 exportType，避免重复请求模板接口

/*-----------------------------------------
  初始化逻辑与监听
-----------------------------------------*/
const exportRangeValue = toRef(props, 'exportRangeValue');

// 如果父组件传入了固定的导出范围，初始化时直接赋值
if (exportRangeValue.value == 1 || exportRangeValue.value == 2 ||
    String(exportRangeValue.value) === '1' || String(exportRangeValue.value) === '2'
) {
    exportForm.value.type = Number(exportRangeValue.value);
}

// 监听 props.exportRangeValue 变化，动态更新表单状态
watch(exportRangeValue, (newVal) => {
    if (newVal == 1 || newVal == 2 || String(newVal) === '1' || String(newVal) === '2') {
        exportForm.value.type = Number(newVal);
    }
});

/*-----------------------------------------
  方法定义
-----------------------------------------*/

/**
 * 打开导出弹窗
 * 对外暴露的方法，父组件通过 ref 调用
 */
const openExportDialog = () => {
    // 检查 exportType 是否发生变化或首次加载，如果是则重新获取模板
    if (lastType.value !== props.exportType || exportTypeOptions.value.length === 0) {
        lastType.value = props.exportType;
        exportForm.value.templateName = '';
        loadExportTemplates();
    }

    // 设置默认选中项逻辑：
    // 1. 如果有强制范围，使用强制范围
    // 2. 如果无强制范围但被 disabled，默认为“按勾选”
    if (props.exportRangeValue != null) {
        exportForm.value.type = Number(props.exportRangeValue);
    } else if (props.disabled) {
        exportForm.value.type = 1;
    }

    exportDialogVisible.value = true;
};

/**
 * 加载导出模板列表
 * 调用基础 API 获取当前 exportType 对应的可用模板
 */
const loadExportTemplates = async () => {
    try {
        const res = await getTemplateApi({
            atypeId: 2,               // 固定为导出模板类型
            btypeId: props.exportType // 具体的业务类型ID
        });
        exportTypeOptions.value = res.data || [];
    } catch (error) {
        console.error('加载导出模板失败', error);
        smartAlert('加载导出模板失败，请重试', false);
    }
};

/**
 * 确认导出操作
 * 1. 校验必填项
 * 2. 组装业务参数 (innerParams)
 * 3. 序列化参数并调用统一导出任务接口
 * 4. 处理回调与下载
 */
const handleExportConfirm = async () => {
    // 1. 校验是否选择了模板
    if (!exportForm.value.templateName) {
        smartAlert('请选择导出格式', false);
        return;
    }

    // 兜底逻辑：若未设置范围且组件被禁用，默认为按勾选
    if (props.exportRangeValue === null && props.disabled) {
        exportForm.value.type = 1;
    }

    // 2. 准备基础参数对象 (合并 extraParams)
    const innerParams = {
        ...props.extraParams
    };

    // 3. 根据导出范围组装参数
    if (exportForm.value.type === 1) {
        // --- 情况 A: 按勾选导出 ---
        if (props.selectionRows.length === 0) {
            smartAlert('请选择要导出的数据！', true, 1000);
            return;
        }

        // 判断是传递单个 ID 还是 ID 列表
        if (props.useSingleId) {
            if (props.selectionRows.length > 1) {
                smartAlert('当前导出模式仅支持选择单条数据！', false);
                return;
            }
            innerParams.id = props.selectionRows[0].id;
        } else {
            innerParams.idList = props.selectionRows.map(item => item.id);
        }
    } else {
        // --- 情况 B: 按条件导出 ---
        // 合并页面当前的查询条件
        Object.assign(innerParams, props.initValues);

        // 清理可能存在的空 orgId (业务特定逻辑)
        if (innerParams.orgId) {
            delete innerParams.orgId;
        }
    }

    // 4. 构建统一接口请求体
    const apiPayload = {
        typeId: props.exportType,                  // 业务类型
        templateId: exportForm.value.templateName, // 模板ID
        exportParam: JSON.stringify(innerParams)   // 核心参数：序列化为 JSON 字符串
    };

    // 5. 发起 API 请求
    const bodyLoading = ElLoading.service({ text: '正在生成导出任务...' });
    try {
        const res = await exportJobAddApi(apiPayload);

        smartAlert(res.msg, res.success, 1000);

        if (!res.success) return;

        // 6. 成功后的处理
        let externalHandled = false;

        // 6.1 执行外部传入的回调函数 (如果有)
        if (typeof props.onExportSuccess === 'function') {
            try {
                // 将响应结果和原始参数回传给父组件
                const maybePromise = props.onExportSuccess(res, innerParams);
                // 支持异步回调
                const ret = maybePromise && typeof maybePromise.then === 'function'
                    ? await maybePromise
                    : maybePromise;

                // 如果回调返回 true，表示父组件已自行处理后续逻辑（如自定义下载），阻止默认行为
                if (ret === true) externalHandled = true;
            } catch (err) {
                console.error('onExportSuccess 回调异常:', err);
            }
        }

        // 6.2 默认下载处理（如果父组件未拦截）
        if (!externalHandled) {
            // 如果后端直接返回了文件地址（以 http 开头），则打开新窗口下载
            if (typeof res.data === 'string' && res.data.startsWith('http')) {
                window.open(res.data, '_blank');
            }
        }

        // 7. 关闭弹窗并重置状态
        exportDialogVisible.value = false;
        if (props.exportRangeValue === null) exportForm.value.type = '';

    } catch (error) {
        console.error('导出请求失败', error);
        smartAlert('导出失败，请检查参数或联系管理员', false);
    } finally {
        bodyLoading.close();
    }
};

/**
 * 弹窗关闭时的重置逻辑
 */
const resetExportForm = () => {
    // 恢复默认的导出范围选中状态
    if (props.exportRangeValue === null) {
        exportForm.value.type = '';
    } else {
        exportForm.value.type = Number(props.exportRangeValue);
    }
    // 清空模板选择
    exportForm.value.templateName = '';
};

/*-----------------------------------------
  暴露给父组件的方法
-----------------------------------------*/
defineExpose({
    openExportDialog
});
</script>