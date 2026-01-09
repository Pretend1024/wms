<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>入库信息</p>
            <el-form :model="formData" ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户代码:">
                            <el-input v-model.trim="formData.customerCode" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="仓库:">
                            <el-select v-model="formData.warehouseCode" value-key="id" disabled>
                                <el-option v-for="item in warehouseOptions" :key="item.id"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="头程类型:">
                            <el-input v-model.trim="formData.firstLegName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <el-input v-model.trim="formData.businessName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到仓类型:">
                            <el-input v-model.trim="formData.arrivalTypeName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                            <el-input v-model.trim="formData.statusName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="总单号:">
                            <el-input v-model.trim="formData.totalNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单号:">
                            <el-input v-model="formData.orderNo" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="头程单号:">
                            <el-input v-model="formData.trackingNo1" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="尾程单号:">
                            <el-input v-model="formData.trackingNo2" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="计划到仓时间:">
                            <el-date-picker v-model="formData.plannedArrivalTime" type="datetime"
                                format="YYYY/MM/DD HH:mm:ss" value-format="YYYY/MM/DD HH:mm:ss" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货柜型号:">
                            <el-select v-model="formData.containerType" value-key="id" disabled>
                                <el-option v-for="item in cabinetOptions" :key="item.id"
                                    :label='`${item.code} -${item.name} `' :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货柜号码:">
                            <el-input v-model="formData.containerNumber" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收货方式:">
                            <el-input v-model="formData.receiptMethodName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上架方式:">
                            <el-input v-model="formData.inShelfMethodName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="formData.remark" readonly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="titleDiv">
                <p v-for="item in tabList" :key="item.value" :class="activeName == item.value ? 'active' : ''"
                    @click="handleTabChange(item.value)">{{ item.label }}</p>
            </div>
            <div class="tableDiv">
                <inOrder-table v-show="activeName == 'first'" :controlsVisible="false" ref="tableRef"
                    :columns="tableColumns1" :data="userData1" index-label="箱规序号" :merge-key="['boxBatch']"
                    :merge-cols="['boxQty']" @update:data="userData1 = $event"
                    :summaryColumns="['boxQty', 'skuSum', 'totalVolume']">
                    <!-- <template #boxQty="{ row }">
                        <el-input v-model="row.boxQty" readonly />
                    </template>
<template #skus="{ row }">
                        <el-form-item>
                            <el-input v-model="row.sku" :class="{ 'input-error-text': row.isErrorDisplay }"
                                placeholder="请输入SKU" readonly />
                        </el-form-item>
                    </template>
<template #boxInnerQty="{ row }">
                        <el-input v-model="row.boxInnerQty" placeholder="请输入件数" readonly />
                    </template>
