import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// -------------------------------工单问题类型
// 获取工单问题类型列表（分页）
export const getWorkOrderTypePageApi = (data) => {
    return http.post('/vas/wo/workOrderType/page', data)
}
// 获取工单问题类型树形列表
export const getWorkOrderTypeListApi = () => {
    return http.post('/vas/wo/workOrderType/listTree')
}
// 添加工单问题类型
export const addWorkOrderTypeApi = (data) => {
    return http.post('/vas/wo/workOrderType/add', data, { headers: { 'loading': true } })
}
// 编辑工单问题类型
export const updWorkOrderTypeByIdApi = (data) => {
    return http.post('/vas/wo/workOrderType/updateById', data, { headers: { 'loading': true } })
}

// -------------------------------工单管理
// 获取工单列表（分页）
export const getWorkOrderPageApi = (data) => {
    return http.post('/vas/wo/workOrder/page', data)
}
// 添加工单
export const addWorkOrderApi = (data) => {
    return http.post('/vas/wo/workOrder/add', data, { headers: { 'loading': true } })
}
// 编辑工单
export const updWorkOrderByIdApi = (data) => {
    return http.post('/vas/wo/workOrder/updateById', data, { headers: { 'loading': true } })
}
// 删除工单
export const delWorkOrderByIdApi = createPostRequestWithQuery('/vas/wo/workOrder/deleteById')
// 获取工单详情
export const getFullByIdApi = createPostRequestWithQuery('/vas/wo/workOrder/getFullById')
// 获取工单状态统计
export const getCountGroupByStatusApi = (data) => {
    return http.post('/vas/wo/workOrder/countGroupByStatus', data)
}
// 获取工单优先级枚举
export const getPriorityEnumApi = () => {
    return http.post('/vas/wo/workOrder/priorityEnum')
}
// 获取工单业务类型枚举
export const getBizTypeEnumApi = () => {
    return http.post('/vas/wo/workOrder/bizTypeEnum')
}
// 取消工单
export const cancelWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/cancel')
// 重开工单
export const reopenWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/reopen')
// 关闭工单
export const closeWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/close')
// 工单催单
export const followUpWorkApi = (body, query) => {
    return http.post('/vas/wo/workOrder/followUpWork', body, {
        params: query,
        headers: { 'loading': true }
    })
}
// 工单评分
export const evaluationWorkApi = (data) => {
    return http.post('/vas/wo/workOrder/evaluation', data, { headers: { 'loading': true } })
}
// 根据单号获取单据信息
export const getBizByTypeAndNoApi = createPostRequestWithQuery('/vas/wo/workOrder/getBizByTypeAndNo')
// 获取工单模板列表
export const getWorkOrderTemplateListApi = (data) => {
    return http.post('/vas/wo/workOrderTemplate/list', data)
}

// -------------------------------工单回复与指派
// 添加工单回复
export const addWorkOrderDetailApi = (data) => {
    return http.post('/vas/wo/workOrderDetail/add', data, { headers: { 'loading': true } })
}
// 工单指派
export const assignWorkApi = (data) => {
    return http.post('/vas/wo/workOrderUser/assignWork', data, { headers: { 'loading': true } })
}