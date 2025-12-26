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
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort" :tableId="'finance/receivables/bill/list'">
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
                            <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('add') }}</el-button>
                            <el-button type="success" @click="handleConfirm" v-permission="'confirm'" :icon="Check">{{
                                getButtonText('confirm') }}</el-button>
                            <el-button type="warning" @click="handlePay" v-permission="'pay'" :icon="Wallet">{{
                                getButtonText('pay') }}</el-button>
                            <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                                getButtonText('del') }}</el-button>
                            <el-button type="success" @click="handleExport" v-permission="'export'" :icon="Share">{{
                                getButtonText('export')
                                }}</el-button>
                        </div>
                    </div>
                </template>
                <template #billNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.billNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span class="copyText" @click="handleInfo(row)">{{ row.billNo }}</span>
                    </div>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #isOverdue="{ row }">
                    <span :style="{ color: row.isOverdue ? 'red' : 'green' }">{{ row.isOverdue ? '是' : '否' }}</span>
                </template>
                <template #billStatusName="{ row }">
                    <span
                        :style="{ color: row.billStatusId == 40 ? 'green' : (row.billStatusId == 10 ? 'red' : 'orange') }">
                        {{ row.billStatusName }}
                    </span>
                </template>
                <template #attachment="{ row }">
                    <el-popover placement="top-start" :width="200" trigger="hover" v-if="row.attachment">
                        <template #reference>
                            <el-tag>查看附件</el-tag>
                        </template>
                        <div v-for="(file, index) in parseAttachment(row.attachment)" :key="index">
                            <a :href="file.url" target="_blank"
                                style="color: #409EFF; display: block; margin-bottom: 5px;">{{ file.name
                                }}</a>
                        </div>
                    </el-popover>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="600" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :companyOptions="companyOptions" :customerOptions="initialFilteredOptions"
                :nationOptions="nationOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <PayDialog ref="payDialogRef" @success="handlePaySuccess" />

        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="611"
            :exportRangeValue="1" :useSingleId="true">
        </exportDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'账单编号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="应收账单">
import { ref, computed, onMounted, nextTick, shallowRef } from 'vue';
import { Plus, Delete, EditPen, Check, Share, DocumentCopy, Wallet } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

// 接口导入
import {
    getBillPageApi,
    addBillApi,
    updBillByIdApi,
    delBillByIdApi,
    getBillStatusEnumApi,
    confirmBillByIdApi,
    getBillStatusCountApi, // 需确保后端账单也有类似统计接口
    getBillStatAmountApi
} from '@/api/financeApi/receivables.js';
import { getCurrencyListApi } from '@/api/baseApi/index.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'

// 工具与组件导入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { copyToClipboard } from '@/utils/copyBtn.js';
import { getButtonText, getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import PayDialog from './PayDialog.vue'; // 引入支付弹窗
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import router from '@/router/index.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 编辑时的回显数据
const editInitData = ref({});
const payDialogRef = ref(null); // 支付弹窗引用

// 新增统计相关变量
const statData = ref([]);
const statLoading = ref(false);
const statusIdsList = ref([]);
const statusIdsArr = ref([]);

// 搜索表单配置
const formConfig = ref([
    { type: 'input', label: '账单编号', prop: 'billNo' },
    { type: 'select', label: '币种', prop: 'currency', options: [] },
    { type: 'select', label: '账单状态', prop: 'billStatusId', options: [] },
    { type: 'select', label: '是否逾期', prop: 'isOverdue', options: [{ label: '是', value: true }, { label: '否', value: false }] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

const initValues = ref({
    billStatusIdLst: []
});

// 获取金额统计
const getFeeStatAmount = async () => {
    statLoading.value = true;
    try {
        const params = { ...trimObjectStrings(initValues.value) };
        const res = await getBillStatAmountApi(params);
        statData.value = res.data || [];
    } catch (e) {
        console.error(e); statData.value = [];
    } finally {
        statLoading.value = false;
    }
};

// 获取状态栏
const getStatus = async () => {
    const data = { ...trimObjectStrings(initValues.value) };
    delete data.billStatusIdLst;
    // 假设账单共用费用状态统计接口，若有独立接口请替换
    const res = await getBillStatusCountApi(data);
    statusIdsList.value = res.data;
    statusIdsArr.value = [...initValues.value.billStatusIdLst];
};

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data, billStatusIdLst: statusIdsArr.value };
    getList(1, pagination.value.pageSize, orderBy.value);
    getStatus();
};

// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data, billStatusIdLst: [] };
    statusIdsArr.value = [];
    handleCascaderChange();
    getList(1, pagination.value.pageSize, orderBy.value);
    getStatus();
};

// 表格配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '公司', prop: 'orgName', width: '150', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '账单编号', prop: 'billNo', width: '190', fixed: 'left', sortable: true, slot: 'billNo' },
    { label: '币种代码', prop: 'currency', width: '125', sortable: true },
    { label: '汇率', prop: 'exchangeRate', width: '100' },
    { label: '起始日期', prop: 'billStartDate', width: '200', sortable: true },
    { label: '结束日期', prop: 'billEndDate', width: '200', sortable: true },
    { label: '总金额', prop: 'totalFeeAmount', width: '120' },
    { label: '待支付金额', prop: 'unpaidAmount', width: '120' },
    { label: '已支付金额', prop: 'alreadyPaidAmount', width: '120' },
    { label: '账单状态', prop: 'billStatusName', width: '120', sortable: true, slot: 'billStatusName' },
    { label: '付款截止日期', prop: 'paymentDeadline', width: '200', sortable: true },
    { label: '是否逾期', prop: 'isOverdue', width: '125', slot: 'isOverdue', sortable: true },
    { label: '确认时间', prop: 'confirmTime', width: '200', sortable: true },
    { label: '确认人', prop: 'confirmBy', width: '110' },
    { label: '结清时间', prop: 'closeTime', width: '200', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '附件', prop: 'attachment', width: '100', slot: 'attachment' },
    { label: '销售', prop: 'salesUserCode', width: '120' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);
const footer = ref();

const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 });
const loading = ref(true);
const selectionRows = ref([]);
const selection = ref({});
const orderBy = ref('');

