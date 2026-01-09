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
                    <!-- 客户 -->
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
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
                    <el-button type="primary" @click="handleAdd" v-permission="'customerRecharge:add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <!-- 审核 -->
                    <el-dropdown trigger="click">
                        <el-button type="success">
                            {{ getButtonText('audit') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleAudit(30)">{{ getButtonText('auditPass')
                                }}</el-dropdown-item>
                                <el-dropdown-item @click="handleAudit(40)">{{ getButtonText('auditReject')
                                }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- 导出 -->
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'customerRecharge:delete'"
                        :icon="Delete">{{
                            getButtonText('del')
                        }}</el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer"
                            @click="(row.statusId != 30 || row.statusId != 40) && handleEdit(row)"
                            :class="{ 'btnDisable': row.statusId == 30 || row.statusId == 40 }">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <!-- 查看凭证 -->
                        <div class="cursor-pointer" @click="row.certificate && handleView(row)"
                            :class="{ 'btnDisable': row.certificate == null || row.certificate === '' }">
                            <el-icon>
                                <Open />
                            </el-icon>
                            <span>{{ getButtonText('viewVoucher') }}</span>
                        </div>
                        <!-- 详情 -->
                        <div class="cursor-pointer" @click="handleDetail(row)">
                            <el-icon>
                                <DocumentCopy />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 30 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
            </hydTable>
        </div>
        <!-- 弹窗：关键修改：动态组件传递initData（回显数据），移除无用的formData -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="900" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :paymentMethodEnum="paymentMethodEnum" :platformStatusEnum="platformStatusEnum"
                :accountStatusEnum="accountStatusEnum" :CurrencyOptions="CurrencyOptions"
                :companyOptions="companyOptions" :isDisabled="dialogMode === 'info'" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <!-- 仅新增/编辑模式显示确认按钮 -->
                    <el-button type="primary" @click="handleDialogConfirm" v-if="dialogMode !== 'info'">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="705">
        </exportDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'客户'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="充值管理">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

// 接口导入
import { getPaymentMethodEnumApi } from '@/api/financeApi/basic.js';
import { addCustomerRechargeApi, updCustomerRechargeByIdApi, getCustomerRechargePageApi, getCustomerRechargePlatformStatusEnumApi, getCustomerRechargeStatusEnumApi, delCustomerRechargeByIdApi, auditCustomerRechargeApi } from "@/api/financeApi/receivables.js";
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getCurrencyListApi } from '@/api/baseApi/index.js';

// 工具与组件导入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue'; // 虽与AddForm相同，保留动态切换逻辑
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// -------------------------- 核心修改1：定义编辑回显数据存储变量 --------------------------
// 编辑时的回显数据（替代原addData，专门用于传递给子组件）
const editInitData = ref({});
// 移除无用的addData（因子组件已内部维护formData，无需父组件传递formData）

// -------------------------- 搜索表单配置 --------------------------
const formConfig = ref([
    { type: 'select', label: '付款方式', prop: 'paywayId', options: [] },
    { type: 'select', label: '支付结果', prop: 'platformStatusId', options: [] },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'select', label: '币种', prop: 'currency', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

const initValues = ref({
    customerCode: '',
    orgId: '',
    toUsToken: '',
    apiTypeId: '',
    createdTimeBegin: '',
    createdTimeEnd: ''
});

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// -------------------------- 表格配置与事件 --------------------------
const tableData = shallowRef([]);
const columns = ref([
    { label: '公司', prop: 'orgName', width: '175', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '付款方式', prop: 'paywayName', width: '120', sortable: true },
    { label: '充值单号', prop: 'rechargeNo', width: '120' },
    { label: '状态', prop: 'statusName', width: '120', sortable: true, slot: 'statusName' },
    { label: '币种', prop: 'currency', width: '80', sortable: true },
    { label: '充值金额', prop: 'payAmount', width: '120' },
    { label: '充值前余额', prop: 'balanceBefore', width: '120' },
    { label: '充值后余额', prop: 'balanceAfter', width: '120' },
    { label: '已使用金额', prop: 'usedAmount', width: '120' },
    { label: '剩余金额', prop: 'remainingAmount', width: '120' },
    { label: '收款账户名', prop: 'collectionAccountNum', width: '150' },
    { label: '交易单号', prop: 'transactionId', width: '180' },
    { label: '支付结果', prop: 'platformStatusName', width: '120', sortable: true },
    { label: '销售用户代码', prop: 'salesUserCode', width: '120' },

    { label: '审核人', prop: 'auditorName', width: '100' },
    { label: '审核时间', prop: 'auditTime', width: '180', sortable: true },
    { label: '平台回调时间', prop: 'platformCallbackTime', width: '180', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '240', fixed: 'right', slot: 'customBtn' }
]);

const pagination = ref({ currentPage: 1, pageSize: 100, total: 99 });
const loading = ref(true);
const selectionRows = ref([]); // 批量选择数据
const selection = ref({}); // 单行点击数据
const orderBy = ref(''); // 排序条件

// 表格事件
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
};

const handleRowClick = (row) => {
    selection.value = row;
    console.log('点击行数据:', row);
};

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(currentPage, pageSize, orderBy.value);
};

