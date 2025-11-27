<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="800px" align-center destroy-on-close @close="handleClose">
        <!-- 输入区域和保存按钮 -->
        <div class="input-container mb-4">
            <el-form :model="formData" ref="formRef" label-width="85px" inline>
                <el-form-item :label="getLabel('remark')" class="input-item">
                    <el-input type='textarea' v-model="formData.remark" :placeholder="getPlaceholder('remark')"
                        :rows="3" style="width: 400px;" />
                </el-form-item>
                <el-form-item class="button-item">
                    <el-button type="primary" @click="handleConfirm" :loading="isSubmitting">
                        {{ getButtonText('save') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格区域 -->
        <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%;" height="300"
            :row-key="(row) => row.id">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="remark" label="备注内容" min-width="200" />
            <el-table-column prop="createdTime" label="备注时间" width="180" />
            <el-table-column prop="createdBy" label="备注人" width="120" />
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-container mt-4">
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { getOutstockOrderRemarkApi, addOutstockOrderRemarkApi, deleteOutstockOrderRemarkApi } from '@/api/outstockApi/order.js';
import { useI18n } from 'vue-i18n';
import { ElMessageBox, ElMessage } from 'element-plus';
import { smartAlert } from '@/utils/genericMethods.js'

const { t } = useI18n();

// 定义组件抛出的事件（新增：close事件添加hasDataChanged参数）
const emit = defineEmits(['cancel', 'close', 'refresh']);

// 表单数据
const formData = reactive({
    remark: '',
});

// 表单引用
const formRef = ref(null);

// 弹窗显示状态
const visible = ref(false);

// 表格数据
const tableData = ref([]);

// 加载状态
const loading = ref(false);
const isSubmitting = ref(false);

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 50,
    total: 0
});

// 弹窗标题
const dialogTitle = '备注信息';

// 新增：记录组件内是否发生数据变更（调用过添加备注接口）
const hasDataChanged = ref(false);

// 打开弹窗方法（新增：重置数据变更状态）
const open = (id) => {
    visible.value = true;
    // 重置表单数据、分页和数据变更状态
    formData.remark = '';
    pagination.currentPage = 1;
    hasDataChanged.value = false; // 每次打开弹窗重置为未变更
    // 获取表格数据
    getRemarkList(id);
};

// 关闭弹窗方法
const close = () => {
    visible.value = false;
};

// 处理取消按钮
const handleCancel = () => {
    emit('cancel');
    close();
};

// 处理关闭事件（修改：传递数据变更状态给父组件）
const handleClose = () => {
    outOrderId.value = '';
    // 传递是否发生数据变更的状态给父组件
    emit('close', hasDataChanged.value);
    // 可选：关闭后重置状态（避免下次打开残留）
    hasDataChanged.value = false;
};

let outOrderId = ref('');

// 获取备注列表
const getRemarkList = async (id) => {
    try {
        loading.value = true;
        if (id) {
            outOrderId.value = id
        }
        const res = await getOutstockOrderRemarkApi({
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            outOrderId: outOrderId.value,
        });

        tableData.value = res.data.rows || [];
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.page || 1;
    } catch (error) {
        ElMessage.error(t('common.fetchFailed') + (error.message || ''));
        console.error('获取备注列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 处理确定按钮 - 保存备注（修改：添加成功后标记数据变更）
const handleConfirm = async () => {
    try {
        isSubmitting.value = true;

        // 调用添加备注接口
        const res = await addOutstockOrderRemarkApi({
            outOrderId: outOrderId.value,
            remark: formData.remark
        });

        smartAlert(res.msg, res.success, 1000);

        // 新增：添加成功则标记为数据已变更
        if (res.success) {
            hasDataChanged.value = true;
        }

        // 清空输入框
        formData.remark = '';

        // 重新获取列表数据
        getRemarkList();

        // 通知父组件刷新
        emit('refresh');
    } catch (error) {
        if (error.name !== 'ValidationError') {
            ElMessage.error(t('common.saveFailed') + (error.message || ''));
            console.error('保存备注失败:', error);
        }
    } finally {
        isSubmitting.value = false;
    }
};

// 分页大小改变
const handleSizeChange = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    getRemarkList();
};

// 当前页改变
const handleCurrentChange = (currentPage) => {
    pagination.currentPage = currentPage;
    getRemarkList();
};

// 暴露方法给父组件
defineExpose({
    open,
    close
});
</script>

<style scoped>
.input-container {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.button-item {
    margin-top: 24px !important;
}

.pagination-container {
    text-align: right;
}

.el-textarea__inner {
    resize: none;
}

.el-pagination {
    justify-content: center;
    margin-top: 15px;
}
</style>