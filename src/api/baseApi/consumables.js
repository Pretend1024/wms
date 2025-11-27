import http from '@/utils/request/request'

// 获取包材类型
export const getBasicConsumablesListApi = (data) => {
    return http.post('/base/consumables/consumables/page', { ...data })
}
export const getBasicConsumablesListEnumApi = (data) => {
    return http.post('/base/consumables/consumables/list', {...data }) 
}
// 添加包材类型
export const addBasicConsumablesApi = (data) => {
    return http.post('/base/consumables/consumables/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑包材类型
export const updBasicConsumablesApi = (data) => {
    return http.post('/base/consumables/consumables/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除包材类型
export const delBasicConsumablesApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    const url = queryString
        ? `/base/consumables/consumables/deleteById?${queryString}`
        : '/base/consumables/consumables/deleteById';

    return http.post(url);
}

// 获取包材库存
export const getBasicConsumablesInventoryListApi = (data) => {
    return http.post('/base/consumables/consumablesInventory/page', { ...data })
}
// 添加包材库存
export const addBasicConsumablesInventoryApi = (data) => {
    return http.post('/base/consumables/consumablesIn/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑包材库存
export const updBasicConsumablesInventoryApi = (data) => {
    return http.post('/base/consumables/consumablesInventory/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除包材库存
export const delBasicConsumablesInventoryApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    const url = queryString
        ? `/base/consumables/consumablesInventory/deleteById?${queryString}`
        : '/base/consumables/consumablesInventory/deleteById';

    return http.post(url);
}

// 新增包材入库
export const addBasicConsumablesInventoryInApi = (data) => {
    return http.post('/base/consumables/consumablesIn/add', { ...data }, { headers: { 'loading': true } })
}
// 包材入库记录
export const getBasicConsumablesInventoryInListApi = (data) => {
    return http.post('/base/consumables/consumablesIn/page', { ...data })
}

// 新增包材出库
export const addBasicConsumablesInventoryOutApi = (data) => {
    return http.post('/base/consumables/consumablesOut/add', { ...data }, { headers: { 'loading': true } })
}
// 包材出库记录
export const getBasicConsumablesInventoryOutListApi = (data) => {
    return http.post('/base/consumables/consumablesOut/page', { ...data })
}