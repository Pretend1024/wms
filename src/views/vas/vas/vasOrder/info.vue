<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
            <p>基础信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <el-row>
                    <!-- 基础信息字段恢复为新增页面的下拉框样式，保留所有交互 -->
                    <el-col :span="8">
                        <el-form-item label="服务单号:" prop="vasOrderNo" class="compact-item">
                            <el-input v-model.trim="formData.vasOrderNo" placeholder="请输入增值服务单号" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="服务标题:" prop="vasTitle">
                            <el-input v-model.trim="formData.vasTitle" placeholder="请输入服务标题" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联业务类型:" prop="relatedBizType">
                            <el-select v-model="formData.relatedBizType" placeholder="请选择关联业务类型" clearable disabled>
                                <el-option v-for="item in relatedBizTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联业务单号:" prop="relatedBizNo">
                            <el-input v-model.trim="formData.relatedBizNo" placeholder="请输入关联业务单号" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('warehouseCode')" prop="warehouseId" required>
                            <el-select v-model="formData.warehouseId" filterable
                                :placeholder="getPlaceholder('warehouseCode')" clearable disabled>
                                <el-option v-for="item in warehouseOptions" :key="item.code"
                                    :label="`${item.code}-${item.name}`" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('customerCode')" class="compact-item" prop="customerId">
                            <el-select v-model="formData.customerId" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable disabled>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计完成时间:" prop="expectFinishTime" disabled>
                            <el-date-picker v-model="formData.expectFinishTime" type="date" placeholder="选择预计完成时间"
                                format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联工单:" prop="relatedWorkOrderId">
                            <el-input v-model.trim="formData.relatedWorkOrderId" placeholder="请输入关联工单" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="服务描述:" prop="vasDesc">
                            <el-input type="textarea" v-model="formData.vasDesc" placeholder="请输入客户需求详情" :rows="3"
                                readonly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 服务项目信息 标题 + 添加明细按钮 -->
            <div class="section-header">
                <div class="section-title">服务项目信息</div>
            </div>

            <!-- 服务项目折叠面板 -->
            <el-collapse v-model="activeNames" class="item-collapse" border>
                <el-collapse-item v-for="(item, index) in vasOrderItemList" :key="item.id || `item-${index}`">
                    <!-- 折叠面板标题（包含删除按钮） -->
                    <template #title>
                        <div class="collapse-header">
                            <span class="collapse-title">
                                {{ index + 1 + "." }}
                                {{ item.serviceTypeName || '未选择服务类型' }}
                                <span v-if="item.sku"> - {{ item.sku }}</span>
                                <span v-if="item.planQty"> (计划数量: {{ item.planQty }}{{ item.unit }})</span>
                            </span>
                        </div>
                    </template>

                    <!-- 折叠面板内容：服务项目表单 -->
                    <el-form :model="item" label-width="115px" class="item-form" style="width: 98% !important;"
                        :rules="itemFormRules" ref="itemFormRefs[index]">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="服务类型:" prop="serviceTypeId" required>
                                    <el-select v-model="item.serviceTypeId" placeholder="请选择服务类型" clearable filterable
                                        @change="(val) => onServiceTypeChange(item, val)" disabled>
                                        <el-option v-for="option in serviceTypeOptions" :key="option.id"
                                            :label="option.name" :value="option.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划数量:" prop="planQty" required>
                                    <el-input v-model.number="item.planQty" placeholder="请输入计划数量" v-number readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="单位:" prop="unit" required>
                                    <el-select v-model="item.unit" placeholder="请选择单位" clearable filterable disabled>
                                        <el-option v-for="option in unitOptions" :key="option.name" :label="option.name"
                                            :value="option.name" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="SKU:" prop="sku">
                                    <el-input v-model="item.sku" @blur="onSkuBlur(item)" placeholder="请输入SKU" readonly>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="服务附件:">
                                    <div class="attachment-container">
                                        <div class="attachment-list"
                                            v-if="item.serviceAttachmentList && item.serviceAttachmentList.length > 0">
                                            <div v-for="(file, idx) in item.serviceAttachmentList"
                                                :key="`service-${index}-${idx}`" class="attachment-item">
                                                <a :href="file.url" target="_blank" class="file-link">
                                                    {{ file.name.length > 35 ? file.name.slice(0, 35) + '...' :
                                                        file.name }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="执行人:" prop="executeBy">
                                    <!-- <el-select v-model="item.executeBy" filterable placeholder="请输入执行人" clearable>
                                        <el-option v-for="item in operatorUserOptions" :key="item.code"
                                            :label="`${item.code}-${item.name}`" :value="item.code" />
                                    </el-select> -->
                                    <el-input v-model="item.executeBy" placeholder="请输入执行人" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="开始处理时间:" prop="startTime">
                                    <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间"
                                        format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="完成时间:" prop="finishTime">
                                    <el-date-picker v-model="item.finishTime" type="datetime" placeholder="选择完成时间"
                                        format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="完成数量:" prop="finishQty">
                                    <el-input v-model.number="item.finishQty" placeholder="请输入完成数量" v-number readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="结果附件:">
                                    <div class="attachment-container">
                                        <!-- 已上传结果附件列表（带删除按钮） -->
                                        <div class="attachment-list"
                                            v-if="item.resultAttachmentList && item.resultAttachmentList.length > 0">
                                            <div v-for="(file, idx) in item.resultAttachmentList"
                                                :key="`result-${index}-${idx}`" class="attachment-item">
                                                <a :href="file.url" target="_blank" class="file-link">
                                                    {{ file.name.length > 35 ? file.name.slice(0, 35) + '...' :
                                                        file.name }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注:" prop="remark">
                                    <el-input type="textarea" v-model="item.remark" placeholder="请输入备注" :rows="2"
                                        readonly />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-collapse-item>
            </el-collapse>

            <!-- 费用信息部分（保留新增页面所有功能） -->
            <div class="section-header">
                <div class="section-title">费用信息</div>
            </div>
            <el-row class="table-container">
                <el-col :span="24">
                    <generalAddTable ref="feeTableRef" :modelValue="false" :columns="feeTableColumns"
                        :data="feeTableData" :addRowDefaults="[{ prop: 'createWay', value: 20 }]">
                        <template #feeTypeId="{ row }">
                            <el-select v-model="row.feeTypeId" placeholder="请选择费用类型" clearable filterable disabled>
                                <el-option v-for="item in feeTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #totalFee="{ row }">
                            <el-input v-model.number="row.totalFee" placeholder="请输入总费用" v-number readonly />
                        </template>
                        <template #currency="{ row }">
                            <el-select v-model="row.currency" placeholder="请选择货币类型" clearable filterable disabled>
                                <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </template>
                        <template #createWay="{ row }">
                            <el-select v-model="row.createWay" placeholder="请选择创建类型" clearable disabled>
                                <el-option v-for="item in feeCreateTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #remark="{ row }">
                            <el-input v-model="row.remark" placeholder="请输入费用备注" readonly />
                        </template>
                    </generalAddTable>
                </el-col>
            </el-row>

            <!-- 底部占位 -->
            <div class="bottom-space"></div>
            <!-- 粘性按钮 -->
            <div class="btns">
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="编辑增值服务单">
import {
    getFullVoByOrderNoApi,
    updVasOrderByIdApi,
    getVasOrderRelatedBizTypeEnumApi,
    getVasServiceTypeListApi,
    getVasOrderFeeTypeEnumApi,
    getVasOrderFeeCreateTypeEnumApi,
    getVasServiceTypeUnitEnumApi,
    calculateFeeApi
} from '@/api/vasApi/vas.js'
import { getUserOperatorUserListApi } from '@/api/sysApi/user.js'
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { ref, reactive, onMounted, nextTick, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import generalAddTable from '@/components/table/generalAddTable.vue';
import { ElLoading, ElMessage, ElNotification } from 'element-plus';
import { Close } from '@element-plus/icons-vue'
import tagsStore from '@/store/tags.js';
import { useRefreshStore } from '@/store/refresh.js';
import { smartAlert } from '@/utils/genericMethods.js';
import { getLabel, getPlaceholder, getButtonText } from '@/utils/i18n/i18nLabels.js';
import { uploadApi } from '@/api/baseApi/index.js'

// 接收父组件传递的id参数
const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});

const route = useRoute();
const router = useRouter();
const useTagsStore = tagsStore();
const refreshStore = useRefreshStore();

// 表单引用
const formRef = ref(null);
const feeTableRef = ref(null);
const itemFormRefs = ref([]); // 服务项目表单引用数组

// 状态变量
const formData = reactive({
    vasOrderNo: '',
    relatedBizType: '',
    relatedBizNo: '',
    warehouseId: '',
    warehouseCode: '',
    warehouseName: '',
    customerId: '',
    customerCode: '',
    customerName: '',
    vasTitle: '',
    vasDesc: '',
    expectFinishTime: '',
    relatedWorkOrderId: '',
});

// 服务项目数据（折叠面板数据）
const vasOrderItemList = ref([]);
const feeTableData = ref([]);
const activeNames = ref([]); // 折叠面板激活状态
const currentRowIndex = ref(-1); // 当前操作的SKU行索引
const skuDialogVisible = ref(false);
const isFetchingFee = ref(false);

// 下拉框选项
const warehouseOptions = ref([]);
const relatedBizTypeOptions = ref([]);
const customerOptions = ref([]);
const serviceTypeOptions = ref([]);
const feeTypeOptions = ref([]);
const currencyOptions = ref([]);
const feeCreateTypeOptions = ref([]);
const unitOptions = ref([]);
const operatorUserOptions = ref([]);

// 表单验证规则
const rules = reactive({
    vasOrderNo: [{ required: true, message: '请输入增值服务单号', trigger: 'blur' }],
    relatedBizType: [{ required: true, message: '请选择关联业务类型', trigger: 'change' }],
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
    vasTitle: [{ required: true, message: '请输入服务标题', trigger: 'blur' }],
});

// 服务项目表单验证规则
const itemFormRules = reactive({
    serviceTypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    planQty: [{ required: true, message: '请输入计划数量', trigger: 'blur' }, { type: 'number', min: 1, message: '计划数量不能小于1', trigger: 'blur' }],
    unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
});

// 费用表格列配置（和新增页面一致）
const feeTableColumns = ref([
    { label: '费用类型', prop: 'feeTypeId', required: true, slot: 'feeTypeId', width: 200 },
    { label: '费用金额', prop: 'totalFee', required: true, slot: 'totalFee', width: 150 },
    { label: '货币类型', prop: 'currency', required: true, slot: 'currency', width: 180 },
    { label: '创建类型', prop: 'createWay', required: true, slot: 'createWay', width: 180 },
    { label: '费用备注', prop: 'remark', slot: 'remark', width: 280 }
]);


/**
 * 关闭页面
 */
const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push('/vas/vas/vasOrder/list');
};

