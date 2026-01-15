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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">
                        {{ getButtonText('del') }}
                    </el-button>
                    <el-button type="success" @click="handleTest" v-permission="'test'" :icon="Connection">
                        {{ getButtonText('test') }}
                    </el-button>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleStatusChange(row)" v-permission="'updateStatus'">
                            <el-icon>
                                <Switch />
                            </el-icon>
                            <span :style="{ color: row.statusId == 10 ? 'red' : 'green' }">
                                {{ row.statusId == 10 ? getButtonText('disable') : getButtonText('enable') }}
                            </span>
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
        
        <TestDialog ref="testDialogRef" />
        
        <batchOperationn :dialogTitle="t('product_shipway_addressValid_list.operationResult')"
            :isVisible="delDialogVisible" :tableData="delData" :nameField="'configName'"
            :nameLabel="t('product_shipway_addressValid_list.configName')" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="地址校验">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, EditPen, Switch, Connection } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import TestDialog from './testDialog.vue';

// 1.3 API引入
import {
    getAddressValidPageApi,
    delAddressValidApi,
    updAddressValidStatusApi,
    getAddressValidStatusEnumApi
} from '@/api/productApi/shipway.js';
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索配置 (Label保持中文)
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
const selectionRows = ref([]);
const orderBy = ref('');

// 弹窗相关
const editInitData = ref({});
const centerDialogVisible = ref(false);
const childFormRef = ref(null);
const dialogMode = ref('add');

// 批量删除相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

// 测试弹窗
const testDialogRef = ref(null);

/* 3. 计算属性 */
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => t(`product_shipway_addressValid_list.${dialogMode.value}Title`));

/* 4. 业务逻辑 (CRUD) */

// 获取列表
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getAddressValidPageApi({
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
        tableData.value = [];
    } finally {
        loading.value = false;
    }
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
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
    editInitData.value = { id: row.id };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 删除
const handleDel = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning(t('product_shipway_addressValid_list.selectDelete'));
    ElMessageBox.confirm(
        t('product_shipway_addressValid_list.confirmDelete', { count: selectionRows.value.length }),
        t('product_shipway_addressValid_list.reminder'),
        { type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = t('product_shipway_addressValid_list.processing');
        for (const row of selectionRows.value) {
            const res = await delAddressValidApi({ id: row.id });
            delData.value.push({
                configName: row.configName,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = t('product_shipway_addressValid_list.operationComplete');
    }).catch(() => { });
};

// 启用/禁用
const handleStatusChange = async (row) => {
    const newStatus = row.statusId === 10 ? 20 : 10;
    const actionText = newStatus === 10 ? t('product_shipway_addressValid_list.enable') : t('product_shipway_addressValid_list.disable');
    ElMessageBox.confirm(
        t('product_shipway_addressValid_list.confirmStatusChange', { action: actionText }),
        t('product_shipway_addressValid_list.reminder'),
        { type: 'warning' }
    )
        .then(async () => {
            const res = await updAddressValidStatusApi({ id: row.id, statusId: newStatus });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            }
        }).catch(() => { });
};

// 测试
const handleTest = () => {
    testDialogRef.value.open();
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (childFormRef.value) {
        await childFormRef.value.handleSubmit();
    }
};

// 弹窗成功回调
const handleDialogSuccess = () => {
    centerDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗取消
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 批量删除结果关闭
const delColse = () => {
    delDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 5. 辅助方法 */

// 表格选中
const handleSelectionChange = (val) => selectionRows.value = val;

// 行点击
const handleRowClick = (row) => { };

// 分页变化
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(currentPage, pageSize, orderBy.value);
};

// 排序变化
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, sortString);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [carrierRes, countryRes, statusRes] = await Promise.all([
        getProductShipwayBrandListApi(),
        getOrgCountryListApi(),
        getAddressValidStatusEnumApi()
    ]);

    // 承运商
    if (carrierRes.success) {
        formConfig.value[1].options = carrierRes.data.map(item => ({ label: `${item.code}(${item.name})`, value: item.code }));
    }
    // 国家
    if (countryRes.success) {
        formConfig.value[2].options = countryRes.data.map(item => ({ label: `${item.code}(${item.nameCn})`, value: item.code }));
    }
    // 状态
    if (statusRes.success) {
        formConfig.value[3].options = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>