<template>
    <div class="table-container">
        <slot name="button"></slot>
        <el-table :data="localData" border stripe style="width: 100%" :row-class-name="props.getRowClass"
            :show-summary="hasSummary" :summary-method="summaryMethod">
            <el-table-column :label="indexLabel" width="55" fixed="left">
                <template #default="{ $index }">
                    <div class="row-index-cell">
                        <div style="font-size: 15px;">{{ $index + 1 }}</div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column v-for="(col, idx) in columns" :key="idx" v-bind="getColumnProps(col)">
                <template #header>
                    <span>{{ col.label }}</span>
                    <span v-if="col.required" style="color: #f56c6c; margin-right: 4px;">*</span>
                </template>

                <template v-if="col.slot" #default="scope">
                    <div :key="`${scope.$index}-${col.prop}`">
                        <slot :name="col.slot" v-bind="scope" />
                    </div>
                </template>

                <template v-if="col.headerSlot" #header="scope">
                    <slot :name="col.headerSlot" v-bind="scope" />
                </template>
            </el-table-column>

            <el-table-column label="操作" width="130" fixed="right" v-if="controlsVisible">
                <template #default="{ $index }">
                    <div class="btn-group">
                        <el-button icon="Plus" @click="addRowAtEnd" />
                        <el-button icon="Minus" @click="removeRow($index)" />
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed, defineExpose } from 'vue';

const props = defineProps({
    // columns 项现在支持 required: true 属性
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    indexLabel: { type: String, default: '序号' },
    controlsVisible: { type: Boolean, default: true },
    addButtonText: { type: String, default: '添加行' },
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
        if (!newVal || newVal.length === 0) localData.splice(0, localData.length, { ...emptyRow() });
        else localData.splice(0, localData.length, ...newVal);
    },
    { immediate: true }
);

// 创建空行
function emptyRow() {
    const row = {};
    props.columns.forEach(col => (row[col.prop] = ''));
    return row;
}

// 获取列属性 (过滤掉非原生的 el-table-column 属性，如 required 和 slot)
function getColumnProps(col) {
    const p = {};
    ['prop', 'width', 'fixed', 'showOverflowTooltip', 'align'].forEach(k => {
        if (col[k] !== undefined) p[k] = col[k];
    });
    return p;
}

// 在表格末尾添加新行
function addRowAtEnd() {
    localData.push(emptyRow());
    emit('update:data', [...localData]);
}

// 在指定位置后添加新行
function addRow(index) {
    localData.splice(index + 1, 0, emptyRow());
    emit('update:data', [...localData]);
}

// 删除指定行
function removeRow(index) {
    localData.splice(index, 1);
    if (!localData.length) localData.push(emptyRow());
    emit('update:data', [...localData]);
}

// 统计相关
const hasSummary = computed(() => Array.isArray(props.summaryColumns) && props.summaryColumns.length > 0);
function summaryMethod({ columns, data }) {
    if (!hasSummary.value) return [];
    return columns.map((col, index) => {
        if (index === 0) {
            return props.summaryLabel;
        }
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

// 暴露方法
defineExpose({
    getData: () => [...localData]
});
</script>

<style scoped lang="scss">
/* 样式部分保持不变 */
.table-container {
    position: relative;
    margin-bottom: 16px;
    height: 90%;
}

.row-index-cell {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 34px;
}

.btn-group {
    display: flex;
    gap: 8px;
    justify-content: center;
}

:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}

:deep(.el-form-item) {
    margin: 1px;
}

:deep(.el-table__cell) {
    padding: 5px 0;
}

:deep(.el-table__body-wrapper tbody tr.danger-row td) {
    background-color: #ffd4d4 !important;
}

:deep(.el-table__inner-wrapper:before) {
    width: auto !important;
}
</style>