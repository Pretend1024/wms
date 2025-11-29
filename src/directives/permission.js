import router from '@/router'

export const permission = {
    mounted(el, binding) {
        // 直接从 router 实例获取当前路由
        const currentRoute = router.currentRoute.value
        
        // 获取路由 meta 中的权限码
        const permissionCode = currentRoute.meta?.permissionCode || ''
        const permissions = permissionCode.split(',') // 假设是逗号分隔的字符串

        // 获取指令绑定的值（需要的权限码）
        const requiredCode = binding.value

        // 判断是否有权限
        if (!permissions.includes(requiredCode)) {
            // 没有权限，移除 DOM 元素
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}