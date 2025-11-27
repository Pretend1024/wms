import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取入库单
export const getOrderInOrderListApi = (data) => {
    return http.post('/instock/order/inOrder/page', { ...data })
}
// 获取入库单详情
export const getOrderInOrderInfoApi = createPostRequestWithQuery('/instock/order/inOrder/getById')

export const getOrderInOrderInfoVOByIdApi = createPostRequestWithQuery('/instock/order/inOrder/getVoById')

// 添加入库单
export const addOrderInOrderApi = (data) => {
    return http.post('/instock/order/inOrder/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑入库单
export const updOrderInOrderApi = (data) => {
    return http.post('/instock/order/inOrder/updateById', { ...data }, { headers: { 'loading': true } })
}

// 删除入库单
export const deleteOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/deleteById')

// 在途入库单
export const confirmOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/confirm')
// 草稿入库单
export const cancelConfirmOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/cancelConfirm')
// 已收货入库单
export const finishReceiptOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/finishReceipt')
// 完结入库单
export const confirmEndOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/confirmEnd')
// 取消完结库单
export const cancelEndOrderInOrderApi = createPostRequestWithQuery('/instock/order/inOrder/cancelEnd')

// 获取头程类型
export const getInstockInOrderFirstLegEnumApi = () => {
    return http.post('/instock/order/inOrder/firstLegEnum')
}
// 获取入库类型
export const getInstockInOrderTypeEnumApi = () => {
    return http.post('/instock/order/inOrder/typeEnum')
}
// 获取业务类型
export const getInstockInOrderBusinessEnumApi = () => {
    return http.post('/instock/order/inOrder/businessEnum')
}
// 获取货柜型号
export const getInstockInOrderCabinetTypeEnumApi = () => {
    return http.post('/instock/order/inOrder/containerTypeEnum')
}
// 获取计费状态
export const getInstockInOrderCalculateFeeStatusEnumApi = () => {
    return http.post('/instock/order/inOrder/calculateFeeStatusEnum')
}
// 获取收货方式
export const getInstockInOrderReceiptMethodEnumApi = () => {
    return http.post('/instock/order/inOrder/receiptMethodEnum')
}
// 获取到仓类型
export const getInstockInOrderArrivalTypeEnumApi = () => {
    return http.post('/instock/order/inOrder/arrivalTypeEnum')
}
// 获取状态栏
export const getInOrderCountGroupByStatusApi = (data) => {
    return http.post('/instock/order/inOrder/countGroupByStatus', { ...data })
}

// 获取预报箱
export const getOrderInOrderBoxApi = createPostRequestWithQuery('/instock/order/inOrderBox/listByInOrderId')

// 获取预报sku
export const getOrderInOrderSkuApi = createPostRequestWithQuery('/instock/order/inOrderSku/listByInOrderId')
// 获取收货记录
export const getOrderInOrderInReceiptApi = createPostRequestWithQuery('/instock/op/inReceipt/listByInOrderId')

// 获取上架记录
export const getOrderInOrderInShelfApi = createPostRequestWithQuery('/instock/op/inShelf/listByInOrderId')

// 获取日志
export const getOrderInOrderLogApi = createPostRequestWithQuery('/sys/log/opLog/listByObjId')

// 获取SKU收货上架核对
export const getOrderInOrderSkuCheckApi = createPostRequestWithQuery('/instock/order/inOrderSku/listReceiptShelfGpSku')
// 取消收货
export const updOrderInOrderCancelInReceiptByIdApi = createPostRequestWithQuery('/instock/order/inOrder/cancelInReceiptById')


// -------------------------------------------------------收货
// 获取订单id
export const getOrderListByNumberTypeApi = (data) => {
    return http.post('/instock/order/inOrder/listByNumberType', { ...data })
}

// 按箱清点
export const getOrderInReceiptBoxApi = createPostRequestWithQuery('/instock/order/inOrderSku/listReceiptShelfGpBoxSku')

// 获取收货列表
export const getOrderInReceiptListApi = (data) => {
    return http.post('/instock/op/inReceipt/page', { ...data })
}
// 取消收货
export const cancelOrderInReceiptApi = createPostRequestWithQuery('/instock/op/inReceipt/cancelById')

// 收货提交
export const addOrderInReceiptApi = (data) => {
    return http.post('/instock/op/inReceipt/add', { ...data }, { headers: { 'loading': true } })
}

// 修改收货件数
export const updOrderInReceiptUpdateQtyByIdApi = (data) => {
    return http.post('/instock/op/inReceipt/updateQtyById', { ...data }, { headers: { 'loading': true } })
}


// -------------------------------------------------------上架
// 获取上架方式
export const getOrderInShelfMethodEnumApi = () => {
    return http.post('/instock/order/inOrder/inShelfMethodEnum')
}
// 上架提交
export const addOrderInShelfApi = (data) => {
    return http.post('/instock/op/inShelf/add', { ...data }, { headers: { 'loading': true } })
}
// 上架记录
export const getOrderInShelfListApi = (data) => {
    return http.post('/instock/op/inShelf/page', { ...data })
}
// 货物品质
export const getOrderQualityEnumApi = () => {
    return http.post('/instock/order/inOrder/qualityEnum')
}

// 取消上架
export const cancelOrderInShelfApi = createPostRequestWithQuery('/instock/op/inShelf/cancelById')

// 获取推荐库位规则
export const getOrderLocationRecommendEnumApi = () => {
    return http.post('/instock/op/inShelf/locationRecommendEnum')
}
// 获取推荐库位
export const getOrderRecommendLocationApi = (data) => {
    return http.post('/inventory/inventory/inventory/recommendLocation', { ...data })
}

// ------------------------------------------预约管理
// 获取预约列表
export const getInstockInAppointmentListApi = (data) => {
    return http.post('/instock/appointment/inAppointment/page', { ...data })
}
// 预约提交
export const addInstockInAppointmentApi = (data) => {
    return http.post('/instock/appointment/inAppointment/add', { ...data }, { headers: { 'loading': true } })
}
// 预约编辑
export const updInstockInAppointmentApi = (data) => {
    return http.post('/instock/appointment/inAppointment/updateById', { ...data }, { headers: { 'loading': true } })
}
// 预约状态
export const getInstockInAppointmentStatusEnumApi = () => {
    return http.post('/instock/appointment/inAppointment/statusEnum')
}
// 预约状态列表
export const getInstockInAppointmentCountGroupByStatusApi = (data) => {
    return http.post('/instock/appointment/inAppointment/countGroupByStatus', { ...data })
}
// 预约类型
export const getInstockInAppointmentTypeEnumApi = () => {
    return http.post('/instock/appointment/inAppointment/typeEnum')
}
// 送仓类型
export const getInstockInAppointmentDeliveryTypeEnumApi = () => {
    return http.post('/instock/appointment/inAppointment/deliveryTypeEnum')
}
// 修改预约状态
export const updInstockInAppointmentStatusApi = createPostRequestWithQuery('/instock/appointment/inAppointment/updateStatus')
// 预约签到
export const checkInInstockInAppointmentApi = createPostRequestWithQuery('/instock/appointment/inAppointment/checkIn')



