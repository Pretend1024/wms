<template>
    <el-dialog :model-value="visible" title="选择波次模板" width="90%" destroy-on-close @close="handleClose">
        <!-- 筛选区 -->
        <div class="filterDiv" style="margin-bottom: 16px;">
            <el-form :model="filterForm" inline>
                <el-form-item label="模板名称：">
                    <el-input v-model.trim="filterForm.taskName" placeholder="请输入模板名称" />
                </el-form-item>
                <el-form-item label="任务号：">
                    <el-input v-model.trim="filterForm.taskNo" placeholder="请输入任务号" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchTableData">搜索</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="tableDiv">
            <el-table :data="tableData" height="400" border :loading="loading" row-key="id" @row-click="handleRowClick"
                :row-class-name="tableRowClassName">
                <el-table-column show-overflow-tooltip prop="taskName" label="模板名称" width="150" />
                <el-table-column show-overflow-tooltip prop="taskNo" label="波次任务号" width="200" />
                <el-table-column show-overflow-tooltip prop="warehouseCodes" label="仓库" width="155" />
                <el-table-column show-overflow-tooltip prop="waveTypeName" label="波次类型" width="150" />
                <el-table-column show-overflow-tooltip label="订单时间范围" width="400">
                    <template #default="scope">
                        {{ scope.row.orderStartTime }} ~ {{ scope.row.orderEndTime }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="是否区分渠道" width="140">
                    <template #default="scope">
                        {{ scope.row.isDistinguishShipway ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="createdTime" label="创建时间" width="200" sortable />
            </el-table>

            <!-- 分页器 -->
            <el-pagination style="margin-top: 16px; text-align: right;" v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize" :page-sizes="[20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 底部按钮 -->
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm" :disabled="!selectedRow">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup name="WaveTemplateDialog">
import { ref, shallowRef, defineProps, defineEmits, watch } from 'vue';
import { getOutstockWaveRecordApi } from '@/api/outstockApi/wave.js';
import { smartAlert } from '@/utils/genericMethods.js';

// 1. 定义props和emit
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'confirm']);

// 2. 内部状态
const loading = ref(false);
const tableData = shallowRef([]);
const selectedRow = ref(null);
const selectedRowId = ref(''); 
const filterForm = ref({ taskNo: '', taskName: '' });
const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
});

// 3. 监听visible变化，重置选中状态
watch(
    () => props.visible,
    (newVal) => {
        if (newVal) {
            pagination.value.currentPage = 1;
            selectedRow.value = null; // 重置选中行
            selectedRowId.value = ''; // 重置选中标识
            fetchTableData();
        } else {
            selectedRow.value = null;
            selectedRowId.value = '';
        }
    }
);

// 4. 获取表格数据
const fetchTableData = async () => {
    loading.value = true;
    try {
        const res = await getOutstockWaveRecordApi({
            page: pagination.value.currentPage,
            pageSize: pagination.value.pageSize,
            taskNo: filterForm.value.taskNo,
            taskName: filterForm.value.taskName,
            isTemplate: true
        });
        tableData.value = Object.freeze(res.data.rows) || [];
        pagination.value.total = res.data.total || 0;
    } catch (error) {
        console.error('加载波次模板失败：', error);
        smartAlert('加载模板失败', false);
    } finally {
        loading.value = false;
    }
};

// 5. 行点击事件
const handleRowClick = (row) => {
    selectedRow.value = row;
    selectedRowId.value = row.id || `${row.taskNo}-${row.taskName}-${row.createdTime}`;
};

// 6. 自定义行类名方法
const tableRowClassName = ({ row }) => {
    // 生成当前行的唯一标识，与选中标识比对
    const rowUniqueId = row.id || `${row.taskNo}-${row.taskName}-${row.createdTime}`;
    // 匹配成功则返回自定义高亮类名
    return rowUniqueId === selectedRowId.value ? 'selected-row' : '';
};

// 7. 重置筛选
const resetFilter = () => {
    filterForm.value = { taskNo: '', taskName: '' };
    pagination.value.currentPage = 1;
    selectedRow.value = null;
    selectedRowId.value = '';
    fetchTableData();
};

// 8. 分页变化
const handleSizeChange = (pageSize) => {
    pagination.value.pageSize = pageSize;
    selectedRow.value = null;
    selectedRowId.value = '';
    fetchTableData();
};
const handleCurrentChange = (currentPage) => {
    pagination.value.currentPage = currentPage;
    selectedRow.value = null;
    selectedRowId.value = '';
    fetchTableData();
};

// 9. 关闭弹窗
const handleClose = () => {
    emit('update:visible', false);
};

// 10. 确认选择
const handleConfirm = () => {
    if (selectedRow.value) {
        emit('confirm', selectedRow.value);
        emit('update:visible', false);
    }
};
</script>

<style scoped>
:deep(.el-table__body .el-table__row.selected-row > td) {
    background-color: #f0f7ff !important;
    /* 参考代码的高亮背景色 */
    color: #1989fa !important;
    /* 参考代码的高亮文字色 */
}

:deep(.el-pagination) {
    display: flex;
    justify-content: center;
}
</style>