<template #skuPhoto="{ row }">
                        <el-image v-for="(item, index) in row.skuPhoto" ref="imageRef"
                            style="width: 50px; height: 50px;" :src="item.url" show-progress fit="cover"
                            :preview-src-list="row.skuPhoto.map(photo => photo.url)" preview-teleported="true" />
                    </template> -->
                </inOrder-table>
                <in-order-table v-show="activeName === 'second'" ref="tableRef" :controlsVisible="false"
                    :columns="tableColumns2" :data="userData2" index-label="序号" :merge-key="['sku']"
                    :merge-cols="['sku']" :summaryColumns="['skuSum', 'totalVolume']" />
                <!-- <general-table :loading="loading" :tableData="userData1" :columns="tableColumns1"></general-table> -->
                <!-- <general-table :loading="loading" v-show="activeName == 'second'" :tableData="userData2"
                    :columns="tableColumns2"></general-table> -->
                <general-table :loading="loading" v-show="activeName == 'third'" :tableData="userData3"
                    :columns="tableColumns3" :summaryColumns="['boxQty', 'qty']"></general-table>
                <general-table :loading="loading" v-show="activeName == 'fourth'" :tableData="userData4"
                    :columns="tableColumns4" :summaryColumns="['boxQty', 'qty']"></general-table>
                <general-table :loading="loading" v-show="activeName == 'fifth'" :tableData="userData5"
                    :columns="tableColumns5">
                    <template #message="{ row }">
                        <div v-html="row.message"></div>
                    </template>
                    <template #isSuccess="{ row }">
                        <span :style="{ color: row.isSuccess ? 'green' : 'red' }">{{ row.isSuccess ? '成功' : '失败'
                        }}</span>
                    </template>
                </general-table>
                <el-table :loading="loading" v-show="activeName == 'sixth'" :data="filteredTableData"
                    :row-style="getRowStyle" style="width: 100%;height: 100%;" border :show-summary="hasSummary"
                    :summary-method="summaryMethod">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column prop="sku" label="SKU" width="165" />
                    <el-table-column prop="barcode" label="条码" width="165" />
                    <el-table-column prop="skuName" label="品名" width="170" />
                    <el-table-column prop="boxQty" label="预报箱数" width="90" />
                    <el-table-column prop="goodsQty" label="预报件数" width="90" />
                    <el-table-column prop="receiptBoxQty" label="收货箱数" width="90" />
                    <el-table-column prop="receiptGoodsQty" label="收货件数" width="90" />
                    <el-table-column prop="shelfBoxQty" label="上架箱数" width="90" />
                    <el-table-column align="left" label="上架件数" prop="shelfGoodsQty">
                        <template #header>
                            <div style="display: flex;align-items: center;">
                                <span>上架件数</span>
                                <div style="display: flex;align-items: center;margin-left: auto;">
                                    <span style="margin: 0 5px;">收货/预报:</span>
                                    <el-select v-model="filterStatus1" placeholder="收货/预报"
                                        style="width: 90px;margin-left: auto;margin-right: none;">
                                        <el-option label="全部" value="all" />
                                        <el-option label="一致" value="success" />
                                        <el-option label="不一致" value="fail" />
                                    </el-select>
                                    <span style="margin: 0 5px 0 10px;">上架/收货:</span>
                                    <el-select v-model="filterStatus2" placeholder="上架/收货"
                                        style="width: 90px;margin-left: auto;margin-right: none;">
                                        <el-option label="全部" value="all" />
                                        <el-option label="一致" value="success" />
                                        <el-option label="不一致" value="fail" />
                                    </el-select>
                                </div>
                            </div>
                        </template>
                        <template #default="{ row }">
                            <span style="text-align: start;display: block;">{{ row.shelfGoodsQty }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>

<script setup name="入库单详情">
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getInstockInOrderCabinetTypeEnumApi } from '@/api/instockApi/order.js';
import { getOrderInOrderInfoVOByIdApi, getOrderInOrderSkuCheckApi } from '@/api/instockApi/order.js'
import { getOpLogApi } from '@/api/baseApi/index.js'
const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});
// 加载
const loading = ref(false)
// 切换tab
const activeName = ref('first');
const handleTabChange = async (tab) => {
    activeName.value = tab;
    // 切换tab时，获取对应的数据
    switch (tab) {
        case 'fifth':
            if (userData5.value.length == 0) {
                loading.value = true
                const res = await getOpLogApi({ objId: props.id })
                if (res.data) {
                    userData5.value = res.data;
                    loading.value = false
                }
            }
            break;
        case 'sixth':
            if (userData6.value.length == 0) {
                loading.value = true
                const res = await getOrderInOrderSkuCheckApi({ inOrderId: props.id })
                if (res.data) {
                    userData6.value = [...res.data];
                    console.log('SKU收货上架核对数据:', userData6.value)
                    loading.value = false
                }
            }
    }
}
// 筛选状态
const filterStatus1 = ref('all')
const filterStatus2 = ref('all')
// 筛选
const filteredTableData = computed(() => {
    return userData6.value.filter(row => {
        const isReceiptMatch = row.receiptGoodsQty === row.goodsQty
        const isShelfMatch = row.shelfGoodsQty === row.receiptGoodsQty

        const matchFilter1 = filterStatus1.value === 'all' ||
            (filterStatus1.value === 'success' && isReceiptMatch) ||
            (filterStatus1.value === 'fail' && !isReceiptMatch)

        const matchFilter2 = filterStatus2.value === 'all' ||
            (filterStatus2.value === 'success' && isShelfMatch) ||
            (filterStatus2.value === 'fail' && !isShelfMatch)

        return matchFilter1 && matchFilter2
    })
})
// 自定义设置行样式的方法
const getRowStyle = ({ row }) => {
    // if (row.receiptGoodsQty > 0 && row.receiptGoodsQty != row.goodsQty) {
    //     return 'background-color: #ffd4d4; '
    // }
    // if (row.shelfGoodsQty > 0 && row.shelfGoodsQty != row.receiptGoodsQty) {
    //     return 'background-color: #fcffc9;'
    // }
    if (row.receiptGoodsQty !== row.goodsQty ||
        row.receiptGoodsQty !== row.shelfGoodsQty ||
        row.goodsQty !== row.shelfGoodsQty) {
        return 'background-color: #ffcbcb;';
    }
    return ''
}
const tabList = [
    { value: 'first', label: '预报箱' },
    { value: 'second', label: '预报SKU' },
    { value: 'third', label: '收货记录' },
    { value: 'fourth', label: '上架记录' },
    { value: 'sixth', label: 'SKU收货上架核对' },
    { value: 'fifth', label: '日志' },
]
const tableColumns1 = [
    { label: '箱数', prop: 'boxQty', width: '100', },
    { label: 'SKU', prop: 'sku', width: '165' },
    { label: '条码', prop: 'barcode', width: '165' },
    { label: '每箱件数', prop: 'boxInnerQty', width: '120' },
    { label: '总件数', prop: 'skuSum', width: '120' },
    { label: '总立方', prop: 'totalVolume', width: '120' },
    { label: '品名', prop: 'productTitle', width: '220' },
]
const tableColumns2 = [
    { label: 'SKU', prop: 'sku', width: '165' },
    { label: '条码', prop: 'barcode', width: '165' },
    { label: '品名', prop: 'productTitle', width: '220' },
    { label: '箱规格号', prop: 'boxBatch', width: '120' },
    { label: '箱数', prop: 'boxQty', width: '85' },
    { label: '箱内件数', prop: 'boxInnerQty', width: '100' },
    { label: 'SKU总件数', prop: 'skuSum', width: '120' },
    { label: '总立方', prop: 'totalVolume', width: '120' },
]
const tableColumns3 = [
    { label: '批次号', prop: 'batchNo', width: '140' },
    // { label: '箱规', prop: 'boxBatch', width: '120' },
    // { label: '箱数', prop: 'boxQty', width: '85' },
    { label: '箱号', prop: 'boxNo', width: '160' },
    { label: 'SKU', prop: 'sku', width: '165' },
    { label: '条码', prop: 'barcode', width: '165' },
    // { label: '品质', prop: 'qualityName', width: '100' },
    // { label: '箱内件数', prop: 'boxInnerQty', width: '100' },
    { label: '总件数', prop: 'qty', width: '100' },
    { label: '收货方式', prop: 'receiptMethodName', width: '135' },
    { label: '收货时间', prop: 'createdTime', width: '200' },
    { label: '收货人', prop: 'createdBy', width: '120' },
    { label: '备注', prop: 'remark', width: '150' },
    { label: '登录端', prop: 'terminalName', width: '100' },
    { label: 'Ip地址', prop: 'ipAddress', width: '140' },
]
const tableColumns4 = [
    { label: '批次号', prop: 'batchNo', width: '140' },
    { label: '库位号', prop: 'locationCode', width: '120' },
    // { label: '箱规', prop: 'boxBatch', width: '120' },
    // { label: '箱数', prop: 'boxQty', width: '85' },
    { label: '箱号', prop: 'boxNo', width: '160' },
    { label: 'SKU', prop: 'sku', width: '165' },
    { label: '条码', prop: 'barcode', width: '165' },
    { label: '品质', prop: 'qualityName', width: '100' },
    // { label: '箱内件数', prop: 'boxInnerQty', width: '100' },
    { label: '总件数', prop: 'qty', width: '100' },
    { label: '上架方式', prop: 'inShelfMethodName', width: '120' },
    { label: '上架时间', prop: 'createdTime', width: '200' },
    { label: '上架人', prop: 'createdBy', width: '120' },
    { label: '备注', prop: 'remark', width: '150' },
    { label: '登录端', prop: 'terminalName', width: '100' },
    { label: 'Ip地址', prop: 'ipAddress', width: '140' },
]
const tableColumns5 = [
    { label: '用户代码', prop: 'userCode', width: '120' },
    { label: '操作时间', prop: 'createdTime', width: '200' },
    { label: '操作类型', prop: 'opType', width: '100' },
    { label: '操作结果', prop: 'isSuccess', width: '85', slot: 'isSuccess' },
    { label: '操作消息', prop: 'message', width: '600', slot: 'message' },
    { label: '登录端', prop: 'terminalName', width: '140' },
    { label: 'IP地址', prop: 'ipAddress', width: '140' },
    { label: 'IP所在城市', prop: 'ipLocation', width: '120' },
]

