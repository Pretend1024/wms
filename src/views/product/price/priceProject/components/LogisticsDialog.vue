<template>
    <el-dialog :title="isEdit ? '编辑物流报价' : '新增物流报价'" v-model="visible" width="90%" top="5vh"
        :close-on-click-modal="false" destroy-on-close class="logistics-dialog">
        <div class="dialog-body">
            <el-card shadow="never" class="mb-10 base-info-card">
                <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item label="物流产品" prop="shipwayId">
                                <el-select v-model="formData.shipwayId" filterable placeholder="请选择"
                                    @change="handleShipwayChange" :disabled="isEdit">
                                    <el-option v-for="item in shipwayList" :key="item.id"
                                        :label="`${item.code}-${item.name}`" :value="item.id"
                                        :disabled="excludeShipwayIds.includes(item.id) && item.id !== initialShipwayId" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分区方案" prop="regionProjectId">
                                <el-select v-model="formData.regionProjectId" filterable placeholder="请选择"
                                    @change="handleRegionProjectChange">
                                    <el-option v-for="item in regionProjectList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="偏远库" prop="remoteId">
                                <el-select v-model="formData.remoteId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in remoteList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="燃油费模板" prop="fuelId">
                                <el-select v-model="formData.fuelId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in fuelList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="币种" prop="currency">
                                <el-select v-model="formData.currency" placeholder="请选择">
                                    <el-option v-for="item in currencyList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单位类型" prop="unitType">
                                <el-select v-model="formData.unitType" placeholder="请选择">
                                    <el-option v-for="item in unitTypeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="体积重系数" prop="volumeWeightMode">
                                <el-select v-model="formData.volumeWeightMode" placeholder="请选择">
                                    <el-option v-for="item in volumeModeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分泡规则" prop="bulkWeightRule">
                                <el-select v-model="formData.bulkWeightRule" placeholder="请选择">
                                    <el-option v-for="item in bulkWeightRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="免泡方式" prop="bulkWeightFreeType">
                                <el-select v-model="formData.bulkWeightFreeType" placeholder="请选择">
                                    <el-option v-for="item in bulkWeightFreeTypeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="免泡值" prop="bulkWeightFreeValue">
                                <el-input v-model="formData.bulkWeightFreeValue" v-number="3" placeholder="请输入" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计费重规则" prop="billingWeightRule">
                                <el-select v-model="formData.billingWeightRule" placeholder="请选择">
                                    <el-option v-for="item in billingWeightRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计费粒度" prop="billingWeightCountType">
                                <el-select v-model="formData.billingWeightCountType" placeholder="请选择">
                                    <el-option v-for="item in billingWeightCountTypeList" :key="item.id"
                                        :label="item.name" :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="最小计费重" prop="minBillingWeight">
                                <el-input v-model="formData.minBillingWeight" v-number="3" placeholder="请输入" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计费重取整" prop="weightRoundRule">
                                <el-select v-model="formData.weightRoundRule" placeholder="请选择">
                                    <el-option v-for="item in weightRoundRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-tabs v-if="formData.regionProjectId" v-model="activeTab" type="border-card" class="content-tabs">
                <el-tab-pane label="分区预览" name="region">
                    <div class="tab-panel-inner">
                        <el-table :data="regionData" border height="100%" style="width: 100%">
                            <el-table-column type="index" label="序号" width="60" />
                            <el-table-column prop="regionCode" label="分区号" width="100" />
                            <el-table-column prop="countryName" label="国家" width="150" />
                            <el-table-column prop="ruleName" label="匹配规则" width="150" />
                            <el-table-column prop="content" label="匹配内容" show-overflow-tooltip />
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="设置运费" name="delivery">
                    <div class="tab-panel-inner">
                        <div class="toolbar-area mb-10 display-flex justify-between">
                            <div class="left-tools">
                                <el-button type="primary" :icon="Plus" @click="addDeliveryRow">新增一行</el-button>
                                <el-button type="success" :icon="Upload" @click="openImportDialog">导入</el-button>
                            </div>
                            <div class="batch-tools-inline">
                                <span class="label">批量填充:</span>
                                <div class="batch-group">
                                    <el-input v-model="deliveryBatch.startValue" placeholder="起重" v-number="3"
                                        size="small" />
                                    <el-input v-model="deliveryBatch.endValue" placeholder="止重" v-number="3"
                                        size="small" />
                                    <span class="divider">|</span>
                                    <el-input v-model="deliveryBatch.firstValue" placeholder="首重" v-number="3"
                                        size="small" />
                                    <el-input v-model="deliveryBatch.firstPrice" placeholder="首费" v-number="3"
                                        size="small" />
                                    <el-input v-model="deliveryBatch.addValue" placeholder="续重" v-number="3"
                                        size="small" />
                                    <el-input v-model="deliveryBatch.addPrice" placeholder="续费" v-number="3"
                                        size="small" />
                                    <el-button type="primary" link size="small"
                                        @click="handleDeliveryBatchFill">执行</el-button>
                                </div>
                            </div>
                        </div>

                        <div class="table-area">
                            <el-table :data="formData.deliveryDTOList" border height="100%">
                                <el-table-column type="index" label="序号" width="60" fixed />
                                <el-table-column label="起始重量" width="100" fixed>
                                    <template #default="{ row }">
                                        <el-input v-model="row.startValue" v-number="3" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="截止重量" width="100" fixed>
                                    <template #default="{ row }">
                                        <el-input v-model="row.endValue" v-number="3" />
                                    </template>
                                </el-table-column>

                                <el-table-column v-for="(region, index) in regionData" :key="index" width="380">
                                    <template #header>
                                        <div class="custom-header">
                                            <div class="main-title">分区 {{ region.regionCode }}</div>
                                            <div class="sub-title"
                                                :title="`${region.countryName} - ${region.ruleName}`">
                                                {{ region.countryName }} - {{ region.ruleName }}
                                            </div>
                                        </div>
                                    </template>
                                    <el-table-column label="首重" width="90">
                                        <template #default="{ row }">
                                            <el-input v-model="row.deliveryItems[index].firstValue" v-number="3"
                                                controls={false} />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="首重价格" width="90">
                                        <template #default="{ row }">
                                            <el-input v-model="row.deliveryItems[index].firstPrice" v-number="3" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="续重单位" width="90">
                                        <template #default="{ row }">
                                            <el-input v-model="row.deliveryItems[index].addValue" v-number="3" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="续重价格" width="90">
                                        <template #default="{ row }">
                                            <el-input v-model="row.deliveryItems[index].addPrice" v-number="3" />
                                        </template>
                                    </el-table-column>
                                </el-table-column>

                                <el-table-column label="操作" width="120" fixed="right">
                                    <template #default="{ row, $index }">
                                        <el-button link type="primary" @click="insertDeliveryRow($index)">插入</el-button>
                                        <el-button link type="danger" @click="delDeliveryRow($index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="设置附加费" name="surcharge">
                    <div class="tab-panel-inner">
                        <div class="toolbar-area mb-10">
                            <el-button type="primary" :icon="Plus" @click="addSurcharge">新增附加费</el-button>
                        </div>

                        <div class="scroll-area surcharge-container">
                            <el-collapse v-model="activeSurchargeNames" class="custom-collapse">
                                <el-collapse-item v-for="(extra, index) in formData.extraDTOList" :key="index"
                                    :name="index">
                                    <template #title>
                                        <div class="surcharge-header-styled">
                                            <div class="left-content">
                                                <div class="index-box">{{ index + 1 }}</div>

                                                <div class="info-group">
                                                    <div class="info-item">
                                                        <span class="label">类型</span>
                                                        <span :class="['value', extra.typeId ? 'active' : 'empty']">
                                                            {{ getFeeTypeName(extra.typeId) || '未选择' }}
                                                        </span>
                                                    </div>
                                                    <div class="divider-vertical"></div>
                                                    <div class="info-item">
                                                        <span class="label">名称</span>
                                                        <span :class="['value', extra.subTypeId ? 'active' : 'empty']">
                                                            {{ getSubFeeName(extra.subTypeId) || '未选择' }}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="info-tag fuel-tag" v-if="extra.needFuel">
                                                    <el-tag type="warning" size="small" effect="dark" round>燃油</el-tag>
                                                </div>
                                                <div class="remark-content" :title="extra.remark" v-if="extra.remark">
                                                    <span class="label">备注:</span> {{ extra.remark }}
                                                </div>
                                            </div>
                                            <div class="right-actions" @click.stop>
                                                <el-button link type="danger" :icon="Delete"
                                                    @click="delSurcharge(index)">删除</el-button>
                                            </div>
                                        </div>
                                    </template>

                                    <div class="surcharge-body">
                                        <el-form label-width="80px" :inline="true" class="mini-form">
                                            <el-form-item label="费用类型" required>
                                                <el-select v-model="extra.typeId" placeholder="选择类型"
                                                    style="width: 150px">
                                                    <el-option v-for="op in vasFeeTypeEnum" :key="op.value"
                                                        :label="op.label" :value="op.value" />
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="费用小类">
                                                <el-select v-model="extra.subTypeId" placeholder="预留位置"
                                                    style="width: 150px">
                                                    <el-option label="测试费用" :value="1" />
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="是否燃油">
                                                <el-switch v-model="extra.needFuel" />
                                            </el-form-item>
                                            <el-form-item label="费用备注">
                                                <el-input v-model="extra.remark" style="width: 300px"
                                                    placeholder="请输入备注" />
                                            </el-form-item>
                                        </el-form>

                                        <div class="condition-divider">
                                            <span>收费条件</span>
                                            <el-button size="small" type="primary" plain @click="addCondition(extra)">+
                                                新增条件</el-button>
                                        </div>

                                        <div v-for="(cond, cIdx) in extra.conditionList" :key="cIdx"
                                            class="condition-box">
                                            <div class="cond-header">
                                                <span class="cond-title">条件 #{{ cIdx + 1 }}</span>
                                                <el-button link type="danger" icon="Delete"
                                                    @click="delCondition(extra, cIdx)"></el-button>
                                            </div>

                                            <el-row :gutter="10" class="mb-10">
                                                <el-col :span="8">
                                                    <el-input v-model="cond.groupCode" placeholder="请输入">
                                                        <template #prepend>分组代码</template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-input v-model="cond.sortNo" v-intNumber="false"
                                                        placeholder="请输入">
                                                        <template #prepend>排序号</template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-select v-model="cond.unitId" placeholder="选择计费单位"
                                                        style="width: 100%">
                                                        <el-option v-for="u in unitTypeList" :key="u.id" :label="u.name"
                                                            :value="u.id" />
                                                    </el-select>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-input v-model="cond.formula" placeholder="输入收费公式">
                                                        <template #prepend>公式</template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-input v-model="cond.formulaDesc" placeholder="输入公式说明">
                                                        <template #prepend>说明</template>
                                                    </el-input>
                                                </el-col>
                                            </el-row>

                                            <div class="dimension-setting mt-10">
                                                <div class="checks">
                                                    <span class="label">价格维度:</span>
                                                    <el-checkbox v-model="cond._isMonth"
                                                        @change="generatePricingList(cond)">月份</el-checkbox>
                                                    <el-checkbox v-model="cond._isRegion"
                                                        @change="generatePricingList(cond)">分区</el-checkbox>
                                                    <el-checkbox v-model="cond._isAddress"
                                                        @change="generatePricingList(cond)">地址类型</el-checkbox>
                                                </div>

                                                <div class="batch-fill">
                                                    <span class="label">批量填充:</span>
                                                    <el-input v-model="cond._batchPrice" v-number="3" placeholder="单价"
                                                        style="width:80px" size="small" />
                                                    <el-input v-model="cond._batchMin" v-number="3" placeholder="最小"
                                                        style="width:80px" size="small" class="ml-5" />
                                                    <el-input v-model="cond._batchMax" v-number="3" placeholder="最大"
                                                        style="width:80px" size="small" class="ml-5" />
                                                    <el-button size="small" type="primary" link class="ml-5"
                                                        @click="batchFillPrice(cond)">执行</el-button>
                                                </div>
                                            </div>

                                            <el-table :data="cond.pricingList" border size="small" class="mt-5"
                                                max-height="250">
                                                <el-table-column v-if="cond._isMonth" prop="dimMonth" label="月份"
                                                    width="60" />
                                                <el-table-column v-if="cond._isRegion" label="分区 - 内容" min-width="200"
                                                    show-overflow-tooltip>
                                                    <template #default="{ row }">
                                                        <span v-if="row._regionRow" class="region-cell-text">
                                                            <span class="code">{{ row._regionRow.regionCode }}</span>
                                                            <span class="desc"> - {{ row._regionRow.countryName }} ({{
                                                                row._regionRow.ruleName }}: {{ row._regionRow.content
                                                                }})</span>
                                                        </span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column v-if="cond._isAddress" prop="dimAddressType"
                                                    label="地址类型" width="100">
                                                    <template #default="{ row }">{{
                                                        getAddressTypeName(row.dimAddressType)
                                                    }}</template>
                                                </el-table-column>
                                                <el-table-column label="单价">
                                                    <template #default="{ row }"><el-input v-model="row.price"
                                                            v-number="3" size="small" /></template>
                                                </el-table-column>
                                                <el-table-column label="最小收费">
                                                    <template #default="{ row }"><el-input v-model="row.minCharge"
                                                            v-number="3" size="small" /></template>
                                                </el-table-column>
                                                <el-table-column label="最大收费">
                                                    <template #default="{ row }"><el-input v-model="row.maxCharge"
                                                            v-number="3" size="small" /></template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <el-empty v-else description="请先选择【分区方案】以配置详细费用" class="mt-20" />
        </div>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </template>

        <el-dialog title="导入运费" v-model="importVisible" width="30%" append-to-body>
            <el-input type="textarea" :rows="5" placeholder="粘贴Excel数据 (暂未实现具体逻辑)" />
            <template #footer>
                <el-button @click="importVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Upload, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { smartAlert } from '@/utils/genericMethods.js'

