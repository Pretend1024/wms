<template>
    <div class="table-container" :class="{ 'hide-expand-icon': hideExpandIcon }">

        <div class="table-buttons">
            <div class="table-buttons-left">
                <slot name="table-buttons"></slot>
            </div>

            <el-popover placement="bottom" width="400" trigger="click" v-model:visible="showColSettings">
                <div v-if="showColSettings">
                    <div style="display: flex; justify-content: space-between;align-items: center;">
                        <h4 style="margin: 0;">{{ getButtonText('columnSetting') }}</h4>
                        <p id="saveBtn" @click="onSaveSettings">{{ getButtonText('apply') }}</p>
                    </div>
                    <ul class="setColumns">
                        <el-checkbox-group v-model="tempVisibleColumns">
                            <draggable v-model="tempLocalColumns" :animation="150" handle=".drag-handle"
                                :disabled="false">
                                <template #item="{ element: col }">
                                    <li v-if="col.prop" class="checkbox-item" :key="col.prop">
                                        <el-checkbox :label="col.prop">
                                            <div class="checkbox-content" @click.stop.prevent>
                                                <p>{{ getColumnText(col.prop) }}</p>
                                                <el-input type="number" v-model="tempTempWidths[col.prop]"
                                                    style="width: 80px;margin:0 15px 0 auto;"
                                                    @blur="handleWidthBlurTemp(col.prop)" />
                                                <div style="display: flex; align-items: center;">
                                                    <el-icon
                                                        :class="['drag-handle', col.fixed === 'right' ? 'disabled' : '']">
                                                        <i class="iconfont icon-tuodong" style="font-size: 22px;" />
                                                    </el-icon>
                                                    <el-icon :class="[
                                                        'fixed-icon',
                                                        tempFixedColumns.includes(col.prop) ? 'fixed' : 'not-fixed',
                                                        col.fixed === 'right' ? 'disabled' : ''
                                                    ]"
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
                </div>
                <template #reference>
                    <el-icon size="20" color="#999" class="table-setting-icon">
                        <Setting />
                    </el-icon>
                </template>
            </el-popover>
        </div>

        <div class="vxe-table-wrapper">
            <div class="vxe-table-wrapper">
                <vxe-grid ref="vxeTableRef" v-bind="gridOptions" :loading="loading" :height="'100%'"
                    :columns="finalColumns" :data="tableData" @checkbox-change="handleSelectionChange"
                    @checkbox-all="handleSelectionChange" @checkbox-range-change="handleSelectionChange"
                    @cell-click="handleCellClick" @sort-change="handleSortChange" @filter-change="handleFilterChange"
                    @menu-click="handleMenuClick" @toggle-row-expand="handleToggleExpand">

                    <template v-for="col in slotColumns" :key="col.prop" #[col.slot]="{ row, column, rowIndex }">
                        <slot :name="col.slot" v-bind="{ row, column, index: rowIndex }">
                            {{ row[col.prop] }}
                        </slot>
                    </template>

                    <template #expand_content="{ row, rowIndex }">
                        <slot name="expand" :row="row" :row-key="row[rowKey]" :index="rowIndex">
                            <div class="default-expand-content">请通过「expand」插槽自定义展开内容</div>
                        </slot>
                    </template>

                    <template #seq_default="{ rowIndex }">
                        {{ calculateIndex(rowIndex) }}
                    </template>

                </vxe-grid>
            </div>
        </div>

        <div class="table-pagination">
            <el-pagination v-if="pagination" background layout="total, sizes, prev, pager, next, jumper"
                :current-page="pagination.currentPage" :page-size="pagination.pageSize" :page-sizes="pageSizes"
                :total="pagination.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>

<script setup>
/**
 * =========================================================
 * 1. 依赖导入
 * =========================================================
 */
