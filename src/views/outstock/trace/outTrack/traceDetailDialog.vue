<template>
    <el-dialog :title="$t('outstock_trace_outTrack_list.infoTitle')" v-model="dialogVisible" width="1100px" align-center
        destroy-on-close :close-on-click-modal="false" @open="handleDialogOpen">
        <!-- 左右分栏布局（包含中间分割线） -->
        <div class="dialog-container">
            <!-- 左栏：对象信息 + 添加表单 -->
            <div class="left-panel">
                <!-- 左上：传入对象信息展示 -->
                <div class="panel-section object-info-section">
                    <h3 class="section-title">{{ $t('basicInfo') }}</h3>
                    <div class="info-grid">
                        <!-- 订单号 -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('outOrderNo') }}:</span>
                            <span class="info-value">{{ orderInfo.outOrderNo || '-' }}</span>
                        </div>
                        <!-- 跟踪号 -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('trackingNo') }}:</span>
                            <span class="info-value">{{ orderInfo.trackingNo || '-' }}</span>
                        </div>
                        <!-- 客户编码(客户名称) -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('customerCode') }}:</span>
                            <span class="info-value">
                                {{ orderInfo.customerCode ? `${orderInfo.customerCode}(${orderInfo.customerName || ''})`
                                    : '-' }}
                            </span>
                        </div>
                        <!-- 目的国编码(目的国名称) -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('destCountryName') }}:</span>
                            <span class="info-value">
                                {{ orderInfo.destCountryCode ? `${orderInfo.destCountryCode}(${orderInfo.destCountryName
                                    || ''})` : '-' }}
                            </span>
                        </div>
                        <!-- 渠道 -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('shipwayName') }}:</span>
                            <span class="info-value">{{ orderInfo.shipwayName || '-' }}</span>
                        </div>
                        <!-- 承运商 -->
                        <div class="info-item">
                            <span class="info-label">{{ getColumnText('carrierCode') }}:</span>
                            <span class="info-value">{{ orderInfo.carrierCode || '-' }}</span>
                        </div>
                        <!-- 订单创建时间 -->
                        <div class="info-item" style="width: 100%;">
                            <span class="info-label">{{ getColumnText('orderCreationTime') }}:</span>
                            <span class="info-value">{{ orderInfo.orderCreationTime || '-' }}</span>
                        </div>
                        <!-- 发货时间 -->
                        <div class="info-item" style="width: 100%;">
                            <span class="info-label">{{ getColumnText('shippedTime') }}:</span>
                            <span class="info-value">{{ orderInfo.shippedTime || '-' }}</span>
                        </div>
                        <!-- 签收时间 -->
                        <div class="info-item" style="width: 100%;">
                            <span class="info-label">{{ getColumnText('deliveredTime') }}:</span>
                            <span class="info-value">{{ orderInfo.deliveredTime || '-' }}</span>
                        </div>
                        <!-- 运单URL -->
                        <div class="info-item" style="width: 100%;">
                            <span class="info-label">{{ getColumnText('labelUrl') }}:</span>
                            <a :href="orderInfo.labelUrl" target="_blank" rel="noopener noreferrer">
                                {{ orderInfo.labelUrl }}
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 左下：添加轨迹表单 -->
                <div class="panel-section add-form-section">
                    <h3 class="section-title">{{ $t('addTrack') }}</h3>
                    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="90px"
                        class="trajectory-form">
                        <!-- 轨迹时间 -->
                        <el-form-item :label="getLabel('traceTime')" prop="traceTime">
                            <el-date-picker v-model="formData.traceTime" type="datetime"
                                :placeholder="getPlaceholder('traceTime')" value-format="YYYY-MM-DD HH:mm:ss"
                                style="width: 100%" />
                        </el-form-item>

                        <!-- 轨迹地点 -->
                        <el-form-item :label="getLabel('traceLocation')" prop="traceLocation">
                            <el-input v-model="formData.traceLocation" :placeholder="getPlaceholder('traceLocation')"
                                maxlength="100" style="width: 100%" />
                        </el-form-item>

                        <!-- 轨迹详情 -->
                        <el-form-item :label="getLabel('traceEvent')" prop="traceEvent">
                            <el-input v-model="formData.traceEvent" :placeholder="getPlaceholder('traceEvent')"
                                type="textarea" :rows="1" maxlength="500" style="width: 100%" />
                        </el-form-item>

                        <!-- 备注 -->
                        <el-form-item :label="getLabel('remark')" prop="remark">
                            <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea"
                                :rows="1" maxlength="200" style="width: 100%" />
                        </el-form-item>

                        <!-- 附件上传 -->
                        <el-form-item :label="getLabel('fileJson')" prop="fileJson">
                            <el-input v-model="fileJsonDisplay" :placeholder="getPlaceholder('fileJson')" readonly
                                style="width: 100%">
                                <template #append>
                                    <el-upload :auto-upload="true" :http-request="handleFileUpload"
                                        :before-upload="beforeFileUpload" :show-file-list="false" multiple>
                                        <el-button icon="Upload" type="primary" size="small">{{ getButtonText('upload')
                                            }}</el-button>
                                    </el-upload>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 添加按钮 -->
                        <el-form-item style="text-align: right; margin-top: 10px;">
                            <el-button type="primary" @click="handleAddTrace" :loading="formLoading">
                                {{ getButtonText('addTrack') }}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <!-- 中间分割线 -->
            <div class="divider"></div>

            <!-- 右栏：轨迹时间线列表 -->
            <div class="right-panel">
                <div class="panel-header">
                    <h3 class="section-title">{{ $t('trackList') }}</h3>
                </div>
                <div class="timeline-container">
                    <el-timeline v-if="timelineData.length > 0" :reverse="true">
                        <el-timeline-item v-for="(item, index) in timelineData" :key="item.id || index"
                            :timestamp="formatTime(item.traceTime)" placement="top" style="margin-bottom: 20px;">
                            <div class="timeline-card">
                                <div class="timeline-content">
                                    <!-- 第一行：(轨迹节点) 轨迹地点 -->
                                    <div class="trace-main-info">
                                        <span class="pod-status">
                                            ({{ item.podStatusName || '未知节点' }})
                                        </span>
                                        <span class="trace-location">{{ item.traceLocation }}</span>
                                    </div>

                                    <!-- 第二行：详情 -->
                                    <div class="trace-detail">
                                        <span class="detail-label">{{ getButtonText('detail') }}:</span>
                                        <span class="detail-content">{{ item.traceEvent }}</span>
                                    </div>

                                    <!-- 第三行：轨迹备注 -->
                                    <div class="trace-remark" v-if="item.remark">
                                        <span class="remark-label">{{ getLabel('remark') }}</span>
                                        <span class="remark-content">{{ item.remark }}</span>
                                    </div>

                                    <!-- 第四行：附件（格子布局） -->
                                    <div class="trace-attachments"
                                        v-if="item.fileJson && JSON.parse(item.fileJson).length > 0">
                                        <span class="attachments-label">{{ getLabel('fileJson') }}</span>
                                        <div class="attachments-grid">
                                            <div v-for="(file, idx) in JSON.parse(item.fileJson)" :key="idx"
                                                class="attachment-item" @click="handleDownloadFile(file)">
                                                <!-- 图片类型显示缩略图（不显示文件名） -->
                                                <div v-if="isImageFile(file.name)" class="image-preview">
                                                    <el-image :src="file.url" :preview-src-list="[file.url]" fit="cover"
                                                        class="preview-img" preview-teleported>
                                                        <template #error>
                                                            <div class="image-placeholder">
                                                                <el-icon class="image-icon">
                                                                    <Picture />
                                                                </el-icon>
                                                            </div>
                                                        </template>
                                                    </el-image>
                                                </div>

                                                <!-- 文件类型显示图标+文件名 -->
                                                <div v-else class="file-item">
                                                    <div class="file-icon-container">
                                                        <el-icon class="file-icon">
                                                            <Folder />
                                                        </el-icon>
                                                    </div>
                                                    <div class="file-name">{{ file.name }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <el-button type="text"
                                    style="color: #ff4d4f; padding: 0; position: absolute; top: 10px; right: 10px;"
                                    @click="handleDeleteTrace(item.id)">
                                    {{ getButtonText('del') }}
                                </el-button>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                    <div v-else class="empty-timeline">
                        <el-empty :description="$t('noRecord')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <template #footer>
            <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, nextTick, computed } from 'vue';
