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
                    <el-button type="success" @click="handleDel(10)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('enable') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel(20)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('disable') }}
                    </el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)" v-permission="'shipway:getVoById'">
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
                        <div class="cursor-pointer" @click="handleLog(row)" v-permission="'opLog:listByObjId'">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('log') }}</span>
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
                <template #channelSelect="{ row }">
                    <span>{{ row.channelSelect == 1 ? t('product_shipway_shipway_list.oneToOne') :
                        t('product_shipway_shipway_list.lowestPrice') }}</span>
                </template>
                <template #weight="{ row }">
                    <span>{{ row.minWeight && row.maxWeight ? row.minWeight + '-' + row.maxWeight : '' }}</span>
                </template>
                <template #volume="{ row }">
                    <span>{{ row.minVolume && row.maxVolume ? row.minVolume + '-' + row.maxVolume : '' }}</span>
                </template>
                <template #day="{ row }">
                    <span>{{ row.minDay && row.maxDay ? row.minDay + '-' + row.maxDay : '' }}</span>
                </template>
            </hydTable>
        </div>

        <batchOperationn :dialogTitle="t('product_shipway_shipway_list.statusUpdateResult')"
            :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('product_shipway_shipway_list.product')" @close="delColse" :promptMessage="promptMessage" />

        <el-dialog v-model="centerDialogVisible" :title="t('product_shipway_shipway_list.log')" width="1300"
            align-center destroy-on-close>
            <div style="height: 500px;">
                <LogForm :formData="addData"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="物流产品">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, shallowRef, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Tickets, Edit, Document, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import LogForm from '@/components/table/logTableById.vue';

// 1.3 API引入
import {
    getProductShipwayPageApi,
    getProductShipwayStatusEnumApi,
    getProductShipwayTypeEnumApi,
    setProductShipwayShipwayUpdateStatusApi,
    getProductShipwayBrandListApi
} from '@/api/productApi/shipway.js';

// 1.4 工具类及Store
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
    { type: 'input', label: '产品名称', prop: 'name' },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'select', label: '运输方式', prop: 'typeId', options: [] },
    { type: 'select', label: '承运商', prop: 'carrierCode', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
]);

// 初始化表单数据
const initValues = ref({
    num: '',
    statusId: '',
    orgId: '',
    departmentId: '',
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
const addData = ref({});

// 批量操作相关
const delData = ref([]);
const promptMessage = ref('');
const delDialogVisible = ref(false);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '产品代码', prop: 'code', width: '155', fixed: 'left', sortable: true },
    { label: '产品名称', prop: 'productName', width: '140', fixed: 'left', slot: 'name', sortAlias: 'name' },
    { label: '状态', prop: 'statusName', width: '125', sortable: true, slot: 'statusName' },
    { label: '运输方式', prop: 'typeName', width: '180', sortable: true },
    { label: '渠道模式', prop: 'channelSelect', width: '180', slot: 'channelSelect', sortable: true },
    { label: '承运商', prop: 'carrierName', width: '115', sortable: true },
    { label: '重量范围(实重KG)', prop: 'weight', width: '240', slot: 'weight' },
    { label: '体积范围(M³)', prop: 'volume', width: '220', slot: 'volume' },
    { label: '时效范围(天数)', prop: 'day', width: '240', slot: 'day' },
    { label: '保险服务', prop: 'insuranceName', width: '200' },
    { label: '签名服务', prop: 'signatureName', width: '200' },
    { label: '上传面单', prop: 'uploadWaybillName', width: '200' },
    { label: '渠道描述', prop: 'description', width: '200' },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
]);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
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
    // departmentOptions.value = [] // 原代码有清空部门选项，但 template 未使用
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 新增
const handleAdd = async () => {
    router.push('/product/shipway/shipway/add');
};

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑物流产品',
        params: { id: row.id, name: row.name },
    });
};

// 详情
const handleInfo = (row) => {
    router.push({
        name: '物流产品详情',
        params: { id: row.id, name: row.name },
    });
};

// 日志
const handleLog = async (row) => {
    addData.value = { ...row };
    centerDialogVisible.value = true;
};

// 批量修改状态 (启用/停用)
const handleDel = (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('product_shipway_shipway_list.selectChange')
        });
        return;
    }
    const actionText = statusId == 10 ? t('product_shipway_shipway_list.enable') : t('product_shipway_shipway_list.disable');
    ElMessageBox.confirm(
        t('product_shipway_shipway_list.confirmChange', { action: actionText, count: selectionRows.value.length }),
        t('product_shipway_shipway_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('product_shipway_shipway_list.processing');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await setProductShipwayShipwayUpdateStatusApi({ id: selectionRows.value[i].id, statusId });
                delData.value.push({
                    id: selectionRows.value[i].code + '-' + selectionRows.value[i].name,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('product_shipway_shipway_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_shipway_list.operationCanceled')
            });
        });
};

// 批量结果弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 日志弹窗关闭
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
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

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [statusRes, typeRes, brandRes] = await Promise.all([
        getProductShipwayStatusEnumApi(),
        getProductShipwayTypeEnumApi(),
        getProductShipwayBrandListApi()
    ]);

    // 状态菜单
    formConfig.value[1].options = statusRes.data.map((item) => ({
        value: item.id,
        label: item.name
    }));

    // 运输方式菜单
    formConfig.value[2].options = typeRes.data.map((item) => ({
        value: item.id,
        label: item.name
    }));

    // 承运商
    formConfig.value[3].options = brandRes.data.map((item) => ({
        value: item.code,
        label: item.name
    }));
});

// 监听刷新
onActivated(() => {
    if (refreshStore.shouldRefreshShipwayList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        refreshStore.shouldRefreshShipwayList = false;
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>