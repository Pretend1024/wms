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
                    <el-button type="danger" plain :icon="RefreshLeft" style="margin-left: 10px;"
                        @click="reset">{{ getButtonText('reset') }}</el-button>
                    <div class="isContinuousBlock" v-show="orderData.numberType == 1">
                        <span>自动提交</span>
                        <el-popover content="是否自动提交未匹配到的跟踪单号至待认领？" placement="bottom">
                            <template #reference>
                                <el-icon size="16" style="flex: 1;">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                        </el-popover>
                        <span style="padding: 0 12px 0 3px;">:</span>
                        <el-switch v-model="isContinuousSubmit" inline-prompt active-text="是" inactive-text="否" />
                    </div>
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
                        <template #barcode="{ row }">
                            <el-input v-model="row.barcode" placeholder="请输入商品条码" :readonly="row.id" />
                        </template>
                        <template #productName="{ row }">
                            <el-input v-model="row.productName" placeholder="请输入商品名称" :readonly="row.id" />
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
        <!-- 订单选择弹窗 -->
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

<script setup name="退件入库">
import { getInstockReturnReturnOrderTypeEnumApi, signInstockReturnApi, countInstockReturnApi, addReturnOrderClaimApi, signAndCountInstockReturnApi } from '@/api/instockApi/return.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import receiptTable from './receiptTable.vue'
import returnParcelTable from './returnParcelTable.vue'
import { RefreshLeft, QuestionFilled } from '@element-plus/icons-vue'
import { getReturnOrderListByNumberTypeApi } from '@/api/instockApi/return.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { uploadApi } from '@/api/baseApi/index.js'
// 查询条件
const orderData = ref({
    number: '', // 订单号
    numberType: 2, // 订单号类型
})
const numberTypeOptions = [
    { value: 2, label: '退件单号' },
    { value: 1, label: '跟踪单号' }
]
// 订单弹窗
const centerDialogVisible = ref(false)
const orderList = ref([])
// 提示信息
const message = ref({
    type: true,
    content: ''
})

// 订单信息
const orderInfo = ref({})
const selectOrder = ref({})
// 点击表格行的方法
const handleRowClick = (row) => {
    selectOrder.value = row;
    console.log('点击行', selectOrder.value)
};
// 双击表格行的方法
const handleRowDblClick = (row) => {
    selectOrder.value = row;
    handleDialogConfirm();
};
// 弹窗确定
const handleDialogConfirm = async () => {
    orderInfo.value = selectOrder.value;
    parcelTableData.value = selectOrder.value.returnParcelList || [];
    forecastTableData.value = mergeForecastAndReceipt(
        selectOrder.value.returnProductForecastList || [],
        selectOrder.value.returnProductReceiptList || []
    );
    uploadedFiles.value = res.data[0].returnAttachmentList.map(item => ({
        name: item.attachmentName,
        url: item.attachmentUrl,
        id: item.id,
        isCustomerAdd: item.isCustomerAdd
    }));
    centerDialogVisible.value = false;
}
// 是否连续提交
const isContinuousSubmit = ref(false)
// 获取订单详情
const getOrderInfo = async () => {
    orderInfo.value = {};
    if (!orderData.value.numberType) {
        return
    }
    if (!orderData.value.number) {
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading'
    })
    const res = await getReturnOrderListByNumberTypeApi(orderData.value)
    // 打开弹窗
    if (res.success && res.data.length > 1) {
        orderList.value = res.data;
        centerDialogVisible.value = true;
    } else if (res.success && res.data.length == 1) {
        orderInfo.value = res.data[0];
        parcelTableData.value = res.data[0].returnParcelList || [];
        forecastTableData.value = mergeForecastAndReceipt(
            res.data[0].returnProductForecastList || [],
            res.data[0].returnProductReceiptList || []
        );
        uploadedFiles.value = res.data[0].returnAttachmentList.map(item => ({
            name: item.attachmentName,
            url: item.attachmentUrl,
            id: item.id,
            isCustomerAdd: item.isCustomerAdd
        }));
    } else if (!res.success && orderData.value.numberType == 1) {
        const submit = async () => {
            const res = await addReturnOrderClaimApi({
                trackingNo: orderData.value.number
            })
            smartAlert(res.msg, res.success, 1000);
            // 清空
            orderData.value.number = '';
            orderData.value.numberType = 1;
            message.value.content = '';
        }
        console.log(!isContinuousSubmit.value)
        if (isContinuousSubmit.value) {
            submit()
            // 清空
            orderData.value.number = '';
            orderData.value.numberType = 1;
            message.value.content = '';
        } else {
            ElMessageBox.confirm(
                '未找到对应退件单，是否要将此跟踪单号添加到待认领？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(async () => {
                submit()
            }).catch(() => {
                // 清空
                orderData.value.number = '';
                orderData.value.numberType = 1;
                message.value.content = '';
            });
        }
    }
    message.value = {
        type: res.success,
        content: res.msg
    }
    loading.close()
}
// 重置
const reset = () => {
    // 重置查询条件
    orderData.value.number = ''; // 订单号
    orderData.value.numberType = 2; // 订单号类型
    isContinuousSubmit.value = false; // 是否连续提交

    // 重置订单信息相关数据
    orderInfo.value = {}; // 订单信息
    selectOrder.value = {}; // 选择的订单
    message.value = { type: true, content: '' }; // 提示信息

    // 重置表格数据
    parcelTableData.value = []; // 包裹详情表格数据
    forecastTableData.value = []; // 商品详情表格数据

    // 清空弹窗数据
    orderList.value = [];

    // 重置提示弹窗
    showAlert.value = false;
    alertMessage.value = '';
    alertType.value = 'success';

    // 输入框聚焦
    focusInput();
}
// 表格数据
const parcelTableData = ref([]);
const forecastTableData = ref([]);
const parcelTableRef = ref(null);
const mergeTableRef = ref();
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
    { label: '商品条码', prop: 'barcode', width: '180', slot: 'barcode' },
    { label: '商品名称', prop: 'productName', width: '180', slot: 'productName' },
    { label: '预报数量', prop: 'forecastQty', width: '120', slot: 'forecastQty' },
    { label: '品质', prop: 'qualityId', width: '150', slot: 'qualityId' },
    { label: '清点数量', prop: 'receivedQty', width: '120', slot: 'receivedQty' },
]

