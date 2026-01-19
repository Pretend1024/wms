<template>
    <el-dialog :title="isView ? '库龄报价详情' : (isEdit ? '编辑库龄报价' : '新增库龄报价')" v-model="visible" width="800px" top="5vh"
        :close-on-click-modal="false" destroy-on-close class="wh-rent-dialog">
        <div class="dialog-content">
            <div class="form-section">
                <div class="sub-title">基础配置</div>
                <el-form :model="formData" ref="formRef" :rules="rules" label-width="80px" :disabled="isView">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="库龄起始" prop="daysStart">
                                <el-input v-model="formData.daysStart" v-number="0">
                                    <template #append>天</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库龄截止" prop="daysEnd">
                                <el-input v-model="formData.daysEnd" v-number="0">
                                    <template #append>天</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="基础单价" prop="unitPrice">
                                <el-input v-model="formData.unitPrice" v-number="3" placeholder="金额">
                                    <template #append>元</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="surcharge-section">
                <div class="header">
                    <div class="sub-title">旺季附加费配置</div>
                    <el-button v-if="!isView" type="primary" link @click="addSurchargeRow">+ 添加旺季</el-button>
                </div>

                <div class="surcharge-list">
                    <div v-if="formData.surchargeDTOList.length === 0" class="empty-tip">
                        暂无旺季配置
                    </div>

                    <div v-for="(item, index) in formData.surchargeDTOList" :key="index" class="surcharge-row">
                        <div class="row-top">
                            <span class="index-label">配置 {{ index + 1 }}</span>
                            <el-button v-if="!isView" type="danger" link :icon="Delete"
                                @click="delSurchargeRow(index)">移除</el-button>
                        </div>

                        <div class="row-content">
                            <div class="month-selector">
                                <div class="label">选择月份:</div>
                                <div class="months-grid" :class="{ 'is-disabled': isView }">
                                    <div v-for="m in 12" :key="m" class="month-item"
                                        :class="{ 'active': item._selectedMonths.includes(m) }"
                                        @click="!isView && toggleMonth(item, m)">
                                        {{ m }}月
                                    </div>
                                </div>
                                <div class="result-preview" v-if="item.months">
                                    已选范围: <b>{{ item.months }}</b>
                                </div>
                            </div>

                            <div class="price-input">
                                <div class="label">附加单价:</div>
                                <el-input v-model="item.unitPrice" v-number="3" placeholder="0.00" style="width: 120px"
                                    :disabled="isView">
                                    <template #append>元</template>
                                </el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <el-button @click="visible = false">{{ isView ? '关闭' : '取消' }}</el-button>
            <el-button v-if="!isView" type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { addOrUpdPriceWhRentAgeApi, getPriceWhRentInfoByIdApi } from "@/api/productApi/shipway"

const props = defineProps({
    modelValue: Boolean,
    projectId: String,
    whRentId: String,
    editData: Object,
    isView: { type: Boolean, default: false }
})

const emits = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emits('update:modelValue', val)
})
const isEdit = computed(() => !!props.editData)

const formRef = ref(null)
const submitting = ref(false)

const formData = reactive({
    id: '',
    priceProjectId: '',
    priceWhRentId: '',
    daysStart: '',
    daysEnd: '',
    unitPrice: '',
    surchargeDTOList: []
})

const rules = {
    daysStart: [{ required: true, message: '必填', trigger: 'blur' }],
    daysEnd: [{ required: true, message: '必填', trigger: 'blur' }],
    unitPrice: [{ required: true, message: '必填', trigger: 'blur' }],
}

// --- 旺季逻辑 ---

// 1. 新增旺季行
const addSurchargeRow = () => {
    formData.surchargeDTOList.push({
        _selectedMonths: [], // 临时数组，用于UI交互
        months: '',          // 最终提交的字符串
        unitPrice: ''
    })
}

// 2. 删除旺季行
const delSurchargeRow = (index) => {
    formData.surchargeDTOList.splice(index, 1)
}

// 3. 切换月份选中状态
const toggleMonth = (row, month) => {
    const idx = row._selectedMonths.indexOf(month)
    if (idx > -1) {
        row._selectedMonths.splice(idx, 1)
    } else {
        row._selectedMonths.push(month)
    }
    // 排序并重新计算字符串
    row._selectedMonths.sort((a, b) => a - b)
    row.months = convertMonthsToString(row._selectedMonths)
}

// 4. [算法] 数组转范围字符串 [1,2,3,5,8,9,10] -> "1-3,5,8-10"
const convertMonthsToString = (arr) => {
    if (!arr || arr.length === 0) return ''

    const ranges = []
    let start = arr[0]
    let prev = arr[0]

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== prev + 1) {
            // 不连续了
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`)
            start = arr[i]
        }
        prev = arr[i]
    }
    // 处理最后一组
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`)

    return ranges.join(',')
}