import { defineProps, defineEmits, computed, ref, watch, onMounted, nextTick, defineExpose, shallowRef, reactive, markRaw, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { Setting } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { ElLoading, ElMessage } from 'element-plus'
import { setUserUserConfigApi, getUserUserConfigApi } from '@/api/sysApi/user.js'
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import { getButtonText } from '@/utils/i18n/i18nLabels.js'

/**
 * =========================================================
 * 2. Props 定义 (组件接收参数)
 * =========================================================
 */
const props = defineProps({
    /** 表格数据源 */
    tableData: { type: Array, default: () => [] },
    /**
     * 列配置数组
     * 结构: [{ 
     * label: '标题', 
     * prop: '字段名', 
     * width: 100, 
     * filters: [{label: '男', value: 1}], // 筛选选项
     * filterMethod: ({value, row}) => boolean // 自定义前端筛选逻辑
     * }]
     */
    columns: { type: Array, default: () => [] },
    /** 分页配置 { currentPage, pageSize, total } */
    pagination: { type: Object, default: () => ({}) },
    /** 是否开启左侧多选框 */
    enableSelection: { type: Boolean, default: false },
    /** Loading 状态 */
    loading: { type: Boolean, default: false },
    /** 每页条数选项 */
    pageSizes: { type: Array, default: () => [20, 50, 100, 200, 500] },
    /** 表格唯一ID (用于缓存列配置到后端) */
    tableId: { type: String, default: 'default' },
    /** 合计行数据对象 */
    footer: { type: Object, default: null },
    /** 是否为树形表格 */
    isTree: { type: Boolean, default: false },
    /** 行数据的主键字段名 */
    rowKey: { type: String, default: 'id' },
    /** 树形结构配置 */
    treeProps: { type: Object, default: () => ({ children: 'children', hasChildren: 'hasChildren' }) },
    /** 是否默认展开所有树节点 */
    defaultExpandAll: { type: Boolean, default: false },
    /** 行删除线条件函数 (row) => boolean */
    strikeCondition: { type: Function, default: null },
    /** 不应用删除线的列字段名数组 */
    excludeStrikeProps: { type: Array, default: () => [] },
    /** 是否保留展开状态(需要配置 expand 插槽) */
    preserveExpanded: { type: Boolean, default: false },
    /** 行红字条件函数 (row) => boolean */
    redTextCondition: { type: Function, default: null },
    /** 不应用红字的列字段名数组 */
    excludeRedTextProps: { type: Array, default: () => [] },
    /** 是否隐藏默认的展开小箭头 */
    hideExpandIcon: { type: Boolean, default: true }
})

/**
 * =========================================================
 * 3. Emits 定义 (组件发出事件)
 * =========================================================
 */
const emit = defineEmits([
    'selection-change', // 选中行变化
    'row-click',        // 行点击
    'page-change',      // 分页变化 {pageSize, currentPage}
    'sort-change',      // 排序变化
    'filter-change',    // 筛选变化 (前端筛选模式下通常无需处理，但仍会抛出)
    'column-order-change', // 列设置变化
    'expand'            // 展开/收起
])

// 内部状态
const tableRefreshKey = ref(0) // 强制刷新 Key
const vxeTableRef = ref(null)  // 表格实例引用

/**
 * =========================================================
 * 4. 右键菜单配置 (复制 & 导出)
 * =========================================================
 */
const menuConfig = reactive({
    header: {
        options: [
            [{ code: 'copy', name: '复制', prefixIcon: 'vxe-icon-copy' }],
            [{
                code: 'export', name: '导出数据', prefixIcon: 'vxe-icon-download',
                children: [
                    { code: 'export_csv', name: '导出 CSV (.csv)' },
                    { code: 'export_xlsx', name: '导出 Excel (.xlsx)' },
                    { code: 'export_txt', name: '导出 TXT (.txt)' },
                    { code: 'export_html', name: '导出 HTML (.html)' },
                    { code: 'export_xml', name: '导出 XML (.xml)' }
                ]
            }]
        ]
    },
    body: {
        options: [[{ code: 'copy', name: '复制', prefixIcon: 'vxe-icon-copy' }]]
    }
})

/**
 * 处理右键菜单点击
 */
const handleMenuClick = ({ menu, type, row, column, content }) => {
    // 1. 复制功能
    if (menu.code === 'copy') {
        let textToCopy = '';

        // [情况1：表头] 复制列标题
        if (type === 'header' && column) {
            textToCopy = column.title;
        } else {
            // [情况2：内容]
            // 优先检查是否有原生的文本选择 (鼠标拖拽选中的内容)
            const activeSelection = window.getSelection ? window.getSelection().toString() : '';

            // 如果有选中文本，且不是纯空格，则复制选中文本
            if (activeSelection && activeSelection.trim().length > 0) {
                textToCopy = activeSelection;
            } else {
                // [情况3：单元格自动获取]
                // 如果没有选中文本，则尝试获取当前单元格的数据

                // 3.1 尝试直接从行数据 row 中获取
                if (row && column && column.field) {
                    const cellValue = row[column.field];
                    // 确保 0 或 false 也能被复制，排除 null/undefined
                    if (cellValue !== null && cellValue !== undefined) {
                        textToCopy = String(cellValue);
                    }
                }

                // 3.2 兜底：如果行数据没取到，使用 content (vxe-table 传入的显示内容，可能因 slot 为空)
                if (!textToCopy && content) {
                    textToCopy = String(content);
                }
            }
        }

        if (textToCopy) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    ElMessage.success('复制成功')
                }).catch(() => fallbackCopyTextToClipboard(textToCopy))
            } else {
                fallbackCopyTextToClipboard(textToCopy)
            }
        }
        return
    }
    // 2. 导出功能
    const exportMap = {
        'export_csv': 'csv', 'export_xlsx': 'xlsx',
        'export_txt': 'txt', 'export_html': 'html', 'export_xml': 'xml'
    }
    if (exportMap[menu.code]) {
        vxeTableRef.value.exportData({
            type: exportMap[menu.code], original: true,
            filename: `Export_${new Date().getTime()}`, message: true, useStyle: true
        })
    }
}

