<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('code')" prop="code">
                    <el-input v-model="formData.code" :placeholder="getPlaceholder('code')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="(item, index) in warehouseTypeEnumOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')">
                        <el-option v-for="(item, index) in warehouseStatusEnumOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('cargoSizeId')" prop="cargoSizeId">
                    <el-select v-model="formData.cargoSizeId" :placeholder="getPlaceholder('cargoSizeId')">
                        <el-option v-for="(item, index) in cargoSizeOptions" :key="index" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('isDanger')" prop="isDanger">
                    <el-select v-model="formData.isDanger" :placeholder="getPlaceholder('isDanger')">
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('squareMeter')" prop="squareMeter">
                    <el-input v-model="formData.squareMeter" v-number :placeholder="getPlaceholder('squareMeter')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('timeZoneId')" prop="timeZoneId">
                    <el-select v-model="formData.timeZoneId" :placeholder="getPlaceholder('timeZoneId')">
                        <el-option v-for="(item, index) in timezoneOptions" :key="index" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('countryCode')" prop="countryCode">
                    <el-select v-model="formData.countryCode" value-key="id" filterable
                        :placeholder="getPlaceholder('countryCode')">
                        <el-option v-for="item in countryOptions" :key="item.id"
                            :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('province')" prop="province">
                    <el-input v-model="formData.province" :placeholder="getPlaceholder('province')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('city')" prop="city">
                    <el-input v-model="formData.city" :placeholder="getPlaceholder('city')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('county')" prop="county">
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
            <el-col :span="12">
                <el-form-item :label="getLabel('postalCode')">
                    <el-input v-model="formData.postalCode" :placeholder="getPlaceholder('postalCode')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('receiverName')">
                    <el-input v-model="formData.receiverName" :placeholder="getPlaceholder('receiverName')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('phone')">
                    <el-input v-model="formData.phone" :placeholder="getPlaceholder('phone')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { getWhCountryListApi, getWhTimezoneListApi, getWhWarehouseCargoSizeEnumApi } from '@/api/baseApi/wh.js';
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    warehouseTypeEnumOptions: {
        type: Array,
        required: true
    },
    warehouseStatusEnumOptions: {
        type: Array,
        required: true
    }
});
// 国家数据
const countryOptions = ref([])
// 时区数据
const timezoneOptions = ref([])
// 货型数据
const cargoSizeOptions = ref([])

const formRef = ref(null);

const rules = {
    typeId: [
        { required: true, message: '请选择仓库类型', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择仓库状态', trigger: 'change' }
    ],
    code: [
        { required: true, message: '请输入仓库代码', trigger: 'blur' },
        { pattern: /^\S+$/, message: '仓库代码不能为空格', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入仓库名称', trigger: 'blur' },
        { pattern: /^\S+$/, message: '仓库名称不能为空格', trigger: 'blur' }
    ],
    squareMeter: [
        { required: true, message: '请输入平方米数', trigger: 'blur' },
    ],
    province: [
        { required: true, message: '请输入省份', trigger: 'blur' },
        { pattern: /^\S+$/, message: '省份不能为空格', trigger: 'blur' }
    ],
    city: [
        { required: true, message: '请输入城市', trigger: 'blur' },
        { pattern: /^\S+$/, message: '城市不能为空格', trigger: 'blur' }
    ],
    county: [
        { required: true, message: '请输入区', trigger: 'blur' },
        { pattern: /^\S+$/, message: '区不能为空格', trigger: 'blur' }
    ],
    addressLine1: [
        { required: true, message: '请输入街道地址', trigger: 'blur' },
        { pattern: /^\S+$/, message: '街道地址不能为空格', trigger: 'blur' }
    ],
    timeZoneId: [
        { required: true, message: '请输入时区', trigger: 'blur' }
    ],
    timeZoneNum: [
        { required: true, message: '请输入时区数字', trigger: 'blur' },
    ],
    postalCode: [
        { required: true, message: '请输入邮编', trigger: 'blur' }
    ],
    receiverName: [
        { required: true, message: '请输入收件人名', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入收件人电话', trigger: 'blur' },
    ],
    countryCode: [
        { required: true, message: '请选择国家', trigger: 'change' }
    ],
    addressLine2: [
        { required: false, message: '请输入街道地址2', trigger: 'blur' }
    ],
    cargoSizeId: [
        { required: true, message: '请选择货型', trigger: 'change' }
    ],
    isDanger: [
        { required: true, message: '请选择是否危险品仓', trigger: 'change' }
    ]
};
onMounted(async () => {
    // 获取国家数据
    const countryRes = await getWhCountryListApi();
    countryOptions.value = countryRes.data
    // 获取时区数据
    const timezoneRes = await getWhTimezoneListApi();
    timezoneOptions.value = timezoneRes.data
    // 获取货型数据
    const cargoSizeRes = await getWhWarehouseCargoSizeEnumApi();
    cargoSizeOptions.value = cargoSizeRes.data
})
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>