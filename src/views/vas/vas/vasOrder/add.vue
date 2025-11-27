<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
            <p>基础信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="服务标题:" prop="vasTitle">
                            <el-input v-model.trim="formData.vasTitle" placeholder="请输入服务标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联业务类型:" prop="relatedBizType">
                            <el-select v-model="formData.relatedBizType" placeholder="请选择关联业务类型" clearable>
                                <el-option v-for="item in relatedBizTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联业务单号:" prop="relatedBizNo">
                            <el-input v-model.trim="formData.relatedBizNo" placeholder="请输入关联业务单号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('orgId')" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('warehouseCode')" prop="warehouseId" required>
                            <el-select v-model="formData.warehouseId" filterable
                                :placeholder="getPlaceholder('warehouseCode')" clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.code"
                                    :label="`${item.code}-${item.name}`" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('customerCode')" class="compact-item" prop="customerId">
                            <el-select v-model="formData.customerId" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计完成时间:" prop="expectFinishTime">
                            <el-date-picker v-model="formData.expectFinishTime" type="date" placeholder="选择预计完成时间"
                                format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联工单:" prop="relatedWorkOrderId">
                            <el-input v-model.trim="formData.relatedWorkOrderId" placeholder="请输入关联工单" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="服务描述:" prop="vasDesc">
                            <el-input type="textarea" v-model="formData.vasDesc" placeholder="请输入客户需求详情" :rows="3" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 服务项目信息 标题 -->
            <div class="section-header">
                <div class="section-title">服务项目信息</div>
            </div>

            <el-row class="table-container">
                <el-col :span="24">
                    <generalAddTable ref="itemTableRef" :columns="itemTableColumns" :data="itemTableData">
                        <template #serviceTypeId="{ row }">
                            <el-select v-model="row.serviceTypeId" placeholder="请选择服务类型" clearable filterable
                                @change="(val) => onServiceTypeChange(row, val)">
                                <el-option v-for="item in serviceTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #planQty="{ row }">
                            <el-input v-model.number="row.planQty" placeholder="请输入计划数量" v-number />
                        </template>
                        <template #unit="{ row }">
                            <el-select v-model="row.unit" placeholder="请选择单位" clearable filterable disabled>
                                <el-option v-for="item in unitOptions" :key="item.name" :label="item.name"
                                    :value="item.name" />
                            </el-select>
                        </template>
                        <template #sku="{ row, $index }"> <!-- 接收行索引 -->
                            <el-input v-model="row.sku" @blur="onSingleSkuBlur(row)" placeholder="请输入SKU">
                                <template #append>
                                    <!-- 传递当前行索引到弹窗 -->
                                    <el-button icon="More" @click="openSingleSkuDialog($index)" />
                                </template>
                            </el-input>
                        </template>
                        <!-- 合并后的附件列 -->
                        <template #attachment="{ row }">
                            <div class="attachment-container">
                                <!-- 已上传附件列表 -->
                                <div class="attachment-list" v-if="row.attachments && row.attachments.length > 0">
                                    <div v-for="(file, index) in row.attachments" :key="index" class="attachment-item">
                                        <a :href="file.url" target="_blank" class="file-link">
                                            {{ file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name }}
                                        </a>
                                    </div>
                                </div>
                                <!-- 上传按钮 -->
                                <el-upload :auto-upload="true" :http-request="(params) => handleUpload(params, row)"
                                    :before-upload="beforeUpload" multiple :show-file-list="false"
                                    v-if="!row.attachments || row.attachments.length === 0">
                                    <el-button type="primary" size="small">上传附件</el-button>
                                </el-upload>
                            </div>
                        </template>
                        <template #remark="{ row }">
                            <el-input v-model="row.remark" placeholder="请输入备注" type="textarea" />
                        </template>
                    </generalAddTable>
                </el-col>
            </el-row>

            <!-- 费用信息部分保持不变 -->
            <div class="section-header">
                <div class="section-title">费用信息</div>
                <div class="section-action">
                    <el-button type="primary" @click="fetchFeeData" size="small">系统计算</el-button>
                </div>
            </div>

            <el-row class="table-container">
                <el-col :span="24">
                    <generalAddTable ref="feeTableRef" :columns="feeTableColumns" :data="feeTableData"
                        :addRowDefaults="[{ prop: 'createWay', value: 20 }]">
                        <template #feeTypeId="{ row }">
                            <el-select v-model="row.feeTypeId" placeholder="请选择费用类型" clearable filterable>
                                <el-option v-for="item in feeTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #totalFee="{ row }">
                            <el-input v-model.number="row.totalFee" placeholder="请输入总费用" v-number />
                        </template>
                        <template #currency="{ row }">
                            <el-select v-model="row.currency" placeholder="请选择货币类型" clearable filterable>
                                <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </template>
                        <template #createWay="{ row }">
                            <el-select v-model="row.createWay" placeholder="请选择创建类型" clearable disabled>
                                <el-option v-for="item in feeCreateTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #remark="{ row }">
                            <el-input v-model="row.remark" placeholder="请输入费用备注" :disabled="row.createWay == 10" />
                        </template>
                    </generalAddTable>
                </el-col>
            </el-row>

            <!-- 底部占位 -->
            <div class="bottom-space"></div>
            <!-- 粘性按钮 -->
            <div class="btns">
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>

        <!-- SKU选择弹窗 -->
        <singleSkuSelectDialog v-model:visible="singleSkuDialogVisible" :customerId="formData.customerId"
            @confirm="handleSingleSkuConfirm" />
    </div>
