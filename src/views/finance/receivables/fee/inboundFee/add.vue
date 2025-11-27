<template>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="入库单号" prop="inOrderNo">
            <el-input v-model="formData.inOrderNo" placeholder="请输入系统存在的入库单号" />
        </el-form-item>
        <el-form-item label="费用名称" prop="feeName">
            <el-input v-model="formData.feeName" placeholder="请输入费用名称" />
        </el-form-item>
        <el-form-item label="费用类型" prop="feeTypeId">
            <el-select v-model="formData.feeTypeId" placeholder="请选择">
                <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
            <el-select v-model="formData.currency" placeholder="请选择">
                <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="feeAmount">
            <el-input v-model="formData.feeAmount" v-number />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="3" />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, defineExpose, defineProps } from 'vue';

const props = defineProps({
    initData: Object,
    feeTypeOptions: Array,
    currencyOptions: Array
});

const formRef = ref(null);
const formData = ref({
    inOrderNo: '',
    feeName: '',
    feeTypeId: '',
    currency: '', // 默认人民币
    feeAmount: null,
    remark: ''
});

const rules = {
    inOrderNo: [{ required: true, message: '请输入入库单号', trigger: 'blur' }],
    feeTypeId: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    feeAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    feeName: [{ required: true, message: '请输入费用名称', trigger: 'blur' }]
};

// 暴露给父组件的方法
const validate = () => formRef.value.validate();
const getFormData = () => formData.value;
const resetFields = () => formRef.value.resetFields();

defineExpose({ validate, getFormData, resetFields });
</script>