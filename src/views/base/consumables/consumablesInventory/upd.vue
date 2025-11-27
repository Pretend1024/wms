<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('consumablesName')">
                    <el-input v-model="formData.consumablesName" disabled
                        :placeholder="getPlaceholder('consumablesName')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('consumablesCode')">
                    <el-input v-model="formData.consumablesCode" disabled
                        :placeholder="getPlaceholder('consumablesCode')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type="textarea" v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    warehouseOptions: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);

const rules = {
    customerCode: [
        { required: true, message: '请输入客户代码', trigger: 'change' }
    ],
    warehouseCode: [
        { required: true, message: '请输入仓库代码', trigger: 'change' }
    ],
    consumablesName: [
        { required: true, message: '请输入耗材名称', trigger: 'blur' }
    ],
    consumablesCode: [
        { required: true, message: '请输入耗材代码', trigger: 'blur' }
    ],
    consumablesBarcode: [
        { required: true, message: '请输入耗材条码', trigger: 'blur' }
    ],
    quantity: [
        { required: true, message: '请输入库存数量', trigger: 'blur' }
    ]
};

// 筛选客户代码
const customerOptions = ref([]);
const handleFilter = async (query) => {
    const result = await getCustomerLikeQueryApi({ keyword: query });
    // 过滤出需要显示的选项
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '-' + item.name
    }))
};
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
</style>