<template>
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

        <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" drag :show-file-list="false" multiple
            :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="1">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖放文件 或 <em>点击选择</em>
            </div>
            <template #tip>
                <div class="tip">
                    <el-button type="primary" @click="commit" style="margin-right: 10px;">提交导入</el-button>
                    <p v-if="fileUrl" style=" ">
                        文件URL: <a :href=fileUrl>{{ fileUrl }}</a> </p>
                    <p v-else>
                        请上传文件!</p>
                </div>
            </template>
        </el-upload>

        <div class="commit">
            <el-table :data="filteredTableData" style="width: 100%;height: 100%;" border max-height="100%">
                <el-table-column prop="index" label="行号" width="75" />
                <el-table-column prop="isSuccess" label="成功/失败" width="100">
                    <template #default="{ row }">
                        <span :style="row.isSuccess ? 'color: green' : 'color: red'">{{ row.isSuccess ? '成功' : '失败'
                        }}</span>
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
    </div>
</template>

<script setup name="导入">
import { ref, shallowRef, computed, onMounted, onBeforeUnmount } from 'vue';
import { ElLoading } from 'element-plus';
import { Loading } from '@element-plus/icons-vue'; // 引入 Loading 图标
import { smartAlert } from '@/utils/genericMethods.js';
import { toDownloadTempPath } from '@/utils/downLoad.js';
import { uploadApi } from '@/api/baseApi/index.js';
import { getTemplateApi } from '@/api/baseApi/index.js';
import { importJobAddApi, getImportJobByIdApi } from '@/api/sysApi/job.js';

/*-----------------------------------------
  Props (组件参数)
-----------------------------------------*/
const props = defineProps({
    /**
     * 导入业务类型 ID
     */
    typeId: {
        type: Number,
        required: true
    },
    /**
     * 导入业务名称 (用于显示或逻辑判断)
     */
    typeName: {
        type: String,
        required: true
    },
    /**
     * 关联业务 ID
     * 将会被转换为 importParam 传递给后端
     */
    id: {
        type: Number,
        required: false,
        default: null
    }
})

/*-----------------------------------------
  状态变量
-----------------------------------------*/
const templateList = ref([]);     // 模板列表
const tableData = shallowRef([]); // 导入结果数据
const filterStatus = ref('all');  // 结果筛选状态
const fileUrl = ref('');          // 上传文件的 URL
const fileList = ref([]);         // 上传组件的文件列表
const uploadRef = ref();          // 上传组件引用

// 新增：控制“正在处理”弹窗的显示与隐藏
const processingDialogVisible = ref(false);
// 轮询定时器引用
let pollTimer = null;

/*-----------------------------------------
  计算属性
-----------------------------------------*/
// 根据 success/fail 状态过滤表格数据
const filteredTableData = computed(() => {
    if (filterStatus.value === 'all') return tableData.value;
    return filterStatus.value === 'success'
        ? tableData.value.filter(item => item.isSuccess)
        : tableData.value.filter(item => !item.isSuccess);
})

/*-----------------------------------------
  方法定义
-----------------------------------------*/

/**
 * 提交导入请求
 * 1. 校验文件
 * 2. 创建导入任务
 * 3. 开启处理弹窗并启动轮询
 */
const commit = async () => {
    if (!fileUrl.value) {
        smartAlert('请先上传文件', false)
        return
    }

    // 这里仅使用 Loading 遮罩等待任务创建接口返回
    const loadingInstance = ElLoading.service({ lock: true, text: '正在提交请求...' })

    try {
        // 构建参数
        const params = {
            async: true,
            fileUrl: fileUrl.value,
            typeId: props.typeId
        };

        // 如果存在 props.id，映射为 importParam
        if (props.id !== null && props.id !== undefined) {
            params.importParam = String(props.id);
        }

        // 1. 调用任务创建接口
        const res = await importJobAddApi(params);
        loadingInstance.close(); // 接口返回后关闭全屏遮罩

        if (!res.success) {
            smartAlert(res.msg, false);
            return;
        }

        // 2. 核心逻辑：打开“正在处理”弹窗，并开始轮询
        processingDialogVisible.value = true;
        const jobId = res.data.id;
        pollJobResult(jobId);

    } catch (error) {
        console.error('导入请求失败:', error)
        smartAlert('导入请求失败', false)
        loadingInstance.close()
    }
}

