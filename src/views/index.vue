<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <navigationBar></navigationBar>
            </el-header>

            <el-container>
                <el-aside width="200px">
                    <menus :menuData="userMenuStore" :isCollapse="false"></menus>
                </el-aside>
                <el-main>
                    <router-view v-slot="{ Component, route }">
                        <div class="router-view-container">
                            <transition name="page-transition">
                                <keep-alive :include="cacheTagsList">
                                    <component :is="Component" :key="route.fullPath + (route.meta.refreshKey || 0)" />
                                </keep-alive>
                            </transition>
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
    height: 100%;
    display: flex;
    flex-direction: column;
    /*开启硬件加速，减少主线程重绘压力 */
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
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

    &::-webkit-scrollbar {
        display: none;
    }
}

.el-main {
    background-color: #f0f1f3;
    padding: 10px 12px;
    width: calc(100vw - 200px);
}
</style>