// 降级复制方案 (兼容旧浏览器)
const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) ElMessage.success('复制成功');
        else ElMessage.warning('复制失败');
    } catch (err) { }
    document.body.removeChild(textArea);
}

/**
 * =========================================================
 * 5. 表格核心逻辑
 * =========================================================
 */

// 计算序号 (当前页 * 页大小 + 索引)
const calculateIndex = (currentPageIndex) => {
    const { currentPage: page = 1, pageSize: size = 20 } = props.pagination || {};
    const validPage = Number(page) || 1;
    const validSize = Number(size) || 20;
    const validIndex = Number(currentPageIndex) || 0;
    return (validPage - 1) * validSize + validIndex + 1;
};

// 暴露方法：通过 Key 展开行
const expandRowByKey = (key) => {
    if (!vxeTableRef.value || !props.tableData) return
    const row = props.tableData.find(r => r[props.rowKey] === key)
    if (row) {
        vxeTableRef.value.setRowExpand(row, true)
        row.isExpanded = true
        emit('expand', row, true)
    }
}

// 暴露方法：通过 Key 收起行
const collapseRowByKey = (key) => {
    if (!vxeTableRef.value || !props.tableData) return
    const row = props.tableData.find(r => r[props.rowKey] === key)
    if (row) {
        vxeTableRef.value.setRowExpand(row, false)
        row.isExpanded = false
        emit('expand', row, false)
    }
}

// 暴露组件实例和方法
defineExpose({ elTableRef: vxeTableRef, expandRowByKey, collapseRowByKey })

// 自动清空选中逻辑：当 tableData 数据源变化时触发
watch(() => props.tableData, () => {
    nextTick(() => {
        const $table = vxeTableRef.value
        if ($table) {
            $table.clearCheckboxRow() // 清空复选
            $table.clearRadioRow()    // 清空单选
            $table.clearCurrentRow()  // 清空高亮
            emit('selection-change', []) // 通知父组件
        }
    })
})

// 多选事件透传
const handleSelectionChange = ({ records }) => {
    emit('selection-change', records)
}

// 单元格点击事件透传
const handleCellClick = ({ row }) => {
    emit('row-click', row)
}

// 排序事件透传
const handleSortChange = ({ property, order }) => {
    const colConfig = localColumns.value.find(c => c.prop === property)
    const sortField = colConfig?.sortAlias || property
    let mappedOrder = ''
    if (order === 'asc') mappedOrder = 'asc'
    if (order === 'desc') mappedOrder = 'desc'
    const sortString = property && order ? `${sortField} ${mappedOrder}` : ''
    emit('sort-change', sortString)
}

// 筛选事件透传
const handleFilterChange = ({ column, property, values }) => {
    const filterPayload = { prop: property, values: values, column: column }
    emit('filter-change', filterPayload)
}

