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
import * as api from '@/api/baseApi/exportApi.js';

/*-----------------------------------------
  API 映射表
-----------------------------------------*/
const apiMap = {
    111: api.exportSkuApi,
    221: api.exportWhinOrderApi,
    222: api.exportConsumablesInReceivingApi,
    223: api.exportInShelfApi,
    224: api.exportReturnOrderApi,
    300: api.exportInventoryApi,
    301: api.exportInventoryLogApi,
    302: api.exportInventorySnapshotApi,
    305: api.exportInventorySnApi,
    306: api.exportInventoryAdjustApi,
    400: api.exportOutOrderApi,
    402: api.exportOutOrderTraceApi,
    512: api.exportWhLocationApi,
    513: api.exportConsumablesInventoryApi,
    514: api.exportConsumablesInApi,
    515: api.exportConsumablesOutApi,
    518: api.exportProductSupplierApi,
    519: api.exportRemoteDetailApi,
    603: api.exportCustomerAccountApi,
    604: api.exportCustomerCreditApi,
    605: api.exportCustomerRechargeApi,
    610: api.exportReceivableFeeApi,
    611: api.exportReceivableBillApi
};

/*-----------------------------------------
  Props (外部参数)
-----------------------------------------*/
const props = defineProps({
    selectionRows: { type: Array, default: () => [] },
    initValues: { type: Object, default: () => ({}) },
    exportType: { type: Number, required: true },
    disabled: { type: Boolean, default: false },

    // [新功能] 导出范围控制：传入 1 或 2 可锁定选项
    exportRangeValue: { type: [Number, String, null], default: null },

    // [新功能] 特殊开关：是否使用单条 ID 参数 (id: xxx) 而非数组 (idList: [...])
    useSingleId: { type: Boolean, default: false },

    // [新功能] 成功回调
    onExportSuccess: { type: Function, default: null },

    // [兼容性关键] 保留原有的 otherParameters，防止旧页面报错
    otherParameters: { type: Object, default: () => ({}) },

    // [新规范] 新的额外参数字段（推荐新页面使用）
    extraParams: { type: Object, default: () => ({}) }
});

/*-----------------------------------------
  组件内部状态
-----------------------------------------*/
const exportDialogVisible = ref(false);
const exportForm = ref({
    type: '',          // 导出范围
    templateName: ''   // 导出模板ID
});
const exportTypeOptions = ref([]); // 模板列表
const lastType = ref(null);        // 记录上一次导出类型

/*-----------------------------------------
  响应式引用与监听
-----------------------------------------*/
const exportRangeValue = toRef(props, 'exportRangeValue');

// 初始化导出范围
if (exportRangeValue.value == 1 || exportRangeValue.value == 2 ||
    String(exportRangeValue.value) === '1' || String(exportRangeValue.value) === '2'
) {
    exportForm.value.type = Number(exportRangeValue.value);
}

// Watch: 外部变更 exportRangeValue 时同步
watch(exportRangeValue, (newVal) => {
    if (newVal == 1 || newVal == 2 || String(newVal) === '1' || String(newVal) === '2') {
        exportForm.value.type = Number(newVal);
    }
});

/*-----------------------------------------
  打开导出弹窗
-----------------------------------------*/
const openExportDialog = () => {
    // 如果 exportType 变化或首次加载，则获取模板
    if (lastType.value !== props.exportType || exportTypeOptions.value.length === 0) {
        lastType.value = props.exportType;
        exportForm.value.templateName = '';
        loadExportTemplates();
    }

    // 设置默认选中项逻辑（兼容旧行为：如果不传 exportRangeValue，默认为空，由用户选择）
    if (props.exportRangeValue != null) {
        exportForm.value.type = Number(props.exportRangeValue);
    } else if (props.disabled) {
        exportForm.value.type = 1;
    }

    exportDialogVisible.value = true;
};

