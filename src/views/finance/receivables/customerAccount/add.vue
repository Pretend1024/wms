<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <!-- 客户代码 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        clearable popper-class="multi-column-select">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- 币种代码 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" :placeholder="getPlaceholder('currency')" clearable>
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 余额-->
            <el-col :span="24">
                <el-form-item :label="getLabel('balance')" prop="balance">
                    <el-input v-model.number="formData.balance" :placeholder="getPlaceholder('balance')" type="number"
                        :min="0" disabled />
                </el-form-item>
            </el-col>
            <!-- 信用额度-->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditAmount')" prop="creditAmount">
                    <el-input v-model.number="formData.creditAmount" :placeholder="getPlaceholder('creditAmount')"
                        type="number" :min="0" disabled />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';

const props = defineProps({
    initData: {
        type: Object,
        required: false,
        default: () => ({})
    },
    customerOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    nationOptions: {
        type: Array,
        required: true,
        default: () => []
    }
});

// 表单数据
const formData = ref({
    customerCode: '',      // 客户代码
    currency: '',          // 币种代码
    balance: 0,            // 余额
    creditAmount: 0        // 信用额度
});

const formRef = ref(null);


// 表单校验规则：移除无关字段，只保留模板中存在的必填项
const rules = {
    currency: [
        { required: true, message: '请选择币种代码', trigger: 'change' },
    ],
    balance: [
        { required: true, message: '请输入余额', trigger: 'change' },
    ],
    customerCode: [
        { required: true, message: '请选择客户代码', trigger: 'change' },
    ],
    creditAmount: [
        { required: true, message: '请输入信用额度', trigger: 'change' },
    ]
};

onMounted(async () => {
    if (Object.keys(props.initData).length > 0) {
        formData.value = {
            ...formData.value,
            ...{
                customerCode: props.initData.customerCode || '',
                currency: props.initData.currency || '',
                balance: props.initData.balance || 0,
                creditAmount: props.initData.creditAmount || 0
            }
        };
    }
});

// 对外暴露方法：保持与表单数据一致的能力
defineExpose({
    validate: async () => {
        return await formRef.value.validate();
    },
    resetFields: () => {
        formRef.value.resetFields();
    },
    getFormData: () => {
        return formData.value;
    }
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea) {
    width: 100%;
}
</style>