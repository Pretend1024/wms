<template>
    <!-- 根容器：控制展开图标隐藏的外层类 -->
    <div class="table-container" :class="{ 'hide-expand-icon': hideExpandIcon }">
        <!-- 1. 顶部按钮区：自定义按钮 + 列设置弹窗触发器 -->
        <div class="table-buttons">
            <!-- 自定义按钮插槽：父组件传入的操作按钮 -->
            <div class="table-buttons-left">
                <slot name="table-buttons"></slot>
            </div>

            <!-- 列设置弹窗：控制列显示/隐藏、排序、宽度、固定 -->
            <el-popover placement="bottom" width="400" trigger="click" v-model:visible="showColSettings">
                <!-- 弹窗头部：标题 + 保存按钮 -->
                <div style="display: flex; justify-content: space-between;align-items: center;">
                    <h4 style="margin: 0;">{{ getButtonText('columnSetting') }}</h4>
                    <p id="saveBtn" @click="onSaveSettings">{{ getButtonText('apply') }}</p>
                </div>

                <!-- 弹窗主体：列勾选 + 拖拽排序 + 宽度设置 + 固定控制 -->
                <ul class="setColumns">
                    <el-checkbox-group v-model="tempVisibleColumns">
                        <draggable v-model="tempLocalColumns" :animation="150" handle=".drag-handle" :disabled="false">
                            <template #item="{ element: col, index }">
                                <li v-if="col.prop" class="checkbox-item" :key="col.prop">
                                    <el-checkbox :label="col.prop">
                                        <div class="checkbox-content" @click.stop.prevent>
                                            <p>{{ getColumnText(col.prop) }}</p>
                                            <!-- 列宽输入框 -->
                                            <el-input type="number" v-model="tempTempWidths[col.prop]"
                                                style="width: 80px;margin:0 15px 0 auto;"
                                                @blur="handleWidthBlurTemp(col.prop)" />
                                            <!-- 操作图标：拖拽 + 固定 -->
                                            <div style="display: flex; align-items: center;">
                                                <el-icon
                                                    :class="['drag-handle', col.fixed === 'right' ? 'disabled' : '']"
                                                    :title="col.fixed === 'right' ? '不可拖动' : '拖动调整顺序'">
                                                    <i class="iconfont icon-tuodong" style="font-size: 22px;" />
                                                </el-icon>
                                                <el-icon :class="[
                                                    'fixed-icon',
                                                    tempFixedColumns.includes(col.prop) ? 'fixed' : 'not-fixed',
                                                    col.fixed === 'right' ? 'disabled' : ''
                                                ]" :title="col.fixed === 'right' ? '不可操作' : '固定/取消固定'"
                                                    @mousedown.stop.prevent
                                                    @click.stop.prevent="col.fixed !== 'right' && toggleFixedTemp(col.prop)">
                                                    <i class="iconfont icon-fixed_line"
                                                        style="font-size: 22px; margin-left: 5px;" />
                                                </el-icon>
                                            </div>
                                        </div>
                                    </el-checkbox>
                                </li>
                            </template>
                        </draggable>
                    </el-checkbox-group>
                </ul>

                <!-- 弹窗触发图标：设置按钮 -->
                <template #reference>
                    <el-icon size="20" color="#999" class="table-setting-icon">
                        <Setting />
                    </el-icon>
                </template>
            </el-popover>
        </div>

        <!-- 2. 表格主体：核心数据展示 + 功能列 -->
        <el-table ref="elTableRef" highlight-current-row :data="filteredColumnsData" :row-key="rowKey"
            :tree-props="isTree ? treeProps : undefined" :default-expand-all="defaultExpandAll" border
            @selection-change="handleSelectionChange" @row-click="handleRowClick" @sort-change="handleSortChange"
            style="width: 100%; flex: 1;" v-loading="loading" :show-summary="footer !== null"
            :summary-method="computeSummary" :cell-class-name="getCellClassName"
            :preserve-expanded-content="preserveExpanded"
            @expand-change="(row, expanded) => preserveExpanded ? handleTableExpand(row, expanded) : null"
            :expand-row-keys="expandRowKeys">
            <!-- 多选列：批量操作 -->
            <el-table-column v-if="enableSelection" type="selection" width="55" align='center'></el-table-column>
            <!-- 展开列：树形/详情展开（默认隐藏图标，通过CSS控制） -->
            <el-table-column type="expand" v-if="preserveExpanded" fixed width="55">
                <template #default="scope">
                    <slot name="expand" :row="scope.row" :row-key="scope.row[rowKey]" :index="scope.$index">
                        <div class="default-expand-content">请通过「expand」插槽自定义展开内容</div>
                    </slot>
                </template>
            </el-table-column>
            <!-- 序号列：固定显示行号 -->
            <el-table-column type="index" width="68" fixed align='center' :label="getColumnText('index')">
                <template #default="scope">
                    {{ calculateIndex(scope.$index) }}
                </template>
            </el-table-column>

            <!-- 动态列：根据columns配置生成的业务列 -->
            <el-table-column v-for="(col, index) in filteredColumns" :key="col.prop" :prop="col.prop"
                :label="getColumnText(col.prop)" :width="col.width" :fixed="getFixedStatus(col)"
                :show-overflow-tooltip="true" center :sortable="col.sortable ? 'custom' : false">
                <template #default="scope">
                    <slot :name="col.slot" v-bind="{ row: scope.row, column: col, index: scope.$index }">
                        {{ scope.row[col.prop] }}
                    </slot>
                </template>
            </el-table-column>
        </el-table>

        <!-- 3. 分页器：数据分页控制 -->
        <el-pagination v-if="pagination" background layout="total, sizes, prev, pager, next, jumper"
            :current-page="pagination.currentPage" :page-size="pagination.pageSize" :page-sizes="pageSizes"
            :total="pagination.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>

