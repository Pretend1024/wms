<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <!-- 服务类型编码（必需，≤20字符） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('code')" prop="code">
                    <el-input v-model="formData.code" :placeholder="getPlaceholder('code')" disabled />
                </el-form-item>
            </el-col>

            <!-- 服务类型名称（必需，≤50字符） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" :disabled="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 适用场景（必需，枚举） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('sceneId')" prop="sceneId">
                    <el-select v-model="formData.sceneId" :placeholder="getPlaceholder('sceneId')" clearable
                        trigger="change" :disabled="isDisabled">
                        <el-option v-for="item in sceneOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 服务类型描述（可选，≤500字符） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('description')" prop="description">
                    <el-input v-model="formData.description" :placeholder="getPlaceholder('description')"
                        type="textarea" :rows="1" :disabled="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 序号（必需，整数） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')" prop="sortNo">
                    <el-input v-model="formData.sortNo" :placeholder="getPlaceholder('sortNo')" v-intNumber
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 是否启用 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('isActive')" prop="isActive">
                    <el-switch v-model="formData.isActive" :active-value='true' :inactive-value='false'
                        :active-text="getLabel('active')" :inactive-text="getLabel('inactive')"
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 默认单位（可选，≤10字符） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('defaultUnit')" prop="defaultUnit">
                    <el-input v-model="formData.defaultUnit" :placeholder="getPlaceholder('defaultUnit')"
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 币种（可选，≤10字符） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" :placeholder="getPlaceholder('currency')" clearable
                        trigger="change" :disabled="isDisabled">
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 默认单价（可选，数字） -->
            <el-col :span="12">
                <el-form-item :label="getLabel('defaultPrice')" prop="defaultPrice">
                    <el-input v-model="formData.defaultPrice" :placeholder="getPlaceholder('defaultPrice')" v-number
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>

        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';

const props = defineProps({
    initData: {
        type: Object,
        required: false,
        default: () => ({})
    },
    nationOptions: { // 币种选项
        type: Array,
        required: true,
        default: () => []
    },
    sceneOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    isDisabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

// 表单数据：适配新接口字段要求
const formData = ref({
    code: '',          // 服务类型编码（必需）
    name: '',          // 服务类型名称（必需）
    sceneId: null,     // 适用场景（必需，枚举1-4）
    description: '',   // 服务类型描述（可选）
    isActive: true,     // 是否启用
    defaultUnit: '',   // 默认单位（可选）
    currency: '',      // 币种（可选）
    defaultPrice: null,// 默认单价（可选）
    sortNo: null       // 序号（必需）
});

const formRef = ref(null);

// 表单校验规则：严格匹配接口字段约束
const rules = {
    code: [
        { required: true, message: '请输入服务类型编码', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入服务类型名称', trigger: 'blur' },
    ],
    sceneId: [
        { required: true, message: '请选择适用场景', trigger: 'change' },
    ],
    isActive: [
        { required: true, message: '请选择是否启用', trigger: 'change' }
    ],
    sortNo: [
        { required: true, message: '请输入序号', trigger: 'blur' },
    ]
};

onMounted(async () => {
    // 编辑场景：回显初始化数据（处理类型适配）
    if (Object.keys(props.initData).length > 0) {
        const init = props.initData;
        formData.value = {
            ...init,
            code: init.code || '',
            name: init.name || '',
            sceneId: init.sceneId !== undefined ? init.sceneId : null,
            description: init.description || '',
            defaultUnit: init.defaultUnit || '',
            currency: init.currency || '',
            defaultPrice: init.defaultPrice !== undefined ? init.defaultPrice : null,
            sortNo: init.sortNo !== undefined ? init.sortNo : null
        };
    }
});

// 对外暴露方法：保持与父组件交互逻辑一致
defineExpose({
    validate: async () => {
        return await formRef.value.validate();
    },
    resetFields: () => {
        formRef.value.resetFields();
        // 重置后恢复默认启用状态
        formData.value.isActive = true;
    },
    getFormData: () => {
        const submitData = { ...formData.value };
        submitData.defaultPrice = submitData.defaultPrice === '' ? null : submitData.defaultPrice;
        submitData.sortNo = submitData.sortNo === '' ? null : submitData.sortNo;
        return submitData;
    }
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea),
:deep(.el-date-picker),
:deep(.el-switch) {
    width: 100%;
}

/* 调整switch组件对齐方式 */
:deep(.el-form-item__content) {
    align-items: center !important;
}
</style>