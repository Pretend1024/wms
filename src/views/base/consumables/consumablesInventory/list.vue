<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
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
                    <el-button type="success" @click="handleExport" :icon="Share" v-permission="'export'">{{
                        getButtonText('export')
                    }}</el-button>
                    <el-button type="info" @click="handlePrint" :icon="Printer" v-permission="'print'">{{
                        getButtonText('print') }}</el-button>
                </template>
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName :
                        t('base_consumables_consumablesInventory_list.none') }})
                </template>
                <template #consumablesCode="{ row }">
                    {{ row.consumablesCode }}({{ row.consumablesName }})
                </template>
                <template #isPublic="{ row }">
                    <span :style="{ color: row.isPublic ? 'green' : 'red' }">{{ row.isPublic ? t('yes') : t('no')
                    }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="600" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="103">
        </exportDialog>
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="105">
        </printDialog>
    </div>
</template>

<script setup name="耗材库存">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Printer, Share, EditPen } from '@element-plus/icons-vue';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import UpdForm from './upd.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import printDialog from '@/components/print-export-importDialog/printDialog.vue';

// 1.3 API引入
import {
    getBasicConsumablesInventoryListApi,
    addBasicConsumablesInventoryApi,
    updBasicConsumablesInventoryApi,
    getBasicConsumablesListEnumApi
} from '@/api/baseApi/consumables.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置 (Label保留中文, Options翻译)
const formConfig = ref([
    { type: 'select', label: '耗材类型', prop: 'consumablesCodes', options: [] },
    {
        type: 'select', label: '是否公用', prop: 'isPublic', options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    consumablesCodes: '',
    warehouseCode: '',
    customerCode: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
});

// 下拉选项数据
const warehouseOptions = ref([]);
const customerOptions = ref([]);

// 表格数据与分页
const tableData = shallowRef([]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const orderBy = ref('');

// 选中数据
const selection = ref({});
const selectionRows = ref([]);

// 弹窗状态
const centerDialogVisible = ref(false);
const dialogMode = ref('add'); // 'add' | 'upd'
const childFormRef = ref(null);
const addData = ref({});

// 导出与打印
const exportDialogRef = ref(null);
const printDialogRef = ref(null);

/* 3. 计算属性 */
// 表格列配置 (Label保留中文)
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '耗材类型', prop: 'consumablesCode', width: '200', sortable: true, fixed: 'left', slot: 'consumablesCode' },
    { label: '耗材条码', prop: 'consumablesBarcode', width: '190', sortable: true, fixed: 'left' },
    { label: '是否公用', prop: 'isPublic', width: '125', slot: 'isPublic' },
    { label: '库存数量', prop: 'quantity', width: '155', sortable: true },
    { label: '备注', prop: 'remark', width: '250' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`base_consumables_consumablesInventory_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 表格事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
    console.log('选中的数据：', selectionRows.value);
};

const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    console.log('分页变化：', pageSize, currentPage);
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString);
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 编辑
const handleEdit = (row) => {
    console.log('编辑：', row);
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 导出
const handleExport = async () => {
    exportDialogRef.value.openExportDialog();
};

// 打印
const handlePrint = async () => {
    printDialogRef.value.openPrintDialog();
};

// 弹窗确定按钮
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updBasicConsumablesInventoryApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addBasicConsumablesInventoryApi(addData.value);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        smartAlert(res.msg, res.success, 1000);
        loading.value = false;
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};

// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicConsumablesInventoryListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = Object.freeze(res.data.rows);
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [warehouseRes, consumablesRes, customerRes] = await Promise.all([
        getWhWarehouseApi(),
        getBasicConsumablesListEnumApi(),
        getCustomerLikeQueryApi({ keyword: '*' })
    ]);

    // 仓库数据
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }));

    // 耗材类型
    formConfig.value[0].options = consumablesRes.data.map(item => ({
        value: item.code,
        label: item.name + '(' + item.code + ')'
    }));

    // 客户数据
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>