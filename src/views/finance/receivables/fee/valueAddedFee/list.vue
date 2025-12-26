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
                        <el-form-item :label="getLabel('feeSubTypeId')">
                            <el-select v-model="formData.feeSubTypeId" :placeholder="getPlaceholder('feeSubTypeId')"
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
                            <el-select v-model="formData.createWay" :placeholder="getPlaceholder('createWayId')"
                                clearable>
                                <el-option v-for="item in createWayOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('orderNo')">
                            <canonicalInput v-model:listName="formData.orderNoList"
                                :placeholder="getPlaceholder('orderNo')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('billNo')">
                            <el-input v-model.trim="formData.billNo" :placeholder="getPlaceholder('billNo')"
                                clearable />
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
                :tableId="'finance/receivables/fee/list/valueAddedFee'">
                <template #table-buttons>
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <div class="amount-statistic-container">
                                <div class="stat-loading" v-if="statLoading">金额统计加载中...</div>
                                <div class="stat-content" v-else>
                                    <div v-for="item in statData" :key="item.id" class="stat-item">
                                        <div class="stat-name">{{ item.name + ':' || '费用统计' }}</div>
                                        <div class="currency-list">
                                            <div v-for="currencyItem in item.currencyAmounts"
                                                :key="currencyItem.currency" class="currency-item">
                                                <span class="currency-label">{{
                                                    currencyItem.currency ? currencyItem.currency + '：' : '' }}</span>
                                                <span class="currency-amount">{{ currencyItem.totalFeeAmount ?
                                                    currencyItem.totalFeeAmount.toFixed(3) : '暂无'
                                                    }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stat-empty" v-if="statData.length === 0">暂无统计数据</div>
                                </div>
                            </div>
                            <el-button type="primary" @click="handleAdd" v-permission="'receivableFree:add'"
                                :icon="Plus">{{
                                    getButtonText('add') }}</el-button>
                            <el-button type="danger" @click="handleDel" v-permission="'receivableFree:delete'"
                                :icon="Delete">{{
                                    getButtonText('del') }}</el-button>
                            <el-button type="success" @click="handleImport" :icon="Upload">{{
                                getButtonText('importCreate')
                            }}</el-button>
                            <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                            }}</el-button>
                            <el-button type="primary" @click="joinBillVisible = true" :icon="Money">{{
                                getButtonText('joinBill')
                            }}</el-button>
                        </div>
                    </div>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="(row.statusId == 10) && handleEdit(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10) }">
                            <el-icon>
                                <EditPen />
                            </el-icon><span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span
                        :style="{ color: row.statusId == 10 ? '#E6A23C' : (row.statusId == 20 ? '#67C23A' : '#F56C6C') }">{{
                            row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
            </hydTable>
        </div>

        <FeeDialog v-model="centerDialogVisible" :dialogMode="dialogMode" :feeMainTypeId="4" :initData="editInitData"
            :feeTypeOptions="feeTypeOptions" :currencyOptions="currencyOptions" :loading="dialogLoading"
            @confirm="handleDialogConfirm" />
        <JoinBillDialog v-model="joinBillVisible" :selectionCount="selectionRows.length"
            @confirm="handleJoinBillConfirm" />
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="610">
        </exportDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="resultDialogVisible" :tableData="resultData"
            :nameField="'id'" :nameLabel="'单号'" @close="resultClose" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="增值费用">
import { ref, shallowRef, onMounted, nextTick, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Delete, EditPen, Share, Upload, Money } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import JoinBillDialog from '../JoinBillDialog.vue';
import FeeDialog from '../FeeDialog.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getButtonText, getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels';
import {
    getFeePageApi,
    addFeeApi,
    updFeeByIdApi,
    delFeeByIdApi,
    joinBillApi,
    getFeeTypeEnumApi,
    getFeeStatusCountApi,
    getFeeStatAmountApi
} from '@/api/financeApi/receivables.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

const router = useRouter();
const props = defineProps({
    companyOptions: { type: Array, default: () => [] },
    warehouseOptions: { type: Array, default: () => [] },
    initialCustomerOptions: { type: Array, default: () => [] },
    statusOptions: { type: Array, default: () => [] },
    createWayOptions: { type: Array, default: () => [] },
    currencyOptions: { type: Array, default: () => [] },
});
const { companyOptions, warehouseOptions, statusOptions, createWayOptions, currencyOptions } = toRefs(props);
const customerOptions = ref([]);
const feeTypeOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

const formConfig = ref([]);
// 初始化查询参数：feeMainTypeId 固定为 4 (增值)
const initValues = ref({
    orgId: '', warehouseCode: '', customerCodeList: [], feeSubTypeId: '', statusId: '', createWay: '', orderNoList: [], billNoList: [], feeMainTypeId: 4, statusIdList: []
});

const dateSelectRef = ref(null);
const timeTypeOptions = ref([{ label: '单据创建时间', value: 10 }, { label: '费用创建时间', value: 20 }]);
// 获取默认时间范围
const getDefaultDateRange = () => {
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const start = new Date(end); start.setDate(start.getDate() - 30); start.setHours(0, 0, 0, 0);
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    return [formatDate(start), formatDate(end)];
};
const selectDateData = ref({ dateType: 10, dateRange: getDefaultDateRange() });
const loading = ref(false);
const tableData = shallowRef([]);
const footer = ref();
const selectionRows = ref([]);
const orderBy = ref('');
const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 });

