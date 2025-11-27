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
export const delCustomerLevelApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/cust/customerLevel/deleteById?${queryString}`
        : '/base/cust/customerLevel/deleteById';

    return http.post(url);
}

// 获取客户列表
export const getCustomerListApi = (data) => {
    return http.post('/base/cust/customer/page', { ...data })
}
// 获取客户信息
export const getCustomerByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/cust/customer/getById?${queryString}`
        : '/base/cust/customer/getById';

    return http.post(url);
}
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
export const getCustomerApiList = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/cust/customerApi/list?${queryString}`
        : '/base/cust/customerApi/list?';

    return http.post(url);
}
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
export const delCustomerApiApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/cust/customerApi/deleteById?${queryString}`
        : '/base/cust/customerApi/deleteById';

    return http.post(url);
}