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
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('waveTypeId')">
                            <el-select v-model="formData.waveTypeId" :placeholder="getPlaceholder('waveTypeId')"
                                clearable>
                                <el-option v-for="item in waveTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('allocatedStatus')">
                            <el-select v-model="formData.allocatedStatus"
                                :placeholder="getPlaceholder('allocatedStatus')" clearable>
                                <el-option v-for="item in allocatedStatusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('allocatedEmployeeNum')">
                            <el-input v-model.trim="formData.allocatedEmployeeNum"
                                :placeholder="getPlaceholder('allocatedEmployeeNum')" clearable />
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
                            <!-- 新增 -->
                            <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('addWave')
                            }}</el-button>
                            <!-- 创建记录 -->
                            <el-button type="primary" @click="handleLog" :icon="Checked">{{
                                getButtonText('createRecord')
                                }}</el-button>
                            <!-- 打印拣货单 -->
                            <el-button type="success" @click="handlePrintPick" :icon="Printer">{{
                                getButtonText('printPickList')
                                }}</el-button>
                            <!-- 打印运单 -->
                            <el-button type="success" @click="handlePrint" :icon="Printer">{{
                                getButtonText('printTrackingNo')
                                }}</el-button>
                            <!-- 拣货人 -->
                            <el-dropdown trigger="click">
                                <el-button type="danger">
                                    {{ getButtonText('assignPicker')
                                    }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleAllocatedUser">{{ getButtonText('assign')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="CancelAllocated"> {{
                                            getButtonText('cancelAssignPicker')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId !== 1 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #allocatedEmployeeNum="{ row }">
                    {{ row.allocatedEmployeeNum }}{{ row.allocatedEmployeeNum ? '(' + row.allocatedEmployeeName + ')' :
                        '' }}
                </template>
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

            </hydTable>
        </div>
        <!-- <addDialog ref="addDialogRef" @confirm="addConfirm" :warehouseOptions="warehouseOptions"
            :customerOptions="customerOptions" /> -->
        <!-- 打印拣货单 -->
        <el-dialog v-model="PickDialogVisible" title="打印拣货单" width="500" align-center destroy-on-close>
            <el-form :model="form">
                <el-form-item label="打印尺寸:" label-width="90px">
                    <el-select v-model="form.printFormat">
                        <el-option v-for="(item, index) in pickOptions" :label="item.name" :value="item.id"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="更新打印:" label-width="90px">
                    <el-select v-model="form.isPrintUpdated">
                        <el-option label="更新为已打印" :value="true" />
                        <el-option label="不更新" :value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item label="刷新列表:" label-width="90px">
                    <el-select v-model="form.refresh">
                        <el-option :label="$t('yes')" :value="true" />
                        <el-option :label="$t('no')" :value="false" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="PickDialogVisible = false"> {{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handlePickConfirm">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 打印弹窗 -->
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="10"
            :show-print-format="false">
        </printDialog>
        <!-- 选择拣货人 -->
        <allocatedUserDialog ref="allocatedUserDialogRef" @close="dialogClose" :companyOptions="companyOptions" />
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'出库单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="波次">
import { getOutstockWaveListApi, getOutstockWaveAllocateStatusEnumApi, getOutstockWaveTypeEnumApi, printWavePickApi, getOutstockWavePrintFormatEnumApi, cancelAllocatePickingUserApi, getOutstockWaveStatusCountApi } from '@/api/outstockApi/wave.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
import { openPrintWindow } from './printMethods'
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import allocatedUserDialog from './allocatedUser.vue'

import { Close, SemiSelect, Printer, Plus, Checked } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    // 波次号码
    { type: 'input', prop: 'waveNo', width: '180' },
    { type: 'input', prop: 'taskNo', width: '180' },
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
        statusIdList: statusIdsArr.value,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: [],
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '135', slot: 'customer', fixed: 'left', sortable: true },
    { label: '波次任务号', prop: 'taskNo', width: '150', fixed: 'left' },
    { label: '波次号', prop: 'waveNo', width: '150', sortable: true, fixed: 'left' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '波次类型', prop: 'waveTypeName', width: '200', sortable: true },
    { label: '状态', prop: 'statusName', width: '125', slot: 'statusName', sortable: true },
    { label: '拣货人', prop: 'allocatedEmployeeNum', width: '160', sortable: true, slot: 'allocatedEmployeeNum' },
    { label: '波次打印时间', prop: 'printWaveTime', width: '200', sortable: true },
    { label: '库区', prop: 'zoneCode', width: '150', sortable: true },
    { label: '库位', prop: 'locationCode', width: '150', sortable: true },
    { label: '订单数量', prop: 'orderQty', width: '150', sortable: true },
    { label: '商品数量', prop: 'goodsQty', width: '150', sortable: true },
    { label: '货位数量', prop: 'locationQty', width: '150', sortable: true },
    { label: '下架人', prop: 'outShelfBy', width: '150', sortable: true },

    { label: '下架开始时间', prop: 'outShelfTimeStart', width: '200', sortable: true },
    { label: '下架结束时间', prop: 'outShelfTimeEnd', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    // { label: '操作', prop: 'action', width: '90', fixed: 'right', slot: 'customBtn' }
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

// 新增
const addDialogRef = ref(null)
const handleAdd = () => {
    router.push('/outstock/wave/outWave/add')
}

// 创建记录
const handleLog = () => {
    router.push({ path: '/outstock/wave/outWaveTask/list' })
}

// 打印拣货单
const PickDialogVisible = ref(false)
const form = ref({
    printFormat: 10,
    isPrintUpdated: true,
    refresh: true,
})

// 打印
const handlePrintPick = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要打印的数据！'
        });
        return;
    }
    PickDialogVisible.value = true;
}
// 打印拣货单
const handlePickConfirm = async () => {
    try {
        PickDialogVisible.value = false
        const waveIds = selectionRows.value.map(item => item.id)
        const res = await printWavePickApi({ ...form.value, waveIds })
        // 假定返回的数据是数组（res.data 或 res）
        const orders = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : (res && res.rows ? res.rows : []))
        if (!orders || orders.length === 0) {
            smartAlert('打印数据获取失败', false)
            return
        }
        openPrintWindow(orders)
        // 是否刷新列表
        if (form.value.refresh) {
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        }
    } catch (err) {
        console.error(err)
        smartAlert('打印数据获取失败', false)
        // ElMessage({ type: 'error', message: '打印数据获取失败' })
    }
}

