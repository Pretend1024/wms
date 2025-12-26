<template>
    <el-dialog v-model="visible" title="波次详情" width="800" align-center :close-on-click-modal="false" destroy-on-close
        @close="handleClose">
        <div class="dialogDiv">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
                <!-- 订单范围 -->
                <p class="scopeTitle">1.订单范围</p>
                <el-row class="order-range">
                    <el-col :span="12">
                        <el-form-item label="指定公司" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable disabled placeholder="" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="指定仓库" prop="warehouseCodes">
                            <!-- <el-select v-model="formData.warehouseCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" :disabled="true">
                                <el-option v-for="(item, index) in warehouseOptions" :label="item.label"
                                    :value="item.value" :key="index" />
                            </el-select> -->
                            <el-input v-model="formData.warehouseCodes" :disabled="true" type="textarea" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="指定客户" prop="customerCodes">
                            <!-- <el-select v-model="formData.customerCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select"
                                :disabled="true">
                                <el-option v-for="item in customerOptions" :key="item.code"
                                    :label="item.code + '(' + item.name + ')'" :value="item.code" />
                            </el-select> -->
                            <el-input v-model="formData.customerCodes" :disabled="true" type="textarea" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单开始时间" prop="orderStartTime">
                            <el-date-picker v-model="formData.orderStartTime" type="datetime" placeholder="选择开始时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单结束时间" prop="orderEndTime">
                            <el-date-picker v-model="formData.orderEndTime" type="datetime" placeholder="选择结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss" clearable :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务类型">
                            <el-input v-model="formData.businessName" :disabled="true" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="发货渠道" prop="shipwayCodes">
                            <!-- <el-select v-model="formData.shipwayCodes" filterable clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select"
                                :disabled="true">
                                <el-option v-for="(item, index) in shipwayOptions" :label="item.name" :value="item.code"
                                    :key="index" />
                            </el-select> -->
                            <el-input v-model="formData.shipwayCodes" :disabled="true" type="textarea" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item>
                            <el-checkbox v-model="formData.isDistinguishShipway" label="同渠道(一个波次内订单必须相同渠道)"
                                :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider />

                <!-- 库存范围 -->
                <p class="scopeTitle">2.库存范围</p>
                <!-- 将 init-data 和 disabled 传给子组件（子组件需支持） -->
                <inventoryRangeForm ref="inventoryRangeFormRef" :formData="inventoryData" :disabled="true" />

                <!-- 波次类型 -->
                <el-divider />
                <p class="scopeTitle">3.波次类型</p>
                <el-table :data="waveTypeList" border style="width: 100%" :cell-style="{ 'vertical-align': 'middle' }">
                    <!-- 类型列 -->
                    <el-table-column prop="typeName" label="类型" width="120" />

                    <!-- 最小值列 -->
                    <el-table-column label="订单数量最小值" width="180">
                        <template #default="scope">
                            <el-input placeholder="最小值" v-model.number="scope.row.min" :min="1" type="number"
                                :disabled="true" />
                        </template>
                    </el-table-column>

                    <!-- 最大值列 -->
                    <el-table-column label="订单数量最大值" width="180">
                        <template #default="scope">
                            <el-input placeholder="最大值" v-model.number="scope.row.max" :min="1" type="number"
                                :disabled="true" />
                        </template>
                    </el-table-column>

                    <!-- 是否选中列 -->
                    <el-table-column label="是否选中" width="100">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.checked" :disabled="true" />
                            <!-- 这里始终禁用单元格勾选，避免在查看时修改 -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, defineExpose, onMounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import inventoryRangeForm from '../../order/outOrder/inventoryRangeForm.vue';
import { getButtonText } from '@/utils/i18n/i18nLabels.js';
import { getOutstockWaveTypeEnumApi, getOutstockWaveTaskByIdApi } from '@/api/outstockApi/wave.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getProductShipwayListApi } from '@/api/productApi/shipway.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

