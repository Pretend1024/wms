<template>
    <el-dialog :title="dialogTitle" v-model="visible" width="95%" top="3vh" :close-on-click-modal="false"
        destroy-on-close class="logistics-dialog fixed-height-dialog">
        <div class="dialog-layout">
            <div class="header-section">
                <el-card shadow="never" class="base-info-card">
                    <el-form :model="formData" :rules="rules" ref="formRef" label-width="90px" :disabled="isView">
                        <div class="grid-form-container">
                            <el-form-item label="物流产品" prop="shipwayId">
                                <el-select v-model="formData.shipwayId" filterable placeholder="请选择"
                                    @change="handleShipwayChange" :disabled="isEdit">
                                    <el-option v-for="item in shipwayList" :key="item.id"
                                        :label="`${item.code}-${item.name}`" :value="item.id"
                                        :disabled="excludeShipwayIds.includes(item.id) && item.id !== initialShipwayId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分区方案" prop="regionProjectId">
                                <el-select v-model="formData.regionProjectId" filterable placeholder="请选择"
                                    @change="handleRegionProjectChange">
                                    <el-option v-for="item in regionProjectList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="偏远库" prop="remoteId">
                                <el-select v-model="formData.remoteId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in remoteList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="燃油费模板" prop="fuelId">
                                <el-select v-model="formData.fuelId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in fuelList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="币种" prop="currency">
                                <el-select v-model="formData.currency" placeholder="请选择">
                                    <el-option v-for="item in currencyList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="单位类型" prop="unitType">
                                <el-select v-model="formData.unitType" placeholder="请选择">
                                    <el-option v-for="item in unitTypeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="体积重系数" prop="volumeWeightMode">
                                <el-select v-model="formData.volumeWeightMode" placeholder="请选择">
                                    <el-option v-for="item in volumeModeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分泡规则" prop="bulkWeightRule">
                                <el-select v-model="formData.bulkWeightRule" placeholder="请选择">
                                    <el-option v-for="item in bulkWeightRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="免泡方式" prop="bulkWeightFreeType">
                                <el-select v-model="formData.bulkWeightFreeType" placeholder="请选择">
                                    <el-option v-for="item in bulkWeightFreeTypeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="免泡值" prop="bulkWeightFreeValue">
                                <el-input v-model="formData.bulkWeightFreeValue" v-number="3" placeholder="请输入" />
                            </el-form-item>

                            <el-form-item label="计费重规则" prop="billingWeightRule">
                                <el-select v-model="formData.billingWeightRule" placeholder="请选择">
                                    <el-option v-for="item in billingWeightRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="计费粒度" prop="billingWeightCountType">
                                <el-select v-model="formData.billingWeightCountType" placeholder="请选择">
                                    <el-option v-for="item in billingWeightCountTypeList" :key="item.id"
                                        :label="item.name" :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="最小计费重" prop="minBillingWeight">
                                <el-input v-model="formData.minBillingWeight" v-number="3" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item label="计费重取整" prop="weightRoundRule">
                                <el-select v-model="formData.weightRoundRule" placeholder="请选择">
                                    <el-option v-for="item in weightRoundRuleList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <div class="grid-span-all"></div>
                        </div>
                    </el-form>
                </el-card>
            </div>

            <div class="tabs-section">
                <el-tabs v-if="formData.regionProjectId" v-model="activeTab" type="border-card"
                    class="full-height-tabs">
                    <el-tab-pane label="分区预览" name="region" class="full-pane">
                        <div class="pane-content">
                            <el-table :data="groupedRegionData" border height="100%" style="width: 100%">
                                <el-table-column prop="regionCode" label="分区号" width="95" />
                                <el-table-column label="分区明细" show-overflow-tooltip>
                                    <template #default="{ row }">{{ row.contentStr }}</template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="设置运费" name="delivery" class="full-pane">
                        <div class="pane-content">
                            <div class="toolbar-area" v-if="!isView">
                                <div class="left">
                                    <el-button type="primary" :icon="Plus" @click="addDeliveryRow">新增一行</el-button>
                                    <el-button type="success" :icon="Upload" @click="openImportDialog">导入</el-button>
                                </div>
                                <div class="right batch-form">
                                    <span class="label">批量填充:</span>
                                    <span class="divider">|</span>
                                    <el-input v-model="deliveryBatch.firstValue" v-number="3" placeholder="首重"
                                        class="w-60" />
                                    <el-input v-model="deliveryBatch.addValue" v-number="3" placeholder="续重"
                                        class="w-60" />
                                    <span class="divider">|</span>
                                    <el-input v-model="deliveryBatch.firstPrice" v-number="3" placeholder="首费"
                                        class="w-60" />
                                    <el-input v-model="deliveryBatch.addPrice" v-number="3" placeholder="续费"
                                        class="w-60" />
                                    <el-button type="primary" link @click="handleDeliveryBatchFill">执行</el-button>
                                </div>
                            </div>

                            <div class="table-area">
                                <el-table :data="formData.deliveryDTOList" border height="100%">
                                    <el-table-column type="index" label="序号" width="55" fixed align="center" />
                                    <el-table-column label="起始重量(不包含)" width="85" fixed>
                                        <template #default="{ row }">
                                            <el-input v-model="row.startValue" disabled placeholder="自动" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="截止重量(包含)" width="85" fixed>
                                        <template #default="{ row, $index }">
                                            <el-input v-model="row.endValue" v-number="3" :disabled="isView"
                                                @input="handleEndValueChange(row, $index)"
                                                @blur="handleEndValueBlur(row)" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="首重" width="85" fixed>
                                        <template #default="{ row }"><el-input v-model="row.firstValue" v-number="3"
                                                :disabled="isView" /></template>
                                    </el-table-column>
                                    <el-table-column label="续重单位" width="85" fixed>
                                        <template #default="{ row }"><el-input v-model="row.addValue" v-number="3"
                                                :disabled="isView" /></template>
                                    </el-table-column>

                                    <el-table-column v-for="(region, index) in groupedRegionData" :key="index"
                                        :label="`分区 ${region.regionCode}`" width="200">
                                        <el-table-column label="首重价格" width="85">
                                            <template #default="{ row }">
                                                <el-input v-model="row.deliveryItems[index].firstPrice" v-number="3"
                                                    :disabled="isView" />
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="续重价格" width="85">
                                            <template #default="{ row }">
                                                <el-input v-model="row.deliveryItems[index].addPrice" v-number="3"
                                                    :disabled="isView" />
                                            </template>
                                        </el-table-column>
                                    </el-table-column>

                                    <el-table-column label="操作" width="110" fixed="right" v-if="!isView">
                                        <template #default="{ row, $index }">
                                            <el-button link type="primary"
                                                @click="insertDeliveryRow($index)">插入</el-button>
                                            <el-button link type="danger" @click="delDeliveryRow($index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="设置附加费" name="surcharge" class="full-pane">
                        <div class="pane-content">
                            <div class="toolbar-area mb-10" v-if="!isView">
                                <el-button type="primary" :icon="Plus" @click="addSurcharge">新增附加费</el-button>
                            </div>

                            <div class="scroll-area surcharge-list">
                                <el-collapse v-model="activeSurchargeNames" class="custom-collapse">
                                    <el-collapse-item v-for="(extra, index) in formData.extraDTOList" :key="index"
                                        :name="index" class="surcharge-item">
                                        <template #title>
                                            <div class="surcharge-header-styled">
                                                <div class="left-content">
                                                    <div class="collapse-icon-wrapper"
                                                        :class="{ 'is-active': activeSurchargeNames.includes(index) }">
                                                        <el-icon>
                                                            <CaretRight />
                                                        </el-icon>
                                                    </div>
                                                    <div class="index-box">{{ index + 1 }}</div>
                                                    <div class="info-group">
                                                        <span class="label">类型:</span>
                                                        <span class="value">{{ getFeeTypeName(extra.feeSubTypeId) ||
                                                            '未选择'
                                                        }}</span>
                                                    </div>
                                                    <div class="info-tag fuel-tag" v-if="extra.needFuel">
                                                        <el-tag type="warning" size="small" effect="dark"
                                                            round>燃油</el-tag>
                                                    </div>
                                                    <div class="remark-content" :title="extra.remark">
                                                        <span class="label">备注:</span> {{ extra.remark || '-' }}
                                                    </div>
                                                </div>
                                                <div class="right-actions" @click.stop v-if="!isView">
                                                    <el-button link type="danger" :icon="Delete"
                                                        @click="delSurcharge(index)">删除</el-button>
                                                </div>
                                            </div>
                                        </template>

                                        <div class="surcharge-body">
                                            <el-form label-width="80px" :inline="true" class="mini-form"
                                                :disabled="isView">
                                                <el-form-item label="费用类型" required>
                                                    <el-select v-model="extra.feeSubTypeId" placeholder="选择类型"
                                                        style="width: 200px" @change="handleFeeTypeChange(extra)">
                                                        <el-option v-for="op in vasFeeTypeEnum" :key="op.value"
                                                            :label="op.label" :value="op.value" />
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
                                                <el-button size="small" type="primary" plain
                                                    @click="addCondition(extra)" v-if="!isView">+
                                                    新增条件</el-button>
                                            </div>

                                            <div v-for="(cond, cIdx) in extra.conditionList" :key="cIdx"
                                                class="condition-box">
                                                <div class="cond-header">
                                                    <span class="cond-title">条件 #{{ cIdx + 1 }}</span>
                                                    <el-button link type="danger" icon="Delete"
                                                        @click="delCondition(extra, cIdx)" v-if="!isView"></el-button>
                                                </div>

                                                <el-form label-position="top" size="small" class="compact-cond-form"
                                                    :disabled="isView">
                                                    <el-row :gutter="10">
                                                        <el-col :span="3"><el-form-item label="分组代码"><el-input
                                                                    v-model="cond.groupCode"
                                                                    placeholder="Code" /></el-form-item></el-col>
                                                        <el-col :span="3">
                                                            <el-form-item label="计费单位">
                                                                <el-select v-model="cond.feeUnitTypeId" placeholder="单位"
                                                                    style="width: 100%"
                                                                    @visible-change="loadUnitEnums(extra.feeSubTypeId)">
                                                                    <el-option
                                                                        v-for="u in unitTypeMap[extra.feeSubTypeId] || []"
                                                                        :key="u.id" :label="u.name" :value="u.id" />
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="3"><el-form-item label="单位数量"><el-input
                                                                    v-model="cond.unitQty" v-number="3"
                                                                    placeholder="Qty" /></el-form-item></el-col>
                                                        <el-col :span="15">
                                                            <el-form-item label="计费公式">
                                                                <el-input v-model="cond.formula" placeholder="公式">
                                                                    <template #append>
                                                                        <el-button :icon="Edit"
                                                                            @click="openFormulaDialog(cond, extra.feeSubTypeId)"
                                                                            :disabled="!extra.feeSubTypeId || isView"
                                                                            style="padding: 0 10px" />
                                                                    </template>
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                    <el-row>
                                                        <el-col :span="24"><el-form-item label="公式说明"
                                                                style="margin-bottom: 0;"><el-input
                                                                    v-model="cond.formulaDesc"
                                                                    placeholder="公式的文字说明" /></el-form-item></el-col>
                                                    </el-row>
                                                </el-form>

                                                <div class="dimension-setting mt-10">
                                                    <div class="checks">
                                                        <span class="label">维度:</span>
                                                        <el-checkbox-group v-model="cond.priceDim"
                                                            @change="generatePricingList(cond)" :disabled="isView">
                                                            <el-checkbox v-for="dim in feeDimensionList" :key="dim.id"
                                                                :label="dim.id" :value="dim.id">{{ dim.name
                                                                }}</el-checkbox>
                                                        </el-checkbox-group>
                                                    </div>
                                                    <div class="batch-fill" v-if="!isView">
                                                        <el-input v-model="cond._batchPrice" v-number="3"
                                                            placeholder="单价" size="small" style="width:70px" />
                                                        <el-input v-model="cond._batchMin" v-number="3" placeholder="最小"
                                                            size="small" style="width:70px" class="ml-5" />
                                                        <el-input v-model="cond._batchMax" v-number="3" placeholder="最大"
                                                            size="small" style="width:70px" class="ml-5" />
                                                        <el-button size="small" type="primary" link class="ml-5"
                                                            @click="batchFillPrice(cond)">填充</el-button>
                                                    </div>
                                                </div>

                                                <el-table :data="cond.pricingList" border size="small" class="mt-5"
                                                    max-height="250">
                                                    <el-table-column v-if="cond.priceDim && cond.priceDim.includes(2)"
                                                        label="重量段" width="85">
                                                        <template #default="{ row }">{{ row.dimWeightStart }} - {{
                                                            row.dimWeightEnd }}</template>
                                                    </el-table-column>
                                                    <el-table-column v-if="cond.priceDim && cond.priceDim.includes(4)"
                                                        prop="dimMonth" label="月份" width="60" />
                                                    <el-table-column v-if="cond.priceDim && cond.priceDim.includes(3)"
                                                        label="分区" width="80">
                                                        <template #default="{ row }">{{ row.dimRegion }}</template>
                                                    </el-table-column>
                                                    <el-table-column v-if="cond.priceDim && cond.priceDim.includes(5)"
                                                        prop="dimAddressType" label="地址类型" width="100">
                                                        <template #default="{ row }">{{
                                                            getAddressTypeName(row.dimAddressType) }}</template>
                                                    </el-table-column>
                                                    <el-table-column label="单价">
                                                        <template #default="{ row }"><el-input v-model="row.price"
                                                                v-number="3" size="small"
                                                                :disabled="isView" /></template>
                                                    </el-table-column>
                                                    <el-table-column label="最小收费">
                                                        <template #default="{ row }"><el-input v-model="row.minCharge"
                                                                v-number="3" size="small"
                                                                :disabled="isView" /></template>
                                                    </el-table-column>
                                                    <el-table-column label="最大收费">
                                                        <template #default="{ row }"><el-input v-model="row.maxCharge"
                                                                v-number="3" size="small"
                                                                :disabled="isView" /></template>
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
                <el-empty v-else description="请先选择【分区方案】以配置详细费用" class="mt-20 flex-1" />
            </div>
        </div>

        <template #footer>
            <el-button @click="visible = false">{{ isView ? '关闭' : '取消' }}</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting" v-if="!isView">确定</el-button>
        </template>

        <FormulaDialog v-model="formulaVisible" :feeSubTypeId="currentFeeTypeId"
            :initialFormula="currentFormulaRow?.formula" @confirm="handleFormulaConfirm" />
        <el-dialog title="导入运费" v-model="importVisible" width="30%" append-to-body>
            <el-input type="textarea" :rows="5" placeholder="粘贴Excel数据 (暂未实现具体逻辑)" />
            <template #footer><el-button @click="importVisible = false">关闭</el-button></template>
        </el-dialog>
    </el-dialog>