const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, sortString);
};

// -------------------------- 弹窗与动态组件配置（核心修改区） --------------------------
const centerDialogVisible = ref(false);
const childFormRef = ref(null); // 子组件引用
const dialogMode = ref('add'); // 弹窗模式：add-新增，upd-编辑

// 动态组件：根据模式选择AddForm/UpdForm（虽相同，保留扩展性）
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
// 弹窗标题：根据模式切换
// 弹窗标题：add-新增 / upd-编辑 / info-详情
const dialogTitle = computed(() => {
    if (dialogMode.value === 'add') {
        return t(`finance_account_recharge_list.addTitle`);
    } else if (dialogMode.value === 'upd') {
        return t(`finance_account_recharge_list.updTitle`);
    } else { // info模式
        return t(`finance_account_recharge_list.infoTitle`); // 需确保i18n中有infoTitle配置
    }
});

// -------------------------- 核心修改2：编辑按钮点击事件（回显数据核心） --------------------------
const handleEdit = (row) => {
    // 1. 深拷贝行数据到回显变量（避免原数据被修改）
    editInitData.value = JSON.parse(JSON.stringify(row));
    // 2. 设置弹窗模式为编辑
    dialogMode.value = 'upd';
    // 3. 打开弹窗（nextTick确保数据赋值完成后再渲染子组件）
    nextTick(() => {
        centerDialogVisible.value = true;
    });
};

// 新增按钮点击事件
const handleAdd = () => {
    // 1. 清空回显数据（避免残留编辑数据）
    editInitData.value = {};
    // 2. 设置弹窗模式为新增
    dialogMode.value = 'add';
    // 3. 打开弹窗
    centerDialogVisible.value = true;
};

// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
    // 取消时重置子组件表单（避免下次打开残留数据）
    nextTick(() => {
        childFormRef.value?.resetFields();
    });
};

// 弹窗确认按钮（已适配子组件内部formData）
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;

    try {
        // 1. 子组件表单验证
        await childFormRef.value.validate();
        // 2. 获取子组件内部最新表单数据（关键：从子组件拿实时数据）
        const formData = childFormRef.value.getFormData();
        if (!formData) {
            smartAlert('表单数据异常，请重试', false, 1000);
            return;
        }

        // 3. 显示加载状态
        loading.value = true;

        // 4. 调用新增/编辑接口（根据formData是否有id判断）
        let res;
        if (formData.id) {
            res = await updCustomerRechargeByIdApi(formData); // 编辑接口
        } else {
            res = await addCustomerRechargeApi(formData); // 新增接口
        }

        // 5. 结果提示与后续操作
        smartAlert(
            res?.msg || (formData.id ? '修改' : '新增') + '操作异常',
            res?.success || false,
            1000
        );
        if (res?.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value); // 刷新列表
        }

    } catch (error) {
        // 错误分类提示
        if (error?.name === 'ValidationError' || error?.message.includes('表单验证')) {
            smartAlert('请完善必填项后提交', false, 1000);
        } else {
            smartAlert('网络异常或操作失败，请重试', false, 1000);
        }
        console.error('操作失败:', error);

    } finally {
        // 确保加载状态关闭
        loading.value = false;
    }
};

