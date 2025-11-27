<template>
    <div class="viewArea">
        <div class="contentDiv">
            <el-row :gutter="20" class="main-layout">
                <el-col :span="6" class="left-panel">
                    <el-card shadow="never" class="info-card mb-10">
                        <template #header>
                            <div class="card-header">
                                <span>工单信息</span>
                                <el-tag :type="getStatusType(detailData.statusId)">{{ detailData.statusName }}</el-tag>
                            </div>
                        </template>
                        <div class="info-list">
                            <div class="info-item">
                                <span class="label">工单号：</span>
                                <span class="value copy-text">{{ detailData.workOrderNo }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">公司：</span>
                                <span class="value">{{ detailData.orgName }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">客户：</span>
                                <span class="value">{{ detailData.customerCode }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">优先级：</span>
                                <span class="value">{{ detailData.priorityName }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">关联业务：</span>
                                <span class="value">{{ detailData.relatedBizNo || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">联系人：</span>
                                <span class="value">{{ detailData.contact }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">电话：</span>
                                <span class="value">{{ detailData.phone }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">创建时间：</span>
                                <span class="value">{{ detailData.createdTime }}</span>
                            </div>
                        </div>
                    </el-card>

                    <el-card shadow="never" class="timeline-card">
                        <template #header>
                            <div class="card-header">
                                <span>流转记录</span>
                            </div>
                        </template>
                        <el-scrollbar max-height="400px">
                            <el-timeline>
                                <el-timeline-item v-for="(activity, index) in detailData.workOrderUserList" :key="index"
                                    :timestamp="activity.createdTime" placement="top" color="#409EFF">
                                    <div class="timeline-content">
                                        <div class="name">{{ activity.employeeNum }} ({{ activity.employeeName }})</div>
                                        <div class="remark" v-if="activity.remark">{{ activity.remark }}</div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-scrollbar>
                    </el-card>
                </el-col>

                <el-col :span="18" class="right-panel">
                    <div class="right-panel-container">
                        <div class="detail-section">
                            <div class="detail-header">
                                <h2 class="detail-title">{{ detailData.title }}</h2>
                                <div class="detail-meta">
                                    <el-tag effect="plain" size="small">{{ detailData.typeName }}</el-tag>
                                    <el-tag effect="plain" size="small" v-if="detailData.secondTypeName">{{
                                        detailData.secondTypeName }}</el-tag>
                                </div>
                            </div>
                            <div class="detail-content">
                                {{ detailData.content }}
                            </div>
                            <div class="detail-files" v-if="parseFiles(detailData.fileUrl).length > 0">
                                <div class="file-label">附件：</div>
                                <div class="file-list">
                                    <div v-for="(file, idx) in parseFiles(detailData.fileUrl)" :key="idx"
                                        class="file-item">
                                        <el-icon>
                                            <Document />
                                        </el-icon>
                                        <a :href="file.url" target="_blank" :title="file.name">{{ file.name }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="chat-section" ref="chatScrollRef">
                            <div v-if="detailData.workOrderDetailList && detailData.workOrderDetailList.length > 0">
                                <div v-for="msg in detailData.workOrderDetailList" :key="msg.id" class="chat-message">
                                    <div class="message-header">
                                        <span class="user-name">{{ msg.userCode || msg.createdBy }}</span>
                                        <span class="time">{{ msg.createdTime }}</span>
                                    </div>
                                    <div class="message-body">
                                        <div class="text-content">{{ msg.content }}</div>
                                        <div class="attachment-area" v-if="parseFiles(msg.fileUrl).length > 0">
                                            <div v-for="(file, fIdx) in parseFiles(msg.fileUrl)" :key="fIdx"
                                                class="chat-file-item">
                                                <el-icon>
                                                    <Link />
                                                </el-icon>
                                                <a :href="file.url" target="_blank">{{ file.name }}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <el-empty v-else description="暂无回复记录" :image-size="60"></el-empty>
                        </div>

                        <div class="reply-section">
                            <div class="upload-preview" v-if="replyForm.fileUrl.length > 0">
                                <div v-for="(file, idx) in replyForm.fileUrl" :key="idx" class="preview-item">
                                    <el-icon class="file-icon">
                                        <Paperclip />
                                    </el-icon>
                                    <span class="name" :title="file.name">{{ file.name }}</span>
                                    <el-icon class="delete" @click="removeFile(idx)">
                                        <Close />
                                    </el-icon>
                                </div>
                            </div>

                            <div class="reply-toolbar">
                                <el-upload :auto-upload="true" :http-request="handleUpload" :show-file-list="false"
                                    class="upload-inline" multiple>
                                    <el-button link type="primary" :icon="Paperclip">上传附件</el-button>
                                </el-upload>
                            </div>

                            <div class="input-area">
                                <el-input v-model="replyForm.content" type="textarea" :rows="3" placeholder="请输入回复内容..."
                                    resize="none" />
                                <div class="action-btn">
                                    <el-button type="primary" @click="submitReply" :loading="submitting">回复</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="bottom-btns">
                <el-button type="primary" plain @click="handleOpenAssign">指派</el-button>
                <el-button type="warning" plain @click="handleFollowUp">催单</el-button>
                <el-button type="danger" plain @click="handleCloseOrder">关闭</el-button>
                <el-button type="success" plain @click="handleOpenRate" :disabled="detailData.score">评分</el-button>
            </div>
        </div>

        <el-dialog title="指派工单" align-center v-model="assignDialogVisible" width="500px" append-to-body
            @close="resetAssignForm">
            <el-form :model="assignForm" ref="assignFormRef" :rules="assignRules" label-width="80px">
                <el-form-item label="公司" prop="orgId">
                    <el-cascader ref="cascaderRef" v-model="assignForm.orgId" :options="companyOptions"
                        :props="parentProps" clearable @change="handleCascaderChange" placeholder="请选择公司"
                        style="width: 100%" />
                </el-form-item>
                <el-form-item label="部门" prop="departmentId">
                    <el-select v-model="assignForm.departmentId" placeholder="请选择部门" style="width: 100%"
                        @change="handleDepartmentChange">
                        <el-option v-for="item in departmentOptions" :key="item.id" :label="item.nameCn"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理人" prop="employeeId">
                    <el-select v-model="assignForm.employeeId" placeholder="请选择处理人" style="width: 100%" filterable>
                        <el-option v-for="item in employeeOptions" :key="item.id"
                            :label="`${item.userCode}(${item.name})`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="assignForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="assignDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAssign" :loading="actionLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="工单评价" align-center v-model="rateDialogVisible" width="500px" append-to-body
            @close="resetRateForm">
            <el-form :model="rateForm" ref="rateFormRef" :rules="rateRules" label-width="100px">
                <el-form-item label="评分" prop="score">
                    <el-rate v-model="rateForm.score" />
                </el-form-item>
                <el-form-item label="是否解决" prop="isSolved">
                    <el-radio-group v-model="rateForm.isSolved">
                        <el-radio :label="true" :value="true">是</el-radio>
                        <el-radio :label="false" :value="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="反馈信息">
                    <el-input v-model="rateForm.feedback" type="textarea" :rows="3" placeholder="请输入反馈信息" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="rateDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitRate" :loading="actionLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="工单详情">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
import { Document, Paperclip, Close, Link } from '@element-plus/icons-vue';
import { uploadApi } from '@/api/baseApi/index.js';
import { smartAlert, } from '@/utils/genericMethods.js';

// 引入接口
import {
    getFullByIdApi,
    addWorkOrderDetailApi,
    assignWorkApi,
    followUpWorkApi,
    closeWorkOrderApi,
    evaluationWorkApi
} from '@/api/vasApi/wo.js';

import {
    getOrgListCompanyApi,
    getOrgListDepartmentApi,
    getOrgEmployeeListApi
} from '@/api/baseApi/org.js';

const route = useRoute();
const chatScrollRef = ref(null);
const submitting = ref(false);
const actionLoading = ref(false);

const props = defineProps({
    id: { type: String, required: true }
})

// 工单完整数据
const detailData = reactive({
    id: '',
    workOrderNo: '',
    statusName: '',
    statusId: 0,
    title: '',
    content: '',
    fileUrl: '', 
    workOrderUserList: [],
    workOrderDetailList: [],
});

// 回复表单
const replyForm = reactive({
    content: '',
    fileUrl: [] 
});

// --- 指派相关变量 ---
const assignDialogVisible = ref(false);
const assignFormRef = ref(null);
const cascaderRef = ref(null);
const companyOptions = ref([]);
const departmentOptions = ref([]);
const employeeOptions = ref([]);
const assignForm = reactive({
    orgId: [],
    departmentId: '',
    employeeId: '',
    remark: ''
});
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
const assignRules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
    employeeId: [{ required: true, message: '请选择处理人', trigger: 'change' }],
};

// --- 评分相关变量 ---
const rateDialogVisible = ref(false);
const rateFormRef = ref(null);
const rateForm = reactive({
    score: 0,
    isSolved: true,
    feedback: ''
});
const rateRules = {
    score: [{ required: true, message: '请评分', trigger: 'change' }],
    isSolved: [{ required: true, message: '请选择是否解决', trigger: 'change' }],
    feedback: [{ required: true, message: '请输入反馈信息', trigger: 'blur' }]
};

// 获取数据
const getDetail = async () => {
    const id = props.id || route.query.id;
    if (!id) return;

    const loading = ElLoading.service({ target: '.viewArea', text: 'loading...' });
    try {
        const res = await getFullByIdApi({ id });
        if (res.success && res.data) {
            Object.assign(detailData, res.data);
            // 滚动到底部
            nextTick(() => {
                scrollToBottom();
            });
        } else {
            ElMessage.error(res.msg || '获取数据失败');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('网络异常');
    } finally {
        loading.close();
    }
};

// 初始化公司数据
const initCompanyData = async () => {
    try {
        const companyRes = await getOrgListCompanyApi();
        const convertToTree = (items) => {
            return items.map(item => ({
                value: item.id,
                label: item.nameCn,
                children: item.children ? convertToTree(item.children) : []
            }));
        };
        companyOptions.value = convertToTree(companyRes.data || []);
    } catch (e) {
        console.error(e);
    }
}

// 解析文件 JSON 字符串
const parseFiles = (jsonStr) => {
    if (!jsonStr) return [];
    try {
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

// 上传附件逻辑
const handleUpload = async (params) => {
    const file = params.file;
    try {
        const isDuplicate = replyForm.fileUrl.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已存在`);
            return;
        }
        const res = await uploadApi(file, { path: 'temp' });
        if (res?.success) {
            replyForm.fileUrl.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage.success(`文件 ${file.name} 上传成功`);
        } else {
            ElMessage.error(res.msg || `文件 ${file.name} 上传失败`);
        }
    } catch (err) {
        ElMessage.error('上传异常');
    }
};

const removeFile = (idx) => {
    replyForm.fileUrl.splice(idx, 1);
};

// 提交回复
const submitReply = async () => {
    if (!replyForm.content.trim() && replyForm.fileUrl.length === 0) {
        ElMessage.warning('请输入内容或上传附件');
        return;
    }

    submitting.value = true;
    try {
        const payload = {
            workOrderId: detailData.id,
            content: replyForm.content,
            fileUrl: replyForm.fileUrl.length > 0 ? JSON.stringify(replyForm.fileUrl) : ''
        };

        const res = await addWorkOrderDetailApi(payload);
        if (res.success) {
            ElMessage.success('回复成功');
            replyForm.content = '';
            replyForm.fileUrl = [];
            await getDetail();
        } else {
            ElMessage.error(res.msg || '回复失败');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('提交异常');
    } finally {
        submitting.value = false;
    }
};

// --- 指派逻辑 ---
const handleOpenAssign = () => {
    assignDialogVisible.value = true;
    // 如果公司数据还没加载，尝试加载
    if (companyOptions.value.length === 0) {
        initCompanyData();
    }
};

const handleCascaderChange = async (e) => {
    if (cascaderRef.value) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    assignForm.departmentId = ''; // 清空部门
    assignForm.employeeId = ''; // 清空人员
    departmentOptions.value = [];
    employeeOptions.value = [];

    if (e && e.length > 0) {
        const orgId = e[e.length - 1];
        const res = await getOrgListDepartmentApi({ parentId: orgId });
        departmentOptions.value = res.data || [];
    }
};

const handleDepartmentChange = async (deptId) => {
    assignForm.employeeId = ''; // 清空人员
    employeeOptions.value = [];
    if (deptId) {
        const orgId = assignForm.orgId[assignForm.orgId.length - 1];
        const res = await getOrgEmployeeListApi({ orgId: orgId, departmentId: deptId });
        employeeOptions.value = res.data.rows || [];
    }
};

const resetAssignForm = () => {
    if (assignFormRef.value) assignFormRef.value.resetFields();
    assignForm.orgId = [];
    departmentOptions.value = [];
    employeeOptions.value = [];
};

const submitAssign = async () => {
    if (!assignFormRef.value) return;
    await assignFormRef.value.validate(async (valid) => {
        if (valid) {
            actionLoading.value = true;
            try {
                const res = await assignWorkApi({
                    workOrderId: detailData.id,
                    employeeId: assignForm.employeeId,
                    remark: assignForm.remark
                });
                smartAlert(res.msg, res.success, 1000);
                if (res.success) {
                    assignDialogVisible.value = false;
                    getDetail(); // 刷新
                }
            } catch (e) {
                console.error(e);
            } finally {
                actionLoading.value = false;
            }
        }
    });
};

// --- 催单逻辑 ---
const handleFollowUp = () => {
    ElMessageBox.prompt('请输入催单备注', '催单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '备注信息'
    }).then(async ({ value }) => {
        actionLoading.value = true;
        console.log(value)
        try {
            const res = await followUpWorkApi(value, { id: detailData.id });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                getDetail();
            }
        } catch (e) {
            console.error(e);
        } finally {
            actionLoading.value = false;
        }
    }).catch(() => { });
};

// --- 关闭逻辑 ---
const handleCloseOrder = () => {
    ElMessageBox.confirm(
        '确定要关闭该工单吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        actionLoading.value = true;
        try {
            const res = await closeWorkOrderApi({ id: detailData.id });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                getDetail();
            }
        } finally {
            actionLoading.value = false;
        }
    }).catch(() => { });
};

// --- 评分逻辑 ---
const handleOpenRate = () => {
    rateDialogVisible.value = true;
};

const resetRateForm = () => {
    if (rateFormRef.value) rateFormRef.value.resetFields();
    rateForm.score = 0;
    rateForm.isSolved = true;
    rateForm.feedback = '';
};

const submitRate = async () => {
    if (!rateFormRef.value) return;
    await rateFormRef.value.validate(async (valid) => {
        if (valid) {
            actionLoading.value = true;
            try {
                const res = await evaluationWorkApi({
                    workOrderId: detailData.id,
                    score: rateForm.score,
                    isSolved: rateForm.isSolved,
                    feedback: rateForm.feedback
                });
                smartAlert(res.msg, res.success, 1000);
                if (res.success) {
                    rateDialogVisible.value = false;
                    getDetail();
                }
            } catch (e) {
                console.error(e);
            } finally {
                actionLoading.value = false;
            }
        }
    });
};


// 滚动聊天框到底部
const scrollToBottom = () => {
    if (chatScrollRef.value) {
        chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight;
    }
};


// 辅助：状态颜色
const getStatusType = (statusId) => {
    if (statusId === 10) return 'primary';
    if (statusId === 20) return 'success';
    return 'danger';
};

onMounted(() => {
    getDetail();
    initCompanyData(); // 预加载公司数据
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';


.main-layout {
    flex: 1; // 占据剩余空间
    overflow: hidden; // 防止溢出
    margin-bottom: 10px;
}

.left-panel {
    height: 100%;
    display: flex;
    flex-direction: column;

    .info-card {
        flex-shrink: 0;
    }

    .timeline-card {
        flex-grow: 1;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        :deep(.el-card__body) {
            flex: 1;
            overflow: hidden;
            padding-right: 0;
        }
    }
}

.right-panel {
    height: 100%;

    .right-panel-container {
        height: 100%;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #e4e7ed;
        display: flex;
        flex-direction: column;
    }
}

// 右侧上部：详情
.detail-section {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    background: #fafafa;

    .detail-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        .detail-title {
            margin: 0;
            font-size: 18px;
            color: #303133;
            font-weight: 600;
        }
    }

    .detail-content {
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
        margin-bottom: 10px;
    }

    .detail-files {
        display: flex;
        align-items: flex-start;
        font-size: 13px;
        margin-top: 10px;

        .file-label {
            color: #909399;
            margin-right: 8px;
            white-space: nowrap;
            padding-top: 4px;
        }

        .file-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            width: 100%;
            max-height: 68px;
            overflow-y: auto;
            align-content: flex-start;

            .file-item {
                display: flex;
                align-items: center;
                gap: 4px;
                background: #fff;
                padding: 2px 8px;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                height: 26px;
                box-sizing: border-box;

                a {
                    color: #409EFF;
                    text-decoration: none;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}

// 右侧中部：聊天记录
.chat-section {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;

    .chat-message {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;

        .message-header {
            margin-bottom: 6px;
            font-size: 12px;
            color: #909399;

            .user-name {
                font-weight: bold;
                color: #303133;
                margin-right: 10px;
            }
        }

        .message-body {
            background: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e4e7ed;
            max-width: 85%;
            align-self: flex-start;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

            .text-content {
                white-space: pre-wrap;
                word-break: break-all;
                line-height: 1.5;
                font-size: 14px;
                color: #303133;
            }

            .attachment-area {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #ebeef5;
                display: flex;
                flex-direction: column;
                gap: 5px;

                .chat-file-item {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    gap: 5px;

                    a {
                        color: #409EFF;
                        text-decoration: none;
                    }
                }
            }
        }
    }
}

// 右侧底部：回复区
.reply-section {
    padding: 15px 20px;
    background: #fff;

    .upload-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
        max-height: 100px;
        overflow-y: auto;

        .preview-item {
            display: flex;
            align-items: center;
            background: #f0f9eb;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #67c23a;
            gap: 5px;
            border: 1px solid #e1f3d8;
            max-width: 220px;

            .file-icon {
                flex-shrink: 0;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .delete {
                cursor: pointer;
                color: #f56c6c;
                flex-shrink: 0;

                &:hover {
                    font-weight: bold;
                }
            }
        }
    }

    .reply-toolbar {
        margin-bottom: 8px;
    }

    .input-area {
        display: flex;
        gap: 10px;
        align-items: flex-end;

        .el-input {
            flex: 1;
        }
    }
}

// 底部按钮栏样式
.bottom-btns {
    flex-shrink: 0;
    padding: 10px 20px;
    background: #fff;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: center;
    gap: 15px;
    z-index: 10;
}


// 通用样式
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 18px;
}

.info-list {
    .info-item {
        display: flex;
        margin-bottom: 12px;
        font-size: 13px;

        .label {
            color: #909399;
            width: 70px;
            flex-shrink: 0;
            text-align: right;
        }

        .value {
            color: #303133;
            word-break: break-all;
        }

        .copy-text {
            color: #409EFF;
        }
    }
}

.timeline-content {
    .name {
        font-size: 13px;
        font-weight: 500;
    }

    .remark {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
    }
}

.mb-10 {
    margin-bottom: 10px;
}

:deep(.el-timeline) {
    padding-left: 5px;
}

/* 清楚悬浮黑框 (如果有el-cascader问题) */
:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>