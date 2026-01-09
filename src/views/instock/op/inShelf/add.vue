<template>
    <div class="viewArea">
        <div class="contentDiv" style="flex-direction: row;">
            <el-splitter>
                <el-splitter-panel size="320" :resizable="false" style="padding-right: 10px;">
                    <p>上架信息 </p>
                    <el-form style="width: 280px;" :model="orderData" label-width="105px" :rules="rules">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="上架方式:">
                                    <el-select v-model="orderData.receiptMethod" placeholder="请选择上架方式"
                                        @change="getOrderSkuInfo" :disabled="isOrderNotFetched">
                                        <el-option v-for="item in inShelfMethodOptions" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="推荐规则:">
                                    <el-select v-model="orderData.recommendId" placeholder="请选择推荐规则">
                                        <el-option v-for="item in inShelfRecommendLocationOptions" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="参考库位:">
                                    <el-input v-model.trim="locationCode" @keyup.enter.stop="toSku"
                                        :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="推荐库位:">
                                    <el-input v-model.trim="orderData.recommendLocationCode" readonly
                                        :disabled="isOrderNotFetched">
                                        <template #append v-if="orderData.recommendLocationCode">
                                            <el-tooltip :content='recommendLocationCodeMessage' effect="light"
                                                placement="bottom" raw-content>
                                                <el-icon class="elIcon">
                                                    <QuestionFilled />
                                                </el-icon>
                                            </el-tooltip>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" v-if="orderData.receiptMethod == 12">
                                <el-form-item label="箱号:" prop="boxNo">
                                    <el-input ref="boxNoRef" v-model="orderData.boxNo" placeholder="请输入箱号"
                                        @keyup.enter.stop="toSku" :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-divider border-style="dashed" />
                    <el-form style="width: 280px;" :model="orderData" ref="formRef" label-width="105px" :rules="rules">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="条码:" prop="barcode">
                                    <el-input ref="skuRef" v-model="orderData.barcode" placeholder="请输入条码"
                                        @keyup.enter.stop="getOrderRecommendLocation" :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="实际库位:" prop="locationCode">
                                    <el-input ref="locationCodeRef" v-model.trim="orderData.locationCode"
                                        @keyup.enter.stop="toQty" :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="品质:" prop="qualityId">
                                    <el-select v-model="orderData.qualityId" placeholder="请选择品质"
                                        @change="getOrderRecommendLocation" :disabled="isOrderNotFetched">
                                        <el-option v-for="item in inShelfQualityEnumOptions" :key="item.id"
                                            :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="上架件数:" prop="qty">
                                    <el-input ref="qtyRef" v-model.trim="orderData.qty" v-number
                                        @keyup.enter.stop="submit" :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-right: 15px;">
                                <el-form-item label="备注:">
                                    <el-input v-model.trim="orderData.remark" @keyup.enter.stop="submit"
                                        :disabled="isOrderNotFetched" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-splitter-panel>

                <el-splitter-panel style="flex-basis: 1000px;display: flex;flex-direction: column; padding-left: 10px;">
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
                            <el-button type="danger" plain :icon="RefreshLeft" style="margin-left: 10px;"
                                @click="reset">{{
                                    getButtonText('reset') }}</el-button>
                            <span
                                :style="{ color: message.type ? 'green' : 'red', fontSize: '16px', marginLeft: '10px' }">
                                {{ message.content }}
                            </span>
                        </el-col>
                    </el-row>

                    <el-form :model="orderInfo" label-width="131px" style="width: 950px;">
                        <el-row>
                            <el-col :span="8"><el-form-item label="仓库代码:"><el-input
                                        v-model.trim="orderInfo.warehouseCode" readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="客户代码:"><el-input
                                        v-model.trim="orderInfo.customerCode" readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="入库单号:"><el-input v-model.trim="orderInfo.orderNo"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="状态:"><el-input v-model.trim="orderInfo.statusName"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="创建时间:"><el-input v-model.trim="orderInfo.createdTime"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="创建方式:"><el-input v-model.trim="orderInfo.createWay"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="业务类型:"><el-input
                                        v-model.trim="orderInfo.businessName" readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="头程单号:"><el-input v-model.trim="orderInfo.trackingNo1"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="尾程单号:"><el-input v-model.trim="orderInfo.trackingNo2"
                                        readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="收货方式:"><el-input
                                        v-model.trim="orderInfo.receiptMethodName" readonly /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="上架方式:"><el-input
                                        v-model.trim="orderInfo.inShelfMethodName" readonly /></el-form-item></el-col>
                        </el-row>
                    </el-form>

                    <div id="title">
                        <span>订单详情</span>
                        <el-tooltip content="刷新" placement="top" effect="light">
                            <el-icon @click="getOrderSkuInfo"
                                :style="{ cursor: isOrderNotFetched ? 'not-allowed' : 'pointer', color: isOrderNotFetched ? '#C0C4CC' : '#409eff', fontSize: '31px', marginLeft: '15px' }">
                                <RefreshLeft />
                            </el-icon>
                        </el-tooltip>
                    </div>

                    <div class="tableDiv" ref="tableContainer">
                        <inOrder-table v-if="orderData.receiptMethod == 12" ref="tableRef" :controlsVisible="false"
                            index-label="序号" :columns="tableColumns1" :data="userData1" :merge-key="['boxNo']"
                            :merge-cols="['boxNo', 'boxQty', 'receiptBoxQty']" @update:data="val => (userData1 = val)"
                            :getRowClass="getRowClass">
                            <template #barcode="{ row }">
                                <span v-html="highlight(row.barcode)"></span>
                            </template>
                        </inOrder-table>
                        <general-table v-if="orderData.receiptMethod == 11" :tableData="userData2"
                            :columns="tableColumns2" :getRowStyle="getRowStyle">
                            <template #barcode="{ row }">
                                <span v-html="highlight(row.barcode)"></span>
                            </template>
                            <template #currentReceiptQty="{ row }">
                                <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)"
                                    :disabled="isOrderNotFetched" />
                            </template>
                        </general-table>
                    </div>
                </el-splitter-panel>
            </el-splitter>
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

