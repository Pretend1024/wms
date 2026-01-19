import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('@/views/index.vue'), // 欢迎页面
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: '欢迎',
                component: () => import('@/views/welcome/index.vue'), // 欢迎页面
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '欢迎',
                }
            },
            {
                path: '/userInfo',
                name: '用户信息',
                component: () => import('@/views/welcome/userInfo.vue'),
                meta: {
                    // keepAlive: true, // 该组件需要被缓存
                    langKey: '用户信息',
                }
            },
            {
                path: '/messageNotices',
                name: '我的消息',
                component: () => import('@/views/welcome/messageNotices.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '我的消息',
                }
            },
            {
                path: '/exportJob',
                name: '我的下载',
                component: () => import('@/views/welcome/exportJob.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '我的下载',
                }
            },
            {
                path: '/myImport',
                name: '我的导入',
                component: () => import('@/views/welcome/myImport.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '我的导入',
                }
            },
            {
                path: '/print',
                name: '条码打印',
                component: () => import('@/views/welcome/tools/print.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '条码打印',
                }
            },
            {
                path: '/base/org/employee/add',
                name: '新增员工',
                component: () => import('@/views/base/org/employee/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增员工',
                }
            },
            {
                path: '/base/org/employee/upd/:name/:id/',
                name: '编辑员工',
                component: () => import('@/views/base/org/employee/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑员工',
                }
            },
            {
                path: '/importView/:typeId/:typeName/:id?',
                name: '导入文件',
                component: () => import('@/views/welcome/importView.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '导入',
                }
            },
            {
                path: '/base/sku/sku/add',
                name: '新增SKU',
                component: () => import('@/views/base/sku/sku/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增SKU',
                }
            },
            {
                path: '/base/sku/sku/upd/:name/:id/',
                name: '编辑SKU',
                component: () => import('@/views/base/sku/sku/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑SKU',
                }
            },
            {
                path: '/base/cust/customer/add',
                name: '新增客户',
                component: () => import('@/views/base/cust/customer/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增客户',
                }
            },
            {
                path: '/base/cust/customer/upd/:name/:id/',
                name: '编辑客户',
                component: () => import('@/views/base/cust/customer/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑客户',
                }
            },
            {
                path: '/instock/order/inOrder/add',
                name: '新增入库单',
                component: () => import('@/views/instock/order/inOrder/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增入库单',
                }
            },
            {
                path: '/instock/order/inOrder/info/:name/:id/',
                name: '入库单详情',
                component: () => import('@/views/instock/order/inOrder/info.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '入库单详情',
                }
            },
            {
                path: '/instock/order/inOrder/copyAdd/:id/',
                name: '入库单复制',
                component: () => import('@/views/instock/order/inOrder/copyAdd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '入库单复制',
                }
            },
            {
                path: '/instock/order/inOrder/upd/:name/:id/',
                name: '编辑入库单',
                component: () => import('@/views/instock/order/inOrder/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑入库单',
                }
            },
            {
                path: '/product/shipway/supplier/add',
                name: '新增服务商',
                component: () => import('@/views/product/shipway/supplier/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增服务商',
                }
            },
            {
                path: '/product/shipway/supplier/upd/:name/:id/',
                name: '编辑服务商',
                component: () => import('@/views/product/shipway/supplier/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑服务商',
                }
            },
            {
                path: '/product/shipway/supplier/info/:name/:id/',
                name: '服务商详情',
                component: () => import('@/views/product/shipway/supplier/info.vue'),
                props: true,
                meta: {
                    langKey: '服务商详情',
                }
            },
            {
                path: '/product/shipway/shipway/add',
                name: '新增物流产品',
                component: () => import('@/views/product/shipway/shipway/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增物流产品',
                }
            },
            {
                path: '/product/shipway/shipway/upd/:name/:id/',
                name: '编辑物流产品',
                component: () => import('@/views/product/shipway/shipway/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑物流产品',
                }
            },
            {
                path: '/product/shipway/shipway/info/:name/:id/',
                name: '物流产品详情',
                component: () => import('@/views/product/shipway/shipway/info.vue'),
                props: true,
                meta: {
                    langKey: '物流产品详情',
                }
            },
            {
                path: '/product/price/regionProject/configure/:name/:id/',
                name: '配置分区',
                component: () => import('@/views/product/price/regionProject/configure.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '配置分区',

                }
            },
            {
                path: '/instock/return/returnOrder/add/:trackingNos?/:customerCode?/:warehouseCode?/',
                name: '新增退件单',
                component: () => import('@/views/instock/return/returnOrder/add.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增退件单',
                }
            },
            {
                path: '/instock/return/returnOrder/upd/:name/:id/',
                name: '编辑退件单',
                component: () => import('@/views/instock/return/returnOrder/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑退件单',
                }
            },
            {
                path: '/instock/return/returnOrder/info/:name/:id/',
                name: '退件单详情',
                component: () => import('@/views/instock/return/returnOrder/info.vue'),
                props: true,
                meta: {
                    langKey: '退件单详情',
                }
            },
            {
                path: '/outstock/order/outOrder/add',
                name: '新增出库单',
                component: () => import('@/views/outstock/order/outOrder/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增出库单',
                }
            },
            {
                path: '/outstock/order/outOrder/upd/:name/:id/',
                name: '编辑出库单',
                component: () => import('@/views/outstock/order/outOrder/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑出库单',
                }
            },
            {
                path: '/outstock/order/outOrder/info/:name/:id/',
                name: '出库单详情',
                component: () => import('@/views/outstock/order/outOrder/info.vue'),
                props: true,
                meta: {
                    langKey: '出库单详情',
                    keepAlive: true, // 该组件需要被缓存
                }
            },
            {
                path: '/outstock/order/outOrder/copyAdd/:id/',
                name: '出库单复制',
                component: () => import('@/views/outstock/order/outOrder/copyAdd.vue'),
                props: true,
                meta: {
                    langKey: '出库单复制',
                    keepAlive: true, // 该组件需要被缓存
                }
            },
            {
                path: '/outstock/wave/outWaveTask/list',
                name: '波次创建记录',
                component: () => import('@/views/outstock/wave/outWaveTask/list.vue'),
                props: true,
                meta: {
                    langKey: '波次创建记录',
                    keepAlive: true, // 该组件需要被缓存
                }
            },
            {
                path: '/outstock/wave/outWave/add',
                name: '新增波次',
                component: () => import('@/views/outstock/wave/outWave/add.vue'),
                props: true,
                meta: {
                    langKey: '新增波次',
                    keepAlive: true, // 该组件需要被缓存
                }
            },
            {
                path: '/vas/vas/vasOrder/add',
                name: '新增增值服务单',
                component: () => import('@/views/vas/vas/vasOrder/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增增值服务单',
                }
            },
            {
                path: '/vas/vas/vasOrder/upd/:name/:id/',
                name: '编辑增值服务单',
                component: () => import('@/views/vas/vas/vasOrder/upd.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '编辑增值服务单',
                }
            },
            {
                path: '/vas/vas/vasOrder/info/:name/:id/',
                name: '增值服务单详情',
                component: () => import('@/views/vas/vas/vasOrder/info.vue'),
                props: true,
                meta: {
                    langKey: '增值服务单详情',
                }
            },
            {
                path: '/vas/wo/workOrder/add',
                name: '新增工单',
                component: () => import('@/views/vas/wo/workOrder/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增工单',
                }
            },
            {
                path: '/vas/wo/workOrder/info/:name/:id/',
                name: '工单详情',
                component: () => import('@/views/vas/wo/workOrder/info.vue'),
                props: true,
                meta: {
                    langKey: '工单详情',
                }
            },
            {
                path: '/vas/wo/workOrder/upd/:name/:id/',
                name: '编辑工单',
                component: () => import('@/views/vas/wo/workOrder/upd.vue'),
                props: true,
                meta: {
                    langKey: '编辑工单',
                }
            },
            {
                path: '/finance/receivables/receivableBills/info/:name/:id/',
                name: '应收账单详情',
                component: () => import('@/views/finance/receivables/receivableBills/info.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '应收账单详情',
                }
            },
            {
                path: '/inventory/check/inventoryCheck/info/:name/:id/',
                name: '盘点详情',
                component: () => import('@/views/inventory/check/inventoryCheck/info.vue'),
                props: true,
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '盘点详情',
                }
            },
            {
                path: '/inventory/mv/inventoryMv/add',
                name: '新增移库',
                component: () => import('@/views/inventory/mv/inventoryMv/add.vue'),
                meta: {
                    keepAlive: true, // 该组件需要被缓存
                    langKey: '新增移库',
                }
            },
            {
                path: '/inventory/mv/inventoryMv/upd/:name/:id/',
                name: '追加移库',
                component: () => import('@/views/inventory/mv/inventoryMv/upd.vue'),
                props: true,
                meta: {
                    langKey: '追加移库',
                    keepAlive: true,
                }
            },
            {
                path: '/inventory/mv/inventoryMv/info/:name/:id/',
                name: '移库详情',
                component: () => import('@/views/inventory/mv/inventoryMv/info.vue'),
                props: true,
                meta: {
                    langKey: '移库详情',
                    keepAlive: true,
                }
            },
            {
                path: '/product/price/priceProject/add',
                name: '新增报价方案',
                component: () => import('@/views/product/price/priceProject/add.vue'),
                props: true,
                meta: {
                    langKey: '新增报价方案',
                    keepAlive: true,
                }
            },
            {
                path: '/product/price/priceProject/upd/:name/:id/',
                name: '编辑报价方案',
                component: () => import('@/views/product/price/priceProject/upd.vue'),
                props: true,
                meta: {
                    langKey: '编辑报价方案',
                    keepAlive: true,
                }
            },
            {
                path: '/product/price/priceProject/info/:name/:id/',
                name: '报价方案详情',
                component: () => import('@/views/product/price/priceProject/info.vue'),
                props: true,
                meta: {
                    langKey: '报价方案详情',
                    keepAlive: true,
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'), // 登录页面
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;