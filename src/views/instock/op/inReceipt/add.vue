<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>订单信息</p>
            <el-row>
                <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 20px;">
                    <el-select v-model="orderData.numberType" @change="getOrderInfo" style="width: 113px;">
                        <el-option v-for="item in numberTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <span style="padding: 12px 12px 12px 3px;">:</span>
                    <el-input v-model.trim="orderData.number" :autofocus='true' style="width: 400px;"
                        @keyup.enter.stop="getOrderInfo" ref="numberInput" />
                    <el-button type="danger" plain :icon="RefreshLeft" style="margin-left: 10px;" @click="reset">{{
                        getButtonText('reset') }}</el-button>
                    <span :style="{ color: message.type ? 'green' : 'red', fontSize: '16px', marginLeft: '10px' }">{{
                        message.content }}</span>
                </el-col>
            </el-row>

            <el-form :model="orderInfo" ref="formRef" label-width="131px">
                <el-row>
                    <el-col :span="6"><el-form-item :label="$t('instock_op_inReceipt_add.warehouseCode')"><el-input v-model.trim="orderInfo.warehouseCode"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item :label="$t('instock_op_inReceipt_add.customerCode')"><el-input v-model.trim="orderInfo.customerCode"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="入库单号"><el-input v-model.trim="orderInfo.orderNo"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="状态:"><el-input v-model.trim="orderInfo.statusName"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="创建时间:"><el-input v-model.trim="orderInfo.createdTime"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="创建方式:"><el-input v-model.trim="orderInfo.createWay"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="业务类型:"><el-input v-model.trim="orderInfo.businessName"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="头程物流:"><el-input v-model.trim="orderInfo.firstLegName"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="头程单号:"><el-input v-model.trim="orderInfo.trackingNo1"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="尾程单号:"><el-input v-model.trim="orderInfo.trackingNo2"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="计划到仓时间:"><el-input
                                v-model.trim="orderInfo.plannedArrivalTime" readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="到仓类型:"><el-input v-model.trim="orderInfo.arrivalTypeName"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="货柜型号:"><el-input v-model.trim="orderInfo.containerType"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="货柜号:"><el-input v-model.trim="orderInfo.containerNumber"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="收货方式:"><el-input v-model.trim="orderInfo.receiptMethodName"
                                readonly /></el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="上架方式:"><el-input v-model.trim="orderInfo.inShelfMethodName"
                                readonly /></el-form-item></el-col>
                </el-row>
            </el-form>

            <p>收货详情</p>
            <el-row>
                <el-form-item label="收货方式:">
                    <el-select v-model="orderData.receiptMethod" placeholder="请选择收货方式" style="width: 160px;"
                        @change="getOrderSkuInfo" :disabled="isOrderNotFetched">
                        <el-option v-for="item in receiptMethodOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <div class="searchDiv">
                    <div>
                        <span>按</span>
                        <el-select v-model="way" clearable style="width: 90px;margin: 0 5px;"
                            :disabled="isOrderNotFetched">
                            <el-option v-for="item in wayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <span>检索：</span>
                        <el-input ref="searchRef" v-model="orderData.search" placeholder="请输入条码/SKU/箱号"
                            style="width: 230px; " @keyup.enter.stop="focusFirstMatch" :disabled="isOrderNotFetched" />
                    </div>
                </div>
                <el-tooltip content="刷新" placement="top" effect="light">
                    <el-icon @click="getOrderSkuInfo"
                        :style="{ cursor: isOrderNotFetched ? 'not-allowed' : 'pointer', color: isOrderNotFetched ? '#C0C4CC' : '#409eff', fontSize: '31px' }">
                        <RefreshLeft />
                    </el-icon>
                </el-tooltip>
            </el-row>

            <div class="tableDiv" ref="tableContainer">
                <inOrder-table v-if="orderData.receiptMethod == 12" ref="tableRef" :controlsVisible="false"
                    index-label="序号" :columns="tableColumns1" :data="userData1" :merge-key="['boxNo']"
                    :merge-cols="['boxNo', 'boxQty', 'receiptBoxQty']" @update:data="val => (userData1 = val)"
                    :getRowClass="getRowClass">
                    <template #boxNo="{ row }">
                        <span v-html="way === 'boxNo' ? highlight(row.boxNo) : row.boxNo"></span>
                    </template>
                    <template #sku="{ row }">
                        <span v-html="way === 'sku' ? highlight(row.sku) : row.sku"></span>
                    </template>
                    <template #barcode="{ row }">
                        <span v-html="way === 'barcode' ? highlight(row.barcode) : row.barcode"></span>
                    </template>
                    <template #receiptGoodsQty="{ row }">
                        <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)"
                            :disabled="isOrderNotFetched" />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" @keyup.enter.stop="submit(row)" :disabled="isOrderNotFetched" />
                    </template>
                </inOrder-table>

                <general-table v-if="orderData.receiptMethod == 11" :tableData="userData2" :columns="tableColumns2"
                    :getRowStyle="getRowStyle">
                    <template #sku="{ row }">
                        <span v-html="way === 'sku' ? highlight(row.sku) : row.sku"></span>
                    </template>
                    <template #barcode="{ row }">
                        <span v-html="way === 'barcode' ? highlight(row.barcode) : row.barcode"></span>
                    </template>
                    <template #currentReceiptQty="{ row }">
                        <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)"
                            :disabled="isOrderNotFetched" />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" @keyup.enter.stop="submit(row)" :disabled="isOrderNotFetched" />
                    </template>
                </general-table>
            </div>
        </div>

        <el-dialog v-model="centerDialogVisible" title="选择订单" width="700" align-center destroy-on-close>
            <el-table :data="orderList" highlight-current-row :current-row-key="orderId" :stripe="true"
                style="width: 100%;" :height="400" border @row-click="handleRowClick" @row-dblclick="handleRowDblClick">
                <el-table-column prop="warehouseCode" label="仓库代码" width="110"></el-table-column>
                <el-table-column prop="customerCode" label="客户代码" width="110"></el-table-column>
                <el-table-column prop="orderNo" label="入库单号" width="220"> </el-table-column>
                <el-table-column prop="statusName" label="状态" width="100"> </el-table-column>
                <el-table-column prop="createdTime" label="创建时间" width="170"></el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false, orderId = ''">{{ getButtonText('cancel')
                        }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-alert v-if="showAlert" :title="alertMessage" :type="alertType" center show-icon
            @close="showAlert = false" />
    </div>
