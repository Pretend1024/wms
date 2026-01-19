<template>
    <div class="compact-search-form" ref="wrapperRef">
        <el-form :model="formData" ref="formRef" :label-width="labelWidth + 'px'">
            <el-row ref="rowRef">
                <!-- 1. 渲染可见的插槽内容（自定义表单项） -->
                <template v-for="(col, index) in displayedSlotCols" :key="'slot_'+index">
                    <component :is="col" />
                </template>

                <!-- 2. 渲染可见的动态表单项 -->
                <el-col v-for="(item, idx) in displayedFormItemsWithLang" :key="'form_' + item.prop">
                    <el-form-item :label="item._displayLabel">
                        <component :is="componentMap[item.type]" v-model="formData[item.prop]"
                            v-bind="getComponentProps(item)">
                            <!-- 选项类组件的选项渲染 -->
                            <template v-if="item.options">
                                <component :is="optionComponentMap[item.type]" v-for="opt in item.options"
                                    :key="opt.value" :label="opt.label" :value="opt.value">
                                    {{ opt.label }}
                                </component>
                            </template>
                        </component>
                    </el-form-item>
                </el-col>

                <!-- 3. 操作按钮列 -->
                <el-col>
                    <div class="action-buttons">
                        <el-button type="primary" @click="handleSearch">{{ t('search') }}</el-button>
                        <el-button @click="handleReset">{{ t('reset') }}</el-button>
                        <el-button type="text" v-if="showToggle" @click="toggleMore">
                            {{ showMore ? t('toggleMoreCollapse') : t('toggleMoreExpand') }}
                            <el-icon :class="['arrow', { rotate: showMore }]">
                                <ArrowDown />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup>
