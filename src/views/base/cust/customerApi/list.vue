<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')" class="compact-item">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')" class="compact-item">
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">
                        {{ getButtonText('del') }}
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
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 20 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #cusStatusName="{ row }">
                    <span :style="{ color: row.cusStatusId == 20 ? 'green' : 'red' }">{{ row.cusStatusName }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :companyOptions="companyOptions"
                :customerApiType="customerApiType" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('base_cust_customerApi_list.customerName')" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="API对接">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getCustomerApiListApi,
    getCustomerApiTypeEnumApi,
    updCustomerApiApi,
    addCustomerApiApi,
    delCustomerApiApi
} from "@/api/baseApi/cust.js";
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';


/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置
const formConfig = ref([
    { type: 'input', label: t('base_cust_customerApi_list.token'), prop: 'toUsToken' },
    { type: 'select', label: t('base_cust_customerApi_list.apiType'), prop: 'apiTypeId', options: [] },
    { type: 'date', label: t('base_cust_customerApi_list.createTime'), prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: t('base_cust_customerApi_list.endTime'), prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    customerCode: '',
    orgId: '',
    toUsToken: '',
    apiTypeId: '',
    createdTimeBegin: '',
    createdTimeEnd: ''
});

// 下拉选项数据
const customerOptions = ref([]);
const companyOptions = ref([]);
const customerApiType = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

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
const addData = ref({
    id: null,
    apiTypeId: '',
    customerCode: '',
    extend1: '',
    extend2: '',
    onlineTime: '',
    salesUserCode: '',
    toCSecretKey: '',
    toCToken: '',
    toCUrl: '',
    toUsSecretKey: '',
    toUsToken: '',
});

// 批量删除相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

/* 3. 计算属性 */
// 表格列定义
const columns = ref([
    { label: '公司', prop: 'orgName', width: '175', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '200', fixed: 'left', slot: 'customer', sortable: true },
    { label: '接口类型', prop: 'apiTypeName', width: '120', sortable: true },
    { label: '令牌(Token)', prop: 'toUsToken', width: '180', sortable: true },
    { label: '密钥(SecretKey)', prop: 'toUsSecretKey', width: '180' },
    { label: '客户系统名', prop: 'sysName', width: '235', sortable: true },
    { label: '回调地址', prop: 'toCUrl', width: '180', sortable: true },
    { label: '回调令牌', prop: 'toCToken', width: '180' },
    { label: '回调密钥', prop: 'toCSecretKey', width: '180' },
    { label: '上线时间', prop: 'onlineTime', width: '200', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`base_cust_customerApi_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getCustomerApiListApi({
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
    handleCascaderChange(); // 重置时也需要重置客户下拉
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 新增
const handleAdd = async () => {
    addData.value = {
        id: null,
        apiTypeId: '',
        customerCode: '',
        extend1: '',
        extend2: '',
        onlineTime: '',
        salesUserCode: '',
        toCSecretKey: '',
        toCToken: '',
        toCUrl: '',
        toUsSecretKey: '',
        toUsToken: '',
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 批量删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_cust_customerApi_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_cust_customerApi_list.confirmDelete', { count: selectionRows.value.length }),
        t('base_cust_customerApi_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('base_cust_customerApi_list.processing');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delCustomerApiApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].customerName,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('base_cust_customerApi_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_cust_customerApi_list.deleteCanceled')
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
            res = await updCustomerApiApi(addData.value);
        } else {
            res = await addCustomerApiApi(addData.value);
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
    console.log('选中的数据：', selectionRows.value);
};

// 行点击
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
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

// 批量删除弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 公司改变联动客户
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value?.togglePopperVisible();
        });
    }
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));
};

/* 6. 生命周期 */
onMounted(async () => {
    // 并发请求初始化数据
    const [apiTypeRes, customerRes, companyRes] = await Promise.all([
        getCustomerApiTypeEnumApi(),
        getCustomerLikeQueryApi({ keyword: '*' }),
        getOrgListCompanyApi()
    ]);

    // 处理接口类型
    customerApiType.value = apiTypeRes.data.map(item => ({ label: item.name, value: item.id }));
    formConfig.value[1] = {
        ...formConfig.value[1],
        options: customerApiType.value,
    };

    // 处理客户下拉
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));

    // 处理公司数据 (Tree)
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>