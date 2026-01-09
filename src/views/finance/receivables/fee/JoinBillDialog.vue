<template>
    <el-dialog v-model="isVisible" title="加入账单" width="550px" align-center :before-close="handleClose">
        <el-form label-width="110px" :model="form" ref="formRef">
            <el-form-item label="加入范围:">
                <el-radio-group v-model="form.scope" @change="handleScopeChange">
                    <el-radio label="selection">按勾选 ({{ selectionRows.length }}条)</el-radio>
                    <el-radio label="condition">按当前查询条件</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="加入方式:">
                <el-radio-group v-model="form.method"
                    style="display: flex; flex-direction: column; align-items: flex-start;">
                    <el-radio :label="1" style="margin-bottom: 5px;">加入现有账单</el-radio>
                    <el-radio :label="2" style="margin-bottom: 5px;">自动创建新账单</el-radio>
                    <el-radio :label="3">自动加入未付款账单</el-radio>
                </el-radio-group>
            </el-form-item>

            <template v-if="form.method === 1">
                <el-form-item label="账单号:" required :error="billNoError">
                    <el-select v-model="form.targetBillNo" placeholder="请选择或搜索账单号" filterable clearable
                        :disabled="!consistencyCheck.isValid" :loading="billLoading" style="width: 100%">
                        <el-option v-for="billNo in billOptions" :key="billNo" :label="billNo" :value="billNo" />
                    </el-select>
                    <div v-if="!consistencyCheck.isValid"
                        style="color: #f56c6c; font-size: 12px; line-height: 1.5; margin-top: 5px;">
                        <el-icon style="vertical-align: middle; margin-right: 2px;">
                            <Warning />
                        </el-icon>
                        {{ consistencyCheck.message }}
                    </div>
                </el-form-item>
            </template>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm" :loading="submitting">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getBillNosByCustomerAndCurrencyApi, joinBillApi } from '@/api/financeApi/receivables.js';

const props = defineProps({
    modelValue: { // v-model 控制显示隐藏
        type: Boolean,
        default: false
    },
    selectionRows: { // 勾选的行数据对象数组
        type: Array,
        default: () => []
    },
    searchParams: { // 当前搜索条件对象
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:modelValue', 'success']);

const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

// 表单数据
const form = ref({
    scope: 'selection',
    method: 1,
    targetBillNo: ''
});

// 状态控制
const submitting = ref(false);
const billLoading = ref(false);
const billOptions = ref([]); // 账单下拉选项
const billNoError = ref(''); // 手动控制表单错误信息

// ------------------- 核心逻辑：一致性校验 -------------------
/**
 * 校验当前范围（勾选 or 条件）下的数据是否满足“单一客户”且“单一币种”
 * 返回：{ isValid: boolean, message: string, params: { customerCode, currency } }
 */
const consistencyCheck = computed(() => {
    let customerCode = '';
    let currency = '';

    // 情况 A: 按勾选
    if (form.value.scope === 'selection') {
        if (props.selectionRows.length === 0) {
            return { isValid: false, message: '请先勾选数据' };
        }

        const firstRow = props.selectionRows[0];
        customerCode = firstRow.customerCode;
        currency = firstRow.currency;

        // 校验是否缺失
        if (!customerCode || !currency) {
            return { isValid: false, message: '勾选的数据缺少客户或币种信息' };
        }

        // 遍历校验一致性
        const isConsistent = props.selectionRows.every(row =>
            row.customerCode === customerCode && row.currency === currency
        );

        if (!isConsistent) {
            return { isValid: false, message: '勾选的数据包含不同的客户或币种，无法加入现有账单' };
        }
    }
    // 情况 B: 按查询条件
    else {
        customerCode = props.searchParams.customerCode;
        currency = props.searchParams.currency;

        if (!customerCode || !currency) {
            return { isValid: false, message: '当前搜索条件未包含“客户”和“币种”，无法加入现有账单' };
        }
    }

    return {
        isValid: true,
        message: '',
        params: { customerCode, currency }
    };
});

// ------------------- 监听逻辑 -------------------

// 监听弹窗打开，初始化表单
watch(() => props.modelValue, (val) => {
    if (val) {
        form.value = {
            scope: props.selectionRows.length > 0 ? 'selection' : 'condition',
            method: 1,
            targetBillNo: ''
        };
        billOptions.value = [];
        billNoError.value = '';
    }
});

// 监听 method, scope 以及一致性检查结果，自动获取账单号
watch(
    [() => form.value.method, () => form.value.scope, () => consistencyCheck.value],
    async ([newMethod], [oldMethod]) => {
        // 只有当选择了“加入现有账单”且校验通过时，才请求接口
        if (newMethod === 1 && consistencyCheck.value.isValid) {
            await fetchBillNos();
        } else {
            // 如果条件不满足或切换了方式，清空选项和当前值
            billOptions.value = [];
            if (newMethod === 1) { // 仅在保留在方式1时清空值，防止切换tab丢失数据体验不好，可根据需求调整
                // form.value.targetBillNo = ''; 
            }
        }
    },
    { deep: true, immediate: false }
);

const handleScopeChange = () => {
    form.value.targetBillNo = ''; // 切换范围时清空已选账单
    billNoError.value = '';
};

// ------------------- 接口调用 -------------------

// 获取账单号列表
const fetchBillNos = async () => {
    billLoading.value = true;
    try {
        const { customerCode, currency } = consistencyCheck.value.params;
        const res = await getBillNosByCustomerAndCurrencyApi({
            customerCode,
            currency
        });

        if (res.success && Array.isArray(res.data)) {
            billOptions.value = res.data;
        } else {
            billOptions.value = [];
        }
    } catch (e) {
        console.error(e);
        billOptions.value = [];
    } finally {
        billLoading.value = false;
    }
};

const handleClose = () => {
    isVisible.value = false;
};

// 提交确认
const handleConfirm = async () => {
    billNoError.value = '';

    // 1. 基础校验
    if (form.value.scope === 'selection' && props.selectionRows.length === 0) {
        return smartAlert('请先勾选数据', false);
    }

    // 方式1的特殊校验
    if (form.value.method === 1) {
        if (!consistencyCheck.value.isValid) {
            return smartAlert(consistencyCheck.value.message, false);
        }
        if (!form.value.targetBillNo) {
            billNoError.value = '请选择目标账单号';
            return;
        }
    }

    // 2. 组装参数
    const params = {
        option: form.value.method,
        billIdNo: form.value.targetBillNo,
        queryCondition: {}
    };

    if (form.value.scope === 'selection') {
        params.queryCondition.idList = props.selectionRows.map(item => item.id);
    } else {
        // 使用传入的 searchParams，并去除空值字符串
        params.queryCondition = { ...trimObjectStrings(props.searchParams) };
    }

    // 3. 调用接口 (移入组件内部)
    submitting.value = true;
    try {
        const res = await joinBillApi(params);
        smartAlert(res.msg, res.success, 1000, true);

        if (res.success) {
            isVisible.value = false;
            emit('success'); // 通知父组件刷新数据
        }
    } catch (e) {
        console.error(e);
        smartAlert('操作异常', false);
    } finally {
        submitting.value = false;
    }
};
</script>