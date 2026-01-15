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
                        <div class="cursor-pointer" @click="handleSetRoleMenu(row)" v-permission="'role:authorize'">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>{{ getButtonText('authorize') }} </span>
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

        <el-dialog v-model="setRoleDialogVisible" :title="t('sys_user_role_list.authorize')" width="700" align-center
            destroy-on-close>
            <setRole :formData="addData" ref="roleDialogRef" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSetRoleMenuConfirm">{{ getButtonText('confirm')
                    }}</el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('sys_user_role_list.roleName')" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="角色">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, DeleteFilled, EditPen } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 Components
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import setRole from './setRole.vue';

// 1.3 API
import {
    getUserRoleListApi,
    addUserRoleDataApi,
    updateUserRoleDataApi,
    delUserRoleDataApi,
    setUserRoleMenuApi
} from '@/api/sysApi/user.js';

// 1.4 Utils
import { smartAlert } from '@/utils/genericMethods.js';
import { getButtonText } from '@/utils/i18n/i18nLabels.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();

// 表格数据
const tableData = shallowRef([]);
const loading = ref(true);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});

// 选择及排序
const selection = ref({});
const selectionRows = ref([]);
const orderBy = ref('');

// 弹窗状态
const centerDialogVisible = ref(false);
const dialogMode = ref('add'); // 'add' | 'upd'
const childFormRef = ref(null);

// 授权相关
const roleDialogRef = ref(null);
const setRoleDialogVisible = ref(false);

// 批量删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

// 表单数据模型
const addData = ref({
    id: null,
    name: '',
    remark: '',
    sortNo: null,
});

/* 3. 计算属性 */
// 表格列定义
const columns = ref([
    { label: '角色名称', prop: 'name', width: '150', sortable: true },
    { label: '备注', prop: 'remark', width: '300' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '155', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题及组件
const dialogTitle = computed(() => t(`sys_user_role_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderByStr) => {
    loading.value = true;
    try {
        const res = await getUserRoleListApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr
        });
        tableData.value = Object.freeze(res.data.rows);
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
    } finally {
        loading.value = false;
    }
};

// 点击新增
const handleAdd = () => {
    addData.value = {
        id: null,
        name: '',
        remark: '',
        sortNo: null,
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击编辑
const handleEdit = (row) => {
    addData.value = {
        id: row.id,
        name: row.name,
        remark: row.remark,
        sortNo: row.sortNo
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 点击授权
const handleSetRoleMenu = (row) => {
    addData.value = { ...row };
    setRoleDialogVisible.value = true;
};

// 确认授权
const handleSetRoleMenuConfirm = async () => {
    const menuIds = await roleDialogRef.value.handleSelection();
    const res = await setUserRoleMenuApi({ roleId: addData.value.id, menuIds: menuIds });
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        setRoleDialogVisible.value = false;
    }
};

// 点击删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('sys_user_role_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('sys_user_role_list.confirmDelete', { count: selectionRows.value.length }),
        t('sys_user_role_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    ).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = t('sys_user_role_list.processing');

        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await delUserRoleDataApi({ id: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].name,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = t('sys_user_role_list.operationComplete');
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: t('sys_user_role_list.deleteCanceled')
        });
    });
};

// 弹窗确认保存
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res = null;
        const data = { ...addData.value };

        if (dialogMode.value === 'upd') {
            res = await updateUserRoleDataApi(data);
        } else {
            res = await addUserRoleDataApi(data);
        }

        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            centerDialogVisible.value = false;
        }
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};

/* 5. 辅助方法 */

// 表格选中改变
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
    console.log('选中的数据：', selectionRows.value);
};

// 表格行点击
const handleRowClick = (row) => {
    selection.value = row;
};

// 分页改变
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 排序改变
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

/* 6. 生命周期 */
onMounted(() => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>