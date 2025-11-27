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
                    <el-col :span="6">
                        <el-form-item label="仓库代码:">
                            <el-input v-model.trim="orderInfo.warehouseCode" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户代码:">
                            <el-input v-model.trim="orderInfo.customerCode" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单号:">
                            <el-input v-model.trim="orderInfo.orderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <el-input v-model.trim="orderInfo.statusName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间:">
                            <el-input v-model.trim="orderInfo.createdTime" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建方式:">
                            <el-input v-model.trim="orderInfo.createWay" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单类型:">
                            <el-input v-model.trim="orderInfo.typeName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <el-input v-model.trim="orderInfo.businessName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="头程物流:">
                            <el-input v-model.trim="orderInfo.firstLegName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="头程单号:">
                            <el-input v-model.trim="orderInfo.trackingNo1" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="尾程单号:">
                            <el-input v-model.trim="orderInfo.trackingNo2" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="计划到仓时间:">
                            <el-input v-model.trim="orderInfo.plannedArrivalTime" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到仓类型:">
                            <el-input v-model.trim="orderInfo.arrivalTypeName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货柜型号:">
                            <el-input v-model.trim="orderInfo.containerType" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货柜号:">
                            <el-input v-model.trim="orderInfo.containerNumber" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收货方式:">
                            <el-input v-model.trim="orderInfo.receiptMethodName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上架方式:">
                            <el-input v-model.trim="orderInfo.inShelfMethodName" readonly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <p>收货详情</p>
            <el-row>
                <el-form-item label="收货方式:">
                    <el-select v-model="orderData.receiptMethod" placeholder="请选择收货方式" style="width: 160px;"
                        @change="getOrderSkuInfo">
                        <el-option v-for="item in receiptMethodOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <div class="searchDiv">
                    <div>
                        <span>按</span>
                        <el-select v-model="way" clearable style="width: 90px;margin: 0 5px;">
                            <el-option v-for="item in wayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <span>检索：</span>
                        <el-input ref="searchRef" v-model="orderData.search" placeholder="请输入条码/SKU/箱号"
                            style="width: 230px; " @keyup.enter.stop="focusFirstMatch" />
                    </div>
                </div>
                <!-- 刷新 -->
                <el-tooltip content="刷新" placement="top" effect="light">
                    <el-icon @click="getOrderSkuInfo" style="cursor: pointer; color: #409eff; font-size: 31px;">
                        <RefreshLeft />
                    </el-icon>
                </el-tooltip>
            </el-row>
            <div class="tableDiv" ref="tableContainer">
                <inOrder-table v-if="orderData.receiptMethod == 12" ref="tableRef" :controlsVisible="false"
                    index-label="序号" :columns="tableColumns1" :data="userData1" :merge-key="['boxNo']"
                    :merge-cols="['boxNo', 'boxQty', 'receiptBoxQty']" @update:data="val => (userData1 = val)"
                    :getRowClass="getRowClass">
                    <!-- 高亮箱号 -->
                    <template #boxNo="{ row }">
                        <span v-html="way === 'boxNo' ? highlight(row.boxNo) : row.boxNo"></span>
                    </template>
                    <!-- 高亮 SKU -->
                    <template #sku="{ row }">
                        <span v-html="way === 'sku' ? highlight(row.sku) : row.sku"></span>
                    </template>
                    <!-- 高亮条码 -->
                    <template #barcode="{ row }">
                        <span v-html="way === 'barcode' ? highlight(row.barcode) : row.barcode"></span>
                    </template>
                    <template #receiptGoodsQty="{ row }">
                        <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)" />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" @keyup.enter.stop="submit(row)" />
                    </template>
                </inOrder-table>
                <general-table v-if="orderData.receiptMethod == 11" :tableData="userData2" :columns="tableColumns2"
                    :getRowStyle="getRowStyle">
                    <!-- 高亮 SKU -->
                    <template #sku="{ row }">
                        <span v-html="way === 'sku' ? highlight(row.sku) : row.sku"></span>
                    </template>
                    <!-- 高亮条码 -->
                    <template #barcode="{ row }">
                        <span v-html="way === 'barcode' ? highlight(row.barcode) : row.barcode"></span>
                    </template>
                    <template #currentReceiptQty="{ row }">
                        <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)" />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" @keyup.enter.stop="submit(row)" />
                    </template>
                </general-table>
            </div>
        </div>
        <!-- 订单选择弹窗 -->
        <el-dialog v-model="centerDialogVisible" title="选择订单" width="700" align-center destroy-on-close>
            <el-table :data="orderList" highlight-current-row :current-row-key="orderId" :stripe="true"
                style="width: 100%;" :height="400" border @row-click="handleRowClick" @row-dblclick="handleRowDblClick">
                <!-- 仓库代码 -->
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
import { RefreshLeft } from '@element-plus/icons-vue'
import {
    getOrderInOrderInfoApi, getOrderInOrderSkuCheckApi, getOrderInReceiptBoxApi,
    getInstockInOrderReceiptMethodEnumApi, getOrderListByNumberTypeApi, addOrderInReceiptApi
} from '@/api/instockApi/order.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { nextTick } from 'vue'
// 查询条件
const orderData = ref({
    number: '', // 订单号
    numberType: 1, // 订单号类型
    receiptMethod: '', // 收货方式
    search: '' // 检索
})
// 检索方式
const way = ref('barcode')
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
// 订单弹窗
const centerDialogVisible = ref(false)
const orderList = ref([])
// 提示信息
const message = ref({
    type: true,
    content: ''
})

