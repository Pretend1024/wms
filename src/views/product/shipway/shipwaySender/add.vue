<template>
    <p>{{ $t('basicInfo') }}</p>
    <el-form :model="formData" :rules="rules" ref="formRef1" label-width="110px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('configTypeId')" prop="configTypeId">
                    <el-select v-model="formData.configTypeId" :placeholder="getPlaceholder('configTypeId')" clearable>
                        <el-option v-for="item in configTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('warehouseId')" prop="warehouseId">
                    <el-select v-model="formData.warehouseId" :placeholder="getPlaceholder('warehouseId')" clearable
                        @change="selectWh">
                        <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.configTypeId === 2 || formData.configTypeId === 4">
                <el-form-item :label="getLabel('shipwayCode')">
                    <el-select v-model="formData.shipwayId" :placeholder="getPlaceholder('shipwayCode')" clearable>
                        <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.configTypeId === 3 || formData.configTypeId === 4">
                <el-form-item :label="getLabel('customerCode')">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        popper-class="multi-column-select" clearable>
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <p>{{ $t('addressInfo') }}</p>
    <el-form :model="formData" :rules="rules" ref="formRef2" label-width="110px">
        <el-row>
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
            <el-col :span="24">
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
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { getLabel } from '@/utils/i18n/i18nLabels.js';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    productOptions: {
        type: Array,
        required: true
    },
    warehouseOptions: {
        type: Array,
        required: true
    },
    customerOptions: {
        type: Array,
        required: true
    },
    configTypeOptions: {
        type: Array,
        required: true
    },
});

const formRef1 = ref(null);
const formRef2 = ref(null);

const rules = {
    configTypeId: [
        { required: true, message: '请选择' + getLabel('configTypeId'), trigger: 'change' }
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
        { required: true, message: '请输入' + getLabel('phoneNumber1'), trigger: 'blur' },
        { pattern: /^\S+$/, message: getLabel('phoneNumber1') + '不能为空格', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入' + getLabel('email'), trigger: 'blur' }
    ],
    addressLine1: [
        { required: true, message: '请输入' + getLabel('addressLine1'), trigger: 'blur' },
        { pattern: /^\S+$/, message: getLabel('addressLine1') + '不能为空格', trigger: 'blur' }
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
        { required: true, message: '请输入' + getLabel('city'), trigger: 'blur' },
        { pattern: /^\S+$/, message: getLabel('city') + '不能为空格', trigger: 'blur' }
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
    validate: async () => {
        const r1 = await formRef1.value.validate()
        const r2 = await formRef2.value.validate()
        return r1 && r2
    }
});
// 选择仓库
const selectWh = (val) => {
    const wh = props.warehouseOptions.find(item => item.value === val);
    props.formData.countryCode = wh.countryCode;
}
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