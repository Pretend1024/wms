<template>
    <el-dialog v-model="isVisible" :title="dialogTitle" width="500px" align-center destroy-on-close
        :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">

            <el-form-item :label="orderNoLabel" prop="orderNo">
                <el-input v-model="formData.orderNo" :placeholder="`请输入系统存在的${orderNoLabel}`" :disabled="isEditMode" />
            </el-form-item>

            <el-form-item v-if="!isFixedMainType" label="费用大类" prop="feeMainTypeId">
                <el-select v-model="formData.feeMainTypeId" placeholder="请选择费用大类" style="width: 100%"
                    :disabled="isEditMode" @change="handleMainTypeChange">
                    <el-option v-for="item in feeMainTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="费用小类" prop="feeSubTypeId">
                <el-select v-model="formData.feeSubTypeId" placeholder="请选择" style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in currentFeeTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="金额计算公式" prop="expression">
                <el-input v-model="formData.expression" placeholder="请输入金额计算公式" :disabled="isEditMode" />
            </el-form-item>

            <el-form-item label="币种" prop="currency">
                <el-select v-model="formData.currency" placeholder="请选择" style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="isEditMode ? '原始金额' : '金额'" prop="feeAmount">
                <el-input v-model="formData.feeAmount" v-number="3" style="width: 100%" :disabled="isEditMode"
                    :controls="!isEditMode" placeholder="请输入金额" />
            </el-form-item>

            <el-form-item v-if="isEditMode" label="确认金额">
                <el-input v-model="formData.confirmFeeAmount" v-number="3" style="width: 100%" placeholder="请输入确认金额" />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch, reactive, nextTick } from 'vue';
import { getFeeMainTypeEnumApi, getFeeTypeEnumApi } from '@/api/financeApi/receivables.js';

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

// 计算单号 Label
const orderNoLabel = computed(() => {
    // 优先使用当前表单选中的大类ID，如果没选则回退到 props，再没选显示"单号"
    const currentId = formData.value.feeMainTypeId || props.feeMainTypeId;
    const map = {
        1: '入库单号',
        2: '出库单号',
        3: '仓租单号',
        4: '增值单号'
    };
    return map[currentId] || '关联单号';
});

const dialogTitle = computed(() => {
    const action = isEditMode.value ? '编辑' : '新增';
    const currentId = formData.value.feeMainTypeId || props.feeMainTypeId;
    const typeName = { 1: '入库', 2: '出库', 3: '仓租', 4: '增值' }[currentId] || '';
    return `${action}${typeName}费用`;
});

// --- 校验规则 ---
const rules = reactive({
    orderNo: [{ required: true, message: '请输入单号', trigger: 'blur' }],
    feeMainTypeId: [{ required: true, message: '请选择费用大类', trigger: 'change' }],
    feeSubTypeId: [{ required: true, message: '请选择费用小类', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    feeAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
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