</template>

<script setup>
// ===================== 【一、导入模块区 - 按需分类导入】 =====================
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Upload, Delete, Edit, InfoFilled, CaretRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 项目公共工具方法
import { smartAlert } from '@/utils/genericMethods.js'
// 自定义子组件
import FormulaDialog from '@/components/FormulaDialog.vue'

// 物流报价相关接口API
import {
    getProductShipwayListApi, getPriceRegionProjectListApi, getPriceRemoteListApi, getPriceFuelListApi,
    getPriceProjectVolumeModeEnumApi, getPriceProjectBulkWeightRuleEnumApi, getPriceProjectBulkWeightFreeTypeEnumApi,
    getPriceProjectBillingWeightRuleEnumApi, getPriceProjectBillingWeightCountTypeEnumApi, getPriceProjectWeightRoundRuleEnumApi,
    getPriceShipwayInfoByIdApi, addOrUpdPriceShipwayApi,
    getFeeSubTypeEnumApi, getFeeUnitTypeEnumApi,
    getFeePriceDimensionEnumApi,
    getRegionsWithDetailByRegionProjectIdApi
} from '@/api/productApi/shipway.js'
// 基础枚举接口API
import { getCurrencyEnumApi } from '@/api/baseApi/index.js'
import { getUnitTypeEnumApi, getBasicAddressTypeEnumApi } from '@/api/baseApi/basic.js'

