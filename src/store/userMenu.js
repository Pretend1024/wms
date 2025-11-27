import { defineStore } from "pinia";
import router from "@/router";
import { transitionRouters } from '@/utils/menuAndRouter/transferRouter.js'

export const userMenuStore = defineStore('userMenuStore', () => {
    // 语言设置
    const lang = ref('zh')
    // 用户权限路由列表
    const userRoleList = ref([])
    // 用户权限菜单列表
    const userMenuList = ref([])
    // 动态添加路由
    const setUserRouter = async (roleList) => {
        try {
            if (userRoleList.value.length > 0) {
                transitionRouters(userRoleList.value, router)
            } else {
                transitionRouters(roleList, router)
            }
            // console.log(router.getRoutes(), 'router--------------------')
            return Promise.resolve('ok')
        } catch (error) {
            return Promise.reject(error)
        }
    }
    // 清空数据
    const clearMenuData = () => {
        userRoleList.value = []
        userMenuList.value = []
    }
    return {
        userRoleList,
        userMenuList,
        lang,
        setUserRouter,
        clearMenuData
    }
}, {
    // 开启持久数据缓存
    persist: {
        key: 'userMenuList',
        storage: localStorage,
        paths: ['userMenuList', 'userRoleList', 'lang']
    }
})

export default userMenuStore