<template>
    <div class="page-container" v-loading="loading">
        <el-card class="master-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <span class="main-title">移库单详情</span>
                    <el-tag :type="masterInfo.statusId === 3 ? 'error' : 'success'">
                        {{ masterInfo.statusName || '未知状态' }}
                    </el-tag>
                </div>
            </template>
            <el-descriptions border :column="4" size="default" class="fixed-descriptions">
                <el-descriptions-item label="移库单号">{{ masterInfo.mvNo }}</el-descriptions-item>
                <el-descriptions-item label="公司">{{ masterInfo.orgName }}</el-descriptions-item>
                <el-descriptions-item label="源仓库">{{ masterInfo.fromWarehouseCode }}</el-descriptions-item>
                <el-descriptions-item label="目标仓库">{{ masterInfo.toWarehouseCode || '-' }}</el-descriptions-item>
                <el-descriptions-item label="客户">{{ masterInfo.customerName }}</el-descriptions-item>
                <el-descriptions-item label="创建人">{{ masterInfo.createdBy }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ masterInfo.createdTime }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ masterInfo.remark }}</el-descriptions-item>
            </el-descriptions>
        </el-card>

        <div class="detail-container">
            <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
                <el-tab-pane v-for="opType in opTypeOptions" :key="opType.id" :label="opType.name" :name="opType.id">

                    <template v-if="opType.id === 2">
                        <div class="table-header">
                            <span class="title">按商品移库明细</span>
                            <el-button type="primary" link icon="Plus" @click="addSkuDetailItem"
                                :disabled="hasUnsubmittedSkuRow || isArchived">
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
                            <el-table-column label="总数量" width="80" align="center">
                                <template #default="{ row }">
                                    {{ row.isSubmitted ? '-' : row.totalQty }}
                                </template>
                            </el-table-column>

                            <el-table-column label="下架数量" width="130">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.qty" :min="1" :max="row.totalQty || 999999"
                                        :controls="false" :disabled="row.isSubmitted" @change="getOutDetail(row)"
                                        style="width: 100%" />
                                </template>
                            </el-table-column>

                            <el-table-column label="下架详情(批次)" min-width="180" align="left">
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
                            <span class="title">按库位移库明细</span>
                            <el-button type="primary" link icon="Plus" @click="addLocationDetailItem"
                                :disabled="hasUnsubmittedLocationRow || isArchived">
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

<script setup name="追加移库">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { smartAlert } from '@/utils/genericMethods.js'
import { Plus, Minus } from '@element-plus/icons-vue';
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js';
import {
    getInventoryMvDetailApi,
    getInventoryMvSkuInfoApi,
    getInventoryMvOutDetailApi,
    addInventoryMvDetailApi,
    getInventoryMvOpTypeEnumApi
} from '@/api/inventoryApi/mv.js';

const route = useRoute();
const masterId = ref(route.params.id || route.query.id);
const loading = ref(false);

const masterInfo = ref({});
const qualityOptions = ref([]);
const opTypeOptions = ref([]);
const activeTab = ref(2);

// 明细列表
const skuDetailList = ref([]);
const locationDetailList = ref([]);

// 计算属性：当前移库单是否已归档
const isArchived = computed(() => masterInfo.value.statusId === 3);

// 功能注释：检查（最新行）是否未提交，若未提交则不允许再添加
const hasUnsubmittedSkuRow = computed(() => {
    if (skuDetailList.value.length === 0) return false;
    return !skuDetailList.value[0].isSubmitted;
});

const hasUnsubmittedLocationRow = computed(() => {
    if (locationDetailList.value.length === 0) return false;
    return !locationDetailList.value[0].isSubmitted;
});

