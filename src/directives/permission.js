import router from '@/router'

/**
 * 统一的权限检查函数
 * @param {String} code 权限码 (例如 'add' 或 'user:add')
 * @returns {Boolean}
 */
export function hasPerm(code) {
    const currentRoute = router.currentRoute.value
    const metaAuth = currentRoute.meta?.permissionCode


    // 定义最终使用的权限数组
    let permissions = []

    if (Array.isArray(metaAuth)) {
        // 情况1: 如果已经是数组，直接使用
        permissions = metaAuth
    } else if (typeof metaAuth === 'string') {
        // 情况2: 如果是字符串
        if (metaAuth.includes(',')) {
            // 如果是 "outOrder:printWayBill,outOrder:printInvoice" 这种逗号分隔的
            // 分割 -> 去除首尾空格 -> 过滤空项
            permissions = metaAuth.split(',').map(p => p.trim()).filter(p => p)
        } else {
            // 如果是单个字符串权限，放入数组
            permissions = [metaAuth]
        }
    } else {
        // 情况3: meta 中没有定义或格式不对，视为无权限
        return false
    }


    // 下面是原有的判断逻辑

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

    // 3. 最后尝试直接匹配简单码 (防止有时候 meta 里存的就是 'add' 而不是 'xxx:add')
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