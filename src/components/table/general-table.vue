<template>
    <div class="table-container">
        <!-- 表格区域 -->
        <el-table :data="tableData" border style="width: 100%;height: 100%;" v-loading="loading"
            :row-style="getRowStyle" :show-summary="hasSummary" :summary-method="hasSummary ? summaryMethod : null">
            <el-table-column type="index" width="55" fixed align="center" label="序号"></el-table-column>

            <!-- 根据 columns 配置动态生成表格列 -->
            <el-table-column v-for="(col, index) in columns" :key="col.prop || index" :prop="col.prop"
                :label="col.label" :width="col.width" :fixed="col.fixed"
                :show-overflow-tooltip="col.showOverflowTooltip" :sortable="col.sortable">
                <!-- 列插槽支持 -->
                <template #default="scope">
                    <slot :name="col.slot" v-bind="{ row: scope.row, column: col, index: scope.$index }">
                        {{ scope.row[col.prop] }}
                    </slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    tableData: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    getRowStyle: {
        type: Function,
        default: () => { }
    },
    summaryColumns: {
        type: Array,
        default: () => []
    },
    summaryLabel: {
        type: String,
        default: '合计'
    }
})

// 是否显示统计行
const hasSummary = computed(() => props.summaryColumns.length > 0)
// 底部统计
function summaryMethod({ columns, data }) {
    if (!hasSummary.value) return []
    return columns.map((col, index) => {
        if (index === 0) return props.summaryLabel

        const prop = col.property || col.prop
        if (props.summaryColumns.includes(prop)) {
            const sum = data.reduce((total, row) => {
                const value = parseFloat(row[prop])
                return total + (isNaN(value) ? 0 : value)
            }, 0)
            return sum.toFixed(2)
        }
        return ''
    })
}
</script>

<style scoped>
.table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 表头样式 */
::v-deep .el-table__header-wrapper th {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}
</style>