// 新增统计相关变量
const statData = ref([]);
const statLoading = ref(false);
const statusIdsList = ref([]);
const statusIdsArr = ref([]);

// 增值费用的表格列定义
const columns = ref([
    { label: '公司', prop: 'orgName', width: '120', sortable: true, fixed: 'left' },
    { label: '仓库', prop: 'warehouseCode', width: '100', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerCode', width: '180', sortable: true, fixed: 'left', slot: 'customer' },
    { label: '账单编号', prop: 'billNo', width: '160' },
    { label: '关联订单号', prop: 'orderNo', width: '160', sortable: true },
    { label: '订单创建时间', prop: 'orderCreatedTime', width: '200' },
    { label: '费用大类', prop: 'feeMainTypeName', width: '120', sortable: true },
    { label: '费用小类', prop: 'feeSubTypeName', width: '120', sortable: true },
    { label: '创建方式', prop: 'createWayName', width: '120', sortable: true },
    { label: '币种', prop: 'currency', width: '80', sortable: true },
    { label: '费用金额', prop: 'feeAmount', width: '100', align: 'right' },
    { label: '确认金额', prop: 'confirmFeeAmount', width: '100', align: 'right' },
    { label: '报价方案', prop: 'priceProjectCode', width: '120', sortable: true },
    { label: '费用金额公式', prop: 'expression', width: '140' },
    { label: '确认时间', prop: 'confirmTime', width: '200', sortable: true },
    { label: '确认人', prop: 'confirmBy', width: '130' },
    { label: '销售用户', prop: 'salesUserCode', width: '130' },
    { label: '费用状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);

const handleTimeChange = (data) => selectDateData.value = data;

// 金额统计接口
const getFeeStatAmount = async () => {
    statLoading.value = true;
    try {
        const params = { ...trimObjectStrings(initValues.value) };
        const res = await getFeeStatAmountApi(params);
        statData.value = res.data || [];
    } catch (e) {
        console.error(e); statData.value = [];
    } finally {
        statLoading.value = false;
    }
};

// 状态栏接口
const getStatus = async () => {
    const data = { ...trimObjectStrings(initValues.value) };
    delete data.statusIdList;
    const res = await getFeeStatusCountApi(data);
    statusIdsList.value = res.data;
    statusIdsArr.value = [...initValues.value.statusIdList];
};

// 查询逻辑
const handleSearch = (data) => {
    initValues.value = {
        ...data,
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.dateRange ? selectDateData.value.dateRange[1] : '',
        statusIdList: statusIdsArr.value,
        feeMainTypeId: 4
    };
    getList(1, pagination.value.pageSize);
    getStatus();
};

// 重置逻辑
const handleReset = (data) => {
    selectDateData.value = { dateType: 10, dateRange: getDefaultDateRange() };
    initValues.value = { ...data, orgId: '', dateType: 10, dateRange: getDefaultDateRange(), feeMainTypeId: 4, statusIdList: [] };
    statusIdsArr.value = [];
    handleCascaderChange();
    getList(1, pagination.value.pageSize);
    getStatus();
};

// 获取列表
const getList = async (page, pageSize, orderByStr = orderBy.value) => {
    loading.value = true;
    try {
        const params = { ...trimObjectStrings(initValues.value) };
        const res = await getFeePageApi({ page, pageSize, orderBy: orderByStr, ...params });
        tableData.value = Object.freeze(res.data.rows) || [];
        footer.value = res.data.footer ? res.data.footer[0] : {};
        pagination.value = { currentPage: res.data.page, pageSize, total: res.data.total };
        await getFeeStatAmount();
    } catch (e) { console.error(e); tableData.value = []; } finally { loading.value = false; }
};

const handleSelectionChange = (val) => selectionRows.value = val;
const handlePageChange = ({ pageSize, currentPage }) => getList(currentPage, pageSize);
const handleTableSort = (sort) => { orderBy.value = sort; getList(pagination.value.currentPage, pagination.value.pageSize); };

// 状态改变事件
const handleStatusChange = async (e) => {
    let list = [...statusIdsArr.value];
    if (list.includes(null)) list = [];
    initValues.value.statusIdList = list;
    getList(1, pagination.value.pageSize);
};

// 弹窗逻辑
const centerDialogVisible = ref(false); const dialogMode = ref('add'); const editInitData = ref({}); const dialogLoading = ref(false);
const handleAdd = () => { editInitData.value = {}; dialogMode.value = 'add'; centerDialogVisible.value = true; };
const handleEdit = (row) => { if (row.statusId != 10) return smartAlert('只能编辑未确认状态的费用', false); editInitData.value = JSON.parse(JSON.stringify(row)); dialogMode.value = 'upd'; centerDialogVisible.value = true; };
const handleDialogConfirm = async (formData) => {
    dialogLoading.value = true;
    try {
        let res = dialogMode.value === 'add' ? await addFeeApi({ ...formData }) : await updFeeByIdApi({ id: formData.id, confirmFeeAmount: formData.confirmFeeAmount, remark: formData.remark });
        smartAlert(res.msg, res.success, 1000); if (res.success) { centerDialogVisible.value = false; getList(pagination.value.currentPage, pagination.value.pageSize); getStatus(); }
    } catch (e) { console.error(e); } finally { dialogLoading.value = false; }
};

// 批量删除
const resultDialogVisible = ref(false); const resultData = ref([]); const promptMessage = ref('');
const handleDel = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning('请选择要删除的数据！');
    ElMessageBox.confirm(`是否要删除${selectionRows.value.length}条数据?`, '提醒', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
        loading.value = true; resultData.value = []; resultDialogVisible.value = true; promptMessage.value = '操作中...';
        for (const row of selectionRows.value) { const res = await delFeeByIdApi({ id: row.id }); resultData.value.push({ id: `${row.orderNo}`, msg: res.msg, success: res.success }); }
        promptMessage.value = '操作完成'; loading.value = false;
    }).catch(() => { });
};
const resultClose = () => { resultDialogVisible.value = false; getList(pagination.value.currentPage, pagination.value.pageSize); getStatus(); };

// 加入账单逻辑
const joinBillVisible = ref(false);
const handleJoinBillConfirm = async (formData) => {
    const params = { option: formData.method, billIdNo: formData.targetBillNo, queryCondition: {} };
    if (formData.scope === 'selection') params.queryCondition.idList = selectionRows.value.map(item => item.id); else params.queryCondition = { ...trimObjectStrings(initValues.value) };
    try { const res = await joinBillApi(params); smartAlert(res.msg, res.success, 1000, true); if (res.success) { joinBillVisible.value = false; getList(pagination.value.currentPage, pagination.value.pageSize); getStatus(); } } catch (e) { console.error(e); smartAlert('操作异常', false); }
};
const handleImport = () => router.push({ name: '导入文件', params: { typeId: 610, typeName: '增值应收费用' } });
const exportDialogRef = ref(null); const handleExport = () => exportDialogRef.value.openExportDialog();
const handleCascaderChange = async (e) => { if (e) nextTick(() => cascaderRef.value.togglePopperVisible()); const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e }); customerOptions.value = result.data.map(item => ({ value: item.code, label: `${item.code}(${item.name})` })); };

// 初始化
onMounted(async () => {
    customerOptions.value = props.initialCustomerOptions;
    const feeTypeRes = await getFeeTypeEnumApi({ mainTypeId: 4 });
    feeTypeOptions.value = feeTypeRes.data.map(i => ({ label: i.name, value: i.id }));
    getStatus();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.viewArea {
    height: 100%;
}

:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

// 金额统计区域样式
.amount-statistic-container {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    .stat-loading {
        color: #666;
        font-size: 12px;
        flex-shrink: 0;
    }

    .stat-content {
        display: flex;
        align-items: center;
        flex-shrink: 0;

        .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;

            .stat-name {
                color: #333333;
                font-size: 14px;
                font-weight: 600;
                flex-shrink: 0;
                margin-right: 4px;
                margin-left: 8px;
            }

            .currency-list {
                display: flex;
                gap: 12px;
                flex-shrink: 0;

                .currency-item {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    flex-shrink: 0;

                    .currency-label {
                        color: #666;
                    }

                    .currency-amount {
                        color: #e6a23c;
                        font-weight: 500;
                    }
                }
            }
        }

        .stat-empty {
            color: #999;
            font-size: 12px;
            text-align: center;
            width: 100%;
            flex-shrink: 0;
        }
    }
}
</style>