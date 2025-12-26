<template>
    <div class="page-container" v-loading="loading">
        <el-card class="master-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <div class="header-title">
                        <span class="main-title">新增移库单</span>
                        <span class="sub-title">请填写基础信息生成主单后，再录入移库明细</span>
                    </div>
                    <el-button type="primary" :disabled="masterId !== ''" @click="handleGenerateMaster">
                        {{ masterId ? '主单已生成' : '生成主单' }}
                    </el-button>
                </div>
            </template>
            <el-form :model="masterForm" :rules="masterRules" ref="masterFormRef" label-width="90px"
                :disabled="masterId !== ''" size="default">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="公司" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="masterForm.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange" placeholder="请选择公司"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="源仓库" prop="fromWarehouseId">
                            <el-select v-model="masterForm.fromWarehouseId" placeholder="请选择源仓库" filterable
                                style="width: 100%">
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目标仓库" prop="toWarehouseId">
                            <el-select v-model="masterForm.toWarehouseId" placeholder="请选择目标仓库" filterable clearable
                                style="width: 100%">
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户" prop="customerId">
                            <el-select v-model="masterForm.customerId" placeholder="请选择客户" filterable clearable
                                style="width: 100%" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="masterForm.remark" placeholder="请输入备注信息" type="textarea" :rows="1" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <div class="detail-container" v-if="masterId">
            <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
                <el-tab-pane v-for="opType in opTypeOptions" :key="opType.id" :label="opType.name" :name="opType.id">

                    <template v-if="opType.id === 2">
                        <div class="table-header">
                            <span class="title">{{ opType.name }}明细</span>
                            <el-button type="primary" link icon="Plus" @click="addSkuDetailItem"
                                :disabled="hasUnsubmittedSkuRow">
                                添加行
                            </el-button>
                        </div>

                        <el-table :data="skuDetailList" border style="width: 100%" height="calc(100vh - 450px)"
                            class="custom-table" row-key="tempId">
                            <el-table-column type="index" label="#" width="50" />

                            <el-table-column label="原库位" width="140">
                                <template #default="{ row }">
                                    <el-input v-model="row.locationCode" placeholder="扫描库位" :disabled="row.isSubmitted"
                                        @blur="getSkuInfo(row)" />
                                </template>
                            </el-table-column>

                            <el-table-column label="商品条码" width="160">
                                <template #default="{ row }">
                                    <el-input v-model="row.barcode" placeholder="扫描条码" :disabled="row.isSubmitted"
                                        @blur="getSkuInfo(row)" />
                                </template>
                            </el-table-column>

                            <el-table-column label="品质" prop="qualityName" width="80" />
                            <el-table-column label="总数量" prop="totalQty" width="80" />

                            <el-table-column label="下架数量" width="130">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.qty" :min="1" :max="row.totalQty || 999999"
                                        :controls="false" :disabled="row.isSubmitted" @change="getOutDetail(row)"
                                        style="width: 100%" />
                                </template>
                            </el-table-column>

                            <el-table-column label="下架详情" min-width="180" align="left">
                                <template #default="{ row }">
                                    <div v-if="row.outDetailList && row.outDetailList.length > 0" class="batch-list">
                                        <div v-for="(batch, idx) in row.outDetailList" :key="idx" class="batch-text">
                                            批次:{{ batch.batchNo }} | 数量:{{ batch.outQty }}
                                        </div>
                                    </div>
                                    <span v-else class="placeholder">-</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="上架详情 (新库位 / 品质 / 数量)" width="400">
                                <template #default="{ row }">
                                    <div class="target-rows">
                                        <div v-for="(target, idx) in row.onList" :key="idx" class="target-row">
                                            <el-input v-model="target.locationCode" placeholder="新库位"
                                                :disabled="row.isSubmitted" style="width: 110px;" />
                                            <el-select v-model="target.qualityId" placeholder="品质"
                                                :disabled="row.isSubmitted" style="width: 100px;">
                                                <el-option v-for="q in qualityOptions" :key="q.id" :label="q.name"
                                                    :value="q.id" />
                                            </el-select>
                                            <el-input-number v-model="target.qty" :min="1" :controls="false"
                                                :disabled="row.isSubmitted" style="width: 80px;" placeholder="数量" />

                                            <div class="row-btns" v-if="!row.isSubmitted">
                                                <el-button type="primary" link icon="Plus" @click="addInRow(row)" />
                                                <el-button type="danger" link icon="Minus"
                                                    @click="removeInRow(row, idx)" :disabled="row.onList.length <= 1" />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="100" fixed="right">
                                <template #default="{ row, $index }">
                                    <el-button v-if="!row.isSubmitted" type="success" link
                                        @click="handleSubmitSkuDetail(row, $index)">
                                        确定移库
                                    </el-button>
                                    <el-tag v-else type="success">已提交</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>

                    <template v-if="opType.id === 1">
                        <div class="table-header">
                            <span class="title">{{ opType.name }}明细</span>
                            <el-button type="primary" link icon="Plus" @click="addLocationDetailItem"
                                :disabled="hasUnsubmittedLocationRow">
                                添加行
                            </el-button>
                        </div>

                        <el-table :data="locationDetailList" border style="width: 100%" height="calc(100vh - 450px)"
                            class="custom-table" row-key="tempId">
                            <el-table-column type="index" label="#" width="50" />

                            <el-table-column label="原库位" prop="locationCode" width="200">
                                <template #default="{ row }">
                                    <el-input v-model="row.locationCode" placeholder="扫描原库位"
                                        :disabled="row.isSubmitted" />
                                </template>
                            </el-table-column>

                            <el-table-column label="目标库位" prop="toLocationCode" width="200">
                                <template #default="{ row }">
                                    <el-input v-model="row.toLocationCode" placeholder="扫描目标库位"
                                        :disabled="row.isSubmitted" />
                                </template>
                            </el-table-column>

                            <el-table-column label="备注" prop="remark">
                                <template #default="{ row }">
                                    <el-input v-model="row.remark" placeholder="请输入备注" :disabled="row.isSubmitted" />
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="120" fixed="right">
                                <template #default="{ row, $index }">
                                    <el-button v-if="!row.isSubmitted" type="success" link
                                        @click="handleSubmitLocationDetail(row, $index)">
                                        确定移库
                                    </el-button>
                                    <el-tag v-else type="success">已提交</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup name="新增移库">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js';
