<template>
    <el-dialog v-model="importDialogVisible" :title="importTitle" width="900" align-center @close="handleClose"
        destroy-on-close :close-on-click-modal="false">
        <div class="viewArea">
            <div class="el-upload__tip">
                <p>请仔细阅读模板说明</p>
                <p>并注意从其他文件复制数据时不要带格式粘贴，如出现科学计数格式、公式等，都是会导入失败的。</p>
                <p>温馨提示，请确保使用最新Excel模板</p>
            </div>

            <div class="templateDownload">
                <div class="templateItem" v-for="(item, index) in templateList" :key="index">
                    <a :href="toDownloadTempPath(item.fileUrl)">{{ item.name }}</a>
                    ({{ item.updatedTime ? item.updatedTime : item.createdTime }})
                </div>
            </div>

            <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" drag :show-file-list="false"
                multiple :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="1">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖放文件 或 <em>点击选择</em>
                </div>
                <template #tip>
                    <div class="tip">
                        <el-button type="primary" @click="commit" style="margin-right: 10px;">提交导入</el-button>
                        <p v-if="fileUrl">
                            文件URL: <a :href="fileUrl">{{ fileUrl }}</a>
                        </p>
                        <p v-else>
                            请上传文件!
                        </p>
                    </div>
                </template>
            </el-upload>

            <div class="commit">
                <el-table :data="filteredTableData" style="width: 100%;height: 100%;" border max-height="390px">
                    <el-table-column prop="index" label="行号" width="75" />
                    <el-table-column prop="isSuccess" label="成功/失败" width="100">
                        <template #default="{ row }">
                            <span :style="row.isSuccess ? 'color: green' : 'color: red'">
                                {{ row.isSuccess ? '成功' : '失败' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="right" label="消息">
                        <template #header>
                            <div style="display: flex;align-items: center;">
                                <span>消息</span>
                                <el-select v-model="filterStatus" placeholder="筛选状态"
                                    style="width: 80px;margin-left: auto;margin-right: none;">
                                    <el-option label="全部" value="all" />
                                    <el-option label="成功" value="success" />
                                    <el-option label="失败" value="fail" />
                                </el-select>
                            </div>
                        </template>
                        <template #default="{ row }">
                            <p style="text-align: start;">{{ row.msg }}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="importDialogVisible = false">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="processingDialogVisible" title="批量导入数据" width="400px" align-center append-to-body
        :close-on-click-modal="false">
        <div class="processing-content">
            <el-icon class="is-loading processing-icon">
                <Loading />
            </el-icon>
            <p class="processing-text">正在处理导入请求，请稍候...</p>
            <p class="processing-hint">提示：您可以关闭此弹窗，导入结果将在表格中显示</p>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="processingDialogVisible = false">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="导入">
import { ref, computed, shallowRef, onMounted, onBeforeUnmount } from 'vue';
import { ElLoading } from 'element-plus';
import { Loading } from '@element-plus/icons-vue'; // 引入 Loading 图标
import { smartAlert } from '@/utils/genericMethods.js';
import { toDownloadTempPath } from '@/utils/downLoad.js';
import { uploadApi } from '@/api/baseApi/index.js';
import { getTemplateApi } from '@/api/baseApi/index.js';
import { importJobAddApi, getImportJobByIdApi } from '@/api/sysApi/job.js';

/*-----------------------------------------
  Props & Emits
-----------------------------------------*/
const props = defineProps({
    typeId: { type: Number, required: true },
    id: { type: Number, default: null },
    importTitle: { type: String, default: '导入' }
});

const emit = defineEmits(['close']);

/*-----------------------------------------
  状态变量
-----------------------------------------*/
const importDialogVisible = ref(false);
const templateList = ref([]);
const tableData = shallowRef([]);
const filterStatus = ref('all');
const fileUrl = ref('');
const fileList = ref([]);
const uploadRef = ref();

// “正在处理”弹窗的显示
const processingDialogVisible = ref(false);
// 轮询定时器
let pollTimer = null;

/*-----------------------------------------
  计算属性
-----------------------------------------*/
const filteredTableData = computed(() => {
    if (filterStatus.value === 'all') return tableData.value;
    return filterStatus.value === 'success'
        ? tableData.value.filter(item => item.isSuccess)
        : tableData.value.filter(item => !item.isSuccess);
});

/*-----------------------------------------
  方法定义
-----------------------------------------*/

/**
 * 加载模板
 */
const loadTemplates = async () => {
    try {
        const templateRes = await getTemplateApi({ atypeId: 1, btypeId: props.typeId });
        templateList.value = templateRes.data || [];
    } catch (error) {
        console.error('加载导入模板失败', error);
        smartAlert('加载模板失败，请重试', false);
    }
};

/**
 * 关闭主弹窗
 * 需要同时清理轮询定时器
 */
const handleClose = () => {
    importDialogVisible.value = false;
    clearTimer(); // 停止轮询
    emit('close');
};

/**
 * 清理定时器
 */
const clearTimer = () => {
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
};

/**
 * 打开主弹窗
 */
const openImportDialog = () => {
    if (!importDialogVisible.value) loadTemplates();
    importDialogVisible.value = true;
};

/**
 * 文件格式校验
 */
const beforeUpload = (file) => {
    if (!file.name.endsWith('.xlsx')) {
        smartAlert('请上传Excel文件', false);
        return false;
    }
};

/**
 * 文件上传
 */
const handleUpload = async (options) => {
    try {
        fileUrl.value = '';
        fileList.value = [];
        const res = await uploadApi(options.file, { path: 'temp' });
        fileUrl.value = res.data;
        smartAlert(res.msg, res.success, 1000);
    } catch (error) {
        console.error('上传失败:', error);
        smartAlert('文件上传失败', false);
    }
};

/**
 * 提交导入任务
 */
const commit = async () => {
    if (!fileUrl.value) {
        smartAlert('请先上传文件', false);
        return;
    }
    try {
        const params = {
            fileUrl: fileUrl.value,
            typeId: props.typeId,
            async: true
        };

        if (props.id !== null && props.id !== undefined) {
            params.importParam = String(props.id);
        }

        // 1. 调用任务创建接口
        const res = await importJobAddApi(params);
        if (!res.success) {
            smartAlert(res.msg, false);
            return;
        }

        // 2. 开启“正在处理”弹窗，并启动轮询
        processingDialogVisible.value = true;
        const jobId = res.data.id;
        pollJobResult(jobId);

    } catch (error) {
        console.error('导入请求失败:', error);
        smartAlert('导入请求失败', false);
    }
};

/**
 * 轮询任务结果
 * 递归调用，直到完成或失败
 */
const pollJobResult = async (jobId) => {
    try {
        const res = await getImportJobByIdApi({ id: jobId });
        const jobData = res.data;

        // 1. 成功获取结果 (returnData 有值)
        if (jobData && jobData.returnData) {
            try {
                tableData.value = JSON.parse(jobData.returnData);
                smartAlert('导入处理完成', true, 1000);
            } catch (e) {
                console.error('解析结果JSON失败', e);
                smartAlert('解析导入结果失败', false);
            }
            finalizeImport(); // 完成后清理
            return;
        }

        // 2. 任务失败 (statusId=4 且无数据)
        if (jobData && jobData.statusId === 4) {
            smartAlert(jobData.returnMessage || '导入任务执行失败', false);
            finalizeImport(); // 即使失败也清理状态
            return;
        }

        // 3. 继续轮询 (间隔2秒)
        pollTimer = setTimeout(() => {
            pollJobResult(jobId);
        }, 2000);

    } catch (error) {
        console.error('轮询任务状态失败:', error);
        smartAlert('获取任务状态失败', false);
        processingDialogVisible.value = false; // 出错时关闭处理弹窗
    }
};

/**
 * 结束导入流程的清理工作
 */
const finalizeImport = () => {
    processingDialogVisible.value = false; // 关闭处理弹窗
    fileUrl.value = '';
    fileList.value = [];
    uploadRef.value?.clearFiles();
    clearTimer(); // 停止定时器
};

/*-----------------------------------------
  生命周期
-----------------------------------------*/

onBeforeUnmount(() => {
    clearTimer(); // 销毁前强制停止轮询
});

defineExpose({ openImportDialog });
</script>

<style scoped lang="scss">
.viewArea {
    display: flex;
    flex-direction: column;
    max-width: 1100px;
    min-width: 720px;
    padding: 10px;
    background-color: #f0f1f3;

    .el-upload__tip {
        font-size: 16px;
        padding-left: 5px;

        p:last-of-type {
            margin-top: 10px;
            color: red;
        }
    }

    .tip {
        display: flex;
        height: 45px;
        align-items: center;
        background-color: white;
        padding: 0 10px;
        border-radius: 3px;
    }

    .templateDownload {
        background-color: white;
        padding: 10px 5px;
        display: flex;
        flex-wrap: wrap;
        font-size: 15px;
        margin-bottom: 10px;

        .templateItem {
            margin: 5px 15px;

            a {
                color: #409eff;
                font-weight: 550;
            }
        }
    }

    .commit {
        background-color: white;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 10px 5px;
        min-height: 390px;
        flex: 1;
        overflow: hidden;
    }
}

:deep(.el-upload-dragger) {
    padding: 7px 0;
}

/* --- 新增：处理状态弹窗样式 --- */
.processing-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    text-align: center;

    .processing-icon {
        font-size: 40px;
        color: #409eff;
        margin-bottom: 15px;
    }

    .processing-text {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
        color: #303133;
    }

    .processing-hint {
        font-size: 13px;
        color: #909399;
    }
}
</style>