const handleAudit = async (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要审核的数据！');
        return;
    }

    ElMessageBox.confirm(
        `是否要审核${selectionRows.value.length}条数据?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delData.value = [];
        promptMessage.value = '操作中...';
        delDialogVisible.value = true;
        delData.value = []; // 清空历史删除记录

        // 批量删除（循环调用接口，可根据后端支持改为批量接口）
        for (const row of selectionRows.value) {
            const res = await auditCustomerRechargeApi({ id: row.id, statusId });
            delData.value.push({
                id: row.customerCode + '(' + row.customerName + ')', // 显示客户名或ID
                msg: res?.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！';

    }).catch(() => {
        ElMessage.info('已取消');
    });
};

// -------------------------- 查看凭证 --------------------------
const handleView = async (row) => {
    window.open(row.certificate, '_blank');
}

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
// 详情
const handleDetail = (row) => {
    // 1. 深拷贝行数据到回显变量（与编辑共用editInitData，无需新增变量）
    editInitData.value = JSON.parse(JSON.stringify(row));
    // 2. 设置弹窗模式为“详情”（用于标题切换和禁用控制）
    dialogMode.value = 'info';
    // 3. 打开弹窗（nextTick确保数据赋值完成）
    nextTick(() => {
        centerDialogVisible.value = true;
    });
};

// -------------------------- 删除功能 --------------------------
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要删除的数据！');
        return;
    }

    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length}条数据?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delData.value = [];
        promptMessage.value = '操作中...';
        delDialogVisible.value = true;
        delData.value = []; // 清空历史删除记录

        // 批量删除（循环调用接口，可根据后端支持改为批量接口）
        for (const row of selectionRows.value) {
            const res = await delCustomerRechargeByIdApi({ id: row.id });
            delData.value.push({
                id: row.customerCode + '(' + row.customerName + ')', // 显示客户名或ID
                msg: res?.msg || '删除成功',
                success: res.success
            });
        }
        promptMessage.value = '操作完成！';

    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

const delColse = () => {
    delDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value); // 刷新列表
};

// -------------------------- 列表数据与枚举加载 --------------------------
// 获取列表数据
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getCustomerRechargePageApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = Object.freeze(res.data.rows);
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
    } catch (error) {
        console.error('获取列表失败:', error);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

// 公司级联数据、支付方式、账户状态枚举加载
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
const paymentMethodEnum = ref([]);
const accountStatusEnum = ref([]);
// 支付结果
const platformStatusEnum = ref([]);
// 筛选客户代码
const customerOptions = ref([]);
const initialFilteredOptions = ref([])
const CurrencyOptions = ref([])

onMounted(async () => {
    // 1. 加载公司级联数据
    const companyRes = await getOrgListCompanyApi();
    const convertToTree = (items) => items.map(item => ({
        value: item.id,
        label: item.nameCn,
        children: item.children ? convertToTree(item.children) : []
    }));
    companyOptions.value = convertToTree(companyRes.data);

    // 2. 加载支付方式枚举（填充搜索表单）
    const payRes = await getPaymentMethodEnumApi();
    formConfig.value[0].options = payRes.data.map(item => ({ label: item.name, value: item.id }));
    paymentMethodEnum.value = payRes.data;

    // 3.支付结果
    const platformRes = await getCustomerRechargePlatformStatusEnumApi();
    formConfig.value[1].options = platformRes.data.map(item => ({ label: item.name, value: item.id }));
    platformStatusEnum.value = platformRes.data;

    // 3. 加载账户状态枚举（填充搜索表单）
    const statusRes = await getCustomerRechargeStatusEnumApi();
    formConfig.value[2].options = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    accountStatusEnum.value = statusRes.data;
    // 客户代码
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
    // 获取币种数据
    const CurrencyRes = await getCurrencyListApi();
    CurrencyOptions.value = CurrencyRes.data.map(item => ({
        value: item.currency,
        label: item.currencyName
    }))
    formConfig.value[3].options = CurrencyOptions.value;
    // 4. 初始化加载列表
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
});

// 公司级联选择器关闭弹窗（优化体验）
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>