import {
    addInventoryMvMasterApi,
    getInventoryMvSkuInfoApi,
    getInventoryMvOutDetailApi,
    addInventoryMvDetailApi,
    getInventoryMvOpTypeEnumApi
} from '@/api/inventoryApi/mv.js';

const loading = ref(false);
const warehouseOptions = ref([]);
const customerOptions = ref([]);
const companyOptions = ref([]);
const qualityOptions = ref([]);
const opTypeOptions = ref([]);
const cascaderRef = ref(null);
const activeTab = ref(2);

const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

// 主单信息
const masterId = ref('');
const masterFormRef = ref(null);
const masterForm = reactive({
    orgId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    customerId: '',
    remark: ''
});
const masterRules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    fromWarehouseId: [{ required: true, message: '请选择源仓库', trigger: 'change' }],
    toWarehouseId: [{ required: true, message: '请选择目标仓库', trigger: 'change' }]
};

// 明细列表
const skuDetailList = ref([]);     // ID=2
const locationDetailList = ref([]); // ID=1

// 计算属性：检查第一行（最新行）是否未提交
const hasUnsubmittedSkuRow = computed(() => {
    if (skuDetailList.value.length === 0) return false;
    return !skuDetailList.value[0].isSubmitted;
});
const hasUnsubmittedLocationRow = computed(() => {
    if (locationDetailList.value.length === 0) return false;
    return !locationDetailList.value[0].isSubmitted;
});

// 公司树形数据转换
const convertToTree = (items) => items.map(item => ({
    value: item.id,
    label: item.nameCn,
    children: item.children ? convertToTree(item.children) : []
}));

// 级联选择器事件
const handleCascaderChange = async (e) => {
    if (e) nextTick(() => cascaderRef.value?.togglePopperVisible());
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = result.success ? result.data.map(item => ({ value: item.id, label: item.code + '(' + item.name + ')' })) : [];
    masterForm.customerId = '';
};

