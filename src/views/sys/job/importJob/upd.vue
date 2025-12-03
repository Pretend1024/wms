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
                    <el-input v-model="formData.importParam" disabled type="textarea" />
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
                    <el-input v-model="formData.localFileUrl" disabled type="textarea" />
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
</template>

<script setup>
import { toDownloadTempPath } from '@/utils/downLoad.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});
</script>