<script setup name="上架">
import { ref, onMounted, onActivated, nextTick, computed } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import {
    getOrderInOrderInfoApi, getOrderInOrderSkuCheckApi, getOrderInReceiptBoxApi,
    getOrderInShelfMethodEnumApi, getOrderListByNumberTypeApi, addOrderInShelfApi, getOrderQualityEnumApi, getOrderLocationRecommendEnumApi, getOrderRecommendLocationApi
} from '@/api/instockApi/order.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { getButtonText } from '@/utils/i18n/i18nLabels'

/** 响应式变量 */
const orderData = ref({
    number: '', numberType: 1, receiptMethod: '', recommendId: 1, recommendLocationCode: '',
    locationCode: '', barcode: '', qty: null, boxNo: '', qualityId: 1, remark: '',
})
const locationCode = ref('') // 参考库位（用于辅助检索）
const orderInfo = ref({})     // 订单明细
const orderId = ref('')       // 当前订单ID
const recommendLocationCodeMessage = ref('') // 推荐库位解释信息
const orderList = ref([])     // 多订单选择列表
const centerDialogVisible = ref(false)
const message = ref({ type: true, content: '' }) // 检索结果状态反馈

/** 表格数据与节点引用 */
const userData1 = ref([]); const userData2 = ref([])
const skuRef = ref(null); const boxNoRef = ref(null); const locationCodeRef = ref(null); const qtyRef = ref(null); const numberInput = ref(null); const formRef = ref(null)

/** 静态配置项 */
const numberTypeOptions = [{ value: 1, label: '入库单号' }, { value: 2, label: '头程单号' }, { value: 3, label: '尾程单号' }, { value: 4, label: '箱号' }]
const inShelfMethodOptions = ref([]); const inShelfQualityEnumOptions = ref([]); const inShelfRecommendLocationOptions = ref([])

/** 表单校验 */
const rules = {
    boxNo: [{
        required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (orderData.value.receiptMethod === 12 && !value) callback(new Error('请输入箱号')); else callback();
        }
    }],
    barcode: [{ required: true, message: '请输入条码', trigger: 'blur' }],
    locationCode: [{ required: true, message: '请输入实际库位', trigger: 'blur' }],
    qualityId: [{ required: true, message: '请选择品质', trigger: 'change' }],
    qty: [{ required: true, message: '请输入上架件数', trigger: 'blur' }]
}

/** 功能注释：判断是否未获取到有效的订单信息，用于禁用表单 */
const isOrderNotFetched = computed(() => !orderId.value || !orderInfo.value.orderNo)

