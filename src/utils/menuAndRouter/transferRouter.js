import useUserMenuStore from '@/store/userMenu';
/**
 * 将树形菜单数据转换为路由配置对象
 * @param {Object|Array} originalTree - 树形菜单数据
 * @param {Object} router - Vue Router 实例
 * @returns {Object} - 转换后的路由配置对象，键为节点的 url，值为路由配置
 */
export function transitionRouters(originalTree, router) {
    const userMenuStore = useUserMenuStore()
    const routeMap = {};
    // 使用 import.meta.glob 获取 views 下所有 .vue 文件
    const modules = import.meta.glob('../../views/**/*.vue');
    // 遍历树形菜单数据
    function traverseTree(nodes) {
        nodes.forEach(node => {
            if (node.url) {
                const filePath = `../../views/${node.url}`;
                if (modules[filePath]) {
                    // 获取当前菜单下所有的按钮权限码（typeId 为 20）
                    let codes = [];
                    if (node.children && node.children.length > 0) {
                        // 筛选出 typeId 为 20 的按钮节点
                        const buttons = node.children.filter(child => child.typeId == 20);
                        // 提取 permissionCode 并过滤空值
                        codes = buttons.map(btn => btn.permissionCode).filter(code => code);
                    }
                    routeMap[node.url] = {
                        path: `/${node.url.replace('.vue', '')}`,
                        name: node.nameCn,
                        component: modules[filePath],
                        meta: {
                            keepAlive: true,
                            permissionCode: codes.length > 0 ? codes : [],
                            lang: userMenuStore.lang === 'zh' ? node.nameCn : node.nameEn,
                        }
                    };
                }
            }
            if (node.children && node.children.length > 0) {
                traverseTree(node.children);
            }
        });
    }

    traverseTree(originalTree);
    // ------------------- 添加 404 路由-------------------
    const notFoundRoute = {
        path: '/:catchAll(.*)',
        name: '404',
        component: modules['../../views/404.vue'] || (() => import('../../views/welcome/404.vue')), // 兼容加载方式
        meta: {
            keepAlive: false,
            lang: '404'
        }
    };

    // 这里可以将 routeMap 中的路由添加到路由实例中
    Object.values(routeMap).forEach(route => {
        router.addRoute('首页', route);
    });
    // 添加404
    router.addRoute('首页', notFoundRoute);
    return routeMap;
}