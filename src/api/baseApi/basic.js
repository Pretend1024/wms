import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取国家地区
export const getBasicCountryListApi = (data) => {
    return http.post('/base/basic/country/page', { ...data })
}
// 添加国家地区
export const addBasicCountryApi = (data) => {
    return http.post('/base/basic/country/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑国家地区
export const updBasicCountryApi = (data) => {
    return http.post('/base/basic/country/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除国家地区
export const delBasicCountryApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/basic/country/deleteById?${queryString}`
        : '/base/basic/country/deleteById';

    return http.post(url);
}
// 获取洲枚举
export const getBasicContinentEnumApi = (data) => {
    return http.post('/base/basic/country/continentEnum', { ...data })
}

// 获取模板列表
export const getBasicTemplateListApi = (data) => {
    return http.post('/base/basic/template/page', { ...data })
}
// 添加模板
export const addBasicTemplateApi = (data) => {
    return http.post('/base/basic/template/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑模板
export const updBasicTemplateApi = (data) => {
    return http.post('/base/basic/template/updateById', { ...data }, { headers: { 'loading': true } })
}
// 模板类型枚举
export const getBasicTemplateATypeEnumApi = () => {
    return http.post('/base/basic/template/atypeEnum')
}
// 数据类型枚举
export const getBasicTemplateBTypeEnumApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/basic/template/btypeEnum?${queryString}`
        : '/base/basic/template/btypeEnum';

    return http.post(url);
}
// 状态枚举
export const getBasicTemplateStatusEnumApi = () => {
    return http.post('/base/basic/template/statusEnum')
}

// 获取地址库
export const getBasicAddressPageApi = (data) => {
    return http.post('/base/basic/address/page', { ...data })
}
// 添加地址库
export const addBasicAddressApi = (data) => {
    return http.post('/base/basic/address/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑地址库
export const updBasicAddressApi = (data) => {
    return http.post('/base/basic/address/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除地址库
export const delBasicAddressApi = createPostRequestWithQuery('/base/basic/address/deleteById')
// 地址类型枚举
export const getBasicAddressTypeEnumApi = () => {
    return http.post('/base/basic/address/addressEnum')
}
// 生成地址编码
export const getBasicGenerateAddressCodeApi = () => {
    return http.post('/base/basic/address/generateAddressCode')
}