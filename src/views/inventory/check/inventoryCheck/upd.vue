<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司" prop="orgId">
                    <el-cascader v-model="formData.orgId" :options="companyOptions" :props="cascaderProps"
                        placeholder="请选择公司" clearable style="width: 100%" show-all-levels={false} disabled />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="仓库" prop="warehouseId">
                    <el-select v-model="formData.warehouseId" placeholder="请选择仓库" filterable disabled
                        style="width: 100%">
                        <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="客户" prop="customerIds">
                    <el-select v-model="formData.customerIds" placeholder="请选择客户(可多选，不选默认全部)" filterable multiple
                        collapse-tags clearable style="width: 100%" popper-class="multi-column-select">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="指定入库单" prop="inOrderNo">
                    <el-input v-model="formData.inOrderNo" placeholder="请输入入库单号，多个用英文逗号隔开" type="textarea" :rows="2" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="指定SKU" prop="sku">
                    <el-input v-model="formData.sku" placeholder="请输入SKU，多个用英文逗号隔开" type="textarea" :rows="2" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="指定库区" prop="zoneCode">
                    <el-input v-model="formData.zoneCode" placeholder="请输入库区代码，多个用英文逗号隔开" type="textarea" :rows="2" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="库存更新时间" prop="updatedTimeBegin">
                    <el-date-picker v-model="formData.updatedTimeBegin" type="datetime" placeholder="开始时间"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="截至时间" prop="updatedTimeEnd">
                    <el-date-picker v-model="formData.updatedTimeEnd" type="datetime" placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="盘点方式" prop="checkTypeId">
                    <el-radio-group v-model="formData.checkTypeId">
                        <el-radio v-for="item in checkTypeOptions" :key="item.value" :label="item.value">{{ item.label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="包含空库位" prop="isHaveEmptyLocation">
                    <el-radio-group v-model="formData.isHaveEmptyLocation">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="允许新建库存" prop="isCanCreateStock">
                    <el-radio-group v-model="formData.isCanCreateStock">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <el-tooltip content="忙盘场景下可开启，允许录入系统无记录的商品" placement="top">
                        <el-icon style="margin-left: 5px; cursor: pointer">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, reactive, defineExpose, onMounted, watch } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

const props = defineProps({
    initData: { type: Object, default: () => ({}) },
    warehouseOptions: { type: Array, default: () => [] },
    checkTypeOptions: { type: Array, default: () => [] },
});

const formRef = ref(null);
const companyOptions = ref([]);
const cascaderProps = { checkStrictly: true, expandTrigger: 'hover', emitPath: false };

const formData = reactive({
    id: '',
    orgId: '',
    warehouseId: '',
    customerIds: [],
    inOrderNo: '',
    sku: '',
    zoneCode: '',
    updatedTimeBegin: '',
    updatedTimeEnd: '',
    checkTypeId: 10,
    isHaveEmptyLocation: false,
    isCanCreateStock: false,
    remark: ''
});

const rules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }]
};

const initForm = () => {
    if (props.initData) {
        Object.assign(formData, props.initData);
        // 数据回显处理：String "1,2" -> Array ["1", "2"]
        if (formData.customerId) {
            formData.customerIds = String(formData.customerId).split(',');
        } else {
            formData.customerIds = [];
        }
    }
};

watch(() => props.initData, initForm, { immediate: true, deep: true });

const validate = async () => {
    return await formRef.value.validate();
};

// 提交数据时：Array -> String
const getFormData = () => {
    const data = { ...formData };
    if (Array.isArray(data.customerIds) && data.customerIds.length > 0) {
        data.customerId = data.customerIds.join(',');
    } else {
        data.customerId = '';
    }
    delete data.customerIds;
    return data;
};

const resetFields = () => {
    formRef.value.resetFields();
};
const customerOptions = ref([]);
onMounted(async () => {
    openMainLoading()
    try {
        const res = await getOrgListCompanyApi();
        if (res.success) {
            const convertToTree = (items) => {
                return items.map(item => ({
                    value: item.id,
                    label: item.nameCn,
                    children: item.children ? convertToTree(item.children) : []
                }));
            };
            companyOptions.value = convertToTree(res.data);
        }
        const customerRes = await getCustomerLikeQueryApi({ keyword: '*', orgId: props.initData.orgId || '' });
        if (customerRes.success) {
            customerOptions.value = customerRes.data.map(item => ({
                value: item.id,
                label: item.code + '(' + item.name + ')'
            }));
        }
    } catch (e) {
        console.error(e);
    }
    finally {
        closeMainLoading()
    }
});

defineExpose({ validate, getFormData, resetFields });
</script>