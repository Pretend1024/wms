<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="800px" align-center destroy-on-close @close="handleClose">
        <!-- 上传区域：第一行（类型选择 + 上传按钮），第二行（文件信息 + 确定按钮） -->
        <div class="upload-wrapper mb-4">
            <!-- 第一行：附件类型选择 + 上传文件按钮 -->
            <div class="upload-first-row">
                <el-form :model="formData" ref="formRef" label-width="85px" inline>
                    <el-form-item :label="getLabel('fileType')" prop="typeId" class="select-item">
                        <el-select v-model="formData.typeId" style="width: 200px;">
                            <el-option v-for="item in fileTypeOptions" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="upload-item">
                        <!-- 移除multiple属性，确保每次仅上传一个文件 -->
                        <el-upload :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload"
                            :show-file-list="false">
                            <el-button type="primary" :disabled="!formData.typeId">上传文件</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 第二行：已上传文件信息 + 确定按钮（上传成功后显示） -->
            <div class="upload-second-row" v-if="formData.file">
                <el-form :model="formData" ref="formRef" label-width="85px" inline>
                    <!-- 文件名显示 -->
                    <el-form-item :label="getLabel('fileName')" class="file-name-item" style="width: 285px;">
                        <!-- 输入框 -->
                        <el-input v-model="formData.file.fileName" />
                    </el-form-item>
                    <!-- 确定按钮 -->
                    <el-form-item class="confirm-btn-item">
                        <el-button type="primary" @click="handleConfirm" :loading="isSubmitting">
                            {{ getButtonText('save') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 表格区域 -->
        <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%;" height="300"
            :row-key="(row) => row.id">
            <el-table-column prop="typeName" label="附件类型" width="150" />
            <el-table-column prop="fileName" label="附件名称" min-width="200" />
            <el-table-column prop="createdTime" label="上传时间" width="180" />
            <el-table-column prop="createdBy" label="上传人" width="120" />
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button text type="primary" @click="handleDownload(scope.row)" size="small">
                        下载
                    </el-button>
                    <el-button text type="danger" @click="handleDelete(scope.row)" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
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
import { ref, reactive, onMounted } from 'vue';
import {
    getOutstockOrderFileApi,
    addOutstockOrderFileApi,
    deleteOutstockOrderFileApi,
    outstockOrderAttachmentTypeApi
} from '@/api/outstockApi/order.js';
import { uploadApi } from '@/api/baseApi/index.js';
import { useI18n } from 'vue-i18n';
import { ElMessageBox, ElMessage } from 'element-plus';
import { smartAlert } from '@/utils/genericMethods.js';

const { t } = useI18n();

// 定义组件抛出的事件
const emit = defineEmits(['cancel', 'close', 'refresh']);

// 表单数据：改为单个文件对象（每次仅上传一个）
const formData = reactive({
    typeId: '',
    file: null // 存储当前已上传的单个文件信息
});

// 表单引用
const formRef = ref(null);

// 弹窗显示状态
const visible = ref(false);

// 表格数据
const tableData = ref([]);

// 文件类型选项
const fileTypeOptions = ref([]);

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
const dialogTitle = '文件上传';

// 当前订单ID
let outOrderId = ref('');

// 打开弹窗方法
const open = (id) => {
    visible.value = true;
    // 重置表单数据和分页
    formData.typeId = '';
    formData.file = null;
    pagination.currentPage = 1;
    outOrderId.value = id;

    // 获取文件类型和文件列表
    getFileTypeOptions();
    getFileList();
};

// 关闭弹窗方法
const close = () => {
    visible.value = false;
};

// 处理取消按钮
const handleCancel = () => {
    formData.file = null; // 清空已上传文件
    emit('cancel');
    close();
};

// 处理关闭事件
const handleClose = () => {
    outOrderId.value = '';
    formData.file = null; // 清空已上传文件
    emit('close');
};

// 获取文件类型选项
const getFileTypeOptions = async () => {
    try {
        const res = await outstockOrderAttachmentTypeApi();
        fileTypeOptions.value = res.data || [];
    } catch (error) {
        ElMessage.error(t('common.fetchFailed') + (error.message || ''));
        console.error('获取文件类型失败:', error);
    }
};

// 获取文件列表
const getFileList = async () => {
    try {
        loading.value = true;
        const res = await getOutstockOrderFileApi({
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            outOrderId: outOrderId.value,
        });

        tableData.value = res.data.rows || [];
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.page || 1;
    } catch (error) {
        ElMessage.error(t('common.fetchFailed') + (error.message || ''));
        console.error('获取文件列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 文件上传前校验
const beforeUpload = (file) => {
    // 检查是否选择了文件类型
    if (!formData.typeId) {
        ElMessage.warning('请先选择附件类型');
        return false;
    }

    // 检查文件大小
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        ElMessage.error('文件大小不能超过5MB!');
        return false;
    }

    // 如果已有上传文件，提示是否替换
    if (formData.file) {
        ElMessageBox.confirm(
            `已有上传文件"${formData.file.fileName}"，是否替换为"${file.name}"?`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }
        ).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    return true;
};

// 自定义上传处理（单文件上传）
const handleUpload = async (options) => {
    const currentFile = options.file;
    if (!currentFile) return;

    try {
        // 显示上传中状态
        isSubmitting.value = true;

        // 调用上传接口
        const res = await uploadApi(currentFile, { path: 'temp' });

        if (res.success) {
            // 存储单个文件信息（覆盖已有文件）
            formData.file = {
                fileName: currentFile.name,
                fileSize: currentFile.size,
                url: res.data,
                typeId: formData.typeId,
                typeName: fileTypeOptions.value.find(item => item.id === formData.typeId)?.name || ''
            };

            ElMessage.success(`文件 "${currentFile.name}" 上传成功`);
        } else {
            ElMessage.error(`文件 "${currentFile.name}" 上传失败: ${res.msg || '未知错误'}`);
        }
    } catch (error) {
        ElMessage.error(`文件 "${currentFile.name}" 上传失败: ${error.message || '网络错误'}`);
        console.error('文件上传失败:', error);
    } finally {
        isSubmitting.value = false;
    }
};

// 处理确定按钮 - 保存文件信息（单个文件）
const handleConfirm = async () => {
    if (!formData.file) {
        ElMessage.warning('请先上传文件');
        return;
    }

    if (!formData.typeId) {
        ElMessage.warning('请选择附件类型');
        return;
    }

    try {
        isSubmitting.value = true;

        // 调用保存文件信息接口（传递单个文件参数）
        const res = await addOutstockOrderFileApi({
            outOrderId: outOrderId.value,
            fileName: formData.file.fileName,
            url: formData.file.url,
            typeId: formData.file.typeId
        });

        smartAlert(res.msg, res.success, 1000);

        if (res.success) {
            // 清空上传文件
            formData.file = null;
            // 清空类型
            formData.typeId = '';
            // 重新获取文件列表
            getFileList();
            // 通知父组件刷新
            emit('refresh');
        }
    } catch (error) {
        ElMessage.error(t('common.saveFailed') + (error.message || ''));
        console.error('保存文件信息失败:', error);
    } finally {
        isSubmitting.value = false;
    }
};

// 处理下载
const handleDownload = async (row) => {
    try {
        if (!row.url) {
            ElMessage.warning('文件地址不存在，无法下载');
            return;
        }
        // 创建a标签模拟下载
        const link = document.createElement('a');
        link.href = row.url;
        link.download = row.fileName; // 指定下载文件名
        document.body.appendChild(link);
        link.click(); // 触发点击下载
        document.body.removeChild(link); // 清理临时元素
    } catch (error) {
        ElMessage.error('文件下载失败: ' + (error.message || ''));
        console.error('文件下载失败:', error);
    }
};

// 处理删除
const handleDelete = async (row) => {
    try {
        const confirmResult = await ElMessageBox.confirm(
            `是否要删除文件 "${row.fileName}"?`,
            '提醒',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );

        if (confirmResult === 'confirm') {
            // 调用删除接口
            const res = await deleteOutstockOrderFileApi({
                id: row.id,
                outOrderId: outOrderId.value
            });

            smartAlert(res.msg, res.success, 1000);

            if (res.success) {
                // 重新获取文件列表
                getFileList();
                // 通知父组件刷新
                emit('refresh');
            }
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error(t('common.deleteFailed') + (error.message || ''));
            console.error('删除文件失败:', error);
        }
    }
};

// 分页大小改变
const handleSizeChange = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    getFileList();
};

// 当前页改变
const handleCurrentChange = (currentPage) => {
    pagination.currentPage = currentPage;
    getFileList();
};


// 暴露方法给父组件
defineExpose({
    open,
    close
});

onMounted(() => {
    // 初始化时获取文件类型选项
    getFileTypeOptions();
});
</script>

<style scoped>
.upload-wrapper {
    padding: 10px 0;
}

.upload-first-row,
.upload-second-row {
    margin-bottom: 15px;
}

.select-item {
    margin-bottom: 0 !important;
}

.upload-item {
    margin-bottom: 0 !important;
    margin-left: 10px !important;
}

.file-name-item,
.file-path-item {
    margin-bottom: 0 !important;
    margin-right: 15px !important;
}

.confirm-btn-item {
    margin-bottom: 0 !important;
    margin-left: 27px !important;
}

.file-name {
    line-height: 32px;
    /* 与输入框高度对齐 */
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}

.pagination-container {
    text-align: right;
}

.el-pagination {
    justify-content: center;
    margin-top: 15px;
}
</style>
