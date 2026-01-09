import http from '@/utils/request/request'

// -------------------------------个人信息管理
// 获取当前用户个人信息
export const getUserInfoApi = () => {
    return http.post('/sys/user/user/getPersonal')
}
// 更改当前用户个人信息
export const updateUserInfoApi = (data) => {
    return http.post('/sys/user/user/updatePersonal', { ...data }, { headers: { 'loading': true } })
}
// 修改当前用户密码
export const updateUserPasswordApi = (data) => {
    return http.post('/sys/user/user/updatePasswordByPassword', { ...data }, { headers: { 'loading': true } })
}

// -------------------------------消息通知
// 获取未读消息条数
export const getNewMessageCountApi = () => {
    return http.post('/sys/msg/messageNotices/newMessageCount', { headers: { 'loading': true } })
}
// 获取消息类型枚举
export const getNewMessageTypeEnumApi = () => {
    return http.post('/sys/msg/messageContent/typeEnum')
}
// 获取消息通知列表
export const getMessageNoticesApi = (data) => {
    return http.post('/sys/msg/messageNotices/page', { ...data })
}
// 批量标记消息为已读
export const getBatchReadApi = (data) => {
    return http.post('/sys/msg/messageNotices/batchRead', { ...data }, {
        headers: { 'loading': true }
    })
}
// 单条标记消息为已读
export const getBatchReadByIdApi = (queryParams) => {
    return http.post('/sys/msg/messageNotices/readById', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}
// 删除消息通知
export const delMessageNoticesDataApi = (queryParams) => {
    return http.post('/sys/msg/messageNotices/deleteById', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}

// -------------------------------我的下载
// 获取我的下载任务列表
export const getExportJobListApi = (data) => {
    return http.post('/sys/job/exportJob/page', { ...data })
}
// 获取我的下载任务状态枚举
export const getStatusEnumApi = () => {
    return http.post('/sys/job/exportJob/statusEnum')
}
// 获取我的下载任务类型枚举
export const getTypeEnumApi = () => {
    return http.post('/sys/job/exportJob/typeEnum')
}