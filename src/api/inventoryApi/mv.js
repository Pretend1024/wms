import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取移库单列表
export const getInventoryMvPageApi = (data) => {
    return http.post('/inventory/mv/inventoryMv/page', { ...data })
}

// 生成移库主单 (返回主单ID)
export const addInventoryMvMasterApi = (data) => {
    return http.post('/inventory/mv/inventoryMv/add', { ...data }, { headers: { 'loading': true } })
}

// 获取移库单详情 (用于编辑回显)
export const getInventoryMvDetailApi = createPostRequestWithQuery('/inventory/mv/inventoryMv/getFullById')

// 获取库存SKU信息 (下架前查询：原库位+条码 -> 返回品质、总数量)
export const getInventoryMvSkuInfoApi = (data) => {
    return http.post('/inventory/mv/inventoryMv/getSkuInventoryInfo', { ...data })
}

// 获取下架批次详情 (预下架：根据数量获取批次分配情况)
export const getInventoryMvOutDetailApi = (data) => {
    return http.post('/inventory/mv/inventoryMv/listMvOutDetail', { ...data })
}

// 提交移库明细 (执行单条明细的移库操作)
export const addInventoryMvDetailApi = (data) => {
    return http.post('/inventory/mv/inventoryMv/submitMv', { ...data }, { headers: { 'loading': true } })
}

// 移库类型
export const getInventoryMvOpTypeEnumApi = () => {
    return http.post('/inventory/mv/inventoryMv/inventoryMvOpTypeEnum')
}

// 移库状态
export const getInventoryMvStatusEnumApi = () => {
    return http.post('/inventory/mv/inventoryMv/inventoryMvStatusEnum')
}

// 移库完成
export const completeInventoryMvApi = createPostRequestWithQuery('/inventory/mv/inventoryMv/completeMv')