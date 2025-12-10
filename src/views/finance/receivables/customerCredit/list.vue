<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <!-- 公司 -->
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{ getButtonText('del') }}</el-button>
                    <!-- 审批 -->
                    <el-dropdown trigger="click">
                        <el-button type="success">
                            {{ getButtonText('approve') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleAudit(20)">{{ getButtonText('approvePass')
                                    }}</el-dropdown-item>
                                <el-dropdown-item @click="handleAudit(30)">{{ getButtonText('approveReject')
                                    }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- 收回 -->
                    <el-button type="warning" @click="handleRecall" :icon="Delete">{{ getButtonText('recall')
                        }}</el-button>
                    <!-- 导出 -->
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="(row.statusId == 10) && handleEdit(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10) }">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
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
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #auditStatusName="{ row }">
                    <span :style="{ color: row.auditStatusId == 20 ? 'green' : 'red' }">{{ row.auditStatusName }}</span>
                </template>
                <template #effectiveStatusName="{ row }">
                    <span :style="{ color: row.effectiveStatusId == 20 ? 'green' : 'red' }">{{ row.effectiveStatusName
                    }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗：关键修改：动态组件传递initData（回显数据），移除无用的formData -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="450" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :isDisabled="dialogMode === 'info'" :customerOptions="initialFilteredOptions"
                :nationOptions="nationOptions" :creditTypeEnum="creditTypeEnum" :creditStatusEnum="creditStatusEnum" />
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
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="604">
        </exportDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'客户代码(币种)'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="授信管理">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Plus, Delete, EditPen, Share } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

// 接口导入
import { getCustomerCreditPageApi, addCustomerCreditApi, updCustomerCreditByIdApi, delCustomerCreditByIdApi, getCustomerCreditTypeEnumApi, getCustomerCreditAuditStatusEnumApi, getCustomerCreditEffectStatusEnumApi, lockCustomerCreditByIdApi, approvalCustomerCreditByIdApi } from '@/api/financeApi/receivables.js';
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'

// 工具与组件导入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
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
    { type: 'select', label: '币种', prop: 'currency', options: [] },
    { type: 'select', label: '授信类型', prop: 'creditTypeId', options: [] },
    { type: 'select', label: '审批状态', prop: 'auditStatusId', options: [] },
    { type: 'select', label: '生效状态', prop: 'effectiveStatusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

const initValues = ref({});

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    if (Array.isArray(data.orgId)) {
        data.orgId = data.orgId.length > 0 ? data.orgId[data.orgId.length - 1] : '';
    }
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
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '币种代码', prop: 'currency', width: '130', fixed: 'left', sortable: true },
    // 授信类型&状态
    { label: '授信类型', prop: 'creditTypeName', width: '150', sortable: true },
    // { label: '授信状态', prop: 'statusId', width: '150', slot: 'status', sortable: true },
    // 授信核心信息
    { label: '信用额度', prop: 'creditAmount', width: '120' },
    // { label: '已使用授信额度', prop: 'usedCredit', width: '180' },
    // { label: '剩余授信额度', prop: 'remainingCredit', width: '180' },
    // { label: '可用金额', prop: 'availableAmount', width: '120' },
    { label: '审批状态', prop: 'auditStatusName', width: '150', slot: 'auditStatusName', sortable: true },
    { label: '生效状态', prop: 'effectiveStatusName', width: '150', slot: 'effectiveStatusName', sortable: true },


    // 授信时间信息
    { label: '授信生效时间', prop: 'creditStartTime', width: '180', sortable: true },
    { label: '授信到期时间', prop: 'creditEndTime', width: '180', sortable: true },

    // 审批信息
    { label: '销售用户', prop: 'salesUserCode', width: '200' },
    { label: '审批人', prop: 'auditorBy', width: '120', sortable: true },
    { label: '审批时间', prop: 'auditTime', width: '180', sortable: true },
    { label: '审批意见', prop: 'auditOpinion', width: '200' },
    // 备注
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '150', fixed: 'right', slot: 'customBtn' }
]);
const footer = ref();

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
        return t(`finance_receivables_customerCredit_list.addTitle`);
    } else if (dialogMode.value === 'upd') {
        return t(`finance_receivables_customerCredit_list.updTitle`);
    } else { // info模式
        return t(`finance_receivables_customerCredit_list.infoTitle`); // 需确保i18n中有infoTitle配置
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

    let bodyLoading = null;
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
        bodyLoading = ElLoading.service({ lock: true, text: 'Loading' });
        loading.value = true;

        // 4. 调用新增/编辑接口（根据formData是否有id判断）
        let res;
        if (formData.id) {
            res = await updCustomerCreditByIdApi(formData); // 编辑接口
        } else {
            res = await addCustomerCreditApi(formData); // 新增接口
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
        if (bodyLoading) bodyLoading.close();
        loading.value = false;
    }
};
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
                const res = await delCustomerCreditByIdApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].customerCode + '(' + selectionRows.value[i].currency + ')',
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
};

