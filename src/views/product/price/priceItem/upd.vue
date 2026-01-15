<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('feeMainTypeId')" prop="feeMainTypeId">
                    <el-select v-model="formData.feeMainTypeId" disabled>
                        <el-option v-for="item in feeMainTypeEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('feeBizTypeId')" prop="feeBizTypeId">
                    <el-select v-model="formData.feeBizTypeId" disabled>
                        <el-option v-for="item in feeBizTypeEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('feeSubTypeId')" prop="feeSubTypeId">
                    <el-select v-model="formData.feeSubTypeId" disabled>
                        <el-option v-for="item in subTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('feeUnitTypeId')" prop="feeUnitTypeId">
                    <el-select v-model="formData.feeUnitTypeId" :placeholder="getPlaceholder('feeUnitTypeId')" clearable
                        filterable>
                        <el-option v-for="item in unitTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('priceDimension')" prop="priceDimension">
                    <el-select v-model="formData.priceDimension" :placeholder="getPlaceholder('priceDimension')"
                        clearable>
                        <el-option v-for="item in priceDimensionEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item :label="getLabel('chargeCondition')" prop="chargeCondition">
                    <el-input v-model="formData.chargeCondition" :placeholder="getPlaceholder('chargeCondition')">
                        <template #append>
                            <el-button :icon="Edit" @click="openFormulaDialog" :disabled="!formData.feeSubTypeId">
                                公式构造
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item :label="getLabel('conditionDesc')" prop="conditionDesc">
                    <el-input v-model="formData.conditionDesc" :placeholder="getPlaceholder('conditionDesc')" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('isMandatory')" prop="isMandatory">
                    <el-select v-model="formData.isMandatory" :placeholder="getPlaceholder('isMandatory')" clearable>
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')" prop="sortNo">
                    <el-input v-model="formData.sortNo" type="number" :placeholder="getPlaceholder('sortNo')" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :rows="2"
                        :placeholder="getPlaceholder('remark')" maxlength="200" show-word-limit />
                </el-form-item>
            </el-col>
        </el-row>

        <FormulaDialog v-model="formulaVisible" :feeSubTypeId="formData.feeSubTypeId"
            :initialFormula="formData.chargeCondition" @confirm="handleFormulaConfirm" />
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { getFeeSubTypeEnumApi } from '@/api/financeApi/receivables.js';
import { getFeeUnitTypeEnumApi } from '@/api/productApi/shipway.js';
import { smartAlert } from '@/utils/genericMethods.js';
import FormulaDialog from '@/components/FormulaDialog.vue';

const props = defineProps({
    feeMainTypeEnum: { type: Array, default: () => [] },
    feeBizTypeEnum: { type: Array, default: () => [] },
    priceDimensionEnum: { type: Array, default: () => [] },
    initData: { type: Object, default: () => ({}) }
});

const formRef = ref(null);
const subTypeOptions = ref([]);
const unitTypeOptions = ref([]);
const formulaVisible = ref(false);

const formData = ref({
    id: '',
    feeMainTypeId: '',
    feeBizTypeId: '',
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

// 加载依赖数据 (初始化时调用)
const loadDependentData = async (bizTypeId, subTypeId) => {
    try {
        const promises = [];
        // 加载小类（用于回显名称）
        if (bizTypeId) {
            // 参数改为 feeBizTypeId
            promises.push(getFeeSubTypeEnumApi({ feeBizTypeId: bizTypeId }).then(res => {
                subTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }));
            }));
        }
        // 加载单位
        if (subTypeId) {
            promises.push(getFeeUnitTypeEnumApi({ subTypeId }).then(res => {
                unitTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }));
            }));
        }
        await Promise.all(promises);
    } catch (error) {
        console.error('Failed to load dependent enums in UpdForm', error);
    }
};

onMounted(async () => {
    if (Object.keys(props.initData).length > 0) {
        formData.value = { ...formData.value, ...props.initData };
        // 加载依赖数据以正确显示下拉label
        await loadDependentData(formData.value.feeBizTypeId, formData.value.feeSubTypeId);
    }
});

const openFormulaDialog = () => {
    if (!formData.value.feeSubTypeId) {
        smartAlert('数据异常，缺少费用项目ID', false);
        return;
    }
    formulaVisible.value = true;
};

const handleFormulaConfirm = (val) => {
    formData.value.chargeCondition = val;
};

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