const userData1 = ref([])
const userData2 = ref([])
const userData3 = ref([])
const userData4 = ref([])
const userData5 = ref([])
const userData6 = ref([])

// 表单数据
const formData = ref({
    customerCode: '',
    warehouseCode: '',
    firstLegId: '',
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

// 仓库下拉框数据
const warehouseOptions = ref([])
// 货柜型号
const cabinetOptions = ref([])
onMounted(async () => {
    openMainLoading()
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data
    // 货柜型号
    const cabinetRes = await getInstockInOrderCabinetTypeEnumApi()
    cabinetOptions.value = cabinetRes.data
    // 获取入库单详情
    // const res = await getOrderInOrderInfoApi({ id: props.id })
    // formData.value = res.data
    // const res2 = await getOrderInOrderBoxApi({ inOrderId: props.id })
    // userData1.value = res2.data;
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
                productTitle: skuItem.skuName,
                totalVolume: skuItem.totalVolume,
                barcode: skuItem.barcode,
            })
        })
    })

    userData1.value = rows
    console.log('userData1:', userData1.value)
    // 异步填充 SKU 图片和标题
    // for (const row of userData1.value) {
    //     try {
    //         const info = await getSkuSkuDataBySkuApi({
    //             customerCode: formData.value.customerCode,
    //             sku: row.sku
    //         })
    //         if (info.success) {
    //             row.skuPhoto = info.data.imgList
    //             row.productTitle = info.data.nameCn
    //         }
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }
    const rows2 = []
    res.data.skusVOList.forEach((item) => {
        const skuValue = item.sku;
        item.skuList.forEach((entry, idx) => {
            rows2.push({
                sku: skuValue,
                boxBatch: entry.boxBatch,
                boxQty: entry.boxQty,
                boxInnerQty: entry.boxInnerQty,
                skuSum: entry.boxQty * entry.boxInnerQty,
                productTitle: entry.skuName,
                totalVolume: entry.totalVolume,
                barcode: entry.barcode,
            });
        });
    });
    userData2.value = rows2
    userData3.value = res.data.receiptList || []
    userData4.value = res.data.inShelfList || []
    closeMainLoading()
})

