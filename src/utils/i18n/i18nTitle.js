const tagMap = {
    欢迎: {
        zh: '欢迎',
        en: 'Welcome'
    },
    用户信息: {
        zh: '用户信息',
        en: 'User Info'
    },
    我的消息: {
        zh: '我的消息',
        en: 'My Messages'
    },
    我的下载: {
        zh: '我的下载',
        en: 'My Downloads'
    },
    条码打印: {
        zh: '条码打印',
        en: 'Barcode Print'
    },
    新增员工: {
        zh: '新增员工',
        en: 'Add Employee'
    },
    编辑员工: {
        zh: '编辑员工',
        en: 'Edit Employee'
    },
    导入: {
        zh: '导入',
        en: 'Import'
    },
    新增SKU: {
        zh: '新增SKU',
        en: 'Add SKU'
    },
    编辑SKU: {
        zh: '编辑SKU',
        en: 'Edit SKU'
    },
    新增客户: {
        zh: '新增客户',
        en: 'Add Customer'
    },
    编辑客户: {
        zh: '编辑客户',
        en: 'Edit Customer'
    },
    新增入库单: {
        zh: '新增入库单',
        en: 'Add Inbound Order'
    },
    入库单详情: {
        zh: '入库单详情',
        en: 'Inbound Order Details'
    },
    编辑入库单: {
        zh: '编辑入库单',
        en: 'Edit Inbound Order'
    },
    入库单复制: {
        zh: '入库单复制',
        en: 'Copy Inbound Order'
    },
    新增服务商: {
        zh: '新增服务商',
        en: 'Add Supplier'
    },
    编辑服务商: {
        zh: '编辑服务商',
        en: 'Edit Supplier'
    },
    服务商详情: {
        zh: '服务商详情',
        en: 'Supplier Details'
    },
    新增物流产品: {
        zh: '新增物流产品',
        en: 'Add Shipping Product'
    },
    编辑物流产品: {
        zh: '编辑物流产品',
        en: 'Edit Shipping Product'
    },
    物流产品详情: {
        zh: '物流产品详情',
        en: 'Shipping Product Details'
    },
    配置分区: {
        zh: '配置分区',
        en: 'Configure Region'
    },
    新增退件单: {
        zh: '新增退件单',
        en: 'Add Return Order'
    },
    编辑退件单: {
        zh: '编辑退件单',
        en: 'Edit Return Order'
    },
    退件单详情: {
        zh: '退件单详情',
        en: 'Return Order Details'
    },
    新增出库单: {
        zh: '新增出库单',
        en: 'Add Outbound Order'
    },
    编辑出库单: {
        zh: '编辑出库单',
        en: 'Edit Outbound Order'
    },
    出库单详情: {
        zh: '出库单详情',
        en: 'Outbound Order Details'
    },
    出库单复制: {
        zh: '出库单复制',
        en: 'Copy Outbound Order'
    }
}
import useUserMenuStore from '@/store/userMenu'

export function getRouteTitle(route) {
    const userMenuStore = useUserMenuStore()
    const lang = userMenuStore.lang
    if (route.meta?.langKey) {
        return tagMap[route.meta.langKey]?.[lang] || route.meta.langKey
    }
    return route.meta?.lang || route.name
}
