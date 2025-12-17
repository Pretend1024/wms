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
                                        @change="getOrderSkuInfo">
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
                                    <el-input v-model.trim="locationCode" @keyup.enter.stop="toSku" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="推荐库位:">
                                    <el-input v-model.trim="orderData.recommendLocationCode" readonly>
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
                                        @keyup.enter.stop="toSku" />
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
                                        @keyup.enter.stop="getOrderRecommendLocation" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="实际库位:" prop="locationCode">
                                    <el-input ref="locationCodeRef" v-model.trim="orderData.locationCode"
                                        @keyup.enter.stop="toQty" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="品质:" prop="qualityId">
                                    <el-select v-model="orderData.qualityId" placeholder="请选择品质"
                                        @change="getOrderRecommendLocation">
                                        <el-option v-for="item in inShelfQualityEnumOptions" :key="item.id"
                                            :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="上架件数:" prop="qty">
                                    <el-input ref="qtyRef" v-model.trim="orderData.qty" v-number
                                        @keyup.enter.stop="submit" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-right: 15px;">
                                <el-form-item label="备注:">
                                    <el-input v-model.trim="orderData.remark" @keyup.enter.stop="submit" />
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
                                :style="{ color: message.type ? 'green' : 'red', fontSize: '16px', marginLeft: '10px' }">{{
                                    message.content }}</span>
                        </el-col>
                    </el-row>
                    <el-form :model="orderInfo" label-width="131px" style="width: 950px;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="仓库代码:">
                                    <el-input v-model.trim="orderInfo.warehouseCode" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客户代码:">
                                    <el-input v-model.trim="orderInfo.customerCode" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入库单号:">
                                    <el-input v-model.trim="orderInfo.orderNo" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="状态:">
                                    <el-input v-model.trim="orderInfo.statusName" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="创建时间:">
                                    <el-input v-model.trim="orderInfo.createdTime" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="创建方式:">
                                    <el-input v-model.trim="orderInfo.createWay" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务类型:">
                                    <el-input v-model.trim="orderInfo.businessName" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="头程单号:">
                                    <el-input v-model.trim="orderInfo.trackingNo1" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="尾程单号:">
                                    <el-input v-model.trim="orderInfo.trackingNo2" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收货方式:">
                                    <el-input v-model.trim="orderInfo.receiptMethodName" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="上架方式:">
                                    <el-input v-model.trim="orderInfo.inShelfMethodName" readonly />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div id="title">
                        <span>订单详情</span>
                        <el-tooltip content="刷新" placement="top" effect="light">
                            <el-icon @click="getOrderSkuInfo"
                                style="cursor: pointer; color: #409eff; font-size: 31px; margin-left: 15px;">
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
                        <!-- :getRowStyle="(row) => ({ backgroundColor: row.qty <= 0 ? '#ffcbcb !important' : '' })" -->
                        <general-table v-if="orderData.receiptMethod == 11" :tableData="userData2"
                            :columns="tableColumns2" :getRowStyle="getRowStyle">
                            <!-- 高亮 条码 -->
                            <template #barcode="{ row }">
                                <span v-html="highlight(row.barcode)"></span>
                            </template>
                            <template #currentReceiptQty="{ row }">
                                <el-input v-model="row.qty" type="number" :min="0" @keyup.enter.stop="submit(row)" />
                            </template>
                        </general-table>
                    </div>
                </el-splitter-panel>
            </el-splitter>
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

