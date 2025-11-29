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
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('orderNoList')">
                            <canonicalInput v-model:listName="formData.orderNoList"
                                :placeholder="getPlaceholder('orderNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('trackingNo')">
                            <el-input v-model="formData.trackingNo" :placeholder="getPlaceholder('trackingNo')"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('sourceOrderNoList')">
                            <canonicalInput v-model:listName="formData.sourceOrderNoList"
                                :placeholder="getPlaceholder('sourceOrderNoList')" clearable>
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
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
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
                                    <el-dropdown-item @click="handleEdit(row)" v-if="row.statusId == 1">{{ getButtonText
                                        ('edit') }}</el-dropdown-item>
                                    <el-dropdown-item @click="handleDel(row)" v-if="row.statusId == 1">{{ getButtonText
                                        ('del') }}</el-dropdown-item>
                                    <el-dropdown-item @click="handleProcessing(row)">{{ getButtonText('processing') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 5 ? 'red' : 'green' }">{{ row.statusName }}</span>
                </template>
                <template #isCheck="{ row }">
                    <span :style="{ color: row.isCheck ? 'green' : 'red' }">{{ row.isCheck ? '是' : '否' }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>

            </hydTable>
        </div>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="224">
        </exportDialog>
        <!-- 处理弹窗 -->
        <processingDialog ref="processingDialogRef" :title="processingDialogTitle" :orderId="processingOrderId"
            @saved="onSaved">
        </processingDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'退件单号'" :successValue="successValue" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="退件单">
import { Plus, Share } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getInstockReturnReturnOrderApi, getInstockReturnReturnOrderStatusEnumApi, getInstockReturnReturnOrderTypeEnumApi, updInstockReturnReturnOrderStatusApi, destroyInstockReturnReturnParcelApi, shelfInstockReturnReturnProductApi, delInstockReturnReturnOrderApi } from '@/api/instockApi/return.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import processingDialog from './processingDialog.vue';
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', label: '退件类型', prop: 'typeId', options: [] },
    { type: 'select', label: '处理状态', prop: 'statusId', options: [] },
    {
        type: 'select', label: '是否清点', prop: 'isCheck', options: [
            { label: '是', value: true }, { label: '否', value: false }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false, offsetDays: 30 },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        orgId: data.orgId ? data.orgId[data.orgId.length - 1] : ''
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', width: '130', prop: 'orgName', sortable: true, flex: 'left' },
    { label: '仓库代码', width: '135', prop: 'warehouseCode', sortable: true, flex: 'left' },
    { label: '客户代码', width: '180', prop: 'customerCode', sortable: true, slot: 'customer', flex: 'left' },
    { label: '退件单号', width: '190', prop: 'orderNo', sortable: true },
    { label: '原出库单号', width: '210', prop: 'sourceOrderNo', sortable: true },
    { label: '退件类型', width: '145', prop: 'typeName', sortable: true },
    { label: '处理状态', width: '145', prop: 'statusName', sortable: true, slot: 'statusName' },
    { label: '是否清点', width: '135', prop: 'isCheck', sortable: true, slot: 'isCheck' },
    { label: '预计商品数量', width: '165', prop: 'forecastGoodsQty', sortable: true },
    { label: '包裹数量', width: '145', prop: 'parcelQty', sortable: true },
    { label: '物流单号', width: '200', prop: 'trackingNo', sortable: true },
    { label: '实收商品数量', width: '185', prop: 'receiptGoodsQty', sortable: true },
    { label: '清点时间', width: '200', prop: 'checkTime', sortable: true },
    { label: '上架时间', width: '200', prop: 'inShelfTime', sortable: true },
    { label: '签收时间', width: '200', prop: 'signTime', sortable: true },
    { label: '创建方式', width: '200', prop: 'createWay', sortable: true },
    { label: '备注', width: '225', prop: 'remark' },
    { label: '创建人', width: '100', prop: 'createdBy' },
    { label: '创建时间', width: '200', prop: 'createdTime', sortable: true },
    { label: '更新人', width: '100', prop: 'updatedBy' },
    { label: '更新时间', width: '200', prop: 'updatedTime', sortable: true },
    { label: '操作', width: '155', fixed: 'right', prop: 'action', slot: 'customBtn' }
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
        name: '编辑退件单',
        params: { id: row.id, name: row.orderNo },
    })
}
// 删除
const handleDel = (row) => {
    ElMessageBox.confirm(
        `是否要删除该条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await delInstockReturnReturnOrderApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000)
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        })
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '退件单详情',
        params: { id: row.id, name: row.orderNo },
    })
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    router.push('/instock/return/returnOrder/add')
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
// 处理
const processingDialogRef = ref(null)
const processingDialogTitle = ref('')
const processingOrderId = ref('')
const handleProcessing = (row) => {
    processingOrderId.value = row.id
    processingDialogTitle.value = `退件处理 - ${row.orderNo}`
    processingDialogRef.value.open()
}
const onSaved = () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getInstockReturnReturnOrderApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    footer.value = res.data.footer[0]
    // console.log('表格数据:', tableData.value)
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

// 仓库下拉框数据
const warehouseOptions = ref([])

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
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    // 获取状态
    const res = await getInstockReturnReturnOrderStatusEnumApi()
    formConfig.value[1].options = res.data.map(item => ({ label: item.name, value: item.id }))
    // 获取类型
    const res2 = await getInstockReturnReturnOrderTypeEnumApi()
    formConfig.value[0].options = res2.data.map(item => ({ label: item.name, value: item.id }))
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshReturnOrderList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshReturnOrderList = false
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