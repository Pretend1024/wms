<template>
    <el-menu class="el-menu-vertical" :collapse="isCollapse" :default-active="defaultActive" background-color="#2b2b2b"
        text-color="#fff" active-text-color="#ffffff" router @open="handleOpen" @close="handleClose" unique-opened>
        <template v-for="level1 in menuData.userMenuList" :key="level1.id">
            <!-- 一级菜单 -->
            <el-sub-menu :index="level1.path">
                <template #title>
                    <span :class="['iconfont', level1.icon]" class="iconFont"></span>
                    <span>{{ menuData.lang == 'zh' ? level1.name : level1.nameEn }}</span>
                </template>

                <template v-for="level2 in level1.children" :key="level2.id">
                    <!-- 有三级 -->
                    <el-sub-menu v-if="level2.children && level2.children.length" :index="level2.path">
                        <template #title>
                            <span>{{ menuData.lang == 'zh' ? level2.name : level2.nameEn }}</span>
                        </template>

                        <el-menu-item v-for="level3 in level2.children" :key="level3.id" :index="level3.path"
                            style="padding-left: 60px;">
                            {{ menuData.lang == 'zh' ? level3.name : level3.nameEn }}
                        </el-menu-item>
                    </el-sub-menu>

                    <!-- 没有三级，只有二级 -->
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
const defaultActive = computed(() => route.path)

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

/* 一级菜单标题高度 */
:deep(.el-sub-menu__title) {
    height: 52px;
    line-height: 52px;
    font-size: 15px;
}

/* 二级菜单项高度*/
:deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    padding-left: 36px !important;
    position: relative;
}

/* 三级菜单项高度 */
:deep(.el-sub-menu .el-menu-item) {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

/* 深色主题下自定义菜单 hover 和 active 效果 */
:deep(.el-menu-vertical) {
    border-right: none;
}

/* 悬停状态背景 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
    background-color: #535353 !important;
}

/* 激活状态背景（已通过属性 active-text-color 设置文字为白色） */
:deep(.el-menu-item.is-active) {
    background-color: #ff914e !important;
    color: #ffffff !important;
    font-weight: 500;
}

:deep(.el-sub-menu__title) {
    padding-left: 4px !important;
}

/* 为三级菜单添加:before伪元素 */
:deep(.el-sub-menu .el-menu-item:not(.secondMenu)):before {
    position: absolute;
    content: "";
    width: 5px;
    height: 5px;
    background: #fff;
    left: 45px;
    top: 17px;
    border-radius: 50%;
}
</style>
