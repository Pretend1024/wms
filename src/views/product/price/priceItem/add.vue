<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <el-col :span="12">
                <!-- 费用大类 -->
                <el-form-item :label="getLabel('feeMainTypeId')" prop="feeMainTypeId">
                    <el-select v-model="formData.feeMainTypeId" :placeholder="getPlaceholder('feeMainTypeId')" clearable
                        filterable @change="handleMainTypeChange">
                        <el-option v-for="item in feeMainTypeEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <!-- 费用小类 -->
                <el-form-item :label="getLabel('feeSubTypeId')" prop="feeSubTypeId">
                    <el-select v-model="formData.feeSubTypeId" :placeholder="getPlaceholder('feeSubTypeId')" clearable
                        filterable>
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
    feeMainTypeId: [{ required: true, message: '请选择费用大类', trigger: 'change' }],
    feeSubTypeId: [{ required: true, message: '请选择费用小类', trigger: 'change' }],
    feeUnitTypeId: [{ required: true, message: '请选择费用单位', trigger: 'change' }],
    priceDimension: [{ required: true, message: '请选择计费维度', trigger: 'change' }],
    isMandatory: [{ required: true, message: '请选择是否必选', trigger: 'change' }],
    chargeCondition: [{ required: true, message: '请输入收费条件', trigger: 'blur' }],
};

// 监听大类变化，加载小类和单位
const handleMainTypeChange = async (val) => {
    formData.value.feeSubTypeId = '';
    formData.value.feeUnitTypeId = '';
    subTypeOptions.value = [];
    unitTypeOptions.value = [];

    if (val) {
        try {
            const [subRes, unitRes] = await Promise.all([
                getFeeTypeEnumApi({ mainTypeId: val }),
                getFeeUnitTypeEnumApi({ mainTypeId: val })
            ]);
            subTypeOptions.value = subRes.data.map(item => ({ label: item.name, value: item.id }));
            unitTypeOptions.value = unitRes.data.map(item => ({ label: item.name, value: item.id }));
        } catch (error) {
            console.error('Failed to load dependent enums', error);
        }
    }
};

onMounted(() => {
    // 如果有回显数据（虽然是新增页，保留扩展性），可以处理合并
    if (Object.keys(props.initData).length > 0) {
        formData.value = { ...formData.value, ...props.initData };
        // 如果有大类，触发加载
        if (formData.value.feeMainTypeId) {
            handleMainTypeChange(formData.value.feeMainTypeId);
        }
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