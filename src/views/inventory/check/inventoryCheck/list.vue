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
                            <el-select v-model="formData.customerId" filterable
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
                @sort-change="handleTableSort">
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
                            <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add')
                            }}</el-button>
                            <el-button type="success" @click="handleComplete" :icon="CircleCheck">{{
                                getButtonText('complete')
                                }}</el-button>
                            <el-button type="danger" @click="handleDel" :icon="Delete">{{ getButtonText('invalid')
                            }}</el-button>
                        </div>
                    </div>
                </template>

                <template #customer="{ row }">
                    {{ row.customerName }}
                </template>
                <template #accuracyRate="{ row }">
                    {{ row.accuracyRate !== null ? row.accuracyRate * 100 + '%' : '' }}
                </template>

                <template #checkNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.checkNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span class="copyText" @click="handleInfo(row)">{{ row.checkNo }}</span>
                    </div>
                </template>

                <template #statusName="{ row }">
                    <div class="statusIds" :class="'status-' + row.statusId">
                        {{ row.statusName }}
                    </div>
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
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('print') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handlePrint(3, row)">{{
                                        getButtonText('printLocation') }}</el-dropdown-item>
                                    <el-dropdown-item @click="handlePrint(2, row)">{{
                                        getButtonText('printDetail') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <div class="cursor-pointer" @click="handleConfirm(row)" style="margin-left: 10px;">
                            <el-icon><Select /></el-icon>
                            <span>确认</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="600px" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :warehouseOptions="warehouseOptions" :customerOptions="customerOptions"
                :checkTypeOptions="checkTypeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'checkNo'"
            :nameLabel="'盘点单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="盘点">
import { ref, computed, onMounted, nextTick, shallowRef } from 'vue';
import { Plus, Delete, EditPen, DocumentCopy, CircleCheck, Select } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

import {
    getInventoryCheckPageApi,
    addInventoryCheckAddApi,
    updInventoryCheckUpdateByIdApi,
    cancelInventoryCheckApi,
    completeCheckInventoryCheckApi,
    confirmCompleteCheckInventoryCheckApi,
    getInventoryCheckCheckTypeEnumApi,
    getInventoryCheckCountGroupByStatusApi,
    getInventoryCheckGetFullByIdAndTypeApi
} from "@/api/inventoryApi/check.js";
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';

import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { copyToClipboard } from '@/utils/copyBtn.js';
import { openPrintCheckOrder } from "./printMethods"
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const editInitData = ref({});
const centerDialogVisible = ref(false);
const childFormRef = ref(null);
const dialogMode = ref('add');

// 搜索表单配置
const formConfig = ref([
    { type: 'select', label: '仓库', prop: 'warehouseId', options: [], filterable: true },
    { type: 'input', label: '盘点单号', prop: 'checkNo' },
    { type: 'select', label: '盘点方式', prop: 'checkTypeId', options: [] },
]);
const initValues = ref({});

const tableData = shallowRef([]);
const columns = ref([
    { label: '盘点单号', prop: 'checkNo', width: '190', fixed: 'left', slot: 'checkNo', sortable: true },
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '客户名称', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '120', sortable: true },
    { label: '盘点方式', prop: 'checkTypeName', width: '120', sortable: true, sortAlias: 'checkTypeId' },
    { label: '状态', prop: 'statusId', width: '100', slot: 'statusName', sortable: true },
    { label: '总盘盈数', prop: 'totalAdd', width: '100' },
    { label: '总盘亏数', prop: 'totalSub', width: '100' },
    { label: '库位准确率', prop: 'accuracyRate', width: '120', slot: 'accuracyRate' },
    { label: '涉及SKU个数', prop: 'skuQty', width: '120' },
    { label: '涉及库位个数', prop: 'locationQty', width: '120' },
    { label: '创建人', prop: 'createdBy', width: '100' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '100' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
]);
const footer = ref();
const pagination = ref({ currentPage: 1, pageSize: 20, total: 0 });
const loading = ref(true);
const selectionRows = ref([]);
const orderBy = ref('');

const companyOptions = ref([]);
const customerOptions = ref([]);
const warehouseOptions = ref([]);
const checkTypeOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

//状态栏
const statusIdsList = ref([]);
const statusIdsArr = ref([]);

// 获取状态统计
const getStatus = async () => {
    const data = {
        ...trimObjectStrings(initValues.value),
    };
    delete data.statusIdList;

    try {
        const res = await getInventoryCheckCountGroupByStatusApi(data);
        if (res.success) {
            statusIdsList.value = res.data;
            // 保持当前选中状态，或者初始化
            statusIdsArr.value = [...(initValues.value.statusIdList || [])];
        }
    } catch (error) {
        console.error('获取状态统计失败', error);
    }
}

// 状态改变事件
const handleStatusChange = () => {
    loading.value = true;
    let list = [...statusIdsArr.value];
    if (list.includes(null)) {
        list = [];
    }
    initValues.value.statusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

// --- 搜索与重置修改 ---
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: statusIdsArr.value,
    };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus();
};

const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: [],
    };
    statusIdsArr.value = [];
    handleCascaderChange();
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus();
};