<script setup>
// ========================== 1. 基础依赖引入 ==========================
import { defineProps, defineEmits, computed, ref, watch, onMounted, nextTick, defineExpose } from 'vue'
import { useRoute } from 'vue-router'
import { Setting } from '@element-plus/icons-vue'
import draggable from 'vuedraggable' // 拖拽排序组件
import { ElLoading } from 'element-plus' // 加载遮罩
// 接口与工具函数
import { setUserUserConfigApi } from '@/api/sysApi/user.js'
import { getUserUserConfigApi } from '@/api/sysApi/user.js'
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import { getButtonText } from '@/utils/i18n/i18nLabels'

// ========================== 2. Props & Emits 定义 ==========================
// 组件接收的外部参数
const props = defineProps({
    tableData: { type: Array, default: () => [] }, // 表格数据源
    columns: { type: Array, default: () => [] }, // 列配置数组
    pagination: { type: Object, default: () => ({}) }, // 分页配置
    enableSelection: { type: Boolean, default: false }, // 是否显示多选列
    loading: { type: Boolean, default: false }, // 表格加载状态
    pageSizes: { type: Array, default: () => [20, 50, 100, 200, 500] }, // 分页尺寸选项
    tableId: { type: String, default: 'default' }, // 表格唯一标识（用于缓存）
    footer: { type: Object, default: null }, // 合计行数据
    isTree: { type: Boolean, default: false }, // 是否树形表格
    rowKey: { type: String, default: 'id' }, // 行唯一标识字段
    treeProps: { type: Object, default: () => ({ children: 'children', hasChildren: 'hasChildren' }) }, // 树形配置
    defaultExpandAll: { type: Boolean, default: false }, // 树形表格是否默认展开所有
    strikeCondition: { type: Function, default: null }, // 行添加删除线的条件
    excludeStrikeProps: { type: Array, default: () => [] }, // 排除删除线的列
    preserveExpanded: { type: Boolean, default: false }, // 是否显示展开列
    redTextCondition: { type: Function, default: null }, // 行文字标红的条件
    excludeRedTextProps: { type: Array, default: () => [] }, // 排除标红的列
    hideExpandIcon: { type: Boolean, default: true } // 是否隐藏默认展开图标
})