// 上传文件相关
const fileList = ref([])
const uploadedFiles = ref([]) // 存储已上传的文件信息（包含名称和地址）

// 文件类型校验保持不变
const beforeUpload = (file) => {
    if (uploadedFiles.value.length >= 9) {
        smartAlert('最多上传9个文件', false)
        return false
    }
    // 可以新增文件类型和大小校验
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        smartAlert('上传文件大小不能超过 2MB!', false)
        return false
    }
    return true
}

// 上传文件处理
const handleUpload = async (options) => {
    const loadingInstance = ElLoading.service({ lock: true, text: '文件上传中...' })
    try {
        const res = await uploadApi(options.file, { path: 'temp' })
        if (res.success) {
            // 将上传成功的文件信息添加到列表
            uploadedFiles.value.push({
                name: options.file.name, // 文件名
                url: res.data, // 后端返回的文件地址
                isCustomerAdd: false // 标记为用户上传的文件
            })
            smartAlert(`文件 "${options.file.name}" 上传成功`, true, 1000)
        } else {
            smartAlert(`文件 "${options.file.name}" 上传失败: ${res.msg}`, false)
        }
    } catch (error) {
        console.error('上传失败:', error)
        smartAlert(`文件 "${options.file.name}" 上传失败`, false)
    } finally {
        loadingInstance.close()
    }
}

// 删除已上传文件
const handleDeleteFile = (index) => {
    uploadedFiles.value.splice(index, 1)
}

// 保存
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
            attachmentName: item.name, // 文件名
            attachmentUrl: item.url, // 文件地址 
            returnOrderId: orderInfo.value.id, // 关联的退件单ID
            isCustomerAdd: item.isCustomerAdd // 是否是客户上传的文件
        }))
    }
    const res = await signAndCountInstockReturnApi(data)
    smartAlert(res.msg, res.success, 1000)
    if (res.success) {
        getOrderInfo()
    }
};

// 筛选客户代码
const customerOptions = ref([]);
// 仓库下拉框数据
const warehouseOptions = ref([])
// 类型下拉框数据
const typeOptions = ref([])
// 承运商下拉框数据
const carrierOptions = ref([])
// 商品品质
const qualityOptions = ref([])
onMounted(async () => {
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
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
    // 退件包裹品质
    const OptionsRes = await getOrderQualityEnumApi()
    qualityOptions.value = OptionsRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
    // 客户数据
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    focusInput()
})
onActivated(() => {
    focusInput()
})
const numberInput = ref(null)
// 重置输入框并聚焦
function focusInput() {
    nextTick(() => {
        numberInput.value?.focus?.()
    })
}

// 控制 el-alert 显示隐藏
const showAlert = ref(false);
// 控制 el-alert 类型
const alertType = ref('success'); // 'success' 或 'error'
// 存储提示信息
const alertMessage = ref('');
const showSuccessAlert = (message, state) => {
    alertType.value = state ? 'success' : 'error'
    alertMessage.value = message
    showAlert.value = true

    setTimeout(() => {
        showAlert.value = false
    }, state ? 1000 : 5000)
}

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

.isContinuousBlock {
    margin-left: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #606266;
    width: 142px;
    justify-content: space-around;

    span {
        line-height: 28px;
        display: inline-block;
        height: 28px;
    }
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
    /* 柔和的黄底 */
    color: #333;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
}

// 提示信息样式
:deep(.el-alert__title) {
    font-size: 20px;
}

.bottomDiv {
    margin-top: 10px;
    width: 1200px;
    display: flex;
    justify-content: center;
}

// 上传样式
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