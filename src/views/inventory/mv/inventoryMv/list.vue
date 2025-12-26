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
                        <el-form-item :label="getLabel('mvNo')">
                            <canonicalInput v-model:listName="formData.mvNoList" :placeholder="getPlaceholder('mvNo')"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('fromWarehouseId')">
                            <el-select v-model="formData.fromWarehouseId"
                                :placeholder="getPlaceholder('fromWarehouseId')" clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
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
                @selection-change="handleSelectionChange" @page-change="handlePageChange" @sort-change="handleTableSort"
                :tableId="'inventory/mv/inventoryMv/list'">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleComplete" :icon="Check">{{ getButtonText('complete')
                        }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon><span>{{ getButtonText('append') }}</span>
                        </div>
                    </div>
                </template>
                <template #mvNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.mvNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span class="copyText" @click="handleInfo(row)">{{ row.mvNo }}</span>
                    </div>
                </template>
                <template #statusId="{ row }">
                    <span
                        :style="{ color: row.statusId === 1 ? '#E6A23C' : (row.statusId === 2 ? '#67C23A' : '#F56C6C') }">{{
                            row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
            </hydTable>
        </div>
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="306">
        </exportDialog>

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="resultDialogVisible" :tableData="resultData"
            :nameField="'id'" :nameLabel="'移库单号'" successValue="操作成功" @close="resultClose"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="移库">
import { ref, onMounted, shallowRef, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Share, EditPen, Check } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
// 引入批量结果组件
import batchOperationn from '@/components/messageNotices/batchOperation.vue';

import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import {
    getInventoryMvPageApi,
    getInventoryMvStatusEnumApi,
    completeInventoryMvApi
} from '@/api/inventoryApi/mv.js';

const router = useRouter();

// 下拉选项数据
const warehouseOptions = ref([]);
const customerOptions = ref([]);
const statusOptions = ref([]); // 状态选项

// 搜索配置
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false, offsetDays: 30 },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])
const initValues = ref({
    mvNoList: [],
    warehouseCode: '',
    customerCode: '',
    statusId: '',
    timeType: 10,
    timeBegin: '',
    timeEnd: ''
});

// 表格数据
const loading = ref(false);
const tableData = shallowRef([]);
const footer = ref({});
const selectionRows = ref([]);
const orderBy = ref('');
const pagination = ref({ currentPage: 1, pageSize: 20, total: 0 });

const columns = ref([
    { label: '移库单号', prop: 'mvNo', width: '180', fixed: 'left', sortable: true, slot: 'mvNo' },
    { label: '状态', prop: 'statusId', width: '100', sortable: true, slot: 'statusId' },
    { label: '仓库', prop: 'fromWarehouseCode', width: '120', sortable: true },
    { label: '移入仓库', prop: 'toWarehouseCode', width: '120', sortable: true },
    { label: '客户', prop: 'customerName', width: '180', sortable: true, slot: 'customer' },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建人', prop: 'createdBy', width: '120' },
    { label: '创建时间', prop: 'createdTime', width: '180', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '180', sortable: true },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);

// 事件处理
const handleSearch = (data) => {
    initValues.value = {
        ...data,
    };
    getList(1, pagination.value.pageSize);
};

const handleReset = (data) => {
    initValues.value = {
        ...data,
    };
    handleCascaderChange();
    getList(1, pagination.value.pageSize);
};

const getList = async (page, pageSize, orderByStr = orderBy.value) => {
    loading.value = true;
    try {
        const params = {
            page,
            pageSize,
            orderBy: orderByStr,
            ...initValues.value
        };
        const res = await getInventoryMvPageApi(params);
        if (res.success) {
            tableData.value = res.data.rows || [];
            footer.value = res.data.footer ? res.data.footer[0] : {};
            pagination.value = { currentPage: res.data.page, pageSize: pageSize, total: res.data.total };
        } else {
            tableData.value = [];
        }
    } catch (e) {
        console.error(e);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

const handleSelectionChange = (val) => selectionRows.value = val;
const handlePageChange = ({ pageSize, currentPage }) => getList(currentPage, pageSize);
const handleTableSort = (sort) => {
    orderBy.value = sort;
    getList(pagination.value.currentPage, pagination.value.pageSize);
};

const handleAdd = () => {
    router.push({ name: '新增移库' });
};

const handleEdit = (row) => {
    router.push({ name: '追加移库', params: { id: row.id, name: row.mvNo } });
};
const handleInfo = (row) => {
    router.push({ name: '移库详情', params: { id: row.id, name: row.mvNo } });
}

const exportDialogRef = ref(null);
const handleExport = () => exportDialogRef.value.openExportDialog();

// --- 批量完成---
const resultData = ref([]);
const resultDialogVisible = ref(false);
const promptMessage = ref('');

const handleComplete = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({ type: 'warning', message: '请选择要完成的数据！' });
        return;
    }
    ElMessageBox.confirm(
        `是否要完成${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        resultData.value = [];
        promptMessage.value = '操作中...';
        resultDialogVisible.value = true;

        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await completeInventoryMvApi({ id: selectionRows.value[i].id });
            resultData.value.push({
                id: selectionRows.value[i].mvNo,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！';
        loading.value = false;
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消' });
    });
};

const resultClose = () => {
    resultDialogVisible.value = false;
    resultData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
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
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};

onMounted(async () => {
    // 获取基础数据
    const [custRes, whRes, companyRes, statusRes] = await Promise.all([
        getCustomerLikeQueryApi({ keyword: '*' }),
        getWhWarehouseApi(),
        getOrgListCompanyApi(),
        getInventoryMvStatusEnumApi()
    ]);

    if (custRes.success) {
        customerOptions.value = custRes.data.map(item => ({
            value: item.code,
            label: item.code + '(' + item.name + ')'
        }));
    }
    if (whRes.success) {
        warehouseOptions.value = whRes.data.map(item => ({
            label: item.code + '(' + item.name + ')',
            value: item.id
        }));
    }
    if (companyRes.success) {
        // 处理公司数据
        const convertToTree = (items) => {
            return items.map(item => ({
                value: item.id,
                label: item.nameCn,
                children: item.children ? convertToTree(item.children) : []
            }));
        };
        companyOptions.value = convertToTree(companyRes.data);
    }
    if (statusRes.success) {
        statusOptions.value = statusRes.data;
    }

    getList(1, pagination.value.pageSize);
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>