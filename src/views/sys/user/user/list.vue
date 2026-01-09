<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
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
                    <el-button type="primary" @click="batchSetRoleMenu" v-permission="'userRole:setUserRole'" :icon="Finished">{{
                        getButtonText
                            ('batchAssignRole') }}</el-button>
                    <el-button type="danger" @click="handleLock" v-permission="'lock'" :icon="Lock">{{
                        getButtonText('lock') }}</el-button>
                    <el-button type="warning" @click="handleUnlock" v-permission="'unLock'" :icon="Unlock">{{
                        getButtonText('unlock')
                        }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
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
                        <div class="cursor-pointer" @click="setRoleMenu(row)">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>授权</span>
                        </div>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #isAdmin="{ row, column, index }">
                    <el-tag v-if="row.isAdmin" type="success">管理员</el-tag>
                    <el-tag v-else type="danger">用户</el-tag>
                </template>
                <template #statusName="{ row, column, index }">
                    <el-tag v-if="row.statusId == 10" type="success">{{ row.statusName }}</el-tag>
                    <el-tag v-else type="danger">{{ row.statusName }}</el-tag>
                </template>
                <template #headImg="{ row, column, index }">
                    <el-avatar :src="row.headImg" :size="20" />
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
            :nameField="'id'" :nameLabel="'用户昵称'" :successValue="'保存成功'" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="用户">
import { Finished, Unlock, Lock, View } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getUserUserListApi, getUserStatusEnumApi, getUserTypeEnumApi, setUserUserUnLockApi, setUserUserLockApi, lookPasswordApi, updatePasswordByAdminApi, setUserUserRoleApi } from '@/api/sysApi/user.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import setRole from './setRole.vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '用户代码', prop: 'code' },
    {
        type: 'select', label: '状态', prop: 'statusId', options: []
    },
    {
        type: 'select', label: '类型', prop: 'userTypeId', options: []
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    code: '',
    statusId: '',
    userTypeId: '',
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
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
        ...data
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '135', fixed: 'left' },
    { label: '用户代码', prop: 'code', width: '135', sortable: true, fixed: 'left' },
    { label: '昵称', prop: 'nickName', width: '135', sortable: true, fixed: 'left' },
    { label: '手机号', prop: 'mobilePhone', width: '130', sortable: true },
    { label: '状态', prop: 'statusName', width: '105', sortable: true, slot: 'statusName' },
    { label: '角色', prop: 'roleName', width: '185', sortable: true, sortAlias: 'c.name' },
    { label: '类型', prop: 'userTypeName', width: '115', sortable: true, },
    { label: '员工工号', prop: 'employeeNum', width: '135' },
    { label: '客户代码', prop: 'customerCode', width: '135' },
    { label: '头像', prop: 'headImg', width: '85', slot: 'headImg' },
    { label: '登录时间', prop: 'lastLoginTime', width: '165', sortable: true },
    { label: '修改密码时间', prop: 'lastUpdPwdTime', width: '165', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '255', fixed: 'right', slot: 'customBtn' }
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
    console.log('选中的数据:', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据:', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
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
// 重置密码
const resetPassword = (row) => {
    setTimeout(() => {
        ElMessageBox.prompt(
            `请输入用户：“${selection.value.nickName}”的新密码`,
            '重置密码',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'password',
                beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                        try {
                            const res = await updatePasswordByAdminApi({
                                userId: row.id,
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
    const res = await lookPasswordApi({ userId: row.id })
    smartAlert(res.msg, false, 1000);
}
// 授权
const setRoleMenu = async (row) => {
    userData.value = { ...row }
    isBatch.value = false
    setRoleDialogVisible.value = true
}
// 授权组件
const roleDialogRef = ref(null)
// 是否批量授权
const isBatch = ref(false)
// 授权确认
const handleSetRoleMenuConfirm = async () => {
    let res
    const roleIds = await roleDialogRef.value.handleSelection()
    if (!isBatch.value) {
        res = await setUserUserRoleApi({ userId: userData.value.id, roleIds })
    } else {
        // 循环遍历selectionRows
        delData.value = [];
        promptMessage.value = '操作中...'
        batchSetRoleDialogVisible.value = true;
        for (let i = 0; i < selectionRows.value.length; i++) {
            res = await setUserUserRoleApi({ userId: selectionRows.value[i].id, roleIds })
            setRoleData.value.push({
                id: selectionRows.value[i].nickName,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
    }
    if (res.success) {
        setRoleDialogVisible.value = false;
        selectionRows.value = [];
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    }
}
// 弹窗
const setRoleDialogVisible = ref(false)
// 弹窗数据
const userData = ref({})

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])
// 批量数据
const setRoleData = ref([])
// 批量弹窗
const batchSetRoleDialogVisible = ref(false)
const promptMessage = ref('')
// 批量弹窗关闭
const delColse = () => {
    batchSetRoleDialogVisible.value = false
    setRoleData.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 批量分配角色
const batchSetRoleMenu = async () => {
    isBatch.value = true
    userData.value = { nickName: '批量授权' }
    // 弹窗
    setRoleDialogVisible.value = true
}
// 锁定
const handleLock = async () => {
    if (selectionRows.value.length === 0) {
        smartAlert('请选择要解锁的数据！', true, 1000);
        return
    }
    if (selectionRows.value.length > 1) {
        smartAlert('只能选择一条数据！', true, 1000);
        return
    }
    let res
    res = await setUserUserLockApi({
        id: selectionRows.value[0].id,
    })
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        selectionRows.value = []
        selection.value = {}
    }
}
// 解锁
const handleUnlock = async () => {
    if (selectionRows.value.length === 0) {
        smartAlert('请选择要解锁的数据！', true, 1000);
        return
    }
    if (selectionRows.value.length > 1) {
        smartAlert('只能选择一条数据！', true, 1000);
        return
    }
    let res
    res = await setUserUserUnLockApi({
        id: selectionRows.value[0].id,
    })
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        selectionRows.value = []
        selection.value = {}
    }
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getUserUserListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
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
};
onMounted(async () => {
    const statusRes = await getUserStatusEnumApi()
    formConfig.value[1].options = statusRes.data.map(item => ({ label: item.name, value: item.id }))
    const typeRes = await getUserTypeEnumApi()
    formConfig.value[2].options = typeRes.data.map(item => ({ label: item.name, value: item.id }))
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
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>