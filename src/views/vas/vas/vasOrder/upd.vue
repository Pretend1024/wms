<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
            <p>{{ $t('vas_vas_vasOrder_upd.basicInfo') }}</p> <!-- 基础信息 -->
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <el-row>
                    <!-- 基础信息字段恢复为新增页面的下拉框样式，保留所有交互 -->
                    <el-col :span="8">
                        <el-form-item :label="getLabel('vasOrderNo')" prop="vasOrderNo" class="compact-item">
                            <el-input v-model.trim="formData.vasOrderNo" :placeholder="getPlaceholder('vasOrderNo')"
                                disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('vasTitle')" prop="vasTitle">
                            <el-input v-model.trim="formData.vasTitle" :placeholder="getPlaceholder('vasTitle')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('relatedBizType')" prop="relatedBizType">
                            <el-select v-model="formData.relatedBizType" :placeholder="getPlaceholder('relatedBizType')"
                                clearable disabled>
                                <el-option v-for="item in relatedBizTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('relatedBizNo')" prop="relatedBizNo">
                            <el-input v-model.trim="formData.relatedBizNo"
                                :placeholder="getPlaceholder('relatedBizNo')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('orgId')" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" disabled />
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
                        <el-form-item :label="getLabel('expectFinishTime')" prop="expectFinishTime">
                            <el-date-picker v-model="formData.expectFinishTime" type="date"
                                :placeholder="getPlaceholder('expectFinishTime')" format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('relatedWorkOrderId')" prop="relatedWorkOrderId">
                            <el-input v-model.trim="formData.relatedWorkOrderId"
                                :placeholder="getPlaceholder('relatedWorkOrderId')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('vasDesc')" prop="vasDesc">
                            <el-input type="textarea" v-model="formData.vasDesc"
                                :placeholder="getPlaceholder('vasDesc')" :rows="3" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 服务项目信息 标题 + 添加明细按钮 -->
            <div class="section-header">
                <div class="section-title">{{ $t('vas_vas_vasOrder_upd.serviceItemInfo') }}</div> <!-- 服务项目信息 -->
                <div class="section-action">
                    <el-button type="primary" size="small" @click="addServiceItem">{{
                        $t('vas_vas_vasOrder_upd.addDetail') }}</el-button> <!-- 添加明细 -->
                </div>
            </div>

            <!-- 服务项目折叠面板 -->
            <el-collapse v-model="activeNames" class="item-collapse" border>
                <el-collapse-item v-for="(item, index) in vasOrderItemList" :key="item.id || `item-${index}`">
                    <!-- 折叠面板标题（包含删除按钮） -->
                    <template #title>
                        <div class="collapse-header">
                            <span class="collapse-title">
                                {{ index + 1 + "." }}
                                {{ item.serviceTypeName || $t('vas_vas_vasOrder_upd.noServiceTypeSelected') }}
                                <!-- 未选择服务类型 -->
                                <span v-if="item.sku"> - {{ item.sku }}</span>
                                <span v-if="item.planQty"> ({{ $t('vas_vas_vasOrder_upd.planQty') }}: {{ item.planQty
                                    }}{{ item.unit }})</span> <!-- 计划数量 -->
                            </span>
                            <el-button type="text" style="margin-right: 10px;" size="mini"
                                @click.stop="deleteServiceItem(index)">
                                {{ $t('vas_vas_vasOrder_upd.delete') }} <!-- 删除 -->
                            </el-button>
                        </div>
                    </template>

                    <!-- 折叠面板内容：服务项目表单 -->
                    <el-form :model="item" label-width="115px" class="item-form" style="width: 98% !important;"
                        :rules="itemFormRules" ref="itemFormRefs[index]">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.serviceType') + ':'" prop="serviceTypeId"
                                    required>
                                    <!-- 服务类型 -->
                                    <el-select v-model="item.serviceTypeId"
                                        :placeholder="$t('vas_vas_vasOrder_upd.selectServiceType')" clearable filterable
                                        @change="(val) => onServiceTypeChange(item, val)"> <!-- 请选择服务类型 -->
                                        <el-option v-for="option in serviceTypeOptions" :key="option.id"
                                            :label="option.name" :value="option.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.planQty') + ':'" prop="planQty" required>
                                    <!-- 计划数量 -->
                                    <el-input v-model.number="item.planQty"
                                        :placeholder="$t('vas_vas_vasOrder_upd.inputPlanQty')" v-number />
                                    <!-- 请输入计划数量 -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.unit') + ':'" prop="unit" required>
                                    <!-- 单位 -->
                                    <el-select v-model="item.unit" :placeholder="$t('vas_vas_vasOrder_upd.selectUnit')"
                                        clearable filterable disabled> <!-- 请选择单位 -->
                                        <el-option v-for="option in unitOptions" :key="option.name" :label="option.name"
                                            :value="option.name" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.sku') + ':'" prop="sku"> <!-- SKU -->
                                    <el-input v-model="item.sku" @blur="onSkuBlur(item)"
                                        :placeholder="$t('vas_vas_vasOrder_upd.inputSku')">
                                        <!-- 请输入SKU -->
                                        <template #append>
                                            <el-button icon="More" @click="openSkuDialog(index)" />
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.serviceAttachment') + ':'"> <!-- 服务附件 -->
                                    <div class="attachment-container">
                                        <div class="attachment-list"
                                            v-if="item.serviceAttachmentList && item.serviceAttachmentList.length > 0">
                                            <div v-for="(file, idx) in item.serviceAttachmentList"
                                                :key="`service-${index}-${idx}`" class="attachment-item">
                                                <a :href="file.url" target="_blank" class="file-link"
                                                    :title="file.name">
                                                    {{ file.name.length > 35 ? file.name.slice(0, 35) + '...' :
                                                        file.name }}
                                                </a>
                                                <el-button type="danger" size="small" :icon="Close" circle
                                                    @click.stop="deleteAttachment(item.serviceAttachmentList, idx)"
                                                    text />
                                            </div>
                                        </div>

                                        <el-upload :auto-upload="true"
                                            :http-request="(params) => handleServiceAttachmentUpload(params, item)"
                                            :before-upload="beforeUpload" multiple :show-file-list="false"
                                            class="upload-btn-wrap">
                                            <el-button type="primary" size="small" plain>
                                                {{ (item.serviceAttachmentList && item.serviceAttachmentList.length > 0)
                                                    ? $t('vas_vas_vasOrder_upd.continueUpload') :
                                                    $t('vas_vas_vasOrder_upd.uploadServiceAttachment') }}
                                                <!-- + 继续上传 / 上传服务附件 -->
                                            </el-button>
                                        </el-upload>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.executor') + ':'" prop="executeBy">
                                    <!-- 执行人 -->
                                    <el-input v-model="item.executeBy"
                                        :placeholder="$t('vas_vas_vasOrder_upd.inputExecutor')" />
                                    <!-- 请输入执行人 -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.startProcessingTime') + ':'"
                                    prop="startTime">
                                    <!-- 开始处理时间 -->
                                    <el-date-picker v-model="item.startTime" type="datetime"
                                        :placeholder="$t('vas_vas_vasOrder_upd.selectStartTime')"
                                        format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                                    <!-- 选择开始时间 -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.completionTime') + ':'"
                                    prop="finishTime"> <!-- 完成时间 -->
                                    <el-date-picker v-model="item.finishTime" type="datetime"
                                        :placeholder="$t('vas_vas_vasOrder_upd.selectCompletionTime')"
                                        format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                                    <!-- 选择完成时间 -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.completedQty') + ':'" prop="finishQty">
                                    <!-- 完成数量 -->
                                    <el-input v-model.number="item.finishQty"
                                        :placeholder="$t('vas_vas_vasOrder_upd.inputCompletedQty')" v-number />
                                    <!-- 请输入完成数量 -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.resultAttachment') + ':'"> <!-- 结果附件 -->
                                    <div class="attachment-container">
                                        <div class="attachment-list"
                                            v-if="item.resultAttachmentList && item.resultAttachmentList.length > 0">
                                            <div v-for="(file, idx) in item.resultAttachmentList"
                                                :key="`result-${index}-${idx}`" class="attachment-item">
                                                <a :href="file.url" target="_blank" class="file-link"
                                                    :title="file.name">
                                                    {{ file.name.length > 35 ? file.name.slice(0, 35) + '...' :
                                                        file.name }}
                                                </a>
                                                <el-button type="danger" size="small" :icon="Close" circle
                                                    @click.stop="deleteAttachment(item.resultAttachmentList, idx)"
                                                    text />
                                            </div>
                                        </div>

                                        <el-upload :auto-upload="true"
                                            :http-request="(params) => handleResultAttachmentUpload(params, item)"
                                            :before-upload="beforeUpload" multiple :show-file-list="false"
                                            class="upload-btn-wrap">
                                            <el-button type="primary" size="small" plain>
                                                {{ (item.resultAttachmentList && item.resultAttachmentList.length > 0) ?
                                                    $t('vas_vas_vasOrder_upd.continueUpload') :
                                                    $t('vas_vas_vasOrder_upd.uploadResultAttachment')
                                                }}
                                                <!-- + 继续上传 / 上传结果附件 -->
                                            </el-button>
                                        </el-upload>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item :label="$t('vas_vas_vasOrder_upd.remark') + ':'" prop="remark">
                                    <!-- 备注 -->
                                    <el-input type="textarea" v-model="item.remark"
                                        :placeholder="$t('vas_vas_vasOrder_upd.inputRemark')" :rows="2" />
                                    <!-- 请输入备注 -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-collapse-item>
            </el-collapse>

            <!-- 费用信息部分（保留新增页面所有功能） -->
            <div class="section-header">
                <div class="section-title">{{ $t('vas_vas_vasOrder_upd.feeInfo') }}</div> <!-- 费用信息 -->
                <div class="section-action">
                    <el-button type="primary" @click="fetchFeeData" size="small" :loading="isFetchingFee">{{
                        $t('vas_vas_vasOrder_upd.systemCalculate') }}</el-button> <!-- 系统计算 -->
                </div>
            </div>

            <el-row class="table-container">
                <el-col :span="24">
                    <generalAddTable ref="feeTableRef" :columns="feeTableColumns" :data="feeTableData"
                        :addRowDefaults="[{ prop: 'createWay', value: 20 }]">
                        <template #feeSubTypeId="{ row }">
                            <el-select v-model="row.feeSubTypeId"
                                :placeholder="$t('vas_vas_vasOrder_upd.selectFeeType')" clearable filterable>
                                <!-- 请选择费用类型 -->
                                <el-option v-for="item in feeTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #feeAmount="{ row }">
                            <el-input v-model.number="row.feeAmount"
                                :placeholder="$t('vas_vas_vasOrder_upd.inputTotalFee')" v-number /> <!-- 请输入总费用 -->
                        </template>
                        <template #currency="{ row }">
                            <el-select v-model="row.currency"
                                :placeholder="$t('vas_vas_vasOrder_upd.selectCurrencyType')" clearable filterable>
                                <!-- 请选择货币类型 -->
                                <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </template>
                        <template #createWay="{ row }">
                            <el-select v-model="row.createWay"
                                :placeholder="$t('vas_vas_vasOrder_upd.selectCreateType')" clearable disabled>
                                <!-- 请选择创建类型 -->
                                <el-option v-for="item in feeCreateTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>
                        <template #remark="{ row }">
                            <el-input v-model="row.remark" :placeholder="$t('vas_vas_vasOrder_upd.inputFeeRemark')"
                                :disabled="row.createWay == 10" /> <!-- 请输入费用备注 -->
                        </template>
                    </generalAddTable>
                </el-col>
            </el-row>

            <!-- 底部占位 -->
            <div class="bottom-space"></div>
            <!-- 粘性按钮 -->
            <div class="btns">
                <el-button type="primary" @click="handleSave">{{ $t('vas_vas_vasOrder_upd.save') }}</el-button>
                <!-- 保存 -->
                <el-button @click="handleClose">{{ $t('vas_vas_vasOrder_upd.close') }}</el-button> <!-- 关闭 -->
            </div>
        </div>

        <!-- SKU选择弹窗 -->
        <singleSkuSelectDialog v-model:visible="skuDialogVisible" :customerId="formData.customerId"
            @confirm="handleSkuConfirm" />
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
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';

