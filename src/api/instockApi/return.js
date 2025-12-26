import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取退件单
export const getInstockReturnReturnOrderApi = (data) => {
    return http.post('/instock/return/returnOrder/page', { ...data })
}
// 新增退件单
export const addInstockReturnReturnOrderApi = (data) => {
    return http.post('/instock/return/returnOrder/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑退件单
export const updInstockReturnReturnOrderApi = (data) => {
    return http.post('/instock/return/returnOrder/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除退件单
export const delInstockReturnReturnOrderApi = createPostRequestWithQuery('/instock/return/returnOrder/deleteById')
// 更改退件单状态
export const updInstockReturnReturnOrderStatusApi = createPostRequestWithQuery('/instock/return/returnOrder/updateStatus')
// 获取退件单详情
export const getInstockReturnReturnOrderInfoApi = createPostRequestWithQuery('/instock/return/returnOrder/getVoById')
// 销毁包裹
export const destroyInstockReturnReturnParcelApi = createPostRequestWithQuery('/instock/return/returnOrder/destroy')
// 上架商品
export const shelfInstockReturnReturnProductApi = createPostRequestWithQuery('/instock/return/returnOrder/shelf')
// 退件单状态枚举
export const getInstockReturnReturnOrderStatusEnumApi = () => {
    return http.post('/instock/return/returnOrder/statusEnum')
}
// 退件单类型枚举
export const getInstockReturnReturnOrderTypeEnumApi = () => {
    return http.post('/instock/return/returnOrder/typeEnum')
}
// 退件包裹状态枚举
export const getInstockReturnReturnParcelStatusEnumApi = () => {
    return http.post('/instock/return/returnParcel/statusEnum')
}
// 创建方式
export const getInstockReturnReturnOrderCreateWayEnumApi = () => {
    return http.post('/instock/return/returnOrder/createWayEnum')
}

// -----------------------------------------退件入库
// 获取退件入库单
export const getReturnOrderListByNumberTypeApi = (data) => {
    return http.post('/instock/return/returnOrder/listByNumberType', { ...data })
}
// 包裹签收
export const signInstockReturnApi = (data) => {
    return http.post('/instock/return/returnOrder/sign', { ...data }, { headers: { 'loading': true } })
}
// 商品清点
export const countInstockReturnApi = (data) => {
    return http.post('/instock/return/returnOrder/tally', { ...data }, { headers: { 'loading': true } })
}
// 签收与清点
export const signAndCountInstockReturnApi = (data) => {
    return http.post('/instock/return/returnOrder/signAndCheck', { ...data }, { headers: { 'loading': true } })
}

// 获取退件认领
export const getReturnOrderClaimApi = (data) => {
    return http.post('/instock/returned/returnClaim/page', { ...data })
}
// 添加退件认领
export const addReturnOrderClaimApi = (data) => {
    return http.post('/instock/returned/returnClaim/add', { ...data }, { headers: { 'loading': true } })
}
// 更新退件认领状态
export const updReturnOrderClaimStatusApi = createPostRequestWithQuery('/instock/returned/returnClaim/updateStatus')
// 删除退件认领
export const delReturnOrderClaimApi = createPostRequestWithQuery('/instock/returned/returnClaim/deleteById')
// 销毁类型枚举
export const getReturnOrderDestroyTypeEnumApi = () => {
    return http.post('/instock/returned/returnClaim/destroyTypeEnum')
}
// 验证认领
export const verifyReturnOrderClaimApi = createPostRequestWithQuery('/instock/returned/returnClaim/claimByTrackingNos')

// 认领销毁
export const destroyReturnOrderClaimApi = createPostRequestWithQuery('/instock/returned/returnClaim/destroy')
// 销毁类型枚举
export const getReturnOrderClaimStatusEnumApi = () => {
    return http.post('/instock/returned/returnClaim/destroyTypeEnum')
}
// 认领状态枚举
export const getReturnOrderClaimDestroyTypeEnumApi = () => {
    return http.post('/instock/returned/returnClaim/statusEnum')
}