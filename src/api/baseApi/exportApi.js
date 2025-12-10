import http from '@/utils/request/request'
// 导出sku
export const exportSkuApi = (data) => {
    return http.post('/base/sku/sku/export', { ...data })
}

// 导出库位
export const exportWhLocationApi = (data) => {
    return http.post('/base/wh/location/export', { ...data })
}

// 导出入库单
export const exportWhinOrderApi = (data) => {
    return http.post('instock/order/inOrder/export', { ...data })
}

// 导出耗材入库单
export const exportConsumablesInApi = (data) => {
    return http.post('/base/consumables/consumablesIn/export', { ...data })
}

// 导出耗材出库单
export const exportConsumablesOutApi = (data) => {
    return http.post('/base/consumables/consumablesOut/export', { ...data })
}
// 导出耗材库存
export const exportConsumablesInventoryApi = (data) => {
    return http.post('/base/consumables/consumablesInventory/export', { ...data })
}
// 导出收货记录
export const exportConsumablesInReceivingApi = (data) => {
    return http.post('/instock/op/inReceipt/export', { ...data })
}
// 导出服务商
export const exportProductSupplierApi = (data) => {
    return http.post('/product/shipway/supplier/export', { ...data })
}
// 导出上架记录
export const exportInShelfApi = (data) => {
    return http.post('/instock/op/inShelf/export', { ...data })
}
// 导出偏远库明细
export const exportRemoteDetailApi = (data) => {
    return http.post('/product/price/remoteDetail/export', { ...data })
}
// 导出库存列表
export const exportInventoryApi = (data) => {
    return http.post('/inventory/inventory/inventory/export', { ...data })
}
// 导出库存流水
export const exportInventoryLogApi = (data) => {
    return http.post('/inventory/inventory/inventoryLog/export', { ...data })
}
// 导出库存快照
export const exportInventorySnapshotApi = (data) => {
    return http.post('/inventory/inventory/inventorySnapshot/export', { ...data })
}
// 导出退件单
export const exportReturnOrderApi = (data) => {
    return http.post('/instock/return/returnOrder/export', { ...data })
}
// 导出出库单
export const exportOutOrderApi = (data) => {
    return http.post('/outstock/order/outOrder/export', { ...data })
}
// 导出库存调整
export const exportInventoryAdjustApi = (data) => {
    return http.post('/inventory/adjust/inventoryAdjust/export', { ...data })
}
// 导出SN库存
export const exportInventorySnApi = (data) => {
    return http.post('/inventory/inventory/inventorySn/export', { ...data })
}
// 导出客户钱包
export const exportCustomerAccountApi = (data) => {
    return http.post('/finance/account/customerAccount/export', { ...data })
}
// 导出授信
export const exportCustomerCreditApi = (data) => {
    return http.post('/finance/receivables/customerCredit/export', { ...data })
}
// 导出客户充值
export const exportCustomerRechargeApi = (data) => {
    return http.post('/finance/account/customerRecharge/export', { ...data })
}
// 导出出库单轨迹
export const exportOutOrderTraceApi = (data) => {
    return http.post('/outstock/trace/outTrack/export', { ...data })
}

// 导出应收费用
export const exportReceivableFeeApi = (data) => {
    return http.post('/finance/receivables/receivableFee/export', { ...data })
}