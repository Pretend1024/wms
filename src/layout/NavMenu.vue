<template>
    <el-menu background-color="transparent" text-color="#606167" active-text-color="#ff914e"
        :default-active="activeIndex" class="custom-menu" mode="horizontal">
        <el-sub-menu v-for="(item, index) in userMenuStore.userMenuList" :key="item.id" :index="item.path"
            popper-class="mega-menu-popover">
            <template #title>
                <span class="root-menu-title">{{ userMenuStore.lang == 'zh' ? item.name : item.nameEn }}</span>
            </template>

            <div class="mega-menu-content custom-scrollbar">
                <div class="menu-grid-wrapper">

                    <div class="menu-group-card" v-for="(group, idx) in item.children" :key="idx">

                        <div class="group-header">
                            <span class="header-text" :title="userMenuStore.lang == 'zh' ? group.name : group.nameEn">
                                {{ userMenuStore.lang == 'zh' ? group.name : group.nameEn }}
                            </span>
                        </div>

                        <div class="group-list-container custom-scrollbar">
                            <div class="list-item" v-for="(ite, ind) in group.children" :key="ind"
                                @click="handleMenuClick(ite.path)"
                                :title="userMenuStore.lang == 'zh' ? ite.name : ite.nameEn">
                                <span class="link-text">
                                    {{ userMenuStore.lang == 'zh' ? ite.name : ite.nameEn }}
                                </span>
                            </div>

                            <div v-if="!group.children || group.children.length === 0" class="empty-placeholder">
                                -
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </el-sub-menu>
    </el-menu>
</template>

<script setup name="NavMenu">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserMenuStore from '@/store/userMenu'

const router = useRouter()
const route = useRoute()
const userMenuStore = useUserMenuStore()

const activeIndex = computed(() => {
    return route.path
})

const handleMenuClick = (path) => {
    if (path) router.push(path)
}
</script>

<style scoped lang="scss">
/* --- 基础菜单样式 --- */
.custom-menu {
    border: none;
    width: 100%;
    height: 100%;
    background: transparent !important;
}

.root-menu-title {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

:deep(.el-sub-menu__title) {
    padding: 0 25px !important;
    border-bottom: none !important;
}

:deep(.el-sub-menu__title:hover) {
    color: var(--theme-primary) !important;
    background-color: transparent !important;
}

:deep(.el-sub-menu__icon-arrow) {
    right: 6px;
    font-size: 14px;
}

/* --- 下拉菜单核心布局 --- */
.mega-menu-content {
    width: 540px;
    max-height: 500px;
    overflow-y: auto;
    padding: 15px;
    background: #fff;
    box-sizing: border-box;
}

.menu-grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

/* --- 二级菜单卡片 --- */
.menu-group-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    overflow: hidden;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
    height: 100%;

    &:hover {
        border-color: var(--theme-primary);
    }
}

/* --- 二级菜单标题--- */
.group-header {
    padding: 10px 12px;
    margin-bottom: 0;
    flex-shrink: 0;
    background-color: var(--theme-hover-bg);
    border-bottom: 1px solid var(--theme-light-8);

    .header-text {
        font-size: 15px;
        font-weight: 700;
        color: var(--theme-primary);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

/* --- 三级菜单 --- */
.group-list-container {
    flex: 1;
    max-height: 260px;
    overflow-y: auto;
    padding: 4px 6px;
    background-color: #ffffff;
}

/* --- 三级菜单项--- */
.list-item {
    padding: 8px 10px;
    margin-bottom: 0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    color: #606266;
    font-size: 14px;
    display: flex;
    align-items: center;
    line-height: 1.4;
    border-bottom: 1px dashed #f0f2f5;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: var(--theme-hover-bg);
        color: var(--theme-primary);
        padding-left: 14px;
        border-bottom-color: transparent;
    }

    .link-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
}

.empty-placeholder {
    color: #dcdfe6;
    font-size: 13px;
    text-align: center;
    padding: 10px 0;
}

/* --- 滚动条样式 --- */
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e4e7ed;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--theme-primary);
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
</style>

<style lang="scss">
/* 全局弹窗样式 */
.mega-menu-popover {
    padding: 0 !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1) !important;
    border: 1px solid #ebeef5 !important;
    overflow: hidden;

    .el-menu--popup {
        padding: 0 !important;
        min-width: auto !important;
    }
}
</style>