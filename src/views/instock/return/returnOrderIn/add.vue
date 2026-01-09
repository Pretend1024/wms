<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>退件信息</p>
            <el-row>
                <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 20px;">
                    <el-select v-model="orderData.numberType" @change="getOrderInfo" style="width: 113px;">
                        <el-option v-for="item in numberTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <span style="padding: 12px 12px 12px 3px;">:</span>
                    <el-input v-model.trim="orderData.number" :autofocus='true' style="width: 400px;"
                        @keyup.enter.stop="getOrderInfo" ref="numberInput" />
                    <el-button type="danger" plain :icon="RefreshLeft" style="margin-left: 10px;" @click="reset">{{
                        getButtonText('reset') }}</el-button>
                    <span :style="{ color: message.type ? 'green' : 'red', fontSize: '16px', marginLeft: '10px' }">{{
                        message.content }}</span>
                </el-col>
            </el-row>

            <el-form :model="orderInfo" ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="仓库代码:">
                            <el-select v-model="orderInfo.warehouseCode" disabled>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户代码:">
                            <el-select v-model="orderInfo.customerCode" disabled>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退件单号:" prop="orderNo">
                            <el-input v-model.trim="orderInfo.orderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退件类型:" prop="typeId">
                            <el-select v-model="orderInfo.typeId" disabled>
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="原出库单号:" prop="sourceOrderNo">
                            <el-input v-model.trim="orderInfo.sourceOrderNo" readonly />
                        </el-form-item>
                    </el-col>

                    <el-col :span="18">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="orderInfo.remark" readonly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div v-show="orderInfo.id">
                <p>包裹签收</p>
                <div class="tableDiv">
                    <returnParcelTable ref="parcelTableRef" :columns="parcelColumns" :data="parcelTableData"
                        @update:data="parcelTableData = $event">
                        <template #trackingNo="{ row }">
                            <el-input v-model="row.trackingNo" placeholder="请输入物流跟踪号" :readonly="row.id" />
                        </template>
                        <template #carrierCode="{ row }">
                            <el-select v-model="row.carrierCode" placeholder="请选择承运商" :disabled="row.id">
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
                            <el-input v-model="row.weight" v-number placeholder="输入重量" />
                        </template>
                        <template #remark="{ row }">
                            <el-input v-model="row.remark" placeholder="请输入备注" />
                        </template>
                        <template #sign="{ row }">
                            <el-switch v-model="row.statusId" inline-prompt active-text="是" inactive-text="否"
                                :active-value=2 :inactive-value=1 />
                        </template>
                    </returnParcelTable>
                </div>

                <p>商品清点</p>
                <div class="tableDiv">
                    <receiptTable :columns="forecastColumns" :data="forecastTableData"
                        :merge-cols="['sku', 'fnsku', 'barcode', 'productName', 'forecastQty', 'remark']"
                        index-label="序号" summary-label="合计" :summary-columns="['forecastQty', 'receivedQty']"
                        @update:data="forecastTableData = $event" ref="mergeTableRef">
                        <template #sku="{ row }">
                            <el-input v-model="row.sku" placeholder="请输入/扫描sku" :readonly="row.id" />
                        </template>
                        <template #fnsku="{ row }">
                            <el-input v-model="row.fnsku" placeholder="请输入FNSKU" :readonly="row.id" />
                        </template>
                        <template #forecastQty="{ row }">
                            <el-input v-model="row.forecastQty" v-number placeholder="输入预报数量" :readonly="row.id" />
                        </template>
                        <template #qualityId="{ row }">
                            <el-select v-model="row.qualityId" placeholder="请选择品质">
                                <el-option v-for="item in qualityOptions" :label="item.label" :value="item.value"
                                    :key="item.value" />
                            </el-select>
                        </template>
                        <template #receivedQty="{ row }">
                            <el-input v-model="row.receivedQty" v-number placeholder="输入清点数量" />
                        </template>
                    </receiptTable>
                </div>

                <p style="margin-top: 20px;">附件信息</p>
                <div class="uploadDiv">
                    <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" :show-file-list="false"
                        multiple :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload"
                        :limit="5">
                        <el-button type="primary">文件上传</el-button>
                        <template #tip>
                            <div class="tip">
                                <div class="uploaded-files">
                                    <ul>
                                        <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                                            <a :href="file.url" target="_blank" rel="noopener noreferrer"
                                                class="file-link">
                                                {{ file.name }}
                                            </a>
                                            <div @click="handleDeleteFile(index)" class="delete-btn"
                                                v-if="!file.isCustomerAdd">
                                                删除
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                    </el-upload>
                </div>

                <div class="bottomDiv">
                    <el-button type="primary" @click="handleSubmit">提交入库</el-button>
                </div>
            </div>
        </div>

        <el-dialog v-model="centerDialogVisible" title="选择订单" width="700" align-center destroy-on-close>
            <el-table :data="orderList" highlight-current-row :current-row-key="selectOrder.id" :stripe="true"
                style="width: 100%;" :height="400" border @row-click="handleRowClick" @row-dblclick="handleRowDblClick">
                <el-table-column prop="warehouseCode" label="仓库代码" width="110"></el-table-column>
                <el-table-column prop="customerCode" label="客户代码" width="110"></el-table-column>
                <el-table-column prop="orderNo" label="退件单号" width="180"> </el-table-column>
                <el-table-column prop="statusName" label="状态" width="100"> </el-table-column>
                <el-table-column prop="createdTime" label="创建时间" width="170"></el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false, selectOrder = {}">{{ getButtonText('cancel')
                        }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-alert v-if="showAlert" :title="alertMessage" :type="alertType" center show-icon @close="showAlert = false"
            style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;height: 120px; width: 700px; font-size: 18px;" />
    </div>