// --- API Imports ---
import {
    getProductShipwayListApi,
    getPriceRegionProjectListApi,
    getPriceRemoteListApi,
    getPriceFuelListApi,
    getPriceProjectVolumeModeEnumApi,
    getPriceProjectBulkWeightRuleEnumApi,
    getPriceProjectBulkWeightFreeTypeEnumApi,
    getPriceProjectBillingWeightRuleEnumApi,
    getPriceProjectBillingWeightCountTypeEnumApi,
    getPriceProjectWeightRoundRuleEnumApi,
    getPriceRegionDetailListByProjectIdApi,
    addOrUpdPriceShipwayApi
} from '@/api/productApi/shipway.js'

import { getCurrencyEnumApi } from '@/api/baseApi/index.js'
import { getUnitTypeEnumApi, getBasicAddressTypeEnumApi } from '@/api/baseApi/basic.js'
import { getVasOrderFeeTypeEnumApi } from "@/api/vasApi/vas.js"

const props = defineProps({
    modelValue: Boolean,
    projectId: String,
    editData: Object,
    excludeShipwayIds: { type: Array, default: () => [] }
})
const emits = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emits('update:modelValue', val)
})

const isEdit = computed(() => !!props.editData)
const initialShipwayId = ref('')

const formRef = ref(null)
const submitting = ref(false)
const activeTab = ref('region')
const importVisible = ref(false)

