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

                    <!-- 仓库 -->
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.code" :label="item.label"
                                    :value="item.value" />
                            </el-select>
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
                    <!-- 增值服务单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('vasOrderNoList')">
                            <canonicalInput v-model:listName="formData.vasOrderNoList"
                                :placeholder="getPlaceholder('vasOrderNoList')" clearable>
                            </canonicalInput>
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <!-- 取消 -->
                    <el-button type="danger" @click="handleCancel" :icon="Close">{{ getButtonText('cancel')
                    }}</el-button>
                    <!-- 强制完成 -->
                    <el-button type="success" @click="handleForceComplete" :icon="Check">{{
                        getButtonText('forceComplete') }}</el-button>
                    <el-button type="success" @click="handlePrintPick" :icon="Printer">{{
                        getButtonText('printServiceOrder')
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
                        <!-- <div class="cursor-pointer" @click="resetPassword(row)">
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
                        </div> -->
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 30 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #isForceComplete="{ row }">
                    <span :style="{ color: row.isForceComplete ? 'green' : 'red' }">{{ row.isForceComplete ? '是' : '否'
                    }}</span>
                </template>
                <template #vasOrderNo="{ row }">
                    <span class="copyText" @click="handleInfo(row)">{{ row.vasOrderNo }}</span>
                </template>
            </hydTable>
        </div>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'服务单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="增值服务单">
import { Plus, Check, Close, Printer, View, Remove } from '@element-plus/icons-vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getVasOrderPageApi, delVasOrderByIdApi, getPrintVasOrderDataApi, toCancelledApi, toForceCompleteApi, getVasOrderStatusEnumApi, getVasOrderRelatedBizTypeEnumApi } from '@/api/vasApi/vas.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { openVasPrintWindow } from './printMethods'
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
    { type: 'input', label: '关联单号', prop: 'relatedBizNo' },
    { type: 'select', label: '业务类型', prop: 'relatedBizType', options: [] },
    { type: 'select', label: '服务状态', prop: 'statusId', options: [] },
    { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true },
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true }, // 修正prop为实
    { label: ' 增值服务单号 ', prop: 'vasOrderNo', width: '160', sortable: true, slot: 'vasOrderNo' },

    { label: ' 服务标题 ', prop: 'vasTitle', width: '180' },
    { label: ' 关联业务类型 ', prop: 'relatedBizTypeName', width: '140', sortable: true },
    { label: ' 关联业务单号 ', prop: 'relatedBizNo', width: '160' },

    { label: ' 服务状态 ', prop: 'statusId', width: '120', sortable: true, slot: 'statusName' },
    { label: ' 服务描述 ', prop: 'vasDesc', width: '200' },
    { label: ' 总计划数量 ', prop: 'totalPlanQty', width: '140' },
    { label: ' 总完成数量 ', prop: 'totalFinishQty', width: '140' },
    { label: ' 预计完成时间 ', prop: 'expectFinishTime', width: '200', sortable: true },
    { label: ' 实际完成时间 ', prop: 'actualFinishTime', width: '200', sortable: true },
    { label: ' 打印时间 ', prop: 'printedTime', width: '200', sortable: true },
    { label: ' 强制完成 ', prop: 'isForceComplete', width: '120', sortable: true, slot: 'isForceComplete' },
    { label: ' 取消原因 ', prop: 'cancelReason', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
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
        name: '编辑增值服务单',
        params: { id: row.vasOrderNo, name: row.vasOrderNo },
    })
}
// 查看
const handleInfo = (row) => {
    router.push({
        name: '增值服务单详情',
        params: { id: row.vasOrderNo, name: row.vasOrderNo },
    })
}

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])
// 批量数据
const setRoleData = ref([])
// 添加
const handleAdd = async () => {
    router.push('/vas/vas/vasOrder/add')
}


// 取消
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleCancel = async () => {
    // 1. 校验是否勾选数据
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }

    // 2. 弹出输入框获取审批备注（选填）
    try {
        const { value: remark } = await ElMessageBox.prompt(
            `请输入取消原因（选填）`,
            '取消原因',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        );
        delData.value = [];
        // 3. 显示加载状态和审批结果弹窗
        loading.value = true;
        delDialogVisible.value = true;
        promptMessage.value = '操作中...';

        // 4. 循环处理勾选的数据，调用审批接口
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await toCancelledApi(remark, { id: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].vasOrderNo,
                msg: res.msg,
                success: res.success
            });
            console.log('删除数据:', res);
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
// 强制完成
const handleForceComplete = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要完成的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要强制完成${selectionRows.value.length}条数据?`,
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
                const res = await toForceCompleteApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].vasOrderNo,
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
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 打印
const handlePrintPick = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要打印的数据！'
        });
        return;
    }
    const waveIds = selectionRows.value.map(item => item.id)
    const res = await getPrintVasOrderDataApi(waveIds)
    // 假定返回的数据是数组（res.data 或 res）
    const orders = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : (res && res.rows ? res.rows : []))
    if (!orders || orders.length === 0) {
        smartAlert('打印数据获取失败', false)
        return
    }
    openVasPrintWindow(orders)
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getVasOrderPageApi({
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
const warehouseOptions = ref([])
const customerOptions = ref([])
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
    // 客户
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 获取仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 业务状态
    const vasOrderStatusEnumRes = await getVasOrderStatusEnumApi()
    formConfig.value[2].options = vasOrderStatusEnumRes.data.map(item => ({ label: item.name, value: item.id }))
    // 业务类型
    const vasOrderRelatedBizTypeEnumRes = await getVasOrderRelatedBizTypeEnumApi()
    formConfig.value[1].options = vasOrderRelatedBizTypeEnumRes.data.map(item => ({ label: item.name, value: item.id }))
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshAddServiceList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshAddServiceList = false
    }
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