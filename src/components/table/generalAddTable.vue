<template>
    <div class="general-add-table">
        <el-table :data="localData" border stripe style="width: 100%;flex: 1;" :show-summary="showSummaryRow"
            :summary-method="getSummaries">
            <!-- 序号列 -->
            <el-table-column label="序号" width="55" fixed="left">
                <template #default="{ $index }">
                    <div class="group-start-cell">
                        <div>{{ $index + 1 }}</div>
                    </div>
                </template>
            </el-table-column>

            <!-- 动态数据列 -->
            <el-table-column v-for="(col, idx) in columns" :key="`col-${idx}`" v-bind="getColumnProps(col)"
                showOverflowTooltip="true">
                <!-- 单元格插槽 -->
                <template v-if="col.slot" #default="scope">
                    <div :key="`${scope.$index}-${col.prop}`">
                        <slot :name="col.slot" v-bind="scope" />
                    </div>
                </template>
                <template v-else #default="scope">
                    {{ scope.row[col.prop] ?? '' }}
                </template>

                <!-- 表头插槽 + 必填星号 -->
                <template #header="scope">
                    <span v-if="col.required" class="required-star">*</span>
                    <template v-if="col.headerSlot">
                        <slot :name="col.headerSlot" v-bind="scope" />
                    </template>
                    <template v-else>
                        {{ col.label }}
                    </template>
                </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作" width="110" fixed="right" v-if="controlsVisible">
                <template #default="{ $index }">
                    <div class="btn-group">
                        <el-button icon="Plus" @click="addRow($index)" size="small" />
                        <el-button icon="Minus" @click="removeRow($index)" size="small" />
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, defineExpose, computed, nextTick } from 'vue';

// props
const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    modelValue: { type: Boolean, default: true }, // 是否显示操作列
    summaryFields: { type: Array, default: () => [] }, // 指定哪些列需要统计
    initArrayFields: { type: Array, default: () => [] },    //新增需要初始化为数组的字段
    defaultAddEmptyRow: { type: Boolean, default: true },   //新增是否默认添加一行空行
    addRowDefaults: { type: Array, default: () => [] } // 新增行时的默认值数组
});

const emit = defineEmits(['update:modelValue', 'update:data']);

// 操作列控制
const controlsVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

// 本地数据
const localData = reactive([]);

// 应用默认值到行
function applyDefaultsToRow(row) {
    if (!Array.isArray(props.addRowDefaults)) return;
    props.addRowDefaults.forEach(def => {
        if (!def || typeof def.prop !== 'string') return;
        const value = typeof def.value === 'function' ? def.value() : def.value;
        if (row[def.prop] === undefined || row[def.prop] === null) {
            if (Array.isArray(value)) row[def.prop] = [...value];
            else if (value && typeof value === 'object') row[def.prop] = { ...value };
            else row[def.prop] = value;
        }
    });
}

// 初始化数据
function initData(sourceData) {
    return sourceData.map(row => {
        const baseRow = { ...row };
        props.initArrayFields.forEach(field => {
            if (baseRow[field] === undefined || baseRow[field] === null) {
                baseRow[field] = [{}];
            }
        });
        applyDefaultsToRow(baseRow);
        return baseRow;
    });
}

// 监听props.data变化
watch(
    () => props.data,
    async (newVal) => {
        localData.splice(0, localData.length);
        const formattedData = initData(newVal || []);
        if (formattedData.length === 0 && props.defaultAddEmptyRow) {
            const emptyRow = {};
            props.initArrayFields.forEach(field => {
                emptyRow[field] = [{}];
            });
            applyDefaultsToRow(emptyRow);
            formattedData.push(emptyRow);
        }
        localData.push(...formattedData);
        await nextTick();
    },
    { immediate: true }
);

// 添加行
async function addRow(index) {
    const newRow = {};
    props.initArrayFields.forEach(field => {
        newRow[field] = [{}];
    });
    applyDefaultsToRow(newRow);
    localData.splice(index + 1, 0, newRow);
    emit('update:data', [...localData]);
    await nextTick();
}

// 删除行
async function removeRow(index) {
    localData.splice(index, 1);
    if (localData.length === 0 && props.defaultAddEmptyRow) {
        const emptyRow = {};
        props.initArrayFields.forEach(field => {
            emptyRow[field] = [{}];
        });
        applyDefaultsToRow(emptyRow);
        localData.push(emptyRow);
    }
    emit('update:data', [...localData]);
    await nextTick();
}

// 获取列属性
function getColumnProps(col) {
    const props = {};
    ['prop', 'width', 'fixed', 'align', 'sortable'].forEach((key) => {
        if (col[key] !== undefined) props[key] = col[key];
    });
    return props;
}

// 统计行逻辑
const showSummaryRow = computed(() => props.summaryFields.length > 0);

// 合计计算
function getSummaries({ columns, data }) {
    const sums = [];
    columns.forEach((col, index) => {
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        if (props.summaryFields.includes(col.property)) {
            const total = data.reduce((sum, row) => {
                const val = Number(row[col.property]);
                return !isNaN(val) ? sum + val : sum;
            }, 0);
            sums[index] = total;
        } else {
            sums[index] = '';
        }
    });
    return sums;
}

// 设置某一行的某个字段值
function setRowFieldValue(rowIndex, field, value) {
    if (rowIndex < 0 || rowIndex >= localData.length) {
        console.warn(`行索引${rowIndex}不合法`);
        return;
    }
    if (typeof field !== 'string') {
        console.warn('字段名必须为字符串');
        return;
    }
    // 更新字段值
    localData[rowIndex][field] = value;
    // 触发数据更新事件
    emit('update:data', [...localData]);
}

// 暴露方法（新增setRowFieldValue）
defineExpose({
    getTableData: () => [...localData],
    addOrReplaceRow,
    setRowFieldValue // 暴露设值方法供外部调用
});

// 替换或添加行
async function addOrReplaceRow(newData, checkFields) {
    if (!Array.isArray(checkFields) || checkFields.length === 0) {
        console.warn('addOrReplaceRow需要传入有效的checkFields数组');
        return;
    }
    const rowData = { ...newData };
    props.initArrayFields.forEach(field => {
        if (rowData[field] === undefined || rowData[field] === null) {
            rowData[field] = [{}];
        }
    });
    applyDefaultsToRow(rowData);
    const emptyRowIndex = localData.findIndex((row) =>
        checkFields.some((field) => {
            const value = row[field];
            return value === undefined || value === null || value === '';
        })
    );
    if (emptyRowIndex !== -1) {
        localData[emptyRowIndex] = { ...localData[emptyRowIndex], ...rowData };
    } else {
        localData.push(rowData);
    }
    emit('update:data', [...localData]);
    await nextTick();
}
</script>

<style scoped lang="scss">
.general-add-table {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 序号列样式 */
.group-start-cell {
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    padding: 0 10px;
}

/* 必填项红色星号样式 */
.required-star {
    color: #ff4d4f;
    margin-right: 2px;
    vertical-align: middle;
}

/* 表格基础样式 */
:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}

:deep(.el-table__cell) {
    padding: 5px 0;
}

:deep(.el-form-item) {
    margin: 1px;
    width: 100%;
    padding: 0 10px;
}
</style>