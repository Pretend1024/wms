<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <!-- 任务号 -->
                    <el-col>
                        <el-form-item :label="getLabel('taskNo')">
                            <el-input v-model.trim="formData.taskNo" :placeholder="getPlaceholder('taskNo')"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <!-- 状态 -->
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否模板 -->
                    <el-col>
                        <el-form-item :label="getLabel('isTemplate')">
                            <el-select v-model="formData.isTemplate" :placeholder="getPlaceholder('isTemplate')"
                                clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
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
                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer" @click=" handleEdit(row)">
                            <el-icon>
                                <DocumentCopy />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                    </div>
                </template>
                <template #table-buttons>
                    <!-- 手动开启 -->
                    <el-button type="primary" @click="handleStart" :icon="Position">{{ getButtonText('manualStart')
                        }}</el-button>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.holdUpStatus !== 2 ? 'green' : 'red' }">{{ row.holdUpStatusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #qtyNum1="{ row }">
                    <span v-if="row.orderQtyMax1 !== 0 && row.orderQtyMax1 !== undefined">
                        {{ row.orderQtyMin1 }}-{{ row.orderQtyMax1 }}
                    </span>
                </template>
                <template #qtyNum2="{ row }">
                    <span v-if="row.orderQtyMax2 !== 0 && row.orderQtyMax2 !== undefined">
                        {{ row.orderQtyMin2 }}-{{ row.orderQtyMax2 }}
                    </span>
                </template>
                <template #qtyNum3="{ row }">
                    <span v-if="row.orderQtyMax3 !== 0 && row.orderQtyMax3 !== undefined">
                        {{ row.orderQtyMin3 }}-{{ row.orderQtyMax3 }}
                    </span>
                </template>
                <template #qtyNum4="{ row }">
                    <span v-if="row.orderQtyMax4 !== 0 && row.orderQtyMax4 !== undefined">
                        {{ row.orderQtyMin4 }}-{{ row.orderQtyMax4 }}
                    </span>
                </template>
                <template #productQty="{ row }">
                    <span v-if="row.productQtyMax">
                        {{ row.productQtyMin }}-{{ row.productQtyMax }}
                    </span>
                </template>
                <template #isDistinguishShipway="{ row }">
                    <span :style="{ color: row.isDistinguishShipway ? 'green' : 'red' }">{{ row.isDistinguishShipway ?
                        '是' : '否' }}</span>
                </template>
                <template #isDistinguishZoneCode="{ row }">
                    <span :style="{ color: row.isDistinguishZoneCode ? 'green' : 'red' }">{{ row.isDistinguishZoneCode ?
                        '是' : '否' }}</span>
                </template>

            </hydTable>
        </div>
        <updDialog ref="updDialogRef" :warehouseOptions="warehouseOptions" :initId="initId" />
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'波次任务号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="波次创建记录">
import { getOutstockWaveRecordApi,getOutstockWaveTaskStatusEnumApi, startActionApi } from
      '@/api/outstockApi/wave.js'
import updDialog from '../outWaveTask/upd.vue'