// 初始化基础数据
onMounted(async () => {
    loading.value = true;
    try {
        const [custRes, whRes, companyRes, qualityRes, opTypeRes] = await Promise.all([
            getCustomerLikeQueryApi({ keyword: '*' }),
            getWhWarehouseApi(),
            getOrgListCompanyApi(),
            getOrderQualityEnumApi(),
            getInventoryMvOpTypeEnumApi()
        ]);
        if (custRes.success) customerOptions.value = custRes.data.map(item => ({ value: item.id, label: item.code + '(' + item.name + ')' }));
        if (whRes.success) warehouseOptions.value = whRes.data.map(item => ({ label: item.code + '(' + item.name + ')', value: item.id }));
        if (companyRes.success) companyOptions.value = convertToTree(companyRes.data);
        if (qualityRes.success) qualityOptions.value = qualityRes.data.map(item => ({ id: item.id, name: item.name }));
        if (opTypeRes.success) {
            opTypeOptions.value = opTypeRes.data;
            const hasSkuType = opTypeRes.data.some(t => t.id === 2);
            activeTab.value = hasSkuType ? 2 : (opTypeRes.data[0]?.id || 2);
        }
    } finally {
        loading.value = false;
    }
});

// 生成主单
const handleGenerateMaster = async () => {
    await masterFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const submitData = { ...masterForm };
                const res = await addInventoryMvMasterApi(submitData);
                if (res.success) {
                    masterId.value = res.data;
                    ElMessage.success('主单生成成功');
                    // 默认在第一行初始化输入框
                    if (activeTab.value === 2) addSkuDetailItem();
                    else if (activeTab.value === 1) addLocationDetailItem();
                } else {
                    smartAlert(res.msg || '主单生成失败', false);
                }
            } finally {
                loading.value = false;
            }
        }
    });
};

// 切换标签页时的处理
const handleTabClick = () => {
    if (activeTab.value === 2 && skuDetailList.value.length === 0) {
        addSkuDetailItem();
    } else if (activeTab.value === 1 && locationDetailList.value.length === 0) {
        addLocationDetailItem();
    }
};

// ================= ID=2 按商品移库逻辑 (SKU) =================

const addSkuDetailItem = () => {
    if (hasUnsubmittedSkuRow.value) return smartAlert('请先提交当前行再添加新行', false);
    // 使用 unshift 确保新增行在表格第一行
    skuDetailList.value.unshift({
        tempId: Date.now(),
        isSubmitted: false,
        locationCode: '',
        barcode: '',
        sku: '',
        qualityName: '',
        qualityId: '',
        totalQty: 0,
        qty: 0,
        outDetailList: [],
        onList: [{ locationCode: '', qualityId: '', qty: 0 }]
    });
};

const getSkuInfo = async (row) => {
    if (!row.locationCode || !row.barcode) return;
    try {
        const res = await getInventoryMvSkuInfoApi({
            fromWarehouseId: masterForm.fromWarehouseId,
            customerId: masterForm.customerId,
            locationCode: row.locationCode,
            barcode: row.barcode,
            isWholeMove: false
        });
        if (res.success && res.data && res.data.qualityInfoList && res.data.qualityInfoList.length > 0) {
            const info = res.data.qualityInfoList[0];
            row.qualityName = info.qualityName || '良品';
            row.qualityId = info.qualityId || 10;
            row.totalQty = info.inventoryQty || 0;
            row.sku = info.sku || '';
            row.onList.forEach(t => t.qualityId = row.qualityId);
        } else {
            smartAlert(res.msg || '未查询到库存信息', false);
            row.totalQty = 0;
        }
    } catch (e) { console.error(e) }
};

const getOutDetail = async (row) => {
    if (!row.qty) return;
    try {
        const orgId = masterForm.orgId;
        const res = await getInventoryMvOutDetailApi({
            fromWarehouseId: masterForm.fromWarehouseId,
            locationCode: row.locationCode,
            barcode: row.barcode,
            outQty: row.qty,
            customerId: masterForm.customerId,
            orgId: orgId,
            qualityId: row.qualityId,
            isWholeMove: false
        });
        if (res.success) {
            row.outDetailList = res.data || [];
            if (row.outDetailList.length > 0) row.sku = row.outDetailList[0].sku;
        }
    } catch (e) { console.error(e) }
};

