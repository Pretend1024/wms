import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取出库单
export const getOutstockOrderApi = (data) => {
    return http.post('/outstock/order/outOrder/page', data, { headers: { 'loading': true } })
}
// 新增出库单
export const addOutstockOrderApi = (data) => {
    return http.post('/outstock/order/outOrder/add', data, { headers: { 'loading': true } })
}
// 删除出库单
export const deleteOutstockOrderApi = createPostRequestWithQuery('/outstock/order/outOrder/deleteById')
// 编辑出库单
export const updOutstockOrderApi = (data) => {
    return http.post('/outstock/order/outOrder/updateById', data, { headers: { 'loading': true } })
}
// 获取出库单详情
export const getOutstockOrderDetailApi = createPostRequestWithQuery('/outstock/order/outOrder/getById')

// 出库单类型枚举
export const outstockOrderTypeApi = () => {
    return http.post('/outstock/order/outOrder/typeEnum')
}
// 出库单状态枚举
export const outstockOrderStatusApi = () => {
    return http.post('/outstock/order/outOrder/statusEnum')
}
// 出库单附件类型枚举
export const outstockOrderAttachmentTypeApi = () => {
    return http.post('/outstock/order/outOrder/attachmentTypeEnum')
}
// 出库单状态待分配
export const outstockOrderToPendingAllocationApi = createPostRequestWithQuery('/outstock/order/outOrder/toPendingAllocation')
// 出库单状态草稿
export const outstockOrderToDraftApi = createPostRequestWithQuery('/outstock/order/outOrder/toDraft')
// 收货地址类型枚举
export const outstockOrderAddressTypeApi = () => {
    return http.post('/outstock/order/outOrder/addressTypeEnum')
}
// 创建方式枚举
export const outstockOrderCreateTypeApi = () => {
    return http.post('/outstock/order/outOrder/waybillCreateWayEnum')
}
// 状态菜单枚举
export const getOutstockOrderStatusMenuApi = (data) => {
    return http.post('/outstock/order/outOrder/countGroupByStatus', { ...data })
}
// 电商平台枚举
export const outstockOrderEcommercePlatformApi = () => {
    return http.post('/outstock/order/outOrder/ecPlatformEnum')
}

// 出库单批量设置
// 批量设置仓库  
export const outstockOrderBatchSetWarehouseApi = createPostRequestWithQuery('/outstock/order/outOrder/setWarehouse')
// 批量设置渠道
export const outstockOrderBatchSetChannelApi = createPostRequestWithQuery('/outstock/order/outOrder/setShipway')

// 出库单物流单号操作
// 运单导入
export const outstockOrderImportTrackingNoApi = (data, Params) => {
    return http.post('/outstock/order/outOrder/importWaybill', data, { params: Params })
}
// 申请单号
export const outstockOrderApplyTrackingNoApi = (data) => {
    return http.post('/outstock/order/outOrder/applyWayBill', data, { headers: { 'loading': true } })
}
// 取消单号
export const outstockOrderCancelTrackingNoApi = createPostRequestWithQuery('/outstock/order/outOrder/cancelWaybill')

// 获取备注
export const getOutstockOrderRemarkApi = (data) => {
    return http.post('/outstock/order/outOrderRemark/page', data)
}
// 新增备注
export const addOutstockOrderRemarkApi = (data) => {
    return http.post('/outstock/order/outOrderRemark/add', data, { headers: { 'loading': true } })
}
// 删除备注
export const deleteOutstockOrderRemarkApi = createPostRequestWithQuery('/outstock/order/outOrderRemark/deleteById')

// 获取附件
export const getOutstockOrderFileApi = (data) => {
    return http.post('/outstock/order/outOrderFile/page', data)
}
// 新增附件
export const addOutstockOrderFileApi = (data) => {
    return http.post('/outstock/order/outOrderFile/add', data, { headers: { 'loading': true } })
}
// 删除附件
export const deleteOutstockOrderFileApi = createPostRequestWithQuery('/outstock/order/outOrderFile/deleteById')

// 获取包裹信息
export const getOutstockOrderTrackingNoApi = (data) => {
    return http.post('/outstock/order/outOrderWaybill/page', data)
}

// 出库单创建方式
export const outstockOrderCreateWayEnumApi = () => {
    return http.post('/outstock/order/outOrder/createWayEnum')
}
// 申请单号状态
export const outstockOrderSupplierPushStatusEnumApi = () => {
    return http.post('/outstock/order/outOrder/supplierPushStatusEnum')
}

// 生成客户单号
export const getGenerateCustomerOrderNoApi = () => {
    return http.post('/outstock/order/outOrder/generateCustomerOrderNo')
}

// 时间筛选条件
export const getOutstockOrderTimeFilterEnumApi = () => {
    return http.post('/outstock/order/outOrder/timeFilterEnum')
}
// 数量个数枚举
export const getOutstockOrderCountBtnEnumApi = () => {
    return http.post('/outstock/order/outOrder/countBtnEnum')
}
// 导出附件类型
export const getOutstockOrderExportTypeEnumApi = () => {
    return http.post('/outstock/order/outOrder/exportTypeEnum')
}
// 导出附件
export const getOutstockOrderExportZIPApi = (data) => {
    return http.post('/outstock/order/outOrder/exportZIP', data, { headers: { 'loading': true } })
}
// 出库单详情状态节点
export const getOutstockOrderStatusApi = createPostRequestWithQuery('/outstock/order/outOrderStatus/listByOutOrderId')

// 出库单详情订单轨迹
export const getOutstockOrderTrackApi = createPostRequestWithQuery('/outstock/trace/outTrack/listByOutOrderId')

// 出库单详情问题
export const getOutstockOrderProblemApi = createPostRequestWithQuery('/outstock/order/outOrderProblem/listByOutOrderId')

// 出库单详情拦截
export const getOutstockOrderHoldupApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/listByOutOrderId')

// 申请单号类型枚举
export const getOutstockOrderWayBillTypeEnumApi = () => {
    return http.post('/outstock/order/outOrder/waybillTypeEnum')
}

// --------------------------------------分配库存
// 分配库存优先级枚举
export const getAllocateInventoryPriorityEnumApi = () => {
    return http.post('/outstock/order/outOrderInventory/allocateInventoryPriorityEnum')
}

// 手动分配库存
export const getAllocateInventoryApi = (data) => {
    return http.post('/outstock/order/outOrderInventory/allocateInventory', data, { headers: { 'loading': true } })
}
// 取消分配库存
export const getCancelAllocateInventoryApi = createPostRequestWithQuery('/outstock/order/outOrderInventory/cancelAllocateInventory')

// 加入波次
export const getJoinWaveApi = (data) => {
    return http.post('/outstock/wave/outWave/joinWave', data, { headers: { 'loading': true } })
}
// 退出波次
export const getExitWaveApi = createPostRequestWithQuery('/outstock/wave/outWave/exitWave')