// ===================== 【二、组件通信区 - Props接收 & Emits派发】 =====================
/**
 * Props接收父组件参数
 * @param modelValue 弹窗显隐状态
 * @param projectId 项目ID
 * @param editData 编辑态回显数据
 * @param excludeShipwayIds 排除的物流产品ID数组
 */
const props = defineProps({
    modelValue: Boolean,
    projectId: String,
    editData: Object,
    isView: { type: Boolean, default: false },
    excludeShipwayIds: { type: Array, default: () => [] }
})

const dialogTitle = computed(() => {
    if (props.isView) return '物流报价详情'
    return isEdit.value ? '编辑物流报价' : '新增物流报价'
})
/**
 * 派发事件给父组件
 * @event update:modelValue 更新弹窗显隐状态(v-model双向绑定)
 * @event success 提交成功回调
 */
const emits = defineEmits(['update:modelValue', 'success'])

// ===================== 【三、响应式数据区 - 按业务功能分类】 =====================
// ===== 3.1 基础弹窗控制/状态数据 =====
const visible = computed({ get: () => props.modelValue, set: (val) => emits('update:modelValue', val) }) // 弹窗显隐双向绑定
const isEdit = computed(() => !!props.editData) // 是否为编辑状态
const initialShipwayId = ref('') // 编辑态初始物流产品ID，用于回显时不禁用自身
const formRef = ref(null) // 表单ref，用于表单校验
const submitting = ref(false) // 提交按钮加载状态
const activeTab = ref('region') // 标签页激活项
const importVisible = ref(false) // 运费导入弹窗显隐

