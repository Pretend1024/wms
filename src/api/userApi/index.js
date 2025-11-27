import http from '@/utils/request/request'

// 用户登录
// export const loginApi = (data) => {
//     return http.post('/sys/user/passport/loginByPwd', {
//         ...data,
//     })
// }
// 获取用户信息
export const getUserInfoApi = () => {
    return http.post('/sys/user/user/getPersonal')
}
// 更改用户信息
export const updateUserInfoApi = (data) => {
    return http.post('/sys/user/user/updatePersonal', { ...data }, { headers: { 'loading': true } })
}
// 修改密码
export const updateUserPasswordApi = (data) => {
    return http.post('/sys/user/user/updatePasswordByPassword', { ...data }, { headers: { 'loading': true } })
}
// 获取未读消息条数
export const getNewMessageCountApi = () => {
    return http.post('/sys/msg/messageNotices/newMessageCount')
}
// 获取消息类型
export const getNewMessageTypeEnumApi = () => {
    return http.post('/sys/msg/messageContent/typeEnum')
}
// 获取消息通知
export const getMessageNoticesApi = (data) => {
    return http.post('/sys/msg/messageNotices/page', { ...data })
}
// 已读消息通知
export const getBatchReadApi = (data) => {
    return http.post('/sys/msg/messageNotices/batchRead', { ...data })
}
// 已读消息通知
export const getBatchReadByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/msg/messageNotices/readById?${queryString}`
        : '/sys/msg/messageNotices/readById';

    return http.post(url);
};
// 删除消息通知
export const delMessageNoticesDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/msg/messageNotices/deleteById?${queryString}`
        : '/sys/msg/messageNotices/deleteById';

    return http.post(url);
};

// 获取我的下载
export const getExportJobListApi = (data) => {
    return http.post('/sys/job/exportJob/page', { ...data })
}
// 获取我的下载状态
export const getStatusEnumApi = () => {
    return http.post('/sys/job/exportJob/statusEnum')
}
// 获取我的下载类型
export const getTypeEnumApi = () => {
    return http.post('/sys/job/exportJob/typeEnum')
}
