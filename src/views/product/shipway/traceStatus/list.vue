<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" filterable>
                                <el-option v-for="item in traceNodeOptions" :key="item.value" :label="item.label"
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">
                        {{ getButtonText('del') }}
                    </el-button>
                    <el-button type="warning" @click="handleRefresh" v-permission="'refreshCache'" :icon="Refresh">
                        {{ getButtonText('refreshCache') }}
                    </el-button>
                    <el-button type="success" @click="handleTest" v-permission="'outTrace:testTraceConfig'"
                        :icon="Connection">
                        {{ getButtonText('test') }}
                    </el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #isEnable="{ row }">
                    <span :style="{ color: row.isEnable ? 'green' : 'red' }">
                        {{ row.isEnable ? t('yes') : t('no') }}
                    </span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :logicTypeOptions="logicTypeOptions"
                :conditionTypeOptions="conditionTypeOptions" :traceNodeOptions="traceNodeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('product_shipway_traceStatus_list.statusName')" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="轨迹解析">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, Refresh, Connection, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getBasicTraceStatusPageApi,
    addBasicTraceStatusApi,
    updBasicTraceStatusApi,
    delBasicTraceStatusApi,
    getBasicTraceStatusByIdApi,
    getBasicTraceStatusConditionTypeEnumApi,
    getBasicTraceStatusLogicTypeEnumApi,
    getBasicTraceStatusRefreshCacheApi,
    getBasicTraceStatusTestApi
} from '@/api/productApi/shipway.js';
import { getOutstockOrderTraceNodeEnumApi } from '@/api/outstockApi/trace.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置
const formConfig = ref([
    { type: 'input', label: '关键词', prop: 'remark', placeholder: '请输入关键词' },
    {
        type: 'select', label: '是否启用', prop: 'isEnable', placeholder: '请选择是否启用', options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({});

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

// 批量删除相关
const delData = ref([]);
const promptMessage = ref('');
const delDialogVisible = ref(false);

// 下拉选项数据
const conditionTypeOptions = ref([]);
const logicTypeOptions = ref([]);
const traceNodeOptions = ref([]);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '状态ID', prop: 'statusId', width: '110', sortable: true },
    { label: '状态名称', prop: 'statusName', width: '135', sortable: true },
    { label: '是否启用', prop: 'isEnable', width: '115', sortable: true, slot: 'isEnable' },
    { label: '备注', prop: 'remark', width: '250' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`base_basic_traceStatus_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicTraceStatusPageApi({
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
const handleAdd = async () => {
    addData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = async (row) => {
    const res = await getBasicTraceStatusByIdApi({ id: row.id });
    if (res.success) {
        addData.value = res.data;
        dialogMode.value = 'upd';
        centerDialogVisible.value = true;
    } else {
        smartAlert(res.msg, res.success, 1000);
    }
};

// 删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('product_shipway_traceStatus_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('product_shipway_traceStatus_list.confirmDelete', { count: selectionRows.value.length }),
        t('product_shipway_traceStatus_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('product_shipway_traceStatus_list.processing');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delBasicTraceStatusApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].statusName,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('product_shipway_traceStatus_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_traceStatus_list.deleteCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updBasicTraceStatusApi(addData.value);
        } else {
            res = await addBasicTraceStatusApi(addData.value);
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

// 刷新缓存
const handleRefresh = async () => {
    ElMessageBox.confirm(
        t('product_shipway_traceStatus_list.confirmRefresh'),
        t('product_shipway_traceStatus_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await getBasicTraceStatusRefreshCacheApi();
            smartAlert(res.msg, res.success, 1000);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_traceStatus_list.refreshCanceled')
            });
        });
};

// 测试
const handleTest = () => {
    ElMessageBox.prompt(t('product_shipway_traceStatus_list.enterTraceContent'), t('product_shipway_traceStatus_list.test'), {
        confirmButtonText: getButtonText('confirm'),
        cancelButtonText: getButtonText('cancel'),
        inputPlaceholder: t('product_shipway_traceStatus_list.testContentPlaceholder'),
        inputErrorMessage: t('product_shipway_traceStatus_list.contentRequired'),
        inputValidator: (value) => {
            return !!value || t('product_shipway_traceStatus_list.contentRequired');
        }
    })
        .then(async ({ value }) => {
            try {
                const res = await getBasicTraceStatusTestApi({ testTraceConfig: value });
                const msg = `${t('product_shipway_traceStatus_list.statusName')}: ${res.data.name}， ${t('product_shipway_traceStatus_list.statusId')}: ${res.data.id}， ${t('product_shipway_traceStatus_list.isCustomerVisible')}: ${res.data.value ? t('yes') : t('no')}`;
                smartAlert(msg, false, 1000);
            } catch (error) {
                console.error('测试接口调用失败:', error);
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_traceStatus_list.testCanceled')
            });
        });
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
    // 使用 Promise.all 并发请求
    const [conditionRes, logicRes, traceNodeRes] = await Promise.all([
        getBasicTraceStatusConditionTypeEnumApi(),
        getBasicTraceStatusLogicTypeEnumApi(),
        getOutstockOrderTraceNodeEnumApi()
    ]);

    conditionTypeOptions.value = conditionRes.data.map(item => ({ label: item.name, value: item.id }));
    logicTypeOptions.value = logicRes.data.map(item => ({ label: item.name, value: item.id }));
    traceNodeOptions.value = traceNodeRes.data.map(item => ({ label: item.name, value: item.id }));

});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>