<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p class="section-title">基础信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="仓库代码:" prop="warehouseCode">
                            <el-select v-model="formData.warehouseCode" placeholder="请选择仓库代码" clearable disabled>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户代码:" prop="customerCode">
                            <el-select v-model="formData.customerCode" filterable placeholder="请输入客户代码"
                                popper-class="multi-column-select" clearable disabled>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退件类型:" prop="typeId">
                            <el-select v-model="formData.typeId" disabled>
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退件单号:">
                            <el-input v-model.trim="formData.orderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="原出库单号:">
                            <el-input v-model.trim="formData.sourceOrderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <el-input v-model.trim="formData.statusName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="formData.remark" readonly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <p class="section-title" style="margin-top: 20px;">退件包裹</p>
            <div class="tableDiv">
                <returnParcelTable ref="parcelTableRef" :columns="parcelColumns" :data="parcelTableData"
                    @update:data="parcelTableData = $event">
                    <template #trackingNo="{ row }">
                        <el-input v-model="row.trackingNo" placeholder="请输入物流跟踪号" readonly />
                    </template>
                    <template #carrierCode="{ row }">
                        <el-select v-model="row.carrierCode" placeholder="请选择承运商" :disabled="true">
                            <el-option v-for="item in carrierOptions" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </template>
                    <template #length="{ row }">
                        <div class="size-display-group">
                            <el-input v-model="row.length" v-number placeholder="长" readonly />
                            <el-input v-model="row.width" v-number placeholder="宽" readonly />
                            <el-input v-model="row.height" v-number placeholder="高" readonly />
                        </div>
                    </template>
                    <template #weight="{ row }">
                        <el-input v-model="row.weight" v-number placeholder="输入重量" readonly />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" placeholder="请输入备注" readonly />
                    </template>
                    <template #sign="{ row }">
                        <el-switch v-model="row.statusId" inline-prompt active-text="是" inactive-text="否"
                            :active-value="2" :inactive-value="1" disabled />
                    </template>
                </returnParcelTable>
            </div>

            <p class="section-title" style="margin-top: 20px;">退件商品</p>
            <div class="tableDiv">
                <receiptTable :columns="forecastColumns" :data="forecastTableData"
                    :merge-cols="['sku', 'fnsku', 'barcode', 'forecastQty', 'remark']" index-label="序号"
                    summary-label="合计" :summary-columns="['forecastQty', 'receivedQty']"
                    @update:data="forecastTableData = $event" ref="forecastTableRef">
                    <template #sku="{ row }">
                        <el-input v-model="row.sku" placeholder="请输入/扫描sku" readonly />
                    </template>
                    <template #fnsku="{ row }">
                        <el-input v-model="row.fnsku" placeholder="请输入FNSKU" readonly />
                    </template>
                    <template #forecastQty="{ row }">
                        <el-input v-model="row.forecastQty" v-number placeholder="输入预报数量" readonly />
                    </template>
                    <template #qualityId="{ row }">
                        <el-select v-model="row.qualityId" placeholder="请选择品质" disabled>
                            <el-option v-for="item in qualityOptions" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </template>
                    <template #receivedQty="{ row }">
                        <el-input v-model="row.receivedQty" v-number placeholder="输入清点数量" readonly />
                    </template>
                </receiptTable>
            </div>

            <p class="section-title" style="margin-top: 20px;">附件信息</p>
            <div class="uploadDiv">
                <div class="attachment-container">
                    <ul v-if="uploadedFiles.length > 0" class="file-list-ul">
                        <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                            <div class="file-info">
                                <el-icon>
                                    <Document />
                                </el-icon>
                                <a :href="file.url" target="_blank" rel="noopener noreferrer" class="file-link">
                                    {{ file.name }}
                                </a>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="empty-files">
                        <el-empty :image-size="40" description="暂无附件" />
                    </div>
                </div>
            </div>

            <div class="bottomDiv">
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="退件单详情">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import router from '@/router/index.js'
import tagsStore from '@/store/tags.js'

// API 接口
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import {
    getInstockReturnReturnOrderTypeEnumApi,
    getInstockReturnReturnParcelStatusEnumApi,
    getInstockReturnReturnOrderInfoApi
} from '@/api/instockApi/return.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getButtonText } from '@/utils/i18n/i18nLabels'

// 组件
import receiptTable from './receiptTable.vue'
import returnParcelTable from './returnParcelTable.vue'

/**
 * 基础配置与变量定义
 */
const route = useRoute()
const useTagsStore = tagsStore()

const poros = defineProps({
    id: { type: String, default: '' }
});

const formRef = ref(null);
const parcelTableRef = ref(null);
const forecastTableRef = ref(null);

// 表单及表格数据
const formData = ref({
    orderNo: '', warehouseCode: '', customerCode: '', typeId: '', sourceOrderNo: '', remark: '', statusName: ''
});
const parcelTableData = ref([]);
const forecastTableData = ref([]);
const uploadedFiles = ref([]);

// 下拉选框配置
const customerOptions = ref([]);
const warehouseOptions = ref([]);
const typeOptions = ref([]);
const carrierOptions = ref([]);
const statusOptions = ref([]);
const qualityOptions = ref([]);

