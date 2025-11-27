import http from '@/utils/request/request'

// 用户登录
export const loginApi = (data) => {
    return http.post('/sys/user/passport/loginByPwd', {
        ...data,
    })
}
// 用户退出
export const logoutApi = () => {
    return http.post('/sys/user/passport/logout')
}
// 判断token是否过期
export const checkTokenApi = () => {
    return http.post('/sys/user/passport/checkSession')
}
// 获取用户菜单
export const getUserMenuApi = () => {
    return http.post('/sys/user/user/listMenu')
}
// 获取语言枚举
export const getLangEnumApi = () => {
    return http.post('/sys/setting/language/langEnum')
}

// export const getCklbApi = params => http.get('/webApi/getCklb.do', {
//     params
// });