/** 获取推荐库位逻辑 */
const getOrderRecommendLocation = async () => {
    if (!orderData.value.barcode) return
    const res = await getOrderRecommendLocationApi({
        barcode: orderData.value.barcode,
        recommendId: orderData.value.recommendId,
        locationCode: locationCode.value,
        qualityId: orderData.value.qualityId,
        warehouseCode: orderInfo.value.warehouseCode,
        customerCode: orderInfo.value.customerCode,
    })
    orderData.value.recommendLocationCode = res.data
    recommendLocationCodeMessage.value = res.msg || ''
    // 获取完推荐库位后自动聚焦实际库位输入框
    nextTick(() => locationCodeRef.value?.$el?.querySelector('input')?.focus())
}

/** 获取订单信息主逻辑 */
const getOrderInfo = async () => {
    orderInfo.value = {}; orderData.value.receiptMethod = ''; orderId.value = ''
    if (!orderData.value.numberType || !orderData.value.number) return

    try {
        const res = await getOrderListByNumberTypeApi(orderData.value)
        if (res.success && res.data.length > 1) {
            // 多个单号匹配时弹出选择框
            orderList.value = res.data; centerDialogVisible.value = true
        } else if (res.success && res.data.length == 1) {
            // 单个单号匹配直接加载
            orderId.value = res.data[0].id
            const res2 = await getOrderInOrderInfoApi({ id: res.data[0].id })
            orderInfo.value = res2.data
        }

        // 检索结果提示
        if (!res.success) {
            message.value = { type: false, content: res.msg || '获取订单失败' }
        } else {
            message.value = { type: true, content: res.msg }
            if (orderInfo.value.receiptMethodId) {
                orderData.value.receiptMethod = orderInfo.value.receiptMethodId; getOrderSkuInfo()
            }
            nextTick(() => skuRef.value?.$el?.querySelector('input')?.focus())
        }
    } catch (e) {
        message.value = { type: false, content: '系统异常，请检查网络或配置' }
    }
}

/** 获取物料详情 */
const getOrderSkuInfo = async () => {
    if (!orderId.value) {
        smartAlert('请先获取订单信息', false); orderData.value.receiptMethod = ''; return
    }
    orderData.value.boxNo = ''
    try {
        if (orderData.value.receiptMethod == 11) { // 按SKU
            const res = await getOrderInOrderSkuCheckApi({ inOrderId: orderId.value })
            userData2.value = (res.data || []).map(item => ({ ...item, qty: Math.max(item.receiptGoodsQty - item.shelfGoodsQty, 0) }))
        } else { // 按箱
            const res = await getOrderInReceiptBoxApi({ inOrderId: orderId.value })
            userData1.value = (res.data || []).map(item => ({ ...item, qty: Math.max(item.receiptGoodsQty - item.shelfGoodsQty, 0) }))
        }
    } catch (error) { console.error(error) }
}

/** 提交上架数据 */
const submit = async () => {
    const data = {
        inOrderId: orderId.value, inShelfMethodId: orderData.value.receiptMethod,
        locationCode: orderData.value.locationCode, boxNo: orderData.value.boxNo || '',
        barcode: orderData.value.barcode, qty: Number(orderData.value.qty),
        remark: orderData.value.remark || '', qualityId: orderData.value.qualityId
    }
    try {
        const res = await addOrderInShelfApi(data)
        showSuccessAlert(res.msg || '操作异常', res.success)
        if (res.success) {
            getOrderSkuInfo()
            // 提交成功后清空左侧扫描区域
            orderData.value.recommendLocationCode = ''; orderData.value.locationCode = ''; orderData.value.barcode = '';
            orderData.value.qty = null; orderData.value.boxNo = ''; orderData.value.qualityId = 1; orderData.value.remark = ''

            nextTick(() => {
                const targetInput = orderData.value.receiptMethod == 12 ? boxNoRef.value : skuRef.value
                targetInput?.$el?.querySelector('input')?.focus()
                formRef.value?.clearValidate()
            })
        }
    } catch (error) { console.error(error) }
}

/** 生命周期与工具函数 */
const reset = () => {
    orderData.value = { number: '', numberType: 1, receiptMethod: '', recommendId: 1, recommendLocationCode: '', barcode: '', qty: null, boxNo: '', qualityId: 1, remark: '', locationCode: '' }
    orderInfo.value = {}; orderId.value = ''; message.value.content = ''; locationCode.value = ''
    userData1.value = []; userData2.value = []
    nextTick(() => formRef.value?.clearValidate())
}

