import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 拦截管理列表
export const outstockOrderHoldupListApi = (data) => {
    return http.post('/outstock/order/outOrderHoldup/page', data)
}
// 拦截成功
export const outstockOrderHoldupSuccessApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/completeHoldUp')
// 拦截失败
export const outstockOrderHoldupFailApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/failHoldUp')

// 申请拦截
export const outstockOrderApplyHoldUptApi = (data) => {
    return http.post('/outstock/order/outOrderHoldup/applyHoldUp', data)
}
// 取消拦截
export const outstockOrderCancelHoldUpApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/cancelHoldUp')
// 拦截状态枚举
export const getOrderHoldupStatusApi = () => {
    return http.post('/outstock/order/outOrderHoldup/holdUpStatusEnum')
}
// 状态数量/outstock/order/outOrderHoldup/countGroupByStatus
export const getOrderHoldupStatusCountApi = (data) => {
    return http.post('/outstock/order/outOrderHoldup/countGroupByStatus', data)
}