// 计算序号
const calculateIndex = (currentPageIndex) => {
    // 1. 解构分页参数并设置默认值（防止undefined）
    const { currentPage: page = 1, pageSize: size = 20 } = props.pagination || {};

    // 2. 转换为数字类型（防止字符串/非数字导致NaN）
    const validPage = Number(page) || 1; // 若转换失败，强制设为1
    const validSize = Number(size) || 20; // 若转换失败，强制设为20
    const validIndex = Number(currentPageIndex) || 0; // 行索引兜底

    // 3. 计算最终序号（核心公式）
    return (validPage - 1) * validSize + validIndex + 1;
};

// 组件对外触发的事件
const emit = defineEmits([
    'selection-change', // 多选变更事件
    'row-click', // 行点击事件
    'page-change', // 分页变更事件
    'sort-change', // 排序变更事件
    'column-order-change', // 列顺序变更事件
    'expand' // 展开/收起事件
])

// ========================== 3. 表格实例与对外暴露方法 ==========================
const elTableRef = ref(null) // 表格DOM实例引用
const expandRowKeys = ref([]) // 控制展开行的key集合

// 对外暴露的方法：按行key展开行
const expandRowByKey = (key) => {
    if (!elTableRef.value || !props.tableData) return
    const row = props.tableData.find(r => r[props.rowKey] === key)
    if (row && elTableRef.value.toggleRowExpansion) {
        try {
            elTableRef.value.toggleRowExpansion(row, true)
            // 标记展开状态
            row.isExpanded = true
            emit('expand', row, true)
        } catch (e) {
            if (elTableRef.value.toggleRowExpanded) {
                elTableRef.value.toggleRowExpanded(row, true)
                row.isExpanded = true
                emit('expand', row, true)
            } else if (elTableRef.value.setExpandRowKeys) {
                const keys = [...(elTableRef.value.expandRowKeys || []), key]
                elTableRef.value.setExpandRowKeys(keys)
                // 同步行数据中的标记
                const r = props.tableData.find(i => i[props.rowKey] === key)
                if (r) { r.isExpanded = true }
                emit('expand', r || row, true)
            }
        }
    } else if (elTableRef.value.setExpandRowKeys) {
        const keys = [...(elTableRef.value.expandRowKeys || []), key]
        elTableRef.value.setExpandRowKeys(keys)
        const r = props.tableData.find(i => i[props.rowKey] === key)
        if (r) r.isExpanded = true
        emit('expand', r || null, true)
    }
}

// 对外暴露的方法：按行key收起行
const collapseRowByKey = (key) => {
    if (!elTableRef.value || !props.tableData) return
    const row = props.tableData.find(r => r[props.rowKey] === key)
    if (row && elTableRef.value.toggleRowExpansion) {
        try {
            elTableRef.value.toggleRowExpansion(row, false)
            // 标记收起状态
            row.isExpanded = false
            emit('expand', row, false)
        } catch (e) {
            if (elTableRef.value.toggleRowExpanded) {
                elTableRef.value.toggleRowExpanded(row, false)
                row.isExpanded = false
                emit('expand', row, false)
            } else if (elTableRef.value.setExpandRowKeys) {
                const keys = (elTableRef.value.expandRowKeys || []).filter(k => k !== key)
                elTableRef.value.setExpandRowKeys(keys)
                const r = props.tableData.find(i => i[props.rowKey] === key)
                if (r) { r.isExpanded = false }
                emit('expand', r || row, false)
            }
        }
    } else if (elTableRef.value.setExpandRowKeys) {
        const keys = (elTableRef.value.expandRowKeys || []).filter(k => k !== key)
        elTableRef.value.setExpandRowKeys(keys)
        const r = props.tableData.find(i => i[props.rowKey] === key)
        if (r) r.isExpanded = false
        emit('expand', r || null, false)
    }
}


// 暴露实例与方法给父组件
defineExpose({ elTableRef, expandRowByKey, collapseRowByKey })

// ========================== 4. 表格核心事件处理 ==========================
// 4.1 多选变更事件
const handleSelectionChange = (selection) => emit('selection-change', selection)

// 4.2 行点击事件
const handleRowClick = (row) => emit('row-click', row)

