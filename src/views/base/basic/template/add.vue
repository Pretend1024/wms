<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('atypeId')" prop="atypeId">
                    <el-select v-model="formData.atypeId" :placeholder="getPlaceholder('atypeId')" @change="getBType">
                        <el-option v-for="item in templateATypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('btypeId')" prop="btypeId">
                    <el-select v-model="formData.btypeId" :placeholder="getPlaceholder('btypeId')" filterable
                        popper-class="multi-column-select">
                        <el-option v-for="item in templateBTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('fileUrl')" prop="fileUrl">
                    <el-input v-model="formData.fileUrl" :placeholder="getPlaceholder('fileUrl')">
                        <template #append>
                            <el-upload v-model:file-list="fileList" :auto-upload="true" :http-request="handleUpload"
                                :before-upload="beforeUpload" :on-remove="handleRemove" :limit="1"
                                :show-file-list="false">
                                <el-button :icon="UploadFilled" />
                            </el-upload>
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')">
                    <el-input v-model="formData.sortNo" :placeholder="getPlaceholder('sortNo')" @input="handleInput" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type='textarea' v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import { smartAlert } from '@/utils/genericMethods.js'
import { getBasicTemplateBTypeEnumApi } from '@/api/baseApi/basic.js'
import { uploadApi } from '@/api/baseApi/index.js'

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    templateATypeOptions: {
        type: Array,
        required: true
    },
    statusOptions: {
        type: Array,
        required: true
    },
});

const formRef = ref(null);

const rules = {
    atypeId: [
        { required: true, message: '请选择模板类型', trigger: 'change' }
    ],
    btypeId: [
        { required: true, message: '请输入数据类型', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入模板名称', trigger: 'change' },
        { pattern: /\S/, message: '模板名称不能为空格', trigger: 'change' }
    ],
    fileUrl: [
        { required: true, message: '请上传模板文件', trigger: 'change' }
    ]
};
const handleInput = (val) => {
    val = val.replace(/[^\d]/g, '');
    props.formData.sortNo = val;
}

// -----------------------------------------------------文件上传
const fileList = ref([]);
// 文件上传前校验
const beforeUpload = (file) => {
    // 不支持可执行文件
    if (file.type === 'application/x-msdownload') {
        smartAlert('不支持可执行文件', false)
        return false;
    }
    return true;
};

// 自定义上传处理
const handleUpload = async (options) => {
    try {
        const res = await uploadApi(options.file, { path: 'temp' });
        props.formData.fileUrl = res.data;
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        smartAlert('上传失败，请检查网络', false, 1000)
        console.log('上传失败，请重试', error);
    } finally {
        fileList.value = [];
    }
};

// 筛选数据类型
const templateBTypeOptions = ref([]);
// 获取数据类型
const getBType = async (e) => {
    props.formData.btypeId = ''; // 清空数据类型
    const res = await getBasicTemplateBTypeEnumApi({ atypeId: e })
    templateBTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
}

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>

<style scoped>
:deep(.el-cascader) {
    width: 100%;
}

:deep(.el-input) {
    width: 100%;
}
</style>