<template>
    <el-dialog v-model="visible" title="运单导入" width="1000px" align-center destroy-on-close>
        <div class="import-dialog">
            <!-- 新增：文件上传提示信息 -->
            <div class="upload-hint">
                <p class="hint-title text-warning">⚠️ 上传须知</p>
                <ul class="hint-list">
                    <li>1. 仅支持 <strong>ZIP格式</strong> 文件，请勿上传RAR等其他压缩格式</li>
                    <li>2. 压缩包内运单PDF文件名需符合以下格式之一：</li>
                    <li class="sub-hint">
                        - 格式1：<code>订单号=跟踪单号.PDF</code>（例：SO12345=TN67890.PDF）→ 同时完成跟踪单号上传和运单PDF绑定
                    </li>
                    <li class="sub-hint">
                        - 格式2：<code>跟踪单号.PDF</code>（例：TN67890.PDF）→ 需确保订单已提前维护跟踪单号，否则无法匹配订单！
                    </li>
                </ul>
            </div>

            <!-- 文件上传区域 -->
            <el-upload ref="uploadRef" class="upload-area" v-model:file-list="fileList" drag :show-file-list="false"
                :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="1">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖放ZIP文件 或 <em>点击选择</em>
                </div>
                <template #tip>
                    <div class="upload-tip">
                        <el-button type="primary" @click="commit" style="margin-right: 10px;">
                            提交导入
                        </el-button>
                        <span>重复是否覆盖:</span>
                        <el-switch v-model="isCoverDuplicate" active-text="是" inactive-text="否"
                            style="margin-right: 15px;" inline-prompt>
                        </el-switch>
                        <p v-if="fileUrl">
                            已上传: <a :href="fileUrl" target="_blank">{{ getFileName(fileUrl) }}</a>
                        </p>
                        <p v-else class="text-warning">请上传ZIP格式文件</p>
                    </div>
                </template>
            </el-upload>

            <!-- 结果表格展示 -->
            <div class="result-table" v-if="tableData.length > 0">
                <el-table :data="filteredTableData" style="width: 100%" border max-height="300px">
                    <el-table-column prop="index" label="行号" width="75" />
                    <el-table-column prop="success" label="状态" width="100">
                        <template #default="{ row }">
                            <span :style="row.success ? 'color: green' : 'color: red'">
                                {{ row.success ? '成功' : '失败' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="right" label="消息">
                        <template #header>
                            <div style="display: flex;align-items: center;">
                                <span>消息</span>
                                <el-select v-model="filterStatus" placeholder="筛选"
                                    style="width: 80px;margin-left: auto;">
                                    <el-option label="全部" value="all" />
                                    <el-option label="成功" value="success" />
                                    <el-option label="失败" value="fail" />
                                </el-select>
                            </div>
                        </template>
                        <template #default="{ row }">
                            <p style="text-align: start;white-space: pre-wrap;">{{ row.msg }}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { uploadApi } from '@/api/baseApi/index.js';
import { outstockOrderImportTrackingNoApi } from '@/api/outstockApi/order.js'
import { smartAlert } from '@/utils/genericMethods.js'

// 弹窗显示状态
const visible = ref(false);

// 上传相关变量
const fileList = ref([]);
const fileUrl = ref('');
const uploadRef = ref(null);
// 新增：重复覆盖开关状态（默认关闭，避免误覆盖）
const isCoverDuplicate = ref(true);

// 表格数据
const tableData = shallowRef([]);
const filterStatus = ref('all');

// 筛选表格数据
const filteredTableData = computed(() => {
    if (filterStatus.value === 'all') return tableData.value;
    return filterStatus.value === 'success'
        ? tableData.value.filter(item => item.success)
        : tableData.value.filter(item => !item.success);
});

// 从文件URL中提取文件名
const getFileName = (url) => {
    if (!url) return '';
    return url.split('/').pop().split('?')[0];
};

// 文件上传前验证（保持原逻辑，强化ZIP校验）
const beforeUpload = (file) => {
    const isZip = file.name.endsWith('.zip');
    if (!isZip) {
        ElMessage.error('仅支持ZIP格式文件，请勿上传RAR等其他压缩格式！');
        return false;
    }
    // 可选：添加文件大小限制（例：50MB）
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
        ElMessage.error('上传文件大小不能超过50MB！');
        return false;
    }
    return true;
};

// 处理文件上传（保持原逻辑）
const handleUpload = async (options) => {
    const loading = ElLoading.service({ lock: true, text: '文件上传中...' });
    try {
        // 清除旧文件信息
        fileUrl.value = '';
        fileList.value = [];

        const res = await uploadApi(options.file, { path: 'temp' });
        fileUrl.value = res.data;
        ElMessage.success('文件上传成功');
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('文件上传失败，请重试');
    } finally {
        loading.close();
    }
};

// 提交导入（新增：传递重复覆盖状态到接口）
const commit = async () => {
    if (!fileUrl.value) {
        ElMessage.warning('请先上传文件');
        return;
    }

    const loading = ElLoading.service({ lock: true, text: '正在导入...' });
    try {
        const res = await outstockOrderImportTrackingNoApi({
            fileUrl: fileUrl.value,
            async: true,
        }, { isAppend: isCoverDuplicate.value });

        // 格式化表格数据，添加行号
        tableData.value = res.data.map((item, index) => ({
            // ...item,
            msg: item.code + '：' + item.msg,
            success: item.success,
            index: index + 1
        }));
        smartAlert(res.msg, res.success, 1000)

        // 重置上传状态（含重复覆盖开关）
        fileUrl.value = '';
        fileList.value = [];
        uploadRef.value?.clearFiles();
    } catch (error) {
        console.error('导入失败:', error);
        ElMessage.error('导入失败，请重试');
    } finally {
        loading.close();
    }
};

// 打开弹窗（重置所有状态）
const open = () => {
    visible.value = true;
    // 重置所有状态
    tableData.value = [];
    fileUrl.value = '';
    fileList.value = [];
    filterStatus.value = 'all';
    uploadRef.value?.clearFiles();
};

// 关闭弹窗
const close = () => {
    visible.value = false;
};

// 暴露方法给父组件
defineExpose({
    open,
    close
});
</script>

<style scoped lang="scss">
.import-dialog {

    // 新增：提示信息样式
    .upload-hint {
        margin-bottom: 15px;
        padding: 12px;
        background-color: #fff8e6;
        border-radius: 4px;
        border-left: 4px solid #e6a23c;

        .hint-title {
            margin: 0 0 8px 0;
            font-weight: 500;
        }

        .hint-list {
            margin: 0;
            padding-left: 20px;
            line-height: 1.6;
            color: #606266;

            .sub-hint {
                padding-left: 15px;
                color: #909399;
            }

            code {
                padding: 2px 4px;
                background-color: #f5f5f5;
                border-radius: 2px;
                font-size: 0.9em;
            }
        }
    }

    .upload-area {
        margin-bottom: 15px;
    }

    .upload-tip {
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center; // 确保开关和按钮垂直居中

        .text-warning {
            color: #e6a23c;
            margin: 0;
        }

        p {
            margin: 0;
            flex: 1;
            min-width: 200px;
        }

        // 调整开关样式
        .el-switch {
            display: flex;
            align-items: center;
            color: #606266;
        }
    }

    .result-table {
        margin-top: 15px;
        background-color: #fff;
        border-radius: 4px;
        padding: 10px;
    }
}

:deep(.el-upload-dragger) {
    padding: 30px 0;
    background-color: #f5f7fa;
}
</style>