// 4.3 分页变更事件（页尺寸/页码）
const handleSizeChange = (newSize) => {
    emit('page-change', { pageSize: newSize, currentPage: props.pagination.currentPage })
    nextTick(() => elTableRef.value?.setScrollTop(0)) // 重置滚动条
}
const handleCurrentChange = (newPage) => {
    emit('page-change', { pageSize: props.pagination.pageSize, currentPage: newPage })
    nextTick(() => elTableRef.value?.setScrollTop(0)) // 重置滚动条
}
// 计算总页数（辅助）
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.pageSize))

// 4.4 排序变更事件
const handleSortChange = ({ prop, order }) => {
    const orderMap = { ascending: 'asc', descending: 'desc' }
    const colConfig = localColumns.value.find(c => c.prop === prop)
    const sortField = colConfig?.sortAlias || prop // 优先使用列的排序别名
    const sortString = prop && order ? `${sortField} ${orderMap[order]}` : ''
    emit('sort-change', sortString)
}

// 4.5 展开/收起事件
const handleTableExpand = (row, expanded) => {
    // 将展开状态写入行数据
    try {
        // 直接赋值（在 Vue3 中如果 row 是响应式对象，这会触发视图更新）
        row.isExpanded = !row.isExpanded
    } catch (e) {
        // 如果 row 是只读（来自外层 props 且冻结），则不要抛错，仍然触发事件
        console.warn('无法直接修改 row 对象的 isExpanded 字段，可能是只读或被冻结：', e)
    }
    // 保持原有事件发出
    emit('expand', row, expanded)
}
// ========================== 5. 列设置相关逻辑 ==========================
// 5.1 列设置核心变量（正式状态）
const localColumns = ref([]) // 本地列配置（含顺序/宽度）
const tempWidths = ref({}) // 列宽缓存
const visibleColumns = ref([]) // 可见列prop集合
const fixedColumns = ref([]) // 固定列prop集合
const showColSettings = ref(false) // 列设置弹窗显示状态
const route = useRoute() // 路由实例（用于默认tableId）

// 5.2 缓存相关配置
const effectiveTableId = computed(() => props.tableId === 'default' ? route.fullPath : props.tableId)
const visibleStorageKey = computed(() => `visibleCol-${effectiveTableId.value}`) // 可见列缓存键
const fixedStorageKey = computed(() => `fixedCol-${effectiveTableId.value}`) // 固定列缓存键
const columnOrderStorageKey = computed(() => `sortCol-${effectiveTableId.value}`) // 列顺序缓存键
const allColProps = computed(() => localColumns.value.map(col => col.prop)) // 所有列prop集合

// 5.3 列初始化（从缓存恢复/默认配置）
const initColumns = (columns) => {
    const savedOrderStr = localStorage.getItem(columnOrderStorageKey.value)
    if (savedOrderStr) {
        try {
            const savedOrder = JSON.parse(savedOrderStr)
            const orderedColumns = []
            const remainingColumns = [...columns]
            // 按缓存顺序排序列
            savedOrder.forEach(({ prop, width }) => {
                const idx = remainingColumns.findIndex(c => c.prop === prop)
                if (idx > -1) {
                    const col = remainingColumns.splice(idx, 1)[0]
                    col.width = width || col.width
                    orderedColumns.push(col)
                }
            })
            orderedColumns.push(...remainingColumns)
            // 同步列宽缓存
            tempWidths.value = orderedColumns.reduce((obj, col) => {
                obj[col.prop] = col.width || 100
                return obj
            }, {})
            return orderedColumns
        } catch (e) {
            console.error('列缓存解析失败:', e)
        }
    }
    // 无缓存：使用默认配置并保存缓存
    tempWidths.value = columns.reduce((obj, col) => {
        obj[col.prop] = col.width || 100
        return obj
    }, {})
    const defaultCache = columns.map(col => ({ prop: col.prop, width: col.width || 100 }))
    localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(defaultCache))
    return [...columns]
}

// 5.4 列设置临时状态（弹窗内操作，避免实时生效）
const tempLocalColumns = ref([]) // 临时列配置
const tempVisibleColumns = ref([]) // 临时可见列
const tempFixedColumns = ref([]) // 临时固定列
const tempTempWidths = ref({}) // 临时列宽