</template>

<script setup name="收货">
import { ref, onMounted, onActivated, nextTick, computed } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { ElLoading, ElMessageBox } from 'element-plus'
import {
    getOrderInOrderInfoApi, getOrderInOrderSkuCheckApi, getOrderInReceiptBoxApi,
    getInstockInOrderReceiptMethodEnumApi, getOrderListByNumberTypeApi, addOrderInReceiptApi
} from '@/api/instockApi/order.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { getButtonText } from '@/utils/i18n/i18nLabels'

/** 响应式状态定义 */
const orderData = ref({
    number: '',        // 检索单号
    numberType: 1,     // 单号类型（1:入库单号, 2:头程单号...）
    receiptMethod: '',  // 收货方式（11:按SKU, 12:按箱）
    search: ''         // 表格内部检索关键字
})

const orderInfo = ref({}) // 存放接口获取的订单明细
const orderId = ref('')   // 当前选中的订单ID
const way = ref('barcode') // 默认检索方式为条码
const centerDialogVisible = ref(false) // 控制订单选择弹窗
const orderList = ref([]) // 多订单列表
const message = ref({ type: true, content: '' }) // 检索结果状态提示
const userData1 = ref([]) // 按箱表格数据
const userData2 = ref([]) // 按SKU表格数据
const numberInput = ref(null) // 顶部单号输入框引用
const searchRef = ref(null)   // 收货详情检索框引用
const tableContainer = ref(null) // 表格容器引用
const receiptMethodOptions = ref([]) // 收货方式枚举

/** 弹窗告警相关逻辑 */
const showAlert = ref(false)
const alertType = ref('success')
const alertMessage = ref('')

/** 功能注释：判断是否未获取到有效的订单信息 */
const isOrderNotFetched = computed(() => {
    return !orderId.value || !orderInfo.value.orderNo
})

