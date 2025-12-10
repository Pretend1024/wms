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

    // --- 核心修改开始 ---

    // 1. 如果传入的 code 包含冒号（例如 'customer:add'），说明是全称，直接判断
    if (code.includes(':')) {
        return permissions.includes(code)
    }

    // 2. 如果不包含冒号，尝试自动获取当前路由的模块名
    // 逻辑：将路径按 '/' 分割，取倒数第二个片段
    // 例如：/base/cust/customer/list -> 分割后取 customer
    const path = currentRoute.path
    const segments = path.split('/').filter(item => item && item !== '')

    if (segments.length >= 2) {
        // 取倒数第二个作为模块名
        const moduleName = segments[segments.length - 2]
        // 拼接成完整的权限码，例如 customer:add
        const fullCode = `${moduleName}:${code}`

        // 检查拼接后的权限码是否存在
        if (permissions.includes(fullCode)) {
            return true
        }
    }

    return permissions.includes(code)
}

/**
 * 权限指令 v-permission
 */
export const permission = {
    mounted(el, binding) {
        if (!hasPerm(binding.value)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}