const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getInventoryCheckPageApi({
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
    } catch (error) {
        console.error(error);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

const handleSelectionChange = (val) => selectionRows.value = val;
const handleRowClick = (row) => { };
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

const handleCascaderChange = async (e) => {
    if (e) nextTick(() => cascaderRef.value?.togglePopperVisible());
    const orgId = e ? e: '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.id,
        label: `${item.code}(${item.name})`
    }));
};

const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => dialogMode.value === 'add' ? '新增盘点单' : '编辑盘点单');

const handleAdd = () => {
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleEdit = (row) => {
    editInitData.value = JSON.parse(JSON.stringify(row));
    dialogMode.value = 'upd';
    nextTick(() => {
        centerDialogVisible.value = true;
    });
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

        loading.value = true;
        let res;
        if (dialogMode.value === 'add') {
            res = await addInventoryCheckAddApi(formData);
        } else {
            res = await updInventoryCheckUpdateByIdApi(formData);
        }

        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            getStatus();
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

const handleDel = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning('请选择要作废的数据！');
    ElMessageBox.confirm(`是否要作废${selectionRows.value.length}条数据?`, '提醒', { type: 'warning' })
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...';
            for (const row of selectionRows.value) {
                const res = await cancelInventoryCheckApi({ checkNo: row.checkNo });
                delData.value.push({
                    checkNo: row.checkNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！';
        }).catch(() => { });
};

const handleComplete = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning('请选择要完成的数据！');
    ElMessageBox.confirm(`是否要完成${selectionRows.value.length}条数据?`, '提醒', { type: 'warning' })
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...';
            for (const row of selectionRows.value) {
                const res = await completeCheckInventoryCheckApi({ checkNo: row.checkNo });
                delData.value.push({
                    checkNo: row.checkNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！';
        }).catch(() => { });
};

const delColse = () => {
    delDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus();
};

// 打印
const handlePrint = async (type, row) => {
    const loadingInstance = ElLoading.service({ fullscreen: true, text: 'loading...' });
    const res = await getInventoryCheckGetFullByIdAndTypeApi({ id: row.id, type });
    if (!res.success) {
        smartAlert(res.msg, res.success, 1000);
    } else {
        openPrintCheckOrder(res.data, type);
    }
    loadingInstance.close();
    console.log('打印数据：', res.data);
}

const handleConfirm = (row) => {
    ElMessageBox.confirm('确认后系统将自动生成库存调整单并更新系统库存，此操作不可撤销!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        loading.value = true;
        try {
            const res = await confirmCompleteCheckInventoryCheckApi({ checkNo: row.checkNo });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
                getStatus();
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading.value = false;
        }
    }).catch(() => { });
};

const handleInfo = (row) => {
    router.push({
        name: '盘点详情',
        params: { id: row.id, name: row.checkNo }
    });
};

onMounted(async () => {
    const companyRes = await getOrgListCompanyApi();
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);

    const whRes = await getWhWarehouseApi();
    warehouseOptions.value = whRes.data.map(item => ({ label: `${item.code}-${item.name}`, value: item.id }));
    formConfig.value[0].options = warehouseOptions.value;

    const typeRes = await getInventoryCheckCheckTypeEnumApi();
    checkTypeOptions.value = typeRes.data.map(item => ({ label: item.name, value: item.id }));
    formConfig.value[2].options = checkTypeOptions.value;

    handleCascaderChange();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.statusIds {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
    color: #fff;

    &.status-10 {
        background-color: #909399;
    }

    &.status-20 {
        background-color: #E6A23C;
    }

    &.status-30 {
        background-color: #67C23A;
    }

    &.status-40 {
        background-color: #409EFF;
    }

    &.status-99 {
        background-color: #F56C6C;
    }
}
</style>