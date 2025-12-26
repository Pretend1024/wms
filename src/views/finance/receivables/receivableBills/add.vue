<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="90px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司" prop="orgId">
                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                        :props="parentProps" placeholder="请选择公司" clearable style="width: 100%"
                        @change="handleCascaderChange" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="客户代码" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable placeholder="请选择客户代码" clearable
                        popper-class="multi-column-select">
                        <el-option v-for="item in localCustomerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="账单编号">
                    <el-input v-model="formData.billNo" placeholder="不填则系统自动生成" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="币种" prop="currency">
                    <el-select v-model="formData.currency" placeholder="请选择币种" clearable>
                        <el-option v-for="item in nationOptions" :label="item.label" :value="item.value"
                            :key="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="起始日期" prop="billStartDate">
                    <el-date-picker v-model="formData.billStartDate" type="date" placeholder="选择起始日期"
                        value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="结束日期" prop="billEndDate">
                    <el-date-picker v-model="formData.billEndDate" type="date" placeholder="选择结束日期"
                        value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :rows="2" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="附件" prop="attachment">
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
import { ref, defineProps, defineExpose, watch, nextTick } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { uploadApi } from '@/api/baseApi/index.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'; // 导入查询客户接口
import { smartAlert } from '@/utils/genericMethods.js';
import { ElMessage } from 'element-plus';

const props = defineProps({
    companyOptions: { type: Array, default: () => [] },
    customerOptions: { type: Array, default: () => [] },
    nationOptions: { type: Array, default: () => [] }
});

const formData = ref({
    orgId: '',
    customerCode: '',
    currency: '',
    billNo: '',
    billStartDate: '',
    billEndDate: '',
    remark: '',
    attachment: ''
});

const fileList = ref([]); // 本地维护的文件数组
// 本地维护的客户列表，用于联动更新
const localCustomerOptions = ref([]);

const formRef = ref(null);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 监听 props.customerOptions 变化，初始化本地列表
watch(() => props.customerOptions, (val) => {
    if (val && val.length > 0) {
        localCustomerOptions.value = [...val];
    }
}, { immediate: true });

const rules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    customerCode: [{ required: true, message: '请选择客户', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    // billNo 不填系统生成，故移除必填校验，或者改为选填
    billStartDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
    billEndDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
};

// 公司改变事件：联动查询客户
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value?.togglePopperVisible();
        });
    }
    // 清空当前已选客户
    formData.value.customerCode = '';

    try {
        const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
        localCustomerOptions.value = result.data.map(item => ({
            value: item.code,
            label: item.code + '(' + item.name + ')'
        }));
    } catch (error) {
        console.error('获取客户列表失败', error);
        localCustomerOptions.value = [];
    }
};

const beforeUpload = () => true;

const handleUpload = async (params) => {
    const file = params.file;
    try {
        const isDuplicate = fileList.value.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传`);
            return;
        }
        // 1. 修改：上传路径为 temp
        const res = await uploadApi(file, { path: 'temp' });
        if (res.success && res.data) {
            fileList.value.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
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

defineExpose({
    validate: async () => await formRef.value.validate(),
    resetFields: () => {
        formRef.value.resetFields();
        fileList.value = [];
        // 重置时恢复初始的客户列表（可选）
        if (props.customerOptions && props.customerOptions.length > 0) {
            localCustomerOptions.value = [...props.customerOptions];
        }
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

/* 2. 修改：设置附件列表高度及滚动条 */
.attachment-list {
    display: flex;
    flex-direction: column;
    max-height: 150px;
    /* 限制高度 */
    overflow-y: auto;
    /* 超出显示滚动条 */
    margin-bottom: 5px;
    border: 1px solid #ebeef5;
    /* 可选：加个边框更好看 */
    padding: 2px;
    border-radius: 4px;
}

.attachment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f7fa;
    padding: 4px 8px;
    /* 稍微增加内边距 */
    margin-bottom: 2px;
    border-radius: 2px;
    flex-shrink: 0;
    /* 防止子元素被压缩 */
}

.delete-icon {
    cursor: pointer;
    color: #909399;
    margin-left: 10px;
}

.delete-icon:hover {
    color: #F56C6C;
}

.file-link {
    color: #409EFF;
    text-decoration: none;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
}

:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea) {
    width: 100%;
}
</style>