import { getUserOperatorUserListApi } from '@/api/sysApi/user.js'
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { ref, reactive, onMounted, nextTick, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import generalAddTable from '@/components/table/generalAddTable.vue';
import { ElLoading, ElMessage } from 'element-plus';
import { Close } from '@element-plus/icons-vue'
import tagsStore from '@/store/tags.js';
import { useRefreshStore } from '@/store/refresh.js';
import { smartAlert } from '@/utils/genericMethods.js';
import { getLabel, getPlaceholder, getButtonText } from '@/utils/i18n/i18nLabels.js';
import { uploadApi } from '@/api/baseApi/index.js'
import singleSkuSelectDialog from './singleSkuSelectDialog.vue';

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


// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({ id: item.code, label: `${item.code}(${item.name})`, value: item.id }))
};
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
    { label: '费用类型', prop: 'feeSubTypeId', required: true, slot: 'feeSubTypeId', width: 200 },
    { label: '费用金额', prop: 'feeAmount', required: true, slot: 'feeAmount', width: 150 },
    { label: '货币类型', prop: 'currency', required: true, slot: 'currency', width: 180 },
    { label: '创建类型', prop: 'createWay', required: true, slot: 'createWay', width: 180 },
    { label: '费用备注', prop: 'remark', slot: 'remark', width: 280 }
]);

