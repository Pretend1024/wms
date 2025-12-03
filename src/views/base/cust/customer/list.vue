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
                        <el-form-item :label="getLabel('financialUserCode')">
                            <el-select v-model="formData.financialUserCode" value-key="id" filterable
                                :placeholder="getPlaceholder('financialUserCode')">
                                <el-option v-for="item in financialUserOptions" :key="item.id" :label="item.nickName"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('salesUserCode')">
                            <el-select v-model="formData.salesUserCode" value-key="id" filterable
                                :placeholder="getPlaceholder('salesUserCode')">
                                <el-option v-for="item in salesUserOptions" :key="item.id" :label="item.nickName"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('code')">
                            <el-input v-model="formData.code" :placeholder="getPlaceholder('code')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('userCode')">
                            <el-input v-model="formData.userCode" :placeholder="getPlaceholder('userCode')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
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
                    <el-button type="primary" @click="handleAdd" v-permission="'customer:add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-if="canEdit">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('operate') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleLink(row)">{{ getButtonText('connect') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="resetPassword(row)">{{ getButtonText('resetPassword')
                                    }}</el-dropdown-item>
                                    <el-dropdown-item @click="lookPassword(row)">{{ getButtonText('viewPassword')
                                    }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #contractFile="{ row }">
                    <a :href="row.contractFile" target="_blank">{{ row.contractFile }}</a>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #userStatusName="{ row }">
                    <span :style="{ color: row.userStatusId == 10 ? 'green' : 'red' }">{{ row.userStatusName }}</span>
                </template>
                <template #isCompany="{ row }">
                    <span :style="{ color: row.isCompany ? 'green' : 'red' }">{{ row.isCompany ? '是' : '否'
                        }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog :title="$t('DockingInfo')" v-model="dialogVisible" width="60%" destroy-on-close>
            <hydTable :tableData="linkTableData" :columns="linkColumns">
            </hydTable>
        </el-dialog>
    </div>
</template>
<script setup name="客户">
import { Plus, Link } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { lookPasswordApi, updatePasswordByAdminApi } from '@/api/sysApi/user.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import selectInput from '@/components/table/selectInput.vue'
import router from '@/router/index.js'
import { getButtonText } from '@/utils/i18n/i18nLabels.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
import { getCustomerListApi, getCustomerStatusEnumApi, getListSalesUserEnumApi, getListFinancialUserEnumApi, getCustomerApiList } from '@/api/baseApi/cust.js'
// 表格内按钮权限
import { hasPerm } from "@/directives/permission.js"
const canEdit = computed(() => hasPerm('customer:edit'));
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    code: '',
    statusId: '',
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    salesUserCode: '',
    financialUserCode: '',
    way: 'nameLike',
})
const way = ref([
    { label: '客户名', value: 'nameLike' }
])
// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        orgId: data.orgId ? data.orgId[data.orgId.length - 1] : ''
    }
    // 定义所有可能的字段
    const fields = way.value.map(item => item.value);
    // 筛选出需要删除的字段（排除当前选中的way）
    const fieldsToDelete = fields.filter(field => field !== data.way);
    // 循环删除不需要的字段
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    financialUserOptions.value = [];
    salesUserOptions.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
const linkTableData = ref([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '125', fixed: 'left', sortable: true },
    { label: '客户代码', prop: 'code', width: '175', fixed: 'left', sortable: true },
    { label: '客户名称', prop: 'name', width: '175', fixed: 'left', sortable: true },
    { label: '主用户代码', prop: 'userCode', width: '135', sortable: true },
    { label: '主用户状态', prop: 'userStatusName', width: '125', sortable: true, sortAlias: 'userStatusId', slot: 'userStatusName' },
    { label: '等级', prop: 'levelName', width: '115', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true },
    { label: '财务', prop: 'financialUserCode', width: '155' },
    { label: '销售', prop: 'salesUserCode', width: '125' },
    { label: '联系人', prop: 'contact', width: '140' },
    { label: '手机号', prop: 'mobilePhone', width: '150' },
    { label: '邮箱', prop: 'email', width: '200' },
    { label: '国家', prop: 'countryName', width: '120', sortable: true },
    { label: '城市', prop: 'city', width: '100' },
    { label: '省', prop: 'province', width: '100' },
    { label: '详细地址', prop: 'address', width: '200' },
    { label: '邮编', prop: 'postcode', width: '135' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '145', fixed: 'right', slot: 'customBtn' }
])
const linkColumns = ref([
    { label: '接口类型', prop: 'apiTypeName', width: '120' },
    { label: '令牌(Token)', prop: 'toUsToken', width: '120' },
    { label: '密钥(SecretKey)', prop: 'toUsSecretKey', width: '145' },
    { label: '客户系统名', prop: 'sysName', width: '120' },
    { label: '回调地址', prop: 'toCUrl', width: '150' },
    { label: '回调令牌', prop: 'toCToken', width: '120' },
    { label: '回调密钥', prop: 'toCSecretKey', width: '120' },
    { label: '上线时间', prop: 'onlineTime', width: '200', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})
const linkPagination = ref({
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
        name: '编辑客户',
        params: { id: row.id, name: row.name },
    })
}
// 对接
const dialogVisible = ref(false)
const handleLink = async (row) => {
    try {
        // 获取对接列表数据
        await getLinkList(row.id)
        dialogVisible.value = true
    } catch (error) {
        console.error('获取对接列表数据失败:', error)
        smartAlert('获取对接列表数据失败，请重试', false)
    }
}
// 重置密码
const resetPassword = (row) => {
    setTimeout(() => {
        ElMessageBox.prompt(
            // `请输入“${row.name} (${row.userCode})”的新密码`,
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

// 添加
const handleAdd = async () => {
    router.push('/base/cust/customer/add')
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getCustomerListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    // console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 获取对接列表
const getLinkList = async (customerId) => {
    const res = await getCustomerApiList({
        customerId
    })
    // 赋值
    linkTableData.value = res.data
}
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 财务用户数据
const financialUserOptions = ref([])
// 销售用户数据
const salesUserOptions = ref([])
// 公司改变事件
const handleCascaderChange = async (e) => {
    console.log('选择的公司:', e)
    //获取财务用户数据
    const financialRes = await getListFinancialUserEnumApi({ orgId: e[e.length - 1] });
    financialUserOptions.value = financialRes.data
    // 获取销售用户数据
    const salesRes = await getListSalesUserEnumApi({ orgId: e[e.length - 1] });
    salesUserOptions.value = salesRes.data
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
};
// 状态数据
const statusOptions = ref([])

onMounted(async () => {
    // 获取状态菜单
    const res = await getCustomerStatusEnumApi()
    statusOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
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
    if (refreshStore.shouldRefreshCustomerList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshCustomerList = false
    }
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>