<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode">
                    <el-select v-model="formData.warehouseCode" value-key="id"
                        :placeholder="getPlaceholder('warehouseCode')">
                        <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        clearable popper-class="multi-column-select">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('billNo')" prop="billNo">
                    <el-input v-model="formData.billNo" :placeholder="getPlaceholder('billNo')" />
                </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                <el-form-item :label="getLabel('trackingNo')" prop="trackingNo">
                    <el-input v-model="formData.trackingNo" :placeholder="getPlaceholder('trackingNo')" />
                </el-form-item>
            </el-col> -->
            <el-col :span="12">
                <el-form-item :label="getLabel('consumablesBarcode')" prop="consumablesBarcode">
                    <el-input v-model="formData.consumablesBarcode"
                        :placeholder="getPlaceholder('consumablesBarcode')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('quantity')" prop="quantity">
                    <el-input v-model="formData.quantity" v-intNumber :placeholder="getPlaceholder('quantity')" />
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
    },
    consumablesOptions: {
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
        { required: true, message: '请选择耗材类型', trigger: 'change' }
    ],
    consumablesBarcode: [
        { required: true, message: '请输入耗材条码', trigger: 'blur' }
    ],
    billNo: [
        { required: true, message: '请输入入库单号', trigger: 'blur' }
    ],
    // trackingNo: [
    //     { required: true, message: '请输入跟踪单号', trigger: 'blur' },
    //     { pattern: /^\S+$/, message: '跟踪单号不能为空格', trigger: 'blur' }
    // ],
    quantity: [
        { required: true, message: '请输入库存数量', trigger: 'blur' }
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
</style>