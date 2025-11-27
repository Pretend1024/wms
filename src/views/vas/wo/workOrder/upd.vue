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
                                        :props="secondTypeProps" :placeholder="getPlaceholder('secondTypeId')"
                                        @change="onSecondTypeChange" disabled />
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
                                        :placeholder="getPlaceholder('orgId')" disabled />
                                </el-form-item>
                            </el-col>
                            <!-- 客户 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('customerId')" prop="customerId">
                                    <el-select v-model="formData.customerId" filterable
                                        :placeholder="getPlaceholder('customerId')" clearable
                                        popper-class="multi-column-select" disabled>
                                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- 单号类型 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('relatedBizType')" prop="relatedBizType">
                                    <el-select v-model="formData.relatedBizType"
                                        :placeholder="getPlaceholder('relatedBizType')" clearable @change="queryDocInfo"
                                        disabled>
                                        <el-option v-for="item in relatedBizTypeOptions" :key="item.id"
                                            :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- 单号 -->
                            <el-col :span="12">
                                <el-form-item :label="getLabel('relatedBizNo')" prop="relatedBizNo">
                                    <el-input v-model.trim="formData.relatedBizNo"
                                        :placeholder="getPlaceholder('relatedBizNo')" @blur="queryDocInfo" disabled />
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
// 引入接口
import {
    getWorkOrderTypeListApi, addWorkOrderApi, getPriorityEnumApi, getBizTypeEnumApi, getWorkOrderTemplateListApi, getBizByTypeAndNoApi, getFullByIdApi, updWorkOrderByIdApi
} from '@/api/vasApi/wo.js';
const props = defineProps({
    id: { type: String, required: true }
})

const formRef = ref(null);
const cascaderRef = ref(null);

const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
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

// 辅助函数：根据二级类型ID查找级联路径
const findSecondTypePath = (options, targetId, path = []) => {
    for (const item of options) {
        const currentValue = item[secondTypeProps.value.value];
        const newPath = [...path, currentValue];

        // 找到目标节点（二级节点）
        if (currentValue === targetId && !item[secondTypeProps.value.children]) {
            return newPath;
        }

        // 递归查找子节点
        if (item[secondTypeProps.value.children] && item[secondTypeProps.value.children].length > 0) {
            const result = findSecondTypePath(item[secondTypeProps.value.children], targetId, newPath);
            if (result) return result;
        }
    }
    return null;
};

// 获取工单详情并回显
const getDetail = async () => {
    const id = props.id || route.query.id;
    if (!id) return; // 无ID则不加载详情（新增场景）

    const loading = ElLoading.service({ target: '.viewArea', text: '加载工单详情...' });
    try {
        const res = await getFullByIdApi({ id });
        if (res.success && res.data) {
            const detail = res.data;

            // 1. 处理公司ID（级联选择器需要数组格式）
            if (detail.orgId) {
                formData.orgId = Array.isArray(detail.orgId) ? detail.orgId : [detail.orgId];
                // 触发公司联动，加载对应客户列表
                await handleCascaderChange(formData.orgId);
            }

            // 2. 处理客户ID（需在客户列表加载后赋值）
            formData.customerId = detail.customerId || '';

            // 3. 处理工单类型（级联路径回显）
            if (detail.secondTypeId) {
                const typePath = findSecondTypePath(secondTypeOptions.value, detail.secondTypeId);
                if (typePath) {
                    secondTypePath.value = typePath; // 触发change事件自动设置secondTypeId
                } else {
                    formData.secondTypeId = detail.secondTypeId;
                    ElMessage.warning('工单类型不存在或已变更');
                }
            }

            // 4. 处理附件（JSON字符串转数组）
            if (detail.fileUrl) {
                try {
                    formData.fileUrl = typeof detail.fileUrl === 'string'
                        ? JSON.parse(detail.fileUrl)
                        : Array.isArray(detail.fileUrl) ? detail.fileUrl : [];
                } catch (e) {
                    console.error('解析附件数据失败', e);
                    formData.fileUrl = [];
                }
            }

            // 5. 优先级（直接赋值，单选按钮组自动匹配）
            formData.priorityId = detail.priorityId || 10;

            // 6. 关联业务信息
            formData.relatedBizType = detail.relatedBizType || '';
            formData.relatedBizNo = detail.relatedBizNo || '';

            // 7. 模板ID（直接赋值，不触发模板重新应用）
            formData.templateId = detail.templateId || '';

            // 8. 核心内容字段
            formData.title = detail.title || '';
            formData.content = detail.content || '';
            formData.contact = detail.contact || '';
            formData.phone = detail.phone || '';

            // 9. 自动加载右侧单据信息
            if (formData.relatedBizType && formData.relatedBizNo) {
                await queryDocInfo();
            }
        } else {
            ElMessage.error(res.msg || '加载工单详情失败');
        }
    } catch (error) {
        console.error('加载工单详情异常', error);
        ElMessage.error('网络异常，加载工单详情失败');
    } finally {
        loading.close();
    }
};