// --- 数据源 ---
const shipwayList = ref([])
const regionProjectList = ref([])
const remoteList = ref([])
const fuelList = ref([])
const currencyList = ref([])
const unitTypeList = ref([])
const volumeModeList = ref([])
const bulkWeightRuleList = ref([])
const bulkWeightFreeTypeList = ref([])
const billingWeightRuleList = ref([])
const billingWeightCountTypeList = ref([])
const weightRoundRuleList = ref([])
const vasFeeTypeEnum = ref([])
const addressTypeEnum = ref([])

const formData = reactive({
    id: '',
    priceProjectId: '',
    shipwayId: '',
    shipwayCode: '',
    regionProjectId: '',
    regionProjectName: '',
    remoteId: '',
    fuelId: '',
    fuelName: '',
    currency: '',
    unitType: '',
    volumeWeightMode: '',
    bulkWeightRule: '',
    bulkWeightFreeType: '',
    bulkWeightFreeValue: '',
    billingWeightRule: '',
    billingWeightCountType: '',
    minBillingWeight: '',
    weightRoundRule: '',
    deliveryDTOList: [],
    extraDTOList: []
})

const rules = {
    shipwayId: [{ required: true, message: '请选择', trigger: 'change' }],
    regionProjectId: [{ required: true, message: '请选择', trigger: 'change' }],
}

