<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.code"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('vasOrderNo')">
                            <canonicalInput v-model:listName="formData.vasOrderNoList"
                                :placeholder="getPlaceholder('vasOrderNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('feeTypeId')">
                            <el-select v-model="formData.feeTypeId" :placeholder="getPlaceholder('feeTypeId')"
                                clearable>
                                <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('createWayId')">
                            <el-select v-model="formData.createWayId" :placeholder="getPlaceholder('createWayId')"
                                clearable>
                                <el-option v-for="item in createWayOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <selectDate ref="dateSelectRef" :options="timeTypeOptions"
                            :initialDateRange="selectDateData.dateRange" @change="handleTimeChange"></selectDate>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>

        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @page-change="handlePageChange" @sort-change="handleTableSort"
                :tableId="'finance/receivables/fee/list/vasFee'">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" :icon="Delete">{{ getButtonText('del') }}</el-button>
                    <el-button type="success" @click="handleImport" :icon="Upload">{{ getButtonText('importCreate')
                        }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
                    <el-button type="primary" @click="joinBillVisible = true" :icon="Money">{{ getButtonText('joinBill')
                        }}</el-button>
                </template>

                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="(row.statusId == 10) && handleEdit(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10) }">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>

                <template #statusName="{ row }">
                    <span
                        :style="{ color: row.statusId == 10 ? '#E6A23C' : (row.statusId == 20 ? '#67C23A' : '#F56C6C') }">
                        {{ row.statusName }}
                    </span>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="500px" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :feeTypeOptions="feeTypeOptions" :currencyOptions="currencyOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <JoinBillDialog v-model="joinBillVisible" :selectionCount="selectionRows.length" :loading="joinBillLoading"
            @confirm="handleJoinBillConfirm" />

        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="609">
        </exportDialog>

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="resultDialogVisible" :tableData="resultData"
            :nameField="'id'" :nameLabel="'单号/费用类型'" @close="resultClose" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="增值费用">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, EditPen, Share, Upload, Money } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

// --- 组件导入 ---
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
// 引入封装的加入账单组件
import JoinBillDialog from '../JoinBillDialog.vue';

import AddForm from './add.vue';
import UpdForm from './upd.vue';

// --- 工具与API导入 ---
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
// 假设增值费用API命名如下，请根据实际文件路径调整
import {
    getVasOrderPageApi,
    addVasOrderFeeApi,
    // updVasFeeByIdApi,
    delVasOrderFeeByIdApi,
    joinBillApi
} from '@/api/financeApi/receivables.js';

import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import {
    getFeeTypeEnumApi,
    getFeeStatusEnumApi,
    getFeeCreateWayEnumApi,
    getCurrencyEnumApi
} from '@/api/baseApi/index.js';
import { getButtonText } from '@/utils/i18n/i18nLabels';

const { t } = useI18n();
const router = useRouter();

/* =========================================================================
   1. 基础配置与枚举
   ========================================================================= */
const props = defineProps({
    companyOptions: { type: Array, default: () => [] },
    warehouseOptions: { type: Array, default: () => [] },
    initialCustomerOptions: { type: Array, default: () => [] },
    feeTypeOptions: { type: Array, default: () => [] },
    statusOptions: { type: Array, default: () => [] },
    createWayOptions: { type: Array, default: () => [] },
    currencyOptions: { type: Array, default: () => [] },
});
const {
    companyOptions,
    warehouseOptions,
    feeTypeOptions,
    statusOptions,
    createWayOptions,
    currencyOptions
} = toRefs(props);
const customerOptions = ref([]);

// 级联选择器配置
const cascaderRef = ref(null);
const parentProps = { checkStrictly: true, expandTrigger: 'hover' };

/* =========================================================================
   2. 搜索表单配置 (Search State)
   ========================================================================= */
// 配置表单项
const formConfig = ref([]);

// 搜索初始值
const initValues = ref({
    orgId: [],
    warehouseCode: '',
    customerCodeList: [],
    vasOrderNoList: [],
    feeTypeId: '',
    statusId: '',
    createWayId: ''
});

// 日期相关
const dateSelectRef = ref(null);
const timeTypeOptions = ref([
    { label: '单据创建时间', value: 10 },
    { label: '费用创建时间', value: 20 }
]);

// 生成默认日期范围（最近30天）
const getDefaultDateRange = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    return [formatDate(start), formatDate(end)];
};

const selectDateData = ref({
    dateType: 10,
    dateRange: getDefaultDateRange()
});


/* =========================================================================
   3. 表格配置 (Table State)
   ========================================================================= */
const loading = ref(false);
const tableData = shallowRef([]);
const footer = ref();
const selectionRows = ref([]);
const orderBy = ref('');

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 0
});