// ===== 3.2 下拉列表/枚举数据源 =====
const shipwayList = ref([]) // 物流产品列表
const regionProjectList = ref([]) // 分区方案列表
const remoteList = ref([]) // 偏远库列表
const fuelList = ref([]) // 燃油费模板列表
const currencyList = ref([]) // 币种枚举列表
const unitTypeList = ref([]) // 单位类型枚举列表
const volumeModeList = ref([]) // 体积重系数枚举列表
const bulkWeightRuleList = ref([]) // 分泡规则枚举列表
const bulkWeightFreeTypeList = ref([]) // 免泡方式枚举列表
const billingWeightRuleList = ref([]) // 计费重规则枚举列表
const billingWeightCountTypeList = ref([]) // 计费粒度枚举列表
const weightRoundRuleList = ref([]) // 计费重取整枚举列表
const vasFeeTypeEnum = ref([]) // 附加费类型枚举列表
const addressTypeEnum = ref([]) // 地址类型枚举列表
const unitTypeMap = reactive({}) // 附加费计费单位映射 {附加费类型ID: 单位列表}
const feeDimensionList = ref([]) // 附加费维度枚举列表

// ===== 3.3 表单核心数据 - 新增/编辑的主数据模型 =====
const formData = reactive({
    id: '', priceProjectId: '', shipwayId: '', shipwayCode: '', regionProjectId: '', regionProjectName: '',
    remoteId: '', fuelId: '', fuelName: '', currency: '', unitType: '', volumeWeightMode: '',
    bulkWeightRule: '', bulkWeightFreeType: '', bulkWeightFreeValue: '', billingWeightRule: '',
    billingWeightCountType: '', minBillingWeight: '', weightRoundRule: '',
    deliveryDTOList: [], // 运费配置列表
    extraDTOList: [] // 附加费配置列表
})

// ===== 3.4 表单校验规则 =====
const rules = {
    shipwayId: [{ required: true, message: '请选择物流产品', trigger: 'change' }],
    regionProjectId: [{ required: true, message: '请选择分区方案', trigger: 'change' }],
}

// ===== 3.5 分区相关数据 =====
const regionData = ref([]) // 分区详情原始数据
/**
 * 计算属性：分组后的分区数据，用于页面展示
 * 按分区号分组，拼接分区明细为字符串，且按分区号升序排列
 */
const groupedRegionData = computed(() => {
    const map = new Map()
    regionData.value.forEach(item => {
        const key = item.regionCode
        if (!map.has(key)) map.set(key, { regionCode: key, contentList: [] })
        if (item.regionDetail) {
            map.get(key).contentList.push(item.regionDetail)
        }
    })
    return Array.from(map.values()).map(item => ({ regionCode: item.regionCode, contentStr: item.contentList.join('; ') })).sort((a, b) => a.regionCode - b.regionCode)
})

// ===== 3.6 运费批量填充数据 =====
const deliveryBatch = reactive({ firstValue: '', firstPrice: '', addValue: '', addPrice: '' })

// ===== 3.7 附加费相关数据 =====
const activeSurchargeNames = ref([]) // 附加费折叠面板激活项
const formulaVisible = ref(false) // 公式编辑弹窗显隐
const currentFormulaRow = ref(null) // 当前编辑公式的行数据
const currentFeeTypeId = ref(null) // 当前附加费类型ID

// ===================== 【四、基础工具方法区 - 通用辅助方法】 =====================
/**
 * 根据附加费类型ID获取附加费类型名称
 * @param {String} id 附加费类型ID
 * @returns {String} 附加费类型名称
 */
const getFeeTypeName = (id) => vasFeeTypeEnum.value.find(i => i.value === id)?.label || ''

/**
 * 根据地址类型值获取地址类型名称
 * @param {String} val 地址类型值
 * @returns {String} 地址类型名称
 */
const getAddressTypeName = (val) => addressTypeEnum.value.find(i => i.id === val)?.name || val

/**
 * 回填物流产品编码/燃油模板名称
 */
const fillNames = () => {
    const sw = shipwayList.value.find(i => i.id === formData.shipwayId); if (sw) formData.shipwayCode = sw.code
    const fl = fuelList.value.find(i => i.id === formData.fuelId); if (fl) formData.fuelName = fl.name
}

// ===================== 【五、基础数据加载方法区 - 枚举/下拉列表加载】 =====================
/**
 * 加载所有枚举/下拉列表数据，页面初始化时调用
 */
