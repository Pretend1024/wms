<template>
    <div class="tags">
        <progressBar />
        <!-- <a-tabs v-model:activeKey="activeKey" lazy-load type="card-gutter" :editable="true" @tabClick="tabClick"
            @delete="handleDelete" auto-switch>
            <a-tab-pane v-for="(item, index) in useTagsStore.tagsStore" :key="item.path" :closable="true">
                <template #title>
                    <p @contextmenu.prevent="(event) => handleRightClick(event, index)">
                        {{ item.name }}
                    </p>
                </template>
</a-tab-pane>
</a-tabs> -->
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
        <!-- 右上更多按钮 -->
        <!-- <el-dropdown class="RightHandMenu">
            <span class="iconfont icon-gengduo rightIcon"></span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="refreshPageTabs">
                        <el-icon>
                            <Loading />
                        </el-icon>
                        {{ $t('Refresh') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteOtherTabs">
                        <el-icon>
                            <DocumentRemove />
                        </el-icon>
                        {{ $t('CloseOther') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteLeftTabs">
                        <el-icon>
                            <CaretLeft />
                        </el-icon>
                        {{ $t('CloseLeft') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteRightTabs">
                        <el-icon>
                            <CaretRight />
                        </el-icon>
                        {{ $t('CloseRight') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteAll">
                        <el-icon>
                            <SemiSelect />
                        </el-icon>
                        {{ $t('CloseAll') }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown> -->

        <!-- 右键菜单 -->
        <div class="rightMenu" v-show="showMenu" :style="{ top: `${menuY}px`, left: `${menuX}px` }">
            <div @click="refreshPage" class="rightMenuItem">
                <el-icon>
                    <Loading />
                </el-icon>
                {{ $t('Refresh') }}
            </div>
            <div @click="deleteOthers" class="rightMenuItem">
                <el-icon>
                    <DocumentRemove />
                </el-icon>
                {{ $t('CloseOther') }}
            </div>
            <div @click="deleteLeft" class="rightMenuItem">
                <el-icon>
                    <CaretLeft />
                </el-icon>
                {{ $t('CloseLeft') }}
            </div>
            <div @click="deleteRight" class="rightMenuItem">
                <el-icon>
                    <CaretRight />
                </el-icon>
                {{ $t('CloseRight') }}
            </div>
            <div @click="deleteAll" class="rightMenuItem">
                <el-icon>
                    <SemiSelect />
                </el-icon>
                {{ $t('CloseAll') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import tagsStore from '@/store/tags.js'
import progressBar from '@/components/animation/progressBar.vue'

// 路由 + store
const route = useRoute()
const router = useRouter()
const useTagsStore = tagsStore()

// 受控 activeKey —— 与 route.fullPath 同步
const activeKey = ref(route.path)
watch(() => route.path, newPath => activeKey.value = newPath)

// —— 点击 tab 切换路由
const tabClick = key => router.push(key)

// —— 删除 tab
const handleDelete = key => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(i => i.fullPath !== key)
    if (!useTagsStore.tagsStore.length) return router.push('/welcome')
    if (key === route.path) {
        const last = useTagsStore.tagsStore.at(-1)
        last && router.push(last.path)
    }
}

// —— 右键菜单相关状态
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const activeTabIndex = ref(null)

// 捕获右键，弹出菜单
const handleRightClick = (event, index) => {
    menuX.value = event.clientX - 200
    menuY.value = event.clientY
    showMenu.value = true
    activeTabIndex.value = index
}

// —— 右键/上方按钮：刷新 & 关闭操作
const refreshCurrentPage = inject('refresh')

// 刷新当前标签
const refreshPageTabs = () => {
    setTimeout(() => {
        if (route.meta.keepAlive) {
            useTagsStore.removeKeepAliveName(route.fullPath)
        }
        refreshCurrentPage(route.fullPath, false)
        nextTick(() => {
            if (route.meta.keepAlive) {
                useTagsStore.addKeepAliveName(route.fullPath)
            }
        })
    }, 0)
}

// 上面按钮：只删其他/左/右标签
const deleteOtherTabs = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(tab => tab.path === route.path)
}
const deleteLeftTabs = () => {
    const i = useTagsStore.tagsStore.findIndex(tab => tab.path === route.path)
    useTagsStore.tagsStore = useTagsStore.tagsStore.slice(i)
}
const deleteRightTabs = () => {
    const i = useTagsStore.tagsStore.findIndex(tab => tab.path === route.path)
    useTagsStore.tagsStore = useTagsStore.tagsStore.slice(0, i + 1)
}

// 右键菜单：刷新/关闭
const refreshPage = () => { refreshPageTabs(); showMenu.value = false }
const deleteOthers = () => {
    if (activeTabIndex.value !== null) {
        const current = useTagsStore.tagsStore[activeTabIndex.value]
        useTagsStore.tagsStore = [current]
        router.push(current.fullPath)
    }
    showMenu.value = false
}
const deleteLeft = () => {
    if (activeTabIndex.value > 0) {
        useTagsStore.tagsStore.splice(0, activeTabIndex.value)
        router.push(useTagsStore.tagsStore[0].path)
    }
    showMenu.value = false
}
const deleteRight = () => {
    if (activeTabIndex.value < useTagsStore.tagsStore.length - 1) {
        useTagsStore.tagsStore.splice(activeTabIndex.value + 1)
        router.push(useTagsStore.tagsStore[useTagsStore.tagsStore.length - 1].path)
    }
    showMenu.value = false
}
const deleteAll = () => {
    useTagsStore.tagsStore = []
    router.push('/welcome')
    showMenu.value = false
}

// 点击别处关闭右键菜单
const handleGlobalClick = e => {
    const menuEl = document.querySelector('.rightMenu')
    if (menuEl && !menuEl.contains(e.target)) showMenu.value = false
}
onMounted(() => window.addEventListener('click', handleGlobalClick))
onBeforeUnmount(() => window.removeEventListener('click', handleGlobalClick))
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