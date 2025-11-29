<template>
    <div class="tags">
        <progressBar />
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
    menuX.value = event.clientX - 180
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
.tags {
    position: relative;
    border: none;
    align-self: flex-end;
    // border-top: 1px solid;
    // border-image: linear-gradient(to right, rgb(245, 190, 40), rgb(245, 248, 41));
    border-image-slice: 1;
    padding-top: 8px;
    padding-right: 45px;
    // 渐变背景色,从右上角向左下角渐变linear-gradient(to right, #ffffff, #c5d9f0)
    // background: linear-gradient(to right, #ffffff, #c5d9f0);
}

.rightMenu {
    position: absolute;
    z-index: 2001;
    border-radius: 5px;
    height: 142px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 6px #8f8f8f;
    background-color: white;
    padding: 0px 8px;

    .el-icon {
        margin: 10px;
    }

    span {
        font-size: 14px;
    }
}

.rightIcon {
    font-size: 18px;
}

.rightIcon:hover {
    color: #ff914e;
    animation: rotate 0.3s linear;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(90deg);
    }
}

.RightHandMenu {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 100;
}

.rightMenuItem {
    display: flex;
    align-items: center;
    height: 28px;
    width: 114%;
}

.rightMenuItem:hover {
    cursor: pointer;
    // ecf5ff
    background-color: #f8eddc;
    color: #ff914e;
    ;
}


:deep(.arco-tabs-tab) {
    background-color: #fff !important;
    color: #000;
    /* 过渡时间 */
    transition: width 0.5s ease;
    box-sizing: border-box;
}

:deep(.arco-tabs-tab:hover) {
    border-color: #ff914e;
    color: #ff914e;
}

:deep(.arco-tabs-tab-active) {
    // #ff914e
    background-color: #ff914e !important;
    color: #fff;
    border: 1px solid #ff914e;
    border-color: #ff914e;
}

:deep(.arco-tabs-tab-active:hover) {
    color: #fff;
}

:deep(.arco-tabs-content) {
    height: calc(100vh - 102px) !important;
    padding: 0 !important;
}

:deep(.arco-tabs-pane) {
    height: 100%;

}

:deep(.arco-tabs-content-list) {
    height: 100% !important;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}

// 隐藏标签删除
:deep(.arco-tabs-tab-close-btn) {
    max-width: 0;
    /* 隐藏时的高度 */
    opacity: 0;
    /* 隐藏时透明度 */
    overflow: hidden;
    /* 防止内容溢出 */
    transition: max-width 0.5s ease, opacity 0.5s ease;
    /* 添加高度和透明度过渡效果 */
    visibility: hidden;
    /* 隐藏时不显示 */
}

// 显示删除
:deep(.arco-tabs-tab:hover .arco-tabs-tab-close-btn) {
    max-width: 50px;
    /* 展开后的高度，根据内容调整 */
    opacity: 1;
    visibility: visible;
    /* 显示时可见 */
    border-radius: 50%;
}

:deep(.arco-tabs-tab-close-btn:hover) {
    background-color: #c9cdd4;
    color: #ff914e;
}

:deep(.arco-tabs-type-card-gutter) {
    height: 32px !important;
}

:deep(.arco-tabs-nav-button-right) {
    margin: 0 0px 0 0;
}

:deep(.arco-tabs-nav-button-left) {
    margin: 0 0 0 0px;
}

:deep(.arco-tabs-nav) {
    padding: 0 5px 0 5px !important;
}

:deep(.arco-tabs-nav-tab) {
    margin: 0 10px !important;
}

:deep(.arco-tabs-nav::before) {
    display: none;
}
</style>