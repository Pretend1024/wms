import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// -----------------------------------------------------工单问题类型
// 获取工单问题类型列表
export const getWorkOrderTypePageApi = (data) => {
    return http.post('/vas/wo/workOrderType/page', data)
}
// 获取工单问题类型树形
export const getWorkOrderTypeListApi = () => {
    return http.post('/vas/wo/workOrderType/listTree')
}
// 添加工单问题类型
export const addWorkOrderTypeApi = (data) => {
    return http.post('/vas/wo/workOrderType/add', data)
}
// 编辑工单问题类型
export const updWorkOrderTypeByIdApi = (data) => {
    return http.post('/vas/wo/workOrderType/updateById', data)
}


// -----------------------------------------------------工单
// 工单列表
export const getWorkOrderPageApi = (data) => {
    return http.post('/vas/wo/workOrder/page', data)
}
// 添加工单/vas/wo/workOrder/add
export const addWorkOrderApi = (data) => {
    return http.post('/vas/wo/workOrder/add', data, { headers: { 'loading': true } })
}
// 编辑工单/vas/wo/workOrder/updateById
export const updWorkOrderByIdApi = (data) => {
    return http.post('/vas/wo/workOrder/updateById', data)
}
// 删除工单/vas/wo/workOrder/deleteById
export const delWorkOrderByIdApi = createPostRequestWithQuery('/vas/wo/workOrder/deleteById')
// 工单详情/vas/wo/workOrder/getFullById
export const getFullByIdApi = createPostRequestWithQuery('/vas/wo/workOrder/getFullById')
// 状态枚举/vas/wo/workOrder/countGroupByStatus
export const getCountGroupByStatusApi = (data) => {
    return http.post('/vas/wo/workOrder/countGroupByStatus', data)
}
// 优先级枚举/vas/wo/workOrder/priorityEnum
export const getPriorityEnumApi = () => {
    return http.post('/vas/wo/workOrder/priorityEnum')
}
// 业务类型/vas/wo/workOrder/bizTypeEnum
export const getBizTypeEnumApi = () => {
    return http.post('/vas/wo/workOrder/bizTypeEnum')
}
// 取消工单/vas/wo/workOrder/cancel
export const cancelWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/cancel')
// 重开工单/vas/wo/workOrder/reopen
export const reopenWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/reopen')
// 关闭工单/vas/wo/workOrder/close
export const closeWorkOrderApi = createPostRequestWithQuery('/vas/wo/workOrder/close')
// 催单/vas/wo/workOrder/followUpWork
export const followUpWorkApi = (body, query) => {
    return http.post('/vas/wo/workOrder/followUpWork', body, { params: query })
}
// 评分/vas/wo/workOrder/evaluation
export const evaluationWorkApi = (data) => {
    return http.post('/vas/wo/workOrder/evaluation', data)
}
// 根据单号获取单据信息/vas/wo/workOrder/getBizByTypeAndNo
export const getBizByTypeAndNoApi = createPostRequestWithQuery('/vas/wo/workOrder/getBizByTypeAndNo')

// 工单模板列表/vas/wo/workOrderTemplate/list
export const getWorkOrderTemplateListApi = (data) => {
    return http.post('/vas/wo/workOrderTemplate/list', data)
}

// 工单回复/vas/wo/workOrderDetail/add
export const addWorkOrderDetailApi = (data) => {
    return http.post('/vas/wo/workOrderDetail/add', data)
}
// 指派/vas/wo/workOrderUser/assignWork
export const assignWorkApi = (data) => {
    return http.post('/vas/wo/workOrderUser/assignWork', data)
} 