const columns = ref([
    { label: '公司', prop: 'orgName', width: '120', sortable: true, fixed: 'left' },
    { label: '仓库', prop: 'warehouseCode', width: '100', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerCode', width: '180', sortable: true, fixed: 'left' },
    { label: '增值单号', prop: 'vasOrderNo', width: '160', sortable: true, fixed: 'left' },
    { label: '费用类型', prop: 'feeTypeName', width: '120', sortable: true },
    // { label: '费用名称', prop: 'feeName', width: '120' },
    { label: '创建方式', prop: 'createWayName', width: '120', sortable: true },
    { label: '币种', prop: 'currency', width: '80', sortable: true },
    { label: '金额', prop: 'feeAmount', width: '100', align: 'right' },
    { label: '确认金额', prop: 'confirmFeeAmount', width: '100', align: 'right' },
    // { label: '确认时间', prop: 'confirmTime', width: '200', sortable: true },
    // { label: '确认人', prop: 'confirmBy', width: '130' },
    { label: '销售用户', prop: 'salesUserCode', width: '130' },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    // { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);

/* =========================================================================
   4. 业务逻辑与方法
   ========================================================================= */

// --- 搜索与表格事件 ---
const handleTimeChange = (data) => selectDateData.value = data;

const handleSearch = (data) => {
    initValues.value = {
        ...data,
        orgId: Array.isArray(data.orgId) && data.orgId.length > 0 ? data.orgId[data.orgId.length - 1] : '',
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.dateRange ? selectDateData.value.dateRange[1] : '',
    };
    getList(1, pagination.value.pageSize);
};

const handleReset = (data) => {
    selectDateData.value = { dateType: 10, dateRange: getDefaultDateRange() };
    initValues.value = {
        ...data,
        orgId: '',
        dateType: 10,
        dateRange: getDefaultDateRange()
    };
    handleCascaderChange();
    getList(1, pagination.value.pageSize);
};

const getList = async (page, pageSize, orderByStr = orderBy.value) => {
    loading.value = true;
    try {
        const params = { ...trimObjectStrings(initValues.value) };
        const res = await getVasOrderPageApi({
            page,
            pageSize,
            orderBy: orderByStr,
            ...params
        });
        tableData.value = res.data.rows || [];
        footer.value = res.data.footer ? res.data.footer[0] : {};
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
    } catch (e) {
        console.error('List Error:', e);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

const handleSelectionChange = (val) => selectionRows.value = val;
const handlePageChange = ({ pageSize, currentPage }) => {
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(currentPage, pageSize);
};
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize);
};

// --- 新增 / 编辑 ---
const centerDialogVisible = ref(false);
const dialogMode = ref('add');
const editInitData = ref({});
const childFormRef = ref(null);

const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => dialogMode.value === 'add' ? '新增增值费用' : '编辑增值费用');

const handleAdd = () => {
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleEdit = (row) => {
    if (row.statusId != 10) {
        return smartAlert('只能编辑未确认状态的费用', false);
    }
    editInitData.value = JSON.parse(JSON.stringify(row));
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

const handleDialogCancel = () => {
    centerDialogVisible.value = false;
    nextTick(() => childFormRef.value?.resetFields());
};

const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const formData = childFormRef.value.getFormData();
        console.log('Form Data:', formData);
        loading.value = true;
        let res;
        if (dialogMode.value === 'add') {
            res = await addVasOrderFeeApi(formData);
        } else {
            res = await updVasFeeByIdApi({
                id: formData.id,
                confirmFeeAmount: formData.confirmFeeAmount,
                remark: formData.remark
            });
        }

        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize);
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

// --- 删除 ---
const resultDialogVisible = ref(false);
const resultData = ref([]);
const promptMessage = ref('');

const handleDel = () => {
    if (selectionRows.value.length === 0) {
        return ElMessage.warning('请选择要删除的数据！');
    }

    ElMessageBox.confirm(`是否要删除${selectionRows.value.length}条数据?`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        loading.value = true;
        resultData.value = [];
        resultDialogVisible.value = true;
        promptMessage.value = '操作中...';

        for (const row of selectionRows.value) {
            const res = await delVasOrderFeeByIdApi({ id: row.id });
            resultData.value.push({
                id: `${row.vasOrderNo} - ${row.feeTypeName}`,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成';
        loading.value = false;
    }).catch(() => { });
};

const resultClose = () => {
    resultDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize);
};

// --- 加入账单 ---
const joinBillVisible = ref(false);
const joinBillLoading = ref(false);

const handleJoinBillConfirm = async (formData) => {
    const params = {
        option: formData.method,
        typeId: 40, // 假设增值费用的typeId为40，请确认后端定义
        billIdNo: formData.targetBillNo,
    };

    if (formData.scope === 'selection') {
        params.feeIdList = selectionRows.value.map(item => item.id);
    } else {
        params.queryCondition = {
            ...trimObjectStrings(initValues.value),
        }
    }
    joinBillLoading.value = true;
    try {
        const res = await joinBillApi(params);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            joinBillVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize);
        }
    } catch (e) {
        console.error(e);
        smartAlert('操作异常', false);
    } finally {
        joinBillLoading.value = false;
    }
};

// --- 导入 / 导出 ---
const handleImport = () => {
    router.push({
        name: '导入文件',
        params: { typeId: 609, typeName: '增值单应收费用' },
    });
};

const exportDialogRef = ref(null);
const handleExport = () => {
    exportDialogRef.value.openExportDialog();
};

// --- 级联选择与下拉联动 ---
const handleCascaderChange = async (e) => {
    if (e) nextTick(() => cascaderRef.value.togglePopperVisible());
    const orgId = e ? e[e.length - 1] : '';

    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: `${item.code}(${item.name})`
    }));
};

/* =========================================================================
   5. 生命周期 (Initialization)
   ========================================================================= */
onMounted(async () => {
    customerOptions.value = props.initialCustomerOptions;
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.viewArea {
    height: 100%;
}

// 多选输入框
:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}
</style>