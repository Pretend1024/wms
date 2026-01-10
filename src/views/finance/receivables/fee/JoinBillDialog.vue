<template>
    <el-dialog v-model="isVisible" title="加入账单" width="550px" align-center :before-close="handleClose"
        :close-on-click-modal="false">
        <el-form label-width="110px" :model="form" ref="formRef">
            <el-form-item label="加入范围:">
                <el-radio-group v-model="form.scope" @change="handleScopeChange">
                    <el-radio label="selection">按勾选 ({{ selectionRows.length }}条)</el-radio>
                    <el-radio label="condition">按当前查询条件</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="加入方式:">
                <el-radio-group v-model="form.method" @change="handleMethodChange"
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

    <el-dialog v-model="resultVisible" title="操作结果" width="700px" align-center :before-close="handleResultClose"
        append-to-body>
        <div style="margin-bottom: 15px;">
            <el-alert title="账单处理成功" type="success" show-icon :closable="false" />
        </div>

        <el-table :data="resultData" border stripe style="width: 100%" max-height="400">
            <el-table-column prop="billNo" label="账单号" min-width="180" />
            <el-table-column prop="customerCode" label="客户代码" width="120" />
            <el-table-column prop="currency" label="币种" width="80" align="center" />
            <el-table-column prop="totalFeeAmount" label="总金额" width="120" align="right">
                <template #default="{ row }">
                    {{ Number(row.totalFeeAmount).toFixed(3) }}
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <el-button type="primary" @click="handleResultClose">我知道了</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getBillNosByCustomerAndCurrencyApi, joinBillApi } from '@/api/financeApi/receivables.js';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    selectionRows: { type: Array, default: () => [] },
    searchParams: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'success']);

const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

// 状态定义
const resultVisible = ref(false);
const resultData = ref([]);
const form = ref({ scope: 'selection', method: 1, targetBillNo: '' });
const submitting = ref(false);
const billLoading = ref(false);
const billOptions = ref([]);
const billNoError = ref('');

// --- 校验逻辑 ---
const consistencyCheck = computed(() => {
    let customerCode = '';
    let currency = '';

    if (form.value.scope === 'selection') {
        if (props.selectionRows.length === 0) return { isValid: false, message: '请先勾选数据' };
        const firstRow = props.selectionRows[0];
        customerCode = firstRow.customerCode;
        currency = firstRow.currency;

        if (!customerCode || !currency) return { isValid: false, message: '勾选的数据缺少客户或币种信息' };

        const isConsistent = props.selectionRows.every(row =>
            row.customerCode === customerCode && row.currency === currency
        );
        if (!isConsistent) return { isValid: false, message: '勾选的数据包含不同的客户或币种，无法加入账单' };
    } else {
        customerCode = props.searchParams.customerCode;
        currency = props.searchParams.currency;
        if (!customerCode || !currency) return { isValid: false, message: '当前搜索条件未包含“客户”和“币种”' };
    }

    return { isValid: true, message: '', params: { customerCode, currency } };
});

// --- 数据获取逻辑 ---
const fetchBillList = async () => {
    // 只有当方式是“加入现有账单” 且 校验通过时，才真正请求接口
    if (form.value.method === 1 && consistencyCheck.value.isValid) {
        billLoading.value = true;
        try {
            const { customerCode, currency } = consistencyCheck.value.params;
            const res = await getBillNosByCustomerAndCurrencyApi({ customerCode, currency });
            billOptions.value = (res.success && Array.isArray(res.data)) ? res.data : [];
        } catch (e) {
            console.error(e);
            billOptions.value = [];
        } finally {
            billLoading.value = false;
        }
    } else {
        billOptions.value = [];
    }
};

// --- 监听弹窗打开---
watch(() => props.modelValue, (val) => {
    if (val) {
        // 1. 重置表单状态
        form.value = {
            // 如果有勾选优先选 Selection，否则 Condition
            scope: props.selectionRows.length > 0 ? 'selection' : 'condition',
            method: 1,
            targetBillNo: ''
        };
        billOptions.value = [];
        billNoError.value = '';
        resultVisible.value = false;
        resultData.value = [];

        // 2. 弹窗打开后，立即尝试获取一次账单列表
        nextTick(() => {
            fetchBillList();
        });
    }
});

// --- 事件处理---
const handleScopeChange = () => {
    form.value.targetBillNo = '';
    billNoError.value = '';
};

const handleMethodChange = () => {
    billNoError.value = '';
};

const handleClose = () => {
    isVisible.value = false;
};

// --- 提交逻辑 ---
const handleConfirm = async () => {
    billNoError.value = '';
    if (form.value.scope === 'selection' && props.selectionRows.length === 0) return smartAlert('请先勾选数据', false);
    if (form.value.method === 1) {
        if (!consistencyCheck.value.isValid) return smartAlert(consistencyCheck.value.message, false);
        if (!form.value.targetBillNo) { billNoError.value = '请选择目标账单号'; return; }
    }

    const params = {
        option: form.value.method,
        billIdNo: form.value.targetBillNo,
        queryCondition: {}
    };

    if (form.value.scope === 'selection') {
        params.queryCondition.idList = props.selectionRows.map(item => item.id);
    } else {
        params.queryCondition = { ...trimObjectStrings(props.searchParams) };
    }

    submitting.value = true;
    try {
        const res = await joinBillApi(params);
        if (res.success) {
            isVisible.value = false;
            resultData.value = res.data || [];
            resultVisible.value = true;
        } else {
            smartAlert(res.msg, false);
        }
    } catch (e) {
        console.error(e);
        smartAlert('操作异常', false);
    } finally {
        submitting.value = false;
    }
};

const handleResultClose = () => {
    resultVisible.value = false;
    emit('success');
};
</script>