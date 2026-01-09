import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 工具---------------------------条码打印
// 条码打印
export const printToolsBarcodeApi = createPostRequestWithQuery('/base/tools/print/barcode')
// 二维码打印
export const printToolsPrintQrcodeApi = createPostRequestWithQuery('/base/tools/print/qrcode')

// 打印sku
export const skuPrintApi = (data) => {
    return http.post('/base/sku/sku/print', { ...data })
}
// 打印库位
export const printWhLocationApi = (data) => {
    return http.post('/base/wh/location/print', { ...data })
}
// 打印入库单
export const printWhinOrderApi = (data) => {
    return http.post('/instock/order/inOrder/print', { ...data })
}
// 打印耗材库存
export const printConsumablesInventoryApi = (data) => {
    return http.post('/base/consumables/consumablesInventory/print', { ...data })
}
// 打印箱唛
export const printInOrderPrintprintBoxApi = (data) => {
    return http.post('/instock/order/inOrder/printBox', { ...data })
}
// 打印波次运单
export const printOutWavePrintWayBillApi = (data) => {
    return http.post('/outstock/wave/outWave/printWayBill', { ...data })
}
// 打印运单
export const printOutOrderPrintWayBillApi = (data) => {
    return http.post('/outstock/order/outOrder/printWayBill', { ...data })
}
// 打印增值服务单
export const printOutOrderPrintVasOrderDataApi = (data) => {
    return http.post('/outstock/order/outOrder/printVasOrderData', { ...data })
}
// 打印附件
export const printOutOrderPrintAttachmentsApi = (data) => {
    return http.post('/outstock/order/outOrder/printAttachments', { ...data })
}
// 打印商业发票
export const printOutOrderPrintInvoiceApi = (data) => {
    return http.post('/outstock/order/outOrder/printInvoice', { ...data })
}