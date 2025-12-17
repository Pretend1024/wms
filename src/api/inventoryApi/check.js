import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取盘点列表
export const getInventoryCheckPageApi = (data) => {
    return http.post('/inventory/check/inventoryCheck/page', { ...data })
}
// 添加盘点
export const addInventoryCheckAddApi = (data) => {
    return http.post('/inventory/check/inventoryCheck/add', { ...data })
}
// 编辑盘点
export const updInventoryCheckUpdateByIdApi = (data) => {
    return http.post('/inventory/check/inventoryCheck/updateById', { ...data })
}
// 作废盘点
export const cancelInventoryCheckApi = createPostRequestWithQuery('/inventory/check/inventoryCheck/cancelInventoryCheck')
// 获取盘点详情
export const getInventoryCheckGetFullByIdAndTypeApi = createPostRequestWithQuery('/inventory/check/inventoryCheck/getFullByIdAndType')

// 盘点方式
export const getInventoryCheckCheckTypeEnumApi = () => {
    return http.post('/inventory/check/inventoryCheck/checkTypeEnum')
}
// 盘点状态
export const getInventoryCheckCheckStatusEnumApi = () => {
    return http.post('/inventory/check/inventoryCheck/checkStatusEnum')
}
// 盘点状态统计
export const getInventoryCheckCountGroupByStatusApi = (data) => {
    return http.post('/inventory/check/inventoryCheck/countGroupByStatus', { ...data })
}

// 盘点完成
export const completeCheckInventoryCheckApi = createPostRequestWithQuery('/inventory/check/inventoryCheck/completeCheck')
// 盘点确认
export const confirmCompleteCheckInventoryCheckApi = createPostRequestWithQuery('/inventory/check/inventoryCheck/confirmCompleteCheck')