import { Folder } from '@element-plus/icons-vue';
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import {
    addOutstockOrderTraceApi,
    getOutstockOrderTraceDetailListApi,
    deleteOutstockOrderTraceByIdApi
} from '@/api/outstockApi/trace.js';
import { uploadApi } from '@/api/baseApi/index.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'

// 定义Props - 外部传入对象（必须包含trackId，用于接口调用）
const props = defineProps({
    orderInfo: {
        type: Object,
        required: true
    }
});

// 弹窗显示状态（内部控制）
const dialogVisible = ref(false);

// 表单核心数据
const formRef = ref(null);
const formData = ref({
    traceTime: '',
    traceLocation: '',
    traceEvent: '',
    remark: '',
    fileJson: [] // 存储格式：[{url: string, name: string, fileType: string}]
});
const formLoading = ref(false);
const loading = ref(false);

// 附件显示用（只读，展示已上传文件名）
const fileJsonDisplay = computed(() => {
    return formData.value.fileJson.map(file => file.name).join('、') || '';
});

// 表单校验规则
const formRules = ref({
    traceTime: [{ required: true, message: '请选择轨迹时间', trigger: 'change' }],
    traceLocation: [{ required: true, message: '请输入轨迹地点', trigger: 'blur' }],
    traceEvent: [{ required: true, message: '请输入轨迹详情', trigger: 'blur' }],
});

