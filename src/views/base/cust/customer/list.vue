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
                    <el-col>
                        <el-form-item :label="getLabel('authStatusId')">
                            <el-select v-model="formData.authStatus" :placeholder="getPlaceholder('authStatusId')"
                                clearable>
                                <el-option v-for="item in authStatusOptions" :key="item.id" :label="item.name"
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
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
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
                                    <el-dropdown-item @click="handleLink(row)" v-permission="'connect'">
                                        {{ getButtonText('connect') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="resetPassword(row)" v-permission="'resetPassword'">
                                        {{ getButtonText('resetPassword') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="lookPassword(row)" v-permission="'viewPassword'">
                                        {{ getButtonText('viewPassword') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="handleLogin(row)" v-permission="'login'">
                                        {{ getButtonText('login') }}
                                    </el-dropdown-item>
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
                <template #authStatus="{ row }">
                    <span :style="{ color: row.authStatus == 20 ? 'green' : 'red' }">{{ row.authStatusName }}</span>
                </template>
                <template #userStatusName="{ row }">
                    <span :style="{ color: row.userStatusId == 10 ? 'green' : 'red' }">{{ row.userStatusName }}</span>
                </template>
                <template #isCompany="{ row }">
                    <span :style="{ color: row.isCompany ? 'green' : 'red' }">
                        {{ row.isCompany ? t('yes') : t('no') }}
                    </span>
                </template>
            </hydTable>
        </div>
        <el-dialog :title="t('base_cust_customer_list.dockingInfo')" v-model="dialogVisible" width="60%"
            destroy-on-close>
            <hydTable :tableData="linkTableData" :columns="linkColumns">
            </hydTable>
        </el-dialog>
    </div>
</template>

<script setup name="客户">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, onMounted, nextTick, shallowRef, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Link, EditPen, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import selectInput from '@/components/table/selectInput.vue';

// 1.3 API引入
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { lookPasswordApi, updatePasswordByAdminApi } from '@/api/sysApi/user.js';
import {
    getCustomerListApi,
    getCustomerStatusEnumApi,
    getListSalesUserEnumApi,
    getListFinancialUserEnumApi,
    getCustomerApiList,
    getCustomerAuthStatusEnumApi,
    loginByAdminApi
} from '@/api/baseApi/cust.js';

// 1.4 工具类及Store
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置
const formConfig = ref([
    { type: 'date', label: t('base_cust_customer_list.createTime'), prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: t('base_cust_customer_list.endTime'), prop: 'createdTimeEnd', useEndOfDay: true },
]);

const initValues = ref({
    code: '',
    statusId: '',
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    salesUserCode: '',
    financialUserCode: '',
    way: 'nameLike',
});

const way = ref([
    { label: t('base_cust_customer_list.customerName'), value: 'nameLike' }
]);

// 下拉选项数据
const companyOptions = ref([]);
const financialUserOptions = ref([]);
const salesUserOptions = ref([]);
const statusOptions = ref([]);
const authStatusOptions = ref([]);

const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 表格数据与分页
const tableData = shallowRef([]);
const linkTableData = ref([]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const linkPagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const orderBy = ref('');

// 选中数据
const selection = ref({});
const selectionRows = ref([]);

// 弹窗状态
const dialogVisible = ref(false);

/* 3. 计算属性 - Columns (保持原样) */
const columns = ref([
    { label: '公司', prop: 'orgName', width: '125', fixed: 'left', sortable: true },
    { label: '客户代码', prop: 'code', width: '175', fixed: 'left', sortable: true },
    { label: '客户名称', prop: 'name', width: '175', fixed: 'left', sortable: true },
    { label: '主用户代码', prop: 'userCode', width: '135', sortable: true },
    { label: '主用户状态', prop: 'userStatusName', width: '125', sortable: true, sortAlias: 'userStatusId', slot: 'userStatusName' },
    { label: '等级', prop: 'levelName', width: '115', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true },
    { label: '实名状态', prop: 'authStatusName', width: '100', slot: 'authStatus', sortable: true },
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
]);

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
]);

/* 4. 业务逻辑 */

// 搜索
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };

    // 处理动态搜索字段
    const fields = way.value.map(item => item.value);
    const fieldsToDelete = fields.filter(field => field !== data.way);
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });

    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    financialUserOptions.value = [];
    salesUserOptions.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 列表查询
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getCustomerListApi({
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

// 新增
const handleAdd = async () => {
    router.push('/base/cust/customer/add');
};

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑客户',
        params: { id: row.id, name: row.name },
    });
};

// 对接操作
const handleLink = async (row) => {
    try {
        await getLinkList(row.id);
        dialogVisible.value = true;
    } catch (error) {
        console.error('获取对接列表数据失败:', error);
        smartAlert(t('base_cust_customer_list.fetchLinkError'), false, 1000);
    }
};

// 获取对接列表
const getLinkList = async (customerId) => {
    const res = await getCustomerApiList({ customerId });
    linkTableData.value = res.data;
};

// 重置密码
const resetPassword = (row) => {
    setTimeout(() => {
        ElMessageBox.prompt(
            t('base_cust_customer_list.enterNewPassword', {
                name: row.name,
                userCode: row.userCode
            }),
            t('base_cust_customer_list.resetPassword'),
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

// 登录客户端
const handleLogin = async (row) => {
    const res = await loginByAdminApi({ id: row.id });
    window.open(res.data, '_blank');
    console.log('以客户身份登录:', res.data);
};

// 公司改变 - 联动财务和销售
const handleCascaderChange = async (e) => {
    console.log('选择的公司:', e);
    // 并发获取
    const [financialRes, salesRes] = await Promise.all([
        getListFinancialUserEnumApi({ orgId: e }),
        getListSalesUserEnumApi({ orgId: e })
    ]);

    financialUserOptions.value = financialRes.data;
    salesUserOptions.value = salesRes.data;

    nextTick(() => {
        cascaderRef.value.togglePopperVisible();
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

/* 6. 生命周期 */
onMounted(async () => {
    // 并发请求初始化数据
    const [statusRes, authStatusRes, companyRes] = await Promise.all([
        getCustomerStatusEnumApi(),
        getCustomerAuthStatusEnumApi(),
        getOrgListCompanyApi()
    ]);

    // 处理状态菜单
    statusOptions.value = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    authStatusOptions.value = authStatusRes.data;

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
    if (refreshStore.shouldRefreshCustomerList) {
        console.log('刷新数据');
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        refreshStore.shouldRefreshCustomerList = false;
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* 清除悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>