// 展开/收起事件
const handleToggleExpand = ({ row, expanded }) => {
    try { row.isExpanded = expanded } catch (e) { }
    emit('expand', row, expanded)
}

// 底部合计行渲染
const footerMethod = ({ columns }) => {
    if (!props.footer) return []
    return [columns.map(col => {
        if (col.type === 'seq') return '合计'
        return props.footer[col.field] || ''
    })]
}

// 动态单元格样式 (删除线、红字)
const getCellClassNameAdaptor = ({ row, column }) => {
    let cellClass = ''
    const prop = column.field
    if (props.strikeCondition && props.strikeCondition(row)) {
        if (!props.excludeStrikeProps.includes(prop)) cellClass += 'strikeCell '
    }
    if (props.redTextCondition && props.redTextCondition(row)) {
        if (!props.excludeRedTextProps.includes(prop)) cellClass += 'redTextCell'
    }
    return cellClass.trim()
}

// 分页变更处理
const handleSizeChange = (newSize) => {
    emit('page-change', { pageSize: newSize, currentPage: props.pagination.currentPage })
    nextTick(() => vxeTableRef.value?.scrollTo(0, 0))
}
const handleCurrentChange = (newPage) => {
    emit('page-change', { pageSize: props.pagination.pageSize, currentPage: newPage })
    nextTick(() => vxeTableRef.value?.scrollTo(0, 0))
}

/**
 * =========================================================
 * 6. 列设置与持久化 (排序/显隐/固定)
 * =========================================================
 */
const localColumns = shallowRef([]) // 实际渲染的列数据
const tempWidths = ref({}) // 列宽缓存
const visibleColumns = ref([]) // 可见列 keys
const fixedColumns = ref([]) // 固定列 keys
const showColSettings = ref(false) // 弹窗显示控制
const route = useRoute()

// 生成缓存用的 Key
const effectiveTableId = computed(() => props.tableId === 'default' ? route.fullPath : props.tableId)
const visibleStorageKey = computed(() => `visibleCol-${effectiveTableId.value}`)
const fixedStorageKey = computed(() => `fixedCol-${effectiveTableId.value}`)
const columnOrderStorageKey = computed(() => `sortCol-${effectiveTableId.value}`)
const allColProps = computed(() => localColumns.value.map(col => col.prop))

// 初始化列配置：合并 props 和 缓存
const initColumns = (columns) => {
    const savedOrderStr = localStorage.getItem(columnOrderStorageKey.value)
    if (savedOrderStr) {
        try {
            const savedOrder = JSON.parse(savedOrderStr)
            const orderedColumns = []
            const remainingColumns = [...columns]
            // 按照缓存顺序重排列
            savedOrder.forEach(({ prop, width }) => {
                const idx = remainingColumns.findIndex(c => c.prop === prop)
                if (idx > -1) {
                    const col = remainingColumns.splice(idx, 1)[0]
                    col.width = width || col.width
                    orderedColumns.push(col)
                }
            })
            orderedColumns.push(...remainingColumns)
            tempWidths.value = orderedColumns.reduce((obj, col) => {
                obj[col.prop] = col.width || 100
                return obj
            }, {})
            return orderedColumns.map(col => markRaw(toRaw(col)))
        } catch (e) { console.error('列缓存解析失败:', e) }
    }
    tempWidths.value = columns.reduce((obj, col) => {
        obj[col.prop] = col.width || 100
        return obj
    }, {})
    const defaultCache = columns.map(col => ({ prop: col.prop, width: col.width || 100 }))
    localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(defaultCache))
    return columns.map(col => markRaw(toRaw(col)))
}

// 临时状态变量 (用于设置弹窗中操作，不立即影响表格)
const tempLocalColumns = ref([])
const tempVisibleColumns = ref([])
const tempFixedColumns = ref([])
const tempTempWidths = ref({})

// 初始化临时状态
const initTempStates = () => {
    tempLocalColumns.value = JSON.parse(JSON.stringify(localColumns.value))
    tempVisibleColumns.value = [...visibleColumns.value]
    tempFixedColumns.value = [...fixedColumns.value]
    tempTempWidths.value = { ...tempWidths.value }
}

