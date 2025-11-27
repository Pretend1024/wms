<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="8">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" clearable>
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('addressCode')" prop="addressCode">
                    <el-input v-model="formData.addressCode" :placeholder="getPlaceholder('addressCode')" disabled>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        popper-class="multi-column-select" clearable disabled>
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('countryCode')" prop="countryCode">
                    <el-select v-model="formData.countryCode" value-key="id" filterable
                        :placeholder="getPlaceholder('countryCode')">
                        <el-option v-for="item in countryOptions" :key="item.id"
                            :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('province')">
                    <el-input v-model="formData.province" :placeholder="getPlaceholder('province')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('city')" prop="city">
                    <el-input v-model="formData.city" :placeholder="getPlaceholder('city')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('county')">
                    <el-input v-model="formData.county" :placeholder="getPlaceholder('county')" />
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item :label="getLabel('addressLine1')" prop="addressLine1">
                    <el-input v-model="formData.addressLine1" :placeholder="getPlaceholder('addressLine1')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('addressLine2')">
                    <el-input v-model="formData.addressLine2" :placeholder="getPlaceholder('addressLine2')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('houseNumber')">
                    <el-input v-model="formData.houseNumber" :placeholder="getPlaceholder('houseNumber')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('postalCode')">
                    <el-input v-model="formData.postalCode" :placeholder="getPlaceholder('postalCode')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('company')">
                    <el-input v-model="formData.company" :placeholder="getPlaceholder('company')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('identityNumber')">
                    <el-input v-model="formData.identityNumber" :placeholder="getPlaceholder('identityNumber')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('email')">
                    <el-input v-model="formData.email" :placeholder="getPlaceholder('email')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('phoneNumber1')" prop="phoneNumber1">
                    <el-input v-model="formData.phoneNumber1" :placeholder="getPlaceholder('phoneNumber1')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('phoneNumber2')">
                    <el-input v-model="formData.phoneNumber2" :placeholder="getPlaceholder('phoneNumber2')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>

    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>

        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { getLabel } from '@/utils/i18n/i18nLabels.js';
import { getBasicGenerateAddressCodeApi } from '@/api/baseApi/basic.js'

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    customerOptions: {
        type: Array,
        required: true
    },
    typeOptions: {
        type: Array,
        required: true
    },
});
const getCode = async () => {
    const res = await getBasicGenerateAddressCodeApi();
    props.formData.addressCode = res.data;
    console.log(props);

}
const formRef = ref(null);

const rules = {
    typeId: [
        { required: true, message: '请选择' + getLabel('typeId'), trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请选择' + getLabel('customerCode'), trigger: 'change' }
    ],
    addressCode: [
        { required: true, message: '请输入' + getLabel('addressCode'), trigger: 'change' }
    ],
    warehouseId: [
        { required: true, message: '请选择' + getLabel('warehouseId'), trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请选择' + getLabel('customerCode'), trigger: 'change' }
    ],
    shipwayCode: [
        { required: true, message: '请选择' + getLabel('shipwayCode'), trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入' + getLabel('name'), trigger: 'blur' }
    ],
    identityNumber: [
        { required: true, message: '请输入' + getLabel('identityNumber'), trigger: 'blur' }
    ],
    phoneNumber1: [
        { required: true, message: '请输入' + getLabel('phoneNumber1'), trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入' + getLabel('email'), trigger: 'blur' }
    ],
    addressLine1: [
        { required: true, message: '请输入' + getLabel('addressLine1'), trigger: 'blur' }
    ],
    postalCode: [
        { required: true, message: '请输入' + getLabel('postalCode'), trigger: 'blur' }
    ],
    countryCode: [
        { required: true, message: '请选择' + getLabel('countryCode'), trigger: 'change' }
    ],
    province: [
        { required: true, message: '请输入' + getLabel('province'), trigger: 'blur' }
    ],
    city: [
        { required: true, message: '请输入' + getLabel('city'), trigger: 'blur' }
    ],
    county: [
        { required: true, message: '请输入' + getLabel('county'), trigger: 'blur' }
    ],
    addressLine2: [
        { required: true, message: '请输入' + getLabel('addressLine2'), trigger: 'blur' }
    ],
    company: [
        { required: true, message: '请输入' + getLabel('company'), trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
// 国家数据
const countryOptions = ref([])
onMounted(async () => {
    // 获取国家数据
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data
})
</script>

<style scoped lang="scss">
p {
    font-size: 22px;
    padding: 0 0 10px 15px;
    margin-top: 5px;
    margin-bottom: 15px;
    font-weight: 550;
    border-bottom: 1px solid #ccc;
}
</style>