/**
 * 轮询任务结果
 * 递归调用，直到获取结果或页面销毁
 * @param {String} jobId 任务ID
 */
const pollJobResult = async (jobId) => {
    // 如果定时器已被清理（说明页面已销毁），则不再执行后续请求
    // 注意：这里我们不判断 processingDialogVisible，因为即使弹窗关闭，轮询也要继续更新表格

    try {
        const res = await getImportJobByIdApi({ id: jobId });
        const jobData = res.data;

        // 1. 成功获取结果（returnData 有值）
        if (jobData && jobData.returnData) {
            try {
                // 解析并渲染表格
                tableData.value = JSON.parse(jobData.returnData);
                smartAlert('导入处理完成', true, 1000);
            } catch (e) {
                console.error('解析结果JSON失败', e);
                smartAlert('解析导入结果失败', false);
            }

            // 任务完成时的清理工作
            finalizeImport();
            return; // 结束轮询
        }

        // 2. 任务失败（statusId = 4 且无数据）
        if (jobData && jobData.statusId === 4) {
            smartAlert(jobData.returnMessage || '导入任务执行失败', false);
            finalizeImport(); // 即使失败也关闭弹窗和清理状态
            return;
        }

        // 3. 任务仍在进行中，继续轮询 (间隔 2秒)
        // 只有当组件未被销毁时才继续轮询 (通过检查 pollTimer 是否被强制置空来辅助判断，或者直接依赖 onBeforeUnmount 的 clearTimeout)
        pollTimer = setTimeout(() => {
            pollJobResult(jobId);
        }, 2000);

    } catch (error) {
        console.error('轮询任务状态失败:', error);
        // 遇到网络错误暂不中断，可以重试，或者选择中断，这里选择报错并停止
        smartAlert('获取任务状态失败', false);
        processingDialogVisible.value = false; // 关闭弹窗
    }
}

/**
 * 导入结束后的统一清理逻辑
 * 关闭弹窗、清空文件、停止轮询
 */
const finalizeImport = () => {
    processingDialogVisible.value = false; // 关闭处理弹窗
    fileUrl.value = '';
    fileList.value = [];
    uploadRef.value?.clearFiles();

    // 清理定时器
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
}

/**
 * 上传前校验
 * 限制文件格式为 .xlsx
 */
const beforeUpload = (file) => {
    if (!file.name.endsWith('.xlsx')) {
        smartAlert('请上传Excel文件', false)
        return false
    }
}

/**
 * 文件上传处理
 * 获取 OSS URL
 */
const handleUpload = async (options) => {
    const loadingInstance = ElLoading.service({ lock: true, text: 'Loading' })
    try {
        fileUrl.value = ''
        fileList.value = []

        const res = await uploadApi(options.file, { path: 'temp' })
        fileUrl.value = res.data
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        console.error('上传失败:', error)
        smartAlert('文件上传失败', false)
    } finally {
        loadingInstance.close()
    }
}

/*-----------------------------------------
  生命周期
-----------------------------------------*/
onMounted(async () => {
    // 初始化获取模板列表
    const templateRes = await getTemplateApi({ atypeId: 1, btypeId: props.typeId })
    templateList.value = templateRes.data
})

onBeforeUnmount(() => {
    // 组件销毁前必须清理定时器，停止后台轮询
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
})
</script>

<style scoped lang="scss">
.viewArea {
    display: flex;
    flex-direction: column;
    max-width: 1100px;
    min-width: 720px;

    .title {
        display: flex;
        font-size: 16px;
        color: #323233;
        margin-bottom: 10px;
        font-weight: 550;
        padding-left: 5px;
    }

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
        min-height: 300px;
        flex: 1;
        overflow: hidden;

        .commitForm {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            p {
                margin: 0 10px;
            }
        }

        .el-select {
            width: 240px;
            margin-right: 10px;
        }
    }
}

:deep(.el-upload-dragger) {
    padding: 15px 0;
}

/* --- 新增：处理弹窗内容的样式 --- */
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