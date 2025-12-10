<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <el-col :span="12">
                <!-- 费用大类 -->
                <el-form-item :label="getLabel('feeMainTypeId')" prop="feeMainTypeId">
                    <el-select v-model="formData.feeMainTypeId" disabled>
                        <el-option v-for="item in feeMainTypeEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 费用小类 -->
                <el-form-item :label="getLabel('feeSubTypeId')" prop="feeSubTypeId">
                    <el-select v-model="formData.feeSubTypeId" disabled>
                        <el-option v-for="item in subTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 费用单位 -->
                <el-form-item :label="getLabel('feeUnitTypeId')" prop="feeUnitTypeId">
                    <el-select v-model="formData.feeUnitTypeId" :placeholder="getPlaceholder('feeUnitTypeId')" clearable
                        filterable>
                        <el-option v-for="item in unitTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 计价维度 -->
                <el-form-item :label="getLabel('priceDimension')" prop="priceDimension">
                    <el-select v-model="formData.priceDimension" :placeholder="getPlaceholder('priceDimension')"
                        clearable>
                        <el-option v-for="item in priceDimensionEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <!-- 收费条件 -->
                <el-form-item :label="getLabel('chargeCondition')" prop="chargeCondition">
                    <el-input v-model="formData.chargeCondition" :placeholder="getPlaceholder('chargeCondition')" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <!-- 条件说明 -->
                <el-form-item :label="getLabel('conditionDesc')" prop="conditionDesc">
                    <el-input v-model="formData.conditionDesc" :placeholder="getPlaceholder('conditionDesc')" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 是否必选 -->
                <el-form-item :label="getLabel('isMandatory')" prop="isMandatory">
                    <el-select v-model="formData.isMandatory" :placeholder="getPlaceholder('isMandatory')" clearable>
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 排序号 -->
                <el-form-item :label="getLabel('sortNo')" prop="sortNo">
                    <el-input v-model="formData.sortNo" type="number" :placeholder="getPlaceholder('sortNo')" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <!-- 备注 -->
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :rows="2"
                        :placeholder="getPlaceholder('remark')" maxlength="200" show-word-limit />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getFeeTypeEnumApi } from '@/api/financeApi/receivables.js';
import { getFeeUnitTypeEnumApi } from '@/api/productApi/shipway.js';

const props = defineProps({
    feeMainTypeEnum: { type: Array, default: () => [] },
    priceDimensionEnum: { type: Array, default: () => [] },
    initData: { type: Object, default: () => ({}) }
});

const formRef = ref(null);
const subTypeOptions = ref([]);
const unitTypeOptions = ref([]);

const formData = ref({
    id: '',
    feeMainTypeId: '',
    feeSubTypeId: '',
    feeUnitTypeId: '',
    chargeCondition: '',
    conditionDesc: '',
    priceDimension: '',
    isMandatory: false,
    sortNo: '',
    remark: ''
});

const rules = {
    feeUnitTypeId: [{ required: true, message: '请选择费用单位', trigger: 'change' }],
    priceDimension: [{ required: true, message: '请选择计费维度', trigger: 'change' }],
    isMandatory: [{ required: true, message: '请选择是否必选', trigger: 'change' }],
    chargeCondition: [{ required: true, message: '请输入收费条件', trigger: 'blur' }],
};

// 加载依赖数据（初始化回显用）
const loadDependentData = async (mainTypeId) => {
    if (!mainTypeId) return;
    try {
        const [subRes, unitRes] = await Promise.all([
            getFeeTypeEnumApi({ mainTypeId }),
            getFeeUnitTypeEnumApi({ mainTypeId })
        ]);
        subTypeOptions.value = subRes.data.map(item => ({ label: item.name, value: item.id }));
        unitTypeOptions.value = unitRes.data.map(item => ({ label: item.name, value: item.id }));
    } catch (error) {
        console.error('Failed to load dependent enums in UpdForm', error);
    }
};

onMounted(async () => {
    if (Object.keys(props.initData).length > 0) {
        // 1. 先赋值表单
        formData.value = { ...formData.value, ...props.initData };
        // 2. 根据回显的大类ID加载下拉列表，确保小类和单位能正确显示名称
        await loadDependentData(formData.value.feeMainTypeId);
    }
});

defineExpose({
    validate: async () => await formRef.value.validate(),
    resetFields: () => formRef.value.resetFields(),
    getFormData: () => formData.value
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input) {
    width: 100%;
}
</style>