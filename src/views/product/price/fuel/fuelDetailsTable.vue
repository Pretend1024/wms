<template>
    <div class="table-container">
        <el-table :data="localData" border stripe height="350px" style="width: 100%"
            :row-class-name="props.getRowClass">
            <!-- 序号列（带加减） -->
            <el-table-column :label="indexLabel" width="65" fixed="left">
                <template #default="{ row, $index }">
                    <div class="index-cell">
                        <div>{{ $index + 1 }}</div>
                        <div class="btn-group">
                            <span class="btn" @click="removeRow($index)">
                                －
                            </span>
                            <span class="btn" @click="addRow">＋</span>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <!-- 动态数据列 -->
            <el-table-column v-for="(col, idx) in columns" :key="idx" :label="col.label" v-bind="getColumnProps(col)">
                <!-- 日期列 -->
                <template v-if="col.prop === 'date'" #default="{ row, $index }">
                    <div style="display: flex; gap: 10px;">
                        <!-- 开始日期 -->
                        <el-date-picker v-model="row.dateStart" type="date" placeholder="请选择开始日期"
                            :disabled="!canEditStartDate($index)" :disabled-date="d => disabledStartDate(d, $index)"
                            @change="val => handleStartDateChange(val, $index)" />

                        <!-- 结束日期 -->
                        <el-date-picker v-model="row.dateEnd" type="date" placeholder="请选择结束日期"
                            :disabled="!canEditEndDate($index)" :disabled-date="d => disabledEndDate(d, $index)"
                            @change="val => handleEndDateChange(val, $index)" />
                    </div>
                </template>

                <!-- 费率列 -->
                <template v-if="col.prop === 'rate'" #default="{ row }">
                    <el-input v-model="row.rate" placeholder="请输入燃油费率" />
                </template>

                <!-- 其他插槽列 -->
                <template v-if="col.slot && col.prop !== 'date' && col.prop !== 'rate'" #default="scope">
                    <div :key="`${scope.$index}-${col.prop}`">
                        <slot :name="col.slot" v-bind="scope" />
                    </div>
                </template>

                <!-- 表头插槽 -->
                <template v-if="col.headerSlot" #header="scope">
                    <slot :name="col.headerSlot" v-bind="scope" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, nextTick } from 'vue';
import { ElInput, ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    indexLabel: { type: String, default: '序号' },
    controlsVisible: { type: Boolean, default: true },
    getRowClass: { type: Function, default: () => ({}) }
});
const emit = defineEmits(['update:data']);

const localData = reactive([]);

// 监听外部传入数据
watch(
    () => props.data,
    newVal => {
        if (!newVal || newVal.length === 0) {
            localData.splice(0, localData.length, { ...emptyRow() });
        } else {
            localData.splice(0, localData.length, ...newVal);
            nextTick(() => adjustDatesAfterDataLoad());
        }
    },
    { immediate: true }
);

// 初始化后，自动调整多行的开始日期
function adjustDatesAfterDataLoad() {
    if (localData.length <= 1) return;
    for (let i = 1; i < localData.length; i++) {
        if (localData[i - 1].dateEnd) {
            localData[i].dateStart = dayjs(localData[i - 1].dateEnd).add(1, 'day').toDate();
        }
    }
    const last = localData[localData.length - 1];
    if (last.dateStart && last.dateEnd && last.dateEnd <= last.dateStart) {
        last.dateEnd = null;
    }
}

// 创建空行
function emptyRow() {
    const row = {};
    props.columns.forEach(col => {
        row[col.prop] = '';
    });
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

// 开始日期是否可编辑
function canEditStartDate(index) {
    if (localData.length === 1) return true;
    return index === 0;
}

// 结束日期是否可编辑
function canEditEndDate() {
    return true;
}

// 禁用开始日期（必须大于上一行结束日期）
function disabledStartDate(date, index) {
    if (index > 0 && localData[index - 1].dateEnd) {
        return date <= dayjs(localData[index - 1].dateEnd).toDate();
    }
    return false;
}

// 禁用结束日期（必须大于本行开始日期）
function disabledEndDate(date, index) {
    if (localData[index].dateStart) {
        return date <= dayjs(localData[index].dateStart).toDate();
    }
    return false;
}

// 开始日期变化
function handleStartDateChange(newDate, index) {
    if (!newDate) return;

    if (localData[index].dateEnd && newDate >= localData[index].dateEnd) {
        localData[index].dateEnd = null;
        ElMessage.warning('开始日期必须早于结束日期');
    }

    emit('update:data', [...localData]);
}

// 结束日期变化
function handleEndDateChange(newDate, index) {
    if (!newDate) return;

    if (localData[index].dateStart && newDate <= localData[index].dateStart) {
        ElMessage.warning('结束日期必须大于开始日期');
        localData[index].dateEnd = null;
        return;
    }

    // 检查并处理后续行的结束日期
    checkAndClearSubsequentEndDates(index, newDate);

    // 自动更新下一行开始日期
    if (index < localData.length - 1) {
        const nextStart = dayjs(newDate).add(1, 'day').toDate();
        localData[index + 1].dateStart = nextStart;

        // 如果下一行已有结束日期且小于开始日期，则清空
        if (localData[index + 1].dateEnd && localData[index + 1].dateEnd <= nextStart) {
            localData[index + 1].dateEnd = null;
        }
    }

    emit('update:data', [...localData]);
}

// 检查并清空后续行中结束日期早于当前行新结束日期的行
function checkAndClearSubsequentEndDates(currentIndex, newEndDate) {
    // 从当前行的下一行开始检查
    for (let i = currentIndex + 1; i < localData.length; i++) {
        // 如果后续行有结束日期，且该日期早于或等于当前行的新结束日期，则清空
        if (localData[i].dateEnd && dayjs(localData[i].dateEnd).isSameOrBefore(newEndDate)) {
            localData[i].dateEnd = null;
            ElMessage.info(`第${i + 1}行的结束日期已清空，因为它早于第${currentIndex + 1}行的结束日期`);
        } else {
            // 如果找到一个有效的结束日期，后面的行可能不受影响，可提前退出
            break;
        }
    }
}

// 添加行
function addRow() {
    const newRow = emptyRow();
    if (localData.length > 0 && localData[localData.length - 1].dateEnd) {
        newRow.dateStart = dayjs(localData[localData.length - 1].dateEnd).add(1, 'day').toDate();
    }
    localData.push(newRow);
    emit('update:data', [...localData]);
}

// 删除行
function removeRow(index) {
    localData.splice(index, 1);
    if (localData.length === 0) {
        localData.push(emptyRow());
    } else {
        // 重新计算后续行的开始日期
        for (let i = 1; i < localData.length; i++) {
            if (localData[i - 1].dateEnd) {
                localData[i].dateStart = dayjs(localData[i - 1].dateEnd).add(1, 'day').toDate();
            }
        }
    }
    emit('update:data', [...localData]);
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
    justify-content: space-between;
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

:deep(.el-date-editor) {
    width: 120px;
}

:deep(.el-input) {
    width: 100%;
}

:deep(.el-date-editor.is-disabled .el-input__inner) {
    background-color: #f5f5f5;
    cursor: not-allowed;
}
</style>
