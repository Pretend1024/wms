<template>
    <el-table :data="localData" border stripe :height="'100%'" style="width: 100%" :span-method="spanMethod"
        :row-class-name="props.getRowClass" :cell-class-name="cellClassName" :show-summary="hasSummary"
        :summary-method="summaryMethod">
        <!-- 序号列 -->
        <el-table-column :label="indexLabel" prop="index" width="85" fixed="left" v-if="controlsVisible">
            <template #default="{ row, $index }">
                <div v-if="isGroupStart(row)" class="group-start-cell">
                    <div>{{ groupOrder.indexOf(getGroupKey(row)) + 1 }}</div>
                    <!-- 只有在 controlsVisible 为 true 时才显示 btn-group -->
                    <div class="btn-group">
                        <span class="btn" @click="removeRow($index)">－</span>
                        <span class="btn" @click="addRow($index)">＋</span>
                    </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column :label="indexLabel" prop="index" width="55" fixed="left" v-else>
            <template #default="{ row, $index }">
                <div v-if="isGroupStart(row)" class="group-start-cell">
                    <div>{{ groupOrder.indexOf(getGroupKey(row)) + 1 }}</div>
                </div>
            </template>
        </el-table-column>

        <!-- 动态数据列 -->
        <el-table-column v-for="(col, idx) in columns" :key="idx" :label="col.label" v-bind="getColumnProps(col)">
            <template v-if="col.slot" #default="scope">
                <!-- 增加 key 强制重渲染，保证每行输入都生效 -->
                <div :key="`${scope.$index}-${col.prop}`">
                    <slot :name="col.slot" v-bind="scope" />
                </div>
            </template>
            <template v-if="col.headerSlot" #header="scope">
                <slot :name="col.headerSlot" v-bind="scope" />
            </template>
        </el-table-column>

        <!-- 固定在最后的操作列：组内增删，只有在 controlsVisible 为 true 时才渲染 -->
        <el-table-column v-if="hideOperationVisible ? !hideOperationVisible : controlsVisible" label="操作" fixed="right"
            width="130">
            <template #default="{ row, $index }">
                <el-button icon="Plus" @click="addInGroup(getGroupKey(row))" :disabled="localData.length >= 50" />
                <el-button icon="Minus" @click="removeInGroup(getGroupKey(row), $index)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed, defineExpose } from 'vue';

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    indexLabel: { type: String, default: '序号' },
    // 仅用于分组的键，请勿包含可编辑字段
    mergeKey: { type: [String, Array], required: true },
    // 仅用于显示合并效果，合并后该列所有行只渲染第一个单元格
    mergeCols: { type: Array, default: () => [] },
    mergeEnabled: { type: Boolean, default: true },
    // 控制 btn-group 和 最后操作列 的显示，默认都显示
    controlsVisible: { type: Boolean, default: true },
    hideOperationVisible: { type: Boolean, default: false },
    // 行样式
    getRowClass: { type: Function, default: () => ({}) },
    summaryColumns: { type: Array, default: () => [] },
    summaryLabel: { type: String, default: '合计' },
    // 传入列的 prop 数组，这些列将不应用 row-class-name 设置的背景色
    excludeRowClassCols: { type: Array, default: () => ['boxNo', 'index'] }
});
const emit = defineEmits(['update:data']);

const mergeKeys = Array.isArray(props.mergeKey) ? props.mergeKey : [props.mergeKey];
const mergeCols = props.mergeCols;
const localData = reactive([]);

watch(
    () => props.data,
    newVal => {
        if (!newVal || newVal.length === 0) {
            localData.splice(0, localData.length, { ...emptyRow() });
            emit('update:data', [...localData]);
        }
        else {
            localData.splice(0, localData.length, ...newVal);
        }
    },
    { immediate: true }
);

function emptyRow() {
    const row = {};
    props.columns.forEach(col => (row[col.prop] = ''));
    mergeKeys.forEach(k => (row[k] = k === 'boxBatch' ? `group_${Date.now()}` : ''));
    return row;
}

const groupOrder = computed(() => {
    const keys = [];
    localData.forEach(r => {
        const key = getGroupKey(r);
        if (!keys.includes(key)) keys.push(key);
    });
    return keys;
});

function getColumnProps(col) {
    const p = {};
    ['prop', 'width', 'fixed', 'showOverflowTooltip'].forEach(k => {
        if (col[k] !== undefined) p[k] = col[k];
    });
    return p;
}

function getGroupKey(row) {
    return mergeKeys.map(k => row[k]?.toString() || '').join('||');
}

function isGroupStart(row) {
    const key = getGroupKey(row);
    return localData.find(r => getGroupKey(r) === key) === row;
}

function countInGroup(row) {
    return localData.filter(r => getGroupKey(r) === getGroupKey(row)).length;
}

function addRow(index) {
    const size = countInGroup(localData[index]);
    localData.splice(index + size, 0, emptyRow());
    emit('update:data', [...localData]);
}