</template>

<script setup name="新增增值服务单">
import {
    getVasOrderRelatedBizTypeEnumApi,
    getVasServiceTypeListApi,
    getVasOrderFeeTypeEnumApi,
    getVasOrderFeeCreateTypeEnumApi,
    getVasServiceTypeUnitEnumApi,
    addVasOrderApi,
    calculateFeeApi
} from '@/api/vasApi/vas.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import generalAddTable from '@/components/table/generalAddTable.vue';
import { ElLoading, ElMessage, ElNotification } from 'element-plus';
import tagsStore from '@/store/tags.js';
import { useRefreshStore } from '@/store/refresh.js';
import { smartAlert } from '@/utils/genericMethods.js';
import { getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels.js';
import { uploadApi } from '@/api/baseApi/index.js'
import singleSkuSelectDialog from './singleSkuSelectDialog.vue';

const route = useRoute();
const router = useRouter();
const useTagsStore = tagsStore();
const refreshStore = useRefreshStore();

const formRef = ref(null);
const itemTableRef = ref(null);
const feeTableRef = ref(null);

// 新增：记录当前点击SKU按钮的行索引
const currentRowIndex = ref(-1);

const formData = reactive({
    vasOrderNo: '',
    relatedBizType: '',
    relatedBizNo: '',
    orgId: '',
    warehouseId: '',
    customerId: '',
    vasTitle: '',
    vasDesc: '',
    expectFinishTime: '',
    relatedWorkOrderId: '',
    vasOrderItemList: [],
    vasOrderFeeList: []
});

const itemTableData = ref([]);
const feeTableData = ref([]);


// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({ id: item.code, label: `${item.code}(${item.name})`, value: item.id }))
};

const warehouseOptions = ref([]);
const relatedBizTypeOptions = ref([]);
const customerOptions = ref([]);
const serviceTypeOptions = ref([]);
const feeTypeOptions = ref([]);
const currencyOptions = ref([]);
const feeCreateTypeOptions = ref([]);
const unitOptions = ref([]);

const singleSkuDialogVisible = ref(false);
const isFetchingFee = ref(false);

// 服务项目表格列（保持不变）
const itemTableColumns = ref([
    { label: '服务类型', prop: 'serviceTypeId', required: true, slot: 'serviceTypeId', width: 150 },
    { label: '计划数量', prop: 'planQty', required: true, slot: 'planQty', width: 120 },
    { label: '单位', prop: 'unit', required: true, slot: 'unit', width: 100 },
    { label: 'SKU', prop: 'sku', slot: 'sku', width: 180 },
    { label: '附件', prop: 'attachments', slot: 'attachment', width: 100 },
    { label: '备注', prop: 'remark', slot: 'remark', width: 340 }
]);

const feeTableColumns = ref([
    { label: '费用类型', prop: 'feeTypeId', required: true, slot: 'feeTypeId', width: 200 },
    { label: '费用金额', prop: 'totalFee', required: true, slot: 'totalFee', width: 150 },
    { label: '货币类型', prop: 'currency', required: true, slot: 'currency', width: 180 },
    { label: '创建类型', prop: 'createWay', required: true, slot: 'createWay', width: 180 },
    { label: '费用备注', prop: 'remark', slot: 'remark', width: 280 }
]);

const rules = reactive({
    relatedBizType: [{ required: true, message: '请选择关联业务类型', trigger: 'change' }],
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    vasTitle: [{ required: true, message: '请输入服务标题', trigger: 'blur' }],
});