// 轨迹时间线数据
const timelineData = ref([]);
// 传入的订单信息（简化访问）
const orderInfo = ref(props.orderInfo);

/**
 * 暴露给外部的打开弹窗方法
 */
const openDialog = () => {
    orderInfo.value = props.orderInfo; // 刷新传入的订单信息
    dialogVisible.value = true;
};
defineExpose({ openDialog });

/**
 * 弹窗打开时初始化
 */
const handleDialogOpen = async () => {
    nextTick(() => {
        resetForm();
    });
    // 获取轨迹列表
    await getTraceList();
};

/**
 * 获取轨迹列表（传入正确的trackId参数）
 */
const getTraceList = async () => {
    loading.value = true;
    try {
        const res = await getOutstockOrderTraceDetailListApi({
            trackId: orderInfo.value.id
        });
        timelineData.value = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
    } catch (error) {
        smartAlert(`获取轨迹列表失败：${error.message || '网络异常'}`, false)
        timelineData.value = [];
    } finally {
        loading.value = false;
    }
};

/**
 * 附件上传前校验
 */
const beforeFileUpload = (file) => {
    return true;
};

/**
 * 附件上传处理
 */
const handleFileUpload = async (options) => {
    const file = options.file;
    if (!file) return;

    const loadingInstance = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        const res = await uploadApi(file, { path: 'temp' });
        if (res.success && res.data) {
            const fileName = file.name;
            const fileType = fileName.split('.').pop() || '';
            formData.value.fileJson.push({
                url: res.data,
                name: fileName,
                fileType: fileType.toLowerCase()
            });
            smartAlert(`文件《${fileName}》上传成功`, true, 1000)
        } else {
            smartAlert(`文件上传失败：${res?.msg || '服务器异常'}`, false)
        }
    } catch (error) {
        smartAlert(`文件上传出错：${error.message || '网络异常'}`, false)
    } finally {
        loadingInstance.close();
    }
};

/**
 * 添加轨迹
 */