// 订单信息
const orderInfo = ref({})
const orderId = ref('')
// 点击表格行的方法
const handleRowClick = (row) => {
    orderId.value = row.id;
    console.log('点击行', orderId.value)
};
// 双击表格行的方法
const handleRowDblClick = (row) => {
    orderId.value = row.id;
    handleDialogConfirm();
};
// 弹窗确定
const handleDialogConfirm = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading'
    })
    const res2 = await getOrderInOrderInfoApi({ id: orderId.value })
    orderInfo.value = res2.data
    if (orderInfo.value.receiptMethodName) {
        orderData.value.receiptMethod = orderInfo.value.receiptMethodId;
        getOrderSkuInfo()
    }
    centerDialogVisible.value = false;
    nextTick(() => {
        const elInput = searchRef.value?.$el?.querySelector('input')
        if (elInput) elInput.focus()
    })
    loading.close()
}
// 获取订单详情
const getOrderInfo = async () => {
    orderInfo.value = {};
    orderData.value.receiptMethod = '';
    if (!orderData.value.numberType) {
        return
    }
    if (!orderData.value.number) {
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading'
    })
    const res = await getOrderListByNumberTypeApi(orderData.value)
    console.log(res)
    // 打开弹窗
    if (res.success && res.data.length > 1) {
        orderList.value = res.data;
        centerDialogVisible.value = true;
    } else if (res.success && res.data.length == 1) {
        orderId.value = res.data[0].id
        const res2 = await getOrderInOrderInfoApi({ id: res.data[0].id })
        orderInfo.value = res2.data
    }
    if (orderInfo.value.receiptMethodName) {
        orderData.value.receiptMethod = orderInfo.value.receiptMethodId;
        getOrderSkuInfo()
    }
    message.value = {
        type: res.success,
        content: res.msg
    }
    // 聚焦检索框
    if (res.success) {
        nextTick(() => {
            const elInput = searchRef.value?.$el?.querySelector('input')
            if (elInput) elInput.focus()
        })
    }
    loading.close()
}
// 重置
const reset = () => {
    orderData.value.number = ''; // 订单号
    orderData.value.numberType = 1; // 订单号类型
    orderData.value.receiptMethod = ''; // 订单号类型
    orderData.value.search = ''; // 检索
    orderInfo.value = {}; // 订单信息 
    orderId.value = ''; // 订单id
    message.value.content = ''; // 提示信息内容
    way.value = 'barcode'; // 检索方式
}
// 获取收货SKU或箱信息
const getOrderSkuInfo = async () => {
    if (!orderData.value.number || !orderData.value.numberType) {
        smartAlert('请先获取订单信息', false)
        orderData.value.receiptMethod = '';
        return
    } else {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading'
        })
        let res = ref()
        if (orderData.value.receiptMethod == 11) {
            res = await getOrderInOrderSkuCheckApi({ inOrderId: orderId.value })
            userData2.value = res.data || []
            userData2.value = res.data.map(item => ({
                ...item,
                qty: Math.max(item.goodsQty - item.receiptGoodsQty, 0)
            }));
        } else {
            res = await getOrderInReceiptBoxApi({ inOrderId: orderId.value })
            userData1.value = res.data.map(item => ({
                ...item,
                qty: Math.max(item.goodsQty - item.receiptGoodsQty, 0)
            }));
        }
        loading.close()
    }
}
// 表格容器ref
const tableContainer = ref(null);
// 检索ref
const searchRef = ref(null);
// 检索聚焦
const focusFirstMatch = async () => {
    const kw = orderData.value.search?.trim()
    if (!kw) return

    await nextTick()

    // 在表格容器里找第一个带 .highlight 的元素
    const container = tableContainer.value
    if (!container) return

    // 找到高亮文本的 <span class="highlight"> 节点
    const highlightSpan = container.querySelector('.highlight')
    if (!highlightSpan) return

    // 向上找出所在的 <tr>
    const tr = highlightSpan.closest('tr')
    if (!tr) return

    // 让该行滚动到可视区域中央
    tr.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // 在这行内找数字输入框并聚焦
    const input = tr.querySelector('input[type="number"]')
    if (input) {
        input.focus()
        input.select();
    }
}
// 按箱收货
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
// 按SKU收货
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
// 表格数据
const userData1 = ref([])
const userData2 = ref([])

