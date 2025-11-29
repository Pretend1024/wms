import { createApp } from 'vue'
import App from './App.vue'

// 引入统一的插件入口
import { setupPlugins } from '@/plugins'
// 引入自定义指令入口
import { setupDirectives } from '@/directives'

// 引入路由守卫
import './permission'

const app = createApp(App)

// 安装所有插件
setupPlugins(app)
// 注册指令
setupDirectives(app)

app.mount('#app')