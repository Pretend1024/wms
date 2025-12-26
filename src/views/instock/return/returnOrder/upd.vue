<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>基础信息</p>
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
                        <el-form-item label="退件单号:">
                            <el-input v-model.trim="formData.orderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退件类型:" prop="typeId">
                            <el-select v-model="formData.typeId">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="原出库单号:" >
                            <el-input v-model.trim="formData.sourceOrderNo" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="formData.remark" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <p style="margin-top: 20px;">退件包裹</p>
            <div class="tableDiv">
                <returnOrderTable ref="parcelTableRef" :columns="parcelColumns" :data="parcelTableData"
                    @update:data="parcelTableData = $event" addButtonText="添加包裹">
                    <template #trackingNo="{ row }">
                        <el-input v-model="row.trackingNo" placeholder="请输入物流跟踪号" />
                    </template>
                    <template #carrierCode="{ row }">
                        <el-select v-model="row.carrierCode" placeholder="请选择承运商">
                            <el-option v-for="item in carrierOptions" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </template>
                    <template #length="{ row }">
                        <div style="display: flex;">
                            <el-input v-model="row.length" v-number placeholder="长" />
                            <el-input v-model="row.width" v-number placeholder="宽" />
                            <el-input v-model="row.height" v-number placeholder="高" />
                        </div>
                    </template>
                    <template #weight="{ row }">
                        <el-input v-model="row.weight" v-number placeholder="重量" />
                    </template>
                    <template #remark="{ row }">
                        <el-input v-model="row.remark" placeholder="备注" />
                    </template>
                </returnOrderTable>
            </div>

            <p style="margin-top: 20px;">退件商品</p>
            <div class="tableDiv">
                <receiptTable ref="forecastTableRef" :columns="forecastColumns" :data="forecastTableData"
                    :merge-cols="['sku', 'fnsku', 'barcode', 'productName', 'forecastQty', 'remark']"
                    :summary-columns="['forecastQty', 'receivedQty']" @update:data="forecastTableData = $event">
                    <template #sku="{ row }">
                        <el-input v-model="row.sku" placeholder="SKU" />
                    </template>
                    <template #fnsku="{ row }">
                        <el-input v-model="row.fnsku" placeholder="FNSKU" />
                    </template>
                    <template #barcode="{ row }">
                        <el-input v-model="row.barcode" placeholder="条码" />
                    </template>
                    <template #productName="{ row }">
                        <el-input v-model="row.productName" placeholder="品名" />
                    </template>
                    <template #forecastQty="{ row }">
                        <el-input v-model="row.forecastQty" v-number />
                    </template>
                    <template #qualityId="{ row }">
                        <el-select v-model="row.qualityId" placeholder="品质">
                            <el-option v-for="item in qualityOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </template>
                    <template #receivedQty="{ row }">
                        <el-input v-model="row.receivedQty" v-number placeholder="实收" />
                    </template>
                </receiptTable>
            </div>

            <p style="margin-top: 20px;">附件信息</p>
            <div class="uploadDiv">
                <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" drag :show-file-list="false"
                    multiple :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="5">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">拖放文件 或 <em>点击选择</em></div>
                    <template #tip>
                        <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                            <ul>
                                <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                                    <a :href="file.url" target="_blank" class="file-link">{{ file.name }}</a>
                                    <div @click="handleDeleteFile(index)" class="delete-btn">删除</div>
                                </li>
                            </ul>
                        </div>
                    </template>
                </el-upload>
            </div>

            <div class="bottomDiv">
                <el-button type="primary" @click="handleSubmit">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="编辑退件单">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import {
    getInstockReturnReturnOrderTypeEnumApi,
    updInstockReturnReturnOrderApi,
    getInstockReturnReturnOrderInfoApi
} from '@/api/instockApi/return.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { uploadApi } from '@/api/baseApi/index.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { getButtonText } from '@/utils/i18n/i18nLabels'
import returnOrderTable from '@/components/table/returnOrder-table.vue'
import receiptTable from '../returnOrderIn/receiptTable.vue' // 使用要求的路径
import tagsStore from '@/store/tags.js'
import { useRefreshStore } from '@/store/refresh.js'

const route = useRoute()
const router = useRouter()
const useTagsStore = tagsStore()
const refreshStore = useRefreshStore()

const props = defineProps({
    id: { type: String, default: '' }
});

const formRef = ref(null)
const formData = ref({
    id: '', orderNo: '', warehouseCode: '', customerCode: '', typeId: '', sourceOrderNo: '', remark: '', statusId: ''
})

const rules = {
    typeId: [{ required: true, message: '请选择退件类型', trigger: 'change' }],
}

// 表格配置
const parcelTableData = ref([])
const forecastTableData = ref([])
const parcelTableRef = ref(null)
const forecastTableRef = ref(null)
const uploadedFiles = ref([])
const fileList = ref([])

const parcelColumns = [
    { label: '物流跟踪号', prop: 'trackingNo', width: '220', slot: 'trackingNo', required: true },
    { label: '承运商', prop: 'carrierCode', width: '150', slot: 'carrierCode' },
    { label: '尺寸(CM) 长-宽-高', prop: 'length', width: '260', slot: 'length' },
    { label: '重量(KG)', prop: 'weight', width: '100', slot: 'weight' },
    { label: '备注', prop: 'remark', width: '200', slot: 'remark' },
]