// 初始化加载（合并原有初始化和详情加载逻辑）
onMounted(async () => {
    const loading = ElLoading.service({ lock: true, text: '初始化数据...' });
    try {
        // 并行加载基础选项数据
        const tasks = [
            getOrgListCompanyApi().catch(() => ({ success: false, data: [] })),
            getCustomerLikeQueryApi({ keyword: '*' }).catch(() => ({ success: false, data: [] })),
            getWorkOrderTypeListApi().catch(() => ({ success: false, data: [] })),
            getPriorityEnumApi().catch(() => ({ success: false, data: [] })),
            getBizTypeEnumApi().catch(() => ({ success: false, data: [] })),
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
            customerOptions.value = customerRes.data.map(item => ({
                id: item.id,
                label: `${item.code}(${item.name})`,
                value: item.id
            }));
        }

        // 处理工单类型
        if (workTypeRes?.data) {
            secondTypeOptions.value = Array.isArray(workTypeRes.data) ? workTypeRes.data : [workTypeRes.data];
            detectCascaderProps(secondTypeOptions.value);
        }

        // 优先级
        if (priorityRes?.data) priorityOptions.value = priorityRes.data;

        // 业务类型
        relatedBizTypeOptions.value = bizRes.data || [];

        // 模板选项
        templateOptions.value = templateRes.data || [];

        // 基础数据加载完成后，加载工单详情（编辑场景）
        await getDetail();

    } catch (e) {
        console.error('初始化异常：', e);
        smartAlert('初始化数据加载异常', false);
    } finally {
        loading.close();
    }
});

// ------------------- 业务逻辑 -------------------

// 1. 公司 -> 客户联动
const handleCascaderChange = async (val) => {
    if (val) {
        nextTick(() => cascaderRef.value && cascaderRef.value.togglePopperVisible());
    }
    const orgId = val ? val[val.length - 1] : '';
    formData.customerId = ''; // 清空已选客户
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    if (result && result.data) {
        customerOptions.value = result.data.map(item => ({
            value: item.id,
            label: `${item.code}(${item.name})`
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
            smartAlert(res.msg, res.success, 1000);
        }
    } catch (e) {
        console.error('查询关联单据信息失败', e);
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
const submitForm = async (isDraft) => {
    try {
        await formRef.value.validate();

        // 处理附件：数组转JSON字符串
        let fileUrl = formData.fileUrl;
        if (Array.isArray(fileUrl) && fileUrl.length > 0) {
            fileUrl = JSON.stringify(fileUrl);
        } else {
            fileUrl = '';
        }

        // 构造提交数据（参考submitForm原有结构）
        const submitData = {
            id: props.id || route.query.id, // 编辑场景携带ID
            orgId: Array.isArray(formData.orgId) ? formData.orgId[formData.orgId.length - 1] : formData.orgId,
            secondTypeId: secondTypePath.value[secondTypePath.value.length - 1] || '',
            customerId: formData.customerId || '',
            priorityId: formData.priorityId || 10,
            relatedBizType: formData.relatedBizType || '',
            relatedBizNo: formData.relatedBizNo || '',
            templateId: formData.templateId || '',
            title: formData.title || '',
            content: formData.content || '',
            contact: formData.contact || '',
            phone: formData.phone || '',
            fileUrl: fileUrl,
            isDraft: isDraft
        };

        // 提交请求
        const res = await updWorkOrderByIdApi(submitData);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            refreshStore.shouldRefreshWorkOrderList = true;
            // 关闭当前标签页
            useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
            router.push('/vas/wo/workOrder/list');
        }
    } catch (err) {
        console.warn('表单校验未通过', err);
    }
};

// 关闭页面
const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push('/vas/wo/workOrder/list');
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