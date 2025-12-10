import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 根据波次获取拣货单
export const getOutstockWaveByWaveNoApi = createPostRequestWithQuery('/outstock/wave/outWave/getWavePickByWaveNo')

// 提交拣货
export const submitPickApi = (data) => {
    return http.post('/outstock/wave/outWave/submitPick', data)
}

// 二次拣货
export const getWaveOrderProductDetailsApi = createPostRequestWithQuery('/outstock/wave/outWave/getWaveOrderProductDetails')
// 根据订单获取全部附件
export const getAllUploadFilesApi = createPostRequestWithQuery('/outstock/order/outOrder/getAllUploadFiles')
// 二次拣货提交
export const submitRePickApi = (data) => {
    return http.post('/outstock/wave/outWave/submitRePick', data)
}


// 通过订单号/运单号查询出库单
export const getOutOrderByCodeApi = createPostRequestWithQuery('/outstock/order/outOrder/getOutOrderByCode')

// 获取订单信息  opType 1:复核 2：称重 3：出库
export const getReCheckOutOrderApi = createPostRequestWithQuery('/outstock/order/outOrder/getOrderWithWaybillAndSku')

// 复核提交
export const submitReCheckApi = (data) => {
    return http.post('/outstock/order/outOrder/submitReCheck', data)
}
// 获取耗材信息
export const isAvailableAndInStockApi = (data) => {
    return http.post('/base/consumables/consumablesInventory/isAvailableAndInStock', data)
}

// 称重提交
export const submitWeightCheckApi = (data) => {
    return http.post('/outstock/order/outOrder/submitWeightCheck', data)
}
// 出库提交
export const submitOutboundStockApi = (data) => {
    return http.post('/outstock/order/outOrder/submitOutboundStock', data)
}
// 出库统计
export const getOutboundOrderDataApi = () => {
    return http.post('/outstock/order/outOrder/getOutboundOrderData', {})
}

// 获取出库单/库存分配信息
export const getOutOrderWithInventoryApi = createPostRequestWithQuery('/outstock/order/outOrder/getOutOrderWithInventory')

// 提交归位上架
export const submitReturnOnShelfApi = (data) => {
    return http.post('/outstock/order/outOrder/submitReturnOnShelf', data)
}