<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('jobNo')">
                    <el-input v-model="formData.jobNo" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('templateName')">
                    <el-input v-model="formData.templateName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeName')">
                    <el-input v-model="formData.typeName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('statusName')">
                    <el-input v-model="formData.statusName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('importParam')">
                    <el-input v-model="formData.importParam" disabled type="textarea" :rows="1" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('importTotal')">
                    <el-input v-model="formData.importTotal" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('customerName')">
                    <el-input v-model="formData.customerName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('fileSize')">
                    <el-input v-model="formData.fileSize" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('handlerWayName')">
                    <el-input v-model="formData.handlerWayName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('fileUrl')">
                    <a :href="toDownloadTempPath(formData.fileUrl)" target="_blank">{{ formData.fileUrl }}</a>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('returnMessage')">
                    <el-input v-model="formData.returnMessage" disabled type="textarea" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('returnData')">
                    <div style="display: flex; width: 100%; align-items: flex-start; gap: 10px;">
                        <el-input v-model="formData.returnData" disabled>
                            <template #append v-if="formData.returnData">
                                <el-button type="primary" @click="handleViewJson">
                                    {{ getButtonText('format') }}
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('feedbackMsg')">
                    <el-input v-model="formData.feedbackMsg" disabled type="textarea" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('feedbackTime')">
                    <el-input v-model="formData.feedbackTime" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('async')">
                    <el-select v-model="formData.async" disabled>
                        <el-option :label="$t('yes')" :value="true" />
                        <el-option :label="$t('no')" :value="false" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('localFileUrl')">
                    <el-input v-model="formData.localFileUrl" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('startTime')">
                    <el-input v-model="formData.startTime" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('endTime')">
                    <el-input v-model="formData.endTime" disabled />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-dialog v-model="jsonDialogVisible" :title="$t('sys_job_importJob_list.resultTitle')" width="60%" align-center
        append-to-body>
        <div class="json-viewer">
            <pre>{{ formattedJson }}</pre>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="jsonDialogVisible = false">{{ getButtonText('close') }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { toDownloadTempPath } from '@/utils/downLoad.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

// 解析 JSON 数据并格式化显示
const jsonDialogVisible = ref(false)
const formattedJson = ref('')

const handleViewJson = () => {
    const rawData = props.formData.returnData
    if (!rawData) return

    try {
        // 尝试解析 JSON
        const jsonObj = JSON.parse(rawData)
        // 重新转换为字符串，使用 2 个空格缩进实现格式化
        formattedJson.value = JSON.stringify(jsonObj, null, 2)
        jsonDialogVisible.value = true
    } catch (error) {
        console.error('JSON解析失败', error)
        // 如果解析失败（可能不是JSON字符串），则直接显示原始内容
        formattedJson.value = rawData
        smartAlert('数据不是有效的JSON格式，已按原样显示', false)
        jsonDialogVisible.value = true
    }
}
</script>

<style scoped>
/* JSON 查看器样式 */
.json-viewer {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    max-height: 500px;
    overflow: auto;
}

.json-viewer pre {
    margin: 0;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    /* 允许换行 */
    word-wrap: break-word;
    /* 允许长单词换行 */
    color: #333;
}
</style>