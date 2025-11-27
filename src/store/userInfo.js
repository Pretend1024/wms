import { defineStore } from "pinia";

export const userInfoStore = defineStore('userInfoStore', () => {
    // 用户信息
    const userInfo = ref({})
    // 更新用户信息
    const updateUserInfo = (data) => {
        userInfo.value = data
    }
    // 清空数据
    const clearUserInfoData = () => {
        userInfo.value = {}
    }
    return {
        userInfo,
        updateUserInfo,
        clearUserInfoData
    }
}, {
    // 开启持久数据缓存
    persist: {
        key: 'userInfo',
        storage: localStorage,
        paths: ['userInfo']
    }
})

export default userInfoStore