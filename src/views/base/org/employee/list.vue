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
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="primary" @click="batchSetRoleMenu" v-permission="'userRole:setUserRole'"
                        :icon="Finished">{{
                            getButtonText('assignRole')
                        }}</el-button>
                    <el-button type="danger" @click="handleLock" v-permission="'user:lock'" :icon="Lock">{{
                        getButtonText('lock') }}</el-button>
                    <el-button type="warning" @click="handleUnlock" v-permission="'user:unLock'" :icon="Unlock">{{
                        getButtonText('unlock')
                    }}</el-button>
                    <el-button type="danger" @click="handleLeave" v-permission="'leaveJob'" :icon="Remove">{{
                        getButtonText('resign')
                    }}</el-button>

                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="resetPassword(row)">
                            <el-icon>
                                <RefreshRight />
                            </el-icon>
                            <span>{{ getButtonText('resetPassword') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="lookPassword(row)">
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
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #userStatusName="{ row, column, index }">
                    <span :style="{ color: row.userStatusId == 10 ? 'green' : 'red' }">{{ row.userStatusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 受权弹窗 -->
        <el-dialog v-model="setRoleDialogVisible" title="授权" width="700" align-center destroy-on-close>
            <setRole :formData="userData" ref="roleDialogRef" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSetRoleMenuConfirm">{{ getButtonText('confirm')
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="batchSetRoleDialogVisible" :tableData="setRoleData"
            :nameField="'id'" :nameLabel="'员工姓名 (用户代码)'" :successValue="successValue" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="员工">
import { Plus, Finished, Unlock, Lock, View, Remove } from '@element-plus/icons-vue'
import { getOrgListDepartmentApi, getOrgEmployeeListApi, getStatusEnumApi, getOrgListCompanyApi, leaveOrgEmployeeApi } from '@/api/baseApi/org.js';
import { setUserUserUnLockApi, setUserUserLockApi, lookPasswordApi, updatePasswordByAdminApi, setUserUserRoleApi } from '@/api/sysApi/user.js'
import setRole from './setRole.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { getButtonText } from '@/utils/i18n/i18nLabels.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
let statusMenu = ref([])
const formConfig = ref([
    { type: 'input', label: '工号', prop: 'num', },
    { type: 'input', label: '用户代码', prop: 'userCode', },
    { type: 'select', label: '在职状态', prop: 'statusId', options: [] },
])

// 初始化表单数据
const initValues = ref({
    num: '',
    statusId: '',
    orgId: '',
    departmentId: '',
})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    departmentOptions.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
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
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
    console.log('选中的数据：', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑员工',
        params: { id: row.id, name: row.name },
    })
}
// 重置密码
const resetPassword = (row) => {
    setTimeout(() => {
        ElMessageBox.prompt(
            t('enterNewPassword', {
                name: row.name,   // 传递 row.name 给占位符 {name}
                userCode: row.userCode // 传递 row.userCode 给占位符 {userCode}
            }),
            t('ResetPwd'),
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
                            if (res.success) {
                                smartAlert(res.msg, res.success, 1000);
                                done();
                            } else {
                                smartAlert(res.msg, res.success, 1000);
                            }
                        } catch (error) {
                            console.error('请求错误:', error);
                            smartAlert(error, false, 1000);
                        }
                    } else {
                        done(); // 取消操作直接关闭
                    }
                }
            }
        )
    }, 100);
};
// 查看密码
const lookPassword = async (row) => {
    const res = await lookPasswordApi({ userId: row.userId })
    smartAlert(res.msg, false, 1000);
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])
// 批量数据
const setRoleData = ref([])
// 批量弹窗
const batchSetRoleDialogVisible = ref(false)
const promptMessage = ref('')
const successValue = ref('保存成功')
// 添加员工
const handleAdd = async () => {
    router.push('/base/org/employee/add')
}
const userData = ref({})
const setRoleDialogVisible = ref(false)
const roleDialogRef = ref(null)
// 批量分配角色
const batchSetRoleMenu = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: '请先选择要分配的员工！',
            type: 'warning',
        })
        return
    }
    userData.value = { nickName: '批量授权' }
    // 弹窗
    setRoleDialogVisible.value = true
}
// 授权确认
const handleSetRoleMenuConfirm = async () => {
    let res
    const roleIds = await roleDialogRef.value.handleSelection()
    // 循环遍历selectionRows
    setRoleData.value = [];
    promptMessage.value = '操作中...'
    batchSetRoleDialogVisible.value = true;
    successValue.value = '保存成功'
    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserRoleApi({ userId: selectionRows.value[i].userId, roleIds })
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
    if (res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
}
// 批量弹窗关闭
const delColse = () => {
    batchSetRoleDialogVisible.value = false
    setRoleData.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 锁定
const handleLock = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: '请选择要锁定的数据！',
            type: 'warning',
        })
        return
    }
    let res
    // 循环遍历selectionRows
    setRoleData.value = [];
    promptMessage.value = '操作中...'
    batchSetRoleDialogVisible.value = true;
    successValue.value = '用户已锁定'
    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserLockApi({ id: selectionRows.value[i].userId })
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
    if (res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
}
// 解锁
const handleUnlock = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: '请选择要解锁的数据！',
            type: 'warning',
        })
        return
    }
    let res
    setRoleData.value = [];
    promptMessage.value = '操作中...'
    batchSetRoleDialogVisible.value = true;
    successValue.value = '用户已解锁'
    for (let i = 0; i < selectionRows.value.length; i++) {
        res = await setUserUserUnLockApi({ id: selectionRows.value[i].userId })
        setRoleData.value.push({
            id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
    if (res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
    }
}

// 离职
const handleLeave = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            message: '请选择要离职的数据！',
            type: 'warning',
        })
        return
    }
    // 使用导入的 ElMessageBox 而不是全局变量
    ElMessageBox.confirm(
        `是否将选择的员工改为离职状态?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        let res
        // 循环遍历selectionRows
        setRoleData.value = [];
        promptMessage.value = '操作中...'
        batchSetRoleDialogVisible.value = true;
        for (let i = 0; i < selectionRows.value.length; i++) {
            res = await leaveOrgEmployeeApi({ id: selectionRows.value[i].id })
            setRoleData.value.push({
                id: selectionRows.value[i].name + ' (' + selectionRows.value[i].userCode + ')',
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
        if (res.success) {
            setRoleDialogVisible.value = false;
            selectionRows.value = [];
        }
    }).catch(() => {
        ElMessage.info('已取消');
    });
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOrgEmployeeListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
    })
    tableData.value = Object.freeze(res.data.rows)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
    const res = await getOrgListDepartmentApi({ parentId: e[e.length - 1] });
    departmentOptions.value = res.data;
};
// 部门数据
const departmentOptions = ref([]);

onMounted(async () => {
    // 获取状态菜单
    const res = await getStatusEnumApi()
    statusMenu.value = res.data.map(item => ({ label: item.name, value: item.id }))
    formConfig.value[2] = {
        ...formConfig.value[2],
        options: statusMenu.value,
    }

    // 赋值给对应的列
    const statusCol = columns.value.find(col => col.prop === 'statusName')
    if (statusCol) {
        statusCol.filters = statusMenu.value
        console.log('statusCol', columns.value)
    }
    // 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    // 处理公司数据
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshEmployeeList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshEmployeeList = false
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>