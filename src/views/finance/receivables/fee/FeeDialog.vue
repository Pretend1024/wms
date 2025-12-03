<template>
    <el-dialog v-model="isVisible" :title="dialogTitle" width="500px" align-center destroy-on-close
        :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">

            <el-form-item :label="orderNoLabel" prop="orderNo">
                <el-input v-model="formData.orderNo" :placeholder="`请输入系统存在的${orderNoLabel}`" :disabled="isEditMode" />
            </el-form-item>

            <el-form-item label="费用类型" prop="feeSubTypeId">
                <el-select v-model="formData.feeSubTypeId" placeholder="请选择" style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="币种" prop="currency">
                <el-select v-model="formData.currency" placeholder="请选择" style="width: 100%" :disabled="isEditMode">
                    <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="isEditMode ? '原始金额' : '金额'" prop="feeAmount">
                <el-input-number v-model="formData.feeAmount" :precision="2" :step="1" style="width: 100%"
                    :disabled="isEditMode" :controls="!isEditMode" placeholder="请输入金额" />
            </el-form-item>

            <el-form-item v-if="isEditMode" label="确认金额" prop="confirmFeeAmount">
                <el-input-number v-model="formData.confirmFeeAmount" :precision="2" :step="1" style="width: 100%"
                    placeholder="请输入确认金额" />
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
import { ref, computed, watch, reactive } from 'vue';
import { smartAlert } from '@/utils/genericMethods.js';

// --- Props ---
const props = defineProps({
    modelValue: { type: Boolean, default: false }, // 控制弹窗显示
    dialogMode: { type: String, default: 'add' },  // 'add' 或 'upd'
    initData: { type: Object, default: () => ({}) }, // 编辑时的回显数据
    feeMainTypeId: { type: Number, required: true }, // 1:入库, 2:出库, 3:仓租, 4:增值
    feeTypeOptions: { type: Array, default: () => [] },
    currencyOptions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// --- 状态与表单 ---
const formRef = ref(null);
const formData = ref({
    id: '', // 编辑时需要
    feeMainTypeId: props.feeMainTypeId,
    feeSubTypeId: '', // 对应原来的 feeTypeId
    orderNo: '',      // 统一单号字段
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

// 根据 mainType 计算单号的 Label
const orderNoLabel = computed(() => {
    const map = {
        1: '入库单号',
        2: '出库单号',
        3: '仓租单号',
        4: '增值单号'
    };
    return map[props.feeMainTypeId] || '单号';
});

const dialogTitle = computed(() => {
    const action = isEditMode.value ? '编辑' : '新增';
    const typeName = { 1: '入库', 2: '出库', 3: '仓租', 4: '增值' }[props.feeMainTypeId] || '';
    return `${action}${typeName}费用`;
});

// --- 校验规则 ---
const rules = reactive({
    orderNo: [{ required: true, message: '请输入单号', trigger: 'blur' }],
    feeSubTypeId: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    feeAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    // 编辑模式下确认金额必填
    confirmFeeAmount: [{
        required: true,
        message: '请输入确认金额',
        trigger: 'blur',
        validator: (rule, value, callback) => {
            if (isEditMode.value && (value === undefined || value === null || value === '')) {
                callback(new Error('请输入确认金额'));
            } else {
                callback();
            }
        }
    }]
});

// --- 监听器：初始化表单数据 ---
watch(() => props.modelValue, (val) => {
    if (val) {
        // 打开弹窗时重置或填充数据
        if (isEditMode.value && props.initData) {
            // 编辑模式：回显数据
            const data = JSON.parse(JSON.stringify(props.initData));
            formData.value = {
                id: data.id,
                feeMainTypeId: props.feeMainTypeId,
                // 注意：这里需要确保列表返回的字段名与这里对应，
                // 如果列表返回的是 feeTypeId，这里要赋值给 feeSubTypeId
                feeSubTypeId: data.feeTypeId || data.feeSubTypeId,
                orderNo: data.orderNo || data.inOrderNo || data.outOrderNo || data.vasOrderNo, // 兼容旧字段回显
                currency: data.currency,
                feeAmount: data.feeAmount,
                // 如果确认金额为空，默认使用原始金额
                confirmFeeAmount: data.confirmFeeAmount ? data.confirmFeeAmount : data.feeAmount,
                remark: data.remark
            };
        } else {
            // 新增模式：重置数据
            formData.value = {
                feeMainTypeId: props.feeMainTypeId,
                feeSubTypeId: '',
                orderNo: '',
                currency: 'CNY',
                feeAmount: 0,
                confirmFeeAmount: 0,
                remark: ''
            };
        }
        // 清除校验结果
        nextTick(() => formRef.value?.clearValidate());
    }
});

// --- 事件处理 ---
const handleClose = () => {
    isVisible.value = false;
};

const handleConfirm = async () => {
    if (!formRef.value) return;

    await formRef.value.validate((valid) => {
        if (valid) {
            // 构造传给后端的参数
            const submitData = { ...formData.value };

            // 如果是新增模式，不需要 id 和 confirmFeeAmount (除非后端需要默认值)
            if (!isEditMode.value) {
                delete submitData.id;
                delete submitData.confirmFeeAmount;
            } else {
                // 编辑模式，通常只需要传 id, confirmFeeAmount, remark
                // 但根据你的需求，这里直接把 formData 传出去，让父组件决定调什么接口传什么参
                // 或者在这里做清洗
            }

            emit('confirm', submitData);
        }
    });
};
</script>