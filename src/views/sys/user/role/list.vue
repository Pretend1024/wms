<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="DeleteFilled">
                        {{ getButtonText('del') }}
                    </el-button>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleSetRoleMenu(row)">
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
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 受权弹窗 -->
        <el-dialog v-model="setRoleDialogVisible" :title="setRoleTitle" width="700" align-center destroy-on-close>
            <setRole :formData="addData" ref="roleDialogRef" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSetRoleMenuConfirm">{{ getButtonText('confirm')
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 批量删除弹窗组件 -->
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'角色名称'"
            :successValue="'删除成功'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="角色">
import { ref, computed, onMounted } from 'vue';
import { Plus, DeleteFilled } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import setRole from './setRole.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import *as api from '@/api/sysApi/user.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表格数据与列配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '角色名称', prop: 'name', width: '150', sortable: true },
    { label: '备注', prop: 'remark', width: '300' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '155', fixed: 'right', slot: 'customBtn' }
]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const loading = ref(true);

// 选择及排序数据
const selection = ref({});
const selectionRows = ref([]);
const orderBy = ref('');

// 表格事件方法
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
    console.log('选中的数据：', selectionRows.value);
};
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString);
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({
    id: null,
    name: '',
    remark: '',
    sortNo: null,
});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd' 或 'setRole'
// 动态加载表单组件
const dialogTitle = computed(() => t(`sys_user_role_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : dialogMode.value === 'upd' ? UpdForm : setRole);

// 新增按钮
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

// 编辑按钮
const handleEdit = (row) => {
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        id: row.id,
        name: row.name,
        remark: row.remark,
        sortNo: row.sortNo
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};
// 授权相关
const roleDialogRef = ref(null);
const setRoleDialogVisible = ref(false);
// 点击授权
const handleSetRoleMenu = (row) => {
    addData.value = {
        ...row
    };
    setRoleDialogVisible.value = true;
}
// 授权确定
const handleSetRoleMenuConfirm = async () => {
    const menuIds = await roleDialogRef.value.handleSelection()
    // console.log('授权菜单：', menuIds);
    const res = await api.setUserRoleMenuApi({ roleId: addData.value.id, menuIds: menuIds })
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        setRoleDialogVisible.value = false;
    }
}

// 批量删除相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleDel = () => {

    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await api.delUserRoleDataApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].name,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res = null;
        const data = {
            ...addData.value
        };
        if (dialogMode.value === 'upd') {
            res = await api.updateUserRoleDataApi(data);
        } else {
            res = await api.addUserRoleDataApi(data);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            getList();
            centerDialogVisible.value = false;
        }
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await api.getUserRoleListApi({
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

onMounted(() => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>