/**
 * 保存编辑数据
 */
const handleSave = async () => {
    try {
        // 1. 验证基础信息表单
        await formRef.value.validate();

        // 3. 获取费用表格数据
        const feeTableDataLocal = feeTableRef.value.getTableData();
        if (feeTableDataLocal.length === 0) {
            ElMessage.warning('请添加费用信息');
            return;
        }

        // 4. 格式化服务项目数据（处理附件）
        const formatItemList = vasOrderItemList.value.map(item => {
            const serviceAttachments = item.serviceAttachmentList || [];
            const resultAttachments = item.resultAttachmentList || [];

            return {
                ...item,
                // 附件序列化为JSON字符串
                serviceAttachment: serviceAttachments.length > 0 ? JSON.stringify(serviceAttachments.map(file => ({ name: file.name, url: file.url, size: file.size }))) : null,
                resultAttachment: resultAttachments.length > 0 ? JSON.stringify(resultAttachments.map(file => ({ name: file.name, url: file.url, size: file.size }))) : null,
                // 移除临时字段
                serviceAttachmentList: undefined,
                resultAttachmentList: undefined
            };
        });

        // 5. 构造提交数据
        const submitData = {
            id: props.id, // 编辑必填ID
            ...formData,
            vasOrderItemList: formatItemList,
            vasOrderFeeList: (feeTableDataLocal.length === 1 && Object.keys(feeTableDataLocal[0]).length === 1 && 'createWay' in feeTableDataLocal[0]) ? [] : feeTableDataLocal
        };

        console.log('提交数据：', submitData);

        // 6. 调用编辑接口
        const res = await updVasOrderByIdApi(submitData);
        smartAlert(res.msg, res.success, 1000);

        if (res.success) {
            refreshStore.shouldRefreshAddServiceList = true;
            // 关闭当前标签页
            useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
                item => item.path !== route.fullPath
            );
            router.push('/vas/vas/vasOrder/list');
        }
    } catch (error) {
        console.error('保存失败：', error);
        smartAlert('保存失败，请检查表单填写', false, 1000);
    }
};

