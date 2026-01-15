<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('codeList')">
                            <canonicalInput v-model:listName="formData.codeList"
                                :placeholder="getPlaceholder('codeList')" clearable>
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
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" @click="handleDel(10)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('enable') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel(20)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('disable') }}
                    </el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)" v-permission="'getVoById'">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1300" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :statusOptions="statusOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button v-if="dialogMode != 'info'" type="primary" @click="handleDialogConfirm">{{
                        getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="t('product_shipway_carrier_list.operationResult')" :isVisible="delDialogVisible"
            :tableData="delData" :nameField="'id'" :nameLabel="t('product_shipway_carrier_list.carrierCode')"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="承运商">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Edit, Share, Document, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import InfoForm from './info.vue';

// 1.3 API引入
import {
    getProductShipwayBrandPageApi,
    getProductShipwayBrandStatusEnumApi,
    addProductShipwayBrandApi,
    getProductShipwayBrandInfoApi,
    updProductShipwayBrandApi,
    setProductShipwayCarrierUpdateStatusApi
} from '@/api/productApi/shipway.js';

// 1.4 工具类及Store
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getButtonText, getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels.js';
import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
    { type: 'input', label: '承运名称', prop: 'name', clearable: true },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
]);

// 初始化表单数据
const initValues = ref({
    codeList: [],
    name: '',
    statusId: '',
    createdTimeBegin: '',
    createdTimeEnd: ''
});

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
const dialogMode = ref('add'); // 'add' | 'upd' | 'info'
const childFormRef = ref(null);
const addData = ref({});

// 批量操作相关
const delData = ref([]);
const promptMessage = ref('');
const delDialogVisible = ref(false);

// 下拉选项数据
const statusOptions = ref([]);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '承运商代码', width: '150', prop: 'code', fixed: 'left', sortable: true },
    { label: '承运商名称', width: '150', prop: 'name', fixed: 'left', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'statusName' },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '145', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`product_shipway_carrier_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : dialogMode.value == 'upd' ? UpdForm : InfoForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayBrandPageApi({
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
const handleAdd = () => {
    addData.value = {
        id: null,
        code: '',
        remark: '',
        name: '',
        statusId: '',
        carrierServiceAddDTOList: [],
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = async (row) => {
    const res = await getProductShipwayBrandInfoApi({ id: row.id });
    addData.value = {
        ...res.data,
        carrierServiceAddDTOList: res.data.carrierServiceList
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 详情
const handleInfo = async (row) => {
    const res = await getProductShipwayBrandInfoApi({ id: row.id });
    addData.value = {
        ...res.data,
        carrierServiceAddDTOList: res.data.carrierServiceList
    };
    dialogMode.value = 'info';
    centerDialogVisible.value = true;
};

// 批量修改状态 (启用/禁用)
const handleDel = (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('product_shipway_carrier_list.selectChange')
        });
        return;
    }
    const actionText = statusId == 10 ? t('product_shipway_carrier_list.enable') : t('product_shipway_carrier_list.disable');
    ElMessageBox.confirm(
        t('product_shipway_carrier_list.confirmChange', { action: actionText, count: selectionRows.value.length }),
        t('product_shipway_carrier_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = t('product_shipway_carrier_list.processing');
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await setProductShipwayCarrierUpdateStatusApi({ id: selectionRows.value[i].id, statusId: statusId });
                delData.value.push({
                    id: selectionRows.value[i].code + '-' + selectionRows.value[i].name,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('product_shipway_carrier_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_carrier_list.operationCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validateMain();
        await childFormRef.value.validateServices();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updProductShipwayBrandApi(addData.value);
        } else {
            res = await addProductShipwayBrandApi(addData.value);
        }

        if (res.success) {
            smartAlert(res.msg, res.success, 1000);
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        } else {
            loading.value = false;
            centerDialogVisible.value = true; // 保持弹窗开启以便修改
            ElMessageBox.alert(res.msg, t('product_shipway_carrier_list.reminder'), {
                confirmButtonText: getButtonText('confirm'),
                type: 'warning'
            });
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

// 批量结果弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 获取状态枚举
    const res = await getProductShipwayBrandStatusEnumApi();
    statusOptions.value = res.data.map(item => ({ label: item.name, value: item.id }));
    formConfig.value[1].options = statusOptions.value;
});

// 监听刷新
onActivated(() => {
    if (refreshStore.shouldRefreshSupplierList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        refreshStore.shouldRefreshSupplierList = false;
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>