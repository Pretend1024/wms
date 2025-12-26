<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('code')">
                    <el-input v-model="formData.code" disabled :placeholder="getPlaceholder('code')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" value-key="id" filterable
                        :placeholder="getPlaceholder('currency')">
                        <el-option v-for="item in nationOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('costPrice')" prop="costPrice">
                    <el-input v-model="formData.costPrice" v-number :placeholder="getPlaceholder('costPrice')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('salePrice')" prop="salePrice">
                    <el-input v-model="formData.salePrice" v-number :placeholder="getPlaceholder('salePrice')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('length')" prop="length">
                    <el-input v-model="formData.length" v-number="1" :placeholder="getPlaceholder('length')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('width')" prop="width">
                    <el-input v-model="formData.width" v-number="1" :placeholder="getPlaceholder('width')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('height')" prop="height">
                    <el-input v-model="formData.height" v-number="1" :placeholder="getPlaceholder('height')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('unitWeight')" prop="unitWeight">
                    <el-input v-model="formData.unitWeight" v-number :placeholder="getPlaceholder('unitWeight')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')">
                    <el-input v-model="formData.sortNo" v-intNumber="true" :placeholder="getPlaceholder('sortNo')" />
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
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    nationOptions: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入类型名称', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入类型代码', trigger: 'blur' }
    ],
    currency: [
        { required: true, message: '请选择币种代码', trigger: 'change' }
    ],
    costPrice: [
        { required: true, message: '请输入成本价格', trigger: 'blur' },
    ],
    salePrice: [
        { required: true, message: '请输入销售价格', trigger: 'blur' },
    ],
    length: [
        { required: true, message: '请输入长(CM)', trigger: 'blur' },
    ],
    width: [
        { required: true, message: '请输入宽(CM)', trigger: 'blur' },
    ],
    height: [
        { required: true, message: '请输入高(CM)', trigger: 'blur' },
    ],
    unitWeight: [
        { required: true, message: '请输入单位重量(KG)', trigger: 'blur' },
    ],
    platformSku: [
        { required: true, message: '请输入SKU映射', trigger: 'blur' }
    ],
    sku: [
        { required: true, message: '请输入sku', trigger: 'blur' }
    ],
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