// --- Tab 1: 分区 ---
const regionData = ref([])

const handleRegionProjectChange = async (val) => {
    if (!val) {
        regionData.value = []
        formData.deliveryDTOList = []
        return
    }
    const project = regionProjectList.value.find(i => i.id === val)
    if (project) formData.regionProjectName = project.name

    const res = await getPriceRegionDetailListByProjectIdApi({ projectId: val })
    if (res.success) {
        regionData.value = res.data
        if (!isEdit.value) {
            formData.deliveryDTOList = []
        }
    }
}

// --- Tab 2: 运费 ---
// 批量填充对象
const deliveryBatch = reactive({
    startValue: '', endValue: '',
    firstValue: '', firstPrice: '', addValue: '', addPrice: ''
})

const handleDeliveryBatchFill = () => {
    if (!formData.deliveryDTOList || formData.deliveryDTOList.length === 0) {
        return smartAlert('暂无数据可填充', false, 1000)
    }
    formData.deliveryDTOList.forEach(row => {
        // 填充行级数据
        if (deliveryBatch.startValue) row.startValue = deliveryBatch.startValue
        if (deliveryBatch.endValue) row.endValue = deliveryBatch.endValue

        // 填充子项数据
        if (row.deliveryItems && row.deliveryItems.length > 0) {
            row.deliveryItems.forEach(item => {
                if (deliveryBatch.firstValue) item.firstValue = deliveryBatch.firstValue
                if (deliveryBatch.firstPrice) item.firstPrice = deliveryBatch.firstPrice
                if (deliveryBatch.addValue) item.addValue = deliveryBatch.addValue
                if (deliveryBatch.addPrice) item.addPrice = deliveryBatch.addPrice
            })
        }
    })
    ElMessage.success('批量填充完成')
}

