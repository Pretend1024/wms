import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mix } from '@/utils/color.js'

export const useThemeStore = defineStore('theme', () => {
    // 布局模式: 'top' | 'left'
    const layout = ref(localStorage.getItem('layout') || 'top')
    // 侧边栏风格
    const sidebarTheme = ref(localStorage.getItem('sidebarTheme') || 'dark')
    // 主题色
    const primaryColor = ref(localStorage.getItem('primaryColor') || '#ff914e')

    const setCssVar = (color) => {
        const node = document.documentElement;

        // --- 按钮悬停/激活颜色 ---
        const light3 = mix(color, '#ffffff', 0.3);
        const light5 = mix(color, '#ffffff', 0.5);
        const light7 = mix(color, '#ffffff', 0.7);
        const light8 = mix(color, '#ffffff', 0.8);
        const light9 = mix(color, '#ffffff', 0.9);
        const dark2 = mix(color, '#000000', 0.2);

        node.style.setProperty('--el-color-primary', color);
        node.style.setProperty('--el-color-primary-light-3', light3);
        node.style.setProperty('--el-color-primary-light-5', light5);
        node.style.setProperty('--el-color-primary-light-7', light7);
        node.style.setProperty('--el-color-primary-light-8', light8);
        node.style.setProperty('--el-color-primary-light-9', light9);
        node.style.setProperty('--el-color-primary-dark-2', dark2);

        // --- 自定义主题变量 ---
        node.style.setProperty('--theme-primary', color);
        node.style.setProperty('--theme-light-8', light8);

        // 悬浮背景色 (使用 light-9，极淡)
        node.style.setProperty('--theme-hover-bg', light9);

        // --- Header 背景颜色 ---
        node.style.setProperty('--theme-header-bg', light9);
    }

    const initTheme = () => {
        setCssVar(primaryColor.value)
    }

    const setLayout = (val) => {
        layout.value = val
        localStorage.setItem('layout', val)
    }

    const setSidebarTheme = (val) => {
        sidebarTheme.value = val
        localStorage.setItem('sidebarTheme', val)
    }

    const setPrimaryColor = (val) => {
        primaryColor.value = val
        localStorage.setItem('primaryColor', val)
        setCssVar(val)
    }

    return {
        layout,
        sidebarTheme,
        primaryColor,
        setLayout,
        setSidebarTheme,
        setPrimaryColor,
        initTheme
    }
})