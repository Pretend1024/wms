<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <!-- 公司选择 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('orgId')" prop="orgId">
                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                        :props="parentProps" clearable @change="handleCascaderChange"
                        :placeholder="getPlaceholder('orgId')" disabled />
                </el-form-item>
            </el-col>

            <!-- 客户代码 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        clearable popper-class="multi-column-select" disabled>
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 支付方式选择 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('paywayId')" prop="paywayId">
                    <el-select v-model="formData.paywayId" :placeholder="getPlaceholder('paywayId')" clearable
                        @change="handlePaymentMethodChange" disabled>
                        <el-option v-for="item in paymentMethodEnum" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 币种选择 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" :placeholder="getPlaceholder('currency')" clearable
                        @change="handleCurrencyChange" disabled>
                        <el-option v-for="item in CurrencyOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 收款账户选择 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('collectionAccountId')" prop="collectionAccountId">
                    <el-select v-model="formData.collectionAccountId"
                        :placeholder="getPlaceholder('collectionAccountId')" clearable
                        :disabled="isDisabled || !formData.orgId || !formData.currency || !formData.paywayId">
                        <el-option v-for="item in collectionAccountOptions" :key="item.id" :label="item.accountNo"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 充值金额 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('payAmount')" prop="payAmount">
                    <el-input v-number="3" v-model="formData.payAmount" :placeholder="getPlaceholder('payAmount')"
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 交易ID、回调状态、回调时间（仅支付方式20/30显示） -->
            <template v-if="['20', '30'].includes(formData.paywayId?.toString())">
                <!-- 交易ID -->
                <el-col :span="12">
                    <el-form-item :label="getLabel('transactionId')" prop="transactionId">
                        <el-input v-model="formData.transactionId" :placeholder="getPlaceholder('transactionId')"
                            :disabled="isDisabled" />
                    </el-form-item>
                </el-col>

                <!-- 平台回调状态 -->
                <el-col :span="12">
                    <el-form-item :label="getLabel('platformStatusId')" prop="platformStatusId">
                        <el-select v-model="formData.platformStatusId" :placeholder="getPlaceholder('platformStatusId')"
                            clearable :disabled="isDisabled">
                            <el-option v-for="item in platformStatusEnum" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <!-- 平台回调时间 -->
                <el-col :span="12">
                    <el-form-item :label="getLabel('platformCallbackTime')" prop="platformCallbackTime">
                        <el-date-picker v-model="formData.platformCallbackTime"
                            :placeholder="getPlaceholder('platformCallbackTime')" type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss" clearable :disabled="isDisabled" />
                    </el-form-item>
                </el-col>
            </template>

            <!-- 充值凭证（仅支付方式10显示） -->
            <template v-if="formData.paywayId === 10 || formData.paywayId === 40">
                <el-col :span="24">
                    <el-form-item :label="getLabel('certificate')" prop="certificate">
                        <el-input v-model="formData.certificate" :placeholder="getPlaceholder('certificate')"
                            :disabled="isDisabled">
                            <template #append>
                                <div style="display: flex; gap: 25px;">
                                    <el-button v-if="formData.certificate" type="primary" @click="handleViewCertificate"
                                        :disabled="isDisabled">查看凭证</el-button>
                                    <el-upload :auto-upload="true"
                                        :http-request="(options) => handleCertificateUpload(options)"
                                        :before-upload="beforeUpload" :show-file-list="false" :disabled="isDisabled">
                                        <el-button type="primary" :disabled="isDisabled">上传凭证</el-button>
                                    </el-upload>
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </template>

            <!-- 备注 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea" rows="2"
                        :disabled="isDisabled" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
// 导入收款账户列表接口
import { getCollectionAccountListByConditionsApi } from '@/api/financeApi/basic.js';
// 导入上传接口
import { uploadApi } from '@/api/baseApi/index.js';

//  props定义
const props = defineProps({
    // 公司
    companyOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    // 支付方式
    paymentMethodEnum: {
        type: Array,
        required: true,
        default: () => []
    },
    // 平台回调状态
    platformStatusEnum: {
        type: Array,
        required: true,
        default: () => []
    },
    // 账户状态
    accountStatusEnum: {
        type: Array,
        required: true,
        default: () => []
    },
    // 币种选项
    CurrencyOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    // 回显数据（编辑时用）
    initData: {
        type: Object,
        required: false,
        default: () => ({})
    },
    // 新增：是否禁用表单
    isDisabled: {
        type: Boolean,
        default: false
    }
});
console.log('initData:', props.platformStatusEnum);

