<template>
    <el-dialog v-model="visible" title="地址校验测试" width="900px" append-to-body :close-on-click-modal="false"
        @close="handleClose">
        <div class="test-container" v-loading="loading">
            <el-alert title="操作指引：选择承运商和国家 -> 输入地址信息 -> 点击“开始测试”。接口返回的错误将显示在对应字段下方。" type="info" show-icon
                :closable="false" style="margin-bottom: 20px;" />

            <el-form ref="baseFormRef" :model="baseFormData" :rules="rules" label-width="140px" class="base-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="承运商" prop="carrierCode">
                            <el-select v-model="baseFormData.carrierCode" placeholder="请选择承运商" filterable
                                style="width: 100%">
                                <el-option v-for="item in carrierOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="国家" prop="countryCode">
                            <el-select v-model="baseFormData.countryCode" placeholder="请选择国家" filterable
                                style="width: 100%">
                                <el-option v-for="item in countryOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-divider content-position="left">地址详细信息</el-divider>

            <el-form ref="addressFormRef" :model="addressFormData" label-width="140px" class="test-form">
                <el-row :gutter="20">
                    <template v-for="field in addressFieldList" :key="field.code">
                        <el-col :span="12" v-if="!['carrierCode', 'countryCode'].includes(field.code)">
                            <el-form-item :label="`${field.name}:`" :prop="field.code" :error="formErrors[field.code]">
                                <el-input v-model="addressFormData[field.code]" :placeholder="`请输入${field.name}`"
                                    clearable @input="clearError(field.code)" />
                            </el-form-item>
                        </el-col>
                    </template>
                </el-row>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
                <el-button type="primary" @click="handleTest" :loading="loading">开始测试</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getProductShipwayBrandListApi,
    getAddressValidateFieldNameEnumApi,
    getAddressValidTestApi
} from '@/api/productApi/shipway.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { smartAlert } from '@/utils/genericMethods.js';

/** 弹窗显示状态 */
const visible = ref(false);
/** 全局加载状态（初始化/测试请求中） */
const loading = ref(false);

/** 基础信息表单实例 */
const baseFormRef = ref(null);
/** 地址信息表单实例 */
const addressFormRef = ref(null);

/** 承运商下拉选项列表 */
const carrierOptions = ref([]);
/** 国家下拉选项列表 */
const countryOptions = ref([]);
/** 地址字段配置列表（从接口获取） */
const addressFieldList = ref([]);

/** 基础表单数据（承运商、国家） */
const baseFormData = ref({
    carrierCode: '',
    countryCode: ''
});

/** 动态地址表单数据 */
const addressFormData = ref({});

/** 表单字段错误信息映射，用于显示字段级错误提示 */
const formErrors = ref({});

// ---表单校验规则（仅针对基础表单）---
const rules = reactive({
    carrierCode: [{ required: true, message: '请选择承运商', trigger: 'change' }],
    countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }]
});

/**
 * 打开地址校验测试弹窗
 * @description 触发弹窗显示，重置表单并初始化下拉选项和地址字段配置
 */
const open = async () => {
    visible.value = true;
    resetForm();
    await initData();
};

/**
 * 初始化弹窗数据
 * @description 并行请求承运商列表、国家列表、地址字段枚举接口，格式化下拉选项并初始化动态地址字段
 * @returns {Promise<void>} 无返回值
 */
