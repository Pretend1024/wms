import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/router'
import i18n from '@/i18n'

import { setupIcons } from './icons'
import { setupAssets } from './assets'
import { setupDirectives } from './directives'
import { setupGlobals } from './globals'

export function setupPlugins(app) {
    // 1. 引入静态资源
    setupAssets()

    // 2. 注册状态管理 (Pinia)
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)

    // 3. 注册路由
    app.use(router)

    // 4. 注册 i18n
    app.use(i18n)


    // 6. 注册自定义插件/逻辑
    setupIcons(app)
    setupDirectives(app, router)
    setupGlobals(app)
}