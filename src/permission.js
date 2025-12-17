import router from './router'
import useUserMenuStore from '@/store/userMenu.js';
import tagsStore from '@/store/tags.js';
import { getRouteTitle } from '@/utils/i18n/i18nTitle.js'

// 路由白名单
const whiteList = ['/login', '/welcome'];

//记录当前会话是否已加载过动态路由
let isRoutesLoaded = false;

router.beforeEach(async (to, from, next) => {
    const userMenuStore = useUserMenuStore();
    let token = localStorage.getItem('token');

    if (!token) {
        // 没有 Token
        isRoutesLoaded = false; // 重置状态
        userMenuStore.clearMenuData();
        if (to.path !== '/login') {
            next('/login');
        } else {
            next();
        }
    } else {
        // 设置动态标题/语言
        if (to.name === '欢迎') {
            to.meta.lang = userMenuStore.lang === 'zh' ? '欢迎' : 'Welcome';
        }

        if (to.path === '/login') {
            next({ path: '/' });
            return;
        }

        //判断是否已经加载过路由
        if (isRoutesLoaded) {
            // 如果已经加载过不再重复 addRoute
            next();
        } else {
            // 如果是刷新页面或第一次登录，Router 是空的，需要添加路由
            try {
                // 这里调用 store 的方法，它会根据 userRoleList 是否有值决定是读缓存还是调接口
                await userMenuStore.setUserRouter();

                // 标记为已加载
                isRoutesLoaded = true;

                // 动态添加路由后，必须用这种方式重进一次钩子
                // 这样可以确保路由挂载完成，否则直接 next() 可能会白屏
                next({ ...to, replace: true });
            } catch (e) {
                console.error('路由加载错误', e);
                isRoutesLoaded = false;
                localStorage.removeItem('token');
                userMenuStore.clearMenuData();
                next('/login');
            }
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