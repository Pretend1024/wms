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
                        <el-form-item label="退件单号:" prop="orderNo">
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
                        <el-form-item label="原出库单号:">
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
                    <template #trackingNo="scope">
                        <el-input v-model="scope.row.trackingNo" placeholder="请输入物流跟踪号" />
                    </template>
                    <template #carrierCode="scope">
                        <el-select v-model="scope.row.carrierCode" placeholder="请选择承运商">
                            <el-option v-for="item in carrierOptions" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </template>
                    <template #length="scope">
                        <div style="display: flex;">
                            <el-input v-model="scope.row.length" v-number placeholder="长" />
                            <el-input v-model="scope.row.width" v-number placeholder="宽" />
                            <el-input v-model="scope.row.height" v-number placeholder="高" />
                        </div>
                    </template>
                    <template #weight="scope">
                        <el-input v-model="scope.row.weight" v-number placeholder="输入重量" />
                    </template>
                    <template #remark="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" />
                    </template>
                </returnOrderTable>
            </div>
            <p style="margin-top: 20px;">退件商品</p>
            <div class="tableDiv">
                <returnOrderTable ref="forecastTableRef" :columns="forecastColumns" :data="forecastTableData"
                    @update:data="forecastTableData = $event" addButtonText="添加商品">
                    <template #sku="scope">
                        <el-input v-model="scope.row.sku" placeholder="请输入/扫描sku" />
                    </template>
                    <template #fnsku="scope">
                        <el-input v-model="scope.row.fnsku" placeholder="请输入FNSKU" />
                    </template>
                    <template #barcode="scope">
                        <el-input v-model="scope.row.barcode" placeholder="请输入商品条码" />
                    </template>
                    <template #productName="scope">
                        <el-input v-model="scope.row.productName" placeholder="请输入商品名称" />
                    </template>
                    <template #forecastQty="scope">
                        <el-input v-model="scope.row.forecastQty" v-number placeholder="输入预报数量" />
                    </template>
                    <template #remark="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" />
                    </template>
                </returnOrderTable>
            </div>
            <p style="margin-top: 20px;">附件信息</p>
            <div class="uploadDiv">
                <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" drag :show-file-list="false"
                    multiple :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="5">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖放文件 或 <em>点击选择</em>
                    </div>
                    <template #tip>
                        <div class="tip">
                            <!-- 上传文件地址展示区域 -->
                            <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                                <ul>
                                    <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                                        <a :href="file.url" target="_blank" rel="noopener noreferrer" class="file-link">
                                            {{ file.name }}
                                        </a>
                                        <div @click="handleDeleteFile(index)" class="delete-btn">
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
                <el-button type="primary" @click="handleSubmit">{{getButtonText ('save') }}</el-button>
                <el-button @click="handleClose">{{getButtonText ('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="编辑退件单">
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import { getInstockReturnReturnOrderTypeEnumApi, updInstockReturnReturnOrderApi, getInstockReturnReturnParcelStatusEnumApi, getInstockReturnReturnOrderInfoApi } from '@/api/instockApi/return.js'
import returnOrderTable from '@/components/table/returnOrder-table.vue'
import { uploadApi } from '@/api/baseApi/index.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()

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
    ],
    sourceOrderNo: [
        { required: true, message: '请输入原出库单号', trigger: 'blur' }
    ]
};

// 表格数据
const parcelTableData = ref([]);
const forecastTableData = ref([]);
const parcelTableRef = ref(null);
const forecastTableRef = ref(null);
const parcelColumns = [
    { label: '物流跟踪号', prop: 'trackingNo', width: '220', slot: 'trackingNo' },
    { label: '承运商', prop: 'carrierCode', width: '180', slot: 'carrierCode' },
    { label: '尺寸(CM) 长-宽-高', prop: 'length', width: '340', slot: 'length' },
    { label: '重量(KG)', prop: 'weight', width: '150', slot: 'weight' },
    { label: '备注', prop: 'remark', width: '300', slot: 'remark' },
]
const forecastColumns = [
    { label: 'SKU', prop: 'sku', width: '220', slot: 'sku' },
    { label: '预报数量', prop: 'forecastQty', width: '170', slot: 'forecastQty' },
    { label: 'FNSKU(选填)', prop: 'fnsku', width: '180', slot: 'fnsku' },
    { label: '商品条码(选填)', prop: 'barcode', width: '280', slot: 'barcode' },
    { label: '商品名称(选填)', prop: 'productName', width: '170', slot: 'productName' },
    { label: '备注(选填)', prop: 'remark', width: '300', slot: 'remark' },
]
// 保存
const handleSubmit = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const returnParcelAddDTOList = parcelTableRef.value.getData();
                const returnProductForecastAddDTOList = forecastTableRef.value.getData();
                let returnAttachmentAddDTOList = [];
                if (uploadedFiles.value.length > 0) {
                    returnAttachmentAddDTOList = uploadedFiles.value.map(file => ({
                        attachmentName: file.name,
                        attachmentUrl: file.url,
                        parcelId: '',
                        sku: ''
                    }));
                }
                const data = {
                    ...formData.value,
                    returnParcelAddDTOList,
                    returnProductForecastAddDTOList,
                    returnAttachmentAddDTOList
                };

                const res = await updInstockReturnReturnOrderApi(data);
                if (res.success) {
                    refreshStore.shouldRefreshReturnOrderList = true;
                    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath);
                    router.push('/instock/return/returnOrder/list');
                }
                smartAlert(res.msg, res.success, 1000);
            } catch (error) {
                console.warn('子表单校验失败:', error);
            }
        }
    });
};

// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/instock/return/returnOrder/list' })
}

// 上传文件相关
const fileList = ref([])
const uploadedFiles = ref([]) // 存储已上传的文件信息（包含名称和地址）

// 文件类型校验保持不变
const beforeUpload = (file) => {
    if (uploadedFiles.value.length >= 5) {
        smartAlert('最多上传5个文件', false)
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
                url: res.data // 后端返回的文件地址
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

// 筛选客户代码
const customerOptions = ref([]);
// 仓库下拉框数据
const warehouseOptions = ref([])
// 类型下拉框数据
const typeOptions = ref([])
// 承运商下拉框数据
const carrierOptions = ref([])
onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading'
    })
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
        forecastTableData.value = res.data.returnProductForecastList || [];
        uploadedFiles.value = res.data.returnAttachmentList.map(file => ({
            name: file.attachmentName,
            url: file.attachmentUrl
        }));
    }
    loading.close();
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.bottomDiv {
    margin-top: 10px;
    width: 1200px;
    display: flex;
    justify-content: center;
}

.uploadDiv {
    width: 1200px;
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

:deep(.el-upload-dragger) {
    padding: 5px 0;
}
</style>