// 保存列顺序到缓存
const saveColumnOrder = () => {
    const orderData = localColumns.value.map(c => ({
        prop: c.prop, width: c.width || tempWidths.value[c.prop] || 100
    }))
    localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(orderData))
    emit('column-order-change', localColumns.value)
}

// 保存可见列到缓存
const saveVisibleColumns = () => {
    const hidden = allColProps.value.filter(prop => !visibleColumns.value.includes(prop))
    localStorage.setItem(visibleStorageKey.value, JSON.stringify(hidden))
}

// 保存固定列到缓存
const saveFixedColumns = () => {
    localStorage.setItem(fixedStorageKey.value, JSON.stringify(fixedColumns.value))
}

// 设置默认固定列
const setDefaultFixedColumns = () => {
    const defaultFixedProps = localColumns.value.filter(col => col.fixed === 'left').map(col => col.prop)
    fixedColumns.value = defaultFixedProps
    saveFixedColumns()
}

// 弹窗内修改列宽
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

// 弹窗内切换固定状态
const toggleFixedTemp = (prop) => {
    if (tempLocalColumns.value.find(c => c.prop === prop)?.fixed === 'right') return
    const idx = tempFixedColumns.value.indexOf(prop)
    idx >= 0 ? tempFixedColumns.value.splice(idx, 1) : tempFixedColumns.value.push(prop)
}

// 计算列的 fixed 属性值
const getFixedStatus = (col) => {
    if (col.fixed === 'right') return 'right'
    return fixedColumns.value.includes(col.prop) ? 'left' : undefined
}

// 保存设置 (点击应用按钮)
const onSaveSettings = async () => {
    try {
        localColumns.value = JSON.parse(JSON.stringify(tempLocalColumns.value))
        visibleColumns.value = [...tempVisibleColumns.value]
        fixedColumns.value = [...tempFixedColumns.value]
        tempWidths.value = { ...tempTempWidths.value }
        saveColumnOrder()
        saveVisibleColumns()
        saveFixedColumns()
        tableRefreshKey.value++ // 更新 Key 强制重绘表格
        const data = {
            type: 'tableConfig', mapKey: effectiveTableId.value,
            mapValue: JSON.stringify({
                fixedCols: fixedColumns.value,
                hiddenCols: allColProps.value.filter(prop => !visibleColumns.value.includes(prop)),
                sortCols: localColumns.value.map(c => ({ prop: c.prop, width: c.width }))
            })
        }
        await setUserUserConfigApi(data)
    } finally {
        showColSettings.value = false
    }
}

// 计算当前应渲染的列
const filteredColumns = computed(() => localColumns.value.filter(col => visibleColumns.value.includes(col.prop)))

// 初始化生命周期
onMounted(async () => {
    // 1. 恢复本地缓存 (显隐/固定)
    const savedVisible = localStorage.getItem(visibleStorageKey.value)
    if (savedVisible) {
        try {
            const hidden = JSON.parse(savedVisible)
            visibleColumns.value = allColProps.value.filter(prop => !hidden.includes(prop))
        } catch (e) { visibleColumns.value = [...allColProps.value] }
    } else visibleColumns.value = [...allColProps.value]

    const savedFixed = localStorage.getItem(fixedStorageKey.value)
    if (savedFixed) {
        try { fixedColumns.value = JSON.parse(savedFixed) }
        catch (e) { setDefaultFixedColumns() }
    } else setDefaultFixedColumns()

    // 2. 尝试从后端同步配置
    if (effectiveTableId.value) {
        try {
            const res = await getUserUserConfigApi({ mapKey: effectiveTableId.value, type: 'tableConfig' })
            if (res && res.success && res.data && res.data.mapValue) {
                const config = JSON.parse(res.data.mapValue)
                localStorage.setItem(visibleStorageKey.value, JSON.stringify(config.hiddenCols || []))
                localStorage.setItem(fixedStorageKey.value, JSON.stringify(config.fixedCols || []))
                localStorage.setItem(columnOrderStorageKey.value, JSON.stringify(config.sortCols || []))

                if (config.hiddenCols) visibleColumns.value = allColProps.value.filter(prop => !config.hiddenCols.includes(prop))
                if (config.fixedCols) fixedColumns.value = config.fixedCols
                if (config.sortCols) {
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
                    tempWidths.value = orderedColumns.reduce((obj, col) => {
                        obj[col.prop] = col.width || 100
                        return obj
                    }, {})
                }
            }
        } catch (err) { }
    }
    initTempStates()
})

