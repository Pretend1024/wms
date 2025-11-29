<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>入库信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户代码:" class="compact-item" prop="customerCode">
                            <el-select v-model="formData.customerCode" filterable placeholder="请输入客户代码"
                                popper-class="multi-column-select" clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仓库:" prop="warehouseCode">
                            <el-select v-model="formData.warehouseCode" value-key="id" placeholder="请选择仓库">
                                <el-option v-for="item in warehouseOptions" :key="item.id"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="头程类型:" prop="firstLegId">
                            <el-select v-model="formData.firstLegId" value-key="id" placeholder="请选择头程类型">
                                <el-option v-for="item in firstLegOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="入库类型:" prop="typeId">
                            <el-select v-model="formData.typeId" value-key="id" placeholder="请选择入库类型">
                                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="业务类型:" prop="businessId">
                            <el-select v-model="formData.businessId" value-key="id" placeholder="请选择业务类型">
                                <el-option v-for="item in businessOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到仓类型:" prop="arrivalTypeId">
                            <el-select v-model="formData.arrivalTypeId" value-key="id" placeholder="请选择到仓类型">
                                <el-option v-for="item in arrivalTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="总单号:">
                            <el-input v-model.trim="formData.totalNo" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入库单号:" prop="orderNo">
                            <el-input v-model="formData.orderNo" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="头程单号:">
                            <el-input v-model="formData.trackingNo1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="尾程单号:">
                            <el-input v-model="formData.trackingNo2" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划到仓时间:" prop="plannedArrivalTime">
                            <el-date-picker v-model="formData.plannedArrivalTime" type="date" placeholder="选择计划到仓时间"
                                format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="货柜型号:" prop="containerType">
                            <el-select v-model="formData.containerType" value-key="id" placeholder="请选择货柜型号">
                                <el-option v-for="item in cabinetOptions" :key="item.id"
                                    :label='`${item.code} -${item.name} `' :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="货柜号码:">
                            <el-input v-model="formData.containerNumber" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input type="textarea" v-model="formData.remark" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <p>货品信息</p>
            <el-row>
                <el-col :span="24">
                    <inOrder-table ref="tableRef" :columns="columns" :data="tableData" index-label="箱规序号"
                        :merge-key="['boxBatch']" :merge-cols="['boxQty']" @update:data="tableData = $event">
                        <template #boxQty="{ row }">
                            <el-input v-model="row.boxQty" @blur="onBoxQtyBlur(row)" v-number />
                        </template>
                        <template #skus="{ row }">
                            <el-form-item>
                                <el-input v-model="row.sku" @blur="onSkuBlur(row)" @focus="onSkuFocus(row)"
                                    :class="{ 'input-error-text': row.isErrorDisplay }" placeholder="请输入SKU">
                                    <template #append>
                                        <el-button icon="More" @click="openSkuDialog(row)" />
                                    </template>
                                </el-input>
                            </el-form-item>
                        </template>
                        <template #boxInnerQty="{ row }">
                            <el-input v-model="row.boxInnerQty" @blur="onInnerQtyBlur(row)" placeholder="请输入件数"
                                v-number />
                        </template>
                        <template #skuPhoto="{ row }">
                            <!-- 循环skuPhoto展示图片 -->
                            <el-image v-for="(item, index) in row.skuPhoto" ref="imageRef"
                                style="width: 50px; height: 50px;" :src="item.url" show-progress fit="cover"
                                :preview-src-list="row.skuPhoto.map(photo => photo.url)" preview-teleported="true" />
                        </template>
                    </inOrder-table>
                </el-col>
            </el-row>
            <div class="btns">
                <!-- 保存和关闭 -->
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
            <skuSelectDialog v-model:visible="skuDialogVisible" :customerCode="formData.customerCode"
                @confirm="handleSkuConfirm" />
        </div>
    </div>

</template>