// 初始化临时状态
const initTempStates = () => {
    tempLocalColumns.value = JSON.parse(JSON.stringify(localColumns.value))
    tempVisibleColumns.value = [...visibleColumns.value]
    tempFixedColumns.value = [...fixedColumns.value]
    tempTempWidths.value = { ...tempWidths.value }
}

// 5.5 列操作辅助函数
// 保存列顺序/宽度到缓存
const saveColumnOrder = () => {
    const orderData = localColumns.value.map(c => ({
        prop: c.prop,
        width: c.width || tempWidths.value[c.prop] || 100
    }))
    localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(orderData))
    emit('column-order-change', localColumns.value)
}

// 保存可见列到缓存（存“隐藏列”）
const saveVisibleColumns = () => {
    const hidden = allColProps.value.filter(prop => !visibleColumns.value.includes(prop))
    localStorage.setItem(visibleStorageKey.value, JSON.stringify(hidden))
}

// 保存固定列到缓存
const saveFixedColumns = () => {
    localStorage.setItem(fixedStorageKey.value, JSON.stringify(fixedColumns.value))
}

// 设置默认固定列（fixed为left的列）
const setDefaultFixedColumns = () => {
    const defaultFixedProps = localColumns.value.filter(col => col.fixed === 'left').map(col => col.prop)
    fixedColumns.value = defaultFixedProps
    saveFixedColumns()
}

// 正式状态：列宽失焦处理
const handleWidthBlur = (prop) => {
    const newWidth = Number(tempWidths.value[prop])
    if (isNaN(newWidth) || newWidth <= 0) {
        tempWidths.value[prop] = localColumns.value.find(c => c.prop === prop)?.width || 100
        return
    }
    const col = localColumns.value.find(c => c.prop === prop)
    if (col) {
        col.width = newWidth
        tempWidths.value[prop] = newWidth
        saveColumnOrder()
    }
}

// 临时状态：列宽失焦处理
const handleWidthBlurTemp = (prop) => {
    const newWidth = Number(tempTempWidths.value[prop])
    if (isNaN(newWidth) || newWidth <= 0) {
        tempTempWidths.value[prop] = tempLocalColumns.value.find(c => c.prop === prop)?.width || 100
        return
    }
    const col = tempLocalColumns.value.find(c => c.prop === prop)
    if (col) {
        col.width = newWidth
        tempTempWidths.value[prop] = newWidth
    }
}

// 临时状态：切换列固定
const toggleFixedTemp = (prop) => {
    if (tempLocalColumns.value.find(c => c.prop === prop)?.fixed === 'right') return
    const idx = tempFixedColumns.value.indexOf(prop)
    idx >= 0 ? tempFixedColumns.value.splice(idx, 1) : tempFixedColumns.value.push(prop)
}

// 获取列固定状态（left/right/false）
const getFixedStatus = (col) => {
    if (col.fixed === 'right') return 'right'
    return fixedColumns.value.includes(col.prop) ? 'left' : false
}

// 保存列设置：临时状态 → 正式状态 + 缓存 + 接口保存
const onSaveSettings = async () => {
    const loading = ElLoading.service({ lock: true, text: '正在保存设置...' })
    try {
        // 同步正式状态
        localColumns.value = JSON.parse(JSON.stringify(tempLocalColumns.value))
        visibleColumns.value = [...tempVisibleColumns.value]
        fixedColumns.value = [...tempFixedColumns.value]
        tempWidths.value = { ...tempTempWidths.value }
        // 保存到本地缓存
        saveColumnOrder()
        saveVisibleColumns()
        saveFixedColumns()
        // 保存到接口
        const data = {
            type: 'tableConfig',
            mapKey: effectiveTableId.value,
            mapValue: JSON.stringify({
                fixedCols: fixedColumns.value,
                hiddenCols: allColProps.value.filter(prop => !visibleColumns.value.includes(prop)),
                sortCols: localColumns.value.map(c => ({ prop: c.prop, width: c.width }))
            })
        }
        await setUserUserConfigApi(data)
    } finally {
        showColSettings.value = false
        loading.close()
    }
}

