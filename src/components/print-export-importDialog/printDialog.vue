<template>
    <!-- 打印弹窗 -->
    <el-dialog title="打印" v-model="printDialogVisible" width="35%" align-center destroy-on-close
        @closed="resetPrintForm">
        <!-- 打印范围（如果外部传入 printRangeValue 则禁用选择框） -->
        <el-form-item label="打印范围:" class="compact-item" v-if="!disabled || printRangeValue !== null">
            <el-select v-model="printForm.type" placeholder="请选择打印范围" :disabled="disabled || printRangeValue !== null">
                <el-option label="按勾选" :value="1" />
                <el-option label="按条件" :value="2" />
            </el-select>
        </el-form-item>

        <!-- 打印格式（受 showPrintFormat 控制） -->
        <el-form-item label="打印格式:" class="compact-item" v-if="showPrintFormat">
            <el-select v-model="printForm.templateName" placeholder="请选择打印格式">
                <el-option v-for="item in printTypeOptions" :key="item.name" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <!-- 打印份数（受 showPrintQty 控制） -->
        <el-form-item label="打印份数:" class="compact-item" v-if="showPrintQty">
            <el-input v-model="printForm.printQty" placeholder="打印份数1——100" type="number" :min="1" :max="100"
                @input="handlePrintQtyInput" :disabled="disabled" />
        </el-form-item>

        <!-- 弹窗底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="printDialogVisible = false">
                    {{ getButtonText('cancel') }}
                </el-button>
                <el-button type="primary" @click="handlePrintConfirm">
                    {{ getButtonText('confirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>


<script setup>
import { ref, watch, toRef } from 'vue';
import { ElLoading } from 'element-plus';
import { smartAlert } from '@/utils/genericMethods.js';
import { getTemplateApi } from '@/api/baseApi/index.js';
import * as api from '@/api/baseApi/printApi.js';


/*-----------------------------------------
  打印类型 API 映射表
-----------------------------------------*/
const apiMap = {
    111: api.skuPrintApi,
    512: api.printWhLocationApi,
    513: api.printConsumablesInventoryApi,
    221: api.printWhinOrderApi,
    222: api.printInOrderPrintprintBoxApi,
    10: api.printOutWavePrintWayBillApi,

    402: api.printOutOrderPrintInvoiceApi,
    403: api.printOutOrderPrintWayBillApi,
    404: api.printOutOrderPrintVasOrderDataApi,
    405: api.printOutOrderPrintAttachmentsApi,
};


/*-----------------------------------------
  Props（外部参数）
-----------------------------------------*/
const props = defineProps({
    selectionRows: { type: Array, default: () => [] },
    initValues: { type: Object, default: () => ({}) },
    printType: { type: Number, required: true },
    disabled: { type: Boolean, default: false },

    // 控制“打印格式”是否显示
    showPrintFormat: { type: Boolean, default: true },

    // 打印范围：（固定 1 或 2 时禁用下拉）
    printRangeValue: { type: [Number, String, null], default: null },

    // 是否显示打印份数
    showPrintQty: { type: Boolean, default: true },

    // 默认打印份数
    defaultPrintQty: { type: Number, default: 1 },

    // 成功回调
    onPrintSuccess: { type: Function, default: null }
});

/*-----------------------------------------
  组件内部状态
-----------------------------------------*/
const printDialogVisible = ref(false);

const printForm = ref({
    type: '',         // 打印范围
    templateName: '', // 打印格式
    printQty: 1       // 打印份数
});

const printTypeOptions = ref([]);  // 打印模板列表
const lastType = ref(1);           // 记录上一次打印类型，避免重复加载


/*-----------------------------------------
  转为响应式引用，方便 watch
-----------------------------------------*/
const printRangeValue = toRef(props, 'printRangeValue');
const showPrintQty = toRef(props, 'showPrintQty');
const defaultPrintQty = toRef(props, 'defaultPrintQty');


/*-----------------------------------------
  初始化打印范围
-----------------------------------------*/
if (printRangeValue.value == 1 || printRangeValue.value == 2 ||
    String(printRangeValue.value) === '1' || String(printRangeValue.value) === '2'
) {
    printForm.value.type = Number(printRangeValue.value);
}


/*-----------------------------------------
  初始化打印份数
-----------------------------------------*/
if (showPrintQty.value) {
    const dp = Number(defaultPrintQty.value) || 1;
    printForm.value.printQty = Math.max(1, Math.min(100, dp));
}


/*-----------------------------------------
  watch：外部变更 printRangeValue 时同步
-----------------------------------------*/
watch(printRangeValue, (newVal) => {
    if (newVal == 1 || newVal == 2 || String(newVal) === '1' || String(newVal) === '2') {
        printForm.value.type = Number(newVal);
    }
});


/*-----------------------------------------
  打开打印弹窗
-----------------------------------------*/
const openPrintDialog = (type) => {
    // 选择打印类型
    const t = (type == null) ? Number(props.printType) : Number(type);

    // 打印类型变化：重置 & 加载模板
    if (lastType.value !== t) {
        lastType.value = t;

        if (props.printRangeValue === null) {
            printForm.value.type = '';
        }

        if (props.showPrintFormat) {
            printForm.value.templateName = '';
            loadPrintTemplates(t);
        }
    }

    // 若父组件固定了打印范围，则强制设置
    if (props.printRangeValue != null) {
        printForm.value.type = Number(props.printRangeValue);
    } else if (props.disabled) {
        printForm.value.type = 1;
    }

    printDialogVisible.value = true;
};


/*-----------------------------------------
  加载打印模板列表
-----------------------------------------*/
const loadPrintTemplates = async (type) => {
    if (!props.showPrintFormat) return;

    try {
        const res = await getTemplateApi({
            atypeId: 3,
            btypeId: type || props.printType
        });
        printTypeOptions.value = res.data || [];
    } catch (err) {
        console.error('加载打印模板失败', err);
        smartAlert('加载打印模板失败，请重试', false);
    }
};


/*-----------------------------------------
  打印份数输入限制 1 - 100
-----------------------------------------*/
const handlePrintQtyInput = (e) => {
    let s = String(e || '').replace(/[^\d]/g, '');

    if (!s) {
        printForm.value.printQty = '';
    } else {
        const num = Number(s);
        printForm.value.printQty = Math.max(1, Math.min(100, num));
    }
};


/*-----------------------------------------
  点击“确认”触发打印
-----------------------------------------*/
const handlePrintConfirm = async () => {
    // 验证：当需要打印格式时必须选择
    if (props.showPrintFormat && !printForm.value.templateName) {
        smartAlert('请选择打印格式', false);
        return;
    }

    // 若没有外部固定打印范围，且组件被 disabled，则默认按勾选
    if (props.printRangeValue === null && props.disabled) {
        printForm.value.type = 1;
    }

    // 组装 api 参数：按勾选 or 按条件
    const apiParams = ref({});
    if (printForm.value.type === 1) {
        if (props.selectionRows.length === 0) {
            smartAlert('请选择要打印的数据！', true, 1000);
            return;
        }
        apiParams.value = props.disabled
            ? { id: props.selectionRows.map(item => item.id)[0] }
            : { idList: props.selectionRows.map(item => item.id) };
    } else {
        apiParams.value = { ...props.initValues };
    }

    // 合并可选参数：printQty / templateId
    const baseParams = {};
    if (props.showPrintQty) {
        const qty = Number(printForm.value.printQty) || Number(props.defaultPrintQty) || 1;
        baseParams.printQty = Math.max(1, Math.min(100, qty));
    }
    if (props.showPrintFormat) {
        baseParams.templateId = printForm.value.templateName;
    }
    Object.assign(apiParams.value, baseParams);

    // 找到对应的打印 API
    const printApi = apiMap[props.printType];
    if (!printApi) {
        smartAlert('未找到对应的打印API', false);
        return;
    }

    // 发起请求（带 loading）
    const bodyLoading = ElLoading.service({ text: '正在生成打印文件...' });
    try {
        const res = await printApi(apiParams.value);

        // 总是提示接口返回信息
        smartAlert(res.msg, res.success, 1000);

        // 如果接口返回失败，则不做后续成功处理
        if (!res.success) {
            return;
        }

        // --- 成功处理：尊重父回调的返回值（true 表示已处理；false/undefined/throw 表示未处理） ---
        let externalHandled = false;

        if (typeof props.onPrintSuccess === 'function') {
            try {
                const maybePromise = props.onPrintSuccess(res, apiParams.value);
                // 等待异步回调（如果是 Promise）
                const ret = maybePromise && typeof maybePromise.then === 'function'
                    ? await maybePromise
                    : maybePromise;

                // 只有当父回调显式返回 true 时，视为已处理
                if (ret === true) {
                    externalHandled = true;
                } else {
                    externalHandled = false;
                }
            } catch (err) {
                // 回调异常视为未处理（这样组件会走默认行为）
                console.error('onPrintSuccess 回调执行出错：', err);
                externalHandled = false;
            }
        }

        // 如果没有外部回调，externalHandled 保持 false，组件执行默认行为
        if (!externalHandled) {
            // 默认行为：若 res.data 是 URL 字符串则打开新窗口，否则若是数组则渲染打印页面
            if (typeof res.data === 'string' && res.data) {
                window.open(res.data, '_blank');
            } else if (Array.isArray(res.data) && res.data.length > 0) {
                try {
                    openPrintWindow(res.data);
                } catch (err) {
                    console.error('openPrintWindow 执行失败', err);
                }
            }
        }

        // --- 无论外部是否处理，接口成功后都关闭弹窗并清理表单（你要求的行为） ---
        printDialogVisible.value = false;

        if (props.printRangeValue === null) printForm.value.type = '';
        if (props.showPrintFormat) printForm.value.templateName = '';
        if (props.showPrintQty) printForm.value.printQty = Number(props.defaultPrintQty) || 1;

    } catch (error) {
        console.error('打印请求失败', error);
        smartAlert('打印失败，请检查参数或联系管理员', false);
    } finally {
        bodyLoading.close();
    }
};
// 重置打印表单
const resetPrintForm = () => {
    // 重置打印范围
    if (props.printRangeValue === null) {
        printForm.value.type = '';
    } else {
        printForm.value.type = Number(props.printRangeValue);
    }

    // 重置打印格式
    if (props.showPrintFormat) {
        printForm.value.templateName = '';
    }

    // 重置打印份数
    if (props.showPrintQty) {
        printForm.value.printQty = Number(props.defaultPrintQty) || 1;
    }
};


/*-----------------------------------------
  暴露给父组件的方法
-----------------------------------------*/
defineExpose({
    openPrintDialog
});
</script>