// 保存
const handleSave = async () => {
    try {
        await formRef.value.validate();

        const itemTableDataLocal = itemTableRef.value.getTableData();
        const feeTableDataLocal = feeTableRef.value.getTableData();

        const formatItemList = itemTableDataLocal.map(item => {
            const attachments = item.attachments && Array.isArray(item.attachments) ? item.attachments : null;
            return {
                ...item,
                serviceAttachment: attachments ? JSON.stringify(attachments) : null,
                serviceAttachmentName: attachments ? attachments.map(file => file.name).join(',') : null
            };
        });

        const formatFeeList = feeTableDataLocal.map(item => ({ ...item }));

        const submitData = {
            ...formData,
            orgId: formData.orgId[formData.orgId.length - 1],
            vasOrderItemList: formatItemList,
            vasOrderFeeList: formatFeeList
        };

        console.log('提交数据：', submitData);

        const res = await addVasOrderApi(submitData);
        smartAlert(res.msg, res.success, 1000);

        if (res.success) {
            refreshStore.shouldRefreshAddServiceList = true;
            useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
                item => item.path !== route.fullPath
            );
            router.push('/vas/vas/vasOrder/list');
        }
    } catch (error) {
        console.error('保存失败：', error);
        smartAlert('保存失败，请检查表单填写', false, 1000);
    }
};

const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push('/vas/vas/vasOrder/list');
};

// 系统计算方法
const fetchFeeData = async () => {
    try {
        // 获取最新的服务项目表格数据
        const itemTableDataLocal = itemTableRef.value.getTableData();
        const feeTableDataLocal = feeTableRef.value.getTableData();
        // 校验服务项目数据是否存在
        if (!itemTableDataLocal || itemTableDataLocal.length === 0) {
            ElMessage.warning('请先添加服务项目信息');
            return;
        }

        isFetchingFee.value = true;
        const loading = ElLoading.service({ lock: true, text: '费用计算中...' });

        // 构造接口请求参数（根据实际接口要求调整格式）
        const requestParams = {
            vasOrderItemVOList: itemTableDataLocal.filter(item => item.serviceTypeId && item.planQty && item.planQty),
            vasOrderFeeVOList: feeTableDataLocal.filter(item => item.feeTypeId && item.totalFee && item.totalFee)
        };

        // 调用费用计算接口
        const res = await calculateFeeApi(requestParams);

        if (res.success && res.data) {
            // 清空现有费用数据
            feeTableData.value = [];
            await nextTick();

            // 用接口返回结果覆盖费用表格数据（根据接口返回字段调整映射关系）
            feeTableData.value = res.data.vasOrderFeeVOList.map(feeItem => ({
                feeTypeId: feeItem.feeTypeId || '',
                totalFee: feeItem.totalFee,
                currency: feeItem.currency,
                createWay: feeItem.createWay,
                remark: feeItem.remark
            }));

            ElMessage.success('费用计算成功');
        } else {
            ElMessage.error(res.msg || '费用计算失败');
        }

        loading.close();
    } catch (error) {
        console.error('费用计算接口调用失败：', error);
        ElMessage.error('费用计算异常，请重试');
        if (error.message) {
            ElMessage.error(`错误信息：${error.message}`);
        }
    } finally {
        isFetchingFee.value = false;
    }
};

const beforeUpload = (file) => true;