const loadEnums = async () => {
    try {
        const [resShipway, resRegionProject, resRemote, resFuel, resCurrency, resUnit, resVol, resBulk, resBulkFree, resBillRule, resBillCount, resRound, resVasType, resAddrType, resDimension] = await Promise.all([
            getProductShipwayListApi(), getPriceRegionProjectListApi(), getPriceRemoteListApi(), getPriceFuelListApi(), getCurrencyEnumApi(), getUnitTypeEnumApi(), getPriceProjectVolumeModeEnumApi(), getPriceProjectBulkWeightRuleEnumApi(), getPriceProjectBulkWeightFreeTypeEnumApi(), getPriceProjectBillingWeightRuleEnumApi(), getPriceProjectBillingWeightCountTypeEnumApi(), getPriceProjectWeightRoundRuleEnumApi(),
            getFeeSubTypeEnumApi(), getBasicAddressTypeEnumApi(), getFeePriceDimensionEnumApi()
        ])
        shipwayList.value = resShipway.data || [];
        regionProjectList.value = resRegionProject.data || [];
        remoteList.value = resRemote.data || [];
        fuelList.value = resFuel.data || [];
        currencyList.value = (resCurrency.data || []).map(i => ({ id: i.id, name: i.name }));
        unitTypeList.value = resUnit.data || [];
        volumeModeList.value = resVol.data || [];
        bulkWeightRuleList.value = resBulk.data || [];
        bulkWeightFreeTypeList.value = resBulkFree.data || [];
        billingWeightRuleList.value = resBillRule.data || [];
        billingWeightCountTypeList.value = resBillCount.data || [];
        weightRoundRuleList.value = resRound.data || [];
        vasFeeTypeEnum.value = (resVasType.data || []).map(i => ({ value: i.id, label: i.name }));
        addressTypeEnum.value = resAddrType.data || [];
        feeDimensionList.value = resDimension.data || []
    } catch (e) { console.error('枚举数据加载失败：', e) }
}

// ===================== 【六、分区方案联动方法区】 =====================
/**
 * 初始化运费表格数据，添加默认第一行
 */
const initDeliveryTable = () => {
    if (formData.deliveryDTOList.length === 0 && groupedRegionData.value.length > 0) {
        formData.deliveryDTOList.push({
            startValue: 0,
            endValue: '',
            firstValue: '',
            addValue: '',
            deliveryItems: groupedRegionData.value.map(r => ({
                regionCode: r.regionCode, stageTypeId: 1, firstPrice: '', addPrice: ''
            }))
        })
    }
}

/**
 * 物流产品下拉选择事件
 * @param {String} val 选中的物流产品ID
 */
const handleShipwayChange = (val) => { const item = shipwayList.value.find(i => i.id === val); if (item) formData.shipwayCode = item.code }

/**
 * 分区方案下拉选择事件 - 核心联动方法
 * @param {String} val 选中的分区方案ID
 */
const handleRegionProjectChange = async (val) => {
    if (!val) { regionData.value = []; formData.deliveryDTOList = []; return }
    const project = regionProjectList.value.find(i => i.id === val)
    if (project) formData.regionProjectName = project.name

    const res = await getRegionsWithDetailByRegionProjectIdApi({ regionProjectId: val })
    if (res.success) {
        regionData.value = res.data;
        if (!isEdit.value) {
            formData.deliveryDTOList = []
            initDeliveryTable()
        }
    }
}

// ===================== 【七、运费表格核心操作方法区】 =====================
/**
 * 截止重量输入实时监听 - 核心联动逻辑
 * 当前行截止重量变更时，自动赋值给下一行的起始重量，保证重量段连续
 * @param {Object} row 当前行数据
 * @param {Number} index 当前行索引
 */
const handleEndValueChange = (row, index) => {
    const list = formData.deliveryDTOList
    if (index < list.length - 1) {
        list[index + 1].startValue = row.endValue
    }
}

/**
 * 截止重量失去焦点校验
 * 校验截止重量必须大于起始重量，不满足则给出提示
 * @param {Object} row 当前行数据
 */
const handleEndValueBlur = (row) => {
    if (row.endValue && row.startValue !== '' && Number(row.endValue) <= Number(row.startValue)) {
        smartAlert('截止重量必须大于起始重量', false)
    }
}

/**
 * 运费表格批量填充数据
 * 批量给所有行填充首重/续重/首费/续费数据
 */
const handleDeliveryBatchFill = () => {
    if (!formData.deliveryDTOList.length) return smartAlert('暂无数据', false)
    formData.deliveryDTOList.forEach(row => {
        if (deliveryBatch.firstValue) row.firstValue = deliveryBatch.firstValue
        if (deliveryBatch.addValue) row.addValue = deliveryBatch.addValue
        row.deliveryItems.forEach(item => {
            if (deliveryBatch.firstPrice) item.firstPrice = deliveryBatch.firstPrice
            if (deliveryBatch.addPrice) item.addPrice = deliveryBatch.addPrice
        })
    })
    ElMessage.success('填充完成')
}

/**
 * 重新链接受理重量段，保证所有行的起始重量=上一行截止重量，第一行起始重量固定为0
 * 新增/插入/删除行后都会调用，核心保障重量段连续性
 */
const rechainWeights = () => {
    const list = formData.deliveryDTOList
    if (list.length === 0) return

    // 规则：第一行起始重量永远强制为 0
    list[0].startValue = 0

    // 规则：从第二行开始，起始重量 = 上一行的截止重量
    for (let i = 1; i < list.length; i++) {
        const prevRow = list[i - 1]
        list[i].startValue = prevRow.endValue
    }
}

/**
 * 运费表格新增一行
 */
const addDeliveryRow = () => {
    if (groupedRegionData.value.length === 0) return smartAlert('请先选择分区方案', false)

    const list = formData.deliveryDTOList
    const newRow = {
        startValue: '',
        endValue: '',
        firstValue: '',
        addValue: '',
        deliveryItems: groupedRegionData.value.map(r => ({
            regionCode: r.regionCode, stageTypeId: 1, firstPrice: '', addPrice: ''
        }))
    }
    list.push(newRow)
    rechainWeights()
}

/**
 * 运费表格在指定位置插入一行
 * @param {Number} index 插入位置索引
 */