// 收货
const submit = async (row) => {
    console.log(row)
    const data = {
        inOrderId: orderId.value,
        receiptMethodId: orderData.value.receiptMethod,
        boxNo: row.boxNo || '',
        sku: row.sku,
        qty: Number(row.qty),
        remark: row.remark || '',
        isConfirm: false,
        qualityId: 1 // 默认质量为1
    }
    try {
        const res = await addOrderInReceiptApi(data)
        console.log(res)
        const message = res.msg || '操作出现问题，是否重试？' // 若后端未返回消息，使用默认提示

        if (res.code === '500') {
            const confirmResult = await ElMessageBox.confirm(
                message,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            if (confirmResult === 'confirm') {
                blurAllInputs()
                data.isConfirm = true
                const retryRes = await addOrderInReceiptApi(data)
                const retryMessage = retryRes.msg || '重试操作失败'
                showSuccessAlert(retryMessage, retryRes.success)
                getOrderSkuInfo()
                await nextTick()
                const elInput = searchRef.value?.$el?.querySelector('input')
                if (elInput) elInput.focus()
                orderData.value.search = ''
            }
        } else {
            showSuccessAlert(message, res.success)
            getOrderSkuInfo()
            await nextTick()
            const elInput = searchRef.value?.$el?.querySelector('input')
            if (elInput) elInput.focus()
            orderData.value.search = ''
        }
    } catch (error) {
        console.error('接口调用出错:', error)
    }
}
// 单号输入框的 ref
const numberInput = ref(null)

// 收货方式
const receiptMethodOptions = ref([])
onMounted(async () => {
    const res = await getInstockInOrderReceiptMethodEnumApi()
    receiptMethodOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    focusInput()
})
onActivated(() => {
    focusInput()
})
// 自定义设置行样式的方法
const getRowStyle = ({ row }) => {
    // if (row.qty <= 0) {
    //     return 'background-color: #ffcbcb;'; // 红色背景
    // }
    if (row.receiptGoodsQty !== row.goodsQty) {
        return 'background-color: #ffcbcb;';
    }
    return ''
}
// 重置输入框并聚焦
function focusInput() {
    nextTick(() => {
        numberInput.value?.focus?.()
    })
}

// input全部失焦
function blurAllInputs() {
    document.querySelectorAll('input').forEach(el => el.blur())
}
// 正则特殊字符转义
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 高亮函数
function highlight(text) {
    const kw = orderData.value.search?.trim()
    if (!kw) return text
    const reg = new RegExp(`(${escapeRegExp(kw)})`, 'ig')
    return text.replace(reg, '<span class="highlight">$1</span>')
}

// 行样式
function getRowClass({ row }) {
    return row.goodsQty != row.receiptGoodsQty ? 'red-row' : '';
}

// 控制 el-alert 显示隐藏
const showAlert = ref(false);
// 控制 el-alert 类型
const alertType = ref('success'); // 'success' 或 'error'
// 存储提示信息
const alertMessage = ref('');
const showSuccessAlert = (message, state) => {
    alertType.value = state ? 'success' : 'error'
    alertMessage.value = message
    showAlert.value = true

    setTimeout(() => {
        showAlert.value = false
    }, state ? 1000 : 5000)
}
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
    /* 柔和的黄底 */
    color: #333;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
}

:deep(.el-alert__content) {
    width: 100%;
}

// 提示信息样式
:deep(.el-alert__title) {
    width: 100%;
    font-size: 19px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4; // 限制显示4行
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal; // 允许文本换行
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
</style>