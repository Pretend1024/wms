import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'
// ------------------------------------------------------------承运商服务商
// 获取服务商
export const getProductSupplierApi = (data) => {
    return http.post('/product/shipway/supplier/page', data)
}
// 获取服务商列表
export const getProductSupplierListApi = (data) => {
    return http.post('/product/shipway/supplier/list', data)
}
// 新增服务商
export const addProductSupplierApi = (data) => {
    return http.post('/product/shipway/supplier/add', data, { headers: { 'loading': true } })
}
// 编辑服务商
export const updProductSupplierApi = (data) => {
    return http.post('/product/shipway/supplier/updateById', data, { headers: { 'loading': true } })
}
// 获取服务商状态枚举
export const getProductSupplierStatusEnumApi = () => {
    return http.post('/product/shipway/supplier/statusEnum')
}
// 获取服务商类型枚举
export const getProductSupplierTypeEnumApi = () => {
    return http.post('/product/shipway/supplier/typeEnum')
}
// 获取服务商详情
export const getProductSupplierInfoApi = createPostRequestWithQuery('/product/shipway/supplier/getVoById')

// 获取账号状态枚举
export const getProductSupplierAccountStatusEnumApi = () => {
    return http.post('/product/shipway/supplierAccount/statusEnum')
}
// 获取api枚举
export const getProductSupplierAccountApiEnumApi = () => {
    return http.post('/product/shipway/supplier/apiEnum')
}

// 获取服务商账号列表
export const getProductSupplierAccountListApi = createPostRequestWithQuery('/product/shipway/supplierAccount/listBySupplierId')

// 获取服务商渠道列表
export const getProductSupplierChannelListApi = createPostRequestWithQuery('/product/shipway/supplierChannel/listBySupplierId')

// 修改服务商账号
export const updProductSupplierAccountApi = (data) => {
    return http.post('/product/shipway/supplierAccount/addOrUpd', data, { headers: { 'loading': true } })
}
// 修改服务商渠道
export const updProductSupplierChannelApi = (data) => {
    return http.post('/product/shipway/supplierChannel/addOrUpd', data, { headers: { 'loading': true } })
}
// api获取json
export const getProductSupplierApiJsonApi = createPostRequestWithQuery('/product/shipway/supplier/apiConfigTemplate')


// -------------------------------------------------------------------物流产品
// 获取物流产品
export const getProductShipwayPageApi = (data) => {
    return http.post('/product/shipway/shipway/page', data)
}
// 获取物流产品列表
export const getProductShipwayListApi = (data) => {
    return http.post('/product/shipway/shipway/list', { ...data })
}
// 新增物流产品
export const addProductShipwayApi = (data) => {
    return http.post('/product/shipway/shipway/add', data, { headers: { 'loading': true } })
}
// 获取物流产品详情
export const getProductShipwayInfoApi = createPostRequestWithQuery('/product/shipway/shipway/getVoById')
// 获取物流产品渠道列表
export const getProductShipwayChannelListApi = createPostRequestWithQuery('/product/shipway/shipwayChannel/listByShipwayId')
// 获取物流产品状态枚举
export const getProductShipwayStatusEnumApi = () => {
    return http.post('/product/shipway/shipway/statusEnum')
}
// 获取渠道模式枚举
export const getProductShipwayChannelSelectEnumApi = () => {
    return http.post('/product/shipway/shipway/channelSelectEnum')
}
// 获取物流产品类型枚举
export const getProductShipwayTypeEnumApi = () => {
    return http.post('/product/shipway/shipway/typeEnum')
}
// 保险服务枚举
export const getProductShipwayInsuranceEnumApi = () => {
    return http.post('/product/shipway/shipway/insuranceEnum')
}
// 签名服务枚举
export const getProductShipwaySignatureEnumApi = () => {
    return http.post('/product/shipway/shipway/signatureEnum')
}
// 上传面单枚举
export const getProductShipwayUploadWaybillEnumApi = () => {
    return http.post('/product/shipway/shipway/uploadWaybillEnum')
}
// 编辑物流产品
export const updProductShipwayApi = (data) => {
    return http.post('/product/shipway/shipway/updateById', data, { headers: { 'loading': true } })
}
// 删除物流产品
export const setProductShipwayShipwayUpdateStatusApi = createPostRequestWithQuery('/product/shipway/shipway/updateStatus')


