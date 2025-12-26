<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <!-- 公司级联选择 -->
                    <el-col>
                        <el-form-item :label="getLabel('orgId')" class="compact-item">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <!-- 客户下拉选择 -->
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')" class="compact-item">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 外部订单号（可输入多值） -->
                    <el-col>
                        <el-form-item :label="getLabel('outOrderNo')">
                            <canonicalInput v-model:listName="formData.outOrderNoList"
                                :placeholder="getPlaceholder('outOrderNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 跟踪号（可输入多值） -->
                    <el-col>
                        <el-form-item :label="getLabel('trackingNo')">
                            <canonicalInput v-model:listName="formData.trackingNoList"
                                :placeholder="getPlaceholder('trackingNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 运单类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('waybillTypeId')">
                            <el-select v-model="formData.waybillTypeId" :placeholder="getPlaceholder('waybillTypeId')">
                                <el-option v-for="item in waybillTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 目的国家选择 -->
                    <el-col>
                        <el-form-item :label="getLabel('destCountryCode')">
                            <el-select v-model="formData.destCountryCode" value-key="id" filterable
                                :placeholder="getPlaceholder('destCountryCode')">
                                <el-option v-for="item in countryOptions" :key="item.id"
                                    :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
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
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <!-- 新增轨迹按钮 -->
                            <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('addTrack')
                                }}</el-button>
                            <!-- 批量删除按钮 -->
                            <el-button type="danger" @click="handleBatchDel" :icon="Delete">{{
                                getButtonText('deleteTrack')
                            }}</el-button>
                            <!-- 优先抓取按钮 -->
                            <el-button type="warning" @click="handleGrab" :icon="Finished">{{
                                getButtonText('priorityGrab')
                            }}</el-button>
                            <!-- 导出按钮 -->
                            <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                            }}</el-button>
                        </div>
                    </div>
                </template>
                <!-- 使用插槽来自定义列内容，例如操作列 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleDetail(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('trackDetail') }}</span>
                        </div>
                    </div>
                </template>
                <!-- 自定义客户列显示 -->
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <!-- 是否签收列（带颜色） -->
                <template #isDelivered="{ row }">
                    <span :style="{ color: row.isDelivered ? 'green' : 'red' }">{{ row.isDelivered ? '是' :
                        '否' }}</span>
                </template>
                <!-- 是否完结列（带颜色） -->
                <template #finished="{ row }">
                    <span :style="{ color: row.finished ? 'green' : 'red' }">{{ row.finished ? '是' :
                        '否' }}</span>
                </template>
                <!-- 运单URL列（新标签打开） -->
                <template #labelUrl="{ row }">
                    <a :href="row.labelUrl" target="_blank">{{ row.labelUrl }}</a>
                </template>
            </hydTable>
        </div>
        <!-- 添加弹窗 -->
        <trajectoryFormDialog @submit="handleAddDialogSubmit" @cancel="handleDialogCancel" @close="handleAddDialogClose"
            ref="addFormDialogRef" />
        <!-- 批量删除弹窗 -->
        <batchDeleteTraceDialog :selectedTrackList="selectedTrackList" @close="handleDialogClose"
            ref="batchDialogRef" />
        <!-- 轨迹详情弹窗 -->
        <traceDetailDialog :order-info="selectedOrder" ref="traceDetailRef" />
        <!-- 批量操作弹窗 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'订单号'" @close="delColse" :promptMessage="promptMessage" />
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="402">
        </exportDialog>
    </div>
</template>

<script setup name="轨迹">
import { getOutstockOrderTraceListApi, outstockOrderTracePrioritizeFetchApi, addOutstockOrderTraceApi, getOutstockOrderTraceStatusApi } from '@/api/outstockApi/trace.js'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { getProductShipwayListApi, getProductShipwayBrandListApi, getProductSupplierListApi } from '@/api/productApi/shipway.js'
import { getOutstockOrderWayBillTypeEnumApi } from '@/api/outstockApi/order.js';
import trajectoryFormDialog from './add.vue';
import batchDeleteTraceDialog from './batchDeleteTraceDialog.vue';
import traceDetailDialog from './traceDetailDialog.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';