// ========================== 6. 计算属性与样式函数 ==========================
// 过滤后可见的列（正式状态）
const filteredColumns = computed(() => localColumns.value.filter(col => visibleColumns.value.includes(col.prop)))

// 表格数据源（保持原数据，仅列过滤）
const filteredColumnsData = computed(() => props.tableData)

// 合计行计算函数
const computeSummary = (param) => {
    if (!props.footer) return []
    return param.columns.map(col => {
        if (col.type === 'index') return '合计' // 序号列显示“合计”
        return props.footer[col.property] || '' // 其他列显示footer对应值
    })
}

// 单元格类名计算（删除线 + 标红）
const getCellClassName = ({ row, column }) => {
    let cellClass = ''
    // 处理删除线
    if (props.strikeCondition && props.strikeCondition(row)) {
        const strikePropName = column.property || column.prop || column.label
        if (!props.excludeStrikeProps.includes(strikePropName)) cellClass += 'strikeCell '
    }
    // 处理文字标红
    if (props.redTextCondition && props.redTextCondition(row)) {
        const redTextPropName = column.property || column.prop || column.label
        if (!props.excludeRedTextProps.includes(redTextPropName)) cellClass += 'redTextCell'
    }
    return cellClass.trim()
}

// ========================== 7. 生命周期与监听 ==========================
// 组件挂载时初始化：缓存恢复 + 临时状态
onMounted(async () => {
    // 初始化可见列
    const savedVisible = localStorage.getItem(visibleStorageKey.value)
    if (savedVisible) {
        try {
            const hidden = JSON.parse(savedVisible)
            visibleColumns.value = allColProps.value.filter(prop => !hidden.includes(prop))
        } catch (e) {
            console.error('可见列缓存解析失败:', e)
            visibleColumns.value = [...allColProps.value]
        }
    } else visibleColumns.value = [...allColProps.value]

    // 初始化固定列
    const savedFixed = localStorage.getItem(fixedStorageKey.value)
    if (savedFixed) {
        try {
            fixedColumns.value = JSON.parse(savedFixed)
        } catch (e) {
            console.error('固定列缓存解析失败:', e)
            setDefaultFixedColumns()
        }
    } else setDefaultFixedColumns()

    // 获取自定义配置覆盖本地缓存
    if (effectiveTableId.value) {
        try {
            const res = await getUserUserConfigApi({
                mapKey: effectiveTableId.value,
                type: 'tableConfig'
            })

            if (res && res.success && res.data && res.data.mapValue) {
                const config = JSON.parse(res.data.mapValue)

                // 更新本地缓存，保证下次进入时能用
                localStorage.setItem(visibleStorageKey.value, JSON.stringify(config.hiddenCols || []))
                localStorage.setItem(fixedStorageKey.value, JSON.stringify(config.fixedCols || []))
                localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(config.sortCols || []))

                // 只有当配置确实改变时才刷新，避免不必要的抖动
                // 这里简单处理：如果有远程配置，直接应用远程配置
                if (config.hiddenCols) {
                    visibleColumns.value = allColProps.value.filter(prop => !config.hiddenCols.includes(prop))
                }
                if (config.fixedCols) {
                    fixedColumns.value = config.fixedCols
                }
                if (config.sortCols) {
                    // 重新排序 localColumns
                    const orderedColumns = []
                    const remainingColumns = [...props.columns]
                    config.sortCols.forEach(({ prop, width }) => {
                        const idx = remainingColumns.findIndex(c => c.prop === prop)
                        if (idx > -1) {
                            const col = remainingColumns.splice(idx, 1)[0]
                            col.width = width || col.width
                            orderedColumns.push(col)
                        }
                    })
                    orderedColumns.push(...remainingColumns)
                    localColumns.value = orderedColumns
                    // 更新列宽缓存
                    tempWidths.value = orderedColumns.reduce((obj, col) => {
                        obj[col.prop] = col.width || 100
                        return obj
                    }, {})
                }
            }
        } catch (err) {
            console.warn('获取表格自定义配置失败，使用默认配置', err)
        }
    }

    // 初始化临时状态
    initTempStates()
})

