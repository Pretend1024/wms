<template>
    <el-dialog :title="isView ? '操作费详情' : (isEdit ? '编辑操作费' : '新增操作费')" v-model="visible" width="85%" top="5vh"
        :close-on-click-modal="false" destroy-on-close class="operation-dialog fixed-height-dialog">
        <div class="dialog-layout">
            <div class="header-section">
                <el-card shadow="never" class="base-info-card">
                    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px" :disabled="isView">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="主费用类型" prop="feeMainTypeId">
                                    <el-select v-model="formData.feeMainTypeId" placeholder="请选择" clearable filterable
                                        :disabled="isEdit">
                                        <el-option v-for="item in feeMainTypeEnum" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="业务费用类型" prop="feeBizTypeId">
                                    <el-select v-model="formData.feeBizTypeId" placeholder="请选择" clearable filterable
                                        :disabled="isEdit" @change="handleBizTypeChange">
                                        <el-option v-for="item in feeBizTypeEnum" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="子费用类型" prop="feeSubTypeId">
                                    <el-select v-model="formData.feeSubTypeId" placeholder="请选择" clearable filterable
                                        :disabled="isEdit" @change="handleSubTypeChange">
                                        <el-option v-for="item in subTypeOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="formData.remark" type="textarea" :rows="2"
                                        placeholder="请输入备注信息" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>
            </div>

            <div class="list-section">
                <div class="section-header">
                    <div class="left">
                        <span class="title">费用详情列表</span>
                        <span class="tip-text">
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                            同分组代码的收费条件只会生效一个(取金额最大的)，排序号越小优先级越高
                        </span>
                    </div>
                    <el-button v-if="!isView" type="primary" size="small" :icon="Plus"
                        @click="addDetailRow">新增详情</el-button>
                </div>

                <div class="table-area">
                    <el-table ref="detailTableRef" :data="formData.detailDTOList" border height="100%" row-key="_tempId"
                        :expand-row-keys="expandedRowKeys" @expand-change="handleExpandChange">

                        <el-table-column type="expand" width="55">
                            <template #default="{ row }">
                                <div class="sticky-wrapper">
                                    <div class="expand-form-container">
                                        <el-form label-position="top" size="small" class="compact-expand-form"
                                            :disabled="isView">

                                            <el-row :gutter="10">
                                                <el-col :span="3">
                                                    <el-form-item label="分组代码">
                                                        <el-input v-model="row.groupCode" placeholder="Code" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="3">
                                                    <el-form-item label="排序号">
                                                        <el-input v-model="row.sortNo" v-number="0"
                                                            placeholder="Sort" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="3">
                                                    <el-form-item label="计费单位">
                                                        <el-select v-model="row.feeUnitTypeId" placeholder="单位"
                                                            style="width: 100%">
                                                            <el-option v-for="u in unitTypeOptions" :key="u.value"
                                                                :label="u.label" :value="u.value" />
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="3">
                                                    <el-form-item label="单位数量">
                                                        <el-input v-model="row.unitQty" v-number="3"
                                                            placeholder="Qty" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-form-item label="单价">
                                                        <el-input v-model="row.price" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-form-item label="最小收费">
                                                        <el-input v-model="row.minCharge" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-form-item label="最大收费">
                                                        <el-input v-model="row.maxCharge" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                            <el-row :gutter="10">
                                                <el-col :span="24">
                                                    <el-form-item label="计费公式" style="margin-bottom: 5px;">
                                                        <el-input v-model="row.formula" placeholder="例如: #W * 0.5">
                                                            <template #append>
                                                                <el-button :icon="Edit" @click="openFormulaDialog(row)"
                                                                    :disabled="isView" />
                                                            </template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                            <el-row :gutter="10">
                                                <el-col :span="24">
                                                    <el-form-item label="公式说明" style="margin-bottom: 0;">
                                                        <el-input v-model="row.formulaDesc" placeholder="公式的文字说明" />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                        </el-form>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="分组代码" prop="groupCode" width="100" show-overflow-tooltip />
                        <el-table-column label="排序" prop="sortNo" width="60" />
                        <el-table-column label="计费单位" prop="feeUnitTypeId" width="100">
                            <template #default="{ row }">{{ getUnitName(row.feeUnitTypeId) }}</template>
                        </el-table-column>
                        <el-table-column label="单位数量" prop="unitQty" width="90" />
                        <el-table-column label="单价" prop="price" width="60" />
                        <el-table-column label="最小收费" prop="minCharge" width="90" />
                        <el-table-column label="最大收费" prop="maxCharge" width="90" />
                        <el-table-column label="公式" prop="formula" width="250" show-overflow-tooltip />
                        <el-table-column label="说明" prop="formulaDesc" width="250" show-overflow-tooltip />

                        <el-table-column v-if="!isView" label="操作" width="120" fixed="right">
                            <template #default="{ row }">
                                <el-button link type="primary" @click="editDetailRow(row)">编辑</el-button>
                                <el-button link type="danger" @click="delDetailRow(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <template #footer>
            <el-button @click="visible = false">{{ isView ? '关闭' : '取消' }}</el-button>
            <el-button v-if="!isView" type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </template>

        <FormulaDialog v-model="formulaVisible" :feeSubTypeId="formData.feeSubTypeId"
            :initialFormula="currentEditingRow?.formula" @confirm="handleFormulaConfirm" />
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Plus, InfoFilled, Edit } from '@element-plus/icons-vue' // 引入 Edit 图标
import { smartAlert } from '@/utils/genericMethods.js'