// 上架核对底部统计
const summaryColumns = ['boxQty', 'goodsQty', 'receiptBoxQty', 'receiptGoodsQty', 'shelfBoxQty', 'shelfGoodsQty']

// 仅当有指定字段时才显示统计行
const hasSummary = computed(() => summaryColumns.length > 0)

function summaryMethod({ columns, data }) {
    return columns.map((col, index) => {
        // 第一列显示合计文字
        if (index === 0) return '合计'
        const prop = col.property || col.prop
        if (summaryColumns.includes(prop)) {
            const sum = data.reduce((total, row) => {
                const v = parseFloat(row[prop])
                return total + (isNaN(v) ? 0 : v)
            }, 0)
            return sum.toFixed(2)
        }
        return ''
    })
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.titleDiv {
    display: flex;
    width: 100%;
    height: 45px;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;

    p {
        border: none !important;
        margin-bottom: 0 !important;
        font-size: 18px !important;
        padding: 0 15px 10px !important;
    }

    p:hover {
        font-size: 22px !important;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    p.active {
        color: #ff914e;
        height: 30px !important;
        font-size: 22px !important;
        border-bottom: 2px solid #ff914e !important;
    }
}

.tableDiv {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    min-height: 300px;
}

:deep(.el-input) {
    width: 100% !important;
}

:deep(.input-error-text .el-input__wrapper) {
    box-shadow: 0 0 0 1px #ff3a3a !important;
}

:deep(.input-error-text .el-input__inner) {
    color: #ff3a3a !important;
}

:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa !important;
    color: #303133;
    font-size: 15px;
    font-weight: 700;
}
</style>