const addDeliveryRow = () => {
    if (regionData.value.length === 0) {
        smartAlert('请先选择分区方案并确保有分区数据', false, 1000)

        return
    }
    const newRow = {
        startValue: '',
        endValue: '',
        deliveryItems: regionData.value.map(r => ({
            regionCode: r.regionCode,
            stageTypeId: 1,
            firstValue: '', firstPrice: '', addValue: '', addPrice: ''
        }))
    }
    formData.deliveryDTOList.push(newRow)
}

const insertDeliveryRow = (index) => {
    if (regionData.value.length === 0) return
    const newRow = {
        startValue: '',
        endValue: '',
        deliveryItems: regionData.value.map(r => ({
            regionCode: r.regionCode,
            stageTypeId: 1,
            firstValue: '', firstPrice: '', addValue: '', addPrice: ''
        }))
    }
    formData.deliveryDTOList.splice(index, 0, newRow)
}

const delDeliveryRow = (index) => {
    formData.deliveryDTOList.splice(index, 1)
}

const openImportDialog = () => {
    importVisible.value = true
}

// --- Tab 3: 附加费 ---
const activeSurchargeNames = ref([])

const getFeeTypeName = (id) => {
    const item = vasFeeTypeEnum.value.find(i => i.value === id)
    return item ? item.label : '' // 改为空字符串，模板中处理 fallback
}
const getSubFeeName = (id) => {
    return id === 1 ? '测试费用' : '' // 改为空字符串
}
const getAddressTypeName = (val) => {
    const item = addressTypeEnum.value.find(i => i.id === val)
    return item ? item.name : val
}