/**
 * 关闭页面
 */
const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push('/vas/vas/vasOrder/list');
};

/**
 * 系统计算费用（和新增页面逻辑一致）
 */
const fetchFeeData = async () => {
    try {
        // 校验服务项目数据
        if (vasOrderItemList.value.length === 0) {
            ElMessage.warning('请先添加服务项目信息');
            return;
        }

        isFetchingFee.value = true;
        const loading = ElLoading.service({ lock: true, target: ".contentDiv", text: 'loading...' });

        // 构造接口请求参数
        const requestParams = {
            vasOrderItemVOList: vasOrderItemList.value.map(item => ({
                serviceTypeId: item.serviceTypeId,
                planQty: item.planQty,
                unit: item.unit,
                sku: item.sku
            })),
            vasOrderFeeVOList: feeTableRef.value.getTableData().filter(fee => fee.feeSubTypeId),
        };

        // 调用费用计算接口
        const res = await calculateFeeApi(requestParams);

        if (res.success && res.data) {
            // 清空现有费用数据
            feeTableData.value = [];
            await nextTick();

            // 用接口返回结果覆盖费用表格数据
            feeTableData.value = res.data.vasOrderFeeVOList.map(feeItem => ({
                id: feeItem.id || '', // 保留原有ID（编辑场景）
                feeSubTypeId: feeItem.feeSubTypeId || '',
                unitPrice: feeItem.unitPrice || 0,
                feeAmount: feeItem.feeAmount || 0,
                currency: feeItem.currency || '',
                statusId: feeItem.statusId || 0,
                remark: feeItem.remark || '',
                createWay: feeItem.createWay || 20,
                createdBy: feeItem.createdBy || '',
                createdTime: feeItem.createdTime || '',
                updatedBy: feeItem.updatedBy || '',
                updatedTime: feeItem.updatedTime || ''
            }));

            ElMessage.success('费用计算成功');
        } else {
            ElMessage.error(res.msg || '费用计算失败');
        }

        loading.close();
    } catch (error) {
        console.error('费用计算接口调用失败：', error);
        ElMessage.error('费用计算异常，请重试');
        if (error.message) {
            ElMessage.error(`错误信息：${error.message}`);
        }
    } finally {
        isFetchingFee.value = false;
    }
};