/** 下拉/配置项定义 */
const wayOptions = [
    { value: 'barcode', label: '条码' },
    { value: 'sku', label: 'SKU' },
    { value: 'boxNo', label: '箱号' }
]
const numberTypeOptions = [
    { value: 1, label: '入库单号' },
    { value: 2, label: '头程单号' },
    { value: 3, label: '尾程单号' },
    { value: 4, label: '箱号' }
]

/** 初始化获取收货方式 */
onMounted(async () => {
    const res = await getInstockInOrderReceiptMethodEnumApi()
    receiptMethodOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    focusInput()
})

onActivated(() => {
    focusInput()
})

/** 获取订单基本信息 */
const getOrderInfo = async () => {
    orderInfo.value = {}
    orderData.value.receiptMethod = ''
    orderId.value = ''
    if (!orderData.value.numberType || !orderData.value.number) return

    try {
        const res = await getOrderListByNumberTypeApi(orderData.value)
        if (res.success && res.data.length > 1) {
            orderList.value = res.data
            centerDialogVisible.value = true
        } else if (res.success && res.data.length == 1) {
            orderId.value = res.data[0].id
            const res2 = await getOrderInOrderInfoApi({ id: res.data[0].id })
            orderInfo.value = res2.data
            // 如果订单已有收货方式，则自动触发 SKU 信息获取
            if (orderInfo.value.receiptMethodId) {
                orderData.value.receiptMethod = orderInfo.value.receiptMethodId
                getOrderSkuInfo()
            }
        }
        message.value = { type: res.success, content: res.msg }
        if (res.success) {
            nextTick(() => {
                searchRef.value?.$el?.querySelector('input')?.focus()
            })
        }
    } finally {
    }
}

/** 获取订单下详细的 SKU 或箱子信息 */
const getOrderSkuInfo = async () => {
    if (!orderId.value) {
        smartAlert('请先获取订单信息', false)
        orderData.value.receiptMethod = ''
        return
    }
    try {
        if (orderData.value.receiptMethod == 11) { // 按SKU
            const res = await getOrderInOrderSkuCheckApi({ inOrderId: orderId.value })
            userData2.value = (res.data || []).map(item => ({
                ...item,
                qty: Math.max(item.goodsQty - item.receiptGoodsQty, 0)
            }))
        } else if (orderData.value.receiptMethod == 12) { // 按箱
            const res = await getOrderInReceiptBoxApi({ inOrderId: orderId.value })
            userData1.value = (res.data || []).map(item => ({
                ...item,
                qty: Math.max(item.goodsQty - item.receiptGoodsQty, 0)
            }))
        }
    } finally {
    }
}

/** 提交收货数据 */
const submit = async (row) => {
    const data = {
        inOrderId: orderId.value,
        receiptMethodId: orderData.value.receiptMethod,
        boxNo: row.boxNo || '',
        sku: row.sku,
        qty: Number(row.qty),
        remark: row.remark || '',
        isConfirm: false,
        qualityId: 1
    }
    try {
        const res = await addOrderInReceiptApi(data)
        const feedbackMsg = res.msg || '操作出现问题，是否重试？'

        if (res.code === '500') {
            const confirmResult = await ElMessageBox.confirm(feedbackMsg, '提示', {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
            })
            if (confirmResult === 'confirm') {
                blurAllInputs()
                data.isConfirm = true
                const retryRes = await addOrderInReceiptApi(data)
                showSuccessAlert(retryRes.msg || '重试操作完成', retryRes.success)
                getOrderSkuInfo()
                refreshSearchFocus()
            }
        } else {
            showSuccessAlert(feedbackMsg, res.success)
            getOrderSkuInfo()
            refreshSearchFocus()
        }
    } catch (error) {
        console.error('收货提交出错:', error)
    }
}

/** 辅助功能：检索并自动聚焦匹配行 */
const focusFirstMatch = async () => {
    const kw = orderData.value.search?.trim()
    if (!kw) return
    await nextTick()
    const container = tableContainer.value
    if (!container) return
    const highlightSpan = container.querySelector('.highlight')
    if (!highlightSpan) return
    const tr = highlightSpan.closest('tr')
    if (!tr) return
    tr.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = tr.querySelector('input[type="number"]')
    if (input) {
        input.focus()
        input.select()
    }
}

/** 辅助功能：反馈消息 Alert */
const showSuccessAlert = (message, state) => {
    alertType.value = state ? 'success' : 'error'
    alertMessage.value = message
    showAlert.value = true
    setTimeout(() => { showAlert.value = false }, state ? 1000 : 5000)
}

