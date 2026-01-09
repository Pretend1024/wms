import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'
// ---------------------------------------------------------SKU
// 获取sku仓库信息
export const getSkuSkuListApi = (data) => {
    return http.post('/base/sku/sku/page', { ...data })
}
export const getSkuSkuDataBySkuApi = createPostRequestWithQuery('/base/sku/sku/getBySku')
// 获取sku仓库
export const getSkuSkuDataApi = createPostRequestWithQuery('/base/sku/sku/getById');
// 添加sku仓库
export const addSkuSkuDataApi = (data) => {
    return http.post('/base/sku/sku/add', { ...data }, { headers: { 'loading': true } })
}
// 删除sku仓库
export const delSkuSkuDataApi = createPostRequestWithQuery('/base/sku/sku/deleteById');
// 修改sku仓库
export const updateSkuSkuDataApi = (data) => {
    return http.post('/base/sku/sku/updateById', { ...data }, { headers: { 'loading': true } })
}

// 模糊搜索客户代码
export const getCustomerLikeQueryApi = createPostRequestWithQuery('/base/cust/customer/likeQuery');

// 获取sku状态菜单
export const getSkuStatusEnumListApi = () => {
    return http.post('/base/sku/sku/statusEnum')
}
// 获取客户状态菜单
export const getSkuCusStatusEnumListApi = () => {
    return http.post('/base/sku/sku/cusStatusEnum')
}
// 获取带电类型
export const getSkuElectrifiedEnumListApi = () => {
    return http.post('/base/sku/sku/electrifiedEnum')
}
// 获取危险类型
export const getSkuDangerEnumListApi = () => {
    return http.post('/base/sku/sku/dangerEnum')
}

// 修改sku审核状态
export const updateSkuStatusApi = createPostRequestWithQuery('/base/sku/sku/updateStatus');

// 获取sku图片
export const getSkuImgListApi = (data) => {
    return http.post('/base/sku/skuImg/page', { ...data })
}
// 添加sku图片
export const addSkuImgDataApi = (data) => {
    return http.post('/base/sku/skuImg/add', { ...data }, { headers: { 'loading': true } })
}
// 删除sku图片
export const delBasicAddressApi = createPostRequestWithQuery('/base/sku/skuImg/deleteById')
// 设置SKU主图
export const updateSkuMainImgApi = (data) => {
    return http.post('/base/sku/sku/updateByMainImgUrl', { ...data })
}

// ----------------------------------------------------------SKU映射
// 获取sku映射信息
export const getSkuMappingListApi = (data) => {
    return http.post('/base/sku/skuMapping/page', { ...data })
}
export const getSkuMappingDataByIdApi = createPostRequestWithQuery('/base/sku/skuMapping/getById')
// 添加sku映射
export const addSkuMappingDataApi = (data) => {
    return http.post('/base/sku/skuMapping/add', { ...data }, { headers: { 'loading': true } })
}
// 删除sku映射
export const delSkuMappingDataApi = createPostRequestWithQuery('/base/sku/skuMapping/deleteById')
// 修改sku映射
export const updateSkuMappingDataApi = (data) => {
    return http.post('/base/sku/skuMapping/updateById', { ...data }, { headers: { 'loading': true } })
}