const insertDeliveryRow = (index) => {
    if (groupedRegionData.value.length === 0) return

    const list = formData.deliveryDTOList
    const newRow = {
        startValue: '',
        endValue: '',
        firstValue: '',
        addValue: '',
        deliveryItems: groupedRegionData.value.map(r => ({
            regionCode: r.regionCode, stageTypeId: 1, firstPrice: '', addPrice: ''
        }))
    }
    list.splice(index, 0, newRow)
    rechainWeights()
}

/**
 * 运费表格删除指定行
 * @param {Number} index 删除行索引
 */
const delDeliveryRow = (index) => {
    const list = formData.deliveryDTOList
    list.splice(index, 1)
    rechainWeights()
    if (list.length === 0) {
        initDeliveryTable()
    }
}

/**
 * 打开运费导入弹窗
 */
const openImportDialog = () => importVisible.value = true

// ===================== 【八、附加费配置核心操作方法区】 =====================
/**
 * 加载附加费对应的计费单位枚举
 * @param {String} typeId 附加费类型ID
 */
const loadUnitEnums = async (typeId) => {
    if (!typeId || unitTypeMap[typeId]) return
    try {
        const res = await getFeeUnitTypeEnumApi({ subTypeId: typeId })
        unitTypeMap[typeId] = res.data || []
    } catch (e) { console.error('附加费单位加载失败：', e) }
}

/**
 * 附加费类型选择变更事件
 * @param {Object} extra 当前附加费行数据
 */
const handleFeeTypeChange = (extra) => {
    if (extra.conditionList) extra.conditionList.forEach(c => c.feeUnitTypeId = '')
    loadUnitEnums(extra.feeSubTypeId)
}

/**
 * 新增一条附加费配置
 */
const addSurcharge = () => {
    const newExtra = { feeSubTypeId: '', subTypeId: '', needFuel: false, remark: '', conditionList: [] }
    addCondition(newExtra)
    formData.extraDTOList.push(newExtra)
    activeSurchargeNames.value.push(formData.extraDTOList.length - 1)
}

/**
 * 删除指定附加费配置
 * @param {Number} index 附加费索引
 */
const delSurcharge = (index) => formData.extraDTOList.splice(index, 1)

/**
 * 给指定附加费新增一条收费条件
 * @param {Object} extra 当前附加费行数据
 */
const addCondition = (extra) => {
    const newCond = {
        groupCode: '', feeUnitTypeId: '', unitQty: '', formula: '', formulaDesc: '',
        priceDim: [1], // 默认选中固定单价
        _batchPrice: '', _batchMin: '', _batchMax: '',
        pricingList: []
    }
    newCond.pricingList.push({
        dimMonth: null, dimRegion: null, dimAddressType: null,
        dimWeightStart: null, dimWeightEnd: null,
        price: '', minCharge: '', maxCharge: ''
    })
    extra.conditionList.push(newCond)
}

/**
 * 删除指定附加费的指定收费条件
 * @param {Object} extra 当前附加费行数据
 * @param {Number} index 收费条件索引
 */
const delCondition = (extra, index) => extra.conditionList.splice(index, 1)

/**
 * 打开公式编辑弹窗
 * @param {Object} condRow 当前收费条件行数据
 * @param {String} typeId 附加费类型ID
 */
const openFormulaDialog = (condRow, typeId) => {
    currentFormulaRow.value = condRow; currentFeeTypeId.value = typeId; formulaVisible.value = true
}

/**
 * 公式编辑弹窗确认回调
 * @param {String} str 编辑后的公式字符串
 */
const handleFormulaConfirm = (str) => { if (currentFormulaRow.value) currentFormulaRow.value.formula = str }

/**
 * 根据选择的维度，生成附加费价格列表（笛卡尔积生成组合数据）
 * @param {Object} cond 当前收费条件行数据
 */
const generatePricingList = (cond) => {
    const dims = cond.priceDim || []
    const months = dims.includes(4) ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] : [null]
    const regions = dims.includes(3) ? groupedRegionData.value.map(r => r.regionCode) : [null]
    const addresses = dims.includes(5) ? addressTypeEnum.value.map(a => a.id) : [null]

    let weightRanges = [null]
    if (dims.includes(2)) {
        if (formData.deliveryDTOList && formData.deliveryDTOList.length > 0) {
            weightRanges = formData.deliveryDTOList.map(row => ({ start: row.startValue, end: row.endValue }))
        } else {
            weightRanges = []
        }
    }

    const list = []
    weightRanges.forEach(w => {
        months.forEach(m => {
            regions.forEach(r => {
                addresses.forEach(a => {
                    list.push({
                        dimWeightStart: w ? w.start : null,
                        dimWeightEnd: w ? w.end : null,
                        dimMonth: m,
                        dimRegion: r,
                        dimAddressType: a,
                        price: '',
                        minCharge: '',
                        maxCharge: ''
                    })
                })
            })
        })
    })
    cond.pricingList = list
}

/**
 * 附加费价格列表批量填充数据
 * @param {Object} cond 当前收费条件行数据
 */
const batchFillPrice = (cond) => {
    cond.pricingList.forEach(item => {
        if (cond._batchPrice) item.price = cond._batchPrice
        if (cond._batchMin) item.minCharge = cond._batchMin
        if (cond._batchMax) item.maxCharge = cond._batchMax
    })
}

// ===================== 【九、表单提交核心方法区】 =====================
/**
 * 表单提交方法 - 新增/编辑统一提交入口
 */