<script setup name="上架">
import { RefreshLeft } from '@element-plus/icons-vue'
import {
    getOrderInOrderInfoApi, getOrderInOrderSkuCheckApi, getOrderInReceiptBoxApi,
    getOrderInShelfMethodEnumApi, getOrderListByNumberTypeApi, addOrderInShelfApi, getOrderQualityEnumApi, getOrderLocationRecommendEnumApi, getOrderRecommendLocationApi
} from '@/api/instockApi/order.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { nextTick } from 'vue'
// 查询条件
const orderData = ref({
    number: '', // 订单号
    numberType: 1, // 订单号类型
    receiptMethod: '', // 上架方式

    recommendId: 1, // 推荐规则id
    recommendLocationCode: '', // 推荐库位
    locationCode: '', // 库位号
    barcode: '', // 条码
    qty: null, // 上架数量
    boxNo: '', // 箱号
    qualityId: 1, // 质量id
    remark: '', // 备注
})
const locationCode = ref('')  // 参考库位
// 推荐库位提示信息
const recommendLocationCodeMessage = ref('')
// 获取推荐库位
const getOrderRecommendLocation = async () => {
    if (!orderData.value.barcode) {
        // smartAlert('请先输入条码', false)
        return
    }
    const res = await getOrderRecommendLocationApi({
        // sku: orderData.value.sku,
        barcode: orderData.value.barcode,
        recommendId: orderData.value.recommendId,
        locationCode: locationCode.value,
        qualityId: orderData.value.qualityId,
        warehouseCode: orderInfo.value.warehouseCode,
        customerCode: orderInfo.value.customerCode,
    })
    console.log('recommendLocationCode', res)
    orderData.value.recommendLocationCode = res.data
    recommendLocationCodeMessage.value = res.msg || ''
    const elInput = locationCodeRef.value?.$el?.querySelector('input')
    if (elInput) elInput.focus()
}
const formRef = ref(null)
const rules = {
    boxNo: [
        {
            required: true,
            message: '请输入箱号',
            trigger: 'blur',
            // 当 receiptMethod 不等于 12 时，不验证该字段
            validator: (rule, value, callback) => {
                if (orderData.value.receiptMethod === 12) {
                    if (!value) {
                        callback(new Error('请输入箱号'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
        }
    ],
    barcode: [
        { required: true, message: '请输入条码', trigger: 'blur' }
    ],
    locationCode: [
        { required: true, message: '请输入实际库位', trigger: 'blur' }
    ],
    qualityId: [
        { required: true, message: '请选择品质', trigger: 'change' }
    ],
    qty: [
        { required: true, message: '请输入上架件数', trigger: 'blur' }
    ]
};
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
    if (res.success) {
        const elInput = skuRef.value?.$el?.querySelector('input')
        if (elInput) elInput.focus()
    }
    loading.close()
}
// 重置
const reset = () => {
    orderData.value.number = ''; // 订单号
    orderData.value.numberType = 1; // 订单号类型
    orderData.value.receiptMethod = ''; // 上架方式
    orderData.value.recommendLocationCode = ''; // 推荐库位
    orderData.value.barcode = ''; // 条码
    orderData.value.qty = null; // 上架数量
    orderData.value.boxNo = ''; // 箱号
    orderData.value.qualityId = 1; // 质量id
    orderData.value.remark = ''; // 备注
    orderData.value.locationCode = ''; // 库位号
    orderInfo.value = {}; // 订单信息 
    orderId.value = ''; // 订单id
    message.value.content = ''; // 提示信息内容
    locationCode.value = '';  // 参考库位
    orderData.value.recommendId = 1; // 推荐规则id
    nextTick(() => {
        if (formRef.value) {
            formRef.value.clearValidate(); // 清空所有字段验证状态
        }
    });

}
// 获取上架SKU或箱信息
const getOrderSkuInfo = async () => {
    if (!orderData.value.number || !orderData.value.numberType) {
        smartAlert('请先获取订单信息', false)
        orderData.value.receiptMethod = '';
        return
    } else {
        orderData.value.boxNo = ''; // 清空箱号
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
                qty: Math.max(item.receiptGoodsQty - item.shelfGoodsQty, 0)
            }));
        } else {
            res = await getOrderInReceiptBoxApi({ inOrderId: orderId.value })
            userData1.value = res.data.map(item => ({
                ...item,
                qty: Math.max(item.receiptGoodsQty - item.shelfGoodsQty, 0)
            }));
        }
        loading.close()
    }
}
// 表格容器ref
const tableContainer = ref(null);
// SKUref
const skuRef = ref(null);
// 箱号ref
const boxNoRef = ref(null);
// 实际库位ref
const locationCodeRef = ref(null);
// 上架数量ref
const qtyRef = ref(null);

