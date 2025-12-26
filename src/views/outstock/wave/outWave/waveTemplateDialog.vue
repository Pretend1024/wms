<template>
    <!-- 弹窗的显示状态直接绑定到 props.visible -->
    <el-dialog :model-value="visible" title="选择波次模板" width="90%" destroy-on-close @close="handleClose">
        <!-- 筛选区、表格区、分页器 保持不变 -->
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
                highlight-current-row>
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

            <el-pagination style="margin-top: 16px; text-align: right;" v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize" :page-sizes="[20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm" :disabled="!selectedRow">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup name="WaveTemplateDialog">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { getOutstockWaveRecordApi } from '@/api/outstockApi/wave.js';
import { smartAlert } from '@/utils/genericMethods.js';

// 1. 定义接收父组件的 visible prop（只读）
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

// 2. 定义向父组件传递的事件（关键：通过 update:visible 通知父组件更新）
const emit = defineEmits(['update:visible', 'confirm']);

// 内部状态
const loading = ref(false);
const tableData = shallowRef([]);
const selectedRow = ref(null);
const filterForm = ref({ taskNo: '', taskName: '' });
const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
});

// 3. 监听 visible 变化：当父组件打开弹窗时，加载数据
watch(
    () => props.visible,
    (newVal) => {
        if (newVal) {
            pagination.value.currentPage = 1;
            fetchTableData(); // 打开弹窗时加载数据
        } else {
            selectedRow.value = null; // 关闭时清空选中状态
        }
    }
);

// 获取表格数据
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

// 行点击选中
const handleRowClick = (row) => {
    selectedRow.value = row;
};

// 重置筛选
const resetFilter = () => {
    filterForm.value = { taskNo: '', taskName: '' };
    pagination.value.currentPage = 1;
    fetchTableData();
};

// 分页变化
const handleSizeChange = (pageSize) => {
    pagination.value.pageSize = pageSize;
    fetchTableData();
};
const handleCurrentChange = (currentPage) => {
    pagination.value.currentPage = currentPage;
    fetchTableData();
};

// 4. 关闭弹窗：通过事件通知父组件将 visible 设为 false（关键）
const handleClose = () => {
    emit('update:visible', false); // 通知父组件更新 visible
};

// 确认选择：传递数据并关闭
const handleConfirm = () => {
    if (selectedRow.value) {
        emit('confirm', selectedRow.value); // 传递选中数据
        emit('update:visible', false); // 通知父组件关闭
    }
};
</script>

<style scoped>
:deep(.el-table__row.current-row) {
    background-color: #f5f7fa !important;
}

:deep(.el-pagination) {
    display: flex;
    justify-content: center;
}
</style>