const handleRowClick = (row) => { orderId.value = row.id }
const handleRowDblClick = (row) => { orderId.value = row.id; handleDialogConfirm() }
const handleDialogConfirm = async () => {
    try {
        const res = await getOrderInOrderInfoApi({ id: orderId.value })
        orderInfo.value = res.data
        if (orderInfo.value.receiptMethodId) {
            orderData.value.receiptMethod = orderInfo.value.receiptMethodId; getOrderSkuInfo()
        }
        centerDialogVisible.value = false
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => {
    const [res, res2, res3] = await Promise.all([
        getOrderInShelfMethodEnumApi(), getOrderQualityEnumApi(), getOrderLocationRecommendEnumApi()
    ])
    inShelfMethodOptions.value = res.data.map(i => ({ label: i.name, value: i.id }))
    inShelfQualityEnumOptions.value = res2.data
    inShelfRecommendLocationOptions.value = res3.data.map(i => ({ label: i.name, value: i.id }))
    focusInput()
})
onActivated(() => focusInput())

/** 快捷聚焦方法 */
const toQty = () => nextTick(() => qtyRef.value?.$el?.querySelector('input')?.focus())
const toSku = () => !orderData.value.barcode ? skuRef.value?.focus() : getOrderRecommendLocation()
function focusInput() { nextTick(() => numberInput.value?.focus?.()) }
function escapeRegExp(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function highlight(text) {
    const kw = orderData.value.barcode?.trim()
    if (!kw || !text) return text
    return text.toString().replace(new RegExp(`(${escapeRegExp(kw)})`, 'ig'), '<span class="highlight">$1</span>')
}

/** 表格行样式定义 */
const getRowStyle = ({ row }) => (row.receiptGoodsQty !== row.goodsQty ? 'background-color: #ffcbcb;' : '')
const getRowClass = ({ row }) => (row.receiptGoodsQty !== row.goodsQty || row.receiptGoodsQty !== row.shelfGoodsQty || row.goodsQty !== row.shelfGoodsQty ? 'red-row' : '')

/** 全局 Alert 处理 */
const showAlert = ref(false); const alertType = ref('success'); const alertMessage = ref('')
const showSuccessAlert = (message, state) => {
    alertType.value = state ? 'success' : 'error'; alertMessage.value = message; showAlert.value = true
    setTimeout(() => { showAlert.value = false }, state ? 1000 : 5000)
}

/** 表格列定义补全 */
const tableColumns1 = [
    { label: '箱号', prop: 'boxNo', width: '180' },
    { label: 'SKU', prop: 'sku', width: '150' },
    { label: '条码', prop: 'barcode', width: '150', slot: 'barcode' },
    { label: '品名', prop: 'skuName', width: '180' },
    { label: '预报数量', prop: 'goodsQty', width: '110' },
    { label: '已收货数量', prop: 'receiptGoodsQty', width: '110' },
    { label: '已上架数量', prop: 'shelfGoodsQty', width: '110' },
    { label: '待上架数量', prop: 'qty', width: '120' },
]
const tableColumns2 = [
    { label: 'SKU', prop: 'sku', width: '130' },
    { label: '条码', prop: 'barcode', width: '150', slot: 'barcode' },
    { label: '品名', prop: 'skuName', width: '180' },
    { label: '预报箱数', prop: 'boxQty', width: '100' },
    { label: '预报数量', prop: 'goodsQty', width: '100' },
    { label: '已收货数量', prop: 'receiptGoodsQty', width: '100' },
    { label: '已上架数量', prop: 'shelfGoodsQty', width: '110' },
    { label: '待上架数量', prop: 'qty', width: '120' },
]
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

#title {
    display: flex;
    align-items: center;
    font-size: 22px;
    padding: 0 0 10px 15px;
    margin-top: 5px;
    margin-bottom: 15px;
    font-weight: 550;
    border-bottom: 1px solid #ccc;
}

.tableDiv {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    min-height: 392px;
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

:deep(.el-input-group__append) {
    background: #fff;
    padding: 0 5px;
}

:deep(.el-form-item) {
    margin-bottom: 15px;
}
</style>