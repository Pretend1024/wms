<template>
    <el-dialog v-model="isVisible" :title="dialogTitle" width="500px" align-center destroy-on-close
        :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">

            <el-form-item :label="orderNoLabel" prop="orderNo">
                <el-input v-model="formData.orderNo"
                    :placeholder="t('finance_receivables_fee_list.inputExistOrderNo', { orderNoLabel })"
                    :disabled="isEditMode" />
            </el-form-item>

            <el-form-item v-if="!isFixedMainType" :label="t('finance_receivables_fee_list.feeMainType')"
                prop="feeMainTypeId">
                <el-select v-model="formData.feeMainTypeId"
                    :placeholder="t('finance_receivables_fee_list.selectFeeMainType')" style="width: 100%"
                    :disabled="isEditMode" @change="handleMainTypeChange">
                    <el-option v-for="item in feeMainTypeOptions" :key="item.value" :label="item.label"
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
import { useI18n } from 'vue-i18n'; // 引入i18n
import { getFeeMainTypeEnumApi, getFeeTypeEnumApi } from '@/api/financeApi/receivables.js';

// 初始化i18n
const { t } = useI18n();

// --- Props ---
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    dialogMode: { type: String, default: 'add' },  // 'add' 或 'upd'
    initData: { type: Object, default: () => ({}) },
    feeMainTypeId: { type: Number, default: null }, // 不再必传，如果传了则固定，没传则显示下拉
    feeTypeOptions: { type: Array, default: () => [] }, // 如果固定了MainType，这个由父组件传；否则内部获取
    currencyOptions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// --- 状态 ---
const formRef = ref(null);
// 内部维护的选项数据（用于 feeMainTypeId 为空的情况）
const feeMainTypeOptions = ref([]);
const dynamicFeeTypeOptions = ref([]);

const formData = ref({
    id: '',
    feeMainTypeId: '',
    feeSubTypeId: '',
    expression: '', // 新增 expression 字段
    orderNo: '',
    currency: 'CNY',
    feeAmount: 0,
    confirmFeeAmount: 0,
    remark: ''
});

// --- 计算属性 ---
const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const isEditMode = computed(() => props.dialogMode === 'upd');

// 是否是固定大类模式 (即 props 传了值)
const isFixedMainType = computed(() => props.feeMainTypeId !== null && props.feeMainTypeId !== undefined);

// 当前使用的小类选项列表
const currentFeeTypeOptions = computed(() => {
    // 如果是固定大类模式，优先使用父组件传入的 options
    if (isFixedMainType.value) {
        return props.feeTypeOptions;
    }
    // 否则使用内部动态获取的 options
    return dynamicFeeTypeOptions.value;
});

// 计算单号 Label（国际化改造）
const orderNoLabel = computed(() => {
    // 优先使用当前表单选中的大类ID，如果没选则回退到 props，再没选显示"关联单号"
    const currentId = formData.value.feeMainTypeId || props.feeMainTypeId;
    const labelMap = {
        1: t('finance_receivables_fee_list.inboundOrderNo'),
        2: t('finance_receivables_fee_list.outboundOrderNo'),
        3: t('finance_receivables_fee_list.storageRentOrderNo'),
        4: t('finance_receivables_fee_list.valueAddedOrderNo')
    };
    return labelMap[currentId] || t('finance_receivables_fee_list.relatedOrderNo');
});

// 弹窗标题（国际化改造）
const dialogTitle = computed(() => {
    const action = isEditMode.value ? t('finance_receivables_fee_list.edit') : t('finance_receivables_fee_list.add');
    const currentId = formData.value.feeMainTypeId || props.feeMainTypeId;
    const typeNameMap = {
        1: t('finance_receivables_fee_list.inbound'),
        2: t('finance_receivables_fee_list.outbound'),
        3: t('finance_receivables_fee_list.storageRent'),
        4: t('finance_receivables_fee_list.valueAdded')
    };
    const typeName = typeNameMap[currentId] || '';
    const feeText = t('finance_receivables_fee_list.fee');
    return `${action}${typeName}${feeText}`;
});

// --- 校验规则（国际化改造） ---
const rules = reactive({
    orderNo: [{ required: true, message: t('finance_receivables_fee_list.inputOrderNo'), trigger: 'blur' }],
    feeMainTypeId: [{ required: true, message: t('finance_receivables_fee_list.selectFeeMainType'), trigger: 'change' }],
    feeSubTypeId: [{ required: true, message: t('finance_receivables_fee_list.pleaseSelect'), trigger: 'change' }],
    currency: [{ required: true, message: t('finance_receivables_fee_list.pleaseSelect'), trigger: 'change' }],
    feeAmount: [{ required: true, message: t('finance_receivables_fee_list.inputAmount'), trigger: 'blur' }],
});

// --- 方法 ---

// 获取大类字典
const getFeeMainTypes = async () => {
    if (feeMainTypeOptions.value.length > 0) return;
    try {
        const res = await getFeeMainTypeEnumApi();
        feeMainTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
    } catch (e) {
        console.error(e);
    }
};

// 大类改变时获取小类
const handleMainTypeChange = async (val) => {
    formData.value.feeSubTypeId = ''; // 清空已选小类
    dynamicFeeTypeOptions.value = [];
    if (val) {
        try {
            const res = await getFeeTypeEnumApi({ mainTypeId: val });
            dynamicFeeTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
        } catch (e) {
            console.error(e);
        }
    }
};

// --- 监听器 ---
watch(() => props.modelValue, async (val) => {
    if (val) {
        // 1. 如果不是固定模式，获取大类下拉数据
        if (!isFixedMainType.value) {
            await getFeeMainTypes();
        }

        // 2. 初始化表单数据
        if (isEditMode.value && props.initData) {
            const data = JSON.parse(JSON.stringify(props.initData));

            // 确定当前的大类ID：优先取 props，没有则取回显数据
            const currentMainTypeId = isFixedMainType.value ? props.feeMainTypeId : (data.feeMainTypeId || data.feeMainType);

            // 如果是非固定模式且有大类ID，需要先请求小类列表，以便回显
            if (!isFixedMainType.value && currentMainTypeId) {
                try {
                    const res = await getFeeTypeEnumApi({ mainTypeId: currentMainTypeId });
                    dynamicFeeTypeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
                } catch (e) { console.error(e) }
            }

            formData.value = {
                id: data.id,
                feeMainTypeId: currentMainTypeId,
                feeSubTypeId: data.feeTypeId || data.feeSubTypeId,
                expression: data.expression || '', // 回显 expression
                orderNo: data.orderNo || data.inOrderNo || data.outOrderNo || data.vasOrderNo,
                currency: data.currency,
                feeAmount: data.feeAmount,
                confirmFeeAmount: data.confirmFeeAmount !== undefined ? data.confirmFeeAmount : data.feeAmount,
                remark: data.remark
            };
        } else {
            // 新增模式
            formData.value = {
                feeMainTypeId: isFixedMainType.value ? props.feeMainTypeId : '',
                feeSubTypeId: '',
                expression: '', // 重置 expression
                orderNo: '',
                currency: 'CNY',
                feeAmount: 0,
                confirmFeeAmount: 0,
                remark: ''
            };
            // 新增时清空动态的小类列表
            if (!isFixedMainType.value) {
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
            if (!isEditMode.value) {
                delete submitData.id;
                delete submitData.confirmFeeAmount;
            }
            emit('confirm', submitData);
        }
    });
};
</script>