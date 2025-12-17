import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// -----------------------------------------------------增值服务类型
// 获取增值服务类型
export const getVasServiceTypePageApi = (data) => {
    return http.post('/vas/vas/vasServiceType/page', data)
}
// 不分页获取增值服务类型列表
export const getVasServiceTypeListApi = () => {
    return http.post('/vas/vas/vasServiceType/list', {})
}
// 新增增值服务类型
export const addVasServiceTypeApi = (data) => {
    return http.post('/vas/vas/vasServiceType/add', data)
}
// 编辑增值服务类型
export const updVasServiceTypeByIdApi = (data) => {
    return http.post('/vas/vas/vasServiceType/updateById', data)
}

// 启用/禁用增值服务类型
export const setEnableDisableApi = createPostRequestWithQuery('/vas/vas/vasServiceType/setEnableDisable')
// 使用场景枚举
export const getTypeSceneEnumApi = () => {
    return http.post('/vas/vas/vasServiceType/typeSceneEnum')
}

// -----------------------------------------------------增值服务
// 增值服务列表
export const getVasOrderPageApi = (data) => {
    return http.post('/vas/vas/vasOrder/page', data)
}
// 新增增值服务
export const addVasOrderApi = (data) => {
    return http.post('/vas/vas/vasOrder/add', data, { headers: { 'loading': true } })
}
// 删除增值服务
export const delVasOrderByIdApi = createPostRequestWithQuery('/vas/vas/vasOrder/deleteById')
// 编辑增值服务
export const updVasOrderByIdApi = (data) => {
    return http.post('/vas/vas/vasOrder/updateById', data)
}
// 增值服务详情
export const getFullVoByOrderNoApi = createPostRequestWithQuery('/vas/vas/vasOrder/getFullVoByVasOrderNo')

// 获取增值服务打印数据
export const getPrintVasOrderDataApi = (data) => {
    return http.post('/vas/vas/vasOrder/printVasOrderData', data)
}
// 取消增值服务
export const toCancelledApi = (body, query) => {
    return http.post('/vas/vas/vasOrder/toCancelled', body, { params: query })
}
// 强制完成
export const toForceCompleteApi = createPostRequestWithQuery('/vas/vas/vasOrder/toForceComplete')
// 增值服务状态枚举
export const getVasOrderStatusEnumApi = () => {
    return http.post('/vas/vas/vasOrder/statusEnum')
}
// 增值服务类型枚举
export const getVasOrderRelatedBizTypeEnumApi = () => {
    return http.post('/vas/vas/vasOrder/relatedBizTypeEnum')
}

// 服务费用类型枚举
export const getVasOrderFeeTypeEnumApi = () => {
    return http.post('/vas/vas/vasOrder/feeTypeEnum')
}
// 服务费用创建方式枚举
export const getVasOrderFeeCreateTypeEnumApi = () => {
    return http.post('/finance/receivables/receivableFee/receivableFeeCreateWayEnum')
}

// 服务类型单位枚举
export const getVasServiceTypeUnitEnumApi = () => {
    return http.post('/vas/vas/vasServiceType/unitEnum')
}

// 估算费用
export const calculateFeeApi = (data) => {
    return http.post('/vas/vas/vasOrder/calculateFee', data)
}