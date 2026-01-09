import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// --- 导出插件引入 ---
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import ExcelJS from 'exceljs'

export function setupVxeTable(app) {
    // 1. 注册导出插件 (这里就是您特别提到要分开的部分)
    VxeTable.use(VXETablePluginExportXLSX, {
        ExcelJS
    })

    // 2. 安装 UI 和 Table
    app.use(VxeUI)
    app.use(VxeTable)
}