<script setup name="入库单复制">
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getInstockInOrderFirstLegEnumApi, getInstockInOrderTypeEnumApi, getInstockInOrderBusinessEnumApi, getInstockInOrderCabinetTypeEnumApi, addOrderInOrderApi, getInstockInOrderArrivalTypeEnumApi, getOrderInOrderInfoVOByIdApi } from '@/api/instockApi/order.js';
import { smartAlert } from '@/utils/genericMethods.js'
import skuSelectDialog from './skuSelectDialog.vue';
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
const props = defineProps({
    id: {
        type: Number,
        required: false
    }
});
// 表单数据
const formData = ref({
    customerCode: '',
    warehouseCode: '',
    firstLegId: '',
    typeId: '',
    businessId: '',
    arrivalTypeId: '',
    totalNo: '',
    orderNo: '',
    trackingNo1: '',
    trackingNo2: '',
    plannedArrivalTime: '',
    containerType: '',
    containerNumber: '',
    remark: '',
    boxList: []
});
// 表格数据
const tableData = shallowRef([]);
const tableRef = ref(null);
const columns = [
    { label: '箱数', prop: 'boxQty', width: '220', slot: 'boxQty' },
    { label: 'SKU', prop: 'skus', width: '220', slot: 'skus' },
    { label: 'SKU件数', prop: 'boxInnerQty', width: '120', slot: 'boxInnerQty' },
    { label: 'SKU总数', prop: 'skuSum', width: '120' },
    { label: 'SKU图片', prop: 'skuPhoto', width: '280', slot: 'skuPhoto' },
    { label: '品名', prop: 'productTitle', width: '220' },
]

const formRef = ref(null);
// 验证规则
const rules = {
    customerCode: [
        { required: true, message: '请输入客户代码', trigger: 'blur' }
    ],
    warehouseCode: [
        { required: true, message: '请选择仓库', trigger: 'change' }
    ],
    firstLegId: [
        { required: true, message: '请选择头程类型', trigger: 'change' }
    ],
    // typeId: [
    //     { required: true, message: '请选择入库类型', trigger: 'change' }
    // ],
    businessId: [
        { required: true, message: '请选择业务类型', trigger: 'change' }
    ],
    arrivalTypeId: [
        { required: true, message: '请选择到仓类型', trigger: 'change' }
    ],
    orderNo: [
        { required: true, message: '请输入入库单号', trigger: 'blur' }
    ],
    plannedArrivalTime: [
        { required: true, message: '请选择计划到仓时间', trigger: 'change' }
    ],
    containerType: [
        { required: true, message: '请选择货柜型号', trigger: 'change' }
    ]
};


// 保存
const handleSave = async () => {
    console.log(formData.value)
    await formRef.value.validate(async (valid) => {
        if (valid) {
            exportData()
            const res = await addOrderInOrderApi(formData.value);
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                refreshStore.shouldRefreshInOrderList = true// 设置刷新标记
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
                router.push('/instock/order/inOrder/list')
            } else {
                console.log(res);
            }
            console.log('Form Data:', formData.value);
        } else {
            console.log('Form validation failed.');
        }
    });
}
// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/instock/order/inOrder/list' })
}
// 筛选客户代码
const customerOptions = ref([]);