// 自定义组件
import FormulaDialog from '@/components/FormulaDialog.vue'

// API
import { getFeeBizTypeEnumApi, getFeeSubTypeEnumApi } from '@/api/financeApi/receivables.js'
import { getFeeMainTypeEnumApi, addOrUpdPriceWhOpApi, getFeeUnitTypeEnumApi, getPriceWhOpInfoByIdApi } from '@/api/productApi/shipway.js'

const props = defineProps({
    modelValue: Boolean,
    projectId: String,
    isView: { type: Boolean, default: false },
    editData: Object
})
const emits = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emits('update:modelValue', val)
})
const isEdit = computed(() => !!props.editData)

const formRef = ref(null)
const submitting = ref(false)
const detailTableRef = ref(null)

// 公式弹窗相关
const formulaVisible = ref(false)
const currentEditingRow = ref(null)

const feeMainTypeEnum = ref([])
const feeBizTypeEnum = ref([])
const subTypeOptions = ref([])
const unitTypeOptions = ref([])

const formData = reactive({
    id: '',
    priceProjectId: '',
    feeMainTypeId: '',
    feeBizTypeId: '',
    feeSubTypeId: '',
    remark: '',
    detailDTOList: []
})

const rules = {
    feeMainTypeId: [{ required: true, message: '请选择主费用类型', trigger: 'change' }],
    feeBizTypeId: [{ required: true, message: '请选择业务费用类型', trigger: 'change' }],
    feeSubTypeId: [{ required: true, message: '请选择子费用类型', trigger: 'change' }]
}

// --- 详情表格逻辑 ---
const expandedRowKeys = ref([])

const getUnitName = (id) => {
    const item = unitTypeOptions.value.find(i => i.value === id)
    return item ? item.label : id
}

// 1. 新增详情行
const addDetailRow = () => {
    const newRow = {
        _tempId: Date.now(),
        groupCode: '',
        sortNo: '',
        feeUnitTypeId: '',
        unitQty: '',
        price: '',
        minCharge: '',
        maxCharge: '',
        formula: '',
        formulaDesc: ''
    }
    formData.detailDTOList.push(newRow)
    nextTick(() => {
        if (detailTableRef.value) {
            // 关闭其他行，只展开新行
            formData.detailDTOList.forEach(item => {
                if (item._tempId !== newRow._tempId) {
                    detailTableRef.value.toggleRowExpansion(item, false)
                }
            })
            detailTableRef.value.toggleRowExpansion(newRow, true)
        }
    })
}

