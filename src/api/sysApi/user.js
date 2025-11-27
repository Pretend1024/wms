import http from '@/utils/request/request'

// 获取权限菜单
export const getUserRoleMenuApi = (queryParams) => {
    // return http.post('/sys/user/roleMenu/listRoleMenu')
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/roleMenu/listRoleMenu?${queryString}`
        : '/sys/user/roleMenu/listRoleMenu';

    return http.post(url);
}
// 保存用户权限
export const setUserRoleMenuApi = (data) => {
    return http.post('/sys/user/roleMenu/setRoleMenu', { ...data })
}
// 获取角色
export const getUserRoleListApi = (data) => {
    return http.post('/sys/user/role/page', { ...data })
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
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/role/deleteById?${queryString}`
        : '/sys/user/role/deleteById';

    return http.post(url);
};




// 获取用户
export const getUserUserListApi = (data) => {
    return http.post('/sys/user/user/page', { ...data })
}
// 获取用户角色
export const getUserListUserRoleApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/userRole/listUserRole?${queryString}`
        : '/sys/user/userRole/listUserRole';

    return http.post(url);
}
export const getUserRoleApi = (data) => {
    return http.post('sys/user/role/list', { ...data })
}
// 保存用户角色
export const setUserUserRoleApi = (data) => {
    return http.post('/sys/user/userRole/setUserRole', { ...data })
}
// 锁定
export const setUserUserLockApi = (data) => {
    return http.post('/sys/user/user/lock', { ...data })
}
// 解锁
export const setUserUserUnLockApi = (data) => {
    return http.post('/sys/user/user/unLock', { ...data })
}
// 管理员修改密码
export const updatePasswordByAdminApi = (data) => {
    return http.post('/sys/user/user/updatePasswordByAdmin', { ...data }, { headers: { 'loading': true } })
}

// 查看密码
export const lookPasswordApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/user/lookPassword?${queryString}`
        : '/sys/user/user/lookPassword';

    return http.post(url);
};
// 获取用户状态菜单
export const getUserStatusEnumApi = () => {
    return http.post('/sys/user/user/statusEnum')
}
// 获取用户类型菜单
export const getUserTypeEnumApi = () => {
    return http.post('/sys/user/user/typeEnum')
}


// 获取在线用户
export const getOnlineUserListApi = () => {
    return http.post('/sys/user/passport/onlineUser')
}
// 强制下线
export const forceLogoutApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/user/passport/forceLogout?${queryString}`
        : '/sys/user/passport/forceLogout';

    return http.post(url);
};


// 获取消息通知
export const getMessageContentPageListApi = (data) => {
    return http.post('/sys/msg/messageContent/page', { ...data })
}
export const getMessageContentByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/msg/messageContent/getById?${queryString}`
        : '/sys/msg/messageContent/getById';

    return http.post(url);
}
// 获取消息类型
export const getMessageContentTypeEnumApi = () => {
    return http.post('/sys/msg/messageContent/typeEnum')
}
// 获取消息通知范围
export const getMessageContentNotifyScopeEnumApi = () => {
    return http.post('/sys/msg/messageContent/notifyScopeEnum')
}
// 获取消息提醒类型
export const getMessageContentNotifyWayEnumApi = () => {
    return http.post('/sys/msg/messageContent/notifyWayEnum')
}
// 添加消息通知
export const addMessageContentApi = (data) => {
    return http.post('/sys/msg/messageContent/add', { ...data }, { headers: { 'loading': true } })
}
// 删除消息通知
export const delMessageContentApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/sys/msg/messageContent/deleteById?${queryString}`
        : '/sys/msg/messageContent/deleteById';

    return http.post(url);
}

// 获取定时任务
export const getScheduleJobListApi = (data) => {
    return http.post('/sys/job/scheduleJob/page', { ...data })
}
// 获取任务分组
export const getScheduleJobGroupEnumApi = () => {
    return http.post('/sys/job/scheduleJob/groupEnum')
}
// 获取任务状态
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

// 保存用户个性化设置
export const setUserUserConfigApi = (data) => {
    return http.post('/sys/user/userConfig/set', { ...data })
}
// 获取用户个性化设置
export const getUserUserConfigApi = (data) => {
    return http.post('/sys/user/userConfig/get', { ...data })
}

// 获取执行人
export const getUserOperatorUserListApi = (data) => {
    return http.post('/sys/user/user/listOperatorUser', { ...data })
}