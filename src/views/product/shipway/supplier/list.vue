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
            <hydTable :tableData="tableData" :loading="loading" :columns="columns" :pagination="pagination"
                :enableSelection="true" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" @click="handleExport" v-permission="'export'" :icon="Share">
                        {{ getButtonText('export') }}
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
                        <div class="cursor-pointer" @click="openChannel(row)"
                            v-permission="'	supplierChannel:listBySupplierId'">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('channelInfo') }}</span>
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
                <template #website="{ row }">
                    <a :href="row.website" target="_blank">{{ row.website }}</a>
                </template>
            </hydTable>
        </div>

        <el-dialog :title="t('product_shipway_supplier_list.channelInfo')" v-model="ChannelDialogVisible" width="1480"
            align-center destroy-on-close>
            <el-button type="primary" @click="handleSubmitChannel">{{ getButtonText('addChannel') }}</el-button>
            <div style="height: 500px; overflow-y: auto;">
                <channel v-if="supplierChannelAddDTOList.length > 0" ref="channelListRef"
                    :formData="supplierChannelAddDTOList" @delete-item="handleDelChannel">
                </channel>
                <div v-else>
                    <p style="text-align: center;">{{ t('product_shipway_supplier_list.noData') }}</p>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="ChannelDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSaveChannel">
                        {{ getButtonText('save') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="106">
        </exportDialog>
    </div>
</template>

<script setup name="服务商(代理)">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, shallowRef, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Share, Document, EditPen, Tickets } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import channel from './channel.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue'; // 确保路径正确

// 1.3 API引入
import {
    getProductSupplierApi,
    getProductSupplierStatusEnumApi,
    getProductSupplierTypeEnumApi,
    getProductSupplierChannelListApi,
    updProductSupplierChannelApi
} from '@/api/productApi/shipway.js';

// 1.4 工具类及Store
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
    { type: 'select', label: '类型', prop: 'typeId', options: [] },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
]);

// 初始化表单数据
const initValues = ref({
    codeList: [],
    typeId: '',
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

// 导出
const exportDialogRef = ref(null);

// 渠道弹窗相关
const ChannelDialogVisible = ref(false);
const channelListRef = ref(null);
const supplierChannelAddDTOList = ref([]);
const dataId = ref('');

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '服务商代码', width: '180', prop: 'code', fixed: 'left', sortable: true },
    { label: '服务商名称', width: '180', prop: 'name', fixed: 'left', sortable: true },
    { label: '服务商类型', prop: 'typeName', width: '180', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'statusName' },
    { label: '服务商登录网站', prop: 'website', width: '200', slot: 'website' },
    { label: '联系人', prop: 'contactName', width: '180', sortable: true },
    { label: '手机号', prop: 'mobilePhone', width: '135' },
    { label: '邮箱', prop: 'email', width: '200' },
    { label: '联系地址', prop: 'contactAddress', width: '200', sortable: true },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '账号', prop: 'account', width: '120' },
    { label: '公司', prop: 'orgName', width: '135', sortable: true },
    { label: '拥有者', prop: 'owner', width: '120' },
    { label: 'API接口', prop: 'apiName', width: '180', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '155', fixed: 'right', slot: 'customBtn' }
]);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductSupplierApi({
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
    router.push('/product/shipway/supplier/add');
};

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑服务商',
        params: { id: row.id, name: row.name },
    });
};

// 详情
const handleInfo = (row) => {
    router.push({
        name: '服务商详情',
        params: { id: row.id, name: row.name },
    });
};

// 导出
const handleExport = async () => {
    exportDialogRef.value.openExportDialog();
};

// 打开渠道弹窗
const openChannel = async (row) => {
    dataId.value = row.id;
    const res = await getProductSupplierChannelListApi({ supplierId: row.id });
    supplierChannelAddDTOList.value = res.data;
    ChannelDialogVisible.value = true;
};

// 新增渠道行
const handleSubmitChannel = () => {
    supplierChannelAddDTOList.value.push({
        code: '',
        name: '',
        remake: ''
    });
};

// 删除渠道行
const handleDelChannel = (index) => {
    supplierChannelAddDTOList.value.splice(index, 1);
};

// 保存渠道
const handleSaveChannel = async () => {
    if (supplierChannelAddDTOList.value.length) {
        await channelListRef.value.validateForms();
    }
    const data = {
        supplierId: dataId.value,
        supplierChannelUpdDTOList: supplierChannelAddDTOList.value
    };
    console.log('保存渠道:', data);

    const res = await updProductSupplierChannelApi(data);
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        ChannelDialogVisible.value = false;
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

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [statusRes, typeRes] = await Promise.all([
        getProductSupplierStatusEnumApi(),
        getProductSupplierTypeEnumApi()
    ]);

    // 状态数据
    formConfig.value[1].options = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    // 类型数据
    formConfig.value[0].options = typeRes.data.map(item => ({ label: item.name, value: item.id }));

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