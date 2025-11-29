// import { setupPermissionDirective } from '@/utils/tool/buttonPermission.js'
// import { setupNumberInputDirective, setupPositiveIntegerDirective } from '@/utils/tool/numberInputDirective.js'
import { setupDirectives as installDirectives } from '@/directives'

// 注册自定义指令
export function setupDirectives(app) {
    installDirectives(app)
}