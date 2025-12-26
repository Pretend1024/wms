import { createApp } from 'vue'
import App from './App.vue'

// --- vxe-table 引入 ---
import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// --- 导出插件引入 ---
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import ExcelJS from 'exceljs'

// --- 注册插件 ---
VxeTable.use(VXETablePluginExportXLSX, {
    ExcelJS
})

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

app.use(VxeUI)
app.use(VxeTable)

app.mount('#app')