const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            openMainLoading()
            submitting.value = true
            try {
                fillNames()
                // 深拷贝表单数据
                const payload = JSON.parse(JSON.stringify(formData))

                // ---------------- 0. 根节点字段类型转换 (String -> Number) ----------------
                if (payload.bulkWeightFreeValue) payload.bulkWeightFreeValue = Number(payload.bulkWeightFreeValue)
                if (payload.minBillingWeight) payload.minBillingWeight = Number(payload.minBillingWeight)

                // ---------------- 1. 处理运费列表 (deliveryDTOList) ----------------
                if (payload.deliveryDTOList && payload.deliveryDTOList.length > 0) {
                    payload.deliveryDTOList.forEach(row => {
                        // 转换外层重量段
                        row.startValue = Number(row.startValue)
                        row.endValue = Number(row.endValue)

                        if (row.deliveryItems && row.deliveryItems.length > 0) {
                            row.deliveryItems.forEach(item => {
                                // 1.1 将外层首续重赋值给内层，并转为 Number
                                item.firstValue = Number(row.firstValue)
                                item.addValue = Number(row.addValue)

                                // 1.2 将价格转为 Number
                                item.firstPrice = Number(item.firstPrice)
                                item.addPrice = Number(item.addPrice)
                            })
                        }
                        // 移除外层冗余字段
                        delete row.firstValue
                        delete row.addValue
                    })
                }

                // ---------------- 2. 处理附加费列表 (extraDTOList) ----------------
                if (payload.extraDTOList && payload.extraDTOList.length > 0) {
                    payload.extraDTOList.forEach(extra => {

                        if (extra.conditionList && extra.conditionList.length > 0) {
                            extra.conditionList.forEach(cond => {
                                // 字段映射：unitId -> feeUnitTypeId
                                if (cond.unitId) {
                                    cond.feeUnitTypeId = cond.unitId
                                    delete cond.unitId
                                }

                                // 类型转换：单位数量转 Number
                                if (cond.unitQty) cond.unitQty = Number(cond.unitQty)

                                // 格式转换：priceDim 数组转字符串
                                if (Array.isArray(cond.priceDim)) {
                                    cond.priceDim = cond.priceDim.join(',')
                                }

                                // 移除临时字段
                                delete cond._batchPrice
                                delete cond._batchMin
                                delete cond._batchMax
                                delete cond._isMonth
                                delete cond._isRegion
                                delete cond._isAddress

                                // 处理价格明细 (pricingList)
                                if (cond.pricingList && cond.pricingList.length > 0) {
                                    cond.pricingList.forEach(priceItem => {
                                        // 接口要求：dimFixed 固定为 1
                                        priceItem.dimFixed = 1

                                        // 类型转换：价格相关转 Number
                                        if (priceItem.price) priceItem.price = Number(priceItem.price)
                                        if (priceItem.minCharge) priceItem.minCharge = Number(priceItem.minCharge)
                                        if (priceItem.maxCharge) priceItem.maxCharge = Number(priceItem.maxCharge)

                                        // 类型转换：月份如果是字符串 "1"，转为数字 1
                                        if (priceItem.dimMonth) priceItem.dimMonth = Number(priceItem.dimMonth)

                                        // 拼接重量段字符串 "0-1"
                                        if (priceItem.dimWeightStart !== null && priceItem.dimWeightStart !== undefined &&
                                            priceItem.dimWeightEnd !== null && priceItem.dimWeightEnd !== undefined) {
                                            priceItem.dimWeightRange = `${priceItem.dimWeightStart}-${priceItem.dimWeightEnd}`
                                        } else {
                                            priceItem.dimWeightRange = null
                                        }

                                        // 移除旧字段
                                        delete priceItem.dimWeightStart
                                        delete priceItem.dimWeightEnd
                                    })
                                }
                            })
                        }
                    })
                }
                const res = await addOrUpdPriceShipwayApi(payload)
                smartAlert(res.msg, res.success, 1000)
                if (res.success) {
                    emits('success');
                    visible.value = false
                } else {
                    ElMessage.error(res.msg)
                }
            } catch (e) {
                console.error('提交失败：', e)
            } finally {
                closeMainLoading()
                submitting.value = false
            }
        }
    })
}

// ===================== 【十、生命周期钩子 - 页面初始化】 =====================
/**
 * 组件挂载完成后执行初始化逻辑
 */
onMounted(async () => {
    openMainLoading()
    // 1. 加载所有枚举/下拉列表数据
    await loadEnums()

    // 2. 判断是编辑还是新增
    if (props.editData && props.editData.id) {
        try {
            // 调用详情接口
            const res = await getPriceShipwayInfoByIdApi({ id: props.editData.id })
            if (res.success) {
                const data = res.data
                initialShipwayId.value = data.shipwayId // 记录初始ID

                // 先合并基础数据
                Object.assign(formData, data)

                // 【核心】处理分区方案联动
                if (formData.regionProjectId) {
                    await handleRegionProjectChange(formData.regionProjectId)

                    // 恢复运费列表数据
                    if (data.deliveryDTOList && data.deliveryDTOList.length > 0) {
                        // 使用 map 处理数据，解决问题 1：首重和续重单位回显
                        formData.deliveryDTOList = data.deliveryDTOList.map(row => {
                            // 从 deliveryItems 的第一项中恢复外层的首重/续重单位
                            if (row.deliveryItems && row.deliveryItems.length > 0) {
                                const firstItem = row.deliveryItems[0]
                                row.firstValue = firstItem.firstValue
                                row.addValue = firstItem.addValue
                            }
                            return row
                        })
                    } else {
                        // 防错处理
                        if (formData.deliveryDTOList.length === 0) initDeliveryTable()
                    }
                }

                // 【核心】处理附加费的 UI 状态回显
                if (formData.extraDTOList && formData.extraDTOList.length > 0) {
                    formData.extraDTOList.forEach((e) => {
                        // 1. 触发子费用类型的单位下拉加载
                        if (e.feeSubTypeId) loadUnitEnums(e.feeSubTypeId)

                        // 2. 恢复收费条件的维度勾选状态
                        if (e.conditionList) {
                            e.conditionList.forEach(c => {
                                // 解决问题 2：priceDim 反处理 (String -> Array)
                                if (c.priceDim && typeof c.priceDim === 'string') {
                                    c.priceDim = c.priceDim.split(',').map(Number)
                                } else {
                                    // 兜底逻辑：如果后端没返回 priceDim，尝试从 pricingList 推断
                                    c.priceDim = []
                                    if (c.pricingList && c.pricingList.length > 0) {
                                        const f = c.pricingList[0]
                                        if (f.dimMonth !== null) c.priceDim.push(4)
                                        if (f.dimRegion !== null) c.priceDim.push(3)
                                        if (f.dimAddressType !== null) c.priceDim.push(5)
                                        if (f.dimWeightStart !== null || f.dimWeightEnd !== null || f.dimWeightRange) {
                                            c.priceDim.push(2)
                                        }
                                    }
                                    // 默认值
                                    if (c.priceDim.length === 0) c.priceDim.push(1)
                                }
                            })
                        }
                    })
                    // 默认展开第一个
                    // activeSurchargeNames.value = [0]
                }
            }
        } catch (e) {
            console.error('获取物流报价详情失败', e)
        }
    } else {
        // --- 新增模式初始化 ---
        initialShipwayId.value = ''
        Object.assign(formData, {
            id: '', priceProjectId: props.projectId, shipwayId: '', shipwayCode: '',
            regionProjectId: '', regionProjectName: '', remoteId: '', fuelId: '', fuelName: '',
            currency: '', unitType: '', volumeWeightMode: '', bulkWeightRule: '',
            bulkWeightFreeType: '', bulkWeightFreeValue: '', billingWeightRule: '',
            billingWeightCountType: '', minBillingWeight: '', weightRoundRule: '',
            deliveryDTOList: [], extraDTOList: []
        })
        regionData.value = []
        addSurcharge()
    }
    closeMainLoading()
})
</script>

