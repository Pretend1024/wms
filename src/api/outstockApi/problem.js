import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 问题管理列表
export const getOutstockOrderProblemApi = (data) => {
    return http.post('/outstock/order/outOrderProblem/page', data)
}
// 问题类型枚举
export const getOutstockOrderProblemTypeEnumApi = () => {
    return http.post('/outstock/order/outOrderProblem/outOrderProblemTypeEnum')
}
// 新增问题
export const addOutstockOrderProblemApi = (data) => {
    return http.post('/outstock/order/outOrderProblem/add', data, { headers: { 'loading': true } })
}
// 关闭解决问题
export const closeOutstockOrderProblemApi = (data) => {
    return http.post('/outstock/order/outOrderProblem/resolveProblem', data, { headers: { 'loading': true } })
}
// 状态数量
export const getOutstockOrderProblemStatusCountApi = (data) => {
    return http.post('/outstock/order/outOrderProblem/countGroupByStatus', data)
}
// 筛选时间枚举
export const getOutstockOrderProblemTimeFilterEnumApi = () => {
    return http.post('/outstock/order/outOrderProblem/timeFilterEnum')
}