</template>

<script setup name="退货入库">
import { getInstockReturnReturnOrderTypeEnumApi, signAndCountInstockReturnApi, addReturnOrderClaimApi } from '@/api/instockApi/return.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import receiptTable from './receiptTable.vue'
import returnParcelTable from './returnParcelTable.vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { getReturnOrderListByNumberTypeApi } from '@/api/instockApi/return.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { uploadApi } from '@/api/baseApi/index.js'
import { ref, nextTick, onMounted, onActivated } from 'vue'
import { ElLoading, ElMessageBox } from 'element-plus'

// 查询条件
const orderData = ref({
    number: '', // 订单号
    numberType: 2, // 订单号类型：2-退件单号，1-跟踪单号
})
const numberTypeOptions = [
    { value: 2, label: '退件单号' },
    { value: 1, label: '跟踪单号' }
]

// 订单选择列表数据（用于多条匹配时）
const centerDialogVisible = ref(false)
const orderList = ref([])

// 顶部操作反馈信息
const message = ref({
    type: true,
    content: ''
})

// 订单详细信息
const orderInfo = ref({})
const selectOrder = ref({}) // 弹窗中选中的订单

// 表格行点击事件
const handleRowClick = (row) => {
    selectOrder.value = row;
};

// 表格行双击事件
const handleRowDblClick = (row) => {
    selectOrder.value = row;
    handleDialogConfirm();
};

// 弹窗确认选择订单
const handleDialogConfirm = async () => {
    // 填充表单数据
    orderInfo.value = selectOrder.value;
    // 填充包裹表格
    parcelTableData.value = selectOrder.value.returnParcelList || [];
    // 填充并合并商品表格数据
    forecastTableData.value = mergeForecastAndReceipt(
        selectOrder.value.returnProductList || [],
        selectOrder.value.returnReceiptList || []
    );
    // 填充附件列表
    if (selectOrder.value.returnAttachmentList) {
        uploadedFiles.value = selectOrder.value.returnAttachmentList.map(item => ({
            name: item.attachmentName,
            url: item.attachmentUrl,
            id: item.id,
            isCustomerAdd: item.isCustomerAdd
        }));
    }
    centerDialogVisible.value = false;
}

