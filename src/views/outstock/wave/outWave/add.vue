<template>
    <div class="viewArea">
        <WaveTemplateDialog v-model:visible="templateDialogVisible" @confirm="handleTemplateSelect" />
        <div class="contentDiv flex-container">

            <el-form :model="formData" ref="formRef" label-width="110px" :rules="rules">
                <p class="scopeTitle">1.订单范围</p>
                <div style="width: 100%;padding-left: 780px;margin-bottom: 8px;">
                    <el-button type="primary" @click="templateDialogVisible = true">
                        选择波次模板
                    </el-button>
                </div>
                <el-row class="order-range">
                    <el-col :span="12">
                        <el-form-item label="指定公司" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="指定仓库" prop="warehouseCodes">
                            <el-select v-model="formData.warehouseCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1">
                                <el-option v-for="(item, index) in warehouseOptions" :label="item.label"
                                    :value="item.value" :key="index" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="指定客户" prop="customerCodes">
                            <el-select v-model="formData.customerCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.code"
                                    :label="item.code + '(' + item.name + ')'" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单开始时间" prop="orderStartTime">
                            <el-date-picker v-model="formData.orderStartTime" type="datetime" placeholder="选择开始时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable required />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单结束时间" prop="orderEndTime">
                            <el-date-picker v-model="formData.orderEndTime" type="datetime" placeholder="选择结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable required />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务类型">
                            <el-select v-model="formData.businessId" clearable placeholder="请选择业务类型">
                                <el-option v-for="(item) in businessOptions" :label="item.label" :value="item.value"
                                    :key="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发货渠道" prop="shipwayCodes">
                            <el-select v-model="formData.shipwayCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="2" popper-class="multi-column-select">
                                <el-option v-for="(item, index) in shipwayOptions" :label="item.name" :value="item.code"
                                    :key="index" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-checkbox v-model="formData.isDistinguishShipway" label="同渠道(一个波次内订单必须相同渠道)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider />
                <p class="scopeTitle">2.库存范围</p>
                <inventoryRangeForm ref="inventoryRangeFormRef" :formData="inventoryData" />

                <el-divider />
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
import { ref, reactive, defineProps, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

// 接口导入
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getProductShipwayListApi } from '@/api/productApi/shipway.js';
import { getOutstockWaveTypeEnumApi, addOutstockWaveTaskApi } from '@/api/outstockApi/wave.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js';

// 工具/常量导入
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

// 组件/路由/状态导入
import inventoryRangeForm from '@/views/outstock/order/outOrder/inventoryRangeForm.vue';
import router from '@/router/index.js';
import tagsStore from '@/store/tags.js';
import { useRefreshStore } from '@/store/refresh.js';

import WaveTemplateDialog from './waveTemplateDialog.vue';

// 控制弹窗显示
const templateDialogVisible = ref(false);

// 【修改点1】：从 inventoryData 中移除了 businessId，因为它属于主表单 formData
const inventoryData = reactive({
    inOrderNoList: null, // 入库单
    onShelfStartTime: null, // 上架开始时间
    onShelfEndTime: null, // 上架结束时间
    zoneCodes: null, // 库区编码
    locationCodes: null, // 库位编码
    excludeZoneCodes: null, // 排除库区
    excludeLocationCodes: null, // 排除库位
    priorityList: [] // 分配优先级ID数组
});

const rules = reactive({
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    warehouseCodes: [{ required: true, message: '请选择仓库', trigger: 'change' }],
})