/**
 * 获取编辑详情数据
 */
const getDetail = async () => {
    const loading = ElLoading.service({ lock: true, text: "加载中..." });
    try {
        if (!props.id) {
            ElMessage.warning('缺少编辑ID');
            return;
        }

        const res = await getFullVoByOrderNoApi({ vasOrderNo: props.id });
        if (res.success && res.data) {
            const data = res.data;

            // 填充基础信息
            Object.assign(formData, data);
            formData.vasOrderNo = data.vasOrderNo || '';
            formData.relatedBizType = data.relatedBizType || '';
            formData.relatedBizNo = data.relatedBizNo || '';
            formData.warehouseId = data.warehouseId || '';
            formData.warehouseCode = data.warehouseCode || '';
            formData.warehouseName = data.warehouseName || '';
            formData.customerId = data.customerId || '';
            formData.customerCode = data.customerCode || '';
            formData.customerName = data.customerName || '';
            formData.vasTitle = data.vasTitle || '';
            formData.vasDesc = data.vasDesc || '';
            formData.expectFinishTime = data.expectFinishTime || '';
            formData.relatedWorkOrderId = data.relatedWorkOrderId || '';

            // 填充服务项目数据（处理附件）
            vasOrderItemList.value = data.vasOrderItemList.map(item => {
                // 解析服务附件
                let serviceAttachmentList = [];
                try {
                    if (item.serviceAttachment && item.serviceAttachment !== '""' && item.serviceAttachment !== '[]') {
                        serviceAttachmentList = JSON.parse(item.serviceAttachment);
                        if (!Array.isArray(serviceAttachmentList)) serviceAttachmentList = [];
                    }
                } catch (e) {
                    console.error('解析服务附件失败：', e);
                    serviceAttachmentList = [];
                }

                // 解析结果附件
                let resultAttachmentList = [];
                try {
                    if (item.resultAttachment && item.resultAttachment !== '""' && item.resultAttachment !== '[]') {
                        resultAttachmentList = JSON.parse(item.resultAttachment);
                        if (!Array.isArray(resultAttachmentList)) resultAttachmentList = [];
                    }
                } catch (e) {
                    console.error('解析结果附件失败：', e);
                    resultAttachmentList = [];
                }

                return {
                    ...item,
                    serviceAttachmentList,
                    resultAttachmentList,
                    // 确保必填字段有默认值
                    planQty: item.planQty || '',
                    finishQty: item.finishQty || ''
                };
            });

            // 填充费用数据（保留所有字段）
            feeTableData.value = data.vasOrderFeeList.map(fee => ({
                id: fee.id || '',
                vasOrderId: fee.vasOrderId || '',
                feeTypeId: fee.feeTypeId || '',
                unitPrice: fee.unitPrice || 0,
                totalFee: fee.totalFee || 0,
                currency: fee.currency || '',
                statusId: fee.statusId || 0,
                remark: fee.remark || '',
                createWay: fee.createWay || 20,
                createdBy: fee.createdBy || '',
                createdTime: fee.createdTime || '',
                updatedBy: fee.updatedBy || '',
                updatedTime: fee.updatedTime || ''
            }));

            // 激活第一个折叠项
            if (vasOrderItemList.value.length > 0) {
                activeNames.value = [vasOrderItemList.value[0].id || 'item-0'];
            }

            // 初始化服务项目表单引用
            nextTick(() => {
                itemFormRefs.value = vasOrderItemList.value.map(() => ref(null));
            });
        } else {
            smartAlert(res.msg || '获取详情失败', false);
        }
    } catch (error) {
        console.error('获取详情失败：', error);
        smartAlert('获取详情异常，请重试', false);
    } finally {
        loading.close();
    }
};

