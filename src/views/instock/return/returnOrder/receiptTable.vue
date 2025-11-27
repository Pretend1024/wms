<template>
    <el-table :data="localData" border stripe :height="'100%'" style="width: 100%" :span-method="spanMethod"
        :row-class-name="props.getRowClass" :show-summary="hasSummary" :summary-method="summaryMethod">
        <!-- 序号列（带加减） -->
        <el-table-column :label="indexLabel" width="55" fixed="left">
            <template #default="{ row, $index }">
                <div v-if="isGroupStart(row)" class="group-start-cell">
                    <div>{{ groupOrder.indexOf(getGroupKey(row)) + 1 }}</div>
                </div>
            </template>
        </el-table-column>

        <!-- 动态列 -->
        <el-table-column v-for="(col, idx) in columns" :key="idx" :label="col.label" v-bind="getColumnProps(col)">
            <!-- 自定义单元格插槽 -->
            <template v-if="col.slot" #default="scope">
                <div :key="`${scope.$index}-${col.prop}`">
                    <slot :name="col.slot" v-bind="scope" />
                </div>
            </template>

            <!-- 自定义表头插槽 -->
            <template v-if="col.headerSlot" #header="scope">
                <slot :name="col.headerSlot" v-bind="scope" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed, defineExpose } from "vue";

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    indexLabel: { type: String, default: "序号" },
    mergeCols: { type: Array, required: true }, // 哪些列是合并列
    mergeEnabled: { type: Boolean, default: true },
    getRowClass: { type: Function, default: () => ({}) },
    summaryColumns: { type: Array, default: () => [] },
    summaryLabel: { type: String, default: "合计" },
    groupKeys: { type: [String, Array], default: () => [] }
});
const emit = defineEmits(["update:data"]);

const localData = reactive([]);
let isSyncing = false;

// 初始化空行
function emptyRow(groupValues = {}) {
    const row = {};
    props.columns.forEach((col) => (row[col.prop] = "")); // 显示列为空
    row._groupId = groupValues._groupId || "";           // 内部唯一组 ID
    return row;
}

// 监听外部数据（防递归更新）
watch(
    () => props.data,
    (newVal) => {
        if (isSyncing) return;
        if (newVal && newVal.length > 0) {
            localData.splice(0, localData.length, ...JSON.parse(JSON.stringify(newVal)));
        } else {
            localData.splice(0, localData.length); // 不自动添加空行
        }
    },
    { immediate: true }
);

function updateData() {
    isSyncing = true;
    emit("update:data", JSON.parse(JSON.stringify(localData)));
    requestAnimationFrame(() => {
        isSyncing = false;
    });
}

// 生成组唯一 key（仅按 mergeCols 判断合并，不受其他列值影响）
function getGroupKey(row) {
    return row._groupId || groupKeys.value.map(k => row[k]?.toString() || '').join('||');
}

const groupKeys = computed(() => {
    if (Array.isArray(props.groupKeys) && props.groupKeys.length > 0) {
        return props.groupKeys;
    }
    return props.mergeCols.length > 0 ? [props.mergeCols[0]] : [];
});

// 当前分组顺序
const groupOrder = computed(() => {
    const keys = [];
    localData.forEach((r) => {
        const key = getGroupKey(r);
        if (!keys.includes(key)) keys.push(key);
    });
    return keys;
});

function isGroupStart(row) {
    const key = getGroupKey(row);
    return localData.find((r) => getGroupKey(r) === key) === row;
}

function countInGroup(row) {
    return localData.filter((r) => getGroupKey(r) === getGroupKey(row)).length;
}

function getColumnProps(col) {
    const p = {};
    ["prop", "width", "fixed", "showOverflowTooltip"].forEach((k) => {
        if (col[k] !== undefined) p[k] = col[k];
    });
    return p;
}


// 合并行方法
function spanMethod({ row, column }) {
    const isIndexCol = column.label === props.indexLabel;
    const isMergeCol = column.property && props.mergeCols.includes(column.property);

    if (!props.mergeEnabled || (!isIndexCol && !isMergeCol)) {
        return { rowspan: 1, colspan: 1 };
    }
    if (!isGroupStart(row)) {
        return { rowspan: 0, colspan: 0 };
    }
    return { rowspan: countInGroup(row), colspan: 1 };
}

// 合计
const hasSummary = computed(() => Array.isArray(props.summaryColumns) && props.summaryColumns.length > 0);
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
        return "";
    });
}

// 获取处理后的数据（合并列内容一致化）
function getFormattedData() {
    const result = JSON.parse(JSON.stringify(localData)); // 深拷贝，避免直接改 reactive

    // 根据 _groupId / groupKey 分组
    const groupsMap = {};
    result.forEach(row => {
        const key = getGroupKey(row);
        if (!groupsMap[key]) groupsMap[key] = [];
        groupsMap[key].push(row);
    });

    // 遍历每组，把第一行的 mergeCols 数据赋给其他行
    Object.values(groupsMap).forEach(rows => {
        if (rows.length > 1) {
            const firstRow = rows[0];
            props.mergeCols.forEach(col => {
                rows.forEach(r => {
                    r[col] = firstRow[col];
                });
            });
        }
    });

    return result;
}

defineExpose({
    getFormattedData // 暴露给外部使用
});
</script>

<style scoped lang="scss">
.group-start-cell {
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
    font-size: 24px;
    line-height: 23px;
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

:deep(.el-table__cell) {
    padding: 5px 0;
}

:deep(.el-table__body-wrapper tbody tr.danger-row td) {
    background-color: #ffd4d4 !important;
}
</style>