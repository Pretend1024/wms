<template>
    <el-dialog :title="$t('outstock_trace_outTrack_list.addTitle')" v-model="dialogVisible" width="600px" align-center
        destroy-on-close @open="handleDialogOpen" @close="handleDialogClose">
        <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" class="trajectory-form">
            <!-- 轨迹时间 -->
            <el-form-item :label="getLabel('traceTime')" prop="traceTime">
                <el-date-picker v-model="formData.traceTime" type="datetime" :placeholder="getPlaceholder('traceTime')"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>

            <!-- 轨迹地点 -->
            <el-form-item :label="getLabel('traceLocation')" prop="traceLocation">
                <el-input v-model="formData.traceLocation" :placeholder="getPlaceholder('traceLocation')"
                    maxlength="100" />
            </el-form-item>

            <!-- 轨迹详情 -->
            <el-form-item :label="getLabel('traceEvent')" prop="traceEvent">
                <el-input v-model="formData.traceEvent" :placeholder="getPlaceholder('traceEvent')" type="textarea"
                    :rows="3" maxlength="500" />
            </el-form-item>

            <!-- 备注 -->
            <el-form-item :label="getLabel('remark')" prop="remark">
                <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea" :rows="2"
                    maxlength="200" />
            </el-form-item>

            <!-- 附件上传 -->
            <el-form-item :label="getLabel('fileJson')" prop="fileJson">
                <el-input v-model="fileJsonDisplay" :placeholder="getPlaceholder('fileJson')">
                    <template #append>
                        <el-upload :auto-upload="true" :http-request="(options) => handleFileUpload(options)"
                            :before-upload="beforeFileUpload" :show-file-list="false" multiple>
                            <el-button icon="Upload" type="primary" size="small">{{ getButtonText('upload')
                            }}</el-button>
                        </el-upload>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>

        <!-- 弹窗底部按钮 -->
        <template #footer>
            <el-button @click="emit('cancel')">{{ getButtonText('cancel') }}</el-button>
            <el-button type="primary" @click="handleSubmit">{{ getButtonText('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, computed } from 'vue';
import { uploadApi } from '@/api/baseApi/index.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'


// 定义Emits - 向外部传递事件
const emit = defineEmits([
    'close',    // 弹窗关闭事件（仅关闭时触发）
    'submit',   // 提交事件（校验通过后返回数据）
    'cancel'    // 取消事件（点击取消按钮触发）
]);

// 弹窗显示状态（内部控制）
const dialogVisible = ref(false);

// 表单核心数据（fileJson改为数组存储文件详情）
const formRef = ref(null); // 表单引用
const formData = ref({
    traceTime: '',
    traceLocation: '',
    traceEvent: '',
    remark: '',
    fileJson: [] // 存储格式：[{url: string, name: string, fileType: string}]
});
const formLoading = ref(false); // 表单提交加载状态

// 附件显示用（只读，展示已上传文件名）
const fileJsonDisplay = computed(() => {
    return formData.value.fileJson.map(file => file.url).join('、') || '';
});

// 表单校验规则（移除fileJson校验，改为非必填）
const formRules = ref({
    traceTime: [
        { required: true, message: '请选择轨迹时间', trigger: 'change' }
    ],
    traceLocation: [
        { required: true, message: '请输入轨迹地点', trigger: 'blur' },
    ],
    traceEvent: [
        { required: true, message: '请输入轨迹详情', trigger: 'blur' },
    ]
});

/**
 * 弹窗打开时初始化
 */
const handleDialogOpen = () => {
    nextTick(() => {
        // 重置表单（清空数据和校验状态）
        resetForm();
    });
};

/**
 * 弹窗关闭时触发外部事件
 */
const handleDialogClose = () => {
    emit('close');
};

/**
 * 附件上传前校验（仅允许文件上传，不限制类型和大小，可自行扩展）
 */
const beforeFileUpload = (file) => {
    return true;
};

/**
 * 附件上传处理（存储完整文件信息：URL、文件名、文件类型）
 */
const handleFileUpload = async (options) => {
    const file = options.file;
    if (!file) return;

    // 显示上传加载状态
    const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
    });

    try {
        // 调用上传接口
        const res = await uploadApi(file, { path: 'temp' });

        if (res.success && res.data) {
            // 解析文件类型（取文件名后缀，无后缀则为空）
            const fileName = file.name;
            const fileType = fileName.split('.').pop() || '';

            // 存储文件完整信息到数组
            formData.value.fileJson.push({
                url: res.data,       // 文件上传后的URL
                name: fileName,      // 原始文件名（如syk.jpg）
                fileType: fileType.toLowerCase() // 文件类型（小写，如jpg）
            });
            smartAlert('文件上传成功', true, 1000)
        } else {
            smartAlert(`文件上传失败：${res.message || '未知错误'}`, false)
        }
    } catch (error) {
        smartAlert(`文件上传失败：${error.message || '未知错误'}`, false)
    } finally {
        // 关闭加载状态
        loading.close();
    }
};

/**
 * 表单提交处理（仅校验+返回数据，不关闭弹窗）
 */
const handleSubmit = async () => {
    try {
        // 1. 表单校验
        await formRef.value.validate();

        // 2. 处理fileJson为JSON格式字符串（按要求格式）
        const submitData = {
            ...JSON.parse(JSON.stringify(formData.value)),
            // 转换为JSON字符串：[{url: xx, name: xx, fileType: xx}]
            fileJson: JSON.stringify(formData.value.fileJson)
        };

        // 3. 触发submit事件，将处理后的数据返回给外部
        emit('submit', submitData);

    } catch (error) {
        // 表单校验失败
        if (error instanceof Error) {
            console.error('表单校验错误:', error.message);
        } else {
            console.error('表单校验错误:', error);
        }
    }
};

/**
 * 关闭弹窗（暴露给外部，需手动调用）
 */
const closeDialog = () => {
    dialogVisible.value = false;
};

/**
 * 重置表单（清空数据和校验状态）
 */
const resetForm = () => {
    // 清空表单数据（fileJson重置为空数组）
    formData.value = {
        traceTime: '',
        traceLocation: '',
        traceEvent: '',
        remark: '',
        fileJson: []
    };
    // 清空校验状态
    if (formRef.value) {
        formRef.value.clearValidate();
    }
};

/**
 * 暴露给外部的核心方法
 */
defineExpose({
    // 1. 打开弹窗（外部唯一控制弹窗显示的方法）
    openDialog: () => {
        dialogVisible.value = true;
    },
    // 2. 获取内部表单数据（fileJson已转为JSON字符串）
    getFormData: () => {
        const data = JSON.parse(JSON.stringify(formData.value));
        data.fileJson = JSON.stringify(data.fileJson);
        return data;
    },
    // 3. 手动关闭弹窗（外部处理完逻辑后调用）
    closeDialog: closeDialog,
    // 4. 重置表单（外部如需手动清空）
    resetForm: resetForm,
    // 5. 手动触发提交校验（可选，如需外部代码触发提交）
    triggerSubmit: handleSubmit
});
</script>

<style scoped>
.trajectory-form {
    padding: 10px 0;
}

/* 附件列表样式 */
.file-list {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

/* 适配弹窗样式 */
:deep(.el-dialog__body) {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
}

:deep(.el-form-item) {
    margin-bottom: 16px;
}

:deep(.el-upload) {
    margin-left: 8px;
}

/* 日期选择器宽度适配 */
:deep(.el-date-editor) {
    width: 100% !important;
}

/* 标签样式优化 */
:deep(.el-tag) {
    cursor: pointer;
}
</style>