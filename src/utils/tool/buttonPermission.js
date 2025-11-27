let globalRouter = null // 用于保存 router 实例
/**
   * 当指令绑定到元素上且元素挂载到 DOM 后调用的钩子函数
   * @param {HTMLElement} el - 指令绑定的元素
   * @param {Object} binding - 包含指令绑定值等信息的对象
   */
const permissionDirective = {
    mounted(el, binding) {
        if (!globalRouter) {
            console.warn('请先通过 setupPermissionDirective 注册 router')
            return
        }

        const route = globalRouter.currentRoute.value
        const permissionCode = route.meta?.permissionCode || ''
        const permissions = permissionCode.split(',')

        const requiredCode = binding.value
        if (!permissions.includes(requiredCode)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

/**
 * 设置权限指令的函数，用于将权限指令注册到 Vue 应用中
 * @param {Object} app - Vue 应用实例
 * @param {Object} router - Vue Router 实例
 */
export function setupPermissionDirective(app, router) {
    globalRouter = router
    app.directive('permission', permissionDirective)
}
