<template>
    <el-dialog title="构造公式" :model-value="modelValue" width="800px" align-center @close="handleClose" destroy-on-close>
        <div class="formula-builder">
            <el-row :gutter="10" class="mb-2">
                <el-col :span="8">
                    <el-select v-model="formulaState.subject" placeholder="条件科目" class="w-100">
                        <el-option v-for="item in conditionSubjects" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="formulaState.operator" placeholder="运算符" class="w-100">
                        <el-option v-for="item in operatorEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="formulaState.value" placeholder="值" />
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addCondition" class="w-100">添加</el-button>
                </el-col>
            </el-row>

            <div class="formula-actions mb-2">
                <span class="label">逻辑符:</span>
                <el-button-group>
                    <el-button size="small" v-for="item in logicEnum" :key="item.value"
                        @click="appendLogic(item.label)">{{ item.label }}</el-button>
                </el-button-group>
                <span class="label ml-2">括号:</span>
                <el-button-group>
                    <el-button size="small" v-for="item in bracketEnum" :key="item.value"
                        @click="appendLogic(item.label)">{{ item.label }}</el-button>
                </el-button-group>
                <el-button type="danger" link class="ml-auto" @click="clearFormula">清空</el-button>
            </div>

            <div class="formula-preview">
                <el-tag v-for="(item, index) in formulaList" :key="index" closable @close="removeFormulaItem(index)"
                    class="mr-1 mb-1" size="large">
                    {{ item }}
                </el-tag>
            </div>
            <div class="mt-2 text-gray">预览: {{ formulaString }}</div>
        </div>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="confirmFormula">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
    getFeeConditionSubjectEnumApi,
    getFeeOperatorEnumApi,
    getFeeConditionLogicEnumApi,
    getFeeConditionBracketEnumApi
} from '@/api/productApi/shipway.js';
import { smartAlert } from '@/utils/genericMethods.js';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    initialFormula: { type: String, default: '' },
    feeSubTypeId: { type: [String, Number], required: true } // 必须传入费用项目ID来获取科目
});

const emits = defineEmits(['update:modelValue', 'confirm']);

// 状态数据
const conditionSubjects = ref([]);
const operatorEnum = ref([]);
const logicEnum = ref([]);
const bracketEnum = ref([]);

const formulaList = ref([]);
const formulaState = ref({ subject: '', operator: '', value: '' });

const formulaString = computed(() => formulaList.value.join(' '));

// 监听弹窗打开和 feeSubTypeId 变化
watch(() => props.modelValue, async (val) => {
    if (val) {
        initData();
        loadEnums();
    }
});

const initData = () => {
    // 初始化回显
    formulaList.value = props.initialFormula ? props.initialFormula.split(' ').filter(i => i) : [];
    formulaState.value = { subject: '', operator: '', value: '' };
};

const loadEnums = async () => {
    try {
        // 1. 获取动态科目
        if (props.feeSubTypeId) {
            const subRes = await getFeeConditionSubjectEnumApi({ subTypeId: props.feeSubTypeId });
            conditionSubjects.value = subRes.data.map(item => ({ label: item.name, value: item.name }));
        }

        // 2. 获取静态枚举 (如果尚未加载)
        if (operatorEnum.value.length === 0) {
            const [opRes, logicRes, brackRes] = await Promise.all([
                getFeeOperatorEnumApi(),
                getFeeConditionLogicEnumApi(),
                getFeeConditionBracketEnumApi()
            ]);
            operatorEnum.value = opRes.data.map(item => ({ label: item.code, value: item.code }));
            logicEnum.value = logicRes.data.map(item => ({ label: item.code, value: item.code }));
            bracketEnum.value = brackRes.data.map(item => ({ label: item.code, value: item.code }));
        }
    } catch (error) {
        console.error('加载公式枚举失败', error);
    }
};

const addCondition = () => {
    const { subject, operator, value } = formulaState.value;
    if (!subject || !operator || !value) {
        smartAlert('请完善条件信息', false);
        return;
    }
    // 获取显示的文本
    // const subjectLabel = conditionSubjects.value.find(i => i.value === subject)?.label || subject;
    const operatorLabel = operatorEnum.value.find(i => i.value === operator)?.label || operator;

    const conditionStr = `${subject}${operatorLabel}${value}`;
    formulaList.value.push(conditionStr);

    // 清空输入
    formulaState.value = { subject: '', operator: '', value: '' };
};

const appendLogic = (str) => {
    formulaList.value.push(str);
};

const removeFormulaItem = (index) => {
    formulaList.value.splice(index, 1);
};

const clearFormula = () => {
    formulaList.value = [];
};

const handleClose = () => {
    emits('update:modelValue', false);
};

const confirmFormula = () => {
    emits('confirm', formulaString.value);
    handleClose();
};
</script>

<style scoped>
.formula-builder {
    border: 1px solid #dcdfe6;
    padding: 15px;
    border-radius: 4px;
}

.formula-preview {
    min-height: 80px;
    border: 1px solid #e4e7ed;
    padding: 10px;
    background: #f9fafc;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.label {
    font-size: 14px;
    color: #606266;
    margin-right: 8px;
}

.formula-actions {
    display: flex;
    align-items: center;
}

.w-100 {
    width: 100%;
}

.mr-1 {
    margin-right: 5px;
}

.mb-1 {
    margin-bottom: 5px;
}

.mb-2 {
    margin-bottom: 15px;
}

.ml-2 {
    margin-left: 10px;
}

.ml-auto {
    margin-left: auto;
}

.mt-2 {
    margin-top: 10px;
}

.text-gray {
    color: #909399;
    font-size: 12px;
}
</style>