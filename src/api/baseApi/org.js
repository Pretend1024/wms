import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'
// ---------------------------------------------------------岗位
// 获取岗位信息
export const getPositionListApi = (data) => {
    return http.post('/base/org/position/page', { ...data })
}
// 添加岗位
export const addPositionDataApi = (data) => {
    return http.post('/base/org/position/add', { ...data }, { headers: { 'loading': true } })
}
// 删除岗位
export const delPositionDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/org/position/deleteById?${queryString}`
        : '/base/org/position/deleteById';

    return http.post(url);
};
// 修改岗位
export const updatePositionDataApi = (data) => {
    return http.post('/base/org/position/updateById', { ...data }, { headers: { 'loading': true } })
}

// ----------------------------------------------------------------公司/部门
// 获取公司部门信息
export const getOrganizationListApi = (data) => {
    return http.post('/base/org/organization/listTree', { ...data })
}
// 获取部门信息选项
export const getOrganizationTypeEnumApi = () => {
    return http.post('/base/org/organization/typeEnum')
}
// 添加公司部门信息
export const addOrganizationDataApi = (data) => {
    return http.post('/base/org/organization/add', { ...data }, { headers: { 'loading': true } })
}
// 修改公司部门信息
export const updateOrganizationDataApi = (data) => {
    return http.post('/base/org/organization/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除公司部门信息
export const delOrganizationDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/org/organization/deleteById?${queryString}`
        : '/base/org/organization/deleteById';

    return http.post(url);
};
// ---------------------------------------------------------员工
// 获取员工状态
export const getStatusEnumApi = () => {
    return http.post('base/org/employee/statusEnum')
}
// 修改员工信息
export const updEmployeeDataApi = (data) => {
    return http.post('/base/org/employee/updateById', { ...data }, { headers: { 'loading': true } })
}
// 获取员工
export const getOrgEmployeeListApi = (data) => {
    return http.post('/base/org/employee/page', { ...data })
}
export const getOrgEmployeeByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/org/employee/getById?${queryString}`
        : '/base/org/employee/getById';

    return http.post(url);
}
// 权限范围枚举
export const getUserDataPermScopeEnumApi = () => {
    return http.post('/sys/user/userDataPerm/scopeEnum')
}
// 获取民族
export const getOrgNationListApi = () => {
    return http.post('/base/org/nation/page', {})
}
// 获取国家
export const getOrgCountryListApi = () => {
    return http.post('/base/basic/country/list', {})
}
// 获取状态
export const getOrgStatusEnumApi = () => {
    return http.post('/base/org/employee/statusEnum')
}
// 获取公司
export const getOrgListCompanyApi = () => {
    return http.post('/base/org/organization/listCompany')
}
// 获取部门
export const getOrgListDepartmentApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/org/organization/listDepartmentByParentId?${queryString}`
        : '/base/org/organization/listDepartmentByParentId';

    return http.post(url);
}
// 添加员工
export const addOrgEmployeeApi = (data) => {
    return http.post('/base/org/employee/add', { ...data }, { headers: { 'loading': true } })
}
// 员工离职
export const leaveOrgEmployeeApi = createPostRequestWithQuery('/base/org/employee/leaveJob')

