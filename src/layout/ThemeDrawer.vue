<template>
    <el-drawer v-model="drawerVisible" title="主题设置" size="300px">
        <div class="theme-item">
            <div class="theme-title">布局模式</div>
            <el-radio-group v-model="themeStore.layout" @change="themeStore.setLayout">
                <el-radio label="top" border>顶部菜单</el-radio>
                <el-radio label="left" border>左侧菜单</el-radio>
            </el-radio-group>
        </div>

        <div class="theme-item" v-if="themeStore.layout === 'left'">
            <div class="theme-title">侧边栏风格</div>
            <el-switch v-model="themeStore.sidebarTheme" active-text="暗色" inactive-text="亮色" active-value="dark"
                inactive-value="light" @change="themeStore.setSidebarTheme" />
        </div>

        <div class="theme-item">
            <div class="theme-title">主题颜色</div>
            <el-color-picker v-model="themeStore.primaryColor" @change="themeStore.setPrimaryColor"
                :predefine="predefineColors" />
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/store/theme.js'

const themeStore = useThemeStore()
const drawerVisible = ref(false)

// 暴露打开方法给父组件
const open = () => {
    drawerVisible.value = true
}
defineExpose({ open })

const predefineColors = ref([
    '#ff914e',
    '#409EFF',
    '#1890ff',
    '#304156',
    '#212121',
    '#11a983',
    '#13c2c2',
    '#6959CD',
    '#f5222d',
])
</script>

<style scoped lang="scss">
.theme-item {
    margin-bottom: 24px;

    .theme-title {
        margin-bottom: 12px;
        font-size: 14px;
        color: #606266;
        font-weight: 500;
    }
}
</style>