const addSurcharge = () => {
    formData.extraDTOList.push({
        typeId: '',
        subTypeId: '',
        needFuel: false,
        remark: '',
        conditionList: []
    })
    activeSurchargeNames.value.push(formData.extraDTOList.length - 1)
}

const delSurcharge = (index) => {
    formData.extraDTOList.splice(index, 1)
}

const addCondition = (extra) => {
    const newCond = {
        groupCode: '',
        sortNo: '',
        unitId: '',
        formula: '',
        formulaDesc: '',
        _isMonth: false,
        _isRegion: false,
        _isAddress: false,
        _batchPrice: '', _batchMin: '', _batchMax: '',
        pricingList: []
    }
    newCond.pricingList.push({
        dimMonth: null, dimRegion: null, dimAddressType: null, dimOther: null,
        price: '', minCharge: '', maxCharge: ''
    })
    extra.conditionList.push(newCond)
}

const delCondition = (extra, index) => {
    extra.conditionList.splice(index, 1)
}

const generatePricingList = (cond) => {
    const months = cond._isMonth ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] : [null]
    const regions = cond._isRegion ? regionData.value : [null]
    const addresses = cond._isAddress ? addressTypeEnum.value.map(a => a.id) : [null]

    const list = []
    months.forEach(m => {
        regions.forEach(r => {
            addresses.forEach(a => {
                list.push({
                    dimMonth: m,
                    dimRegion: r ? r.regionCode : null,
                    _regionRow: r,
                    dimAddressType: a,
                    dimOther: null,
                    price: '', minCharge: '', maxCharge: ''
                })
            })
        })
    })
    cond.pricingList = list
}

const batchFillPrice = (cond) => {
    cond.pricingList.forEach(item => {
        if (cond._batchPrice) item.price = cond._batchPrice
        if (cond._batchMin) item.minCharge = cond._batchMin
        if (cond._batchMax) item.maxCharge = cond._batchMax
    })
}

// --- 初始化与加载 ---
const loadEnums = async () => {
    try {
        const [
            resShipway, resRegionProject, resRemote, resFuel, resCurrency,
            resUnit, resVol, resBulk, resBulkFree, resBillRule, resBillCount, resRound,
            resVasType, resAddrType
        ] = await Promise.all([
            getProductShipwayListApi(),
            getPriceRegionProjectListApi(),
            getPriceRemoteListApi(),
            getPriceFuelListApi(),
            getCurrencyEnumApi(),
            getUnitTypeEnumApi(),
            getPriceProjectVolumeModeEnumApi(),
            getPriceProjectBulkWeightRuleEnumApi(),
            getPriceProjectBulkWeightFreeTypeEnumApi(),
            getPriceProjectBillingWeightRuleEnumApi(),
            getPriceProjectBillingWeightCountTypeEnumApi(),
            getPriceProjectWeightRoundRuleEnumApi(),
            getVasOrderFeeTypeEnumApi(),
            getBasicAddressTypeEnumApi()
        ])

        shipwayList.value = resShipway.data || []
        regionProjectList.value = resRegionProject.data || []
        remoteList.value = resRemote.data || []
        fuelList.value = resFuel.data || []
        currencyList.value = (resCurrency.data || []).map(i => ({ id: i.id, name: i.name }))
        unitTypeList.value = resUnit.data || []
        volumeModeList.value = resVol.data || []
        bulkWeightRuleList.value = resBulk.data || []
        bulkWeightFreeTypeList.value = resBulkFree.data || []
        billingWeightRuleList.value = resBillRule.data || []
        billingWeightCountTypeList.value = resBillCount.data || []
        weightRoundRuleList.value = resRound.data || []
        vasFeeTypeEnum.value = (resVasType.data || []).map(i => ({ value: i.id, label: i.name }))
        addressTypeEnum.value = resAddrType.data || []
    } catch (e) {
        console.error('枚举加载失败', e)
    }
}

