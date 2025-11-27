import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'
// -------------------------------库存列表
// 分类标签页枚举
export const getInventoryInventoryInventoryViewEnumApi = () => {
    return http.post('/inventory/inventory/inventory/inventoryViewEnum')
}
// 获取库存列表
export const getInventoryInventoryPageApi = (data) => {
    return http.post('/inventory/inventory/inventory/page', { ...data })
}
// 获取入库单详情
export const getOrderInOrderInfoApi = createPostRequestWithQuery('/instock/order/inOrder/getById')
// 获取库存信息
export const getInventoryInventoryInfoApi = createPostRequestWithQuery('/inventory/inventory/inventory/getById')
// 锁定数量
export const postInventoryInventoryLockQtyApi = (data) => {
    return http.post('/inventory/inventory/inventory/lockQty', { ...data })
}
// 获取锁定数量
export const getInventoryInventoryLockQtyApi = createPostRequestWithQuery('/inventory/inventory/inventory/getLockQty')
// 调整数量
export const postInventoryInventoryAdjustQtyApi = (data) => {
    return http.post('/inventory/adjust/inventoryAdjust/add', { ...data })
}

// 获取数量详情
export const getInventoryListQtyDetailPageApi = (data) => {
    return http.post('/inventory/inventory/inventoryLog/listQtyDetail', { ...data })
}
// 获取库存流水
export const getInventoryInventoryLogPageApi = (data) => {
    return http.post('/inventory/inventory/inventoryLog/page', { ...data })
}
// 获取数量类型枚举
export const getInventoryInventoryQtyTypeApi = () => {
    return http.post('/inventory/inventory/inventoryLog/qtyTypeEnum')
}
// 获取操作类型枚举
export const getInventoryInventoryOpTypeApi = () => {
    return http.post('/inventory/inventory/inventoryLog/opTypeEnum')
}
// 获取状态枚举
export const getInventoryInventoryStatusApi = () => {
    return http.post('/inventory/inventory/inventory/statusEnum')
}
// 冻结库存
export const postInventoryInventoryLockApi = (data) => {
    return http.post('/inventory/inventory/inventory/lock', { ...data })
}
// 解冻库存
export const postInventoryInventoryUnlockApi = (data) => {
    return http.post('/inventory/inventory/inventory/unLock', { ...data })
}

// 日志数量类型枚举
export const getInventoryInventoryLogQtyTypeApi = () => {
    return http.post('/inventory/inventory/inventoryLog/qtyTypeEnum')
}
// 日志操作类型枚举
export const getInventoryInventoryLogOpTypeApi = () => {
    return http.post('/inventory/inventory/inventoryLog/opTypeEnum')
}
// 获取日志
export const getInventoryInventoryLogListLogApi = (data) => {
    return http.post('/inventory/inventory/inventoryLog/listLog', { ...data })
}
// 详情列表inventory/inventory/inventory/listDetail
export const getInventoryInventoryListDetailApi = (data) => {
    return http.post('/inventory/inventory/inventory/listDetail', { ...data })
}

// -------------------------------库存快照
// 获取库存快照
export const getInventoryInventorySnapshotPageApi = (data) => {
    return http.post('inventory/inventory/inventorySnapshot/page', { ...data })
}


// -------------------------------库存调整
// 获取调整单
export const getAdjustPageApi = (data) => {
    return http.post('/inventory/adjust/inventoryAdjust/page', { ...data })
}
// 查看明细
export const getAdjustDetailListByAdjustIdApi = createPostRequestWithQuery('/inventory/adjust/inventoryAdjustDetail/listByAdjustId')

// 更新备注
export const updateRemarkApi = createPostRequestWithQuery('/inventory/adjust/inventoryAdjust/updateRemark')
// 生效
export const executeApi = createPostRequestWithQuery('/inventory/adjust/inventoryAdjust/execute')
// 作废
export const cancelApi = createPostRequestWithQuery('/inventory/adjust/inventoryAdjust/cancel')
// 类型枚举
export const getAdjustTypeApi = () => {
    return http.post('/inventory/adjust/inventoryAdjust/typeEnum')
}
// 状态枚举
export const getAdjustStatusApi = () => {
    return http.post('/inventory/adjust/inventoryAdjust/statusEnum')
}


// -------------------------------SN库存
// 获取SN库存 inventory/inventory/inventorySn/page
export const getInventorySnPageApi = (data) => {
    return http.post('/inventory/inventory/inventorySn/page', { ...data })
}
// 状态枚举inventory/inventory/inventorySn/statusEnum
export const getInventorySnStatusApi = () => {
    return http.post('/inventory/inventory/inventorySn/statusEnum', {})
}
// 新增SN库存inventory/inventory/inventorySn/add
export const addInventorySnAddApi = (data) => {
    return http.post('/inventory/inventory/inventorySn/add', { ...data })
}
// 编辑inventory/inventory/inventorySn/updateById
export const updInventorySnUpdateByIdApi = (data) => {
    return http.post('/inventory/inventory/inventorySn/updateById', { ...data })
}
// 删除inventory/inventory/inventorySn/deleteById
export const delInventorySnDeleteByIdApi = createPostRequestWithQuery('/inventory/inventory/inventorySn/deleteById') 