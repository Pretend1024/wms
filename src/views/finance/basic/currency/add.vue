<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <!-- 币种代码 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" :placeholder="getPlaceholder('currency')" clearable>
                        <el-option v-for="item in currencyEnum" :key="item.code" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 汇率-->
            <el-col :span="24">
                <el-form-item :label="getLabel('rate')" prop="rate">
                    <el-input v-model.number="formData.rate" :placeholder="getPlaceholder('rate')" type="number"
                        @input="handleInput" :min="0" :step="0.0001" />
                </el-form-item>
            </el-col>

            <!-- 是否本位币-->
            <el-col :span="24">
                <el-form-item :label="getLabel('isStandardCurrency')" prop="isStandardCurrency">
                    <el-select v-model="formData.isStandardCurrency" :placeholder="getPlaceholder('isStandardCurrency')"
                        clearable disabled>
                        <el-option :label="$t('yes')" :value="true" />
                        <el-option :label="$t('no')" :value="false" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 备注-->
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea"
                        rows="2" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';

const props = defineProps({
    initData: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

// 表单数据：仅保留接口要求的4个参数
const formData = ref({
    currency: '',          // 币种代码
    rate: 0,               // 汇率
    isStandardCurrency: false,// 是否本位币
    remark: ''             // 备注
});

const formRef = ref(null);
const handleInput = (value) => {
    if (value === null || value === '' || isNaN(Number(value))) {
        this.formData.rate = null;
        return;
    }
    let str = value.toString();
    const dotIndex = str.indexOf('.');

    if (dotIndex !== -1) {
        str = str.substring(0, dotIndex + 5);
    }

    const handledValue = Number(str);
    formData.value.rate = handledValue < 0 ? 0 : handledValue;
};
// 表单校验规则：严格匹配接口要求
const rules = {
    currency: [
        { required: true, message: '请选择币种代码', trigger: 'change' },
    ],
    rate: [
        { required: true, message: '请输入汇率', trigger: 'change' },
    ],
    isStandardCurrency: [
        { required: true, message: '请选择是否本位币', trigger: 'change' },
    ]
};
// 币种选项获取
const currencyEnum = ref([]);
// 页面挂载：获取币种选项 + 回显初始化数据
onMounted(async () => {
    const res = await getCurrencyEnumApi();
    currencyEnum.value = res.data;
    if (Object.keys(props.initData).length > 0) {
        formData.value = { ...formData.value, ...props.initData };
    }
});

// 对外暴露方法：保留表单验证、重置、数据获取能力
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