const addInRow = (row) => row.onList.push({ locationCode: '', qualityId: row.qualityId || '', qty: 0 });
const removeInRow = (row, idx) => row.onList.splice(idx, 1);

const handleSubmitSkuDetail = async (row) => {
    if (!row.locationCode) return smartAlert('请输入原库位', false);
    if (!row.barcode) return smartAlert('请输入条码', false);
    if (!row.qty) return smartAlert('请输入下架数量', false);

    const inTotal = row.onList.reduce((sum, r) => sum + r.qty, 0);
    if (inTotal !== row.qty) return smartAlert(`上架总数(${inTotal})不等于下架数(${row.qty})`, false);

    const payload = {
        mvId: masterId.value,
        mvOutList: [{
            mvOpTypeId: 2,
            sku: row.sku,
            barcode: row.barcode,
            locationCode: row.locationCode,
            qualityId: row.qualityId,
            qty: row.qty,
            remark: '',
            outDetailList: row.outDetailList.map(d => ({
                inventoryId: d.id, batchNo: d.batchNo, outQty: d.outQty, inShelfDate: ''
            })),
            onList: row.onList.map(item => ({
                locationCode: item.locationCode, qualityId: item.qualityId, qty: item.qty, remark: ''
            }))
        }]
    };

    loading.value = true;
    try {
        const res = await addInventoryMvDetailApi(payload);
        if (res.success) {
            ElMessage.success('移库成功');
            row.isSubmitted = true;
            // 提交成功后，在最顶层添加新行
            addSkuDetailItem();
        } else {
            smartAlert(res.msg || '移库失败', false);
        }
    } finally {
        loading.value = false;
    }
};

// ================= ID=1 整库移库逻辑 (Location) =================

const addLocationDetailItem = () => {
    if (hasUnsubmittedLocationRow.value) return smartAlert('请先提交当前行', false);
    // 使用 unshift 确保新增行在表格第一行
    locationDetailList.value.unshift({
        tempId: Date.now(),
        isSubmitted: false,
        locationCode: '',
        toLocationCode: '',
        remark: ''
    });
};

const handleSubmitLocationDetail = async (row) => {
    if (!row.locationCode) return smartAlert('请输入原库位', false);
    if (!row.toLocationCode) return smartAlert('请输入目标库位', false);

    const payload = {
        mvId: masterId.value,
        mvOutList: [{
            mvOpTypeId: 1,
            locationCode: row.locationCode,
            toLocationCode: row.toLocationCode,
            remark: row.remark,
            barcode: '', sku: '', qualityId: 0, qty: 0, outDetailList: [], onList: []
        }]
    };

    loading.value = true;
    try {
        const res = await addInventoryMvDetailApi(payload);
        if (res.success) {
            ElMessage.success('移库成功');
            row.isSubmitted = true;
            // 提交成功后，在最顶层添加新行
            addLocationDetailItem();
        } else {
            ElMessage.error(res.msg);
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
.master-card {
    margin-bottom: 15px;
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-title {
            display: flex;
            flex-direction: column;

            .main-title {
                font-size: 16px;
                font-weight: bold;
                color: #303133;
            }

            .sub-title {
                font-size: 12px;
                color: #909399;
                margin-top: 4px;
            }
        }
    }
}

.detail-container {
    background: #fff;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;

        .title {
            font-size: 15px;
            font-weight: bold;
            color: #303133;
            border-left: 3px solid #409eff;
            padding-left: 8px;
        }
    }
}

.custom-table {
    :deep(.el-table__cell) {
        vertical-align: middle;
    }
}

.batch-list {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .batch-text {
        font-size: 12px;
        color: #606266;
        line-height: 1.4;
    }
}

.target-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 5px 0;

    .target-row {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 5px;

        .row-btns {
            display: flex;
            width: 50px;
            justify-content: center;
        }
    }
}

.placeholder {
    color: #ccc;
    font-size: 12px;
}
</style>