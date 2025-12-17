<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <!-- 客户代码（必需，≤50字符） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        clearable popper-class="multi-column-select">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 币种代码（必需，≤10字符） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" :placeholder="getPlaceholder('currency')" clearable>
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 信用额度（必需，数字） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditAmount')" prop="creditAmount">
                    <el-input v-model="formData.creditAmount" :placeholder="getPlaceholder('creditAmount')"
                        v-number="3" />
                </el-form-item>
            </el-col>

            <!-- 授信生效时间（必需） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditStartTime')" prop="creditStartTime">
                    <el-date-picker v-model="formData.creditStartTime" type="date"
                        :placeholder="getPlaceholder('creditStartTime')" value-format="YYYY-MM-DD" clearable
                        :disabled-date="disabledBeginDate" />
                </el-form-item>
            </el-col>

            <!-- 授信到期时间（必需） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditEndTime')" prop="creditEndTime">
                    <el-date-picker v-model="formData.creditEndTime" type="date"
                        :placeholder="getPlaceholder('creditEndTime')" value-format="YYYY-MM-DD" clearable
                        :disabled-date="disabledEndDate" />
                </el-form-item>
            </el-col>

            <!-- 授信类型 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('creditTypeId')" prop="creditTypeId">
                    <el-select v-model="formData.creditTypeId" :placeholder="getPlaceholder('creditTypeId')" clearable>
                        <el-option v-for="item in creditTypeEnum" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 备注（可选） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea"
                        :rows="2" />
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
    customerOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    nationOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    creditTypeEnum: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

// 表单数据：移除balance，新增接口必需字段
const formData = ref({
    customerCode: '',      // 客户代码（必需）
    currency: '',          // 币种代码（必需）
    creditAmount: null,    // 信用额度（必需）
    creditStartTime: '',   // 授信生效时间（必需）
    creditEndTime: '',     // 授信到期时间（必需）
    creditTypeId: null,    // 授信类型id（必需）
    remark: ''             // 备注（可选）
});

const formRef = ref(null);

// 表单校验规则：严格匹配接口要求
const rules = {
    customerCode: [
        { required: true, message: '请选择客户代码', trigger: 'change' },
    ],
    currency: [
        { required: true, message: '请选择币种代码', trigger: 'change' },
    ],
    creditAmount: [
        { required: true, message: '请输入信用额度', trigger: 'change' },
    ],
    creditStartTime: [
        { required: true, message: '请选择授信生效时间', trigger: 'change' }
    ],
    creditEndTime: [
        { required: true, message: '请选择授信到期时间', trigger: 'change' }
    ],
    creditTypeId: [
        { required: true, message: '请选择授信类型', trigger: 'change' },
    ],
    remark: [
        { max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }
    ]
};

// 禁用开始时间：不能晚于已选择的结束时间
const disabledBeginDate = (time) => {
    const { creditEndTime } = formData.value;
    // 若未选择结束时间，不限制
    if (!creditEndTime) return false;
    // 转换结束时间为Date对象（处理YYYY-MM-DD字符串）
    const endDate = new Date(creditEndTime);
    // 设为当天23:59:59，确保当天及之前的日期都可选
    endDate.setHours(23, 59, 59, 999);
    // 禁用：当前时间 > 结束时间
    return time.getTime() > endDate.getTime();
};

// 禁用结束时间：不能早于已选择的开始时间
const disabledEndDate = (time) => {
    const { creditStartTime } = formData.value;
    // 若未选择开始时间，不限制
    if (!creditStartTime) return false;
    // 转换开始时间为Date对象（处理YYYY-MM-DD字符串）
    const startDate = new Date(creditStartTime);
    // 设为当天00:00:00，确保当天及之后的日期都可选
    startDate.setHours(0, 0, 0, 0);
    // 禁用：当前时间 < 开始时间
    return time.getTime() < startDate.getTime();
};

onMounted(async () => {
    // 编辑场景：回显初始化数据
    if (Object.keys(props.initData).length > 0) {
        formData.value = {
            ...formData.value,
            ...{
                customerCode: props.initData.customerCode || '',
                currency: props.initData.currency || '',
                creditAmount: props.initData.creditAmount || 0,
                creditStartTime: props.initData.creditStartTime || '',
                creditEndTime: props.initData.creditEndTime || '',
                creditTypeId: props.initData.creditTypeId !== undefined ? props.initData.creditTypeId : null,
                remark: props.initData.remark || ''
            }
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
    },
    getFormData: () => {
        return formData.value;
    }
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea),
:deep(.el-date-picker) {
    width: 100%;
}
</style>