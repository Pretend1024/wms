import { createApp } from 'vue'
// 引入element-plus
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// 引入中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入ArcoDesign
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
// 引入国际化
import i18n from '@/i18n'
// 引入全局方法
import { getLabel, getPlaceholder, getButtonText } from '@/utils/i18n/i18nLabels'
import { copyToClipboard } from './utils/tool/copyBtn.js'


// 引入自定义指令
import { setupPermissionDirective } from './utils/tool/buttonPermission.js'
import { setupNumberInputDirective, setupPositiveIntegerDirective } from './utils/tool/numberInputDirective.js'



import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)
import App from './App.vue'

// 引入全局样式
import '@/assets/iconFont/iconfont.css'




const app = createApp(App)
// 引入ElementPlus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 使用中文语言包
// app.use(ElementPlus, {
//     locale: zhCn,
// })

setupPermissionDirective(app, router) // 注册自定义权限指令并注入 router
setupNumberInputDirective(app) // 注册数字输入指令
setupPositiveIntegerDirective(app) // 注册正整数输入指令

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(ArcoVue);
app.use(i18n);
// 挂到 Vue 全局属性
app.config.globalProperties.getLabel = getLabel
app.config.globalProperties.getPlaceholder = getPlaceholder
app.config.globalProperties.getButtonText = getButtonText
app.config.globalProperties.copyToClipboard = copyToClipboard

app.mount('#app')


import tagsStore from '@/store/tags.js';
let useTagsStore = tagsStore();

import userMenu from '@/store/userMenu.js';
let getRoute = userMenu();

import { getRouteTitle } from '@/utils/i18n/i18nTitle.js'

// 引入路由守卫
router.beforeEach(async (to, from, next) => {
    let token = localStorage.getItem('token');
    if (!token) {
        getRoute.clearMenuData()
        localStorage.removeItem('token')
        // useTagsStore.clearTagsStore()
        if (to?.fullPath !== '/login') {
            next('/login');  // 重定向到登录页面
        } else {
            next();  // 如果是访问登录页，允许继续
        }
    } else {
        if (to.name === '欢迎') {
            to.meta.lang = getRoute.lang === 'zh' ? '欢迎' : 'Welcome';
        }
        if (to.name === '新增入库单') {
            to.meta.lang = to.params.id ? '复制入库单' : '新增入库单';
        }
        try {
            await getRoute.setUserRouter()
            if (to.fullPath !== '/login' && to.fullPath !== '/welcome') {
                // ====== 获取自定义表格 ======
                const { getUserUserConfigApi } = await import('@/api/sysApi/user.js') // 动态导入
                try {
                    const currentKey = to.fullPath
                    const res = await getUserUserConfigApi({ mapKey: currentKey, type: 'tableConfig' })

                    if (res) {
                        const config = JSON.parse(res.data.mapValue)
                        // visibleCol-xxx 隐藏列数组
                        localStorage.setItem(`visibleCol-${currentKey}`, JSON.stringify(config.hiddenCols || []))
                        // fixedCol-xxx 固定列数组
                        localStorage.setItem(`fixedCol-${currentKey}`, JSON.stringify(config.fixedCols || []))
                        // sortCol-xxx 列顺序和宽度数组
                        localStorage.setItem(`sortCol-${currentKey}`, JSON.stringify(config.sortCols || []))
                    }
                } catch (err) {
                    // console.log('未上传配置')
                }
            }
            next();
        } catch (e) {
            next(false);  // 中断当前导航
        }
    }
});

// router.afterEach(async (to, from) => {
//     // console.log(to, from)
//     if (to.path !== '/login' && to.name) {
//         let isPathExists = useTagsStore.tagsStore.some(item => item.path === to.path);
//         const title = to.meta.lang + (to.params.name ? `-${to.params.name}` : '') + (to.params.typeName ? `-${to.params.typeName}` : '')
//         if (!isPathExists) {
//             let path = {
//                 name: title,  // 使用路由的 name
//                 path: to.path,  // 使用路由的 path
//                 keepAlive: to.meta.keepAlive || false,  // 从 meta 中读取 keepAlive
//                 query: to.query,  // 保留路由的 query 参数
//             };
//             useTagsStore.tagsStoreAdd(path);
//         } else {
//             useTagsStore.tagsStore = useTagsStore.tagsStore.map(item =>
//                 item.path === to.path ? { ...item, name: title } : item
//             )
//         }
//     }
// });
router.afterEach(async (to, from) => {
    if (to.path !== '/login' && to.name !== '404' && to.name) {
        // 使用路由的完整路径（包含参数）作为唯一标识
        let isPathExists = useTagsStore.tagsStore.some(item => item.fullPath === to.fullPath);
        const title = getRouteTitle(to) + (to.params.name ? `-${to.params.name}` : '') + (to.params.typeName ? `-${to.params.typeName}` : '')
        if (!isPathExists) {
            let path = {
                name: to.name,  // 使用路由name
                label: title,    // 用于显示
                path: to.path,
                fullPath: to.fullPath,  // 新增fullPath作为唯一标识
                keepAlive: to.meta.keepAlive || false,
                query: to.query,
            };
            useTagsStore.tagsStoreAdd(path);
        } else {
            useTagsStore.tagsStore = useTagsStore.tagsStore.map(item =>
                item.fullPath === to.fullPath ? { ...item, label: title } : item
            )
        }
    }
});

