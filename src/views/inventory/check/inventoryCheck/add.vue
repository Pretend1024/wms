<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('orgId')" prop="orgId">
                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                        :props="parentProps" clearable @change="handleCascaderChange"
                        :placeholder="getPlaceholder('orgId')" style="width: 100%" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="仓库" prop="warehouseId">
                    <el-select v-model="formData.warehouseId" placeholder="请选择仓库" filterable clearable
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
import { ref, reactive, defineExpose, onMounted } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

const props = defineProps({
    warehouseOptions: { type: Array, default: () => [] },
    checkTypeOptions: { type: Array, default: () => [] },
});

const formRef = ref(null);
const companyOptions = ref([]);

const formData = reactive({
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

const validate = async () => {
    return await formRef.value.validate();
};

// 获取表单数据时，将数组转换为逗号分隔的字符串
const getFormData = () => {
    const data = { ...formData };
    // 转换: Array -> String "id1,id2"
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
    formData.customerIds = [];
};

onMounted(async () => {
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
    } catch (e) {
        console.error(e);
    }
});

const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
const customerOptions = ref([]);
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.id,
        label: item.code + '(' + item.name + ')'
    }))
};

defineExpose({ validate, getFormData, resetFields });
</script>