const restoreConditionState = (extraList) => {
    if (!extraList) return
    extraList.forEach(extra => {
        if (extra.conditionList) {
            extra.conditionList.forEach(cond => {
                if (cond.pricingList && cond.pricingList.length > 0) {
                    const first = cond.pricingList[0]
                    cond._isMonth = first.dimMonth !== null
                    cond._isRegion = first.dimRegion !== null
                    cond._isAddress = first.dimAddressType !== null
                }
            })
        }
    })
}

const fillNames = () => {
    const sw = shipwayList.value.find(i => i.id === formData.shipwayId)
    if (sw) formData.shipwayCode = sw.code

    const fl = fuelList.value.find(i => i.id === formData.fuelId)
    if (fl) formData.fuelName = fl.name
}

const handleShipwayChange = (val) => {
    const item = shipwayList.value.find(i => i.id === val)
    if (item) formData.shipwayCode = item.code
}

const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                fillNames()
                const payload = JSON.parse(JSON.stringify(formData))
                // 清理前端辅助字段
                if (payload.extraDTOList) {
                    payload.extraDTOList.forEach(e => {
                        if (e.conditionList) {
                            e.conditionList.forEach(c => {
                                delete c._isMonth
                                delete c._isRegion
                                delete c._isAddress
                                delete c._batchPrice
                                delete c._batchMin
                                delete c._batchMax
                                if (c.pricingList) {
                                    c.pricingList.forEach(p => delete p._regionRow)
                                }
                            })
                        }
                    })
                }

                const res = await addOrUpdPriceShipwayApi(payload)
                smartAlert(res.msg, res.success, 1000)
                if (res.success) {
                    emits('success')
                    visible.value = false
                }
            } catch (e) {
                console.error(e)
            } finally {
                submitting.value = false
            }
        }
    })
}

onMounted(async () => {
    await loadEnums()

    if (props.editData) {
        initialShipwayId.value = props.editData.shipwayId
        Object.assign(formData, JSON.parse(JSON.stringify(props.editData)))

        if (formData.regionProjectId) {
            await handleRegionProjectChange(formData.regionProjectId)
            formData.deliveryDTOList = JSON.parse(JSON.stringify(props.editData.deliveryDTOList || []))
        }
        restoreConditionState(formData.extraDTOList)
    } else {
        initialShipwayId.value = ''
        Object.assign(formData, {
            id: '',
            priceProjectId: props.projectId,
            shipwayId: '', shipwayCode: '',
            regionProjectId: '', regionProjectName: '',
            remoteId: '', fuelId: '', fuelName: '',
            currency: '', unitType: '', volumeWeightMode: '',
            bulkWeightRule: '', bulkWeightFreeType: '', bulkWeightFreeValue: '',
            billingWeightRule: '', billingWeightCountType: '', minBillingWeight: '', weightRoundRule: '',
            deliveryDTOList: [],
            extraDTOList: []
        })
        regionData.value = []
    }
})
</script>