const initData = async () => {
    loading.value = true;
    try {
        // 并行请求三个基础数据接口，提升加载效率
        const [brandRes, countryRes, fieldRes] = await Promise.all([
            getProductShipwayBrandListApi(),    // 获取承运商列表
            getOrgCountryListApi(),             // 获取国家列表
            getAddressValidateFieldNameEnumApi()// 获取地址校验字段枚举
        ]);

        // 格式化承运商下拉选项：编码(名称)
        if (brandRes.success) {
            carrierOptions.value = brandRes.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }));
        }
        // 格式化国家下拉选项：编码(中文名称)
        if (countryRes.success) {
            countryOptions.value = countryRes.data.map(i => ({ label: `${i.code}(${i.nameCn})`, value: i.code }));
        }
        // 初始化地址字段列表，并为addressFormData添加对应空字段
        if (fieldRes.success) {
            addressFieldList.value = fieldRes.data || [];
            addressFieldList.value.forEach(field => {
                // 如果是承运商或国家，已经在baseFormData中，这里跳过初始化或保持一致逻辑
                if (!['carrierCode', 'countryCode'].includes(field.code)) {
                    if (addressFormData.value[field.code] === undefined) {
                        addressFormData.value[field.code] = '';
                    }
                }
            });
        }
    } catch (e) {
        console.error('初始化数据异常:', e);
        ElMessage.error('初始化数据失败');
    } finally {
        loading.value = false;
    }
};

/**
 * 处理地址校验测试逻辑
 * @description 1. 表单前置校验 2. 调用校验接口 3. 解析返回的错误信息并映射到对应字段 4. 给出校验结果提示
 * @returns {Promise<void>} 无返回值
 */
const handleTest = async () => {
    if (!baseFormRef.value) return;

    // 第一步：基础表单校验（承运商/国家必选）
    try {
        await baseFormRef.value.validate();
    } catch (e) {
        return;
    }

    loading.value = true;
    formErrors.value = {}; // 清空历史错误信息

    // 合并数据用于提交
    const submitData = {
        ...baseFormData.value,
        ...addressFormData.value
    };

    try {
        // 第二步：调用地址校验测试接口
        const res = await getAddressValidTestApi(submitData);

        if (res.success) {
            const resultList = res.data || [];

            // 第三步：解析接口返回的错误信息，映射到对应字段
            resultList.forEach(item => {
                if (item.errorMessage !== '') {
                    const returnFieldName = item.fieldName;
                    // 根据返回的字段名称匹配字段配置中的编码
                    const fieldDef = addressFieldList.value.find(f => f.name === returnFieldName);

                    if (fieldDef && fieldDef.code) {
                        formErrors.value[fieldDef.code] = item.errorMessage || '校验未通过';
                    }
                }
            });
        }
        smartAlert(res.msg, res.success, 1000);
    } catch (e) {
        console.error('地址校验请求异常:', e);
        smartAlert('校验请求失败，请稍后重试', false);
    } finally {
        loading.value = false;
    }
};

/**
 * 清除指定字段的错误提示
 * @description 输入框输入时触发，清除该字段的错误提示信息
 * @param {string} fieldCode - 字段编码（如address1、city等）
 */
const clearError = (fieldCode) => {
    if (formErrors.value[fieldCode]) {
        formErrors.value[fieldCode] = '';
    }
};

/**
 * 重置表单数据和状态
 * @description 1. 清空表单数据（含动态地址字段） 2. 清空错误提示 3. 重置表单校验状态
 */
const resetForm = () => {
    // 重置基础字段
    baseFormData.value = { carrierCode: '', countryCode: '' };
    // 重置错误信息
    formErrors.value = {};
    // 重置动态地址字段
    addressFormData.value = {};
    if (addressFieldList.value.length > 0) {
        addressFieldList.value.forEach(field => {
            if (!['carrierCode', 'countryCode'].includes(field.code)) {
                addressFormData.value[field.code] = '';
            }
        });
    }
    // 重置表单校验状态（需nextTick确保DOM更新后执行）
    nextTick(() => {
        baseFormRef.value?.clearValidate();
        addressFormRef.value?.clearValidate();
    });
};

/**
 * 处理弹窗关闭事件
 * @description 弹窗关闭时重置表单，避免下次打开残留数据
 */
const handleClose = () => {
    resetForm();
};

// 暴露弹窗打开方法给父组件调用
defineExpose({ open });
</script>

<style scoped lang="scss">
.test-container {
    padding: 0 10px;
}

.test-form {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 10px;
}

.el-form-item {
    margin-bottom: 22px;
}
</style>