/**
 * 添加服务项目明细
 */
const addServiceItem = () => {
    const newItem = {
        id: '',
        vasOrderId: props.id,
        serviceTypeId: '',
        serviceTypeCode: '',
        serviceTypeName: '',
        statusId: 0,
        planQty: '',
        unit: '',
        remark: '',
        sku: '',
        skuName: '',
        serviceAttachment: '',
        resultAttachment: '',
        startTime: '',
        finishTime: '',
        finishQty: '',
        feeAmount: 0,
        executeBy: '',
        createTime: '',
        updateTime: '',
        createdBy: '',
        updatedBy: '',
        serviceAttachmentList: [], // 临时存储服务附件
        resultAttachmentList: []  // 临时存储结果附件
    };

    vasOrderItemList.value.push(newItem);

    // 激活新增的折叠项
    nextTick(() => {
        const newIndex = vasOrderItemList.value.length - 1;
        activeNames.value = [`item-${newIndex}`];
        // 初始化表单引用
        itemFormRefs.value[newIndex] = ref(null);
    });
};

/**
 * 删除服务项目明细
 */
const deleteServiceItem = (index) => {
    // 移除数据
    vasOrderItemList.value.splice(index, 1);
    // 移除对应的表单引用
    itemFormRefs.value.splice(index, 1);
    // 更新激活状态
    if (activeNames.value.length > 0 && activeNames.value[0] === `item-${index}`) {
        activeNames.value = vasOrderItemList.value.length > 0 ? ['item-0'] : [];
    }
    ElMessage.success('服务项目已删除');
};

/**
 * 服务类型改变事件（填充单位）
 */
const onServiceTypeChange = (row, val) => {
    if (!val) {
        row.unit = '';
        row.serviceTypeName = '';
        return;
    }
    const selected = serviceTypeOptions.value.find(item => item.id === val);
    if (selected) {
        row.serviceTypeName = selected.name;
        row.serviceTypeCode = selected.code;
        // 填充默认单位
        const defaultUnit = selected.defaultUnit ?? selected.default_unit ?? selected.unit ?? '';
        if (defaultUnit) {
            row.unit = defaultUnit;
        }
    }
};

/**
 * SKU输入框失焦事件
 */
async function onSkuBlur(row) {
    if (!formData.customerId) {
        ElMessage.warning('请先选择客户');
        row.sku = '';
        row.skuName = '';
        return;
    }
    if (!row.sku) {
        row.skuName = '';
        return;
    }
    try {
        const customer = customerOptions.value.find(item => item.value === formData.customerId);
        const res = await getSkuSkuDataBySkuApi({ customerCode: customer.id, sku: row.sku });
        if (res.success && res.data) {
            row.skuName = res.data.nameCn || res.data.name || '';
        } else {
            smartAlert(res.msg || 'SKU 无效，请重新输入', false);
            row.sku = '';
            row.skuName = '';
        }
    } catch (e) {
        smartAlert(e.msg || '获取SKU信息失败', false);
    }
}