// ========================== 1. 依赖引入 ==========================
import { ref, computed, onMounted, onUnmounted, useSlots, defineProps, defineEmits, defineExpose } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {
    ElInput, ElSelect, ElDatePicker, ElSwitch,
    ElRadioGroup, ElCheckboxGroup, ElCascader,
    ElOption, ElRadio, ElCheckbox
} from 'element-plus'
import dayjs from 'dayjs'
import useUserMenuStore from '@/store/userMenu';
import { getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels'

// ========================== 2. Props & Emits 定义 ==========================
const props = defineProps({
    formItems: { type: Array, required: true }, // 表单项配置
    initialValue: { type: Object, default: () => ({}) }, // 初始表单值
    collapseRows: { //折叠时展示的行数，默认2行
        type: Number,
        default: 2,
        validator: (val) => val >= 1 // 至少1行
    }
})

const emit = defineEmits(['search', 'reset']) // 对外事件：搜索、重置

// ========================== 3. 状态与核心变量 ==========================
// 表单数据相关
const formData = ref({}) // 当前表单值
const defaultFormData = ref({}) // 默认表单值（初始值备份）

// 折叠/展开相关
const showMore = ref(false) // 是否展开更多
const wrapperRef = ref(null) // 容器ref（用于计算宽度）
const parentWidth = ref(0) // 容器宽度
let resizeObserver = null // 监听容器尺寸变化的观察者

// 多语言相关
const userMenuStore = useUserMenuStore() // 语言状态存储

// 插槽相关
const slots = useSlots() // 插槽内容

// ========================== 4. 计算属性 ==========================
// 4.1 语言相关计算
const labelWidth = computed(() => (userMenuStore.lang === 'zh' ? 80 : 135)) // 标签宽度（多语言适配）
const baseColWidth = computed(() => (userMenuStore.lang === 'zh' ? 270 : 325)) // 每列基础宽度（多语言适配）

// 4.2 布局计算
const itemsPerRow = computed(() => {
    // 每行可容纳的列数（根据容器宽度计算）
    return parentWidth.value ? Math.max(1, Math.floor(parentWidth.value / baseColWidth.value)) : 3
})

const maxVisibleCount = computed(() => {
    // 折叠时最大可见列数 = 每行列数 * 折叠行数 - 1（减1是预留操作按钮列）
    return itemsPerRow.value * props.collapseRows - 1
})

// 4.3 插槽内容处理
const slotCols = computed(() => {
    // 过滤插槽中类型为ElCol的内容（自定义表单项）
    const vnodes = slots['custom-form']?.({ formData: formData.value }) || []
    return vnodes.filter(vn => vn.type?.name === 'ElCol')
})

const displayedSlotCols = computed(() => {
    // 折叠状态下只显示部分插槽内容
    return showMore.value
        ? slotCols.value
        : slotCols.value.slice(0, maxVisibleCount.value)
})

// 4.4 动态表单项处理
const displayedFormItems = computed(() => {
    // 折叠状态下显示的表单项（减去已显示的插槽列）
    if (showMore.value) return props.formItems
    const remain = maxVisibleCount.value - displayedSlotCols.value.length
    return props.formItems.slice(0, Math.max(remain, 0))
})

// 4.5 多语言处理后的表单项
const displayedFormItemsWithLang = computed(() => {
    // 为表单项添加多语言标签和占位符
    return displayedFormItems.value.map(item => ({
        ...item,
        _displayLabel: getLabel(item.prop), // 多语言标签
        _placeholder: getPlaceholder(item.prop) // 多语言占位符
    }))
})

// 4.6 是否显示展开/收起按钮
const showToggle = computed(() => {
    // 总表单项（插槽+动态）超过折叠时最大可见数则显示切换按钮
    const total = slotCols.value.length + props.formItems.length
    return total > maxVisibleCount.value
})

// ========================== 5. 方法定义 ==========================
// 5.1 表单操作
function resetForm(init = false) {
    // 重置表单数据（init为true时仅初始化，不触发事件）
    formData.value = { ...defaultFormData.value }
    // 处理日期类型的默认值
    props.formItems.forEach(item => {
        if (item.type === 'date') {
            if (item.offsetDays != null) {
                const base = dayjs().subtract(item.offsetDays, 'day')
                const dt = item.useEndOfDay ? base.endOf('day') : base.startOf('day')
                formData.value[item.prop] = dt.format('YYYY-MM-DD HH:mm:ss')
            } else if (item.useEndOfDay) {
                formData.value[item.prop] = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            } else {
                formData.value[item.prop] = '' // 空字符串避免NaN
            }
        }
    })
    !init && emit('reset', formData.value) // 非初始化时触发重置事件
}

// 5.2 组件映射与属性处理
const componentMap = {
    input: ElInput,
    select: ElSelect,
    date: ElDatePicker,
    switch: ElSwitch,
    radio: ElRadioGroup,
    checkbox: ElCheckboxGroup,
    cascader: ElCascader,
    number: ElInput
}
const optionComponentMap = {
    select: ElOption,
    radio: ElRadio,
    checkbox: ElCheckbox
}

function getComponentProps(item) {
    // 获取组件的props（基础属性+类型特定属性）
    const base = {
        placeholder: item._placeholder,
        clearable: true
    }
    // 日期选择器特殊处理
    if (item.type === 'date') {
        const propsObj = {
            ...base,
            type: item.mode === 'range' ? 'datetimerange' : 'datetime',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            format: 'YYYY-MM-DD HH:mm:ss'
        }
        if (item.offsetDays != null) {
            propsObj.defaultTime = item.useEndOfDay ? '23:59:59' : '00:00:00'
            const base = dayjs().subtract(item.offsetDays, 'day')
            propsObj.defaultValue = (item.useEndOfDay ? base.endOf('day') : base.startOf('day')).toDate()
        }
        return propsObj
    }
    return { ...base, ...item } // 合并基础属性和自定义属性
}

// 5.3 多语言文本获取
const labelsMap = {
    // 固定文本的多语言映射
    search: { zh: '搜索', en: 'Search' },
    reset: { zh: '重置', en: 'Reset' },
    toggleMoreExpand: { zh: '展开', en: 'Expand' },
    toggleMoreCollapse: { zh: '收起', en: 'Collapse' },
}
const t = key => labelsMap[key]?.[userMenuStore.lang] || key // 根据语言获取文本

// 5.4 事件处理
const handleSearch = () => emit('search', formData.value) // 触发搜索事件
const handleReset = () => resetForm() // 触发重置事件
const toggleMore = () => (showMore.value = !showMore.value) // 切换展开/收起状态

// ========================== 6. 生命周期 ==========================
onMounted(() => {
    // 初始化表单默认值
    defaultFormData.value = { ...props.initialValue }
    formData.value = { ...defaultFormData.value }
    resetForm(true) // 初始化重置
    handleSearch() // 初始搜索

    // 监听容器宽度变化（用于动态调整布局）
    resizeObserver = new ResizeObserver(entries => {
        parentWidth.value = entries[0].contentRect.width
    })
    wrapperRef.value && resizeObserver.observe(wrapperRef.value)
})

onUnmounted(() => {
    // 清理尺寸观察者
    resizeObserver?.disconnect()
})

// ========================== 7. 对外暴露 ==========================
defineExpose({ handleReset }) // 暴露重置方法给父组件
</script>

<style scoped>
/* 1. 容器基础样式 */
.compact-search-form {
    background: #fff;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 5px;  /* 左侧菜单样式 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 2. 布局样式 */
:deep(.el-row) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

:deep(.el-col) {
    flex: 0 0 auto;
    height: 40px;
    display: flex;
    align-items: center;
}

/* 3. 表单项样式 */
:deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
}

/* 固定输入类组件宽度 */
:deep(.el-form-item__content)>* {
    width: 190px !important;
    box-sizing: border-box;
}

:deep(.el-form-item__label) {
    text-align: right;
    padding-right: 8px;
}

:deep(.el-form-item) {
    margin-bottom: 0px;
}

/* 4. 操作按钮样式 */
.action-buttons {
    margin-left: 25px;
}

:deep(.el-button) {
    margin-left: 8px;
}

/* 5. 展开/收起箭头样式 */
.arrow {
    transition: transform 0.2s;
}

.arrow.rotate {
    transform: rotate(180deg);
}
</style>