// 核心方法：获取订单详情（扫码或回车触发）
const getOrderInfo = async () => {
    orderInfo.value = {};
    if (!orderData.value.numberType) return
    if (!orderData.value.number) return

    try {
        const res = await getReturnOrderListByNumberTypeApi(orderData.value)

        // 场景1：匹配到多条订单，弹出选择框
        if (res.success && res.data.length > 1) {
            orderList.value = res.data;
            centerDialogVisible.value = true;
        }
        // 场景2：匹配到唯一一条订单，直接渲染
        else if (res.success && res.data.length == 1) {
            orderInfo.value = res.data[0];
            parcelTableData.value = res.data[0].returnParcelList || [];
            forecastTableData.value = mergeForecastAndReceipt(
                res.data[0].returnProductList || [],
                res.data[0].returnReceiptList || []
            );
            uploadedFiles.value = res.data[0].returnAttachmentList.map(item => ({
                name: item.attachmentName,
                url: item.attachmentUrl,
                id: item.id,
                isCustomerAdd: item.isCustomerAdd
            }));
        }
        if (res.success === false) {
            smartAlert(res.msg, false)
        }

        // 设置顶部反馈信息
        message.value = {
            type: res.success,
            content: res.msg
        }
    } catch (error) {
        console.error('获取订单详情失败:', error)
    }
}

// 重置页面状态
const reset = () => {
    // 重置查询条件
    orderData.value.number = '';
    orderData.value.numberType = 2;

    // 重置数据对象
    orderInfo.value = {};
    selectOrder.value = {};
    message.value = { type: true, content: '' };

    // 重置表格与列表
    parcelTableData.value = [];
    forecastTableData.value = [];
    orderList.value = [];
    uploadedFiles.value = [];
    fileList.value = [];

    // 重置提示框
    showAlert.value = false;
    alertMessage.value = '';
    alertType.value = 'success';

    // 重新聚焦输入框
    focusInput();
}

// 表格响应式数据
const parcelTableData = ref([]);
const forecastTableData = ref([]);
const parcelTableRef = ref(null);
const mergeTableRef = ref();

// 表格列定义
const parcelColumns = [
    { label: '物流跟踪号', prop: 'trackingNo', width: '220', slot: 'trackingNo' },
    { label: '承运商', prop: 'carrierCode', width: '160', slot: 'carrierCode' },
    { label: '尺寸(CM) 长-宽-高', prop: 'length', width: '250', slot: 'length' },
    { label: '重量(KG)', prop: 'weight', width: '120', slot: 'weight' },
    { label: '备注', prop: 'remark', width: '300', slot: 'remark' },
    { label: '是否签收', prop: 'sign', width: '85', slot: 'sign' },
]
const forecastColumns = [
    { label: 'SKU', prop: 'sku', width: '265', slot: 'sku' },
    { label: 'FNSKU', prop: 'fnsku', width: '245', slot: 'fnsku' },
    { label: '预报数量', prop: 'forecastQty', width: '170', slot: 'forecastQty' },
    { label: '品质', prop: 'qualityId', width: '180', slot: 'qualityId' },
    { label: '清点数量', prop: 'receivedQty', width: '160', slot: 'receivedQty' },
]

// 文件列表及上传状态
const fileList = ref([])
const uploadedFiles = ref([])

// 文件上传前校验
const beforeUpload = (file) => {
    if (uploadedFiles.value.length >= 9) {
        smartAlert('最多上传9个文件', false)
        return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        smartAlert('上传文件大小不能超过 2MB!', false)
        return false
    }
    return true
}