// 监听列配置变更
watch(() => props.columns, (newVal) => {
    localColumns.value = initColumns(newVal)
}, { immediate: true })

watch(localColumns, initTempStates)
watch(visibleColumns, () => {
    if (tempVisibleColumns.value.length === 0) tempVisibleColumns.value = [...visibleColumns.value]
})
watch(fixedColumns, () => {
    if (tempFixedColumns.value.length === 0) tempFixedColumns.value = [...fixedColumns.value]
})

/**
 * =========================================================
 * 7. [新增] Vxe-Grid 核心配置 (替代原 vxe-table 模板写法)
 * =========================================================
 */

// 1. 构造传递给 vxe-grid 的最终列配置
const finalColumns = computed(() => {
    const cols = []

    // (1) 多选列
    if (props.enableSelection) {
        cols.push({ type: 'checkbox', width: 50, align: 'center', fixed: 'left' })
    }

    // (2) 展开列 (对应原模板中的 <vxe-column type="expand">)
    if (props.preserveExpanded) {
        cols.push({
            type: 'expand',
            width: 50,
            fixed: 'left',
            align: 'center',
            // 关键：告诉 Grid 这一列的内容去寻找名为 'expand_content' 的插槽
            slots: { content: 'expand_content' }
        })
    }

    // (3) 序号列 (对应原模板中的 <vxe-column type="seq">)
    cols.push({
        type: 'seq',
        width: 60,
        fixed: 'left',
        align: 'center',
        title: getColumnText('index'),
        slots: { default: 'seq_default' } // 自定义序号插槽
    })

    // (4) 业务数据列 (将 filteredColumns 转换为 Grid 需要的格式)
    // 这里不需要再用 toRaw/markRaw，因为 filteredColumns 已经是优化过的了
    const bizCols = filteredColumns.value.map((col, index) => {
        // 构造基础配置
        const gridCol = {
            field: col.prop,
            title: getColumnText(col.prop),
            width: col.width,
            fixed: getFixedStatus(col),
            sortable: col.sortable,
            filters: col.filters,
            filterMultiple: col.filterMultiple !== false,
            filterMethod: col.filterMethod,
            align: 'left',
            headerAlign: 'left',
            treeNode: props.isTree && index === 0, // 树形结构首列
            showOverflow: col.showOverflow,        // 按需 Tooltip
            slots: {}
        }

        // 如果业务列定义了插槽 (col.slot)，则映射到 slots.default
        if (col.slot) {
            gridCol.slots.default = col.slot
        }

        return gridCol
    })

    return [...cols, ...bizCols]
})

// 2. 计算需要动态渲染插槽的列 (用于模板循环)
const slotColumns = computed(() => {
    // 只有那些定义了 slot 属性的业务列才需要生成 <template #[slot]>
    return props.columns.filter(col => col.slot)
})

// 3. Grid 通用配置 (原本写在 <vxe-table> 标签上的属性)
const gridOptions = reactive({
    border: true,
    round: true,
    stripe: true,
    showOverflow: false,
    size: "mini",
    rowConfig: { keyField: props.rowKey, isCurrent: true, isHover: true, height: 40 },
    columnConfig: { resizable: true },
    headerRowConfig: { height: 40 },
    checkboxConfig: { range: !props.isTree },
    mouseConfig: { selected: true },
    filterConfig: { remote: false },
    menuConfig: menuConfig,
    scrollX: { enabled: true, gt: 10 },
    treeConfig: props.isTree ? { transform: false, rowField: props.rowKey, children: props.treeProps.children } : undefined,
    scrollY: { enabled: !props.preserveExpanded, gt: 20 },
    showFooter: props.footer !== null,
    footerMethod: footerMethod,
    cellClassName: getCellClassNameAdaptor
})
</script>

<style scoped lang="scss">
/* 布局容器 */
.table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fff;
}

.vxe-table-wrapper {
    height: 100%;
    flex: 1;
    overflow: hidden;
    min-height: 0;
}

/* 顶部按钮区 */
.table-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    flex-shrink: 0;
}

