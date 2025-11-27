<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row>
            <!-- 公司选择 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('orgId')" prop="orgId">
                    <el-select v-model="formData.orgId" :placeholder="getPlaceholder('orgId')" clearable filterable
                        disabled>
                        <el-option v-for="item in companyOptions" :key="item.value" :label="item.label"
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
                        :disabled="isDisabled">
                        <el-option v-for="item in currencyEnum" :key="item.code" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 账户账号 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('accountNo')" prop="accountNo">
                    <el-input v-model="formData.accountNo" :placeholder="getPlaceholder('accountNo')"
                        :readonly="isDisabled" />
                </el-form-item>
            </el-col>
            <!-- 账户状态 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable disabled>
                        <el-option v-for="item in accountStatusEnum" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 持有人名称 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('accountHolderName')" prop="accountHolderName">
                    <el-input v-model="formData.accountHolderName" :placeholder="getPlaceholder('accountHolderName')"
                        :readonly="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 备注 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" maxlength="200"
                        show-word-limit type="textarea" rows="2" :readonly="isDisabled" />
                </el-form-item>
            </el-col>

            <!-- 动态标题：银行信息/支付宝配置/微信配置 -->
            <p class="typeTitle">{{ typeTitle }}</p>
            <el-divider />

            <!-- 线下转账/银联专属字段（显示“银行信息”） -->
            <template v-if="[10, 40].includes(formData.paywayId)">
                <el-col :span="12">
                    <el-form-item :label="getLabel('bankCode')" prop="bankCode">
                        <el-input v-model="formData.bankCode" :placeholder="getPlaceholder('bankCode')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('bankName')" prop="bankName">
                        <el-input v-model="formData.bankName" :placeholder="getPlaceholder('bankName')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
            </template>

            <!-- 支付宝专属字段（显示“支付宝配置”） -->
            <template v-if="formData.paywayId === 20">
                <el-col :span="12">
                    <el-form-item :label="getLabel('alipayAppid')" prop="alipayAppid">
                        <el-input v-model="formData.alipayAppid" :placeholder="getPlaceholder('alipayAppid')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('alipayNotifyurl')" prop="alipayNotifyurl">
                        <el-input v-model="formData.alipayNotifyurl" :placeholder="getPlaceholder('alipayNotifyurl')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('alipayPublicKey')" prop="alipayPublicKey">
                        <el-input v-model="formData.alipayPublicKey" :placeholder="getPlaceholder('alipayPublicKey')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('alipayAppPrivateKey')" prop="alipayAppPrivateKey">
                        <el-input v-model="formData.alipayAppPrivateKey"
                            :placeholder="getPlaceholder('alipayAppPrivateKey')" :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
            </template>

            <!-- 微信专属字段（显示“微信配置”） -->
            <template v-if="formData.paywayId === 30">
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxAppid')" prop="wxAppid">
                        <el-input v-model="formData.wxAppid" :placeholder="getPlaceholder('wxAppid')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxMcid')" prop="wxMcid">
                        <el-input v-model="formData.wxMcid" :placeholder="getPlaceholder('wxMcid')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxApiV3Key')" prop="wxApiV3Key">
                        <el-input v-model="formData.wxApiV3Key" :placeholder="getPlaceholder('wxApiV3Key')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxPrivateKey')" prop="wxPrivateKey">
                        <el-input v-model="formData.wxPrivateKey" :placeholder="getPlaceholder('wxPrivateKey')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxMchSerialNo')" prop="wxMchSerialNo">
                        <el-input v-model="formData.wxMchSerialNo" :placeholder="getPlaceholder('wxMchSerialNo')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('wxPayNotify')" prop="wxPayNotify">
                        <el-input v-model="formData.wxPayNotify" :placeholder="getPlaceholder('wxPayNotify')"
                            :readonly="isDisabled" />
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, computed, onMounted, readonly } from 'vue';
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';

