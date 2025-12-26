<template>
    <el-dialog v-model="visible" :title="$t(`sys_setting_sysApp_list.addTitle`)" width="550px" destroy-on-close
        :close-on-click-modal="false">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px" style="padding-right: 20px;">
            <el-form-item :label="getLabel('typeId')" prop="typeId">
                <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" style="width: 100%">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="getLabel('versionNo')" prop="versionNo">
                <el-input v-model.trim="formData.versionNo" :placeholder="getPlaceholder('versionNo')" />
            </el-form-item>

            <el-form-item :label="getLabel('fileUrl')" prop="fileUrl">
                <el-input v-model.trim="formData.fileUrl" :placeholder="getPlaceholder('fileUrl')">
                    <template #append>
                        <el-upload :auto-upload="true" :http-request="handleFileUrlUpload" :show-file-list="false"
                            accept=".apk">
                            <el-button icon="Upload" />
                        </el-upload>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item :label="getLabel('publishPage')" prop="publishPage">
                <el-input v-model.trim="formData.publishPage" :placeholder="getPlaceholder('publishPage')">
                    <template #append>
                        <el-upload :auto-upload="true" :http-request="handlePublishPageUpload" :show-file-list="false"
                            accept=".pdf,.png,.jpg">
                            <el-button icon="Upload" />
                        </el-upload>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item :label="getLabel('remark')" prop="remark">
                <el-input v-model="formData.remark" type="textarea" rows="3" :placeholder="getPlaceholder('remark')" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">{{ getButtonText('cancel') }}</el-button>
            <el-button type="primary" :loading="loading" @click="handleConfirm">{{ getButtonText('confirm')
            }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { addSysAppApi } from '@/api/sysApi/setting.js';
import { uploadApi } from '@/api/baseApi/index.js'; // 引入上传接口
import { getButtonText, getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels';
import { smartAlert } from '@/utils/genericMethods.js';
import { Upload } from '@element-plus/icons-vue';

const props = defineProps({
    typeOptions: Array
});
const emit = defineEmits(['confirm']);

const visible = ref(false);
const loading = ref(false);
const formRef = ref(null);

const formData = reactive({
    typeId: '',
    versionNo: '',
    fileUrl: '',
    publishPage: '',
    remark: ''
});

const rules = {
    typeId: [{ required: true, message: '请选择APP类型', trigger: 'change' }],
    versionNo: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
    fileUrl: [{ required: true, message: '请输入或上传下载地址', trigger: 'blur' }]
};

// 安装包上传处理
const handleFileUrlUpload = async (options) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const loadingInstance = ElLoading.service({
        lock: true,
        text: 'loading...',
    });

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });
        if (res.success) {
            formData.fileUrl = res.data;
            ElMessage.success('安装包上传成功');
        } else {
            ElMessage.error(`上传失败：${res.msg || '服务器异常'}`);
        }
    } catch (error) {
        ElMessage.error(`上传出错：${error.msg || '网络异常'}`);
    } finally {
        loadingInstance.close();
    }
};

// 发布页上传处理
const handlePublishPageUpload = async (options) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const loadingInstance = ElLoading.service({
        lock: true,
        text: 'loading...',
    });

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });
        if (res.success) {
            formData.publishPage = res.data;
            ElMessage.success('发布页上传成功');
        } else {
            ElMessage.error(`上传失败：${res.msg || '服务器异常'}`);
        }
    } catch (error) {
        ElMessage.error(`上传出错：${error.msg || '网络异常'}`);
    } finally {
        loadingInstance.close();
    }
};

const open = () => {
    Object.assign(formData, { typeId: '', versionNo: '', fileUrl: '', publishPage: '', remark: '' });
    visible.value = true;
};

const handleConfirm = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const res = await addSysAppApi(formData);
                smartAlert(res.msg, res.success, 1000);
                if (res.success) {
                    visible.value = false;
                    emit('confirm');
                }
            } finally {
                loading.value = false;
            }
        }
    });
};

defineExpose({ open });
</script>

<style scoped>
:deep(.el-input-group__append) {
    padding: 0 15px;
    background-color: var(--el-fill-color-light);
}
</style>