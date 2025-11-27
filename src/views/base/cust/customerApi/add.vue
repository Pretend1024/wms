<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        popper-class="multi-column-select" clearable>
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('apiTypeId')" prop="apiTypeId">
                    <el-select v-model="formData.apiTypeId" :placeholder="getPlaceholder('apiTypeId')">
                        <el-option v-for="item in customerApiType" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('toUsToken')" prop="toUsToken">
                    <el-input v-model="formData.toUsToken" :placeholder="getPlaceholder('toUsToken')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('toUsSecretKey')" prop="toUsSecretKey">
                    <el-input v-model="formData.toUsSecretKey" :placeholder="getPlaceholder('toUsSecretKey')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('sysName')" prop="sysName">
                    <el-input v-model="formData.sysName" :placeholder="getPlaceholder('sysName')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('toCUrl')" prop="toCUrl">
                    <el-input v-model="formData.toCUrl" :placeholder="getPlaceholder('toCUrl')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('toCToken')" prop="toCToken">
                    <el-input v-model="formData.toCToken" :placeholder="getPlaceholder('toCToken')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('toCSecretKey')" prop="toCSecretKey">
                    <el-input v-model="formData.toCSecretKey" :placeholder="getPlaceholder('toCSecretKey')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('onlineTime')" prop="onlineTime">
                    <el-date-picker v-model="formData.onlineTime" type="datetime"
                        :placeholder="getPlaceholder('onlineTime')" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('extend1')">
                    <el-input v-model="formData.extend1" :placeholder="getPlaceholder('extend1')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('extend2')">
                    <el-input v-model="formData.extend2" :placeholder="getPlaceholder('extend2')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    customerApiType: {
        type: Array,
        required: true
    },
    companyOptions: {
        type: Array,
        required: true
    },
});

const formRef = ref(null);

const rules = {
    apiTypeId: [
        { required: true, message: '请选择接口类型', trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请输入客户代码', trigger: 'change' }
    ],
    onlineTime: [
        { required: true, message: '请选择上线时间', trigger: 'change' }
    ],
    sysName: [
        { required: true, message: '请输入客户系统名', trigger: 'blur' }
    ],
    toCUrl: [
        { required: true, message: '请输入客户API地址', trigger: 'blur' }
    ],
    toCSecretKey: [
        { required: true, message: '请输入客户API密钥', trigger: 'blur' }
    ],
    toCToken: [
        { required: true, message: '请输入客户API令牌', trigger: 'blur' }
    ],
    toUsSecretKey: [
        { required: true, message: '请输入我方API密钥', trigger: 'blur' }
    ],
    toUsToken: [
        { required: true, message: '请输入我方API密钥', trigger: 'blur' }
    ]
};
// 筛选客户代码
const customerOptions = ref([]);
onMounted(async () => {
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
})

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>

<style scoped>
:deep(.el-cascader) {
    width: 100%;
}

:deep(.el-input) {
    width: 100%;
}
</style>