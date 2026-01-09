<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('orgId')" prop="orgName">
                    <el-input v-model="formData.orgName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" disabled popper-class="multi-column-select"
                        :placeholder="getPlaceholder('customerCode')">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('currency')" prop="currency">
                    <el-select v-model="formData.currency" disabled :placeholder="getPlaceholder('currency')">
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('billNo')" prop="billNo">
                    <el-input v-model="formData.billNo" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('totalFeeAmount')">
                    <el-input v-model="formData.totalFeeAmount" disabled />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('writtenOffAmount')">
                    <el-input v-model="formData.writtenOffAmount" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('unwrittenOffAmount')">
                    <el-input v-model="formData.unwrittenOffAmount" disabled />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('writeOffCompleteTime')">
                    <el-input v-model="formData.writeOffCompleteTime" disabled />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item :label="getLabel('billStartDate')" prop="billStartDate">
                    <el-date-picker v-model="formData.billStartDate" type="date"
                        :placeholder="getPlaceholder('billStartDate')" value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('billEndDate')" prop="billEndDate">
                    <el-date-picker v-model="formData.billEndDate" type="date"
                        :placeholder="getPlaceholder('billEndDate')" value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')" prop="remark">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea"
                        :rows="2" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('attachment')" prop="attachment">
                    <div class="attachment-container">
                        <div class="attachment-list" v-if="fileList.length > 0">
                            <div v-for="(file, index) in fileList" :key="index" class="attachment-item">
                                <a :href="file.url" target="_blank" class="file-link" :title="file.name">
                                    {{ file.name }}
                                </a>
                                <el-icon class="delete-icon" @click="handleRemoveFile(index)">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <el-upload :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload"
                            multiple :show-file-list="false" class="upload-btn-wrap">
                            <el-button type="primary" size="small">
                                {{ fileList.length > 0 ? '+ 继续上传' : '上传附件' }}
                            </el-button>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { uploadApi } from '@/api/baseApi/index.js';
import { smartAlert } from '@/utils/genericMethods.js';
import { ElMessage } from 'element-plus';

const props = defineProps({
    initData: { type: Object, default: () => ({}) },
    customerOptions: { type: Array, default: () => [] },
    nationOptions: { type: Array, default: () => [] }
});

const formData = ref({});
const fileList = ref([]);
const formRef = ref(null);


const beforeUpload = () => true;

const handleUpload = async (params) => {
    const file = params.file;
    try {
        const isDuplicate = fileList.value.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传`);
            return;
        }
        const res = await uploadApi(file, { path: 'temp' });
        if (res.success && res.data) {
            fileList.value.push({ name: file.name, url: res.data, size: file.size });
            ElMessage.success('上传成功');
        } else {
            smartAlert(res.msg || '上传失败', false);
        }
    } catch (error) {
        smartAlert('上传异常', false);
    }
};

const handleRemoveFile = (index) => {
    fileList.value.splice(index, 1);
};

onMounted(() => {
    openMainLoading()
    if (props.initData) {
        formData.value = { ...props.initData };
        try {
            if (props.initData.attachment) {
                fileList.value = JSON.parse(props.initData.attachment);
            }
        } catch (e) {
            fileList.value = [];
        }
    }
    closeMainLoading()
});

defineExpose({
    validate: async () => await formRef.value.validate(),
    resetFields: () => {
        formRef.value.resetFields();
        fileList.value = [];
    },
    getFormData: () => {
        return {
            ...formData.value,
            attachment: fileList.value.length > 0 ? JSON.stringify(fileList.value) : ''
        };
    }
});
</script>

<style scoped>
.attachment-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.attachment-list {
    display: flex;
    flex-direction: column;
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 5px;
    border: 1px solid #ebeef5;
    padding: 2px;
    border-radius: 4px;
}

.attachment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f7fa;
    padding: 2px 5px;
    margin-bottom: 2px;
    border-radius: 2px;
}

.delete-icon {
    cursor: pointer;
    color: #909399;
}

.delete-icon:hover {
    color: #F56C6C;
}

.file-link {
    color: #409EFF;
    text-decoration: none;
    margin-right: 10px;
}

:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea) {
    width: 100%;
}
</style>