const delColse = () => {
    delDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value); // 刷新列表
};

// -------------------------- 审核功能 --------------------------
const handleAudit = async (auditStatusId) => {
    // 1. 校验是否勾选数据
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要审批的数据！'
        });
        return;
    }

    // 2. 弹出输入框获取审批备注（选填）
    try {
        const { value: auditOpinion } = await ElMessageBox.prompt(
            `请输入审批意见（选填）`,
            auditStatusId === 20 ? '审批通过' : '审批驳回',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '请输入审批意见，可不填',
                type: auditStatusId === 20 ? 'success' : 'warning'
            }
        );
        delData.value = [];
        // 3. 显示加载状态和审批结果弹窗
        loading.value = true;
        delDialogVisible.value = true;
        promptMessage.value = '操作中...';

        // 4. 循环处理勾选的数据，调用审批接口
        for (let i = 0; i < selectionRows.value.length; i++) {
            const row = selectionRows.value[i];
            try {
                // 调用审批接口，传递id、statusId、auditOpinion
                const res = await approvalCustomerCreditByIdApi({
                    id: row.id,
                    auditStatusId: auditStatusId,
                    auditOpinion: auditOpinion || '' // 备注为空时传空字符串
                });

                // 记录审批结果
                delData.value.push({
                    id: row.customerCode + '(' + row.currency + ')',
                    msg: res.msg,
                    success: res.success
                });
            } catch (error) {
                // 异常处理
                auditData.value.push({
                    id: row.customerCode + '(' + row.currency + ')',
                    msg: '网络异常，审批失败',
                    success: false
                });
                console.error(`审批单条数据失败（ID: ${row.id}）:`, error);
            }
        }

        // 5. 处理完成更新提示
        promptMessage.value = '操作完成！';
        loading.value = false;

    } catch (error) {
        // 取消输入时的处理
        if (error === 'cancel') {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        } else {
            ElMessage({
                type: 'error',
                message: '审批操作异常，请重试'
            });
            console.error('审批流程异常:', error);
        }
    }
};

// -------------------------- 收回功能 --------------------------
const handleRecall = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要收回的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要收回${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
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
                const res = await lockCustomerCreditByIdApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].customerCode + '(' + selectionRows.value[i].currency + ')',
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
};



// -------------------------- 列表数据与枚举加载 --------------------------
// 获取列表数据
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getCustomerCreditPageApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = res.data.rows;
        footer.value = res.data.footer[0];
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

// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
const initialFilteredOptions = ref([])
// 币种数据
const nationOptions = ref([])
// 授信类型
const creditTypeEnum = ref([]);

onMounted(async () => {
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
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
    // 获取币种数据
    const nationRes = await getCurrencyEnumApi();
    nationOptions.value = nationRes.data.map(item => ({
        value: item.code,
        label: item.name
    }))
    formConfig.value[0].options = nationOptions.value;
    // 获取授信类型
    const creditTypeRes = await getCustomerCreditTypeEnumApi();
    creditTypeEnum.value = creditTypeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    formConfig.value[1].options = creditTypeEnum.value;
    // 获取审批状态
    const creditStatusRes = await getCustomerCreditAuditStatusEnumApi();
    formConfig.value[2].options = creditStatusRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    // 获取生效状态
    const effectiveStatusRes = await getCustomerCreditEffectStatusEnumApi();
    formConfig.value[3].options = effectiveStatusRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

// 多选输入框
:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}
</style>