<style scoped lang="scss">
.logistics-dialog {
    :deep(.el-dialog__body) {
        padding: 0;
        height: 75vh;
        overflow: hidden;
    }

    .dialog-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    .header-section {
        flex-shrink: 0;
        margin-bottom: 10px;

        .base-info-card {
            :deep(.el-card__body) {
                padding: 15px 15px 0;
            }

            .grid-form-container {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 0 10px;

                .el-form-item {
                    margin-bottom: 5px;
                    width: 100%;
                }
            }
        }
    }

    .tabs-section {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .full-height-tabs {
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid #dcdfe6;

            :deep(.el-tabs__content) {
                flex: 1;
                padding: 15px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
        }
    }

    .pane-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .toolbar-area {
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .batch-form {
                display: flex;
                align-items: center;
                gap: 5px;

                .label {
                    font-size: 12px;
                    color: #666;
                    margin-right: 5px;
                    font-weight: bold;
                }

                .w-60 {
                    width: 60px;
                }

                .divider {
                    color: #dcdfe6;
                    margin: 0 5px;
                }
            }
        }

        .table-area,
        .scroll-area {
            flex: 1;
            overflow-y: auto;
            border: 1px solid #ebeef5;
        }

        .surcharge-list {
            overflow-x: hidden;
        }
    }

    // 隐藏折叠面板默认箭头，自定义箭头样式
    :deep(.el-collapse-item__arrow) {
        display: none;
    }

    .surcharge-item {
        margin-bottom: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        overflow: hidden;

        :deep(.el-collapse-item__header) {
            background-color: #f5f7fa;
            padding: 0 12px;
            height: 48px;
            line-height: 48px;
            border-bottom: 1px solid #e4e7ed;
        }

        .surcharge-header-styled {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .left-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
                overflow: hidden;

                .collapse-icon-wrapper {
                    cursor: pointer;
                    color: #909399;
                    transition: transform 0.3s;

                    &.is-active {
                        transform: rotate(90deg);
                        color: #409eff;
                    }
                }

                .index-box {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    background: #909399;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 12px;
                }

                .info-group {
                    font-size: 13px;
                    color: #303133;
                    display: flex;
                    align-items: center;

                    .label {
                        color: #909399;
                        margin-right: 5px;
                    }

                    .value {
                        font-weight: 500;
                        width: 130px;
                    }
                }

                .remark-content {
                    color: #666;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 300px;
                    border-left: 1px solid #dcdfe6;
                    padding-left: 10px;
                }
            }

            .right-actions {
                margin-left: 10px;
            }
        }

        .surcharge-body {
            padding: 10px;
            background-color: #fff;

            .condition-divider {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0 10px;
                font-weight: bold;
                color: #303133;
                border-left: 3px solid #409eff;
                padding-left: 8px;
                background: #f2f6fc;
                padding: 4px 8px;
                border-radius: 4px;
            }

            .condition-box {
                border: 1px solid #ebeef5;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                background: #fff;

                .cond-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;

                    .cond-title {
                        font-size: 13px;
                        font-weight: bold;
                        color: #606266;
                    }
                }

                .compact-cond-form {
                    .el-form-item {
                        margin-bottom: 8px;
                    }

                    :deep(.el-form-item__label) {
                        padding: 0;
                        line-height: 1.2;
                        font-size: 12px;
                        margin-bottom: 2px;
                    }
                }

                .dimension-setting {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #f9f9f9;
                    padding: 5px 10px;
                    border: 1px solid #eee;
                    border-radius: 4px;

                    .checks {
                        display: flex;
                        align-items: center;

                        .label {
                            margin-right: 10px;
                            white-space: nowrap;
                        }

                        :deep(.el-checkbox-group) {
                            display: flex;
                            flex-wrap: wrap;

                            .el-checkbox {
                                margin-right: 15px;
                            }
                        }
                    }
                }
            }
        }
    }

    .mini-form {
        margin-bottom: -20px;
    }

    // 通用间距样式
    .mb-10 {
        margin-bottom: 10px;
    }

    .mb-5 {
        margin-bottom: 5px;
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

    .flex-1 {
        flex: 1;
    }
}
</style>