.table-buttons-left {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex: 1;
    width: 98%;
}

/* 底部区域 */
.table-pagination {
    flex-shrink: 0;
    border-top: 1px solid #ebeef5;
    background: #fff;
    padding: 5px 0;
}

:deep(.el-pagination) {
    justify-content: center;
    margin: 0;
}

/* Vxe-Table 样式重写 */
:deep(.vxe-table--body-wrapper) {
    will-change: scroll-position;
    transform: translateZ(0);

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #dcdfe6;
        border-radius: 3px;

        &:hover {
            background: #c0c4cc;
        }
    }

    &::-webkit-scrollbar-track {
        background: #f5f7fa;
    }
}

:deep(.vxe-header--column) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-weight: 700;
    font-size: 15px !important;
    line-height: 30px;
}

:deep(.vxe-body--column) {
    font-size: 14px !important;
    color: #606266;
    padding: 2px 0 !important;
    height: 40px !important;
}

/* 底部合计行 */
:deep(.vxe-footer--column) {
    background-color: #fff !important;
    color: #606266;
    font-weight: normal;
    font-size: 14px !important;
    border-top: 1px solid #ebeef5;
}

/* 复选框美化 */
:deep(.vxe-checkbox--icon) {
    font-size: 18px;
    transform: scale(1.05);
    font-weight: 100;
}

:deep(.vxe-checkbox--checked .vxe-checkbox--icon) {
    color: #409eff;
}

/* 边框颜色 */
:deep(.vxe-table--border-line) {
    border-color: #ebeef5;
}

/* =========================================================
   设置选中行和鼠标悬停行的背景色为 #ffdab9
   ========================================================= */
:deep(.vxe-table--render-default .vxe-body--row.row--current) {
    background-color: #ffdab9 !important;
}

:deep(.vxe-table--render-default .vxe-body--row.row--current>.vxe-body--column) {
    background-color: #ffdab9 !important;
}

:deep(.vxe-table--render-default .vxe-body--column.col--selected) {
    box-shadow: inset 0 0 0 2px #ffb575;
}


/* 辅助样式 */
.table-setting-icon:hover {
    cursor: pointer;
    color: #409eff;
}

#saveBtn {
    margin: 0 20px 0 0;
    font-size: 14px;
    padding: 1px 12px;
    background-color: #409eff;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}

.setColumns {
    height: 450px;
    overflow: auto;
    padding: 0;

    :deep(.el-checkbox) {
        width: 100%;
    }
}

.checkbox-item {
    padding: 0 8px;
    cursor: pointer;

    &:hover {
        background-color: #ecf5ff;
    }
}

.checkbox-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

:deep(.el-checkbox__label) {
    width: 100%;
    display: block;
}

.drag-handle {
    cursor: move;
    margin-right: 8px;
    color: #c0c4cc;
    font-size: 16px;
    transition: opacity 0.2s;

    &:hover:not(.disabled) {
        color: #409eff;
        opacity: 0.8;
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
}

.fixed-icon {
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;

    &.fixed {
        color: #409eff;
    }

    &.not-fixed {
        color: #c0c4cc;
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    &:hover:not(.disabled) {
        opacity: 0.8;
    }
}

:deep(.el-button) {
    margin-left: 8px;
    margin-bottom: 2px;
    margin-top: 2px;
}

.default-expand-content {
    padding: 10px;
    color: #999;
}

:deep(.strikeCell) {
    text-decoration-line: line-through;
    text-decoration-color: red;
}

:deep(.redTextCell) {
    color: red !important;
}

:deep(.vxe-table--render-default .vxe-cell--checkbox .vxe-checkbox--icon) {
    font-weight: 100 !important;
}

:deep(.vxe-body--expanded-cell) {
    padding: 0 !important;
    /* 提升层级，防止被某些固定列遮挡 */
    z-index: 99 !important;
}

/* 针对展开行内容的优化 */
:deep(.vxe-body--expanded-cell) {
    will-change: transform;
    /* 独立渲染层 */
    transform: translateZ(0);
    padding: 0 !important;
    /* 减少盒模型计算 */
}

/* 再次确保单元格不换行 */
:deep(.vxe-body--column.col--ellipsis) {
    height: 40px !important;
}
</style>