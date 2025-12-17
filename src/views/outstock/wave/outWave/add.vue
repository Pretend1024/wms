<template>
    <!-- 模板部分：保持原有结构，仅新增模块备注 -->
    <div class="viewArea">
        <!-- 引入弹窗组件 -->
        <WaveTemplateDialog v-model:visible="templateDialogVisible" @confirm="handleTemplateSelect" />
        <div class="contentDiv flex-container">

            <!-- 核心表单：绑定表单数据与校验引用 -->
            <el-form :model="formData" ref="formRef" label-width="110px" :rules="rules">
                <!-- 1. 订单范围筛选区：仓库、客户、时间、渠道等订单维度条件 -->
                <p class="scopeTitle">1.订单范围</p>
                <div style="width: 100%;padding-left: 780px;margin-bottom: 8px;">
                    <el-button type="primary" @click="templateDialogVisible = true">
                        选择波次模板
                    </el-button>
                </div>
                <el-row class="order-range">
                    <!-- 指定公司 -->
                    <el-col :span="12">
                        <el-form-item label="指定公司" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange" />
                        </el-form-item>
                    </el-col>
                    <!-- 指定仓库：多选中下拉，支持筛选/清空 -->
                    <el-col :span="12">
                        <el-form-item label="指定仓库" prop="warehouseCodes">
                            <el-select v-model="formData.warehouseCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1">
                                <el-option v-for="(item, index) in warehouseOptions" :label="item.label"
                                    :value="item.value" :key="index" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 指定客户：多选中下拉，显示「编码(名称)」格式 -->
                    <el-col :span="12">
                        <el-form-item label="指定客户" prop="customerCodes">
                            <el-select v-model="formData.customerCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.code"
                                    :label="item.code + '(' + item.name + ')'" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 订单时间范围：开始时间（必填） -->
                    <el-col :span="12">
                        <el-form-item label="订单开始时间" prop="orderStartTime">
                            <el-date-picker v-model="formData.orderStartTime" type="datetime" placeholder="选择开始时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable required />
                        </el-form-item>
                    </el-col>
                    <!-- 订单时间范围：结束时间（必填） -->
                    <el-col :span="12">
                        <el-form-item label="订单结束时间" prop="orderEndTime">
                            <el-date-picker v-model="formData.orderEndTime" type="datetime" placeholder="选择结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable required />
                        </el-form-item>
                    </el-col>
                    <!-- 业务类型 -->
                    <el-col :span="12">
                        <el-form-item label="业务类型">
                            <el-select v-model="formData.businessId">
                                <el-option v-for="(item) in businessOptions" :label="item.label" :value="item.value"
                                    :key="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 发货渠道：多选中下拉，最多显示2个选中标签 -->
                    <el-col :span="12">
                        <el-form-item label="发货渠道" prop="shipwayCodes">
                            <el-select v-model="formData.shipwayCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="2" popper-class="multi-column-select">
                                <el-option v-for="(item, index) in shipwayOptions" :label="item.name" :value="item.code"
                                    :key="index" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 渠道区分开关：开启后同一波次订单需同渠道 -->
                    <el-col :span="8">
                        <el-form-item>
                            <el-checkbox v-model="formData.isDistinguishShipway" label="同渠道(一个波次内订单必须相同渠道)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider />
                <!-- 2. 库存范围筛选区：引入外部库存筛选组件 -->
                <p class="scopeTitle">2.库存范围</p>
                <inventoryRangeForm ref="inventoryRangeFormRef" :formData="inventoryData" />

                <el-divider />
                <!-- 3. 波次类型配置区：表格配置各类型订单数量范围及启用状态 -->
                <p class="scopeTitle">3.波次类型</p>
                <el-table :data="waveTypeList" border style="width: 100%" :cell-style="{ 'vertical-align': 'middle' }">
                    <el-table-column prop="typeName" label="类型" width="120" />
                    <el-table-column label="订单数量最小值" width="180">
                        <template #default="scope">
                            <el-input placeholder="最小值" v-model.number="scope.row.min" :min="1" type="number" />
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量最大值" width="180">
                        <template #default="scope">
                            <el-input placeholder="最大值" v-model.number="scope.row.max" :min="1" type="number" />
                        </template>
                    </el-table-column>
                    <el-table-column label="是否选中" width="100">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.checked" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <!-- 操作按钮区：保存（提交表单）、关闭（返回列表） -->
            <div class="btns">
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button type="primary" @click="handleSaveAndAdd">{{ getButtonText('saveAndAddTemplate')
                }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="新增波次">
// 1. 基础依赖导入：按「Vue API → 接口 → 工具 → 组件 → 状态/路由」分类
import { ref, reactive, defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

// 接口导入：基础数据接口、波次业务接口
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getProductShipwayListApi } from '@/api/productApi/shipway.js';
import { getOutstockWaveTypeEnumApi, addOutstockWaveTaskApi } from '@/api/outstockApi/wave.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js';

// 工具/常量导入：国际化、通用方法
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

// 组件/路由/状态导入：外部组件、路由实例、标签页/刷新状态管理
import inventoryRangeForm from '@/views/outstock/order/outOrder/inventoryRangeForm.vue';
import router from '@/router/index.js';
import tagsStore from '@/store/tags.js';
import { useRefreshStore } from '@/store/refresh.js';

import WaveTemplateDialog from './waveTemplateDialog.vue';

// 控制弹窗显示
const templateDialogVisible = ref(false);
// 关键：定义库存范围数据，结构与inventoryRangeForm组件的formData完全对齐
const inventoryData = reactive({
    inOrderIds: null, // 入库单（字符串，多值用逗号分隔）
    onShelfStartTime: null, // 上架开始时间（YYYY-MM-DD）
    onShelfEndTime: null, // 上架结束时间（YYYY-MM-DD）
    zoneCodes: null, // 库区编码（字符串，多值用逗号分隔）
    locationCodes: null, // 库位编码（字符串，多值用逗号分隔）
    excludeZoneCodes: null, // 排除库区（字符串，多值用逗号分隔）
    excludeLocationCodes: null, // 排除库位（字符串，多值用逗号分隔）
    businessId: null, // 业务类型
    priorityList: [] // 分配优先级ID数组（与子组件排序对应）
});

const rules = reactive({
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    warehouseCodes: [{ required: true, message: '请选择仓库', trigger: 'change' }],
})

// 接收弹窗返回的选中数据，并处理成表单提交前格式
const handleTemplateSelect = (selectedData) => {
    if (!selectedData) return; // 防止无数据时报错
    console.log('选中模板数据：', selectedData); // 调试日志

    // 1. 处理「数组类型字段」：模板中存储的是JSON字符串，需转成数组（与formData格式对齐）
    formData.warehouseCodes = selectedData.warehouseCodes
        ? JSON.parse(selectedData.warehouseCodes)
        : []; // 仓库编码：数组格式

    formData.customerCodes = selectedData.customerCodes
        ? JSON.parse(selectedData.customerCodes)
        : []; // 客户编码：数组格式

    formData.shipwayCodes = selectedData.shipwayCodes
        ? JSON.parse(selectedData.shipwayCodes)
        : []; // 发货渠道：数组格式
    formData.orgId = selectedData.orgId ? [selectedData.orgId] : []; // 公司ID：数组格式
    // 2. 处理「订单时间字段」：直接复用模板时间（格式与date-picker输出一致：YYYY-MM-DD HH:mm:ss）
    formData.orderStartTime = selectedData.orderStartTime || null;
    formData.orderEndTime = selectedData.orderEndTime || null;

    formData.isDistinguishShipway = selectedData.isDistinguishShipway || false; // 渠道区分：默认false
    formData.businessId = selectedData.businessId || null; // 业务类型：默认null

    // 4. 处理「波次类型配置」：按typeName匹配模板的min/max，与原表单波次逻辑完全对齐
    waveTypeList.forEach(item => {
        switch (item.typeName) {
            case '单品单件':
                // 1. 先获取模板中的min/max值（兼容模板中字段不存在的情况）
                const singleOneMin = selectedData.orderQtyMin1;
                const singleOneMax = selectedData.orderQtyMax1;
                // 2. 核心判断：若两者均为0 → 不选中；否则回显值并选中
                if (singleOneMin === 0 && singleOneMax === 0) {
                    item.checked = false; // 都为0时不选中
                    // 保持原默认值（避免被0覆盖）
                    item.min = 10;
                    item.max = 10000;
                } else {
                    // 模板有值用模板值，无值用默认值
                    item.min = singleOneMin ?? 10;
                    item.max = singleOneMax ?? 10000;
                    item.checked = true; // 非全0时选中
                }
                break;

            case '单品多件':
                const singleMultiMin = selectedData.orderQtyMin2;
                const singleMultiMax = selectedData.orderQtyMax2;
                if (singleMultiMin === 0 && singleMultiMax === 0) {
                    item.checked = false;
                    item.min = 10;
                    item.max = 1000;
                } else {
                    item.min = singleMultiMin ?? 10;
                    item.max = singleMultiMax ?? 1000;
                    item.checked = true;
                }
                break;

            case '杂品单件':
                const mixOneMin = selectedData.orderQtyMin3;
                const mixOneMax = selectedData.orderQtyMax3;
                if (mixOneMin === 0 && mixOneMax === 0) {
                    item.checked = false;
                    item.min = 20;
                    item.max = 20;
                } else {
                    item.min = mixOneMin ?? 20;
                    item.max = mixOneMax ?? 20;
                    item.checked = true;
                }
                break;

            case '杂品多件':
                const mixMultiMin = selectedData.orderQtyMin4;
                const mixMultiMax = selectedData.orderQtyMax4;
                if (mixMultiMin === 0 && mixMultiMax === 0) {
                    item.checked = false;
                    item.min = 20;
                    item.max = 20;
                } else {
                    item.min = mixMultiMin ?? 20;
                    item.max = mixMultiMax ?? 20;
                    item.checked = true;
                }
                break;

            default:
                item.checked = false;
                break;
        }
    });

    // 3. 核心：库存范围数据处理（按子组件字段格式解析）
    // 3.1 基础库存字段（字符串类型，多值用逗号分隔）
    inventoryData.inOrderIds = selectedData.inOrderIds || null; // 入库单：直接赋值字符串
    inventoryData.zoneCodes = selectedData.zoneCodes || null; // 库区：直接赋值字符串（子组件用逗号分隔多值）
    inventoryData.locationCodes = selectedData.locationCodes || null; // 库位：同上
    inventoryData.excludeZoneCodes = selectedData.excludeZoneCodes || null; // 排除库区：同上
    inventoryData.excludeLocationCodes = selectedData.excludeLocationCodes || null; // 排除库位：同上

    // 3.2 时间字段（YYYY-MM-DD格式，直接赋值）
    inventoryData.onShelfStartTime = selectedData.onShelfStartTime || null;
    inventoryData.onShelfEndTime = selectedData.onShelfEndTime || null;

    // 3.3 分配优先级（模板中是JSON字符串，需解析为数组）
    inventoryData.priorityList = selectedData.priorityListJson  // 修正字段名
        ? JSON.parse(selectedData.priorityListJson)  // 解析JSON字符串为数组
        : [];  // 默认空数组
    console.log('选中模板的库存范围数据：', inventoryData); // 调试日志
};

// 2. 基础实例初始化：国际化、路由、状态管理
const { t } = useI18n();
const route = useRoute();
const useTagsStore = tagsStore(); // 标签页管理实例
const refreshStore = useRefreshStore(); // 列表刷新状态实例

// 3. 表单/组件引用：表单校验引用、外部组件引用
const formRef = ref(null); // 主表单校验引用
const inventoryRangeFormRef = ref(null); // 库存范围组件引用

// 4. 下拉选项数据：仓库、客户、发货渠道（均为接口返回）
const warehouseOptions = ref([]); // 仓库下拉选项
const customerOptions = ref([]); // 客户下拉选项
const shipwayOptions = ref([]); // 发货渠道下拉选项
const businessOptions = ref([]); // 业务类型下拉选项


// 5. 核心业务数据：波次类型列表（表格数据）、表单提交数据
const waveTypeList = reactive([]); // 波次类型配置表格数据
const formData = reactive({
    warehouseCodes: null, // 选中的仓库编码（数组）
    customerCodes: [], // 选中的客户编码（数组）
    orderStartTime: null, // 订单开始时间
    orderEndTime: null, // 订单结束时间
    shipwayCodes: null, // 选中的发货渠道编码（数组）
    isDistinguishShipway: false, // 是否区分发货渠道（开关）
});

// 6. 工具函数：日期格式化（转「YYYY-MM-DD HH:mm:ss」格式）
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 7. 组件Props：接收父组件传递的初始表单数据
const props = defineProps({
    initFormData: {
        type: Object,
        default: () => ({}) // 默认空对象，避免undefined
    }
});

// 8. 核心业务方法：保存（提交）、关闭（返回）
/**
 * 保存波次配置：表单校验 → 组装数据 → 接口提交 → 跳转列表
 */
const handleSave = async () => {
    // 第一步：表单校验（仅校验主表单，不包含外部组件）
    await formRef.value.validate(async (valid) => {
        if (valid) {
            // 第二步：获取外部组件（库存范围）的表单数据
            const inventoryData = inventoryRangeFormRef.value
                ? inventoryRangeFormRef.value.getFormData()
                : {};

            // 第三步：组装波次类型参数（按类型名匹配，非ID匹配）
            const waveTypeParams = {};
            waveTypeList.forEach(item => {
                if (item.checked) { // 仅处理选中的波次类型
                    switch (item.typeName) {
                        case '单品单件':
                            waveTypeParams.orderQtyMin1 = item.min;
                            waveTypeParams.orderQtyMax1 = item.max;
                            break;
                        case '单品多件':
                            waveTypeParams.orderQtyMin2 = item.min;
                            waveTypeParams.orderQtyMax2 = item.max;
                            break;
                        case '杂品单件':
                            waveTypeParams.orderQtyMin3 = item.min;
                            waveTypeParams.orderQtyMax3 = item.max;
                            break;
                        case '杂品多件':
                            waveTypeParams.orderQtyMin4 = item.min;
                            waveTypeParams.orderQtyMax4 = item.max;
                            break;
                    }
                }
            });

            // 第四步：组装最终提交数据（主表单 + 库存数据 + 波次参数 + 数组转JSON）
            const submitData = {
                ...formData,
                ...inventoryData,
                ...waveTypeParams,
                orgId: Array.isArray(formData.orgId) && formData.orgId.length > 0
                    ? formData.orgId[formData.orgId.length - 1]
                    : null,
                waveTypeId: JSON.stringify(waveTypeList.filter(item => item.checked).map(item => item.id)),
                customerCodes: JSON.stringify(formData.customerCodes),
                warehouseCodes: JSON.stringify(formData.warehouseCodes),
                shipwayCodes: JSON.stringify(formData.shipwayCodes)
            };

            // 第五步：调用接口提交，处理结果
            const res = await addOutstockWaveTaskApi(submitData);
            smartAlert(res.msg, res.success, 1000); // 提示提交结果

            if (res.success) {
                refreshStore.shouldRefreshWaveList = true; // 标记波次列表需刷新
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter( // 移除当前标签页
                    item => item.path !== route.fullPath
                );
                router.push('/outstock/wave/outWave/list'); // 跳转波次列表页
            }
        } else {
            console.log('Form validation failed.'); // 校验失败日志
        }
    });
};
const handleSaveAndAdd = async () => {
    // 使用prompt创建带输入框的对话框
    ElMessageBox.prompt(
        `请输入模板名称`,
        '保存模板',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            inputPattern: /\S+/,
            inputErrorMessage: '请输入模板名称！',
        }
    )
        .then(async ({ value }) => {
            const taskName = value.trim();
            if (!taskName) {
                ElMessage({
                    type: 'warning',
                    message: '请输入模板名称！'
                });
                // 验证失败时重新打开弹窗
                return handleSaveAndAdd();
            }
            // value为用户输入的备注内容
            formData.isTemplate = true;
            formData.taskName = taskName;
            handleSave()

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

/**
 * 关闭波次配置：移除当前标签页 + 跳转列表
 */
const handleClose = () => {
    // 移除当前标签页（过滤掉当前路径对应的标签）
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push({ path: '/outstock/wave/outWave/list' }); // 跳转波次列表页
};

// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
    console.log('选择的公司ID：', e);
    const customerRes = await getCustomerLikeQueryApi({ keyword: '*', orgId: e[e.length - 1] });
    customerOptions.value = customerRes.data;
};

// 9. 组件初始化：页面加载时执行（默认值设置、接口请求、数据初始化）
onMounted(async () => {
    try {
        // 步骤1：设置订单时间默认值（开始时间：7天前0点，结束时间：今天15点）
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const today15 = new Date();
        today15.setHours(15, 0, 0, 0);

        // 优先用父组件初始值，无则用默认值
        formData.orderStartTime = props.initFormData.orderStartTime || formatDate(sevenDaysAgo);
        formData.orderEndTime = props.initFormData.orderEndTime || formatDate(today15);

        // 步骤2：获取波次类型接口数据（并打印日志调试）
        const waveTypeRes = await getOutstockWaveTypeEnumApi();
        const apiWaveTypes = waveTypeRes.data || [];
        console.log('接口返回的波次类型：', apiWaveTypes); // 调试用：确认ID和类型名

        // 步骤3：初始化波次类型列表（按类型名设置默认选中和数量范围）
        waveTypeList.length = 0; // 清空列表，避免重复
        apiWaveTypes.forEach(type => {
            const waveItem = {
                id: type.id,
                typeName: type.name || null, // 兼容接口返回无name的情况
                checked: false, // 是否选中（默认未选）
                min: null, // 订单数量最小值
                max: null // 订单数量最大值
            };

            // 按类型名强制设置默认值（不受接口ID影响）
            if (waveItem.typeName === '单品单件') {
                waveItem.checked = true;
                waveItem.min = 10;
                waveItem.max = 10000;
            } else if (waveItem.typeName === '单品多件') {
                waveItem.checked = true;
                waveItem.min = 10;
                waveItem.max = 1000;
            } else if (waveItem.typeName === '杂品单件') {
                waveItem.checked = true;
                waveItem.min = 20;
                waveItem.max = 20;
            } else if (waveItem.typeName === '杂品多件') {
                waveItem.checked = true;
                waveItem.min = 20;
                waveItem.max = 20;
            }

            waveTypeList.push(waveItem);
        });

        // 步骤4：获取下拉选项数据（发货渠道、客户、仓库）
        const shipwayRes = await getProductShipwayListApi();
        shipwayOptions.value = shipwayRes.data || [];


        const warehouseRes = await getWhWarehouseApi();
        warehouseOptions.value = warehouseRes.data.map(item => ({
            label: item.code + '-' + item.name, // 显示「编码-名称」
            value: item.code
        }));

        // 业务类型
        const businessRes = await getInstockInOrderBusinessEnumApi();
        businessOptions.value = businessRes.data.map(item => ({
            label: item.name,
            value: item.id
        }));

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

        // 步骤5：同步父组件初始值（仅覆盖有值的字段，保留默认值）
        if (props.initFormData) {
            Object.assign(formData, props.initFormData); // 同步主表单数据

            // 同步波次类型的初始值（按类型名匹配）
            waveTypeList.forEach(item => {
                switch (item.typeName) {
                    case '单品单件':
                        if (props.initFormData.orderQtyMin1 !== undefined) item.min = props.initFormData.orderQtyMin1;
                        if (props.initFormData.orderQtyMax1 !== undefined) item.max = props.initFormData.orderQtyMax1;
                        if (item.min !== null || item.max !== null) item.checked = true;
                        break;
                    case '单品多件':
                        if (props.initFormData.orderQtyMin2 !== undefined) item.min = props.initFormData.orderQtyMin2;
                        if (props.initFormData.orderQtyMax2 !== undefined) item.max = props.initFormData.orderQtyMax2;
                        if (item.min !== null || item.max !== null) item.checked = true;
                        break;
                    case '杂品单件':
                        if (props.initFormData.orderQtyMin3 !== undefined) item.min = props.initFormData.orderQtyMin3;
                        if (props.initFormData.orderQtyMax3 !== undefined) item.max = props.initFormData.orderQtyMax3;
                        if (item.min !== null || item.max !== null) item.checked = true;
                        break;
                    case '杂品多件':
                        if (props.initFormData.orderQtyMin4 !== undefined) item.min = props.initFormData.orderQtyMin4;
                        if (props.initFormData.orderQtyMax4 !== undefined) item.max = props.initFormData.orderQtyMax4;
                        if (item.min !== null || item.max !== null) item.checked = true;
                        break;
                }
            });
        }
    } catch (error) {
        // 异常降级：接口失败时强制添加4种波次类型，确保页面正常显示
        console.error('初始化失败：', error);
        waveTypeList.length = 0;
        waveTypeList.push(
            { id: 10, typeName: '单品单件', checked: true, min: 10, max: 10000 },
            { id: 11, typeName: '单品多件', checked: true, min: 10, max: 1000 },
            { id: 20, typeName: '杂品单件', checked: true, min: 20, max: 20 },
            { id: 21, typeName: '杂品多件', checked: true, min: 20, max: 20 }
        );
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.order-range,
.inventory-range,
.wave-type {
    margin-bottom: 24px;
}

.wave-type-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.wave-type-item span {
    width: 80px;
}

.dialog-footer {
    text-align: right;
}

.title {
    display: inline-block;
    font-size: 22px;
    font-weight: bold;
}

.collapse-item-content {
    padding: 10px 18px 0;
}

.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
}

.btns {
    width: 100% !important;
    margin-top: auto;
    padding: 10px 0;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
}

h3 {
    font-size: 18px;
    margin: 5px 0;
}

.tableFormSlot {
    display: flex;
    margin: 4px 0;
}

:deep(.el-form) {
    width: 900px !important;
}

:deep(.el-input) {
    width: 100% !important;
}

:deep(.is-circle) {
    padding: 5px !important;
    width: 30px !important;
    height: 30px !important;
    margin-left: 5px !important;
}
</style>