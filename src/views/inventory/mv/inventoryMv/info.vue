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
                        </div>

                        <el-table :data="skuDetailList" border style="width: 100%" height="calc(100vh - 450px)"
                            class="custom-table" row-key="tempId">
                            <el-table-column type="index" label="#" width="50" />

                            <el-table-column label="原库位" width="140">
                                <template #default="{ row }">
                                    <el-input v-model="row.locationCode" :disabled="true" />
                                </template>
                            </el-table-column>

                            <el-table-column label="商品条码" width="160">
                                <template #default="{ row }">
                                    <el-input v-model="row.barcode" :disabled="true" />
                                </template>
                            </el-table-column>

                            <el-table-column label="品质" prop="qualityName" width="80" />
                            <el-table-column label="总数量" width="80" align="center">
                                <template #default="{ row }">
                                    {{ row.totalQty || '-' }}
                                </template>
                            </el-table-column>

                            <el-table-column label="下架数量" width="130">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.qty" :disabled="true" :controls="false"
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
                                            <el-input v-model="target.locationCode" :disabled="true"
                                                style="width: 110px;" />
                                            <el-select v-model="target.qualityId" :disabled="true"
                                                style="width: 100px;">
                                                <el-option v-for="q in qualityOptions" :key="q.id" :label="q.name"
                                                    :value="q.id" />
                                            </el-select>
                                            <el-input-number v-model="target.qty" :disabled="true" :controls="false"
                                                style="width: 80px;" />
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>

                    <template v-if="opType.id === 1">
                        <div class="table-header">
                            <span class="title">按库位移库明细</span>
                        </div>

                        <el-table :data="locationDetailList" border style="width: 100%" height="calc(100vh - 450px)"
                            class="custom-table" row-key="tempId">
                            <el-table-column type="index" label="#" width="50" />

                            <el-table-column label="原库位" prop="locationCode" width="200">
                                <template #default="{ row }">
                                    <el-input v-model="row.locationCode" :disabled="true" />
                                </template>
                            </el-table-column>

                            <el-table-column label="目标库位" prop="toLocationCode" width="200">
                                <template #default="{ row }">
                                    <el-input v-model="row.toLocationCode" :disabled="true" />
                                </template>
                            </el-table-column>

                            <el-table-column label="备注" prop="remark">
                                <template #default="{ row }">
                                    <el-input v-model="row.remark" :disabled="true" />
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup name="移库详情">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js';
import {
    getInventoryMvDetailApi,
    getInventoryMvOpTypeEnumApi
} from '@/api/inventoryApi/mv.js';

const route = useRoute();
const masterId = ref(route.params.id || route.query.id);
const loading = ref(false);

const masterInfo = ref({});
const qualityOptions = ref([]);
const opTypeOptions = ref([]);
const activeTab = ref(2);

const skuDetailList = ref([]);
const locationDetailList = ref([]);

// 初始化数据
onMounted(async () => {
    if (!masterId.value) return;
    loading.value = true;
    try {
        const [detailRes, qualityRes, opTypeRes] = await Promise.all([
            getInventoryMvDetailApi({ id: masterId.value }),
            getOrderQualityEnumApi(),
            getInventoryMvOpTypeEnumApi()
        ]);

        if (qualityRes.success) {
            qualityOptions.value = qualityRes.data.map(item => ({ id: item.id, name: item.name }));
        }

        if (opTypeRes.success) {
            opTypeOptions.value = opTypeRes.data;
            const hasSkuType = opTypeRes.data.some(t => t.id === 2);
            activeTab.value = hasSkuType ? 2 : (opTypeRes.data[0]?.id || 2);
        }

        if (detailRes.success) {
            masterInfo.value = detailRes.data;
            const allHistory = detailRes.data.inventoryMvOutList || [];

            // 处理按商品移库数据
            skuDetailList.value = allHistory
                .filter(item => item.mvOpTypeId === 2)
                .map(item => ({
                    ...item,
                    tempId: item.id || Math.random(),
                    isSubmitted: true,
                    onList: item.inventoryMvOnList || [],
                    outDetailList: item.inventoryMvOutDetailList || []
                }))
                .reverse();

            // 处理按库位移库数据
            const locList = detailRes.data.mvByLocationInfoList || [];
            locationDetailList.value = locList.map(item => ({
                tempId: 'loc_' + Math.random(),
                isSubmitted: true,
                locationCode: item.locationCode,
                toLocationCode: item.toLocationCode,
                remark: item.remark
            })).reverse();
        }
    } finally {
        loading.value = false;
    }
});

const handleTabClick = () => {
    // 纯详情展示，无需处理切换逻辑
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
    }
}

.placeholder {
    color: #ccc;
    font-size: 12px;
}
</style>