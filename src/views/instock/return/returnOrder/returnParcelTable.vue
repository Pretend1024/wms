<template>
    <div class="table-container">
        <el-table :data="localData" border stripe :height="'95%'" style="width: 100%"
            :row-class-name="props.getRowClass" :show-summary="hasSummary" :summary-method="summaryMethod">
            <!-- 序号列（带加减） -->
            <el-table-column :label="indexLabel" width="55" fixed="left">
                <template #default="{ row, $index }">
                    <div class="index-cell">
                        <div>{{ $index + 1 }}</div>
                    </div>
                </template>
            </el-table-column>

            <!-- 动态数据列 -->
            <el-table-column v-for="(col, idx) in columns" :key="idx" :label="col.label" v-bind="getColumnProps(col)">
                <template v-if="col.slot" #default="scope">
                    <div :key="`${scope.$index}-${col.prop}`">
                        <slot :name="col.slot" v-bind="scope" />
                    </div>
                </template>
                <template v-if="col.headerSlot" #header="scope">
                    <slot :name="col.headerSlot" v-bind="scope" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed } from 'vue';

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    indexLabel: { type: String, default: '序号' },
    controlsVisible: { type: Boolean, default: true },
    getRowClass: { type: Function, default: () => ({}) },
    summaryColumns: { type: Array, default: () => [] },
    summaryLabel: { type: String, default: '合计' }
});
const emit = defineEmits(['update:data']);

const localData = reactive([]);

// 监听数据变化并同步到本地
watch(
    () => props.data,
    newVal => {
        if (!newVal || newVal.length === 0) {
            localData.splice(0, localData.length, { ...emptyRow() });
        } else {
            localData.splice(0, localData.length, ...newVal);
        }
    },
    { immediate: true }
);

// 创建空行
function emptyRow() {
    const row = {};
    // 初始化所有列
    props.columns.forEach(col => {
        row[col.prop] = '';
    });
    // 单独设置statusId的默认值为2
    row.statusId = 2;
    return row;
}

// 获取列属性
function getColumnProps(col) {
    const p = {};
    ['prop', 'width', 'fixed', 'showOverflowTooltip'].forEach(k => {
        if (col[k] !== undefined) p[k] = col[k];
    });
    return p;
}

// 合计
const hasSummary = computed(
    () => Array.isArray(props.summaryColumns) && props.summaryColumns.length > 0
);
function summaryMethod({ columns, data }) {
    if (!hasSummary.value) return [];
    return columns.map((col, index) => {
        if (index === 0) return props.summaryLabel;
        const prop = col.property || col.prop;
        if (props.summaryColumns.includes(prop)) {
            const sum = data.reduce((total, row) => {
                const v = parseFloat(row[prop]);
                return total + (isNaN(v) ? 0 : v);
            }, 0);
            return sum.toFixed(2);
        }
        return '';
    });
}
</script>

<style scoped lang="scss">
.table-container {
    position: relative;
    margin-bottom: 16px;
    height: 90%;
}

.index-cell {
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45px;
}

.btn-group {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    line-height: 19px;
    height: 100%;
    color: #409eff;
}

.btn {
    cursor: pointer;
    padding: 2px;
}

.btn:hover {
    background: #cecece;
    border-radius: 4px;
    transition: background 0.3s ease;
}

:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}

:deep(.el-table__cell) {
    padding: 5px 0;
}

:deep(.el-table__body-wrapper tbody tr.danger-row td) {
    background-color: #ffd4d4 !important;
}
</style>