// 初始化数据
onMounted(async () => {
    if (!masterId.value) return;
    openMainLoading()
    loading.value = true;
    try {
        const [detailRes, qualityRes, opTypeRes] = await Promise.all([
            getInventoryMvDetailApi({ id: masterId.value }),
            getOrderQualityEnumApi(),
            getInventoryMvOpTypeEnumApi()
        ]);

        if (qualityRes.success) qualityOptions.value = qualityRes.data.map(item => ({ id: item.id, name: item.name }));

        if (opTypeRes.success) {
            opTypeOptions.value = opTypeRes.data;
            const hasSkuType = opTypeRes.data.some(t => t.id === 2);
            activeTab.value = hasSkuType ? 2 : (opTypeRes.data[0]?.id || 2);
        }

        if (detailRes.success) {
            masterInfo.value = detailRes.data;
            const allHistory = detailRes.data.inventoryMvOutList || [];

            // 历史数据反转排序，使最新的显示在顶部
            const historySku = allHistory
                .filter(item => item.mvOpTypeId === 2)
                .map(processHistoryItem)
                .reverse();
            skuDetailList.value = historySku;

            const locList = detailRes.data.mvByLocationInfoList || [];
            locationDetailList.value = locList.map(item => ({
                tempId: 'loc_' + Date.now() + Math.random(),
                isSubmitted: true,
                locationCode: item.locationCode,
                toLocationCode: item.toLocationCode,
                remark: item.remark
            })).reverse();

            // 若未归档，在第一行自动插入一个可输入的空行
            if (!isArchived.value) {
                if (activeTab.value === 2) addSkuDetailItem();
                else if (activeTab.value === 1) addLocationDetailItem();
            }
        }
    } finally {
        loading.value = false;
        closeMainLoading()
    }
});

const processHistoryItem = (item) => ({
    ...item,
    tempId: item.id || Date.now() + Math.random(),
    isSubmitted: true,
    onList: item.inventoryMvOnList || [],
    outDetailList: item.inventoryMvOutDetailList || []
});

const handleTabClick = () => {
    if (isArchived.value) return;
    if (activeTab.value === 2 && skuDetailList.value.length === 0) {
        addSkuDetailItem();
    } else if (activeTab.value === 1 && locationDetailList.value.length === 0) {
        addLocationDetailItem();
    }
};

// ================= 按商品移库逻辑 (SKU) =================

const addSkuDetailItem = () => {
    if (hasUnsubmittedSkuRow.value) return smartAlert('请先提交当前行', false);
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
            fromWarehouseId: masterInfo.value.fromWarehouseId,
            customerId: masterInfo.value.customerId,
            locationCode: row.locationCode,
            barcode: row.barcode,
            isWholeMove: false
        });
        if (res.success && res.data?.qualityInfoList?.length > 0) {
            const info = res.data.qualityInfoList[0];
            row.qualityName = info.qualityName || '良品';
            row.qualityId = info.qualityId || 10;
            row.totalQty = info.inventoryQty || 0;
            row.sku = info.sku || '';
            row.onList.forEach(t => t.qualityId = row.qualityId);
        } else {
            smartAlert(res.msg || '未查询到库存信息', false)
            row.totalQty = 0;
        }
    } catch (e) { console.error(e) }
};

const getOutDetail = async (row) => {
    if (!row.qty) return;
    try {
        const res = await getInventoryMvOutDetailApi({
            fromWarehouseId: masterInfo.value.fromWarehouseId,
            locationCode: row.locationCode,
            barcode: row.barcode,
            outQty: row.qty,
            customerId: masterInfo.value.customerId,
            orgId: masterInfo.value.orgId,
            qualityId: row.qualityId,
            isWholeMove: false
        });
        if (res.success) {
            row.outDetailList = res.data || [];
            if (row.outDetailList.length > 0) row.sku = row.outDetailList[0].sku;
        }
    } catch (e) { console.error(e) }
};

const addInRow = (row) => {
    row.onList.push({ locationCode: '', qualityId: row.qualityId || '', qty: 0 });
};

const removeInRow = (row, idx) => {
    row.onList.splice(idx, 1);
};

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
            // 提交成功后，在最顶层插入新的操作行
            addSkuDetailItem();
        } else {
            smartAlert(res.msg || '移库失败', false)
        }
    } finally {
        loading.value = false;
    }
};

// ================= 按库位移库逻辑 (Location) =================

const addLocationDetailItem = () => {
    if (hasUnsubmittedLocationRow.value) return smartAlert('请先提交当前行', false);
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
            // 提交成功后，在最顶层插入新的操作行
            addLocationDetailItem();
        } else {
            smartAlert(res.msg || '移库失败', false)
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

        .main-title {
            font-size: 16px;
            font-weight: bold;
            color: #303133;
            margin-right: 10px;
        }
    }
}

.fixed-descriptions {
    :deep(table) {
        table-layout: fixed;
    }

    :deep(.el-descriptions__label) {
        width: 10%;
        text-align: center;
        font-weight: bold;
        color: #606266;
        background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
        width: 15%;
        color: #303133;
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