// 打印
const printDialogRef = ref(null)
const handlePrint = async () => {
    printDialogRef.value.openPrintDialog()
}

// 选择拣货人
const allocatedUserDialogRef = ref(null)
const handleAllocatedUser = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要分配的订单！'
        });
        return;
    }
    const orderIds = selectionRows.value.map(item => item.id)
    allocatedUserDialogRef.value.open(orderIds)
}
// 取消分配
const CancelAllocated = async () => {
    const orderIds = selectionRows.value.map(item => item.id)
    const res = await cancelAllocatePickingUserApi(orderIds)
    if (res.success) {
        delData.value = res.data.map(item => ({
            id: item.code,
            msg: item.data,
            success: item.success
        }));
        delDialogVisible.value = true;
        promptMessage.value = '操作完成！'
    }
}
const dialogClose = () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')

const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus()
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOutstockWaveListApi({
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
// 获状态栏
const getStatus = async () => {
    const data = {
        ...trimObjectStrings(initValues.value),
    }
    delete data.statusIdList
    const res = await getOutstockWaveStatusCountApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...initValues.value.statusIdList]
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

    initValues.value.statusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
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
// 筛选客户代码
const customerOptions = ref([]);
// 仓库数据
const warehouseOptions = ref([])
// 分配状态
const allocatedStatusOptions = ref([])
// 波次类型
const waveTypeOptions = ref([])
const pickOptions = ref([])

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
    // 获取仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 获取分配状态
    const holdUpStatusRes = await getOutstockWaveAllocateStatusEnumApi()
    allocatedStatusOptions.value = holdUpStatusRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    // 获取波次类型
    const waveTypeRes = await getOutstockWaveTypeEnumApi()
    waveTypeOptions.value = waveTypeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    // 获取打印尺寸
    const pickRes = await getOutstockWavePrintFormatEnumApi()
    pickOptions.value = pickRes.data
})

// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshWaveList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshWaveList = false
    }
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


// 多选输入框
:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>