// 表单数据（新增platformCallbackTime字段，适配支付方式20/30）
const formData = ref({
    orgId: '',                  // 公司ID（必填）
    customerCode: '',           // 客户代码（必填）
    collectionAccountId: '',    // 收款账户ID（必填）
    currency: '',               // 币种代码（必填）
    paywayId: 10,               // 支付方式（必填，默认线下转账）
    payAmount: '',              // 充值金额（必填）
    certificate: '',            // 充值凭证URL（仅支付方式10必填）
    transactionId: '',          // 交易ID（仅支付方式20/30显示）
    platformStatusId: '',       // 平台回调状态（仅支付方式20/30显示）
    platformCallbackTime: '',   // 平台回调时间（仅支付方式20/30显示）
    remark: ''                  // 备注（可选）
});

// 引用定义
const formRef = ref(null);
const cascaderRef = ref(null);
const customerOptions = ref([]);         // 客户选项列表
const collectionAccountOptions = ref([]); // 收款账户选项列表

const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 解构props中的isDisabled，方便模板使用
const { isDisabled } = props;

// 表单验证规则（适配支付方式逻辑 + 保留禁用状态兼容）
const rules = ref({
    orgId: [
        { required: true, message: '请选择公司', trigger: 'change' },
    ],
    customerCode: [
        { required: true, message: '请选择客户代码', trigger: 'change' },
    ],
    collectionAccountId: [
        { required: true, message: '请选择收款账户', trigger: 'change' },
    ],
    currency: [
        { required: true, message: '请选择币种', trigger: 'change' },
    ],
    paywayId: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
    ],
    payAmount: [
        { required: true, message: '请输入充值金额', trigger: 'blur' },
    ],
    certificate: [
        { required: (rule, value) => formData.value.paywayId === 10 && !isDisabled, message: '请上传充值凭证', trigger: 'change' }
    ],
    transactionId: [
        { required: false, message: '请输入交易ID', trigger: 'blur' }
    ],
    platformStatusId: [
        { required: false, message: '请选择回调状态', trigger: 'change' }
    ],
    platformCallbackTime: [
        { required: false, message: '请选择回调时间', trigger: 'change' }
    ]
});

// 公司选择变更：获取客户列表 + 清空关联字段
const handleCascaderChange = async (value) => {
    // 禁用状态下不执行后续逻辑
    if (isDisabled) return;

    // 关闭级联选择器弹窗
    if (value && cascaderRef.value) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible();
        });
    }

    const orgId = value ? value : '';
    formData.value.orgId = orgId;
    // 清空所有关联字段（含新增的回调时间）
    formData.value.customerCode = '';
    formData.value.collectionAccountId = '';
    formData.value.transactionId = '';
    formData.value.platformStatusId = '';
    formData.value.platformCallbackTime = '';
    customerOptions.value = [];
    collectionAccountOptions.value = [];

    // 获取客户列表
    if (orgId) {
        try {
            const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
            customerOptions.value = result.data.map(item => ({
                value: item.code,
                label: `${item.code}(${item.name})`
            }));
        } catch (error) {
            console.error('获取客户列表失败：', error);
        }
    }
    handleCustomerChange()
};

// 支付方式变更：清空关联字段
const handlePaymentMethodChange = () => {
    // 禁用状态下不执行后续逻辑
    if (isDisabled) return;

    formData.value.collectionAccountId = '';
    collectionAccountOptions.value = [];

    // 支付方式为10/40时：清空20/30专属字段，保留凭证（仅10显示）
    if ([10, 40].includes(formData.value.paywayId)) {
        formData.value.transactionId = '';
        formData.value.platformStatusId = '';
        formData.value.platformCallbackTime = '';
        // 支付方式40时清空凭证
        if (formData.value.paywayId === 40) {
            formData.value.certificate = '';
        }
    }
    // 支付方式为20/30时：清空凭证字段
    else if ([20, 30].includes(formData.value.paywayId)) {
        formData.value.certificate = '';
    }
};

// 币种变更：清空收款账户
const handleCurrencyChange = () => {
    // 禁用状态下不执行后续逻辑
    if (isDisabled) return;

    formData.value.collectionAccountId = '';
    collectionAccountOptions.value = [];
};

