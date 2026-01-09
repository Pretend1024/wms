import http from '@/utils/request/request'

// -------------------------------用户角色权限
// 获取权限菜单
export const getUserRoleMenuApi = (queryParams) => {
    return http.post('/sys/user/roleMenu/listRoleMenu', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}
// 保存用户权限
export const setUserRoleMenuApi = (data) => {
    return http.post('/sys/user/roleMenu/setRoleMenu', { ...data }, {
        headers: { 'loading': true }
    })
}
// 获取角色列表
export const getUserRoleListApi = (data) => {
    return http.post('/sys/user/role/page', { ...data })
}
// 获取角色下拉列表
export const getUserRoleApi = (data) => {
    return http.post('/sys/user/role/list', { ...data })
}
// 添加角色
export const addUserRoleDataApi = (data) => {
    return http.post('/sys/user/role/add', { ...data }, { headers: { 'loading': true } })
}
// 修改角色
export const updateUserRoleDataApi = (data) => {
    return http.post('/sys/user/role/updateById', { ...data }, { headers: { 'loading': true } })
}
// 删除角色
export const delUserRoleDataApi = (queryParams) => {
    return http.post('/sys/user/role/deleteById', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}

// -------------------------------用户管理
// 获取用户列表
export const getUserUserListApi = (data) => {
    return http.post('/sys/user/user/page', { ...data })
}
// 获取用户已分配角色
export const getUserListUserRoleApi = (queryParams) => {
    return http.post('/sys/user/userRole/listUserRole', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}
// 保存用户角色
export const setUserUserRoleApi = (data) => {
    return http.post('/sys/user/userRole/setUserRole', { ...data }, {
        headers: { 'loading': true }
    })
}
// 锁定用户
export const setUserUserLockApi = (data) => {
    return http.post('/sys/user/user/lock', { ...data }, {
        headers: { 'loading': true }
    })
}
// 解锁用户
export const setUserUserUnLockApi = (data) => {
    return http.post('/sys/user/user/unLock', { ...data }, {
        headers: { 'loading': true }
    })
}
// 管理员修改用户密码
export const updatePasswordByAdminApi = (data) => {
    return http.post('/sys/user/user/updatePasswordByAdmin', { ...data }, { headers: { 'loading': true } })
}
// 查看用户密码
export const lookPasswordApi = (queryParams) => {
    return http.post('/sys/user/user/lookPassword', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}
// 获取用户状态枚举
export const getUserStatusEnumApi = () => {
    return http.post('/sys/user/user/statusEnum')
}
// 获取用户类型枚举
export const getUserTypeEnumApi = () => {
    return http.post('/sys/user/user/typeEnum')
}
// 获取执行人列表
export const getUserOperatorUserListApi = (data) => {
    return http.post('/sys/user/user/listOperatorUser', { ...data })
}

// -------------------------------在线用户
// 获取在线用户列表
export const getOnlineUserListApi = () => {
    return http.post('/sys/user/passport/onlineUser')
}
// 强制用户下线
export const forceLogoutApi = (queryParams) => {
    return http.post('/sys/user/passport/forceLogout', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}

// -------------------------------消息通知
// 获取消息通知列表
export const getMessageContentPageListApi = (data) => {
    return http.post('/sys/msg/messageContent/page', { ...data })
}
// 获取消息通知详情
export const getMessageContentByIdApi = (queryParams) => {
    return http.post('/sys/msg/messageContent/getById', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}
// 获取消息类型枚举
export const getMessageContentTypeEnumApi = () => {
    return http.post('/sys/msg/messageContent/typeEnum')
}
// 获取消息通知范围枚举
export const getMessageContentNotifyScopeEnumApi = () => {
    return http.post('/sys/msg/messageContent/notifyScopeEnum')
}
// 获取消息提醒类型枚举
export const getMessageContentNotifyWayEnumApi = () => {
    return http.post('/sys/msg/messageContent/notifyWayEnum')
}
// 添加消息通知
export const addMessageContentApi = (data) => {
    return http.post('/sys/msg/messageContent/add', { ...data }, { headers: { 'loading': true } })
}
// 删除消息通知
export const delMessageContentApi = (queryParams) => {
    return http.post('/sys/msg/messageContent/deleteById', {}, {
        params: queryParams,
        headers: { 'loading': true }
    })
}

// -------------------------------定时任务
// 获取定时任务列表
export const getScheduleJobListApi = (data) => {
    return http.post('/sys/job/scheduleJob/page', { ...data })
}
// 获取任务分组枚举
export const getScheduleJobGroupEnumApi = () => {
    return http.post('/sys/job/scheduleJob/groupEnum')
}
// 获取任务状态枚举
export const getScheduleJobStatusEnumApi = () => {
    return http.post('/sys/job/scheduleJob/statusEnum')
}
// 添加定时任务
export const addScheduleJobApi = (data) => {
    return http.post('/sys/job/scheduleJob/add', { ...data }, { headers: { 'loading': true } })
}
// 编辑定时任务
export const updateScheduleJobApi = (data) => {
    return http.post('/sys/job/scheduleJob/updateById', { ...data }, { headers: { 'loading': true } })
}

// -------------------------------用户个性化设置
// 保存用户个性化设置
export const setUserUserConfigApi = (data) => {
    return http.post('/sys/user/userConfig/set', { ...data }, {
        headers: { 'loading': true }
    })
}
// 获取用户个性化设置
export const getUserUserConfigApi = (data) => {
    return http.post('/sys/user/userConfig/get', { ...data })
}