const handleAddTrace = async () => {
    try {
        // 表单校验
        await formRef.value.validate();

        formLoading.value = true;
        const params = {
            trackId: orderInfo.value.id,
            outOrderId: orderInfo.value.outOrderNo,
            traceTime: formData.value.traceTime,
            traceLocation: formData.value.traceLocation,
            traceEvent: formData.value.traceEvent,
            remark: formData.value.remark,
            fileJson: formData.value.fileJson.length > 0 ? JSON.stringify(formData.value.fileJson) : null
        };

        // 调用添加接口
        const res = await addOutstockOrderTraceApi(params);
        if (res.success) {
            smartAlert(res.msg, true, 1000)
            // 刷新轨迹列表
            await getTraceList();
            // 重置表单
            resetForm();
        } else {
            smartAlert(res.msg, false)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('表单校验错误：', error);
        } else {
            console.error('未知错误：', error);
        }
    } finally {
        formLoading.value = false;
    }
};

/**
 * 删除轨迹（确保删除后重新获取最新数据）
 */
const handleDeleteTrace = async (id) => {
    if (!id) return;

    try {
        const res = await deleteOutstockOrderTraceByIdApi({ id });
        if (res.success) {
            smartAlert(res.msg, true, 1000)
            timelineData.value = [];
            await getTraceList();
        } else {
            smartAlert(res.msg, false)
        }
    } catch (error) {
        smartAlert(`删除轨迹失败：${error.message || '网络异常'}`, false)
    }
};

/**
 * 重置表单
 */
const resetForm = () => {
    formData.value = {
        traceTime: '',
        traceLocation: '',
        traceEvent: '',
        remark: '',
        fileJson: []
    };
    if (formRef.value) {
        formRef.value.clearValidate();
    }
};

/**
 * 格式化时间显示（兼容null/undefined）
 */
const formatTime = (timeStr) => {
    if (!timeStr) return '未知时间';
    const date = new Date(timeStr);
    // 兼容不同浏览器的时间格式解析
    if (isNaN(date.getTime())) return timeStr;
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

/**
 * 附件下载/预览处理
 */
const handleDownloadFile = (file) => {
    if (!file?.url) return;
    if (!isImageFile(file.name)) {
        window.open(file.url, '_blank');
    }
};

/**
 * 判断是否为图片文件
 */
const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tif'];
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return imageExtensions.includes(ext);
};
</script>

<style scoped>
/* 弹窗容器：高度自适应，flex布局 */
.dialog-container {
    display: flex;
    height: calc(100vh - 200px);
    /* 自适应弹窗高度，预留顶部标题和底部按钮空间 */
    min-height: 500px;
    gap: 0;
}

/* 左栏：宽度45%，flex垂直布局 */
.left-panel {
    width: 45%;
    display: flex;
    flex-direction: column;
    padding: 0;
}

/* 右栏：宽度55%，flex垂直布局，右侧滚动 */
.right-panel {
    width: 55%;
    display: flex;
    flex-direction: column;
}

/* 中间分割线 */
.divider {
    width: 1px;
    background-color: #e5e7eb;
    margin: 0 20px;
}

/* 面板区块样式（替代el-card） */
.panel-section {
    background-color: #fff;
    border-radius: 8px;
    padding: 0 10px;
}

/* 左栏表单区域：占满剩余高度，可滚动 */
.add-form-section {
    flex: 1;
    overflow-y: auto;
}

/* 右栏头部 */
.panel-header {
    padding: 0 10px;
}

/* 右栏时间线容器：占满剩余高度，超出滚动 */
.timeline-container {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 20px;
    margin-top: 16px;
}

/* section标题样式 */
.section-title {
    font-size: 16px;
    font-weight: 500;
    margin: 8px 0;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: var(--el-color-primary);
    margin-right: 8px;
    border-radius: 2px;
}

/* 基础信息网格布局（每行两个字段） */
.info-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 0;
    padding: 8px 0;
}

.info-item {
    width: 50%;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.5;
}

