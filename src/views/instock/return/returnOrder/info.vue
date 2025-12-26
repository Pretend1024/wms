<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>基础信息</p>
            <el-form :model="formData" :rules='rules' ref="formRef" label-width="115px">
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
            <p style="margin-top: 20px;">退件包裹</p>
            <div class="tableDiv">
                <returnParcelTable ref="parcelTableRef" :columns="parcelColumns" :data="parcelTableData"
                    @update:data="parcelTableData = $event">
                    <template #trackingNo="{ row }">
                        <el-input v-model="row.trackingNo" placeholder="请输入物流跟踪号" readonly />
                    </template>
                    <template #carrierCode="{ row }">
                        <el-select v-model="row.carrierCode" placeholder="请选择承运商" :disabled="row.id">
                            <el-option v-for="item in carrierOptions" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </template>
                    <template #length="{ row }">
                        <div style="display: flex;">
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
                            :active-value=2 :inactive-value=1 disabled />
                    </template>
                </returnParcelTable>
            </div>
            <p style="margin-top: 20px;">退件商品</p>
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
            <p style="margin-top: 20px;margin-bottom: 0;">附件信息</p>
            <div class="uploadDiv">
                <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                    <ul>
                        <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                            <a :href="file.url" target="_blank" rel="noopener noreferrer" class="file-link">
                                {{ file.name }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-if="uploadedFiles.length <= 0">
                    暂无附件
                </div>
            </div>
            <div class="bottomDiv">
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="退件单详情">
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import { getInstockReturnReturnOrderTypeEnumApi, getInstockReturnReturnParcelStatusEnumApi, getInstockReturnReturnOrderInfoApi } from '@/api/instockApi/return.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import receiptTable from './receiptTable.vue'
import returnParcelTable from './returnParcelTable.vue'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()

const poros = defineProps({
    id: {
        type: String,
        default: ''
    }
});

const formRef = ref(null);
// 表单数据
const formData = ref({
    orderNo: '', // 退件单号
    warehouseCode: '', // 仓库代码
    customerCode: '', // 客户代码
    typeId: '', // 退件类型
    sourceOrderNo: '', // 原出库单号
    remark: '' // 备注
});

const rules = {
    typeId: [
        { required: true, message: '请选择退件类型', trigger: 'change' }
    ],
    warehouseCode: [
        { required: true, message: '请选择仓库代码', trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请选择客户代码', trigger: 'change' }
    ],
    orderNo: [
        { required: true, message: '请输入退件单号', trigger: 'blur' }
    ]
};

// 表格数据
const parcelTableData = ref([]);
const forecastTableData = ref([]);
const parcelTableRef = ref(null);
const forecastTableRef = ref(null);
const parcelColumns = [
    { label: '物流跟踪号', prop: 'trackingNo', width: '220', slot: 'trackingNo' },
    { label: '承运商', prop: 'carrierCode', width: '150', slot: 'carrierCode' },
    { label: '尺寸(CM) 长-宽-高', prop: 'length', width: '250', slot: 'length' },
    { label: '重量(KG)', prop: 'weight', width: '120', slot: 'weight' },
    { label: '备注', prop: 'remark', width: '240', slot: 'remark' },
    { label: '是否签收', prop: 'sign', width: '85', slot: 'sign' },
]
const forecastColumns = [
    { label: 'SKU', prop: 'sku', width: '180', slot: 'sku' },
    { label: 'FNSKU', prop: 'fnsku', width: '180', slot: 'fnsku' },
    { label: '预报数量', prop: 'forecastQty', width: '120', slot: 'forecastQty' },
    { label: '备注', prop: 'remark', width: '240', slot: 'remark' },
    { label: '品质', prop: 'qualityId', width: '150', slot: 'qualityId' },
    { label: '清点数量', prop: 'receivedQty', width: '120', slot: 'receivedQty' },
]

// 上传文件相关
const uploadedFiles = ref([]) // 存储已上传的文件信息（包含名称和地址）

// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/instock/return/returnOrder/list' })
}
// 筛选客户代码
const customerOptions = ref([]);
// 仓库下拉框数据
const warehouseOptions = ref([])
// 类型下拉框数据
const typeOptions = ref([])
// 承运商下拉框数据
const carrierOptions = ref([])
// 退件包裹状态下拉框数据
const statusOptions = ref([])
// 商品品质
const qualityOptions = ref([])
onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        target: ".contentDiv",
        text: 'Loading'
    })
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    // 退件包裹品质
    const OptionsRes = await getOrderQualityEnumApi()
    qualityOptions.value = OptionsRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    // 退件类型
    const typeRes = await getInstockReturnReturnOrderTypeEnumApi()
    typeOptions.value = typeRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    // 承运商数据
    const carrierRes = await getProductShipwayBrandListApi()
    carrierOptions.value = carrierRes.data.map(item => ({
        label: item.name,
        value: item.code
    }))
    // 退件包裹状态
    const statusRes = await getInstockReturnReturnParcelStatusEnumApi()
    statusOptions.value = statusRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 获取详情
    const res = await getInstockReturnReturnOrderInfoApi({ id: poros.id });
    if (res.success) {
        formData.value = res.data;
        parcelTableData.value = res.data.returnParcelList || [];
        forecastTableData.value = mergeForecastAndReceipt(
            res.data.returnProductList || [],
            res.data.returnReceiptList || []
        );

        if (res.data.returnAttachmentList.length > 0) {
            uploadedFiles.value = res.data.returnAttachmentList.map(file => ({
                name: file.attachmentName,
                url: file.attachmentUrl
            }));
        }
    }
    loading.close();
})
function mergeForecastAndReceipt(forecastList, receiptList) {
    const result = [];
    const skuGroupMap = new Map();

    // 先生成 forecast 的 groupId
    forecastList.forEach(item => {
        const gid = 'group_' + item.sku;
        item._groupId = gid;
        skuGroupMap.set(item.sku, gid);
    });

    // 遍历 receiptList
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

    // 添加 forecast 中没有被 receipt 覆盖的 SKU
    forecastList.forEach(forecast => {
        const exists = receiptList.some(r => r.sku === forecast.sku);
        if (!exists) {
            result.push({ ...forecast });
        }
    });

    //确保同一个 SKU 下只有一个对象 forecastQty 有值
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
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.bottomDiv {
    width: 1200px;
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.uploadDiv {
    width: 1200px;
}

// 上传样式
.uploaded-files {
    background-color: #f5f7fa;
    border-radius: 4px;

    ul {
        padding: 0 10px;
        font-size: 16px;
    }
}

.file-item {
    display: flex;
    align-items: center;
    margin: 3px 0;
    padding: 8px 0;
    border-bottom: 1px dashed #e4e7ed;
}

.file-item:last-child {
    border-bottom: none;
}

.file-link {
    word-break: break-all;
    color: #409eff;
    text-decoration: none;
}

.file-link:hover {
    text-decoration: underline;
}

:deep(.el-upload-dragger) {
    padding: 5px 0;
}
</style>