const forecastColumns = [
    { label: 'SKU', prop: 'sku', width: '180', slot: 'sku', required: true },
    { label: 'FNSKU', prop: 'fnsku', width: '180', slot: 'fnsku' },
    { label: '品名', prop: 'productName', width: '180', slot: 'productName' },
    { label: '预报数量', prop: 'forecastQty', width: '120', slot: 'forecastQty', required: true },
    { label: '品质', prop: 'qualityId', width: '150', slot: 'qualityId' },
    { label: '清点数量', prop: 'receivedQty', width: '120', slot: 'receivedQty' },
    { label: '备注', prop: 'remark', width: '200', slot: 'remark' },
]

// 下拉数据
const warehouseOptions = ref([]); const customerOptions = ref([]); const typeOptions = ref([]);
const carrierOptions = ref([]); const qualityOptions = ref([]);

onMounted(async () => {
    const loading = ElLoading.service({ lock: true, text: 'Loading' })
    try {
        const [wh, type, carrier, quality, cust, info] = await Promise.all([
            getWhWarehouseApi(),
            getInstockReturnReturnOrderTypeEnumApi(),
            getProductShipwayBrandListApi(),
            getOrderQualityEnumApi(),
            getCustomerLikeQueryApi({ keyword: '*' }),
            getInstockReturnReturnOrderInfoApi({ id: props.id || route.query.id })
        ])

        warehouseOptions.value = wh.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }))
        typeOptions.value = type.data.map(i => ({ label: i.name, value: i.id }))
        carrierOptions.value = carrier.data.map(i => ({ label: i.name, value: i.code }))
        qualityOptions.value = quality.data.map(i => ({ label: i.name, value: i.id }))
        customerOptions.value = cust.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }))

        if (info.success) {
            formData.value = info.data
            parcelTableData.value = info.data.returnParcelList || []
            // 合并预报和实收数据用于展示
            forecastTableData.value = mergeData(info.data.returnProductList || [], info.data.returnReceiptList || [])
            uploadedFiles.value = (info.data.returnAttachmentList || []).map(f => ({
                name: f.attachmentName, url: f.attachmentUrl
            }))
        }
    } finally { loading.close() }
})

// 提交
const handleSubmit = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return
        const loading = ElLoading.service({ lock: true, text: 'Saving...' })
        try {
            const formattedGoods = forecastTableRef.value.getFormattedData()

            const submitData = {
                id: formData.value.id,
                sourceOrderNo: formData.value.sourceOrderNo,
                typeId: formData.value.typeId,
                statusId: formData.value.statusId,
                remark: formData.value.remark,
                // 包裹列表
                returnParcelAddDTOList: parcelTableRef.value.getData().map(p => ({ ...p, returnOrderId: formData.value.id })),
                // 商品列表 (去重后的预报)
                returnProductAddDTOList: Array.from(new Set(formattedGoods.map(g => g.sku))).map(sku => {
                    const origin = formattedGoods.find(g => g.sku === sku)
                    return { sku, fnsku: origin.fnsku, barcode: origin.barcode, productName: origin.productName, forecastQty: origin.forecastQty, remark: origin.remark }
                }),
                // 具体的清点实收详情
                receiptAddDTOList: formattedGoods.filter(g => g.receivedQty > 0).map(g => ({
                    returnOrderId: formData.value.id, sku: g.sku, qualityId: g.qualityId, receivedQty: g.receivedQty, remark: g.remark
                })),
                // 附件
                returnAttachmentAddDTOList: uploadedFiles.value.map(f => ({
                    returnOrderId: formData.value.id, attachmentName: f.name, attachmentUrl: f.url, isCustomerAdd: true
                }))
            }

            const res = await updInstockReturnReturnOrderApi(submitData)
            smartAlert(res.msg, res.success, 1000)
            if (res.success) {
                refreshStore.shouldRefreshReturnOrderList = true
                handleClose()
            }
        } finally { loading.close() }
    })
}

const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push('/instock/return/returnOrder/list')
}

// 上传
const beforeUpload = (file) => (uploadedFiles.value.length < 5) || (smartAlert('最多上传5个文件', false) && false)
const handleUpload = async (options) => {
    const res = await uploadApi(options.file, { path: 'temp' })
    if (res.success) uploadedFiles.value.push({ name: options.file.name, url: res.data })
}
const handleDeleteFile = (index) => uploadedFiles.value.splice(index, 1)

// 合并函数逻辑
function mergeData(forecast, receipt) {
    const result = []
    const skuMap = new Map()
    forecast.forEach(f => skuMap.set(f.sku, { ...f, receivedQty: 0, qualityId: 10 }))
    receipt.forEach(r => {
        if (skuMap.has(r.sku)) {
            const existing = skuMap.get(r.sku)
            if (existing._used) {
                result.push({ ...existing, forecastQty: 0, receivedQty: r.receivedQty, qualityId: r.qualityId })
            } else {
                existing.receivedQty = r.receivedQty
                existing.qualityId = r.qualityId
                existing._used = true
                result.push(existing)
            }
        } else {
            result.push({ ...r, forecastQty: 0 })
        }
    })
    forecast.forEach(f => { if (!skuMap.get(f.sku)._used) result.push(skuMap.get(f.sku)) })
    return result.map(({ _used, ...rest }) => rest)
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.tableDiv {
    width: 1200px;
    margin-bottom: 20px;
}

.uploadDiv {
    width: 1200px;
}

.bottomDiv {
    width: 1200px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.uploaded-files {
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-top: 10px;

    ul {
        padding: 0 15px;
        list-style: none;
    }

    .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px dashed #ddd;
    }

    .file-link {
        color: #409eff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    .delete-btn {
        color: #f56c6c;
        cursor: pointer;
        font-size: 14px;
        margin-left: 20px;
    }
}
</style>