// 附件上传逻辑保持不变
const handleUpload = async (params, row) => {
    const file = params.file;
    try {
        if (!row.attachments || !Array.isArray(row.attachments)) {
            row.attachments = [];
        }

        const isDuplicate = row.attachments.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传，无需重复添加`);
            params.onSuccess && params.onSuccess();
            return;
        }

        const res = await uploadApi(file, { path: 'temp' });

        if (res.success && res.data) {
            row.attachments.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage({
                message: 'Success',
                type: 'success',
            })
            params.onSuccess && params.onSuccess();
        } else {
            ElNotification.error({ title: '失败', message: res.msg || '文件上传失败' });
            params.onError && params.onError();
        }
    } catch (error) {
        console.error('文件上传失败：', error);
        ElNotification.error({ title: '失败', message: '文件上传失败，请重试' });
        params.onError && params.onError();
    }
};

const onServiceTypeChange = (row, val) => {
    if (!val) {
        row.unit = '';
        return;
    }
    const selected = serviceTypeOptions.value.find(item => item.id === val);
    if (selected) {
        const defaultUnit = selected.defaultUnit ?? selected.default_unit ?? selected.unit ?? '';
        if (defaultUnit) row.unit = defaultUnit;
    }
};

async function onSingleSkuBlur(row) {
    if (!formData.customerId) {
        ElMessage.warning('请先选择客户');
        row.sku = '';
        return;
    }
    if (!row.sku) return;
    try {
        const customer = customerOptions.value.find(item => item.value === formData.customerId);
        const res = await getSkuSkuDataBySkuApi({ customerCode: customer.id, sku: row.sku });
        if (res.success && res.data) row.name = res.data.nameCn || res.data.name;
        else {
            smartAlert(res.msg || 'SKU 无效，请重新输入', false);
            row.sku = '';
            // row.name = res.msg || 'SKU 无效，请重新输入';
            // ElMessage.warning(row.name);
        }
    } catch (e) {
        smartAlert(e.msg || '获取SKU信息失败', false);
    }
}

// 打开SKU弹窗：记录当前行索引
function openSingleSkuDialog(index) {
    if (!formData.customerId) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    currentRowIndex.value = index; // 存储当前行索引
    singleSkuDialogVisible.value = true;
}

// 选择SKU后：回填到当前行
async function handleSingleSkuConfirm(selectedSku) {
    if (!selectedSku || currentRowIndex.value === -1) return;

    // 调用表格组件的新增方法，设置当前行的SKU信息
    itemTableRef.value.setRowFieldValue(currentRowIndex.value, 'sku', selectedSku.sku);
    // itemTableRef.value.setRowFieldValue(currentRowIndex.value, 'name', selectedSku.nameCn || selectedSku.nameEn || '');
    // itemTableRef.value.setRowFieldValue(currentRowIndex.value, 'barcode', selectedSku.barcode || '');

    // 重置当前行索引
    currentRowIndex.value = -1;
    singleSkuDialogVisible.value = false;
}

// 页面加载逻辑保持不变
onMounted(async () => {
    const loading = ElLoading.service({ lock: true, text: "Loading" });
    try {
        const apiTasks = [
            { key: "关联业务类型", api: getVasOrderRelatedBizTypeEnumApi(), handleSuccess: (data) => (relatedBizTypeOptions.value = data || []) },
            { key: "仓库", api: getWhWarehouseApi(), handleSuccess: (data) => (warehouseOptions.value = data || []) },
            { key: "客户", api: getCustomerLikeQueryApi({ keyword: "*" }), handleSuccess: (data) => (customerOptions.value = data.map((item) => ({ id: item.code, label: `${item.code}(${item.name})`, value: item.id }))) },
            { key: "服务类型", api: getVasServiceTypeListApi(), handleSuccess: (data) => (serviceTypeOptions.value = data || []) },
            { key: "费用类型", api: getVasOrderFeeTypeEnumApi(), handleSuccess: (data) => (feeTypeOptions.value = data || []) },
            { key: "货币类型", api: getCurrencyEnumApi(), handleSuccess: (data) => (currencyOptions.value = data || []) },
            { key: "费用创建类型", api: getVasOrderFeeCreateTypeEnumApi(), handleSuccess: (data) => (feeCreateTypeOptions.value = data || []) },
            { key: "服务单位", api: getVasServiceTypeUnitEnumApi(), handleSuccess: (data) => (unitOptions.value = data || []) }
        ];

        const dropdownResults = await Promise.allSettled(apiTasks.map((task) => task.api));

        dropdownResults.forEach((result, index) => {
            const task = apiTasks[index];
            if (result.status === "fulfilled") {
                const res = result.value;
                if (res.success !== false) task.handleSuccess(res.data);
                else smartAlert(`【${task.key}】数据加载失败：${res.msg}`, false);
            } else {
                smartAlert(`【${task.key}】接口请求失败`, false);
                console.error(`[${task.key}] error:`, result.reason);
            }
        });
        // 获取公司数据
        const companyRes = await getOrgListCompanyApi();
        // 处理公司数据
        const convertToTree = (items) => {
            return items.map(item => ({
                value: item.id,
                label: item.nameCn,
                children: item.children ? convertToTree(item.children) : []
            }));
        };
        companyOptions.value = convertToTree(companyRes.data);

    } catch (error) {
        smartAlert('下拉框数据加载异常', false);
        console.error('下拉框数据加载失败:', error);
    } finally {
        loading.close();
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
}

.btns {
    width: 100% !important;
    padding: 10px 0;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
}

:deep(.el-form) {
    width: 1150px !important;
}

:deep(.el-input) {
    width: 100% !important;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ccc;
    margin-top: 5px;
    padding: 8px 0 10px 15px;
}

.section-title {
    font-size: 22px;
    font-weight: 550;
    margin-right: 15px;
}

/* 附件样式 */
.attachment-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.attachment-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.attachment-item {
    font-size: 12px;
    line-height: 18px;
}

.file-link {
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
}

.bottom-space {
    height: 250px;
}
</style>