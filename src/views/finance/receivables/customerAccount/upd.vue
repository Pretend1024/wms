<template>
    <el-form :model="formData" ref="formRef" label-width="100px">
        <el-row>
            <!-- 客户代码 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('customerCode')">
                    <el-select v-model="formData.customerCode" filterable clearable popper-class="multi-column-select"
                        :disabled="isDisabled">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- 币种代码 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('currency')">
                    <el-select v-model="formData.currency" clearable :disabled="isDisabled">
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- 余额-->
            <el-col :span="24">
                <el-form-item :label="getLabel('balance')">
                    <el-input v-model.number="formData.balance" type="number" :min="0" :readonly="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 信用额度-->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditAmount')">
                    <el-input v-model.number="formData.creditAmount" type="number" :min="0" :readonly="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 已使用授信额度 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('usedCredit')">
                    <el-input v-model.number="formData.usedCredit" type="number" :min="0" :readonly="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 超额使用额度 -->
            <el-col :span="24" v-if="isDisabled">
                <el-form-item :label="getLabel('overCreditAmount')">
                    <el-input v-model.number="formData.overCreditAmount" type="number" :min="0"
                        :readonly="isDisabled" />
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
    },
    isDisabled: {
        type: Boolean,
        default: false
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

onMounted(async () => {
    if (Object.keys(props.initData).length > 0) {
        formData.value = {
            ...formData.value,
            ...{
                customerCode: props.initData.customerCode || '',
                currency: props.initData.currency || '',
                balance: props.initData.balance || 0,
                creditAmount: props.initData.creditAmount || 0,
                usedCredit: props.initData.usedCredit || 0,
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