const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
};

const handleRowClick = (row) => {
    selection.value = row;
};

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(currentPage, pageSize, orderBy.value);
};

const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, sortString);
};

// 状态改变事件
const handleStatusChange = async (e) => {
    let list = [...statusIdsArr.value];
    if (list.includes(null)) list = [];
    initValues.value.billStatusIdLst = list;
    getList(1, pagination.value.pageSize, orderBy.value);
};

// 解析附件JSON
const parseAttachment = (jsonStr) => {
    try {
        if (!jsonStr) return [];
        return JSON.parse(jsonStr);
    } catch (e) {
        return [];
    }
}

// 弹窗逻辑
const centerDialogVisible = ref(false);
const childFormRef = ref(null);
const dialogMode = ref('add');

const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => {
    return dialogMode.value === 'add' ? '新增账单' : '编辑账单';
});

const handleEdit = (row) => {
    editInitData.value = JSON.parse(JSON.stringify(row));
    dialogMode.value = 'upd';
    nextTick(() => {
        centerDialogVisible.value = true;
    });
};

const handleAdd = () => {
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 支付功能
const handlePay = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要支付的账单！');
        return;
    }
    const ids = selectionRows.value.map(item => item.id);
    payDialogRef.value.open(ids);
};

// 支付成功回调
const handlePaySuccess = () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus();
};

// 确认
const handleConfirm = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要确定的数据！');
        return;
    }
    ElMessageBox.confirm(
        `是否要确认${selectionRows.value.length}条数据?`, '提醒', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...'
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await confirmBillByIdApi({ id: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].billNo,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
        getStatus();
    }).catch(() => { });
};
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要导出的数据！');
        return;
    }
    if (selectionRows.value.length > 1) {
        ElMessage.warning('当前导出模式仅支持选择单条数据！');
        return;
    }
    exportDialogRef.value.openExportDialog()
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '应收账单详情',
        params: { id: row.id, name: row.billNo },
    })
}

const handleDialogCancel = () => {
    centerDialogVisible.value = false;
    nextTick(() => {
        childFormRef.value?.resetFields();
    });
};

const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;

    let bodyLoading = null;
    try {
        await childFormRef.value.validate();
        const formData = childFormRef.value.getFormData();

        bodyLoading = ElLoading.service({ lock: true, text: 'Loading' });

        let res;
        if (formData.id) {
            res = await updBillByIdApi(formData);
        } else {
            res = await addBillApi(formData);
        }

        smartAlert(res?.msg || '操作异常', res?.success || false, 1000);
        if (res?.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            getStatus();
        }

    } catch (error) {
        if (error?.name !== 'ValidationError') {
            smartAlert('网络异常或操作失败', false, 1000);
        }
    } finally {
        if (bodyLoading) bodyLoading.close();
    }
};

// 删除功能
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要删除的数据！');
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length}条数据?`, '提醒', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...'
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await delBillByIdApi({ id: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].billNo,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
        getStatus();
    }).catch(() => { });
};

const delColse = () => {
    delDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 数据获取
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getBillPageApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = Object.freeze(res.data.rows);
        footer.value = res.data.footer[0];
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
        await getFeeStatAmount();
    } catch (error) {
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

// 下拉数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
const customerOptions = ref([]);
const initialFilteredOptions = ref([]);
const nationOptions = ref([]);

const handleCascaderChange = async (e) => {
    if (e) nextTick(() => cascaderRef.value.togglePopperVisible());
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};

onMounted(async () => {
    // 账单状态
    const statusRes = await getBillStatusEnumApi();
    formConfig.value[2].options = statusRes.data.map(item => ({ value: item.id, label: item.name }));

    // 公司
    const companyRes = await getOrgListCompanyApi();
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);

    // 客户
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({ value: item.code, label: item.code + '(' + item.name + ')' }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));

    // 币种
    const nationRes = await getCurrencyListApi();
    nationOptions.value = nationRes.data.map(item => ({ value: item.currency, label: item.remark }))
    formConfig.value[1].options = nationOptions.value;

    getStatus();
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

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