// -------------------------------------------------------------承运商
// 获取承运商
export const getProductShipwayBrandPageApi = (data) => {
    return http.post('/product/shipway/carrier/page', data)
}
// 获取承运商列表
export const getProductShipwayBrandListApi = (data) => {
    return http.post('/product/shipway/carrier/list', data)
}
// 承运商状态枚举
export const getProductShipwayBrandStatusEnumApi = () => {
    return http.post('/product/shipway/carrier/statusEnum')
}
// 新增承运商
export const addProductShipwayBrandApi = (data) => {
    return http.post('/product/shipway/carrier/add', data)
}
// 获取承运商详情
export const getProductShipwayBrandInfoApi = createPostRequestWithQuery('/product/shipway/carrier/getVoById')
// 编辑承运商
export const updProductShipwayBrandApi = (data) => {
    return http.post('/product/shipway/carrier/updateById', data, { headers: { 'loading': true } })
}
// 更新承运商状态
export const setProductShipwayCarrierUpdateStatusApi = createPostRequestWithQuery('/product/shipway/carrier/updateStatus')

// 获取承运商服务
export const getProductShipwayListByCarrierIdApi = createPostRequestWithQuery('/product/shipway/carrierService/listByCarrierId')
// 根据承运商/服务商获取承运商服务
export const getProductShipwayListByShipwayIdApi = createPostRequestWithQuery('/product/shipway/supplierChannel/listByCarrierCode')

// -------------------------------------------------------------分区
// 获取分区
export const getProductShipwayRegionProjectApi = (data) => {
    return http.post('/product/price/regionProject/page', data)
}
// 添加分区
export const addProductShipwayRegionProjectApi = (data) => {
    return http.post('/product/price/regionProject/add', data, { headers: { 'loading': true } })
}
// 分区类型枚举
export const getProductShipwayRegionProjectTypeEnumApi = () => {
    return http.post('/product/price/regionProject/typeEnum')
}
// 编辑分区
export const updProductShipwayRegionProjectApi = (data) => {
    return http.post('/product/price/regionProject/updateById', data, { headers: { 'loading': true } })
}

// 获取分区号
export const getProductShipwayRegionProjectIdApi = createPostRequestWithQuery('/product/price/region/listByRegionProjectId')

// 添加分区号
export const addProductShipwayRegionApi = (data) => {
    return http.post('/product/price/region/add', data, { headers: { 'loading': true } })
}

// 删除分区
export const delProductShipwayRegionApi = createPostRequestWithQuery('/product/price/region/deleteById')

// 获取分区明细
export const getProductShipwayRegionInfoApi = (data) => {
    return http.post('/product/price/regionDetail/page', data)
}
// 添加分区明细
export const addProductShipwayRegionDetailApi = (data) => {
    return http.post('/product/price/regionDetail/add', data, { headers: { 'loading': true } })
}

// 明细规则枚举
export const getProductShipwayRegionDetailRuleEnumApi = () => {
    return http.post('/product/price/regionDetail/ruleEnum')
}
// 编辑分区明细
export const updProductShipwayRegionDetailApi = (data) => {
    return http.post('/product/price/regionDetail/updateById', data, { headers: { 'loading': true } })
}
// 删除明细
export const delProductShipwayRegionDetailApi = createPostRequestWithQuery('/product/price/regionDetail/deleteById')


// -------------------------------------------------------------偏远库
// 获取偏远库
export const getProductShipwayRemoteApi = (data) => {
    return http.post('/product/price/remote/page', data)
}
// 添加偏远库
export const addProductShipwayRemoteApi = (data) => {
    return http.post('/product/price/remote/add', data, { headers: { 'loading': true } })
}
// 编辑偏远库
export const updProductShipwayRemoteApi = (data) => {
    return http.post('/product/price/remote/updateById', data, { headers: { 'loading': true } })
}

// 获取偏远库明细
export const getProductShipwayRemoteDetailApi = (data) => {
    return http.post('/product/price/remoteDetail/page', data)
}
// export const getProductShipwayRemoteDetailApi = createPostRequestWithQuery('/product/price/remoteDetail/getById')