/**
 * 打开SKU选择弹窗
 */
function openSkuDialog(index) {
    if (!formData.customerId) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    currentRowIndex.value = index; // 存储当前行索引
    skuDialogVisible.value = true;
}

/**
 * 确认选择SKU
 */
async function handleSkuConfirm(selectedSku) {
    if (!selectedSku || currentRowIndex.value === -1) return;

    // 回填SKU信息到当前行
    const targetRow = vasOrderItemList.value[currentRowIndex.value];
    targetRow.sku = selectedSku.sku;
    targetRow.skuName = selectedSku.nameCn || selectedSku.name || '';

    // 重置当前行索引
    currentRowIndex.value = -1;
    skuDialogVisible.value = false;
}

/**
 * 附件上传前置校验
 */
const beforeUpload = (file) => {
    // 可添加文件大小、类型校验
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
        ElMessage.error('上传文件大小不能超过 20MB!');
        return false;
    }
    return true;
};

/**
 * 服务附件上传
 */
const handleServiceAttachmentUpload = async (params, row) => {
    const file = params.file;
    try {
        if (!row.serviceAttachmentList || !Array.isArray(row.serviceAttachmentList)) {
            row.serviceAttachmentList = [];
        }

        // 校验重复文件
        const isDuplicate = row.serviceAttachmentList.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传，无需重复添加`);
            params.onSuccess && params.onSuccess();
            return;
        }

        // 调用上传接口
        const res = await uploadApi(file, { path: 'temp' });

        if (res.success && res.data) {
            row.serviceAttachmentList.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage({
                message: 'Success',
                type: 'success',
            })
            params.onSuccess && params.onSuccess();
        } else {
            smartAlert(res.msg || '服务附件上传失败', false);
            params.onError && params.onError();
        }
    } catch (error) {
        console.error('服务附件上传失败：', error);
        smartAlert(error.msg || '服务附件上传失败', false);
        params.onError && params.onError();
    }
};

/**
 * 结果附件上传
 */
const handleResultAttachmentUpload = async (params, row) => {
    const file = params.file;
    try {
        if (!row.resultAttachmentList || !Array.isArray(row.resultAttachmentList)) {
            row.resultAttachmentList = [];
        }

        // 校验重复文件
        const isDuplicate = row.resultAttachmentList.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传，无需重复添加`);
            params.onSuccess && params.onSuccess();
            return;
        }

        // 调用上传接口
        const res = await uploadApi(file, { path: 'temp' });

        if (res.success && res.data) {
            row.resultAttachmentList.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage({
                message: 'Success',
                type: 'success',
            })
            params.onSuccess && params.onSuccess();
        } else {
            smartAlert(res.msg || '服务附件上传失败', false);
            params.onError && params.onError();
        }
    } catch (error) {
        console.error('结果附件上传失败：', error);
        smartAlert(error.msg || '服务附件上传失败', false);
        params.onError && params.onError();
    }
};

/**
 * 删除附件
 */
const deleteAttachment = (attachmentList, index) => {
    attachmentList.splice(index, 1);
    ElMessage.success('附件已删除');
};

/**
 * 获取编辑详情数据
 */
const getDetail = async () => {
    const loading = ElLoading.service({ lock: true, target: ".contentDiv", text: "加载中..." });
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
                feeSubTypeId: fee.feeSubTypeId || '',
                unitPrice: fee.unitPrice || 0,
                feeAmount: fee.feeAmount || 0,
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
    // 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    // 处理公司数据
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);

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
    align-items: flex-start;
}

.attachment-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

.attachment-item {
    font-size: 13px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #e4e7ed;

    .el-button {
        margin-left: 10px;
        padding: 4px;
        min-height: auto;
    }
}

.upload-btn-wrap {
    margin-top: 2px;
    display: inline-block;
}

.file-link {
    color: #409EFF;
    text-decoration: none;
    /* 去掉下划线，悬停再显示 */
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 8px;

    &:hover {
        text-decoration: underline;
    }
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