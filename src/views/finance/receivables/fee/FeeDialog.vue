<template>
    <el-dialog v-model="isVisible" :title="dialogTitle" width="500px" align-center destroy-on-close
        :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">

            <el-form-item :label="orderNoLabel" prop="orderNo">
                <el-input v-model="formData.orderNo"
                    :placeholder="t('finance_receivables_fee_list.inputExistOrderNo', { orderNoLabel })"
                    :disabled="isEditMode" />
            </el-form-item>

            <el-form-item v-if="!isFixedBizType" :label="t('finance_receivables_fee_list.FeeBizType')"
                prop="feeBizTypeId">
                <el-select v-model="formData.feeBizTypeId"
                    :placeholder="t('finance_receivables_fee_list.selectFeeBizType')" style="width: 100%"
                    :disabled="isEditMode" @change="handleBizTypeChange">
                    <el-option v-for="item in feeBizTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="formData.feeBizTypeId === 99" label="仓库" prop="warehouseCode">
                <el-select v-model="formData.warehouseCode" placeholder="请选择仓库" style="width: 100%"
                    :disabled="isEditMode">
                    <el-option v-for="item in warehouseOptions" :key="item.code" :label="`${item.code}-${item.name}`"
                        :value="item.code" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="formData.feeBizTypeId === 99" label="客户" prop="customerCode">
                <el-select v-model="formData.customerCode" placeholder="请选择客户" filterable style="width: 100%"
                    :disabled="isEditMode" clearable popper-class="multi-column-select">
                    <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="t('finance_receivables_fee_list.feeSubType')" prop="feeSubTypeId">
                <el-select v-model="formData.feeSubTypeId" :placeholder="t('finance_receivables_fee_list.pleaseSelect')"
                    style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in currentFeeTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="t('finance_receivables_fee_list.amountFormula')" prop="expression">
                <el-input v-model="formData.expression"
                    :placeholder="t('finance_receivables_fee_list.inputAmountFormula')" :disabled="isEditMode" />
            </el-form-item>

            <el-form-item :label="t('finance_receivables_fee_list.currency')" prop="currency">
                <el-select v-model="formData.currency" :placeholder="t('finance_receivables_fee_list.pleaseSelect')"
                    style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item
                :label="isEditMode ? t('finance_receivables_fee_list.originalAmount') : t('finance_receivables_fee_list.amount')"
                prop="feeAmount">
                <el-input v-model="formData.feeAmount" v-number="3" style="width: 100%" :disabled="isEditMode"
                    :controls="!isEditMode" :placeholder="t('finance_receivables_fee_list.inputAmount')" />
            </el-form-item>

            <el-form-item v-if="isEditMode" :label="t('finance_receivables_fee_list.confirmAmount')">
                <el-input v-model="formData.confirmFeeAmount" v-number="3" style="width: 100%"
                    :placeholder="t('finance_receivables_fee_list.inputConfirmAmount')" />
            </el-form-item>

            <el-form-item :label="t('finance_receivables_fee_list.remark')" prop="remark">
                <el-input v-model="formData.remark" type="textarea" :rows="3"
                    :placeholder="t('finance_receivables_fee_list.inputRemark')" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">{{ t('finance_receivables_fee_list.cancel') }}</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">{{
                    t('finance_receivables_fee_list.confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch, reactive, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFeeBizTypeEnumApi, getFeeSubTypeEnumApi } from '@/api/financeApi/receivables.js';

const { t } = useI18n();

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    dialogMode: { type: String, default: 'add' },
    initData: { type: Object, default: () => ({}) },
    // 【关键修改】这里必须改名为 feeBizTypeId，因为父组件传的就是这个名字
    feeBizTypeId: { type: Number, default: null },
    feeTypeOptions: { type: Array, default: () => [] },
    currencyOptions: { type: Array, default: () => [] },
    warehouseOptions: { type: Array, default: () => [] },
    customerOptions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const formRef = ref(null);
const feeBizTypeOptions = ref([]);
const dynamicFeeTypeOptions = ref([]);

const formData = ref({
    id: '',
    feeBizTypeId: '', // 改名为 feeBizTypeId
    feeSubTypeId: '',
    expression: '',
    orderNo: '',
    warehouseCode: '', // 新增
    customerCode: '',  // 新增
    currency: 'CNY',
    feeAmount: 0,
    confirmFeeAmount: 0,
    remark: ''
});

const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const isEditMode = computed(() => props.dialogMode === 'upd');

// 【关键修改】判断是否固定类型
const isFixedBizType = computed(() => props.feeBizTypeId !== null && props.feeBizTypeId !== undefined);

const currentFeeTypeOptions = computed(() => {
    if (isFixedBizType.value) {
        return props.feeTypeOptions;
    }
    return dynamicFeeTypeOptions.value;
});

// 计算单号 Label (使用 formData.feeBizTypeId)
const orderNoLabel = computed(() => {
    const currentId = formData.value.feeBizTypeId || props.feeBizTypeId;
    const labelMap = {
        10: t('finance_receivables_fee_list.inboundOrderNo'),
        11: t('finance_receivables_fee_list.returnOrderNo'),
        20: t('finance_receivables_fee_list.outboundOrderNo'),
        30: t('finance_receivables_fee_list.storageRentOrderNo'),
        40: t('finance_receivables_fee_list.valueAddedOrderNo')
    };
    return labelMap[currentId] || t('finance_receivables_fee_list.relatedOrderNo');
});

// 弹窗标题 (使用 formData.feeBizTypeId)
const dialogTitle = computed(() => {
    const action = isEditMode.value ? t('finance_receivables_fee_list.edit') : t('finance_receivables_fee_list.add');
    const currentId = formData.value.feeBizTypeId || props.feeBizTypeId;
    const typeNameMap = {
        10: t('finance_receivables_fee_list.inbound'),
        11: t('finance_receivables_fee_list.return'),
        20: t('finance_receivables_fee_list.outbound'),
        30: t('finance_receivables_fee_list.storageRent'),
        40: t('finance_receivables_fee_list.valueAdded'),
        99: t('finance_receivables_fee_list.other')
    };
    const typeName = typeNameMap[currentId] || '';
    const feeText = t('finance_receivables_fee_list.fee');
    return `${action}${typeName}${feeText}`;
});

// 校验规则
const rules = reactive({
    orderNo: [{ required: true, message: t('finance_receivables_fee_list.inputOrderNo'), trigger: 'blur' }],
    feeBizTypeId: [{ required: true, message: t('finance_receivables_fee_list.selectFeeBizType'), trigger: 'change' }],
    feeSubTypeId: [{ required: true, message: t('finance_receivables_fee_list.pleaseSelect'), trigger: 'change' }],
    currency: [{ required: true, message: t('finance_receivables_fee_list.pleaseSelect'), trigger: 'change' }],
    feeAmount: [{ required: true, message: t('finance_receivables_fee_list.inputAmount'), trigger: 'blur' }],
    // 新增字段校验，Element会自动忽略被v-if隐藏的字段
    warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    customerCode: [{ required: true, message: '请选择客户', trigger: 'change' }]
});

// 获取大类字典
const getFeeBizTypes = async () => {
    if (feeBizTypeOptions.value.length > 0) return;
    try {
        const res = await getFeeBizTypeEnumApi();
        feeBizTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
    } catch (e) {
        console.error(e);
    }
};

// 大类改变时获取小类
const handleBizTypeChange = async (val) => {
    formData.value.feeSubTypeId = '';
    dynamicFeeTypeOptions.value = [];

    // 切换大类时，如果不是99，清空仓库和客户
    if (val !== 99) {
        formData.value.warehouseCode = '';
        formData.value.customerCode = '';
    }

    if (val) {
        try {
            // 注意：后端接口参数通常还是 feeBizTypeId
            const res = await getFeeSubTypeEnumApi({ feeBizTypeId: val });
            dynamicFeeTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
        } catch (e) {
            console.error(e);
        }
    }
};

watch(() => props.modelValue, async (val) => {
    if (val) {
        if (!isFixedBizType.value) {
            await getFeeBizTypes();
        }

        if (isEditMode.value && props.initData) {
            const data = JSON.parse(JSON.stringify(props.initData));
            // 优先使用固定ID，否则使用数据中的ID
            const currentBizTypeId = isFixedBizType.value ? props.feeBizTypeId : (data.feeBizTypeId || data.FeeBizTypeId || data.FeeBizType);

            if (!isFixedBizType.value && currentBizTypeId) {
                try {
                    const res = await getFeeSubTypeEnumApi({ feeBizTypeId: currentBizTypeId });
                    dynamicFeeTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
                } catch (e) { console.error(e) }
            }

            formData.value = {
                id: data.id,
                feeBizTypeId: currentBizTypeId,
                feeSubTypeId: data.feeTypeId || data.feeSubTypeId,
                expression: data.expression || '',
                orderNo: data.orderNo || data.inOrderNo || data.outOrderNo || data.vasOrderNo,
                warehouseCode: data.warehouseCode || '', // 回显
                customerCode: data.customerCode || '',   // 回显
                currency: data.currency,
                feeAmount: data.feeAmount,
                confirmFeeAmount: data.confirmFeeAmount !== undefined ? data.confirmFeeAmount : data.feeAmount,
                remark: data.remark
            };
        } else {
            // 新增模式
            formData.value = {
                feeBizTypeId: isFixedBizType.value ? props.feeBizTypeId : '',
                feeSubTypeId: '',
                expression: '',
                orderNo: '',
                warehouseCode: '', // 重置
                customerCode: '',  // 重置
                currency: 'CNY',
                feeAmount: 0,
                confirmFeeAmount: 0,
                remark: ''
            };
            if (!isFixedBizType.value) {
                dynamicFeeTypeOptions.value = [];
            }
        }
        nextTick(() => formRef.value?.clearValidate());
    }
});

const handleClose = () => {
    isVisible.value = false;
};

const handleConfirm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
        if (valid) {
            const submitData = { ...formData.value };
            // 后端接收参数名可能仍为 FeeBizTypeId，这里可以做一层转换，或者保持 feeBizTypeId 视后端而定
            // 如果后端需要 FeeBizTypeId，可以取消下面这行的注释：
            // submitData.FeeBizTypeId = submitData.feeBizTypeId;

            if (!isEditMode.value) {
                delete submitData.id;
                delete submitData.confirmFeeAmount;
            }
            emit('confirm', submitData);
        }
    });
};
</script>