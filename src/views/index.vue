<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <navigationBar></navigationBar>
            </el-header>

            <el-container>
                <el-aside width="200px" v-if="themeStore.layout === 'left'" :class="themeStore.sidebarTheme">
                    <menus :menuData="userMenuStore" :isCollapse="false"></menus>
                </el-aside>
                <el-main :class="[themeStore.layout]">
                    <tags v-if="themeStore.layout !== 'left'"></tags>
                    <router-view v-slot="{ Component, route }">
                        <div :class="['router-view-container', themeStore.layout]">
                            <!-- <transition :name="route.meta.noAnimation ? '' : 'page-transition'"> -->
                            <keep-alive :include="cacheTagsList" :max="15">
                                <component :is="Component" :key="route.fullPath + (route.meta.refreshKey || 0)"
                                    v-memo="[route.fullPath, route.meta.refreshKey]" />
                            </keep-alive>
                            <!-- </transition> -->
                        </div>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup name="首页">
import navigationBar from '@/layout/header.vue';
import menus from '@/layout/menus.vue';
import { computed, provide, onMounted } from 'vue';
import tagsStore from '@/store/tags.js'
import useUserMenuStore from '@/store/userMenu';
import { useRoute } from 'vue-router';

import tags from '@/layout/tags.vue';
import { useThemeStore } from '@/store/theme.js'
const themeStore = useThemeStore()
const route = useRoute();
const useTagsStore = tagsStore();
const userMenuStore = useUserMenuStore();

// 只有当 tagsStore 里的 keepAlive 属性或 name 发生实质变化时，这里才会重新计算
const cacheTagsList = computed(() => {
    return useTagsStore.tagsStore
        .filter(tag => tag.keepAlive)
        .map(tag => tag.name); // 确保这里的 name 与组件内的 name 一致
});


// 页面刷新
const refresh = (path) => {
    if (path === route.fullPath || !path) {
        if (!route.meta) route.meta = {};
        route.meta.refreshKey = (route.meta.refreshKey || 0) + 1;
    }
};

// 提供给子组件（如 tags.vue）使用
provide('refresh', refresh);

</script>

<style scoped lang="scss">
/* 页面切换动画样式 */
.router-view-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    // will-change: transform;
    // transform: translateZ(0);
    // backface-visibility: hidden;

    // 左侧菜单样式
    &.left {
        height: calc(100vh - 80px);
    }

    // 顶部菜单样式
    &.top {
        height: calc(100vh - 110px);
    }
}

// 切换动画
.page-transition-enter-active,
.page-transition-leave-active {
    transition: all 0.3s ease;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

// 进入动画
.page-transition-enter-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
    transition-delay: 0.3s;
}

.page-transition-enter-from {
    opacity: 0;
    transform: translateX(-10px);
}

.page-transition-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.page-transition-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.page-transition-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.viewArea {
    height: 100%;
    width: 100%;
}

.common-layout {
    height: 100%;
    width: 100%;
}

.el-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.el-header {
    height: 60px;
    padding: 0;
}

.el-aside {
    overflow-y: auto;

    /* 亮色模式背景 */
    &.light {
        background-color: #ffffff;
        border-right: 1px solid #e4e7ed;
    }

    /* 暗色模式背景 */
    &.dark {
        background-color: #2b2b2b;
    }

    &::-webkit-scrollbar {
        display: none;
    }
}

.el-main {
    background-color: #f0f1f3;
    overflow: auto;

    // 菜单在左侧样式
    &.left {
        padding: 10px 12px;

    }

    // 菜单在顶部样式
    &.top {
        padding: 0px 12px 10px 12px;

    }
}

// 主题抽屉
:deep(.el-drawer__header) {
    margin-bottom: 0px !important;
}
</style>