// 5. [算法] 字符串转数组 "1-3,5" -> [1,2,3,5] (用于回显)
const convertStringToMonths = (str) => {
    if (!str) return []
    const result = new Set()
    const parts = str.split(',')

    parts.forEach(part => {
        if (part.includes('-')) {
            const [s, e] = part.split('-').map(Number)
            for (let i = s; i <= e; i++) result.add(i)
        } else {
            result.add(Number(part))
        }
    })
    return Array.from(result).sort((a, b) => a - b)
}

// --- 提交 ---
const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            openMainLoading()
            // 校验旺季配置
            for (const item of formData.surchargeDTOList) {
                if (!item.months) return ElMessage.warning('请选择旺季月份')
                if (!item.unitPrice) return ElMessage.warning('请输入旺季附加费')
            }

            submitting.value = true
            try {
                // 清理临时字段
                const payload = JSON.parse(JSON.stringify(formData))
                payload.surchargeDTOList.forEach(item => {
                    delete item._selectedMonths
                })

                const res = await addOrUpdPriceWhRentAgeApi(payload)
                if (res.success) {
                    ElMessage.success(res.msg)
                    emits('success')
                    visible.value = false
                } else {
                    ElMessage.error(res.msg)
                }
            } finally {
                closeMainLoading()
                submitting.value = false
            }
        }
    })
}

onMounted(async () => {
    openMainLoading()
    // 判断是编辑还是新增
    if (props.editData && props.editData.id) {
        try {
            // 调用详情接口 (使用您提供的接口名 getPriceWhRentInfoByIdApi)
            const res = await getPriceWhRentInfoByIdApi({ id: props.editData.id })
            if (res.success) {
                const data = res.data
                Object.assign(formData, data)

                // 【核心】恢复旺季月份的选中状态 (字符串 -> 数组)
                if (formData.surchargeDTOList && formData.surchargeDTOList.length > 0) {
                    formData.surchargeDTOList.forEach(item => {
                        // 使用组件内定义的 convertStringToMonths 方法恢复 _selectedMonths
                        item._selectedMonths = convertStringToMonths(item.months)
                    })
                }
            }
        } catch (e) {
            console.error('获取库龄报价详情失败', e)
        }
    } else {
        // --- 新增模式初始化 ---
        Object.assign(formData, {
            id: '',
            priceProjectId: props.projectId,
            priceWhRentId: props.whRentId,
            daysStart: '', daysEnd: '', unitPrice: '',
            surchargeDTOList: []
        })
    }
    closeMainLoading()
})
</script>

<style scoped lang="scss">
.wh-rent-dialog {
    .sub-title {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 15px;
        border-left: 3px solid #409eff;
        padding-left: 8px;
    }

    .form-section {
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
        padding-bottom: 5px;
    }

    .surcharge-section {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .surcharge-list {
            max-height: 450px;
            overflow-y: auto;

            .empty-tip {
                color: #999;
                text-align: center;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 4px;
            }

            .surcharge-row {
                background: #f8f9fa;
                border: 1px solid #e4e7ed;
                border-radius: 4px;
                padding: 10px 15px;
                margin-bottom: 10px;

                .row-top {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #606266;
                    margin-bottom: 10px;
                    border-bottom: 1px dashed #e4e7ed;
                    padding-bottom: 5px;

                    .index-label {
                        font-weight: bold;
                    }
                }

                .row-content {
                    display: flex;
                    gap: 20px;

                    .month-selector {
                        flex: 1;

                        .label {
                            font-size: 12px;
                            color: #606266;
                            margin-bottom: 5px;
                        }

                        /* 可视化月份网格 */
                        .months-grid {
                            display: grid;
                            grid-template-columns: repeat(6, 1fr); // 6列2行
                            gap: 5px;

                            .month-item {
                                text-align: center;
                                background: #fff;
                                border: 1px solid #dcdfe6;
                                border-radius: 3px;
                                font-size: 12px;
                                padding: 4px 0;
                                cursor: pointer;
                                transition: all 0.2s;
                                color: #606266;

                                &:hover {
                                    border-color: #409eff;
                                    color: #409eff;
                                }

                                &.active {
                                    background: #409eff;
                                    color: #fff;
                                    border-color: #409eff;
                                }
                            }
                        }

                        .result-preview {
                            margin-top: 5px;
                            font-size: 12px;
                            color: #909399;

                            b {
                                color: #409eff;
                            }
                        }
                    }

                    .price-input {
                        width: 150px;

                        .label {
                            font-size: 12px;
                            color: #606266;
                            margin-bottom: 5px;
                        }
                    }
                }
            }
        }
    }
}

.months-grid.is-disabled .month-item {
    cursor: not-allowed;
    opacity: 0.7;
}

.months-grid.is-disabled .month-item:not(.active) {
    background-color: #f5f7fa;
    color: #c0c4cc;
}
</style>