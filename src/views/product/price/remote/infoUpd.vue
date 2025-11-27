<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="偏远类型:" prop="typeId">
                    <el-select v-model="formData.typeId" placeholder="请选择偏远类型">
                        <el-option v-for="item in typeEnumOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="国家:" prop="countryCode">
                    <el-select v-model="formData.countryCode" filterable placeholder="请选择国家">
                        <el-option v-for="item in countryOptions" :key="item.id"
                            :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="规则:" prop="ruleId">
                    <el-select v-model="formData.ruleId" placeholder="请选择规则" @change="ruleChange">
                        <el-option v-for="item in ruleEnumOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.ruleId === 1">
                <el-form-item label="邮编起始:">
                    <el-input v-model="formData.postalCodeStart" />
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.ruleId === 1">
                <el-form-item label="邮编结束:">
                    <el-input v-model="formData.postalCodeEnd" />
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="formData.ruleId === 2">
                <el-form-item label="匹配内容:">
                    <el-input v-model="formData.content" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue'
import { getProductShipwayRemoteDetailRuleEnumApi, getProductShipwayRemoteTypeEnumApi } from '@/api/productApi/shipway.js'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';


const props = defineProps({
    formData: { type: Object, required: true }
})

const formRef = ref(null)

const rules = {
    typeId: [{ required: true, message: '请选择偏远类型', trigger: 'blur' }],
    countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
    ruleId: [{ required: true, message: '请选择规则', trigger: 'blur' }],
}
// 规则改变
const ruleChange = () => {
    props.formData.postalCodeStart = '';
    props.formData.postalCodeEnd = '';
    props.formData.content = '';
}
const typeEnumOptions = ref([])
const ruleEnumOptions = ref([])
const countryOptions = ref([])

onMounted(async () => {
    const typeEnumRes = await getProductShipwayRemoteTypeEnumApi()
    const ruleEnumRes = await getProductShipwayRemoteDetailRuleEnumApi()
    const countryRes = await getOrgCountryListApi()
    typeEnumOptions.value = typeEnumRes.data
    ruleEnumOptions.value = ruleEnumRes.data
    countryOptions.value = countryRes.data
})

defineExpose({ validate: () => formRef.value.validate() })
</script>