<style scoped lang="scss">
.logistics-dialog {
    :deep(.el-dialog__body) {
        padding: 10px 20px;
    }

    .base-info-card {
        :deep(.el-card__body) {
            padding: 15px 20px 0;
        }

        .el-form-item {
            margin-bottom: 15px;
        }
    }

    .tab-panel-inner {
        height: 500px;
        display: flex;
        flex-direction: column;

        .toolbar-area {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;

            /* 运费Tab的工具栏样式 */
            .batch-tools-inline {
                display: flex;
                align-items: center;
                background-color: #f2f6fc;
                padding: 4px 10px;
                border-radius: 4px;
                border: 1px solid #ebeef5;

                .label {
                    font-size: 12px;
                    color: #606266;
                    margin-right: 8px;
                    font-weight: bold;
                }

                .batch-group {
                    display: flex;
                    align-items: center;
                    gap: 5px;

                    .el-input {
                        width: 60px;
                    }

                    .divider {
                        color: #dcdfe6;
                        margin: 0 2px;
                    }
                }
            }
        }

        .table-area,
        .scroll-area {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #ebeef5;
        }

        .surcharge-container {
            border: none;
        }
    }

    .custom-header {
        line-height: 1.2;
        padding: 4px 0;

        .main-title {
            font-weight: bold;
            font-size: 14px;
            color: #303133;
        }

        .sub-title {
            font-size: 12px;
            color: #909399;
            margin-top: 2px;
        }
    }

    /* 优化附加费折叠头部 */
    .surcharge-header-styled {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* 关键：防止折叠面板头部内容撑开宽度导致横向滚动条 */
        flex: 1;
        min-width: 0;
        padding-right: 10px;

        .left-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            overflow: hidden;

            /* 新的序号样式 */
            .index-box {
                width: 24px;
                height: 24px;
                background: #ecf5ff;
                color: #409eff;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                border: 1px solid #d9ecff;
                flex-shrink: 0;
            }

            /* 类型名称组合样式 */
            .info-group {
                display: flex;
                align-items: center;
                background: #fdfdfd;
                border: 1px solid #e4e7ed;
                border-radius: 4px;
                padding: 0 8px;
                height: 28px;
                line-height: 26px;
                /* 减去边框 */

                .info-item {
                    display: flex;
                    align-items: center;
                    font-size: 12px;

                    .label {
                        color: #909399;
                        margin-right: 6px;
                    }

                    .value {
                        font-weight: 600;
                        color: #303133;

                        &.active {
                            color: #303133;
                        }

                        &.empty {
                            color: #c0c4cc;
                            font-weight: normal;
                            font-style: italic;
                        }
                    }
                }

                .divider-vertical {
                    width: 1px;
                    height: 12px;
                    background: #dcdfe6;
                    margin: 0 10px;
                }
            }

            .fuel-tag {
                flex-shrink: 0;
            }

            .remark-content {
                color: #666;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 250px;

                .label {
                    color: #909399;
                    margin-right: 4px;
                }
            }
        }

        .right-actions {
            margin-left: 10px;
            flex-shrink: 0;
        }
    }

    /* 附加费内容区域优化配色 */
    .surcharge-body {
        padding: 15px;
        background-color: #f5f7fa;
        /* 浅灰底 */

        .condition-divider {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0 15px;
            font-weight: bold;
            color: #303133;
            border-left: 3px solid #409eff;
            padding-left: 10px;
            height: 24px;
        }

        .condition-box {
            border: 1px solid #e4e7ed;
            /* 实线边框更干净 */
            background: #ffffff;
            /* 白色卡片 */
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            /* 轻微阴影 */

            .cond-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                border-bottom: 1px dashed #ebeef5;
                padding-bottom: 8px;

                .cond-title {
                    font-size: 13px;
                    font-weight: bold;
                    color: #409eff;
                }
            }

            .dimension-setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #fdfdfd;
                padding: 10px;
                border: 1px solid #ebeef5;
                border-radius: 4px;

                .checks {
                    .label {
                        font-weight: bold;
                        margin-right: 10px;
                        font-size: 13px;
                        color: #606266;
                    }
                }

                .batch-fill {
                    display: flex;
                    align-items: center;

                    .label {
                        font-size: 12px;
                        color: #909399;
                        margin-right: 5px;
                    }
                }
            }

            .region-cell-text {
                display: flex;
                line-height: 1.4;

                .code {
                    font-weight: bold;
                    color: #409eff;
                }

                .desc {
                    font-size: 12px;
                    color: #606266;
                }
            }
        }
    }

    .mb-10 {
        margin-bottom: 10px;
    }

    .mt-5 {
        margin-top: 5px;
    }

    .mt-10 {
        margin-top: 10px;
    }

    .mt-20 {
        margin-top: 20px;
    }

    .ml-5 {
        margin-left: 5px;
    }

    .display-flex {
        display: flex;
    }

    .justify-between {
        justify-content: space-between;
    }
}
</style>