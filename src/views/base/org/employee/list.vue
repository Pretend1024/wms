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
                        <el-form-item :label="getLabel('departmentId')" class="compact-item">
                            <el-select v-model="formData.departmentId" :placeholder="getPlaceholder('departmentId')">
                                <el-option v-for="item in departmentOptions" :key="item.id" :label="item.nameCn"
                                    :value="item.id" />
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
                    <el-button type="primary" @click="batchSetRoleMenu" v-permission="'userRole:setUserRole'"
                        :icon="Finished">
                        {{ getButtonText('assignRole') }}
                    </el-button>
                    <el-button type="danger" @click="handleLock" v-permission="'user:lock'" :icon="Lock">
                        {{ getButtonText('lock') }}
                    </el-button>
                    <el-button type="warning" @click="handleUnlock" v-permission="'user:unLock'" :icon="Unlock">
                        {{ getButtonText('unlock') }}
                    </el-button>
                    <el-button type="danger" @click="handleLeave" v-permission="'leaveJob'" :icon="Remove">
                        {{ getButtonText('resign') }}
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
                        <div class="cursor-pointer" @click="resetPassword(row)"
                            v-permission="'user:updatePasswordByAdmin'">
                            <el-icon>
                                <RefreshRight />
                            </el-icon>
                            <span>{{ getButtonText('resetPassword') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="lookPassword(row)" v-permission="'user:lookPassword'">
                            <el-icon>
                                <View />
                            </el-icon>
                            <span>{{ getButtonText('viewPassword') }}</span>
                        </div>
                    </div>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #userStatusName="{ row }">
                    <span :style="{ color: row.userStatusId == 10 ? 'green' : 'red' }">{{ row.userStatusName }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="setRoleDialogVisible" :title="t('base_org_employee_list.authorize')" width="700"
            align-center destroy-on-close>
            <setRole :formData="userData" ref="roleDialogRef" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSetRoleMenuConfirm">{{ getButtonText('confirm')
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="t('base_org_employee_list.operationResult')"
            :isVisible="batchSetRoleDialogVisible" :tableData="setRoleData" :nameField="'id'"
            :nameLabel="t('base_org_employee_list.employeeNameUserCode')" :successValue="successValue" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="员工">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, onMounted, nextTick, shallowRef, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Finished, Unlock, Lock, View, Remove, EditPen, RefreshRight } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import setRole from './setRole.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";

// 1.3 API引入
import {
    getOrgListDepartmentApi,
    getOrgEmployeeListApi,
    getStatusEnumApi,
    getOrgListCompanyApi,
    leaveOrgEmployeeApi
} from '@/api/baseApi/org.js';
import {
    setUserUserUnLockApi,
    setUserUserLockApi,
    lookPasswordApi,
    updatePasswordByAdminApi,
    setUserUserRoleApi
} from '@/api/sysApi/user.js';

// 1.4 工具类及Store
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置
let statusMenu = ref([]);
const formConfig = ref([
    { type: 'input', label: '工号', prop: 'num', },
    { type: 'input', label: '用户代码', prop: 'userCode', },
    { type: 'select', label: '在职状态', prop: 'statusId', options: [] },
]);

const initValues = ref({
    num: '',
    statusId: '',
    orgId: '',
    departmentId: '',
});

// 公司与部门级联数据
const companyOptions = ref([]);
const departmentOptions = ref([]);
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

// 批量操作数据
const setRoleData = ref([]);
const batchSetRoleDialogVisible = ref(false);
const promptMessage = ref('');
const successValue = ref('');

// 授权弹窗数据
const userData = ref({});
const setRoleDialogVisible = ref(false);
const roleDialogRef = ref(null);

/* 3. 计算属性 - Columns (保持原样) */
const columns = ref([
    { label: '公司', prop: 'orgName', width: '125', sortable: true, fixed: 'left' },
    { label: '部门', prop: 'departmentName', width: '145', sortable: true, fixed: 'left' },
    { label: '工号', prop: 'num', width: '145', fixed: 'left', sortable: true },
    { label: '姓名', prop: 'name', width: '125', fixed: 'left' },
    { label: '岗位', prop: 'positionName', width: '130', sortable: true },
    { label: '用户代码', prop: 'userCode', width: '130', sortable: true },
    { label: '用户状态', prop: 'userStatusName', width: '120', sortable: true, slot: 'userStatusName' },
    { label: '角色', prop: 'roleName', width: '130', sortable: true },
    {
        label: '在职状态', prop: 'statusName', width: '120', slot: 'statusName', sortable: true, filters: [], filterMethod: ({ value, row }) => {
            return row.statusId === value
        }
    },
    { label: '入职时间', prop: 'entryTime', width: '180', sortable: true },
    { label: '民族', prop: 'nationName', width: '100', sortable: true },
    { label: '国家', prop: 'countryName', width: '100', sortable: true },
    { label: '省份', prop: 'province', width: '100', sortable: true },
    { label: '城市', prop: 'city', width: '130', sortable: true },
    { label: '详细地址', prop: 'address', width: '185' },
    { label: '邮编', prop: 'postcode', width: '130' },
    { label: '手机号', prop: 'mobilePhone', width: '150' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '250', fixed: 'right', slot: 'customBtn' }
]);

/* 4. 业务逻辑 */

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
    departmentOptions.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 列表查询
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOrgEmployeeListApi({
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

// 公司选择改变 - 联动部门
const handleCascaderChange = async (e) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible();
    });
    const res = await getOrgListDepartmentApi({ parentId: e[e.length - 1] });
    departmentOptions.value = res.data;
};

// 新增
const handleAdd = async () => {
    router.push('/base/org/employee/add');
};

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑员工',
        params: { id: row.id, name: row.name },
    });
};

