<template>
    <el-dialog :title="isEdit ? '编辑操作费' : '新增操作费'" v-model="visible" width="80%" top="5vh" :close-on-click-modal="false"
        destroy-on-close class="operation-dialog fixed-height-dialog">
        <div class="dialog-layout">
            <div class="header-section">
                <el-card shadow="never" class="base-info-card">
                    <el-form :model="formData" :rules="rules" ref="formRef" label-width="90px">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="费用类型" prop="feeMainTypeId">
                                    <el-select v-model="formData.feeMainTypeId" placeholder="请选择" style="width: 100%"
                                        :disabled="isEdit">
                                        <el-option v-for="item in feeTypeEnum" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="费用名称" prop="feeName">
                                    <el-input v-model="formData.feeName" placeholder="请输入费用名称" maxlength="50" />
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
                    <el-button type="primary" size="small" :icon="Plus" @click="addDetailRow">新增详情</el-button>
                </div>

                <div class="table-area">
                    <el-table ref="detailTableRef" :data="formData.detailDTOList" border height="100%" row-key="_tempId"
                        :expand-row-keys="expandedRowKeys" @expand-change="handleExpandChange">
                        <el-table-column type="expand" width="55">
                            <template #default="{ row }">
                                <div class="sticky-wrapper">
                                    <div class="expand-form-container">
                                        <el-form label-width="80px" class="inner-form" size="default">

                                            <el-row :gutter="20">
                                                <el-col :span="8">
                                                    <el-form-item label="分组代码">
                                                        <el-input v-model="row.groupCode" placeholder="请输入代码" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="排序号">
                                                        <el-input v-model="row.sortNo" v-intNumber="false"
                                                            placeholder="越小越优先" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="计费单位">
                                                        <el-select v-model="row.feeUnitTypeId" placeholder="请选择"
                                                            style="width: 100%">
                                                            <el-option v-for="u in unitTypeEnum" :key="u.id"
                                                                :label="u.name" :value="u.id" />
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                            <el-row :gutter="20" class="mt-row">
                                                <el-col :span="6">
                                                    <el-form-item label="单位数量">
                                                        <el-input v-model="row.unitQty" v-intNumber="false"
                                                            placeholder="1" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="单价">
                                                        <el-input v-model="row.price" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="最小收费">
                                                        <el-input v-model="row.minCharge" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="最大收费">
                                                        <el-input v-model="row.maxCharge" v-number="3"
                                                            placeholder="0.000" />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                            <el-row :gutter="20" class="mt-row">
                                                <el-col :span="12">
                                                    <el-form-item label="计费公式">
                                                        <el-input v-model="row.formula" placeholder="例如: #W * 0.5" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="公式说明">
                                                        <el-input v-model="row.formulaDesc" placeholder="公式的文字说明" />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                        </el-form>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="分组代码" prop="groupCode" width="120" show-overflow-tooltip />
                        <el-table-column label="排序" prop="sortNo" width="80" />
                        <el-table-column label="计费单位" prop="feeUnitTypeId" width="120">
                            <template #default="{ row }">{{ getUnitName(row.feeUnitTypeId) }}</template>
                        </el-table-column>
                        <el-table-column label="单位数量" prop="unitQty" width="120" />
                        <el-table-column label="单价" prop="price" width="120" />
                        <el-table-column label="最小收费" prop="minCharge" width="120" />
                        <el-table-column label="最大收费" prop="maxCharge" width="120" />
                        <el-table-column label="公式" prop="formula" min-width="200" show-overflow-tooltip />
                        <el-table-column label="说明" prop="formulaDesc" min-width="200" show-overflow-tooltip />

                        <el-table-column label="操作" width="120" fixed="right">
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
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import { smartAlert } from '@/utils/genericMethods.js'

// API
import { addOrUpdPriceWhOpApi } from '@/api/productApi/shipway.js'
import { getVasOrderFeeTypeEnumApi } from "@/api/vasApi/vas.js"
import { getUnitTypeEnumApi } from '@/api/baseApi/basic.js'

const props = defineProps({
    modelValue: Boolean,
    projectId: String,
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

const feeTypeEnum = ref([])
const unitTypeEnum = ref([])

const formData = reactive({
    id: '',
    priceProjectId: '',
    feeMainTypeId: '',
    feeName: '',
    remark: '',
    detailDTOList: []
})

const rules = {
    feeMainTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
    feeName: [{ required: true, message: '请输入', trigger: 'blur' }]
}

// --- 详情表格逻辑 ---
const expandedRowKeys = ref([])

const getUnitName = (id) => {
    const item = unitTypeEnum.value.find(i => i.id === id)
    return item ? item.name : id
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
            formData.detailDTOList.forEach(item => {
                if (item._tempId !== newRow._tempId) {
                    detailTableRef.value.toggleRowExpansion(item, false)
                }
            })
            detailTableRef.value.toggleRowExpansion(newRow, true)
        }
    })
}

// 2. 编辑详情行
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
}

// --- 提交逻辑 ---
const loadEnums = async () => {
    try {
        const [resType, resUnit] = await Promise.all([
            getVasOrderFeeTypeEnumApi(),
            getUnitTypeEnumApi()
        ])
        feeTypeEnum.value = resType.data || []
        unitTypeEnum.value = resUnit.data || []
    } catch (e) {
        console.error(e)
    }
}

const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                const payload = JSON.parse(JSON.stringify(formData))
                payload.detailDTOList.forEach(d => {
                    delete d._tempId
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
                submitting.value = false
            }
        }
    })
}

onMounted(async () => {
    await loadEnums()

    if (props.editData) {
        Object.assign(formData, JSON.parse(JSON.stringify(props.editData)))
        if (formData.detailDTOList) {
            formData.detailDTOList.forEach(item => {
                item._tempId = item.id || Date.now() + Math.random()
            })
        } else {
            formData.detailDTOList = []
        }
    } else {
        Object.assign(formData, {
            id: '',
            priceProjectId: props.projectId,
            feeMainTypeId: '',
            feeName: '',
            remark: '',
            detailDTOList: []
        })
    }
})
</script>

<style scoped lang="scss">
.operation-dialog {
    :deep(.el-dialog__body) {
        padding: 0;
        height: 70vh;
        /* 固定高度 */
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

    /* 关键修改：移除表格默认的 Expanded Cell Padding 
      使 sticky-wrapper 能真正从左侧边缘开始吸附
    */
    :deep(.el-table__expanded-cell) {
        padding: 0 !important;
    }

    /* 展开行容器样式优化 */
    .sticky-wrapper {
        position: sticky;
        /* 粘性定位 */
        left: 0;
        z-index: 10;
        width: 900px;
        /* 宽度随内容 */
        min-width: 800px;
        /* 最小宽度，防止太窄 */
        padding: 15px 20px;
        /* 手动补回 Padding */
        background-color: #fff;
        /* 背景色，防止透明叠加 */
    }

    .expand-form-container {
        /* 表单容器 */
        width: 100%;
        padding: 15px 20px 5px 20px;
        background-color: #f8f9fa;
        /* 浅灰背景 */
        border-radius: 4px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
        /* 柔和内阴影 */

        .inner-form {
            .el-form-item {
                margin-bottom: 15px;
                /* 行间距 */
            }

            .mt-row {
                margin-top: 5px;
            }
        }
    }
}
</style>