/*-----------------------------------------
  加载导出模板
-----------------------------------------*/
const loadExportTemplates = async () => {
    try {
        const res = await getTemplateApi({
            atypeId: 2,
            btypeId: props.exportType
        });
        exportTypeOptions.value = res.data || [];
    } catch (error) {
        console.error('加载导出模板失败', error);
        smartAlert('加载导出模板失败，请重试', false);
    }
};

/*-----------------------------------------
  确认导出
-----------------------------------------*/
const handleExportConfirm = async () => {
    if (!exportForm.value.templateName) {
        smartAlert('请选择导出格式', false);
        return;
    }

    // 若没有外部固定范围且被禁用，默认按勾选
    if (props.exportRangeValue === null && props.disabled) {
        exportForm.value.type = 1;
    }

    // [兼容性关键] 初始合并 otherParameters (旧) 和 extraParams (新)
    // 确保旧页面传递的 otherParameters 不会丢失
    const apiParams = ref({
        ...props.otherParameters,
        ...props.extraParams
    });

    // 2. 构建参数
    if (exportForm.value.type === 1) {
        // --- 按勾选 ---
        if (props.selectionRows.length === 0) {
            smartAlert('请选择要导出的数据！', true, 1000);
            return;
        }

        // 处理 useSingleId 逻辑
        if (props.useSingleId) {
            if (props.selectionRows.length > 1) {
                smartAlert('当前导出模式仅支持选择单条数据！', false);
                return;
            }
            apiParams.value.id = props.selectionRows[0].id;
        } else {
            apiParams.value.idList = props.selectionRows.map(item => item.id);
        }
    } else {
        // --- 按条件 ---
        // [兼容性关键] 必须同时合并 initValues, otherParameters 和 extraParams
        apiParams.value = {
            ...props.initValues,
            ...props.otherParameters,
            ...props.extraParams
        };
        // 清理空 orgId 数组
        if (apiParams.value.orgId && Array.isArray(apiParams.value.orgId) && apiParams.value.orgId.length === 0) {
            delete apiParams.value.orgId;
        }
    }

    apiParams.value.templateId = exportForm.value.templateName;

    // 4. 获取 API
    const exportApi = apiMap[props.exportType];
    if (!exportApi) {
        smartAlert('未找到对应的导出API', false);
        return;
    }

    // 5. 发起请求
    const bodyLoading = ElLoading.service({ text: '正在生成导出文件...' });
    try {
        const res = await exportApi(apiParams.value);
        smartAlert(res.msg, res.success, 1000);

        if (!res.success) return;

        // --- 成功处理 ---
        let externalHandled = false;

        // 执行外部回调
        if (typeof props.onExportSuccess === 'function') {
            try {
                const maybePromise = props.onExportSuccess(res, apiParams.value);
                const ret = maybePromise && typeof maybePromise.then === 'function'
                    ? await maybePromise
                    : maybePromise;

                if (ret === true) externalHandled = true;
            } catch (err) {
                console.error('onExportSuccess 回调异常:', err);
            }
        }

        // 默认行为
        if (!externalHandled) {
            if (typeof res.data === 'string' && res.data.startsWith('http')) {
                window.open(res.data, '_blank');
            }
        }

        // 关闭弹窗并重置
        exportDialogVisible.value = false;
        if (props.exportRangeValue === null) exportForm.value.type = '';

    } catch (error) {
        console.error('导出请求失败', error);
        smartAlert('导出失败，请检查参数或联系管理员', false);
    } finally {
        bodyLoading.close();
    }
};

/*-----------------------------------------
  重置表单
-----------------------------------------*/
const resetExportForm = () => {
    // 重置导出范围
    if (props.exportRangeValue === null) {
        exportForm.value.type = '';
    } else {
        exportForm.value.type = Number(props.exportRangeValue);
    }

    exportForm.value.templateName = '';
};

/*-----------------------------------------
  暴露方法
-----------------------------------------*/
defineExpose({
    openExportDialog
});
</script>