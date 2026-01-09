<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
            <el-row gutter="20" style="width: 1150px;">
                <el-col :span="16">
                    <p>基础信息</p>
                    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                        <el-row>
                            <!-- 工单类型 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('secondTypeId')" prop="secondTypeId">
                                    <el-cascader v-model="secondTypePath" :options="secondTypeOptions"
                                        :props="secondTypeProps"
                                        :disabled="!secondTypeOptions || secondTypeOptions.length === 0"
                                        :placeholder="getPlaceholder('secondTypeId')" @change="onSecondTypeChange" />
                                </el-form-item>
                            </el-col>
                            <!-- 工单优先级 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('priorityId')" prop="priorityId">
                                    <el-radio-group v-model="formData.priorityId">
                                        <el-radio v-for="p in priorityOptions" :key="p.id" :label="p.name"
                                            :value="p.id">
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <!-- 公司 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('orgId')" prop="orgId">
                                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                        :props="parentProps" clearable @change="handleCascaderChange"
                                        :placeholder="getPlaceholder('orgId')" />
                                </el-form-item>
                            </el-col>
                            <!-- 客户 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('customerId')" prop="customerId">
                                    <el-select v-model="formData.customerId" filterable
                                        :placeholder="getPlaceholder('customerId')" clearable
                                        popper-class="multi-column-select">
                                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- 单号类型 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('relatedBizType')" prop="relatedBizType">
                                    <el-select v-model="formData.relatedBizType"
                                        :placeholder="getPlaceholder('relatedBizType')" clearable
                                        @change="queryDocInfo">
                                        <el-option v-for="item in relatedBizTypeOptions" :key="item.id"
                                            :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- 单号 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('relatedBizNo')" prop="relatedBizNo">
                                    <el-input v-model.trim="formData.relatedBizNo"
                                        :placeholder="getPlaceholder('relatedBizNo')" @blur="queryDocInfo" />
                                </el-form-item>
                            </el-col>
                            <!-- 模板 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('templateId')" prop="templateId">
                                    <el-select v-model="formData.templateId" :placeholder="getPlaceholder('templateId')"
                                        clearable @change="handleTemplateChange">
                                        <el-option v-for="item in templateOptions" :key="item.id" :label="item.title"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- 标题 -->
                            <el-col :span="24">
                                <el-form-item :label="getLabel('title')" prop="title">
                                    <el-input v-model.trim="formData.title" :placeholder="getPlaceholder('title')" />
                                </el-form-item>
                            </el-col>
                            <!-- 内容 -->
                            <el-col :span="24">
                                <el-form-item :label="getLabel('content')" prop="content">
                                    <el-input type="textarea" v-model="formData.content" :rows="4"
                                        :placeholder="getPlaceholder('content')" />
                                </el-form-item>
                            </el-col>
                            <!-- 附件 -->
                            <el-col :span="24">
                                <el-form-item :label="getLabel('fileUrl')" prop="fileUrl">
                                    <div class="attachment-container">
                                        <div class="attachment-list-scroll"
                                            v-if="formData.fileUrl && formData.fileUrl.length > 0">
                                            <div v-for="(file, idx) in formData.fileUrl" :key="idx"
                                                class="attachment-item">
                                                <a :href="file.url" target="_blank" class="file-link">
                                                    {{ file.name.length > 70 ? file.name.slice(0, 70) + '...' :
                                                        file.name }}
                                                </a>
                                                <span class="file-size">({{ (file.size / 1024).toFixed(1) }} KB)</span>
                                                <el-button type="text" size="small" class="delete-btn"
                                                    @click="removeFile(idx)">{{ getButtonText('del') }}</el-button>
                                            </div>
                                        </div>

                                        <div class="upload-btn-area">
                                            <el-upload :auto-upload="true" :http-request="(p) => handleUpload(p)"
                                                :before-upload="beforeUpload" multiple :show-file-list="false">
                                                <el-button type="primary" size="small">
                                                    <el-icon style="margin-right: 4px;">
                                                        <Plus />
                                                    </el-icon> {{ getButtonText('upload') }}
                                                </el-button>
                                            </el-upload>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <!-- 联系人 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('contact')" prop="contact">
                                    <el-input v-model.trim="formData.contact"
                                        :placeholder="getPlaceholder('contact')" />
                                </el-form-item>
                            </el-col>
                            <!-- 电话 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('phone')" prop="phone">
                                    <el-input v-model.trim="formData.phone" :placeholder="getPlaceholder('phone')" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>

                <el-col :span="8">
                    <div class="right-info-panel">
                        <div class="info-card">
                            <div class="info-title">{{ getColumnText('orderData') }}</div>
                            <div v-loading="docLoading">
                                <div v-if="docInfo.hasData">
                                    <div class="info-row"><span class="label">{{ getColumnText('bizNo')
                                            }}：</span><span>{{
                                                docInfo.bizNo
                                            }}</span></div>
                                    <div class="info-row"><span class="label">{{ getColumnText('bizStatusName')
                                            }}：</span><span>{{ docInfo.bizStatusName
                                            }}</span></div>
                                    <div class="info-row"><span class="label">{{ getColumnText('createUserName')
                                            }}：</span><span>{{ docInfo.createUserName
                                            }}</span></div>
                                    <div class="info-row"><span class="label">{{ getColumnText('createTime')
                                            }}：</span><span>{{ docInfo.createTime
                                            }}</span></div>
                                    <div class="info-row"><span class="label">{{ getColumnText('customerName')
                                            }}：</span><span>{{ docInfo.customerName
                                            }}</span></div>
                                    <div class="info-row"><span class="label">{{ getColumnText('orgName')
                                            }}：</span><span>{{ docInfo.orgName
                                            }}</span></div>
                                </div>
                                <div v-else class="no-data">
                                    {{ getColumnText('noData') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="bottom-space"></div>

            <div class="btns">
                <el-button type="warning" @click="submitForm(true)">{{ getButtonText('saveAsDraft') }}</el-button>
                <el-button type="success" @click="submitForm(false)">{{ getButtonText('submit') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="新增工单">
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { ElLoading, ElMessage, ElNotification } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
import { getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { uploadApi } from '@/api/baseApi/index.js';
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()

import {
    getWorkOrderTypeListApi, addWorkOrderApi, getPriorityEnumApi, getBizTypeEnumApi, getWorkOrderTemplateListApi, getBizByTypeAndNoApi
} from '@/api/vasApi/wo.js';

const formRef = ref(null);
const cascaderRef = ref(null);

const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 表单数据
const formData = reactive({
    orgId: '',
    customerId: '',
    secondTypeId: '',
    title: '',
    content: '',
    contact: '',
    phone: '',
    fileUrl: [],
    priorityId: 10,
    relatedBizType: '',
    relatedBizNo: '',
    templateId: ''
});

// 级联配置
const secondTypePath = ref([]);
const secondTypeOptions = ref([]);
const secondTypeProps = ref({
    value: 'value',
    label: 'label',
    children: 'children',
    emitPath: true
});

// 选项数据
const companyOptions = ref([]);
const customerOptions = ref([]);
const relatedBizTypeOptions = ref([]);
const priorityOptions = ref([]);
const templateOptions = ref([]); // 模板选项

// 右侧单据信息
const docLoading = ref(false);
const docInfo = reactive({
    hasData: false,
    orderNo: '',
    status: '',
    createdBy: '',
    createdAt: '',
    customerName: '',
    companyName: '',
    amount: ''
});

const rules = reactive({
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
    relatedBizType: [{ required: true, message: '请选择关联业务类型', trigger: 'change' }],
    relatedBizNo: [{ required: true, message: '请输入关联业务单号', trigger: 'blur' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    priorityId: [{ required: true, message: '请选择优先级', trigger: 'change' }],
    secondTypeId: [{ required: true, message: '请选择二级类型', trigger: 'change' }]
});

// 处理树形结构
function detectCascaderProps(sampleNodes) {
    const props = { value: 'value', label: 'label', children: 'children', emitPath: true };
    if (!Array.isArray(sampleNodes) || sampleNodes.length === 0) {
        secondTypeProps.value = props;
        return;
    }
    const first = sampleNodes[0];
    const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

    // 简单的智能识别逻辑
    if (hasKey(first, 'id')) props.value = 'id';
    if (hasKey(first, 'name')) props.label = 'name';
    else if (hasKey(first, 'nameCn')) props.label = 'nameCn';
    else if (hasKey(first, 'title')) props.label = 'title';

    if (hasKey(first, 'children')) props.children = 'children';

    secondTypeProps.value = props;
}

// 初始化加载
onMounted(async () => {
    try {
        const tasks = [
            getOrgListCompanyApi().catch(() => ({ success: false, data: [] })),
            getCustomerLikeQueryApi({ keyword: '*' }).catch(() => ({ success: false, data: [] })),
            getWorkOrderTypeListApi().catch(() => ({ success: false, data: [] })),
            getPriorityEnumApi().catch(() => ({ success: false, data: [] })),
            getBizTypeEnumApi().catch(() => ({ success: false, data: [] })),
            // 获取问题模板
            getWorkOrderTemplateListApi({}).catch(() => ({ success: false, data: [] }))
        ];

        const [companyRes, customerRes, workTypeRes, priorityRes, bizRes, templateRes] = await Promise.all(tasks);

        // 处理公司树
        if (companyRes?.data) {
            const convertToTree = (items) => items.map(item => ({
                value: item.id,
                label: item.nameCn || item.name,
                children: item.children ? convertToTree(item.children) : []
            }));
            companyOptions.value = convertToTree(companyRes.data || []);
        }

        // 处理客户
        if (customerRes?.data) {
            customerOptions.value = customerRes.data.map(item => ({ id: item.id, label: `${item.code}(${item.name})`, value: item.id }));
        }

        // 处理工单类型
        if (workTypeRes?.data) {
            secondTypeOptions.value = Array.isArray(workTypeRes.data) ? workTypeRes.data : [workTypeRes.data];
            detectCascaderProps(secondTypeOptions.value);
        }

        // 优先级
        if (priorityRes?.data) priorityOptions.value = priorityRes.data;

        // 业务类型
        relatedBizTypeOptions.value = bizRes.data;
        templateOptions.value = templateRes.data;

    } catch (e) {
        console.error('初始化异常：', e);
        smartAlert('初始化数据加载异常', false);
    } 
});

// ------------------- 业务逻辑 -------------------

// 1. 公司 -> 客户联动
const handleCascaderChange = async (val) => {
    if (val) {
        nextTick(() => cascaderRef.value && cascaderRef.value.togglePopperVisible());
    }
    const orgId = val ? val : '';
    formData.customerId = ''; // 清空已选客户
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    if (result && result.data) {
        customerOptions.value = result.data.map(item => ({
            value: item.id,
            label: item.code + '(' + item.name + ')'
        }));
    }
};

// 2. 工单类型：限制只能选第二级
const onSecondTypeChange = (path) => {
    if (!path || path.length !== 2) {
        if (path && path.length > 0) {
            ElMessage.warning('请选择二级类型');
            secondTypePath.value = [];
            formData.secondTypeId = '';
        }
        return;
    }
    formData.secondTypeId = path[path.length - 1];
};

// 3. 问题模板联动：填充标题和内容
const handleTemplateChange = (templateId) => {
    if (!templateId) return;
    const selectedTemplate = templateOptions.value.find(t => t.id === templateId);
    if (selectedTemplate) {
        // 仅当输入框为空或用户确认时覆盖？这里按要求直接填充
        formData.title = selectedTemplate.title || '';
        formData.content = selectedTemplate.content || '';
        ElMessage.success('已应用模板内容');
    }
};

// 4. 右侧单据信息联动
const queryDocInfo = async () => {
    if (!formData.relatedBizType || !formData.relatedBizNo) return;

    docLoading.value = true;
    try {
        const res = await getBizByTypeAndNoApi({ bizType: formData.relatedBizType, bizNo: formData.relatedBizNo });
        if (res.success) {
            Object.assign(docInfo, res.data);
            docInfo.hasData = true;
        } else {
            docInfo.hasData = false;
            smartAlert(res.msg, res.success, 1000)
        }
    } catch (e) {
        console.error(e);
        docInfo.hasData = false;
    } finally {
        docLoading.value = false;
    }
};

// 5. 附件上传逻辑
const beforeUpload = (file) => true;
const handleUpload = async (params) => {
    const file = params.file;
    try {
        const isDuplicate = formData.fileUrl.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已存在`);
            return;
        }
        const res = await uploadApi(file, { path: 'temp' });
        if (res?.success) {
            formData.fileUrl.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage.success('上传成功');
        } else {
            ElMessage.error(res.msg || '上传失败');
        }
    } catch (err) {
        ElMessage.error('上传异常');
    }
};
const removeFile = (idx) => {
    formData.fileUrl.splice(idx, 1);
};

// 6. 提交/草稿逻辑
// isDraft: true (草稿), false (提交)
const submitForm = async (isDraft) => {
    try {
        await formRef.value.validate();

        // 判断fileUrl是否为数组并且有值，是则转化成JSON字符串
        if (Array.isArray(formData.fileUrl) && formData.fileUrl.length > 0) {
            formData.fileUrl = JSON.stringify(formData.fileUrl);
        }
        const submitData = {
            ...formData,
            secondTypeId: formData.secondTypeId || '',
            isDraft: isDraft
        };
        const res = await addWorkOrderApi(submitData);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            refreshStore.shouldRefreshWorkOrderList = true
            useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
            router.push('/vas/wo/workOrder/list')
        } else {
            console.log(res);
        }

    } catch (err) {
        console.warn('校验未通过', err);
    }
};

const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/vas/wo/workOrder/list' })
};
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
    overflow-x: auto !important;
}

/* 底部按钮栏 */
.btns {
    width: 85% !important;
    padding: 10px 24px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

:deep(.el-form) {
    width: 100% !important;
}

/* 附件样式优化 */
.attachment-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.attachment-list-scroll {
    max-height: 150px;
    /* 限制高度 */
    overflow-y: auto;
    /* 超出滚动 */
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 5px;
    background-color: #fafafa;
}

.attachment-item {
    font-size: 13px;
    line-height: 24px;
    display: flex;
    align-items: center;
    padding: 0 5px;

    &:hover {
        background-color: #e6f7ff;
    }
}

.file-link {
    color: #409EFF;
    text-decoration: none;
    margin-right: 8px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-size {
    color: #999;
    margin-right: 10px;
    font-size: 12px;
}

.delete-btn {
    color: #F56C6C;
}

.upload-btn-area {
    display: flex;
}

.bottom-space {
    flex: 1;
}

/* 右侧信息卡片 */
.right-info-panel {
    display: flex;
    justify-content: flex-end;
    position: sticky;
    top: 20px;
    /* 如果父容器支持，这会让它跟随滚动 */
}

.info-card {
    width: 100%;
    max-width: 320px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.info-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    color: #303133;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 13px;
    line-height: 1.5;
}

.info-row .label {
    color: #909399;
    margin-right: 10px;
    white-space: nowrap;
}

.info-row span:last-child {
    color: #606266;
    text-align: right;
    font-weight: 500;
}

.no-data {
    color: #C0C4CC;
    font-size: 12px;
    text-align: center;
    padding: 20px 0;
}
</style>