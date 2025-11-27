<template>
    <!-- <div class="common-layout">
        <el-container>
            <el-header>
                <navigationBar></navigationBar>
            </el-header>
            <tags></tags>
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
    </div> -->
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
                    <!-- <tags></tags> -->
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
import tags from '@/layout/tags.vue';
import { onMounted } from 'vue';
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRoute } from 'vue-router';
const route = useRoute();

import useUserMenuStore from '@/store/userMenu';
const userMenuStore = useUserMenuStore()

const cacheTagsList = ref([]);// 缓存的组件名称
// 页面加载时遍历 useTagsStore.tagsStore 并更新 cacheTagsList
const updateCacheList = () => {
    cacheTagsList.value = useTagsStore.tagsStore
        .filter(tag => tag.keepAlive) // 只缓存 keepAlive 为 true 的路由
        .map(tag => tag.name); // 缓存的名称是组件的 name
};

// 监听 tagsStore 的变化，动态更新 cacheTagsList
watch(
    () => useTagsStore.tagsStore,
    (newTagsStore) => {
        cacheTagsList.value = newTagsStore
            .filter(tag => tag.keepAlive)
            .map(tag => tag.name);
    },
    { deep: true } // 确保监听到数组的内部对象变化
);

// 提供 refresh 函数，刷新指定路径的组件
const refresh = (path, shouldKeepState) => {
    const tag = useTagsStore.tagsStore.find(tag => tag.path === path);
    if (tag) {
        if (!shouldKeepState) {
            // 刷新时不保留状态，重置 refreshKey
            if (!route.meta) {
                route.meta = {};
            }
            route.meta.refreshKey = (route.meta.refreshKey || 0) + 1;
            // 移除旧的缓存
            const index = cacheTagsList.value.indexOf(tag.name);
            if (index !== -1) {
                cacheTagsList.value.splice(index, 1);
            }
        }
    }
    // 更新缓存列表
    updateCacheList();
};

// 提供 refresh 函数
provide('refresh', refresh);
onMounted(() => {
    updateCacheList()
})
</script>

<style scoped lang="scss">
/* 页面切换动画样式 */
.router-view-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

// 切换动画
.page-transition-enter-active,
.page-transition-leave-active {
    transition: all .6s ease;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
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
    // background-color: white;
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

    // 隐藏滚动条
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