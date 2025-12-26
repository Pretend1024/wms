import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery';

// 获取权限菜单
export const getUserRoleMenuApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/roleMenu/listRoleMenu?${queryString}`
        : '/sys/user/roleMenu/listRoleMenu';

    return http.post(url);
}
// 获取系统菜单
export const getSettingMenuApi = (data) => {
    return http.post('/sys/setting/menu/listTree', { ...data })
}
// 获取系统菜单类型枚举
export const getMenuTypeEnumApi = () => {
    return http.post('/sys/setting/menu/menuTypeEnum')
}
// 获取系统菜单登录端枚举
export const getLoginTerminalEnumApi = () => {
    return http.post('/sys/setting/menu/loginTerminalEnum')
}
// 添加系统菜单
export const addSettingMenuApi = (data) => {
    return http.post('/sys/setting/menu/add', { ...data }, { headers: { 'loading': true } })
}
// 修改系统菜单
export const updSettingMenuByIdApi = (data) => {
    return http.post('/sys/setting/menu/updateById', { ...data }, { headers: { 'loading': true } })
}



// 获取登录日志
export const getLoginLogApi = (data) => {
    return http.post('/sys/log/loginLog/page', { ...data })
}
// 获取操作日志
export const getPpLogListApi = (data) => {
    return http.post('/sys/log/opLog/page', { ...data })
}
// 获取操作日志类型枚举
export const getObjTypeEnumApi = () => {
    return http.post('/sys/log/opLog/objTypeEnum')
}

// 获取导入列表
export const getImportJobListApi = (data) => {
    return http.post('/sys/job/importJob/page', { ...data })
}
// 获取导入类型
export const getImportJobTypeEnumApi = () => {
    return http.post('/sys/job/importJob/typeEnum')
}
// 获取导入状态
export const getImportJobStatusEnumApi = () => {
    return http.post('/sys/job/importJob/statusEnum')
}
// 关闭导入任务
export const importJobCloseByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/job/importJob/closeById?${queryString}`
        : '/sys/job/importJob/closeById';

    return http.post(url);
}

// 获取导出列表
export const getExportJobListApi = (data) => {
    return http.post('/sys/job/exportJob/page', { ...data })
}
// 获取导出类型
export const getExportJobTypeEnumApi = () => {
    return http.post('/sys/job/exportJob/typeEnum')
}
// 获取导出状态
export const getExportJobStatusEnumApi = () => {
    return http.post('/sys/job/exportJob/statusEnum')
}
// 关闭导出任务
export const exportJobCloseByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/job/exportJob/closeById?${queryString}`
        : '/sys/job/exportJob/closeById';

    return http.post(url);
}

// 获取全局配置
export const getGlobalConfigApi = () => {
    return http.post('/sys/setting/globalConfig/list')
}
// 保存全局配置
export const setGlobalConfigApi = (data) => {
    return http.post('/sys/setting/globalConfig/set', { ...data }, { headers: { 'loading': true } })
}


// APP版本
// 新增版本
export const addSysAppApi = (data) => {
    return http.post('/sys/setting/sysApp/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑版本
export const updSysAppByIdApi = (data) => {
    return http.post('/sys/setting/sysApp/updateById', { ...data }, { headers: { 'loading': true } })
}
// 获取版本列表
export const getSysAppListApi = (data) => {
    return http.post('/sys/setting/sysApp/page', { ...data })
}
// 删除版本
export const delSysAppByIdApi = createPostRequestWithQuery('/sys/setting/sysApp/deleteById')

// 版本类型枚举
export const getSysAppTypeEnumApi = () => {
    return http.post('/sys/setting/sysApp/sysAppTypeEnum')
}

