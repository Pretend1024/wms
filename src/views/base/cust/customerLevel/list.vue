<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="DeleteFilled">
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
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('base_cust_customerLevel_list.nameLabel')" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='客户等级'>
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, DeleteFilled, EditPen } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getCustomerLevelEnumApi,
    addCustomerLevelApi,
    updCustomerLevelApi,
    delCustomerLevelApi
} from '@/api/baseApi/cust.js';

// 1.4 工具类引入
import { smartAlert } from '@/utils/genericMethods.js';
import { getButtonText } from '@/utils/i18n/i18nLabels.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

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
    name: '',
    remark: '',
    sortNo: null,
    days: '',
    money: '',
});

// 批量删除相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

/* 3. 计算属性 */
// 表格列定义
const columns = ref([
    { label: '等级名称', prop: 'name', width: '150', sortable: true },
    { label: '消费金额', prop: 'money', width: '220', sortable: true },
    { label: '统计天数', prop: 'days', width: '170', sortable: true },
    { label: '备注', prop: 'remark', width: '300' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`base_cust_customerLevel_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getCustomerLevelEnumApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy
    });
    tableData.value = Object.freeze(res.data.rows);
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};

// 新增
const handleAdd = () => {
    addData.value = {
        id: null,
        name: '',
        remark: '',
        sortNo: null,
        days: '',
        money: '',
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
    console.log('编辑：', row);
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 批量删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_cust_customerLevel_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_cust_customerLevel_list.confirmDelete', { count: selectionRows.value.length }),
        t('base_cust_customerLevel_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('base_cust_customerLevel_list.processing');
            delDialogVisible.value = true;
            let res;
            for (let i = 0; i < selectionRows.value.length; i++) {
                res = await delCustomerLevelApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].name,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('base_cust_customerLevel_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_cust_customerLevel_list.deleteCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        // 数值转换
        addData.value.sortNo = Number(addData.value.sortNo);
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updCustomerLevelApi(addData.value);
        } else {
            res = await addCustomerLevelApi(addData.value);
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
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
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
    console.log('排序条件返回:', sortString);
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

/* 6. 生命周期 */
onMounted(() => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>