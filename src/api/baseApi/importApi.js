import http from '@/utils/request/request'
// 导入SKU创建
export const importSkuAddApi = (data) => {
    return http.post('/base/sku/sku/importAdd', data)
}
// 导入SKU更新
export const importSkuUpdApi = (data) => {
    return http.post('/base/sku/sku/importUpd', data)
}
// 导入库位创建
export const importLocationAddApi = (data) => {
    return http.post('/base/wh/location/importAdd', data)
}
// 导入库位更新
export const importLocationUpdApi = (data) => {
    return http.post('/base/wh/location/importUpd', data)
}
// 导入分区创建
export const importShipwayRegionAddApi = (data) => {
    return http.post('/product/price/region/importAdd', data)
};
// 导入sku映射创建
export const importSkuMappingAddApi = (data) => {
    return http.post('/base/sku/skuMapping/importAdd', data)
}
// 导入偏远库明细创建
export const importRemoteDetailAddApi = (data) => {
    return http.post('/product/price/remoteDetail/importAdd', data)
}
// 导入创建出库单
export const importOutboundAddApi = (data) => {
    return http.post('/outstock/order/outOrder/importAdd', data)
}

// 导入SN库存
export const importInventorySnAddApi = (data) => {
    return http.post('/inventory/inventory/inventorySn/importAdd', data)
}

// 导入应收费用
export const importReceivableFeeAddApi = (data) => {
    return http.post('/finance/receivables/receivableFee/importAdd', data)
}