const { t } = useI18n();

const props = defineProps({
    // 接受外部传入的 id，用于查看/回显
    initId: {
        type: String,
        default: '',
    },
    customerOptions: {
        type: Array,
        default: () => [],
    },
    warehouseOptions: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const formRef = ref(null);
const inventoryRangeFormRef = ref(null);
const visible = ref(false);

// 波次类型列表（从接口获取）
const waveTypeList = reactive([]);

// 表单数据（页面可见字段）
const formData = reactive({
    warehouseCodes: [], // 多选数组
    customerCodes: [], // 多选数组
    orderStartTime: '',
    orderEndTime: '',
    shipwayCodes: [], // 多选数组
    isDistinguishShipway: false,
    // 可能需要回显的其它基础字段（保留）
    waveNo: '',
    taskNo: '',
    taskId: '',
    orgId: '',
    orgName: '',
    salesUserCode: '',
    customerId: '',
    customerCode: '',
    warehouseId: '',
    warehouseCode: '',
    shipwayId: '',
    shipwayCode: '',
    statusId: null,
    statusName: '',
    processTypeId: null,
    processTypeName: '',
    waveTypeId: null,
    waveTypeName: '',
    zoneCode: '',
    locationCode: '',
    outShelfTimeStart: '',
    outShelfTimeEnd: '',
    outShelfBy: '',
    remark: '',
    businessName: null,
    orderQty: null,
    skuQty: null,
    goodsQty: null,
    locationQty: null,
    printOrderTime: '',
    printWaveTime: '',
    createdTime: '',
    updatedTime: '',
    createdBy: '',
    updatedBy: '',
    allocatedStatus: null,
    allocatedEmployeeNum: '',
});

const rules = reactive({});

// 控制是否是查看模式（传入 initId 则视为查看/回显）
const isViewMode = computed(() => !!props.initId);

// 供 inventoryRangeForm 回填的初始数据（如果子组件支持 init-data）
const inventoryInitData = ref({});

// 对外暴露的 open/close（父组件可以调用 open() 来打开）
const open = () => {
    visible.value = true;
    if (formRef.value) {
        formRef.value.clearValidate();
    }
};

const close = () => {
    visible.value = false;
};

const handleCancel = () => {
    emit('cancel');
    close();
};

const handleClose = () => {
    emit('close');
};


// 关键：定义库存范围数据，结构与inventoryRangeForm组件的formData完全对齐
const inventoryData = reactive({
    inOrderNoList: '', // 入库单（字符串，多值用逗号分隔）
    onShelfStartTime: '', // 上架开始时间（YYYY-MM-DD）
    onShelfEndTime: '', // 上架结束时间（YYYY-MM-DD）
    zoneCodes: '', // 库区编码（字符串，多值用逗号分隔）
    locationCodes: '', // 库位编码（字符串，多值用逗号分隔）
    excludeZoneCodes: '', // 排除库区（字符串，多值用逗号分隔）
    excludeLocationCodes: '', // 排除库位（字符串，多值用逗号分隔）
    priorityList: [] // 分配优先级ID数组（与子组件排序对应）
});

// 接收弹窗返回的选中数据，并处理成表单提交前格式
const handleTemplateSelect = (selectedData) => {
    if (!selectedData) return; // 防止无数据时报错

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
    formData.orgId = selectedData.orgId ? selectedData.orgId : ''; // 公司ID：数组格式

    // 2. 处理「订单时间字段」：直接复用模板时间（格式与date-picker输出一致：YYYY-MM-DD HH:mm:ss）
    formData.orderStartTime = selectedData.orderStartTime || '';
    formData.orderEndTime = selectedData.orderEndTime || '';

    formData.isDistinguishShipway = selectedData.isDistinguishShipway || false; // 渠道区分：默认false

    formData.businessName = selectedData.businessName || null; // 业务类型：默认null

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
    inventoryData.inOrderNoList = selectedData.inOrderNoList || ''; // 入库单：直接赋值字符串
    inventoryData.zoneCodes = selectedData.zoneCodes || ''; // 库区：直接赋值字符串（子组件用逗号分隔多值）
    inventoryData.locationCodes = selectedData.locationCodes || ''; // 库位：同上
    inventoryData.excludeZoneCodes = selectedData.excludeZoneCodes || ''; // 排除库区：同上
    inventoryData.excludeLocationCodes = selectedData.excludeLocationCodes || ''; // 排除库位：同上

    // 3.2 时间字段（YYYY-MM-DD格式，直接赋值）
    inventoryData.onShelfStartTime = selectedData.onShelfStartTime || '';
    inventoryData.onShelfEndTime = selectedData.onShelfEndTime || '';

    // 3.3 分配优先级（模板中是JSON字符串，需解析为数组）
    inventoryData.priorityList = selectedData.allocationPriorityList
        ? JSON.parse(selectedData.allocationPriorityList) // 模板中存储的是数组的JSON字符串
        : []; // 默认空数组
    console.log('选中模板的库存范围数据：', inventoryData); // 调试日志
};

// 暴露方法给父组件
defineExpose({
    open,
    close,
});

// 业务数据
const shipwayOptions = ref([]);

// 从接口获取波次类型并初始化
const loadWaveTypes = async () => {
    try {
        const res = await getOutstockWaveTypeEnumApi();
        const apiWaveTypes = res.data || [];

        waveTypeList.length = 0;
        apiWaveTypes.forEach(type => {
            waveTypeList.push({
                id: type.id,
                typeName: type.name,
                checked: false,
                min: null,
                max: null,
            });
        });
    } catch (error) {
        console.error('获取波次类型枚举失败：', error);
        // 降级默认
        waveTypeList.length = 0;
        waveTypeList.push(
            { id: 10, typeName: '单品单件', checked: false, min: null, max: null },
            { id: 11, typeName: '单品多件', checked: false, min: null, max: null },
            { id: 20, typeName: '杂品单件', checked: false, min: null, max: null },
            { id: 21, typeName: '杂品多件', checked: false, min: null, max: null }
        );
    }
};


// 当有 initId 时调用详情接口
const loadDetailById = async id => {
    if (!id) return;
    try {
        console.log('loadDetailById', id);
        const res = await getOutstockWaveTaskByIdApi({ id });
        const detail = res.data || {};
        handleTemplateSelect(detail);
    } catch (err) {
        console.error('获取波次详情失败：', err);
        smartAlert('获取波次详情失败', false);
    }
};
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
onMounted(async () => {
    try {
        await loadWaveTypes();

        const shipwayRes = await getProductShipwayListApi();
        shipwayOptions.value = shipwayRes.data || [];
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

        // 如果父组件传入 initId，则加载详情回显
        if (props.initId) {
            await loadDetailById(props.initId);
            // 自动打开弹窗用于查看（如果需要手动 open，则删除下面一行）
            open();
        }
    } catch (e) {
        console.error(e);
    }
});

// 如果 initId 发生变化（父组件可能后续传值），监听并更新
watch(
    () => props.initId,
    async newId => {
        if (newId) {
            await loadDetailById(newId);
            open();
        }
    }
);

</script>

<style scoped lang="scss">
:deep(.el-input) {
    width: 100%;
}

.dialogDiv {
    width: 98%;
    padding: 0 10px;
    height: 700px;
    overflow-y: auto;

    .scopeTitle {
        font-size: 18px;
        font-weight: 500;
        margin: 15px 0 10px 0px;
        padding-bottom: 8px;
    }

    .numInput {
        width: 120px;
        margin: 0 8px;
    }
}

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

:deep(.el-tag--info) {
    width: 100px;
}

:deep(.el-cascader) {
    width: 100% !important;
}
</style>