// 2. 编辑详情行 (展开)
const editDetailRow = (row) => {
    if (detailTableRef.value) {
        formData.detailDTOList.forEach(item => {
            if (item._tempId !== row._tempId) {
                detailTableRef.value.toggleRowExpansion(item, false)
            }
        })
        detailTableRef.value.toggleRowExpansion(row, true)
    }
}

// 3. 展开事件处理
const handleExpandChange = (row, expandedRows) => {
    if (expandedRows.length > 1) {
        const isOpening = expandedRows.some(r => r._tempId === row._tempId)
        if (isOpening) {
            expandedRows.forEach(r => {
                if (r._tempId !== row._tempId) {
                    detailTableRef.value.toggleRowExpansion(r, false)
                }
            })
        }
    }
}

// 4. 删除详情行
const delDetailRow = (row) => {
    const index = formData.detailDTOList.findIndex(i => i._tempId === row._tempId)
    if (index > -1) {
        formData.detailDTOList.splice(index, 1)
    }
    // 如果删除后为空，自动补充一行
    if (formData.detailDTOList.length === 0) {
        addDetailRow()
    }
}

// --- 公式弹窗逻辑 ---
const openFormulaDialog = (row) => {
    currentEditingRow.value = row
    formulaVisible.value = true
}

const handleFormulaConfirm = (formulaStr) => {
    if (currentEditingRow.value) {
        currentEditingRow.value.formula = formulaStr
    }
}

// --- 级联数据加载逻辑 ---
const loadBaseEnums = async () => {
    try {
        const [resMain, resBiz] = await Promise.all([
            getFeeMainTypeEnumApi(),
            getFeeBizTypeEnumApi()
        ])
        feeMainTypeEnum.value = (resMain.data || []).map(item => ({ label: item.name || item.label, value: item.id || item.value }))
        feeBizTypeEnum.value = (resBiz.data || []).map(item => ({ label: item.name || item.label, value: item.id || item.value }))
    } catch (e) {
        console.error('加载基础枚举失败', e)
    }
}

const handleBizTypeChange = async (val) => {
    formData.feeSubTypeId = ''
    formData.feeUnitTypeId = ''
    subTypeOptions.value = []
    unitTypeOptions.value = []
    if (val) {
        try {
            const res = await getFeeSubTypeEnumApi({ feeBizTypeId: val })
            subTypeOptions.value = (res.data || []).map(item => ({ label: item.name, value: item.id }))
        } catch (error) { console.error(error) }
    }
}

const handleSubTypeChange = async (val) => {
    unitTypeOptions.value = []
    if (val) {
        try {
            const unitRes = await getFeeUnitTypeEnumApi({ subTypeId: val })
            unitTypeOptions.value = (unitRes.data || []).map(item => ({ label: item.name, value: item.id }))
        } catch (error) { console.error(error) }
    }
}

const loadSubTypeData = async (bizTypeId) => {
    if (!bizTypeId) return
    const res = await getFeeSubTypeEnumApi({ feeBizTypeId: bizTypeId })
    subTypeOptions.value = (res.data || []).map(item => ({ label: item.name, value: item.id }))
}

const loadUnitTypeData = async (subTypeId) => {
    if (!subTypeId) return
    const unitRes = await getFeeUnitTypeEnumApi({ subTypeId: subTypeId })
    unitTypeOptions.value = (unitRes.data || []).map(item => ({ label: item.name, value: item.id }))
}