import { Plus, Finished, Share, Delete } from '@element-plus/icons-vue'
import * as api from '@/api/baseApi/sku.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// =====================
// 表单配置（filter）相关
// =====================
// 搜索表单配置项 - 定义可用的表单字段和类型
const formConfig = ref([
    { type: 'select', label: '服务商', prop: 'supplierId', options: [] },
    { type: 'select', label: '渠道', prop: 'shipwayId', options: [] },
    { type: 'select', label: '承运商', prop: 'carrierCode', options: [] },
    {
        type: 'select', label: '是否签收', prop: 'isDelivered', options: [
            { label: '是', value: true },
            { label: '否', value: false }
        ]
    },
    {
        type: 'select', label: '是否完结', prop: 'finished', options: [
            { label: '是', value: true },
            { label: '否', value: false }
        ]
    },
    {
        type: 'select', label: '关联包裹', prop: 'isUnlinked', options: [
            { label: '是', value: false },
            { label: '否', value: true }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据（用于 hydFilterBox 的 initial-value）
const initValues = ref({})

// 搜索事件 - 接收经过表单组件整理后的查询条件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        podStatusIdList: statusIdsArr.value,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}

// 重置事件 - 重置查询条件并刷新列表
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        podStatusIdList: [],
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}

// =====================
// 表格及分页相关
// =====================
// 表格数据
const tableData = shallowRef([])
// 表格列配置（包括 slot 定义）
const columns = ref([
    { label: '订单号 ', prop: 'outOrderNo', width: '220', fixed: 'left', sortable: true },
    { label: '跟踪号码 ', prop: 'trackingNo', width: '220', fixed: 'left', sortable: true },
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', fixed: 'left', slot: 'customer' },
    { label: '渠道 ', prop: 'shipwayName', width: '120', sortable: true },
    { label: '目的国家 ', prop: 'destCountryName', width: '150', sortable: true },
    { label: '服务商 ', prop: 'supplierName', width: '120', sortable: true },
    { label: '承运商 ', prop: 'carrierCode', width: '120', sortable: true },
    { label: '订单创建时间 ', prop: 'orderCreationTime', width: '200', sortable: true },
    { label: '发货时间 ', prop: 'shippedTime', width: '200', sortable: true },
    { label: '是否签收 ', prop: 'isDelivered', width: '120', sortable: true, slot: 'isDelivered' },
    { label: '签收时间 ', prop: 'deliveredTime', width: '200', sortable: true },
    { label: '是否完结 ', prop: 'finished', width: '120', sortable: true, slot: 'finished' },
    { label: '完结时间 ', prop: 'finishedTime', width: '200', sortable: true },
    { label: '最新抓轨迹时间 ', prop: 'lastTrackTime', width: '200', sortable: true },
    { label: '抓轨迹次数 ', prop: 'trackCount', width: '150' },
    { label: '运单URL', prop: 'labelUrl', width: '250', slot: 'labelUrl' },
    { label: '包裹重量 (KG)', prop: 'weight', width: '150' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
])

// 分页信息
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

// 表格加载状态
const loading = ref(true)

// 选择与交互相关方法
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
// 点击表格排序时触发（接收表格组件的 sort 字符串）
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// =====================
// 选择项与批量操作相关
// =====================
// 单选当前项
const selection = ref({})
// 多选行
const selectionRows = ref([])

// 新增弹窗引用与回调
const addFormDialogRef = ref(null);
const handleAddDialogSubmit = async (data) => {
    // 打开结果弹窗并逐条调用新增接口，保持原有逻辑不变
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    addFormDialogRef.value.closeDialog();
    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await addOutstockOrderTraceApi({ trackId: selectionRows.value[i].id, outOrderId: selectionRows.value[i].outOrderId, ...data });
        delData.value.push({
            id: selectionRows.value[i].outOrderNo,
            msg: res.msg,
            success: res.success
        })
    }
    promptMessage.value = '操作完成！'
}

// 新增轨迹按钮逻辑
const handleAdd = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择数据！'
        });
        return;
    }
    addFormDialogRef.value.openDialog({})
}

