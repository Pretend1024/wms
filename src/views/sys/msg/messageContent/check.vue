<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('title')" prop="title">
                    <el-input v-model="formData.title" disabled :placeholder="getPlaceholder('title')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" disabled :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('notifyWayId')" prop="notifyWayId">
                    <el-select v-model="formData.notifyWayId" disabled :placeholder="getPlaceholder('notifyWayId')">
                        <el-option v-for="(item, index) in notifyWayOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('content')" prop="content">
                    <div class="htmlContent" v-html="formData.content"></div>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.link">
                <el-form-item :label="getLabel('link')">
                    <a :href="toDownloadTempPath(formData.link)" target="_blank" class="ellipsis-link">
                        {{ formData.link }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.fileUrl">
                <el-form-item :label="getLabel('fileUrl')">
                    <a :href="toDownloadTempPath(formData.fileUrl)" target="_blank" class="ellipsis-link">
                        {{ formData.fileUrl }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('notifyScopeId')" prop="notifyScopeId">
                    <el-select v-model="formData.notifyScopeId" disabled :placeholder="getPlaceholder('notifyScopeId')">
                        <el-option v-for="(item, index) in notifyScopeOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.notifyScopeId == 20">
                <el-form-item :label="getLabel('notifyUser')">
                    <el-input v-model="formData.notifyUser" disabled :placeholder="getPlaceholder('notifyUser')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('totalQty')">
                    <el-input v-model="formData.totalQty" disabled :placeholder="getPlaceholder('totalQty')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('readedQty')">
                    <el-input v-model="formData.readedQty" disabled :placeholder="getPlaceholder('readedQty')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('deletedQty')">
                    <el-input v-model="formData.deletedQty" disabled :placeholder="getPlaceholder('deletedQty')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { toDownloadTempPath } from '@/utils/downLoad.js'
import { getMessageContentNotifyWayEnumApi } from '@/api/sysApi/user.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    typeOptions: {
        type: Array,
        required: true
    },
    notifyScopeOptions: {
        type: Array,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' }
    ],
    notifyScopeId: [
        { required: true, message: '请输选择通知范围', trigger: 'change' }
    ],
    typeId: [
        { required: true, message: '请输选择消息类型', trigger: 'change' }
    ],
};
// 提醒方式
const notifyWayOptions = ref([])
onMounted(async () => {
    // 获取提醒方式
    const res = await getMessageContentNotifyWayEnumApi()
    notifyWayOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
})
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>

<style scoped>
.ellipsis-link {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}

.htmlContent {
    height: 350px;
    background-color: #f5f7fa;
    width: 100%;
    border: 1px solid #e4e7ed;
    border-radius: 3px;
    overflow-y: auto;
    padding: 5px;
}
</style>