// 仓库下拉框数据
const warehouseOptions = ref([])
// 头程类型
const firstLegOptions = ref([])
// 入库类型
const typeOptions = ref([])
// 业务类型
const businessOptions = ref([])
// 货柜型号
const cabinetOptions = ref([])
// 到仓类型
const arrivalTypeOptions = ref([])
onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        target: ".contentDiv",
        text: 'Loading'
    })
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data
    // 头程类型
    const firstLegRes = await getInstockInOrderFirstLegEnumApi()
    firstLegOptions.value = firstLegRes.data
    // 入库类型
    const typeRes = await getInstockInOrderTypeEnumApi()
    typeOptions.value = typeRes.data
    // 业务类型
    const businessRes = await getInstockInOrderBusinessEnumApi()
    businessOptions.value = businessRes.data
    // 货柜型号
    const cabinetRes = await getInstockInOrderCabinetTypeEnumApi()
    cabinetOptions.value = cabinetRes.data
    // 到仓类型
    const arrivalTypeRes = await getInstockInOrderArrivalTypeEnumApi()
    arrivalTypeOptions.value = arrivalTypeRes.data
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    if (props.id) {
        // 获取入库单详情
        const res = await getOrderInOrderInfoVOByIdApi({ id: props.id })
        formData.value = res.data
        // 处理 boxVOList，展开为表格行
        const rows = []
        res.data.boxVOList.forEach((box, batchIdx) => {
            box.skus.forEach((skuItem, idx) => {
                rows.push({
                    boxBatch: `batch_${batchIdx}`,
                    boxQty: idx === 0 ? box.boxQty : '',
                    sku: skuItem.sku,
                    boxInnerQty: skuItem.boxInnerQty,
                    skuSum: box.boxQty * skuItem.boxInnerQty,
                    skuPhoto: [],
                    productTitle: ''
                })
            })
        })
        tableData.value = rows

        // 异步填充 SKU 图片和标题
        for (const row of tableData.value) {
            try {
                const info = await getSkuSkuDataBySkuApi({
                    customerCode: formData.value.customerCode,
                    sku: row.sku
                })
                if (info.success) {
                    row.skuPhoto = info.data.imgList
                    row.productTitle = info.data.nameCn
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
    loading.close()
})
// 获取树形结构
function exportData() {
    const tree = tableRef.value.getTreeData();
    formData.value.boxList = tree.map((item, idx) => ({
        boxBatch: (idx + 1).toString(),
        boxQty: item.boxQty,
        skus: item.skus.map(sku => ({
            sku: sku.sku,
            boxInnerQty: sku.boxInnerQty,
        }))
    }));
    console.log(formData.value)
}
// 调接口拿到 sku 对应的图片和标题
async function onSkuBlur(row) {
    // 先重置
    row.isErrorDisplay = false
    row.skuError = ''

    if (!row.sku) return

    try {
        const res = await getSkuSkuDataBySkuApi({
            customerCode: formData.value.customerCode,
            sku: row.sku
        })
        if (res.success && res.data) {
            row.skuPhoto = res.data.imgList || []
            row.productTitle = res.data.nameCn
        } else {
            // 显示错误文本在输入框里
            row.skuError = res.msg || 'SKU 无效，请重新输入'
            row.sku = row.skuError
            row.isErrorDisplay = true
        }
    } catch (e) {
        console.error('获取 SKU 信息失败', e)
        row.skuError = '请求失败，请稍后重试'
        row.sku = row.skuError
        row.isErrorDisplay = true
    }
}

function onSkuFocus(row) {
    if (row.isErrorDisplay) {
        row.sku = ''
        row.skuError = ''
        row.isErrorDisplay = false
    }
}
// 失焦时，算出总数存到 skuSum
function onInnerQtyBlur(row) {
    const key = tableRef.value.getGroupKey(row);
    // 拿到同组所有行
    const all = tableData.value.filter(r =>
        tableRef.value.getGroupKey(r) === key
    );
    const parent = all[0];
    const boxQty = Number(parent.boxQty) || 1;
    const inner = Number(row.boxInnerQty) || 0;
    row.skuSum = boxQty * inner;
}
function onBoxQtyBlur(row) {
    const key = tableRef.value.getGroupKey(row);
    const all = tableData.value.filter(r =>
        tableRef.value.getGroupKey(r) === key
    );
    const boxQty = Number(row.boxQty) || 1;
    all.forEach(r => {
        const inner = Number(r.boxInnerQty) || 0;
        r.skuSum = boxQty * inner;
    });
}

// 批量选择 SKU 弹窗相关
const currentRow = ref(null);
const skuDialogVisible = ref(false);

function openSkuDialog(row) {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    currentRow.value = row;
    skuDialogVisible.value = true;
}

async function handleSkuConfirm(selectedList) {
    if (!currentRow.value) return;

    const groupKey = tableRef.value.getGroupKey(currentRow.value);
    const lastRow = tableRef.value.getLastRowInGroup(groupKey);

    const rows = [];

    // 先判断最后一行是否是空行
    if (lastRow && !lastRow.sku) {
        const firstSku = selectedList.shift();
        lastRow.sku = firstSku;
        lastRow.productTitle = "";
        lastRow.skuPhoto = [];
        lastRow.boxInnerQty = "";
        // lastRow.boxQty = "";
        lastRow.isErrorDisplay = false;
        rows.push(lastRow); // 把这行丢进要更新的列表
    }

    // 剩下的 sku 插入新行
    if (selectedList.length > 0) {
        const newRows = selectedList.map(sku => ({
            sku,
            productTitle: "",
            skuPhoto: [],
            boxInnerQty: "",
            // boxQty: "",
            isErrorDisplay: false,
        }));
        const addedRows = tableRef.value.addRowsToGroup(groupKey, newRows);
        rows.push(...addedRows);
    }

    // 并发触发 onSkuBlur
    await Promise.all(rows.map(r => onSkuBlur(r)));

    skuDialogVisible.value = false;
}

</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

:deep(.el-input) {
    width: 100% !important;
}

:deep(.input-error-text .el-input__wrapper) {
    box-shadow: 0 0 0 1px #ff3a3a !important;
}

:deep(.input-error-text .el-input__inner) {
    color: #ff3a3a !important;
}
</style>