// 批量删除相关
const selectedTrackList = ref([])
const batchDialogRef = ref(null);
const handleBatchDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择数据！'
        });
        return;
    }
    selectedTrackList.value = selectionRows.value
    batchDialogRef.value.openDialog()
}

// 轨迹详情弹窗引用与打开
const traceDetailRef = ref(null);
const selectedOrder = ref({})

const handleDetail = (row) => {
    selectedOrder.value = row
    // 保持原来的延迟打开逻辑
    setTimeout(() => {
        traceDetailRef.value.openDialog()
    }, 200)
}

// 导出弹窗引用与打开
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// =====================
// 批量优先抓取（抓轨迹）
// =====================
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleGrab = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择数据！'
        });
        return;
    }
    loading.value = true;

    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await outstockOrderTracePrioritizeFetchApi({ trackId: selectionRows.value[i].id });
        delData.value.push({
            id: selectionRows.value[i].outOrderNo,
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus()
};
// 弹窗取消按钮（保留但未使用的 centerDialogVisible）
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// =====================
// 数据请求（列表/下拉）
// =====================
// 获取列表数据（主接口）
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOutstockOrderTraceListApi({
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

// 获状态栏
const getStatus = async () => {
    const data = {
        ...trimObjectStrings(initValues.value),
    }
    delete data.podStatusIdList
    const res = await getOutstockOrderTraceStatusApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...initValues.value.podStatusIdList]
}
// 状态栏
const statusIdsList = ref([])
// 状态栏数组
const statusIdsArr = ref([])
// 状态改变事件
const handleStatusChange = async (e) => {
    loading.value = true;
    let list = [...statusIdsArr.value];

    if (list.includes(null)) {
        list = [];
    }

    initValues.value.podStatusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

// =====================
// 公司/客户/国家 等下拉数据与联动
// =====================
// 公司数据（级联）
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 公司改变事件：切换客户下拉的 orgId 过滤，并尝试关闭级联浮层
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e : '';
    const result = await api.getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};

// 客户下拉选项
const customerOptions = ref([]);
const initialFilteredOptions = ref([])

// 国家数据
const countryOptions = ref([])

// 运单类型数据
const waybillTypeOptions = ref([])

// 组件挂载时请求各类下拉数据（公司/客户/国家/服务商/渠道/承运商）
onMounted(async () => {
    // 获取公司数据并转换为 cascader 需要的树结构
    const companyRes = await getOrgListCompanyApi();
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    // 初始化客户下拉（不传 orgId 时查询全部）
    const result = await api.getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
    companyOptions.value = convertToTree(companyRes.data);
    // 获取运单类型数据
    const waybillTypeRes = await getOutstockOrderWayBillTypeEnumApi();
    waybillTypeOptions.value = waybillTypeRes.data.map(item => ({ label: item.name, value: item.id }))

    // 获取国家数据
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data
    // 获取服务商数据并放到 formConfig（第一个 select）
    const supplierRes = await getProductSupplierListApi();
    formConfig.value[0].options = supplierRes.data.map(item => ({ label: item.name, value: item.code }))
    // 获取渠道数据并放到 formConfig（第二个 select）
    const shipwayRes = await getProductShipwayListApi();
    formConfig.value[1].options = shipwayRes.data.map(item => ({ label: item.name, value: item.code }))
    // 获取承运商数据并放到 formConfig（第三个 select）
    const shipwayBrandRes = await getProductShipwayBrandListApi();
    formConfig.value[2].options = shipwayBrandRes.data.map(item => ({ label: item.name, value: item.code }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>
