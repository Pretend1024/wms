<template>
    <el-dialog v-model="visible"
        :title="isDetail ? $t(`sys_setting_sysApp_list.infoTitle`) : $t(`sys_setting_sysApp_list.updTitle`)"
        width="550px" destroy-on-close>
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px" style="padding-right: 20px;">
            <el-form-item :label="getLabel('typeId')" prop="typeId">
                <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" style="width: 100%"
                    disabled>
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="getLabel('versionNo')" prop="versionNo">
                <el-input v-model.trim="formData.versionNo" :placeholder="getPlaceholder('versionNo')" disabled />
            </el-form-item>
            <el-form-item :label="getLabel('fileUrl')" prop="fileUrl">
                <el-input v-model.trim="formData.fileUrl" :placeholder="getPlaceholder('fileUrl')" disabled>
                    <template #append v-if="formData.fileUrl">
                        <el-button :icon="Download" @click="handleDownload(formData.fileUrl)" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item :label="getLabel('publishPage')" prop="publishPage">
                <el-input v-model.trim="formData.publishPage" :placeholder="getPlaceholder('publishPage')" disabled>
                    <template #append v-if="formData.publishPage">
                        <el-button :icon="Download" @click="handleDownload(formData.publishPage)" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item :label="getLabel('remark')" prop="remark">
                <el-input v-model="formData.remark" type="textarea" rows="2" :placeholder="getPlaceholder('remark')"
                    :disabled="isDetail" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">{{ isDetail ? '关闭' : getButtonText('cancel') }}</el-button>
            <el-button v-if="!isDetail" type="primary" :loading="loading" @click="handleConfirm">
                {{ getButtonText('confirm') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { updSysAppByIdApi } from '@/api/sysApi/setting.js';
import { getButtonText } from '@/utils/i18n/i18nLabels';
import { smartAlert } from '@/utils/genericMethods.js';

const props = defineProps({
    typeOptions: Array
});
const emit = defineEmits(['confirm']);

const visible = ref(false);
const loading = ref(false);
const isDetail = ref(false);
const formRef = ref(null);

const formData = reactive({
    id: '',
    typeId: '',
    versionNo: '',
    fileUrl: '',
    publishPage: '',
    remark: ''
});

const rules = {
    typeId: [{ required: true, message: '请选择APP类型', trigger: 'change' }],
    versionNo: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
    fileUrl: [{ required: true, message: '请输入下载地址', trigger: 'blur' }]
};

const open = (row, detailMode = false) => {
    isDetail.value = detailMode;
    Object.assign(formData, JSON.parse(JSON.stringify(row)));
    visible.value = true;
};

const handleConfirm = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const res = await updSysAppByIdApi(formData);
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
const handleDownload = (url) => {
    if (!url) {
        ElMessage.warning('地址为空');
        return;
    }
    window.open(url, '_blank');
};

defineExpose({ open });
</script>