// 表格列定义
const parcelColumns = [
    { label: '物流跟踪号', prop: 'trackingNo', width: '240', slot: 'trackingNo' },
    { label: '承运商', prop: 'carrierCode', width: '180', slot: 'carrierCode' },
    { label: '尺寸(CM) 长-宽-高', prop: 'length', width: '265', slot: 'length' },
    { label: '重量(KG)', prop: 'weight', width: '120', slot: 'weight' },
    { label: '备注', prop: 'remark', width: '255', slot: 'remark' },
    { label: '是否签收', prop: 'sign', width: '85', slot: 'sign' },
]
const forecastColumns = [
    { label: 'SKU', prop: 'sku', width: '235', slot: 'sku' },
    { label: 'FNSKU', prop: 'fnsku', width: '210', slot: 'fnsku' },
    { label: '预报数量', prop: 'forecastQty', width: '120', slot: 'forecastQty' },
    { label: '备注', prop: 'remark', width: '280', slot: 'remark' },
    { label: '品质', prop: 'qualityId', width: '150', slot: 'qualityId' },
    { label: '清点数量', prop: 'receivedQty', width: '150', slot: 'receivedQty' },
]

/**
 * 生命周期与初始化
 */
onMounted(async () => {
    openMainLoading()
    try {
        // 并发加载所有基础数据及枚举
        const [warehouseRes, qualityRes, typeRes, carrierRes, statusRes, customerRes] = await Promise.all([
            getWhWarehouseApi(),
            getOrderQualityEnumApi(),
            getInstockReturnReturnOrderTypeEnumApi(),
            getProductShipwayBrandListApi(),
            getInstockReturnReturnParcelStatusEnumApi(),
            getCustomerLikeQueryApi({ keyword: '*' })
        ]);

        warehouseOptions.value = warehouseRes.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }));
        qualityOptions.value = qualityRes.data.map(i => ({ label: i.name, value: i.id }));
        typeOptions.value = typeRes.data.map(i => ({ label: i.name, value: i.id }));
        carrierOptions.value = carrierRes.data.map(i => ({ label: i.name, value: i.code }));
        statusOptions.value = statusRes.data.map(i => ({ label: i.name, value: i.id }));
        customerOptions.value = customerRes.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }));

        // 获取详情数据
        const res = await getInstockReturnReturnOrderInfoApi({ id: poros.id });
        if (res.success) {
            formData.value = res.data;
            parcelTableData.value = res.data.returnParcelList || [];
            // 合并逻辑（保留原有功能实现）
            forecastTableData.value = mergeForecastAndReceipt(
                res.data.returnProductList || [],
                res.data.returnReceiptList || []
            );

            if (res.data.returnAttachmentList && res.data.returnAttachmentList.length > 0) {
                uploadedFiles.value = res.data.returnAttachmentList.map(file => ({
                    name: file.attachmentName,
                    url: file.attachmentUrl
                }));
            }
        }
    } catch (error) {
        console.error('初始化数据加载失败', error);
    }
    closeMainLoading()
})

/**
 * 业务逻辑函数
 */

// 1. 合并预报商品与实收明细：保留原有逻辑结构，仅整理注释
function mergeForecastAndReceipt(forecastList, receiptList) {
    const result = [];
    const skuGroupMap = new Map();

    // 初始化 SKU 分组标识
    forecastList.forEach(item => {
        const gid = 'group_' + item.sku;
        item._groupId = gid;
        skuGroupMap.set(item.sku, gid);
    });

    // 处理实收数据：匹配对应的预报 SKU 或作为新项
    receiptList.forEach(receipt => {
        const matchedForecast = forecastList.find(f => f.sku === receipt.sku);
        if (matchedForecast) {
            result.push({
                ...matchedForecast,
                qualityId: receipt.qualityId,
                receivedQty: receipt.receivedQty,
                _groupId: matchedForecast._groupId
            });
        } else {
            result.push({
                ...receipt,
                forecastQty: 0,
                _groupId: 'group_' + receipt.sku
            });
        }
    });

    // 补充只有预报而没有实收的 SKU
    forecastList.forEach(forecast => {
        const exists = receiptList.some(r => r.sku === forecast.sku);
        if (!exists) {
            result.push({ ...forecast });
        }
    });

    // 格式化处理：确保同一 SKU 在列表展示中只有首行显示预报总数（用于表格合并）
    const seenSku = new Set();
    result.forEach(item => {
        if (seenSku.has(item.sku)) {
            item.forecastQty = 0;
        } else {
            seenSku.add(item.sku);
        }
    });

    return result;
}

// 2. 关闭并返回列表
const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/instock/return/returnOrder/list' })
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form,
.tableDiv,
.uploadDiv,
.bottomDiv {
    width: 1200px;
}

.size-display-group {
    display: flex;
    gap: 4px;
}

// 附件列表优化样式
.attachment-container {
    background-color: #f8f9fb;
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #ebeef5;

    .file-list-ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .file-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px dashed #e4e7ed;
        transition: background 0.3s;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background: #fff;
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;

            .el-icon {
                color: #909399;
            }

            .file-link {
                color: #409eff;
                text-decoration: none;
                word-break: break-all;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .empty-files {

        :deep(.el-empty__description) {
            margin-top: 5px;
        }

        :deep(.el-empty) {
            padding: 20px 0;
        }
    }
}

.bottomDiv {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-bottom: 30px;
}
</style>