/**
 * 页面挂载时加载数据
 */
onMounted(async () => {
    // 加载下拉框数据（和新增页面一致）
    const apiTasks = [
        { key: "关联业务类型", api: getVasOrderRelatedBizTypeEnumApi(), handleSuccess: (data) => (relatedBizTypeOptions.value = data || []) },
        { key: "仓库", api: getWhWarehouseApi(), handleSuccess: (data) => (warehouseOptions.value = data || []) },
        { key: "客户", api: getCustomerLikeQueryApi({ keyword: "*" }), handleSuccess: (data) => (customerOptions.value = data.map((item) => ({ id: item.code, label: `${item.code}(${item.name})`, value: item.id }))) },
        { key: "服务类型", api: getVasServiceTypeListApi(), handleSuccess: (data) => (serviceTypeOptions.value = data || []) },
        { key: "费用类型", api: getVasOrderFeeTypeEnumApi(), handleSuccess: (data) => (feeTypeOptions.value = data || []) },
        { key: "货币类型", api: getCurrencyEnumApi(), handleSuccess: (data) => (currencyOptions.value = data || []) },
        { key: "费用创建类型", api: getVasOrderFeeCreateTypeEnumApi(), handleSuccess: (data) => (feeCreateTypeOptions.value = data || []) },
        { key: "服务单位", api: getVasServiceTypeUnitEnumApi(), handleSuccess: (data) => (unitOptions.value = data || []) },
        { key: "执行人", api: getUserOperatorUserListApi(), handleSuccess: (data) => { operatorUserOptions.value = data || []; } },
    ];

    // 并行请求下拉框数据
    const dropdownResults = await Promise.allSettled(apiTasks.map((task) => task.api));
    dropdownResults.forEach((result, index) => {
        const task = apiTasks[index];
        if (result.status === "fulfilled") {
            const res = result.value;
            if (res.success !== false) task.handleSuccess(res.data);
            else smartAlert(`【${task.key}】数据加载失败：${res.msg}`, false);
        } else {
            smartAlert(`【${task.key}】接口请求失败`, false);
            console.error(`[${task.key}] error:`, result.reason);
        }
    });

    // 加载编辑详情（如果有ID）
    if (props.id) {
        await getDetail();
    } else {
        // 无ID时默认添加一个服务项目
        addServiceItem();
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
}

.btns {
    width: 100% !important;
    padding: 10px 0;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.el-form) {
    width: 1150px !important;
}

:deep(.el-input) {
    width: 100% !important;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ccc;
    margin-top: 20px;
    padding: 8px 0 10px 15px;
}

.section-title {
    font-size: 22px;
    font-weight: 550;
    margin-right: 15px;
}

.section-action {
    margin-left: auto;
    padding-right: 15px;
}

/* 折叠面板样式 */
.item-collapse {
    width: 1150px;
    margin-bottom: 20px;
}

.collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.collapse-title {
    font-size: 18px;
    font-weight: 600;
    margin-left: 15px;
}

.item-form {
    padding: 15px;
    // background-color: #fafafa;
    border-radius: 4px;
}

/* 附件样式 */
.attachment-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.attachment-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.attachment-item {
    font-size: 13px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 8px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #eee;
}

.file-link {
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 8px;
}

.bottom-space {
    height: 250px;
}

:deep(.el-collapse-item__content) {
    padding: 0 !important;
}

// :deep(.el-collapse-item__header) {
//     border: none !important;
// }


/* 适配小屏幕 */
@media (max-width: 1200px) {

    :deep(.el-form),
    .item-collapse {
        width: 100% !important;
    }

    .el-row {
        display: flex;
        flex-wrap: wrap;
    }

    .el-col {
        flex: 1 1 100%;
        max-width: 100% !important;
        margin-bottom: 10px;
    }
}
</style>