import { Close, SemiSelect, Check, Position, Checked } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { outstockOrderCancelHoldUpApi } from '@/api/outstockApi/holdup.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

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
    // { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCodes', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCodes', width: '135', fixed: 'left', sortable: true },
    { label: ' 波次任务号 ', prop: 'taskNo', width: '150', fixed: 'left' },
    { label: ' 波次号 ', prop: 'waveNo', width: '150', sortable: true },
    { label: ' 波次类型 ', prop: 'waveTypeName', width: '200', sortable: true },
    { label: ' 模板名称 ', prop: 'taskName', width: '150' },
    { label: ' 符合条件订单数 ', prop: 'orderQtyTotal', width: '160', sortable: true },
    { label: ' 分配库存成功数 ', prop: 'orderQtyAudited', width: '160', sortable: true },
    { label: ' 分配库存失败数 ', prop: 'orderQtyAuditedFail', width: '160', sortable: true },
    { label: ' 成功组成波次订单数 ', prop: 'orderQtyInWave', width: '200', sortable: true },
    { label: ' 已建波次数量 ', prop: 'waveCount', width: '140', sortable: true },
    { label: ' 状态', prop: 'statusName', width: '120', sortable: true },
    { label: ' 上次进度反馈时间 ', prop: 'progressTime', width: '200', sortable: true },
    { label: '业务类型', prop: 'businessName', width: '120', sortable: true, sortAlias: 'businessId' },
    { label: ' 渠道代码 ', prop: 'shipwayCodes', width: '140' },
    { label: ' 是否区分渠道 ', prop: 'isDistinguishShipway', width: '140', sortable: true, slot: 'isDistinguishShipway' },
    { label: ' 是否区分库区 ', prop: 'isDistinguishZoneCode', width: '140', sortable: true, slot: 'isDistinguishZoneCode' },
    { label: ' 订单开始时间 ', prop: 'orderStartTime', width: '200', sortable: true },
    { label: ' 订单结束时间 ', prop: 'orderEndTime', width: '200', sortable: true },
    { label: ' 指定 SKU', prop: 'skus', width: '180' },
    { label: ' 波次类型 ID', prop: 'waveTypeId', width: '140', sortable: true },
    { label: ' 指定库区类型 ', prop: 'zoneTypes', width: '160' },
    { label: ' 指定库区 ', prop: 'zoneCodes', width: '160' },
    { label: ' 排除库区 ', prop: 'excludeZoneCodes', width: '160' },
    { label: ' 批次排序类型 ', prop: 'batchSortType', width: '140', sortable: true },
    { label: ' 库存排序类型 ', prop: 'inventorySortType', width: '140', sortable: true },
    // { label: ' 波次内最小商品数 ', prop: 'productQtyMin', width: '180', sortable: true },
    // { label: ' 波次内最大商品数 ', prop: 'productQtyMax', width: '180', sortable: true },
    { label: ' 商品数范围 ', prop: 'productQty', slot: 'productQty', width: '160' },
    { label: ' 类型 1 数范围 ', prop: 'qtyNum1', slot: 'qtyNum1', width: '160' },
    { label: ' 类型 1 数范围 ', prop: 'qtyNum2', slot: 'qtyNum2', width: '160' },
    { label: ' 类型 1 数范围 ', prop: 'qtyNum3', slot: 'qtyNum3', width: '160' },
    { label: ' 类型 1 数范围 ', prop: 'qtyNum4', slot: 'qtyNum4', width: '160' },
    { label: ' 结束时间 ', prop: 'finishTime', width: '200', sortable: true },
    { label: ' 备注 ', prop: 'remark', width: '200' },
    { label: ' 指定入库单 ', prop: 'inOrderNoList', width: '220' },
    { label: ' 上架开始时间 ', prop: 'onShelfStartTime', width: '200', sortable: true },
    { label: ' 上架结束时间 ', prop: 'onShelfEndTime', width: '200', sortable: true },
    { label: ' 指定库位 ', prop: 'locationCodes', width: '220' },
    { label: ' 排除库位 ', prop: 'excludeLocationCodes', width: '220' },
    { label: ' 库存分配优先级 ', prop: 'allocationPriorityList', width: '200' },
    { label: ' 创建时间 ', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '90', fixed: 'right', slot: 'customBtn' }
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

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 手动开启
const handleStart = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要开启的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要开启${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条波次任务?`,
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
                const res = await startActionApi(selectionRows.value[i].id);
                delData.value.push({
                    id: selectionRows.value[i].taskNo,
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
}

const initId = ref('')
const updDialogRef = ref(null)
// 详情
const handleEdit = (row) => {
    initId.value = row.id
    updDialogRef.value.open()
}

// 新增
const addDialogRef = ref(null)
const handleAdd = () => {
    addDialogRef.value.open()
}
const addConfirm = () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}


// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
// 取消
const handleCancel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消拦截${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单?`,
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
                const res = await outstockOrderCancelHoldUpApi({ outOrderId: selectionRows.value[i].outOrderId });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
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

const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOutstockWaveRecordApi({
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
// 仓库数据
const warehouseOptions = ref([])
// 拦截状态
const statusOptions = ref([])

onMounted(async () => {
    // 获取仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 获取拦截状态
    const statusRes = await getOutstockWaveTaskStatusEnumApi()
    statusOptions.value = statusRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}
</style>