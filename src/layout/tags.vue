<template>
    <div class="tags">
        <!-- <progressBar /> -->
        <a-tabs v-model:activeKey="activeKey" lazy-load type="card-gutter" :editable="true" @tabClick="tabClick"
            @delete="handleDelete" auto-switch>
            <a-tab-pane v-for="(item, index) in useTagsStore.tagsStore" :key="item.fullPath" :closable="true">
                <template #title>
                    <p @contextmenu.prevent="e => handleRightClick(e, index)">
                        {{ item.label }}
                    </p>
                </template>
            </a-tab-pane>
        </a-tabs>

        <div class="rightMenu" v-show="showMenu" :style="{ top: `${menuY}px`, left: `${menuX}px` }">
            <div @click="refreshPage" class="rightMenuItem">
                <el-icon>
                    <Loading />
                </el-icon> {{ $t('Refresh') }}
            </div>
            <div @click="deleteOthers" class="rightMenuItem">
                <el-icon>
                    <DocumentRemove />
                </el-icon> {{ $t('CloseOther') }}
            </div>
            <div @click="deleteLeft" class="rightMenuItem">
                <el-icon>
                    <CaretLeft />
                </el-icon> {{ $t('CloseLeft') }}
            </div>
            <div @click="deleteRight" class="rightMenuItem">
                <el-icon>
                    <CaretRight />
                </el-icon> {{ $t('CloseRight') }}
            </div>
            <div @click="deleteAll" class="rightMenuItem">
                <el-icon>
                    <SemiSelect />
                </el-icon> {{ $t('CloseAll') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import tagsStore from '@/store/tags.js'
import progressBar from '@/components/animation/progressBar.vue'

const route = useRoute()
const router = useRouter()
const useTagsStore = tagsStore()

// 刷新方法
const refreshCurrentPage = inject('refresh')

// 受控 activeKey —— 与 route.fullPath 同步
const activeKey = ref(route.fullPath)
watch(() => route.fullPath, (newPath) => {
    activeKey.value = newPath
})

// —— 点击 tab 切换路由
const tabClick = key => router.push(key)

// —— 删除 tab
const handleDelete = key => {
    // 移除 store 中的 tag
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(i => i.fullPath !== key)

    // 如果全部删除了，跳转回欢迎页或首页
    if (!useTagsStore.tagsStore.length) return router.push('/welcome')

    // 如果删除的是当前页，跳转到最后一个 tag
    if (key === route.fullPath) {
        const last = useTagsStore.tagsStore.at(-1)
        if (last) router.push(last.fullPath)
    }
}

// —— 右键菜单相关状态
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const activeTabIndex = ref(null)

// 捕获右键，弹出菜单
const handleRightClick = (event, index) => {
    menuX.value = event.clientX
    menuY.value = event.clientY
    showMenu.value = true
    activeTabIndex.value = index
}

// —— 刷新当前标签逻辑
const refreshPageTabs = () => {
    if (route.meta.keepAlive) {
        useTagsStore.removeKeepAliveName(route.fullPath)
    }

    // 触发 index.vue 的刷新
    refreshCurrentPage(route.fullPath)

    nextTick(() => {
        if (route.meta.keepAlive) {
            useTagsStore.addKeepAliveName(route.fullPath)
        }
    })
}

// 右键菜单操作
const refreshPage = () => {
    refreshPageTabs()
    showMenu.value = false
}

const deleteOthers = () => {
    if (activeTabIndex.value !== null) {
        const selectedTag = useTagsStore.tagsStore[activeTabIndex.value]

        // 如果右键选中的不是当前显示的页面，需要先跳过去
        if (route.fullPath !== selectedTag.fullPath) {
            router.push(selectedTag.fullPath).then(() => {
                // 跳转完成后，只保留选中的这一个
                useTagsStore.tagsStore = [selectedTag]
            })
        } else {
            // 如果就是当前页，直接保留它即可
            useTagsStore.tagsStore = [selectedTag]
        }
    }
    showMenu.value = false
}

const deleteLeft = () => {
    if (activeTabIndex.value > 0) {
        // 先计算好要保留哪些
        const remainingTags = useTagsStore.tagsStore.slice(activeTabIndex.value)
        const isCurrentInRemaining = remainingTags.some(t => t.fullPath === route.fullPath)

        if (isCurrentInRemaining) {
            // 如果当前页还在保留列表中，直接更新 store
            useTagsStore.tagsStore = remainingTags
        } else {
            // 先跳转到要保留的第一个，再更新 store
            const target = remainingTags[0]
            if (target) {
                router.push(target.fullPath).then(() => {
                    useTagsStore.tagsStore = remainingTags
                })
            }
        }
    }
    showMenu.value = false
}

const deleteRight = () => {
    if (activeTabIndex.value < useTagsStore.tagsStore.length - 1) {
        const remainingTags = useTagsStore.tagsStore.slice(0, activeTabIndex.value + 1)
        const isCurrentInRemaining = remainingTags.some(t => t.fullPath === route.fullPath)

        if (isCurrentInRemaining) {
            useTagsStore.tagsStore = remainingTags
        } else {
            const target = remainingTags[remainingTags.length - 1]
            if (target) {
                router.push(target.fullPath).then(() => {
                    useTagsStore.tagsStore = remainingTags
                })
            }
        }
    }
    showMenu.value = false
}
//关闭全部
const deleteAll = () => {
    router.push('/welcome').then(() => {
        // setTimeout 确保在下一轮事件循环清理，
        // 避免在跳转动画执行期间修改 Store 导致 KeepAlive 混乱
        setTimeout(() => {
            const currentPath = route.fullPath
            // 过滤只保留当前页（欢迎页）
            useTagsStore.tagsStore = useTagsStore.tagsStore.filter(tag => tag.fullPath === currentPath)
        }, 50)
    })
    showMenu.value = false
}

// 点击别处关闭右键菜单
const handleGlobalClick = (e) => {
    const menuEl = document.querySelector('.rightMenu')
    if (showMenu.value && menuEl && !menuEl.contains(e.target)) {
        showMenu.value = false
    }
}

onMounted(() => {
    window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
    window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped lang="scss">
/* --- 1. 容器样式 --- */
.tags {
    position: relative;
    padding: 6px 0px 0 0px;
    user-select: none;
    width: 100%;
    box-sizing: border-box;
}

/* 隐藏默认的导航栏底条 */
:deep(.arco-tabs-nav::before) {
    display: none;
}

/* 调整导航栏容器的内边距 */
:deep(.arco-tabs-nav) {
    padding: 0 !important;
    background: transparent;
}

/* 防止 Tabs 组件自带的内容区占位影响布局 */
:deep(.arco-tabs-content) {
    display: none;
}

/* --- Tab 单体样式 --- */

:deep(.arco-tabs-tab) {
    margin: 0 6px 0 0 !important;
    padding: 0 16px !important;
    height: 32px !important;
    line-height: 32px !important;
    background-color: #ffffff !important;
    border: 1px solid #e4e7ed !important;
    border-radius: 4px 4px 4px 4px !important;
    color: #606266;
    font-size: 13px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

/* --- Tab悬停状态 --- */
:deep(.arco-tabs-tab:not(.arco-tabs-tab-active):hover) {
    color: var(--theme-primary);
    background-color: var(--theme-hover-bg) !important;
    border-color: var(--theme-light-8) !important;
    padding-right: 12px !important;
}

/* --- Tab激活状态 --- */
:deep(.arco-tabs-tab-active) {
    background-color: var(--theme-primary) !important;
    color: #ffffff !important;
    border-color: var(--theme-primary) !important;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* --- 关闭按钮 --- */

:deep(.arco-tabs-tab-close-btn) {
    box-sizing: border-box;
    width: 0;
    height: 18px;
    margin-left: 0;
    opacity: 0;
    border-radius: 50%;
    transform: scale(0.5);
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    vertical-align: middle;
}

/* 触发显示：只要 Tab 被悬停，或者 Tab 是激活态，就给按钮留位置 */
:deep(.arco-tabs-tab:hover .arco-tabs-tab-close-btn),
:deep(.arco-tabs-tab-active .arco-tabs-tab-close-btn) {
    width: 18px;
    margin-left: 6px;
    opacity: 1;
    transform: scale(1);
}

/* >>> 场景 A：未选中的 Tab <<< */

/* A1. 默认 */
:deep(.arco-tabs-tab:not(.arco-tabs-tab-active):hover .arco-tabs-tab-close-btn) {
    color: var(--theme-primary);
    background-color: transparent;
}

/* A2. 悬停在按钮上*/
:deep(.arco-tabs-tab:not(.arco-tabs-tab-active) .arco-tabs-tab-close-btn:hover) {
    background-color: var(--theme-primary) !important;
    color: #ffffff !important;
}

/* >>> 场景 B：已选中的 Tab <<< */

/* B1. 默认 */
:deep(.arco-tabs-tab-active .arco-tabs-tab-close-btn) {
    color: #ffffff;
    background-color: transparent;
}

/* B2. 悬停在按钮上*/
:deep(.arco-tabs-tab-active .arco-tabs-tab-close-btn:hover) {
    background-color: #ffffff !important;
    color: var(--theme-primary) !important;
}

/* --- 右键菜单样式 --- */
.rightMenu {
    position: fixed;
    z-index: 2001;
    border-radius: 6px;
    height: auto;
    padding: 6px 0;
    background-color: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    min-width: 120px;
}

.rightMenuItem {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    color: #606266;
    transition: background-color 0.2s;

    .el-icon {
        margin-right: 8px;
        font-size: 14px;
    }
}

.rightMenuItem:hover {
    cursor: pointer;
    background-color: var(--theme-hover-bg);
    color: var(--theme-primary);
}
</style>