<template>
    <div class="viewArea">
        <div class="bill-info-section" v-loading="loading">
            <div class="section-title">盘点单详情</div>
            <el-descriptions :column="4" border size="default" class="fixed-descriptions">
                <el-descriptions-item label="盘点单号">{{ infoData.checkNo }}</el-descriptions-item>
                <el-descriptions-item label="仓库">{{ infoData.warehouseCode }}</el-descriptions-item>
                <el-descriptions-item label="客户">{{ infoData.customerName }}</el-descriptions-item>
                <el-descriptions-item label="盘点方式">{{ infoData.checkTypeName }}</el-descriptions-item>

                <el-descriptions-item label="状态">
                    <span
                        :style="{ color: infoData.statusId === 30 ? '#67C23A' : (infoData.statusId === 90 ? '#F56C6C' : '#E6A23C') }">
                        {{ infoData.statusName }}
                    </span>
                </el-descriptions-item>
                <el-descriptions-item label="库位准确率">{{ infoData.accuracyRate !== null ? infoData.accuracyRate * 100 +
                    '%'
                    : ''
                    }}</el-descriptions-item>
                <el-descriptions-item label="涉及SKU数">{{ infoData.skuQty }}</el-descriptions-item>
                <el-descriptions-item label="涉及库位数">{{ infoData.locationQty }}</el-descriptions-item>

                <el-descriptions-item label="总盘盈数">
                    <span style="color: #67C23A; font-weight: bold">{{ infoData.totalAdd }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="总盘亏数">
                    <span style="color: #F56C6C; font-weight: bold">{{ infoData.totalSub }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ infoData.createdTime }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ infoData.updatedTime }}</el-descriptions-item>

                <el-descriptions-item label="备注" :span="4">{{ infoData.remark }}</el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="tabs-container">
            <el-tabs v-model="activeTab" type="border-card" class="custom-tabs">
                <el-tab-pane label="盘点明细" name="detail" class="full-height-pane">
                    <el-table :data="infoData.detailList" border stripe height="100%" style="width: 100%">
                        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
                        <el-table-column prop="locationCode" label="库位" width="150" show-overflow-tooltip
                            fixed="left" />
                        <el-table-column prop="sku" label="SKU" width="180" show-overflow-tooltip fixed="left" />
                        <el-table-column prop="barcode" label="条码" width="180" show-overflow-tooltip />
                        <el-table-column prop="qualityName" label="品质" width="100" align="center" />
                        <el-table-column prop="sysQty" label="系统数量" width="100" align="right" />
                        <el-table-column prop="firstCheckQty" label="一盘数量" width="100" align="right" />
                        <el-table-column prop="secondCheckQty" label="复盘数量" width="100" align="right" />
                        <el-table-column label="差异数量" width="100" align="right" fixed="right">
                            <template #default="{ row }">
                                <span :class="getDiffClass(calcDetailDiff(row))">
                                    {{ calcDetailDiff(row) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="firstCheckBy" label="初盘人" width="120" />
                        <el-table-column prop="firstCheckTime" label="初盘时间" width="170" />
                        <el-table-column prop="secondCheckBy" label="复盘人" width="120" />
                        <el-table-column prop="secondCheckTime" label="复盘时间" width="170" />
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="SKU统计" name="group" class="full-height-pane">
                    <el-table :data="infoData.detailGroupList" border stripe height="100%" style="width: 100%">
                        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
                        <el-table-column prop="sku" label="SKU" width="180" show-overflow-tooltip fixed="left" />
                        <el-table-column prop="barcode" label="条码" width="180" show-overflow-tooltip />
                        <el-table-column prop="qualityName" label="品质" width="100" align="center" />
                        <el-table-column prop="sysQty" label="系统数量" width="120" align="right" />
                        <el-table-column prop="firstCheckQty" label="一盘数量" width="120" align="right" />
                        <el-table-column prop="secondCheckQty" label="复盘数量" width="120" align="right" />
                        <el-table-column prop="diffQty" label="差异数量" width="120" align="right" fixed="right">
                            <template #default="{ row }">
                                <span :class="getDiffClass(row.diffQty)">
                                    {{ row.diffQty }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="库位信息" name="location" class="full-height-pane">
                    <el-table :data="infoData.locationList" border stripe height="100%" style="width: 100%">
                        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
                        <el-table-column prop="warehouseCode" label="仓库" width="150" show-overflow-tooltip />
                        <el-table-column prop="zoneCode" label="库区" width="150" show-overflow-tooltip />
                        <el-table-column prop="locationCode" label="库位" width="180" show-overflow-tooltip
                            fixed="left" />
                        <el-table-column prop="skuBarcodes" label="库位SKU条码" min-width="300" show-overflow-tooltip />
                        <el-table-column prop="createdBy" label="创建人" width="120" />
                        <el-table-column prop="createdTime" label="创建时间" width="170" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="footer-btn">
            <el-button @click="$router.back()">返回列表</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getInventoryCheckGetFullByIdAndTypeApi } from "@/api/inventoryApi/check.js";

const route = useRoute();
const loading = ref(false);
const activeTab = ref('detail');
const infoData = ref({
    checkNo: '',
    orgId: '',
    orgName: '',
    salesUserCode: '',
    customerId: '',
    customerName: '',
    warehouseId: '',
    warehouseCode: '',
    inOrderNo: '',
    sku: '',
    zoneCode: '',
    updatedTimeBegin: '',
    updatedTimeEnd: '',
    checkTypeId: 0,
    statusId: 0,
    remark: '',
    totalAdd: 0,
    totalSub: 0,
    accuracyRate: 0.0,
    skuQty: 0,
    locationQty: 0,
    createdTime: '',
    updatedTime: '',
    createdBy: '',
    updatedBy: '',
    isHaveEmptyLocation: false,
    isCanCreateStock: false,
    checkTypeName: '',
    statusName: '',
    detailList: [],
    detailGroupList: [],
    locationList: []
});

const calcDetailDiff = (row) => {
    const finalQty = row.secondCheckTime ? Number(row.secondCheckQty) : Number(row.firstCheckQty);
    return (finalQty || 0) - (Number(row.sysQty) || 0);
};

const getDiffClass = (val) => {
    return val !== 0 ? 'diff-text' : '';
};

const getDetail = async () => {
    const id = route.params.id;
    if (!id) return;

    loading.value = true;
    try {
        const res = await getInventoryCheckGetFullByIdAndTypeApi({ id: id, type: 1 });
        if (res.success) {
            infoData.value = res.data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    openMainLoading()
    getDetail();
    closeMainLoading()
});
</script>

<style scoped lang="scss">
.viewArea {
    height: calc(100vh - 110px);
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
}

/* 顶部卡片样式 */
.bill-info-section {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    flex-shrink: 0;

    .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #303133;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }
}

/* 强制固定宽度的 Descriptions 样式 */
.fixed-descriptions {
    :deep(table) {
        table-layout: fixed;
    }

    :deep(.el-descriptions__label) {
        width: 10%;
        text-align: center;
        color: #606266;
        font-weight: 500;
        background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
        width: 15%;
    }
}

.tabs-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.custom-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: none;
    box-shadow: none;

    :deep(.el-tabs__content) {
        flex: 1;
        padding: 10px 0 0 0;
        overflow: hidden;
    }

    :deep(.el-tabs__header) {
        margin-bottom: 0;
    }
}

.full-height-pane {
    height: 100%;
}

.footer-btn {
    flex-shrink: 0;
    margin-top: 10px;
    text-align: center;
    border-top: 1px solid #ebeef5;
    padding-top: 10px;
}

.diff-text {
    color: #F56C6C;
    font-weight: bold;
}
</style>