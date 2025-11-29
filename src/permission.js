import router from './router'
import useUserMenuStore from '@/store/userMenu.js';
import tagsStore from '@/store/tags.js';
import { getRouteTitle } from '@/utils/i18n/i18nTitle.js'

// 路由白名单
const whiteList = ['/login', '/welcome'];

router.beforeEach(async (to, from, next) => {
    const getRoute = useUserMenuStore();

    let token = localStorage.getItem('token');

    if (!token) {
        getRoute.clearMenuData()
        localStorage.removeItem('token')
        if (to.path !== '/login') {
            next('/login');
        } else {
            next();
        }
    } else {
        // 设置动态标题/语言
        if (to.name === '欢迎') {
            to.meta.lang = getRoute.lang === 'zh' ? '欢迎' : 'Welcome';
        }

        try {
            // 获取用户菜单/路由
            await getRoute.setUserRouter()
            next();
        } catch (e) {
            console.error(e)
            next(false);
        }
    }
});

router.afterEach((to, from) => {
    const useTagsStore = tagsStore();
    if (to.path !== '/login' && to.name !== '404' && to.name) {
        let isPathExists = useTagsStore.tagsStore.some(item => item.fullPath === to.fullPath);
        const title = getRouteTitle(to) + (to.params.name ? `-${to.params.name}` : '') + (to.params.typeName ? `-${to.params.typeName}` : '')

        if (!isPathExists) {
            let path = {
                name: to.name,
                label: title,
                path: to.path,
                fullPath: to.fullPath,
                keepAlive: to.meta.keepAlive || false,
                query: to.query,
            };
            useTagsStore.tagsStoreAdd(path);
        } else {
            useTagsStore.tagsStore = useTagsStore.tagsStore.map(item =>
                item.fullPath === to.fullPath ? { ...item, label: title } : item
            )
        }
    }
});