function removeRow(index) {
    const key = getGroupKey(localData[index]);
    for (let i = localData.length - 1; i >= 0; i--) {
        if (getGroupKey(localData[i]) === key) localData.splice(i, 1);
    }
    if (!localData.length) localData.push(emptyRow());
    emit('update:data', [...localData]);
}

function addInGroup(groupVal) {
    const idxs = localData.reduce((arr, r, i) => {
        if (getGroupKey(r) === groupVal) arr.push(i);
        return arr;
    }, []);
    const last = idxs[idxs.length - 1];
    if (last == null) return;
    // 仅复制分组键，其他字段留空
    const template = mergeKeys.reduce((o, k) => ((o[k] = localData[idxs[0]][k]), o), {});
    props.columns.forEach(col => {
        if (!mergeKeys.includes(col.prop)) template[col.prop] = '';
    });
    localData.splice(last + 1, 0, template);
    emit('update:data', [...localData]);
}

function removeInGroup(groupVal, currentIndex) {
    // 获取分组内所有行的索引
    const groupIdxs = localData.reduce((arr, r, i) => {
        if (getGroupKey(r) === groupVal) arr.push(i);
        return arr;
    }, []);

    // 分组内只剩一行时，删除整个分组；否则删除点击的当前行
    if (groupIdxs.length <= 1) {
        groupIdxs.forEach(i => localData.splice(i, 1));
    } else {
        // 校验索引有效性，防止异常
        if (groupIdxs.includes(currentIndex)) {
            localData.splice(currentIndex, 1);
        }
    }

    // 数据为空时补充空行
    if (!localData.length) {
        localData.push(emptyRow());
    }
    emit('update:data', [...localData]);
}

function spanMethod({ row, column }) {
    const isIndex = column.label === props.indexLabel;
    const mergeColumn = column.property && mergeCols.includes(column.property);
    if (!props.mergeEnabled || (!isIndex && !mergeColumn)) return { rowspan: 1, colspan: 1 };
    if (!isGroupStart(row)) return { rowspan: 0, colspan: 0 };
    return { rowspan: countInGroup(row), colspan: 1 };
}

function getTreeData() {
    return groupOrder.value.map(key => {
        const rows = localData.filter(r => getGroupKey(r) === key);
        return {
            ...mergeKeys.reduce((o, k) => ((o[k] = rows[0][k]), o), {}),
            boxQty: Number(rows[0].boxQty) || 1,
            skus: rows.map(r => {
                const o = { ...r };
                mergeKeys.forEach(k => delete o[k]);
                return o;
            })
        };
    });
}

// 统计
const hasSummary = computed(() => Array.isArray(props.summaryColumns) && props.summaryColumns.length > 0);
function summaryMethod({ columns, data }) {
    if (!hasSummary.value) return [];
    return columns.map((col, index) => {
        // 第一列显示合计文字
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

// 批量往指定分组添加多行
function addRowsToGroup(groupVal, rows) {
    const idxs = localData.reduce((arr, r, i) => {
        if (getGroupKey(r) === groupVal) arr.push(i);
        return arr;
    }, []);
    if (idxs.length === 0) return [];

    const last = idxs[idxs.length - 1];
    const addedRows = [];

    rows.forEach((row, idx) => {
        const template = mergeKeys.reduce((o, k) => {
            o[k] = localData[idxs[0]][k];
            return o;
        }, {});
        const newRow = { ...template, ...row };
        localData.splice(last + 1 + idx, 0, newRow);
        addedRows.push(newRow);
    });

    emit("update:data", [...localData]);
    return addedRows;
}

// 获取指定分组的最后一行
function getLastRowInGroup(groupVal) {
    const rows = localData.filter(r => getGroupKey(r) === groupVal);
    if (rows.length === 0) return null;
    return rows[rows.length - 1];
}

function cellClassName({ row, column, rowIndex, columnIndex }) {
    // 获取当前列的 prop (el-table 回调中通常使用 column.property)
    const prop = column.property || column.prop;
    // 如果当前列在排除列表中，添加样式类 'reset-cell-style'
    if (props.excludeRowClassCols && props.excludeRowClassCols.includes(prop)) {
        return 'reset-cell-style';
    }
    return '';
}


defineExpose({ getTreeData, getGroupKey, addRowsToGroup, getLastRowInGroup });
</script>

<style scoped lang="scss">
.group-start-cell {
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
}

.btn-group {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
    line-height: 26px;
    height: 100%;
    color: #409eff;
}

.btn {
    cursor: pointer;
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

:deep(.el-form-item) {
    margin: 1px;
}

:deep(.el-table__cell) {
    padding: 5px 0;
}

// 行样式
:deep(.el-table__body-wrapper tbody tr.danger-row td) {
    background-color: #ffd4d4 !important;
}

:deep(.el-table__body-wrapper tbody tr.red-row td) {
    background-color: #ffcbcb !important;
}

:deep(.el-table__body-wrapper tbody tr td.reset-cell-style) {
    background-color: #ffffff !important;
    // 如果你的表格在非高亮行是透明或有特定颜色，可以调整这里
}
</style>
