<template>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="出库单号" prop="inOrderNo">
            <el-input v-model="formData.inOrderNo" disabled placeholder="出库单号" />
        </el-form-item>

        <el-form-item label="费用类型" prop="feeTypeId">
            <el-select v-model="formData.feeTypeId" disabled placeholder="请选择">
                <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>

        <el-form-item label="币种" prop="currency">
            <el-select v-model="formData.currency" disabled placeholder="请选择">
                <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>

        <el-form-item label="原始金额" prop="feeAmount">
            <el-input v-model="formData.feeAmount" :precision="2" disabled :controls="false" />
        </el-form-item>

        <el-form-item label="确认金额" prop="confirmFeeAmount">
            <el-input v-model="formData.confirmFeeAmount" v-number placeholder="请输入确认金额" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, defineExpose, defineProps, watch } from 'vue';

// 接收父组件传递的参数
const props = defineProps({
    initData: {
        type: Object,
        default: () => ({})
    },
    feeTypeOptions: {
        type: Array,
        default: () => []
    },
    currencyOptions: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);
const formData = ref({
    id: '',
    inOrderNo: '',
    feeTypeId: '',
    currency: '',
    feeAmount: 0,
    confirmFeeAmount: 0,
    remark: ''
});

// 校验规则 (虽然大部分只读，但确认金额可能需要校验)
const rules = {
    confirmFeeAmount: [{ required: true, message: '请输入确认金额', trigger: 'blur' }]
};

// 监听回显数据
watch(() => props.initData, (newVal) => {
    if (newVal) {
        // 深拷贝数据
        formData.value = JSON.parse(JSON.stringify(newVal));

        // 业务逻辑优化：如果确认金额为0或空，默认填充为原始金额，方便用户直接确认
        if (!formData.value.confirmFeeAmount && formData.value.feeAmount) {
            formData.value.confirmFeeAmount = formData.value.feeAmount;
        }
    }
}, { immediate: true, deep: true });

// 暴露给父组件的方法
const validate = () => formRef.value.validate();
const getFormData = () => formData.value;
const resetFields = () => formRef.value.resetFields();

defineExpose({ validate, getFormData, resetFields });
</script>