// 重置密码
const resetPassword = (row) => {
    setTimeout(() => {
        ElMessageBox.prompt(
            t('enterNewPassword', {
                name: row.name,
                userCode: row.userCode
            }),
            t('base_org_employee_list.resetPassword'),
            {
                confirmButtonText: getButtonText('confirm'),
                cancelButtonText: getButtonText('cancel'),
                inputType: 'password',
                beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                        try {
                            const res = await updatePasswordByAdminApi({
                                userId: row.userId,
                                newPassword: instance.inputValue
                            });
                            // 使用 smartAlert 并保持 1000ms 延时
                            smartAlert(res.msg, res.success, 1000);
                            if (res.success) {
                                done();
                            }
                        } catch (error) {
                            console.error('请求错误:', error);
                            smartAlert(error, false, 1000);
                        }
                    } else {
                        done();
                    }
                }
            }
        );
    }, 100);
};

// 查看密码
const lookPassword = async (row) => {
    const res = await lookPasswordApi({ userId: row.userId });
    smartAlert(res.msg, false, 1000);
};

// 批量分配角色 - 打开弹窗
const batchSetRoleMenu = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: t('base_org_employee_list.selectEmployee'),
            type: 'warning',
        });
        return;
    }
    userData.value = { nickName: '批量授权' };
    setRoleDialogVisible.value = true;
};

// 批量分配角色 - 确认
const handleSetRoleMenuConfirm = async () => {
    let res;
    const roleIds = await roleDialogRef.value.handleSelection();
    setRoleData.value = [];
    promptMessage.value = t('base_org_employee_list.processing');
    batchSetRoleDialogVisible.value = true;
    successValue.value = t('base_org_employee_list.saveSuccess');

    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserRoleApi({ userId: selectionRows.value[i].userId, roleIds });
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = t('base_org_employee_list.operationComplete');
    if (res && res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
};

// 锁定用户
const handleLock = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: t('base_org_employee_list.selectLock'),
            type: 'warning',
        });
        return;
    }
    let res;
    setRoleData.value = [];
    promptMessage.value = t('base_org_employee_list.processing');
    batchSetRoleDialogVisible.value = true;
    successValue.value = t('base_org_employee_list.locked');

    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserLockApi({ id: selectionRows.value[i].userId });
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = t('base_org_employee_list.operationComplete');
    if (res && res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
};

// 解锁用户
const handleUnlock = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: t('base_org_employee_list.selectUnlock'),
            type: 'warning',
        });
        return;
    }
    let res;
    setRoleData.value = [];
    promptMessage.value = t('base_org_employee_list.processing');
    batchSetRoleDialogVisible.value = true;
    successValue.value = t('base_org_employee_list.unlocked');

    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserUnLockApi({ id: selectionRows.value[i].userId });
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = t('base_org_employee_list.operationComplete');
    if (res && res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
};

// 离职操作
const handleLeave = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: t('base_org_employee_list.selectLeave'),
            type: 'warning',
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_org_employee_list.confirmLeave'),
        t('base_org_employee_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    ).then(async () => {
        let res;
        setRoleData.value = [];
        promptMessage.value = t('base_org_employee_list.processing');
        batchSetRoleDialogVisible.value = true;

        for (let i = 0; i < selectionRows.value.length; i++) {
            res = await leaveOrgEmployeeApi({ id: selectionRows.value[i].id });
            setRoleData.value.push({
                id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = t('base_org_employee_list.operationComplete');
        if (res && res.success) {
            setRoleDialogVisible.value = false;
            selectionRows.value = [];
        }
    }).catch(() => {
        ElMessage.info(t('base_org_employee_list.cancelOperation'));
    });
};

/* 5. 辅助方法 */

// 选择行
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
    console.log('选中的数据：', selectionRows.value);
};

// 点击行
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

// 表格排序
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 批量弹窗关闭
const delColse = () => {
    batchSetRoleDialogVisible.value = false;
    setRoleData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [statusRes, companyRes] = await Promise.all([
        getStatusEnumApi(),
        getOrgListCompanyApi()
    ]);

    // 处理状态菜单
    statusMenu.value = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    formConfig.value[2] = {
        ...formConfig.value[2],
        options: statusMenu.value,
    };
    // 赋值给对应的列 (Filters)
    const statusCol = columns.value.find(col => col.prop === 'statusName');
    if (statusCol) {
        statusCol.filters = statusMenu.value;
    }

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

onActivated(() => {
    if (refreshStore.shouldRefreshEmployeeList) {
        console.log('刷新数据');
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        refreshStore.shouldRefreshEmployeeList = false;
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>