// --- 提交逻辑 ---
const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            openMainLoading()
            submitting.value = true
            try {
                const payload = JSON.parse(JSON.stringify(formData))
                payload.feeMainTypeId = Number(payload.feeMainTypeId)
                payload.feeBizTypeId = Number(payload.feeBizTypeId)
                payload.feeSubTypeId = Number(payload.feeSubTypeId)

                payload.detailDTOList = payload.detailDTOList.map(d => {
                    const item = { ...d }
                    delete item._tempId
                    if (!item.priceProjectId) item.priceProjectId = payload.priceProjectId
                    item.sortNo = item.sortNo ? Number(item.sortNo) : undefined
                    item.feeUnitTypeId = item.feeUnitTypeId ? Number(item.feeUnitTypeId) : 0
                    item.unitQty = item.unitQty ? Number(item.unitQty) : 0
                    item.price = item.price ? Number(item.price) : 0
                    item.minCharge = item.minCharge ? Number(item.minCharge) : 0
                    item.maxCharge = item.maxCharge ? Number(item.maxCharge) : 0
                    return item
                })

                const res = await addOrUpdPriceWhOpApi(payload)
                smartAlert(res.msg, res.success, 1000)
                if (res.success) {
                    emits('success')
                    visible.value = false
                }
            } catch (e) {
                console.error(e)
            } finally {
                closeMainLoading()
                submitting.value = false
            }
        }
    })
}

// 在 onMounted 中替换原有的逻辑
onMounted(async () => {
    openMainLoading()
    // 1. 加载主费用类型、业务费用类型等基础枚举
    await loadBaseEnums()

    // 2. 判断是编辑还是新增
    if (props.editData && props.editData.id) {
        try {
            // 调用详情接口
            const res = await getPriceWhOpInfoByIdApi({ id: props.editData.id })
            if (res.success) {
                const data = res.data

                // 【核心】加载级联下拉列表的数据
                if (data.feeBizTypeId) {
                    await loadSubTypeData(data.feeBizTypeId)
                }
                if (data.feeSubTypeId) {
                    await loadUnitTypeData(data.feeSubTypeId)
                }

                // 回填表单数据
                Object.assign(formData, data)

                // 【核心】为详情列表生成前端所需的 _tempId，用于控制表格展开
                if (formData.detailDTOList && formData.detailDTOList.length > 0) {
                    formData.detailDTOList.forEach(item => {
                        item._tempId = item.id || Date.now() + Math.random()
                    })
                } else {
                    // 如果列表为空，默认加一行空行
                    addDetailRow()
                }
            }
        } catch (e) {
            console.error('获取操作费详情失败', e)
        }
    } else {
        Object.assign(formData, {
            id: '',
            priceProjectId: props.projectId,
            feeMainTypeId: '',
            feeBizTypeId: '',
            feeSubTypeId: '',
            remark: '',
            detailDTOList: []
        })
        addDetailRow() // 默认加一行
    }
    closeMainLoading()
})
</script>

<style scoped lang="scss">
.operation-dialog {
    :deep(.el-dialog__body) {
        padding: 0;
        height: 70vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .dialog-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 15px 20px;
        box-sizing: border-box;
    }

    .header-section {
        flex-shrink: 0;
        margin-bottom: 15px;

        .base-info-card {
            :deep(.el-card__body) {
                padding: 15px 15px 0;
            }

            .el-form-item {
                margin-bottom: 15px;
            }
        }
    }

    .list-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 10px;

        .section-header {
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .left {
                display: flex;
                align-items: center;
                gap: 10px;

                .title {
                    font-weight: bold;
                    font-size: 14px;
                    color: #303133;
                    border-left: 3px solid #409eff;
                    padding-left: 8px;
                }

                .tip-text {
                    font-size: 12px;
                    color: #e6a23c;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: #fdf6ec;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
            }
        }

        .table-area {
            flex: 1;
            overflow: auto;
        }
    }

    :deep(.el-table__expanded-cell) {
        padding: 0 !important;
    }

    .sticky-wrapper {
        position: sticky;
        left: 0;
        z-index: 10;
        width: 60%;
        /* 修改宽度为100%，自适应 */
        padding: 10px 15px;
        /* 稍微减小内边距 */
        background-color: #fff;
    }

    .expand-form-container {
        width: 100%;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);

        /* 紧凑表单样式 */
        .compact-expand-form {
            :deep(.el-form-item) {
                margin-bottom: 5px;
            }

            /* 调整label高度，更紧凑 */
            :deep(.el-form-item__label) {
                line-height: 1.2;
                padding-bottom: 2px;
                font-size: 12px;
                color: #606266;
            }
        }
    }
}
</style>