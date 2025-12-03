import router from '@/router'

/**
 * 统一的权限检查函数
 * @param {String} code 权限码
 * @returns {Boolean}
 */
export function hasPerm(code) {
    const currentRoute = router.currentRoute.value

    // 获取 meta 中的权限数组
    const permissions = currentRoute.meta?.permissionCode || []

    // 安全判断
    if (!Array.isArray(permissions)) {
        return false
    }

    return permissions.includes(code)
}

/**
 * 权限指令 v-permission
 */
export const permission = {
    mounted(el, binding) {
        // 指令内部直接调用 hasPerm，保持逻辑一致
        if (!hasPerm(binding.value)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}