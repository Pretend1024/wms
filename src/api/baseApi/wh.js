import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'
// ------------------------------------------------------------仓库-----------------------------------------------------
// 获取仓库列表
export const getWhWarehouseListApi = (data) => {
    return http.post('/base/wh/warehouse/page', { ...data })
}
// 添加仓库
export const addWhWarehouseApi = (data) => {
    return http.post('/base/wh/warehouse/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑仓库
export const updWhWarehouseApi = (data) => {
    return http.post('/base/wh/warehouse/updateById', { ...data }, { headers: { 'loading': true } })
}

// 获取仓库类型枚举
export const getWhWarehouseTypeEnumApi = (data) => {
    return http.post('/base/wh/warehouse/typeEnum', { ...data })
}
// 获取货型
export const getWhWarehouseCargoSizeEnumApi = (data) => {
    return http.post('/base/wh/warehouse/cargoSizeEnum', { ...data })
}
// 获取仓库状态枚举
export const getWhWarehouseStatusEnumApi = (data) => {
    return http.post('/base/wh/warehouse/statusEnum', { ...data })
}
// 获取国家地区列表
export const getWhCountryListApi = (data) => {
    return http.post('/base/basic/country/list', { ...data })
}
// 获取时区列表
export const getWhTimezoneListApi = () => {
    return http.post('base/wh/warehouse/timeZoneEnum')
}

// ------------------------------------------------------------库区-----------------------------------------------------
// 获取库区列表
export const getWhZoneListApi = (data) => {
    return http.post('/base/wh/zone/page', { ...data })
}
// 获取仓库
export const getWhWarehouseApi = (data) => {
    return http.post('/base/wh/warehouse/list', { ...data })
}
// 获取类型
export const getWhZoneTypeEnumApi = (data) => {
    return http.post('/base/wh/zone/typeEnum', { ...data })
}
// 添加库区
export const addWhZoneApi = (data) => {
    return http.post('/base/wh/zone/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑库区
export const updWhZoneApi = (data) => {
    return http.post('/base/wh/zone/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除库区
export const delWhZoneApi = createPostRequestWithQuery('/base/wh/zone/deleteById')

// -----------------------------------------------------------库位类型---------------------------------------------------
// 获取库位类型列表
export const getWhLocationSizeTypeListApi = (data) => {
    return http.post('/base/wh/locationSizeType/page', { ...data })
}
// 新增库位类型
export const addWhLocationSizeTypeApi = (data) => {
    return http.post('/base/wh/locationSizeType/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑库位类型
export const updWhLocationSizeTypeApi = (data) => {
    return http.post('/base/wh/locationSizeType/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除库位类型
export const delWhLocationSizeTypeApi = createPostRequestWithQuery('/base/wh/locationSizeType/deleteById')

// -----------------------------------------------------------库位---------------------------------------------------
// 获取库位
export const getWhLocationListApi = (data) => {
    return http.post('/base/wh/location/page', { ...data })
}
// 新增库位
export const addWhLocationApi = (data) => {
    return http.post('/base/wh/location/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑库位
export const updWhLocationApi = (data) => {
    return http.post('/base/wh/location/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除库位
export const delWhLocationApi = createPostRequestWithQuery('/base/wh/location/deleteById')

// 获取库区枚举
export const getWhZoneEnumApi = (data) => {
    return http.post('/base/wh/zone/list', { ...data })
}
// 获取库位类型枚举
export const getWhLocationSizeTypeEnumApi = () => {
    return http.post('/base/wh/locationSizeType/list')
}
// 获取库位状态枚举
export const getWhLocationStatusEnumApi = () => {
    return http.post('/base/wh/location/statusEnum')
}
// 获取库位饱和度枚举
export const getWhLocationSaturationEnumApi = () => {
    return http.post('/base/wh/location/saturationEnum')
}

// -----------------------------------------------------------月台---------------------------------------------------
// 获取月台
export const getWhPlatformListApi = (data) => {
    return http.post('/base/wh/platform/page', { ...data })
}
// 添加月台
export const addWhPlatformApi = (data) => {
    return http.post('/base/wh/platform/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑月台
export const updWhPlatformApi = (data) => {
    return http.post('/base/wh/platform/updateById', { ...data }, { headers: { 'loading': true } })
}
// 月台状态
export const getWhPlatformStatusEnumApi = () => {
    return http.post('/base/wh/platform/statusEnum')
}
// 月台预约情况
export const getWhPlatformAppointmentApi = (data) => {
    return http.post('/base/wh/platformTimeslot/list', { ...data })
}
// 更新月台状态
export const updWhPlatformStatusApi = createPostRequestWithQuery('/base/wh/platform/updateStatus')

// 月台下拉数据
export const getWhPlatformSelectApi = createPostRequestWithQuery('/base/wh/platform/listByWarehouseIdAndDate')
// 月台预约详情
export const getWhPlatformAppointmentDetailApi = createPostRequestWithQuery('/instock/appointment/inAppointment/getByAppointmentNo')