// 接收弹窗返回的选中数据
const handleTemplateSelect = (selectedData) => {
    if (!selectedData) return;
    console.log('选中模板数据：', selectedData);

    // 1. 处理「数组类型字段」
    formData.warehouseCodes = selectedData.warehouseCodes
        ? JSON.parse(selectedData.warehouseCodes)
        : [];

    formData.customerCodes = selectedData.customerCodes
        ? JSON.parse(selectedData.customerCodes)
        : [];

    formData.shipwayCodes = selectedData.shipwayCodes
        ? JSON.parse(selectedData.shipwayCodes)
        : [];
    formData.orgId = selectedData.orgId ? selectedData.orgId : '';

    // 2. 处理「订单时间字段」
    formData.orderStartTime = selectedData.orderStartTime || null;
    formData.orderEndTime = selectedData.orderEndTime || null;

    formData.isDistinguishShipway = selectedData.isDistinguishShipway || false;

    // 【修改点2】：优化业务类型的赋值逻辑，如果模板有值则覆盖，没值则保留原样或置空
    if (selectedData.businessId) {
        formData.businessId = selectedData.businessId;
    } else {
        formData.businessId = null;
    }

    // 4. 处理「波次类型配置」
    waveTypeList.forEach(item => {
        switch (item.typeName) {
            case '单品单件':
                const singleOneMin = selectedData.orderQtyMin1;
                const singleOneMax = selectedData.orderQtyMax1;
                if (singleOneMin === 0 && singleOneMax === 0) {
                    item.checked = false;
                    item.min = 10;
                    item.max = 10000;
                } else {
                    item.min = singleOneMin ?? 10;
                    item.max = singleOneMax ?? 10000;
                    item.checked = true;
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

    // 3. 库存范围数据处理
    inventoryData.inOrderNoList = selectedData.inOrderNoList || null;
    inventoryData.zoneCodes = selectedData.zoneCodes || null;
    inventoryData.locationCodes = selectedData.locationCodes || null;
    inventoryData.excludeZoneCodes = selectedData.excludeZoneCodes || null;
    inventoryData.excludeLocationCodes = selectedData.excludeLocationCodes || null;

    inventoryData.onShelfStartTime = selectedData.onShelfStartTime || null;
    inventoryData.onShelfEndTime = selectedData.onShelfEndTime || null;

    inventoryData.priorityList = selectedData.priorityListJson
        ? JSON.parse(selectedData.priorityListJson)
        : [];
};

// 2. 基础实例初始化
const { t } = useI18n();
const route = useRoute();
const useTagsStore = tagsStore();
const refreshStore = useRefreshStore();

// 3. 表单/组件引用
const formRef = ref(null);
const inventoryRangeFormRef = ref(null);

// 4. 下拉选项数据
const warehouseOptions = ref([]);
const customerOptions = ref([]);
const shipwayOptions = ref([]);
const businessOptions = ref([]);


// 5. 核心业务数据
const waveTypeList = reactive([]);
const formData = reactive({
    warehouseCodes: null,
    customerCodes: [],
    orderStartTime: null,
    orderEndTime: null,
    shipwayCodes: null,
    isDistinguishShipway: false,
    businessId: null, // 业务类型
});

// 6. 工具函数
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 7. 组件Props
const props = defineProps({
    initFormData: {
        type: Object,
        default: () => ({})
    }
});

// 8. 核心业务方法
const handleSave = async () => {
    // 第一步：表单校验
    await formRef.value.validate(async (valid) => {
        if (valid) {
            // 第二步：获取外部组件（库存范围）的表单数据
            const currentInventoryData = inventoryRangeFormRef.value
                ? inventoryRangeFormRef.value.getFormData()
                : {};

            // 第三步：组装波次类型参数
            const waveTypeParams = {};
            waveTypeList.forEach(item => {
                if (item.checked) {
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

            // 第四步：组装最终提交数据
            // 【修改点3】：合并顺序调整，inventoryData在formData之前，或者直接使用formData.businessId
            const submitData = {
                ...currentInventoryData, // 库存参数（不含 businessId）
                ...formData,             // 主表单参数（含 businessId，优先级高）
                ...waveTypeParams,
                orgId: formData.orgId ? formData.orgId : null,
                waveTypeId: JSON.stringify(waveTypeList.filter(item => item.checked).map(item => item.id)),
                customerCodes: JSON.stringify(formData.customerCodes),
                warehouseCodes: JSON.stringify(formData.warehouseCodes),
                shipwayCodes: JSON.stringify(formData.shipwayCodes)
            };

            // 第五步：调用接口提交
            const res = await addOutstockWaveTaskApi(submitData);
            smartAlert(res.msg, res.success, 1000);

            if (res.success) {
                refreshStore.shouldRefreshWaveList = true;
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
                    item => item.path !== route.fullPath
                );
                router.push('/outstock/wave/outWave/list');
            }
        } else {
            console.log('Form validation failed.');
        }
    });
};

const handleSaveAndAdd = async () => {
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
                return handleSaveAndAdd();
            }
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

const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
    router.push({ path: '/outstock/wave/outWave/list' });
};

// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

const handleCascaderChange = async (e) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
    console.log('选择的公司ID：', e);
    const customerRes = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = customerRes.data;
};

// 9. 组件初始化
onMounted(async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const today15 = new Date();
        today15.setHours(15, 0, 0, 0);

        formData.orderStartTime = props.initFormData.orderStartTime || formatDate(sevenDaysAgo);
        formData.orderEndTime = props.initFormData.orderEndTime || formatDate(today15);

        const waveTypeRes = await getOutstockWaveTypeEnumApi();
        const apiWaveTypes = waveTypeRes.data || [];

        waveTypeList.length = 0;
        apiWaveTypes.forEach(type => {
            const waveItem = {
                id: type.id,
                typeName: type.name || null,
                checked: false,
                min: null,
                max: null
            };

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

        const shipwayRes = await getProductShipwayListApi({ statusId: 10 });
        shipwayOptions.value = shipwayRes.data || [];

        const warehouseRes = await getWhWarehouseApi();
        warehouseOptions.value = warehouseRes.data.map(item => ({
            label: item.code + '-' + item.name,
            value: item.code
        }));

        const businessRes = await getInstockInOrderBusinessEnumApi();
        businessOptions.value = businessRes.data.map(item => ({
            label: item.name,
            value: item.id
        }));

        const companyRes = await getOrgListCompanyApi();
        const convertToTree = (items) => {
            return items.map(item => ({
                value: item.id,
                label: item.nameCn,
                children: item.children ? convertToTree(item.children) : []
            }));
        };
        companyOptions.value = convertToTree(companyRes.data);

        if (props.initFormData) {
            Object.assign(formData, props.initFormData);

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