// 监听列配置变更，重新初始化
watch(() => props.columns, (newVal) => {
    localColumns.value = initColumns(newVal)
}, { deep: true, immediate: true })

// 监听正式状态变更，同步临时状态（避免弹窗数据不一致）
watch(localColumns, initTempStates, { deep: true })
watch(visibleColumns, () => {
    if (tempVisibleColumns.value.length === 0) tempVisibleColumns.value = [...visibleColumns.value]
})
watch(fixedColumns, () => {
    if (tempFixedColumns.value.length === 0) tempFixedColumns.value = [...fixedColumns.value]
})

// 监听列顺序/可见性/固定状态变更，自动保存缓存
watch(localColumns, saveColumnOrder, { deep: true })
watch(visibleColumns, saveVisibleColumns, { deep: true })
watch(fixedColumns, saveFixedColumns, { deep: true })
</script>

<style scoped>
/* ========================== 1. 基础容器样式 ========================== */
.table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* ========================== 2. 顶部按钮区样式 ========================== */
.table-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
}

.table-buttons-left {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex: 1;
}

.table-setting-icon:hover {
    cursor: pointer;
    color: #409eff;
}

#saveBtn {
    margin: 0 20px 0 0;
    font-size: 16px;
    padding: 1px 8px;
    background-color: #409eff;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
}

/* ========================== 3. 列设置弹窗样式 ========================== */
.setColumns {
    height: 450px;
    overflow: auto;
    padding: 0;

    /* 弹窗内复选框样式 */
    :deep(.el-checkbox) {
        width: 100%;
    }
}

.checkbox-item {
    padding: 0 8px;
    cursor: pointer;
}

.checkbox-item:hover {
    background-color: #ecf5ff;
}

.checkbox-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

/* 弹窗内按钮样式（预留） */
.configureButtons {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.configureBtnItem {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 15px;
}

.configureBtnItem:hover {
    color: #409eff;
}

/* 弹窗内复选框标签样式 */
:deep(.el-checkbox__label) {
    width: 100%;
    display: block;
}

/* ========================== 4. 拖拽与固定图标样式 ========================== */
/* 拖拽图标 */
.drag-handle {
    cursor: move;
    margin-right: 8px;
    color: #c0c4cc;
    font-size: 16px;
    transition: opacity 0.2s;
}

.drag-handle:hover:not(.disabled) {
    color: #409eff;
    opacity: 0.8;
}

.drag-handle:active:not(.disabled) {
    cursor: grabbing;
}

.drag-handle.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: auto;
}

/* 固定图标 */
.fixed-icon {
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.2s;
}

.fixed-icon.fixed {
    color: #409eff;
}

.fixed-icon.not-fixed {
    color: #c0c4cc;
}

.fixed-icon.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: auto;
}

.fixed-icon:hover:not(.disabled) {
    opacity: 0.8;
}

/* ========================== 5. 表格主体样式 ========================== */
/* 表头样式 */
:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}

/* 展开列隐藏样式（核心：隐藏默认展开图标列） */
/* :deep(.el-table__header-wrapper .el-table__expand-column),
:deep(.el-table__body-wrapper .el-table__expand-column) {
    display: none !important;
    width: 0 !important;
    padding: 0 !important;
} */

/* 按钮样式 */
:deep(.el-button) {
    margin-left: 8px;
}

/* 拖拽过程中样式 */
:deep(.ghost) {
    opacity: 0.5;
    background-color: #e6f7ff;
}

:deep(.dragging) {
    background-color: #fffbe6;
}

/* 默认展开行内容样式 */
.default-expand-content {
    padding: 10px;
    color: #999;
}

/* ========================== 6. 单元格特殊样式 ========================== */
/* 删除线样式 */
:deep(td.strikeCell) {
    text-decoration-line: line-through;
    text-decoration-color: red;
}

/* 文字标红样式 */
:deep(td.redTextCell) {
    color: red !important;
}

/* ========================== 7. 分页器样式 ========================== */
:deep(.el-pagination) {
    justify-content: center;
    margin: 13px 0;
}
</style>