.info-label {
    color: var(--el-text-color-secondary);
    margin-right: 8px;
    white-space: nowrap;
    width: 90px;
    display: inline-block;
}

.info-value {
    color: var(--el-text-color-primary);
    word-break: break-all;
}

/* 表单样式 */
.trajectory-form {
    padding: 10px 0;
}

:deep(.el-form-item) {
    margin-bottom: 16px;
}

:deep(.el-upload) {
    margin-left: 8px;
}

:deep(.el-date-editor) {
    width: 100% !important;
}

:deep(.el-textarea__inner) {
    resize: vertical;
}

/* 时间线样式 */
:deep(.el-timeline) {
    padding-left: 20px;
}

/* 时间线卡片（替代el-card） */
.timeline-card {
    position: relative;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    overflow: hidden;
}

/* 轨迹内容样式 */
.timeline-content {
    position: relative;
    padding-right: 40px;
    /* 给删除按钮留空间 */
}

/* 第一行：(轨迹节点) 轨迹地点 */
.trace-main-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    line-height: 1.6;
}

.pod-status {
    color: var(--el-color-primary);
    font-size: 14px;
    font-weight: 500;
}

.trace-location {
    color: var(--el-text-color-primary);
    font-size: 14px;
    flex: 1;
    word-break: break-all;
}

/* 第二行：详情 */
.trace-detail {
    font-size: 13px;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    line-height: 1.5;
}

.detail-label {
    color: var(--el-text-color-secondary);
    margin-right: 4px;
}

.detail-content {
    word-break: break-all;
}

/* 第三行：备注 */
.trace-remark {
    font-size: 13px;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    line-height: 1.5;
}

.remark-label {
    color: var(--el-text-color-secondary);
    margin-right: 4px;
}

.remark-content {
    word-break: break-all;
}

/* 第四行：附件区域 */
.trace-attachments {
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--el-text-color-primary);
}

.attachments-label {
    color: var(--el-text-color-secondary);
    margin-right: 8px;
    display: inline-block;
    margin-bottom: 8px;
}

/* 附件网格布局 */
.attachments-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

/* 单个附件项 */
.attachment-item {
    width: 65px;
    height: 65px;
    /* 图片类型高度调整，不显示文件名 */
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

/* 图片类型附件高度 */
:deep(.attachment-item .image-preview) {
    height: 100%;
}

.attachment-item:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 图片预览样式 */
.image-preview {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 图片占位符 */
.image-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-icon {
    font-size: 24px;
    color: #999;
}

/* 文件项样式 */
.file-item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
}

.file-icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--el-color-primary-light-9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.file-icon {
    font-size: 20px;
    color: var(--el-color-primary);
}

.file-name {
    font-size: 11px;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;
    text-align: center;
}

/* 空状态样式 */
.empty-timeline {
    text-align: center;
    padding: 50px 0;
    color: #999;
}

:deep(.empty-timeline .el-empty) {
    --el-empty-padding: 0;
}

/* 弹窗滚动优化 */
:deep(.el-dialog__body) {
    padding: 20px;
    overflow: hidden;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 3px;
}

::-webkit-scrollbar-track {
    background-color: #f9fafb;
}

/* 左栏表单区域滚动条 */
.add-form-section::-webkit-scrollbar {
    width: 6px;
}

/* 右栏时间线滚动条 */
.timeline-container::-webkit-scrollbar {
    width: 6px;
}

/* 图片预览样式调整 */
:deep(.el-image-viewer__wrapper) {
    z-index: 3000 !important;
}

/* 修复Element Plus组件样式冲突 */
:deep(.el-button--text) {
    padding: 0 !important;
}

:deep(.el-timeline-item__timestamp) {
    font-size: 12px !important;
    color: var(--el-text-color-secondary) !important;
}

/* 图片预览teleported样式修复 */
:deep(.el-image-viewer) {
    z-index: 3000 !important;
}

/* 弹窗标题 */
:deep(.el-dialog__header) {
    padding-bottom: 5px;
}
</style>