// 客户变更：清空收款账户
const handleCustomerChange = () => {
    // 禁用状态下不执行后续逻辑
    if (isDisabled) return;

    formData.value.collectionAccountId = '';
    collectionAccountOptions.value = [];
};

// 监听关键字段变更，获取收款账户列表
watch(
    () => [formData.value.orgId, formData.value.currency, formData.value.paywayId, isDisabled],
    async ([orgId, currency, paywayId, disabled]) => {
        // 禁用状态下不执行请求
        if (disabled) return;

        // 三个字段都有值才请求
        if (orgId && currency && paywayId) {
            try {
                const result = await getCollectionAccountListByConditionsApi({
                    orgId,
                    currency,
                    paywayId
                });
                collectionAccountOptions.value = result.data
            } catch (error) {
                console.error('获取收款账户列表失败：', error);
                collectionAccountOptions.value = [];
            }
        }
    },
    { immediate: true }
);

// 上传凭证预处理
const beforeUpload = (file) => {
    // 禁用状态下不允许上传
    if (isDisabled) {
        ElMessage.warning('表单已禁用，无法上传凭证');
        return false;
    }
    // 新增文件格式和大小限制
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
        ElMessage.error('请上传图片格式文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB');
        return false;
    }
    return true;
};

// 上传凭证处理
const handleCertificateUpload = async (options) => {
    // 禁用状态下不执行上传
    if (isDisabled) {
        ElMessage.warning('表单已禁用，无法上传凭证');
        options.onError(new Error('表单已禁用'));
        return;
    }

    const currentFile = options.file;
    if (!currentFile) return;

    try {
        // 调用上传接口，指定路径为temp（可根据实际需求调整）
        const res = await uploadApi(currentFile, { path: 'temp' });

        if (res.success) {
            formData.value.certificate = res.data;
            ElMessage.success('凭证上传成功');
            options.onSuccess(res); // 通知上传组件上传成功
        } else {
            ElMessage.error(`凭证上传失败：${res.msg || '服务器异常'}`);
            formData.value.certificate = '';
            options.onError(res); // 通知上传组件上传失败
        }
    } catch (error) {
        ElMessage.error(`凭证上传出错：${error.msg || '网络异常'}`);
        formData.value.certificate = '';
        options.onError(error); // 通知上传组件上传失败
    }
};

// 查看凭证
const handleViewCertificate = () => {
    // 禁用状态下仍允许查看凭证（如需禁用可添加isDisabled判断）
    const certificateUrl = formData.value.certificate;
    if (certificateUrl) {
        window.open(certificateUrl, '_blank');
    } else {
        ElMessage.warning('暂无凭据可查看');
    }
};

// 初始化：回显数据
onMounted(async () => {

    // 回显编辑数据（包含新增的platformCallbackTime）
    if (Object.keys(props.initData).length > 0) {
        formData.value = { ...formData.value, ...props.initData };
    }
});

// 暴露给父组件的方法（根据支付方式过滤返回字段 + 禁用状态兼容）
defineExpose({
    validate: async () => {
        // 禁用状态下不执行验证，直接返回成功
        if (isDisabled) return true;
        return await formRef.value.validate();
    },
    resetFields: () => {
        // 禁用状态下不执行重置
        if (isDisabled) return;
        formRef.value.resetFields();
        customerOptions.value = [];
        collectionAccountOptions.value = [];
    },
    getFormData: () => {
        const data = { ...formData.value };
        const paywayId = data.paywayId;

        // 支付方式为10/40时，删除20/30专属字段，不返回给外部
        if ([10, 40].includes(paywayId)) {
            delete data.transactionId;
            delete data.platformStatusId;
            delete data.platformCallbackTime;
        }
        // 支付方式为20/30时，删除10专属字段
        else if ([20, 30].includes(paywayId)) {
            delete data.certificate;
        }

        return data;
    }
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input),
:deep(.el-cascader),
:deep(.el-date-picker) {
    width: 100%;
}

/* 调整文本域高度 */
:deep(.el-textarea) {
    width: 100%;
}

/* 调整日期选择器输入框样式，与其他组件对齐 */
:deep(.el-date-picker__input) {
    height: 32px;
    line-height: 32px;
}
</style>