// 自定义上传逻辑
const handleUpload = async (options) => {
    try {
        const res = await uploadApi(options.file, { path: 'temp' })
        if (res.success) {
            uploadedFiles.value.push({
                name: options.file.name,
                url: res.data,
                isCustomerAdd: false
            })
            smartAlert(`文件 "${options.file.name}" 上传成功`, true, 1000)
        } else {
            smartAlert(`文件 "${options.file.name}" 上传失败: ${res.msg}`, false)
        }
    } catch (error) {
        console.error('上传失败:', error)
        smartAlert(`文件 "${options.file.name}" 上传失败`, false)
    }
}

// 删除附件
const handleDeleteFile = (index) => {
    uploadedFiles.value.splice(index, 1)
}

// 提交入库数据
const handleSubmit = async () => {
    const receiptAddDTOList = mergeTableRef.value.getFormattedData()
    const data = {
        customerCode: orderInfo.value.customerCode,
        orderno: orderInfo.value.orderNo,
        sourceOrderNo: orderInfo.value.sourceOrderNo,
        warehouseCode: orderInfo.value.warehouseCode,
        receiptAddDTOList,
        returnParcelAddDTOList: parcelTableData.value,
        returnAttachmentAddDTOList: uploadedFiles.value.map(item => ({
            attachmentName: item.name,
            attachmentUrl: item.url,
            returnOrderId: orderInfo.value.id,
            isCustomerAdd: item.isCustomerAdd
        }))
    }
    const res = await signAndCountInstockReturnApi(data)
    smartAlert(res.msg, res.success, 1000)
    if (res.success) {
        // 提交成功后重新获取最新信息
        getOrderInfo()
    }
};

// 下拉选项数据源
const customerOptions = ref([]);
const warehouseOptions = ref([])
const typeOptions = ref([])
const carrierOptions = ref([])
const qualityOptions = ref([])

// 初始化加载基础数据
onMounted(async () => {
    // 并行获取基础枚举和配置数据
    const [warehouseRes, typeRes, carrierRes, qualityRes, customerRes] = await Promise.all([
        getWhWarehouseApi(),
        getInstockReturnReturnOrderTypeEnumApi(),
        getProductShipwayBrandListApi(),
        getOrderQualityEnumApi(),
        getCustomerLikeQueryApi({ keyword: '*' })
    ])

    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    typeOptions.value = typeRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    carrierOptions.value = carrierRes.data.map(item => ({
        label: item.name,
        value: item.code
    }))
    qualityOptions.value = qualityRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))

    focusInput()
})

// 页面激活时聚焦输入框
onActivated(() => {
    focusInput()
})

const numberInput = ref(null)
// 聚焦单号输入框
function focusInput() {
    nextTick(() => {
        numberInput.value?.focus?.()
    })
}

// 全局 Alert 控制
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');

// 数据合并逻辑：合并预报数据和实收数据
function mergeForecastAndReceipt(forecastList, receiptList) {
    const result = [];
    const skuGroupMap = new Map();

    // 1. 标记预报数据组
    forecastList.forEach(item => {
        const gid = 'group_' + item.sku;
        item._groupId = gid;
        skuGroupMap.set(item.sku, gid);
    });

    // 2. 匹配实收数据
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

    // 3. 补充未操作的预报数据
    forecastList.forEach(forecast => {
        const exists = receiptList.some(r => r.sku === forecast.sku);
        if (!exists) {
            result.push({ ...forecast });
        }
    });

    // 4. 清理显示的预报数量（仅保留该SKU组的第一条显示预报数）
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

.tableDiv {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    min-height: 100px;
}

.btnMargin {
    margin-bottom: 10px;
}

:deep(.highlight) {
    background: #ffe58f;
    color: #333;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
}

:deep(.el-alert__title) {
    font-size: 20px;
}

.bottomDiv {
    margin-top: 10px;
    width: 1200px;
    display: flex;
    justify-content: center;
}

.uploaded-files {
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-top: 5px;

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

.delete-btn {
    color: #f56c6c;
    padding: 8px;
    font-size: 16px;
    margin-left: auto;
}

.delete-btn:hover {
    cursor: pointer;
    background-color: #f56c6c23;
}
</style>