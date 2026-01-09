import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取客户等级
export const getCustomerLevelEnumApi = (data) => {
    return http.post('/base/cust/customerLevel/page', { ...data })
}
// 添加客户等级
export const addCustomerLevelApi = (data) => {
    return http.post('/base/cust/customerLevel/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑客户等级
export const updCustomerLevelApi = (data) => {
    return http.post('/base/cust/customerLevel/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除客户等级
export const delCustomerLevelApi = createPostRequestWithQuery('/base/cust/customerLevel/deleteById')

// 获取客户列表
export const getCustomerListApi = (data) => {
    return http.post('/base/cust/customer/page', { ...data })
}
// 获取客户信息
export const getCustomerByIdApi = createPostRequestWithQuery('/base/cust/customer/getById')
// 获取客户列表状态
export const getCustomerStatusEnumApi = () => {
    return http.post('/base/cust/customer/statusEnum')
}
// 获取财务用户
export const getListFinancialUserEnumApi = createPostRequestWithQuery('/sys/user/user/listFinancialUser')
// 获取销售用户
export const getListSalesUserEnumApi = createPostRequestWithQuery('/sys/user/user/listSalesUser')
// 添加客户
export const addCustomerApi = (data) => {
    return http.post('/base/cust/customer/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑客户
export const updCustomerApi = (data) => {
    return http.post('/base/cust/customer/updateById', { ...data }, { headers: { 'loading': true } })
}

// 获取API对接
export const getCustomerApiListApi = (data) => {
    return http.post('/base/cust/customerApi/page', { ...data })
}
export const getCustomerApiList = createPostRequestWithQuery('/base/cust/customerApi/list')
// 获取Api类型
export const getCustomerApiTypeEnumApi = () => {
    return http.post('/base/cust/customerApi/typeEnum')
}
// 添加API对接
export const addCustomerApiApi = (data) => {
    return http.post('/base/cust/customerApi/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑API对接
export const updCustomerApiApi = (data) => {
    return http.post('/base/cust/customerApi/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除API对接
export const delCustomerApiApi = createPostRequestWithQuery('/base/cust/customerApi/deleteById')

// 客户审核状态枚举
export const getCustomerAuthStatusEnumApi = () => {
    return http.post('/base/cust/customerAuth/statusEnum')
}
// 状态分组统计
export const getCustomerAuthCountGroupByStatusApi = (data) => {
    return http.post('/base/cust/customerAuth/countGroupByStatus', { ...data })
}
// 认证类型枚举
export const getCustomerAuthTypeEnumApi = () => {
    return http.post('/base/cust/customerAuth/typeEnum')
}
// 客户审核列表
export const getCustomerAuthListApi = (data) => {
    return http.post('/base/cust/customerAuth/page', { ...data })
}
// 获取客户审核详情
export const getCustomerAuthByIdApi = createPostRequestWithQuery('/base/cust/customerAuth/getById')
// 客户审核提交
export const approvalCustomerAuthApi = createPostRequestWithQuery('/base/cust/customerAuth/approval')