<template>
    <el-menu class="el-menu-vertical" :collapse="isCollapse" :default-active="defaultActive" :background-color="bgColor"
        :text-color="textColor" :active-text-color="activeTextColor" router @open="handleOpen" @close="handleClose"
        unique-opened>
        <template v-for="level1 in menuData.userMenuList" :key="level1.id">
            <el-sub-menu :index="level1.path">
                <template #title>
                    <span :class="['iconfont', level1.icon]" class="iconFont"></span>
                    <span>{{ menuData.lang == 'zh' ? level1.name : level1.nameEn }}</span>
                </template>

                <template v-for="level2 in level1.children" :key="level2.id">
                    <el-sub-menu v-if="level2.children && level2.children.length" :index="level2.path">
                        <template #title>
                            <span>{{ menuData.lang == 'zh' ? level2.name : level2.nameEn }}</span>
                        </template>

                        <el-menu-item v-for="level3 in level2.children" :key="level3.id" :index="level3.path"
                            style="padding-left: 60px;">
                            {{ menuData.lang == 'zh' ? level3.name : level3.nameEn }}
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item v-else class="secondMenu" :index="level2.path" style="padding-left: 36px;">
                        {{ menuData.lang == 'zh' ? level2.name : level2.nameEn }}
                    </el-menu-item>
                </template>
            </el-sub-menu>
        </template>
    </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/store/theme.js'

const props = defineProps({
    menuData: {
        type: Array,
        required: true
    },
    isCollapse: {
        type: Boolean,
        default: false
    }
})

const route = useRoute()
const themeStore = useThemeStore()

const defaultActive = computed(() => route.path)

// 背景色
const bgColor = computed(() => themeStore.sidebarTheme === 'dark' ? '#2b2b2b' : '#ffffff')
// 文字颜色
const textColor = computed(() => themeStore.sidebarTheme === 'dark' ? '#fff' : '#606266')
// 激活状态文字颜色
const activeTextColor = computed(() => '#ffffff')

/* --- 圆点颜色 --- */
const dotColor = computed(() => textColor.value)

/* --- 悬停背景色 --- */
const hoverBgColor = computed(() => themeStore.sidebarTheme === 'dark' ? '#535353' : 'var(--theme-hover-bg)')

/* --- 悬停文字颜色 --- */
const hoverTextColor = computed(() => themeStore.sidebarTheme === 'dark' ? '#fff' : 'var(--theme-primary)')

const handleOpen = (index) => {
    // console.log('open', index)
}
const handleClose = (index) => {
    // console.log('close', index)
}
</script>

<style scoped>
.el-menu-vertical {
    width: 200px;
    min-height: calc(100vh - 60px);
    overflow-y: auto;
}

.iconFont {
    font-size: 22px;
    margin: 0 8px 0 2px;
}

:deep(.el-sub-menu__title) {
    height: 52px;
    line-height: 52px;
    font-size: 15px;
    padding-left: 4px !important;
}

:deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    padding-left: 36px !important;
    position: relative;
}

:deep(.el-sub-menu .el-menu-item) {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

:deep(.el-menu-vertical) {
    border-right: none;
}

/* --- 悬停效果 --- */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
    background-color: v-bind(hoverBgColor) !important;
    color: v-bind(hoverTextColor) !important;
}

/* 激活状态背景 */
:deep(.el-menu-item.is-active) {
    background-color: var(--theme-primary) !important;
    color: #ffffff !important;
    font-weight: 500;
}

/* --- 三级菜单圆点 --- */
:deep(.el-sub-menu .el-menu-item:not(.secondMenu)):before {
    position: absolute;
    content: "";
    width: 5px;
    height: 5px;
    background: v-bind(dotColor);
    left: 45px;
    top: 17px;
    border-radius: 50%;
}
</style>