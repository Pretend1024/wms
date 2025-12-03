<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <div class="section-title">{{ $t('basicInfo') }}</div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" filterable
                        style="width: 100%">
                        <el-option v-for="item in traceNodeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item :label="getLabel('isEnable')" prop="isEnable">
                    <el-select v-model="formData.isEnable" :placeholder="getPlaceholder('isEnable')"
                        style="width: 100%">
                        <el-option :label="$t('yes')" :value="true" />
                        <el-option :label="$t('no')" :value="false" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type="textarea" v-model="formData.remark" :placeholder="getPlaceholder('remark')"
                        :rows="1" />
                </el-form-item>
            </el-col>
        </el-row>

        <div class="rule-section-header">
            <span class="section-title">{{ $t("ruleGroup") }}</span>
            <el-button type="primary" icon="Plus" @click="addRuleGroup">
                {{ getButtonText('addRuleGroup') }}
            </el-button>
        </div>
        <div class="rule-list-container">
            <div v-for="(group, groupIndex) in formData.ruleGroup" :key="groupIndex" class="rule-group-box">
                <div class="group-header">
                    <span class="group-title"> {{ getButtonText('ruleGroup') }} {{ groupIndex + 1 }}</span>
                    <el-button type="danger" link icon="Delete" @click="removeRuleGroup(groupIndex)"
                        v-if="formData.ruleGroup.length > 1">
                        {{ getButtonText('deleteRuleGroup') }}
                    </el-button>
                </div>

                <div class="group-body">
                    <div v-for="(item, itemIndex) in group.ruleItems" :key="itemIndex" class="rule-item-row">
                        <el-select v-model="item.conditionTypeId" style="width: 140px; margin-right: 10px;">
                            <el-option v-for="opt in conditionTypeOptions" :key="opt.value" :label="opt.label"
                                :value="opt.value" />
                        </el-select>

                        <el-input v-model="item.conditionValue" :placeholder="getPlaceholder('conditionValue')"
                            style="flex: 1; margin-right: 10px;" />

                        <el-select v-model="item.logicTypeId" style="width: 100px; margin-right: 10px;">
                            <el-option v-for="opt in logicTypeOptions" :key="opt.value" :label="opt.label"
                                :value="opt.value" />
                        </el-select>

                        <el-button type="danger" icon="Minus" circle size="small"
                            @click="removeRuleItem(groupIndex, itemIndex)" :disabled="group.ruleItems.length <= 1" />
                    </div>

                    <div style="margin-top: 10px;">
                        <el-button type="primary" plain size="small" icon="Plus" @click="addRuleItem(groupIndex)">
                            {{ getButtonText('addCondition') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true,
        default: () => ({
            statusId: null,
            isEnable: true,
            remark: '',
            ruleGroup: []
        })
    },
    traceNodeOptions: {
        type: Array,
        default: () => []
    },
    logicTypeOptions: {
        type: Array,
        default: () => []
    },
    conditionTypeOptions: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);

const rules = {
    statusId: [{ required: true, message: '请选择状态', trigger: 'change' }],
    isEnable: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
};

onMounted(() => {
    if (!props.formData.ruleGroup || props.formData.ruleGroup.length === 0) {
        addRuleGroup();
    }
});

const addRuleGroup = () => {
    if (!props.formData.ruleGroup) {
        props.formData.ruleGroup = [];
    }
    props.formData.ruleGroup.push({
        sortNo: props.formData.ruleGroup.length + 1,
        ruleItems: [createNewRuleItem(1)]
    });
};

const removeRuleGroup = (index) => {
    props.formData.ruleGroup.splice(index, 1);
};

const addRuleItem = (groupIndex) => {
    const group = props.formData.ruleGroup[groupIndex];
    const newSortNo = group.ruleItems.length + 1;
    group.ruleItems.push(createNewRuleItem(newSortNo));
    // 添加新行后自动滚动到底部
    setTimeout(() => {
        const bodies = document.querySelectorAll('.group-body');
        if (bodies[groupIndex]) {
            bodies[groupIndex].scrollTop = bodies[groupIndex].scrollHeight;
        }
    }, 0);
};

const removeRuleItem = (groupIndex, itemIndex) => {
    props.formData.ruleGroup[groupIndex].ruleItems.splice(itemIndex, 1);
};

const createNewRuleItem = (sortNo) => {
    return {
        conditionTypeId: 10,
        conditionValue: '',
        logicTypeId: 10,
        sortNo: sortNo
    };
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>

<style scoped>
.section-title {
    font-size: 14px;
    font-weight: bold;
    color: #606266;
    margin-bottom: 10px;
    display: block;
}

.rule-section-header {
    margin-bottom: 10px;
    padding: 5px 0;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.rule-list-container {
    max-height: 350px;
    overflow-y: auto;
    padding-right: 5px;
    margin-bottom: 10px;
}

/* 优化滚动条样式 (Chrome/Safari/Edge) */
.rule-list-container::-webkit-scrollbar {
    width: 6px;
}

.rule-list-container::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
}

.rule-list-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.rule-group-box {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 15px;
    background-color: #fff;
    /* 移除 overflow: hidden，防止弹窗下拉框被遮挡，如有需要可加，但需注意下拉层级 */
}

.group-header {
    background-color: #f5f7fa;
    padding: 8px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    /* 头部固定 */
}

.group-title {
    font-size: 13px;
    font-weight: bold;
    color: #303133;
}

.group-body {
    padding: 15px;
    /* --- 关键修改：设置最大高度和纵向滚动 --- */
    max-height: 300px;
    overflow-y: auto;
}

/* 自定义滚动条样式 (可选) */
.group-body::-webkit-scrollbar {
    width: 6px;
}

.group-body::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
}

.group-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.rule-item-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.rule-item-row:last-child {
    margin-bottom: 0;
}
</style>