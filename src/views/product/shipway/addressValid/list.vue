<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" :icon="Delete">{{ getButtonText('del') }}</el-button>
                    <el-button type="success" @click="handleTest" :icon="Connection">{{ getButtonText('test')
                        }}</el-button>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleStatusChange(row)">
                            <el-icon>
                                <Switch />
                            </el-icon>
                            <span :style="{ color: row.statusId == 10 ? 'red' : 'green' }">{{ row.statusId == 10 ?
                                getButtonText('disable') : getButtonText('enable')
                                }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1000px" align-center destroy-on-close
            :close-on-click-modal="false">
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                @close="handleDialogCancel" @success="handleDialogSuccess" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 测试弹窗 -->
        <TestDialog ref="testDialogRef" />
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData"
            :nameField="'configName'" :nameLabel="'配置名称'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="地址校验">
import { ref, computed, onMounted, nextTick, shallowRef } from 'vue';
import { Plus, Delete, EditPen, Switch, Connection } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 接口导入
import {
    getAddressValidPageApi,
    delAddressValidApi,
    updAddressValidStatusApi,
    getAddressValidStatusEnumApi
} from '@/api/productApi/shipway.js';
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';

// 组件导入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
import TestDialog from './testDialog.vue';
const { t } = useI18n();

// -------------------------- 变量定义 --------------------------
const editInitData = ref({});
const centerDialogVisible = ref(false);
const childFormRef = ref(null);
const dialogMode = ref('add');

// 搜索配置
const formConfig = ref([
    { type: 'input', label: '配置名称', prop: 'configName' },
    { type: 'select', label: '承运商', prop: 'carrierCode', options: [], filterable: true },
    { type: 'select', label: '国家', prop: 'countryCode', options: [], filterable: true },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
]);
const initValues = ref({});

// 表格配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '配置名称', prop: 'configName', width: '180', fixed: 'left', sortable: true },
    { label: '关联承运商', prop: 'carrierCode', width: '300' },
    { label: '关联国家', prop: 'countryCode', width: '300' },
    { label: '规则数量', prop: 'ruleCount', width: '100' },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName' },
    { label: '备注', prop: 'remark', width: '150' },
    { label: '创建人', prop: 'createdBy', width: '120' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '160', fixed: 'right', slot: 'customBtn' }
]);
const footer = ref();
const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 });
const loading = ref(true);
const selectionRows = ref([]);
const orderBy = ref('');

// -------------------------- 方法实现 --------------------------

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

// 获取列表
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getAddressValidPageApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = res.data.rows;
        footer.value = res.data.footer[0];
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
    } catch (error) {
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

// 表格事件
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

// 弹窗相关
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => dialogMode.value === 'add' ? '新增地址校验配置' : '编辑地址校验配置');

const handleAdd = () => {
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleEdit = (row) => {
    editInitData.value = { id: row.id };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

const handleDialogConfirm = async () => {
    if (childFormRef.value) {
        await childFormRef.value.handleSubmit();
    }
};

const handleDialogSuccess = () => {
    centerDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

const handleDel = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning('请选择要删除的数据！');
    ElMessageBox.confirm(`是否要删除${selectionRows.value.length}条数据?`, '提醒', {
        type: 'warning'
    }).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...';
        for (const row of selectionRows.value) {
            const res = await delAddressValidApi({ id: row.id });
            delData.value.push({
                configName: row.configName,
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
};

// 测试
const testDialogRef = ref(null);
const handleTest = () => {
    testDialogRef.value.open();
}

// 启用/禁用
const handleStatusChange = async (row) => {
    const newStatus = row.statusId === 10 ? 20 : 10;
    const actionText = newStatus === 10 ? '启用' : '停用';
    ElMessageBox.confirm(`确认要${actionText}该配置吗？`, '提示', { type: 'warning' })
        .then(async () => {
            const res = await updAddressValidStatusApi({ id: row.id, statusId: newStatus });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            }
        }).catch(() => { });
};

// 初始化下拉数据
onMounted(async () => {
    // 承运商
    const carrierRes = await getProductShipwayBrandListApi();
    if (carrierRes.success) {
        formConfig.value[1].options = carrierRes.data.map(item => ({ label: `${item.code}(${item.name})`, value: item.code }));
    }
    // 国家
    const countryRes = await getOrgCountryListApi();
    if (countryRes.success) {
        formConfig.value[2].options = countryRes.data.map(item => ({ label: `${item.code}(${item.nameCn})`, value: item.code }));
    }
    // 状态
    const statusRes = await getAddressValidStatusEnumApi();
    if (statusRes.success) {
        formConfig.value[3].options = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>