const toQty = () => {
    const elInput = qtyRef.value?.$el?.querySelector('input')
    if (elInput) elInput.focus()
}
const toSku = () => {
    if (!orderData.value.barcode) {
        skuRef.value.focus()
    } else {
        getOrderRecommendLocation()
    }
}

// 按箱上架
const tableColumns1 = [
    { label: '箱号', prop: 'boxNo', width: '180' },
    { label: 'SKU', prop: 'sku', width: '150' },
    { label: '条码', prop: 'barcode', width: '150', slot: 'barcode' },
    { label: '品名', prop: 'skuName', width: '180' },
    // { label: '中文品名', prop: 'skuNameCn', width: '150' },
    // { label: '英文品名', prop: 'skuNameEn', width: '150' },
    { label: '预报数量', prop: 'goodsQty', width: '110' },
    { label: '已收货数量', prop: 'receiptGoodsQty', width: '110' },
    { label: '已上架数量', prop: 'shelfGoodsQty', width: '110' },
    { label: '待上架数量', prop: 'qty', width: '120' },
]
// 按SKU上架
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
// 表格数据
const userData1 = ref([])
const userData2 = ref([])

// 上架
const submit = async () => {
    const data = {
        inOrderId: orderId.value,
        inShelfMethodId: orderData.value.receiptMethod,
        locationCode: orderData.value.locationCode,
        boxNo: orderData.value.boxNo || '',
        barcode: orderData.value.barcode,
        qty: Number(orderData.value.qty),
        remark: orderData.value.remark || '',
        qualityId: orderData.value.qualityId
    }
    try {
        const res = await addOrderInShelfApi(data)
        console.log(res)
        const message = res.msg || '操作出现问题，是否重试？' // 若后端未返回消息，使用默认提示
        showSuccessAlert(message, res.success)
        if (res.success) {
            getOrderSkuInfo()
            // 重置输入框
            orderData.value.recommendLocationCode = ''
            orderData.value.locationCode = ''
            orderData.value.barcode = ''
            orderData.value.qty = null
            orderData.value.boxNo = ''
            orderData.value.qualityId = 1
            orderData.value.remark = ''
            const elBoxNo = boxNoRef.value?.$el?.querySelector('input')
            if (elBoxNo) {
                elBoxNo.focus()
            } else {
                const elInput = skuRef.value?.$el?.querySelector('input')
                if (elInput) elInput.focus()
            }
            nextTick(() => {
                if (formRef.value) {
                    console.log('clearValidate')
                    formRef.value.clearValidate(); // 清空所有字段验证状态
                }
            });
        }
    } catch (error) {
        console.error('接口调用出错:', error)
    }
}
// 单号输入框的 ref
const numberInput = ref(null)

// 上架方式
const inShelfMethodOptions = ref([])
// 品质数据
const inShelfQualityEnumOptions = ref([])
// 推荐规则
const inShelfRecommendLocationOptions = ref([])

onMounted(async () => {
    const res = await getOrderInShelfMethodEnumApi()
    inShelfMethodOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    // 品质数据
    const res2 = await getOrderQualityEnumApi()
    inShelfQualityEnumOptions.value = res2.data
    // 推荐规则
    const res3 = await getOrderLocationRecommendEnumApi()
    inShelfRecommendLocationOptions.value = res3.data.map(item => ({ label: item.name, value: item.id }))
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
    const kw = orderData.value.barcode?.trim()
    if (!kw) return text
    const reg = new RegExp(`(${escapeRegExp(kw)})`, 'ig')
    return text.replace(reg, '<span class="highlight">$1</span>')
}

// 行样式
function getRowClass({ row }) {
    if (row.receiptGoodsQty !== row.goodsQty ||
        row.receiptGoodsQty !== row.shelfGoodsQty ||
        row.goodsQty !== row.shelfGoodsQty) {
        return 'red-row'
    }
    return '';
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

:deep(.el-input-group__append) {
    background: #fff;
    padding: 0 5px;
}

:deep(.el-form-item) {
    margin-bottom: 11px;
}
</style>