// 1. 新增props：接收父组件传的回显数据（initData），修正paymentMethodEnum类型为Array
const props = defineProps({
    companyOptions: {
        type: Array,
        required: true,
        default: () => []
    },
    // 支付方式选项（父组件传入，类型修正为Array）
    paymentMethodEnum: {
        type: Array,
        required: true,
        default: () => []
    },
    accountStatusEnum: {
        type: Object,
        required: true,
        default: () => ({})
    },
    // 新增：回显数据（父组件传入，用于编辑时填充表单）
    initData: {
        type: Object,
        required: false,
        default: () => ({})
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
});

// 2. 表单数据移到页面内部（替代原props.formData），定义所有字段默认值
const formData = ref({
    orgId: '',          // 公司ID
    paywayId: 10,       // 支付方式ID
    currency: '',       // 币种
    accountNo: '',     // 账户账号
    accountHolderName: '', // 持有人名称
    remark: '',         // 备注
    // 线下/银联专属字段
    bankCode: '',       // 银行代码
    bankName: '',       // 银行名称
    // 支付宝专属字段
    alipayAppid: '',    // 支付宝应用ID
    alipayNotifyurl: '',// 支付宝回调地址
    alipayPublicKey: '',// 支付宝公钥
    alipayAppPrivateKey: '',// 支付宝应用私钥
    // 微信专属字段
    wxAppid: '',        // 微信AppID
    wxMcid: '',         // 微信商户ID
    wxApiV3Key: '',     // 微信API V3密钥
    wxPrivateKey: '',   // 微信私钥
    wxMchSerialNo: '',  // 微信商户证书序列号
    wxPayNotify: ''     // 微信支付回调地址
});

const formRef = ref(null);

// 4. 动态标题：根据paywayId显示“银行信息/支付宝配置/微信配置”
const typeTitle = computed(() => {
    const { paywayId } = formData.value;
    switch (paywayId) {
        case 10: // 线下转账
        case 40: // 银联在线
            return '银行信息';
        case 20: // 支付宝在线
            return '支付宝配置';
        case 30: // 微信在线
            return '微信配置';
        default:
            return ''; // 未选择支付方式时显示空
    }
});

// 表单验证规则（逻辑不变，适配内部formData）
const rules = {
    orgId: [
        { required: true, message: '请选择公司', trigger: 'change' }
    ],
    paywayId: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
    ],
    currency: [
        { required: true, message: '请选择币种', trigger: 'change' }
    ],
    accountNo: [
        { required: true, message: '请输入账户账号', trigger: 'blur' }
    ],
    statusId: [
        { required: true, message: '请选择账户状态', trigger: 'change' }
    ],
    accountHolderName: [
        { required: true, message: '请输入持有人名称', trigger: 'blur' }
    ],
    // 线下转账/银联必填项
    bankCode: [
        { required: ({ formData }) => [10, 40].includes(formData.paywayId), message: '请输入银行代码', trigger: 'blur' }
    ],
    bankName: [
        { required: ({ formData }) => [10, 40].includes(formData.paywayId), message: '请输入银行名称', trigger: 'blur' }
    ],
    // 支付宝必填项
    alipayAppid: [
        { required: ({ formData }) => formData.paywayId === 20, message: '请输入应用ID', trigger: 'blur' }
    ],
    alipayNotifyurl: [
        { required: ({ formData }) => formData.paywayId === 20, message: '请输入回调地址', trigger: 'blur' }
    ],
    alipayPublicKey: [
        { required: ({ formData }) => formData.paywayId === 20, message: '请输入公钥', trigger: 'blur' }
    ],
    alipayAppPrivateKey: [
        { required: ({ formData }) => formData.paywayId === 20, message: '请输入私钥', trigger: 'blur' }
    ],
    // 微信必填项
    wxAppid: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入AppID', trigger: 'blur' }
    ],
    wxMcid: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入商户ID', trigger: 'blur' }
    ],
    wxApiV3Key: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入API密钥', trigger: 'blur' }
    ],
    wxPrivateKey: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入私钥', trigger: 'blur' }
    ],
    wxMchSerialNo: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入商户证书序列号', trigger: 'blur' }
    ],
    wxPayNotify: [
        { required: ({ formData }) => formData.paywayId === 30, message: '请输入回调地址', trigger: 'blur' }
    ]
};

// 处理支付方式变更：清空其他支付方式的专属字段（适配内部formData）
const handlePaymentMethodChange = (value) => {
    const resetFields = {
        // 线下/银联字段
        bankCode: '',
        bankName: '',
        // 支付宝字段
        alipayAppid: '',
        alipayNotifyurl: '',
        alipayPublicKey: '',
        alipayAppPrivateKey: '',
        // 微信字段
        wxAppid: '',
        wxMcid: '',
        wxApiV3Key: '',
        wxPrivateKey: '',
        wxMchSerialNo: '',
        wxPayNotify: ''
    };
    // 重置专属字段（不影响其他基础字段）
    formData.value = { ...formData.value, ...resetFields };
};

// 币种选项获取
const currencyEnum = ref([]);

onMounted(async () => {
    try {
        const res = await getCurrencyEnumApi();
        currencyEnum.value = res.data;
    } catch (error) {
        console.error('获取币种选项失败：', error);
    }
    if (Object.keys(props.initData).length > 0) {
        // 合并回显数据到表单（覆盖默认值，保留未回显的默认空值）
        formData.value = { ...formData.value, ...props.initData };
    }
})

// 暴露表单方法给父组件（逻辑不变）
defineExpose({
    validate: async () => {
        return await formRef.value.validate();
    },
    resetFields: () => {
        formRef.value.resetFields();
    },
    // 新增：暴露当前表单数据给父组件（如需提交时获取）
    getFormData: () => {
        return formData.value;
    }
});
</script>

<style scoped>
:deep(.el-select),
:deep(.el-input) {
    width: 100%;
}

/* 调整文本域高度 */
:deep(.el-textarea) {
    width: 100%;
}

:deep(.el-divider--horizontal) {
    margin: 6px 0 15px 0;
}

.typeTitle {
    font-size: 17px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}
</style>