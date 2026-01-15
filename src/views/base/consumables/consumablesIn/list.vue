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
                    <el-col>
                        <el-form-item :label="getLabel('billNoList')">
                            <canonicalInput v-model:listName="formData.billNoList"
                                :placeholder="getPlaceholder('billNoList')" clearable>
                            </canonicalInput>
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('inbound') }}
                    </el-button>
                    <el-button type="success" @click="handleExport" v-permission="'export'" :icon="Share">
                        {{ getButtonText('export') }}
                    </el-button>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : t('none') }})
                </template>
                <template #consumablesCode="{ row }">
                    {{ row.consumablesCode }}({{ row.consumablesName }})
                </template>
                <template #isPublic="{ row }">
                    <span :style="{ color: row.isPublic ? 'green' : 'red' }">
                        {{ row.isPublic ? t('yes') : t('no') }}
                    </span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions"
                :consumablesOptions="consumablesOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="104">
        </exportDialog>
    </div>
</template>

<script setup name="耗材入库">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Share, Plus, EditPen } from '@element-plus/icons-vue';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import AddForm from './add.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';

// 1.3 API引入
import {
    getBasicConsumablesInventoryInListApi,
    addBasicConsumablesInventoryInApi,
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

// 搜索表单配置
const formConfig = ref([
    { type: 'select', label: '耗材类型', prop: 'consumablesCode', options: [] },
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
    consumablesCode: '',
    warehouseCode: '',
    customerCode: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    billNoList: [],
});

// 下拉选项数据
const warehouseOptions = ref([]);
const consumablesOptions = ref([]);
const customerOptions = ref([]);

// 表格数据与分页
const tableData = shallowRef([]);
const footer = ref({});
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

// 导出组件引用
const exportDialogRef = ref(null);

/* 3. 计算属性 */
// 表格列定义
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '入库单号', prop: 'billNo', width: '145', fixed: 'left', sortable: true },
    { label: '耗材条码', prop: 'consumablesBarcode', width: '190', sortable: true },
    { label: '耗材类型', prop: 'consumablesCode', width: '200', sortable: true, slot: 'consumablesCode' },
    { label: '是否公用', prop: 'isPublic', width: '125', slot: 'isPublic' },
    { label: '成本单价', prop: 'costPrice', width: '130', sortable: true },
    { label: '入库数量', prop: 'quantity', width: '140', sortable: true },
    { label: '成本总价', prop: 'totalCostPrice', width: '135', sortable: true },
    { label: '备注', prop: 'remark', width: '250' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
]);

// 弹窗标题 (使用i18n)
const dialogTitle = computed(() => t(`base_consumables_consumablesIn_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicConsumablesInventoryInListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = Object.freeze(res.data.rows);
    footer.value = res.data.footer[0];
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};

// 搜索
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 新增
const handleAdd = async () => {
    addData.value = {
        id: null,
        consumablesBarcode: '',
        consumablesCode: '',
        consumablesName: '',
        customerCode: '',
        quantity: '',
        remark: '',
        warehouseCode: '',
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 导出
const handleExport = async () => {
    exportDialogRef.value.openExportDialog();
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updBasicConsumablesInventoryApi(addData.value);
        } else {
            res = await addBasicConsumablesInventoryInApi(addData.value);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        loading.value = false;
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};

/* 5. 辅助方法 */

// 表格选中
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
};

// 行点击
const handleRowClick = (row) => {
    selection.value = row;
};

// 分页变化
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 排序变化
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗取消
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [warehouseRes, customerRes, consumablesRes] = await Promise.all([
        getWhWarehouseApi(),
        getCustomerLikeQueryApi({ keyword: '*' }),
        getBasicConsumablesListEnumApi()
    ]);

    // 仓库数据
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }));

    // 客户数据
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));

    // 耗材类型数据
    consumablesOptions.value = consumablesRes.data.map(item => ({
        value: item.code,
        label: item.name + '(' + item.code + ')'
    }));
    formConfig.value[0].options = consumablesOptions.value;
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>