// 添加偏远库明细
export const addProductShipwayRemoteDetailApi = (data) => {
    return http.post('/product/price/remoteDetail/add', data, { headers: { 'loading': true } })
}
// 编辑偏远库明细
export const updProductShipwayRemoteDetailApi = (data) => {
    return http.post('/product/price/remoteDetail/updateById', data, { headers: { 'loading': true } })
}
// 删除偏远库明细
export const delProductShipwayRemoteDetailApi = createPostRequestWithQuery('/product/price/remoteDetail/deleteById')
// 获取偏远库明细规则枚举
export const getProductShipwayRemoteDetailRuleEnumApi = () => {
    return http.post('/product/price/remoteDetail/ruleEnum')
}
// 获取偏远库类型枚举
export const getProductShipwayRemoteTypeEnumApi = () => {
    return http.post('/product/price/remoteDetail/typeEnum')
}
// 偏远库测试
export const getProductShipwayRemoteSearchApi = (data) => {
    return http.post('/product/price/remoteDetail/search', data)
}
// 分区模板测试
export const getProductShipwayRegionProjectSearchApi = (data) => {
    return http.post('/product/price/regionProject/search', data)
}


// -------------------------------------------------------------燃油模板
// 获取燃油模板
export const getProductShipwayFuelApi = (data) => {
    return http.post('/product/price/fuel/page', data)
}
// 添加燃油模板
export const addProductShipwayFuelApi = (data) => {
    return http.post('/product/price/fuel/add', data, { headers: { 'loading': true } })
}
// 编辑燃油模板
export const updProductShipwayFuelApi = (data) => {
    return http.post('/product/price/fuel/updateById', data, { headers: { 'loading': true } })
}
// 获取燃油模板明细
export const getProductShipwayFuelDetailApi = createPostRequestWithQuery('/product/price/fuelDetail/listByFuelId')

// 删除燃油模板
export const delProductShipwayFuelApi = createPostRequestWithQuery('/product/price/fuel/deleteById')


// -------------------------------------------------------------回邮地址
// 获取回邮地址
export const getProductShipwayPostApi = (data) => {
    return http.post('/product/shipway/shipwaySender/page', data)
}
// 添加回邮地址
export const addProductShipwayPostApi = (data) => {
    return http.post('/product/shipway/shipwaySender/add', data, { headers: { 'loading': true } })
}
// 编辑回邮地址
export const updProductShipwayPostApi = (data) => {
    return http.post('/product/shipway/shipwaySender/updateById', data, { headers: { 'loading': true } })
}
// 删除回邮地址
export const delProductShipwayPostApi = createPostRequestWithQuery('/product/shipway/shipwaySender/deleteById')

// 获取配置类型
export const getProductShipwayConfigTypeEnumApi = () => {
    return http.post('/product/shipway/shipwaySender/configTypeEnum')
}


// -------------------------------------------------------------轨迹状态配置

// 获取轨迹配置
export const getBasicTraceStatusPageApi = (data) => {
    return http.post('/product/shipway/traceStatus/page', { ...data })
}
// 添加轨迹配置
export const addBasicTraceStatusApi = (data) => {
    return http.post('/product/shipway/traceStatus/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑轨迹配置
export const updBasicTraceStatusApi = (data) => {
    return http.post('/product/shipway/traceStatus/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除轨迹配置
export const delBasicTraceStatusApi = createPostRequestWithQuery('/product/shipway/traceStatus/deleteById')
// 获取轨迹配置详情
export const getBasicTraceStatusByIdApi = createPostRequestWithQuery('/product/shipway/traceStatus/getById')
// 轨迹配置条件枚举
export const getBasicTraceStatusConditionTypeEnumApi = () => {
    return http.post('/product/shipway/traceStatus/conditionTypeEnum')
}
// 轨迹配置条件枚举
export const getBasicTraceStatusLogicTypeEnumApi = () => {
    return http.post('/product/shipway/traceStatus/logicTypeEnum')
}
// 轨迹刷新
export const getBasicTraceStatusRefreshCacheApi = () => {
    return http.post('/product/shipway/traceStatus/refreshCache')
}