/** 辅助功能：刷新检索框焦点并清空输入 */
const refreshSearchFocus = () => {
    nextTick(() => {
        searchRef.value?.$el?.querySelector('input')?.focus()
        orderData.value.search = ''
    })
}

/** 表格样式处理 */
const getRowStyle = ({ row }) => {
    if (row.receiptGoodsQty !== row.goodsQty && row.receiptGoodsQty < row.goodsQty) {
        return 'background-color: #ffcbcb;'
    }
    return ''
}

const getRowClass = ({ row }) => {
    return row.goodsQty != row.receiptGoodsQty && row.receiptGoodsQty < row.goodsQty ? 'red-row' : ''
}

/** 工具方法 */
const reset = () => {
    orderData.value = { number: '', numberType: 1, receiptMethod: '', search: '' }
    orderInfo.value = {}
    orderId.value = ''
    message.value = { type: true, content: '' }
    way.value = 'barcode'
    userData1.value = []
    userData2.value = []
}

const handleRowClick = (row) => { orderId.value = row.id }
const handleRowDblClick = (row) => { orderId.value = row.id; handleDialogConfirm() }

const handleDialogConfirm = async () => {
    if (!orderId.value) return
    try {
        const res = await getOrderInOrderInfoApi({ id: orderId.value })
        orderInfo.value = res.data
        if (orderInfo.value.receiptMethodId) {
            orderData.value.receiptMethod = orderInfo.value.receiptMethodId
            getOrderSkuInfo()
        }
        centerDialogVisible.value = false
        refreshSearchFocus()
    } finally {
    }
}

function focusInput() { nextTick(() => { numberInput.value?.focus?.() }) }
function blurAllInputs() { document.querySelectorAll('input').forEach(el => el.blur()) }
function escapeRegExp(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

/** 搜索高亮逻辑 */
function highlight(text) {
    const kw = orderData.value.search?.trim()
    if (!kw || !text) return text
    const reg = new RegExp(`(${escapeRegExp(kw)})`, 'ig')
    return text.toString().replace(reg, '<span class="highlight">$1</span>')
}

// 表格列定义
const tableColumns1 = [
    { label: '箱号', prop: 'boxNo', width: '180', slot: 'boxNo' },
    { label: 'SKU', prop: 'sku', width: '150', slot: 'sku' },
    { label: '条码', prop: 'barcode', width: '150', slot: 'barcode' },
    { label: '品名', prop: 'skuName', width: '180' },
    { label: '预报数量', prop: 'goodsQty', width: '110' },
    { label: '已收货数量', prop: 'receiptGoodsQty', width: '110' },
    { label: '本次收货数量', prop: 'receiptGoodsQty', slot: 'receiptGoodsQty', width: '150' },
    { label: '备注', prop: 'remark', width: '200', slot: 'remark' }
]
const tableColumns2 = [
    { label: 'SKU', prop: 'sku', width: '130', slot: 'sku' },
    { label: '条码', prop: 'barcode', width: '150', slot: 'barcode' },
    { label: '品名', prop: 'skuName', width: '180' },
    { label: '预报箱数', prop: 'boxQty', width: '100' },
    { label: '预报数量', prop: 'goodsQty', width: '100' },
    { label: '已收货数量', prop: 'receiptGoodsQty', width: '100' },
    { label: '本次收货数量', prop: 'currentReceiptQty', width: '150', slot: 'currentReceiptQty' },
    { label: '备注', prop: 'remark', width: '200', slot: 'remark' }
]
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.tableDiv {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    min-height: 297px;
}

.searchDiv {
    display: flex;
    width: 387px;
    align-items: start;
    margin-left: 30px;
    color: #606266;

    >div {
        width: 100%;
        display: flex;
        align-items: center;
    }
}

:deep(.highlight) {
    background: #ffe58f;
    color: #333;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
}

:deep(.el-alert__content) {
    width: 100%;
}

:deep(.el-alert__title) {
    width: 100%;
    font-size: 19px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

:deep(.el-alert) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    height: 150px;
    width: 800px;
    font-size: 18px;
}

:deep(.el-form-item) {
    margin-bottom: 11px;
}
</style>