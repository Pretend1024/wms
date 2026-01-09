<template>
    <div class="step-basic-container">
        <div class="scroll-form-area">
            <div class="info-alert">
                <el-alert title="请先完善并提交基础信息，保存成功后方可进行后续报价配置。" type="warning" show-icon :closable="false" effect="light"
                    class="custom-alert" />
            </div>

            <div class="form-content">
                <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px" label-position="top">

                    <el-card class="form-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span class="title">归属配置</span>
                                <span class="sub-title">方案的所属权设置</span>
                            </div>
                        </template>
                        <el-row :gutter="30">
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item prop="orgId">
                                    <template #label>
                                        <span>所属公司</span>
                                        <el-tooltip content="保存后不可变更" placement="top">
                                            <el-icon class="label-icon">
                                                <QuestionFilled />
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                        :props="parentProps" clearable @change="handleOrgChange" placeholder="请选择公司"
                                        style="width: 100%" :disabled="isEditMode" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item prop="warehouseCode">
                                    <template #label>
                                        <span>所属仓库</span>
                                        <el-tooltip content="保存后不可变更" placement="top">
                                            <el-icon class="label-icon">
                                                <QuestionFilled />
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-select v-model="formData.warehouseCode" filterable placeholder="请选择仓库" clearable
                                        style="width: 100%" :disabled="isEditMode">
                                        <template #prefix><el-icon>
                                                <House />
                                            </el-icon></template>
                                        <el-option v-for="item in warehouseOptions" :key="item.id"
                                            :label="`${item.code} - ${item.name}`" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>

                    <el-card class="form-card mt-20" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span class="title">基本信息</span>
                                <span class="sub-title">方案名称与有效期设置</span>
                            </div>
                        </template>
                        <el-row :gutter="30">
                            <el-col :span="24">
                                <el-form-item label="方案名称" prop="name">
                                    <el-input v-model="formData.name" placeholder="例如：2025年Q1季度标准报价" clearable
                                        maxlength="50" show-word-limit :disabled="isEditMode">
                                        <template #prefix><el-icon>
                                                <Document />
                                            </el-icon></template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item label="生效起始时间" prop="startDate">
                                    <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD"
                                        placeholder="选择起始日期" style="width: 100%" :disabled-date="disabledStartDate" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item label="截止时间" prop="endDate">
                                    <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD"
                                        placeholder="选择截止日期" style="width: 100%" :disabled-date="disabledEndDate" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>

                    <el-card class="form-card mt-20" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span class="title">适用对象</span>
                            </div>
                        </template>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="适用客户">
                                    <div class="customer-input-wrapper">
                                        <div class="customer-trigger-box" :class="{ 'is-disabled': !formData.orgId }"
                                            @click="openCustomerDialog">
                                            <div v-if="formData.customerCodeList.length === 0" class="placeholder-text">
                                                <el-icon class="mr-5">
                                                    <User />
                                                </el-icon>
                                                <span>点击选择客户（未选择则默认适用于全部客户）</span>
                                            </div>
                                            <div v-else class="tag-wrapper">
                                                <el-tag v-for="(code, index) in formData.customerCodeList" :key="index"
                                                    size="default" type="primary" effect="light"
                                                    class="mr-5 mb-5 cust-tag" closable
                                                    @close.stop="removeCustomer(code)">
                                                    {{ code }}
                                                </el-tag>
                                            </div>
                                            <div class="trigger-icon">
                                                <el-icon>
                                                    <More />
                                                </el-icon>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注信息" prop="remark">
                                    <el-input v-model="formData.remark" type="textarea" :rows="3"
                                        placeholder="请输入方案备注信息..." maxlength="200" show-word-limit />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-form>
            </div>
        </div>

        <div class="fixed-footer">
            <div class="footer-content">
                <div class="left-info">
                    <transition name="el-fade-in">
                        <div v-if="hasDataChanged && isEditMode" class="warning-badge">
                            <el-icon>
                                <Warning />
                            </el-icon> 信息已修改，请先保存
                        </div>
                    </transition>
                    <span v-if="localProjectId" class="id-tag">
                        <el-icon>
                            <Link />
                        </el-icon> 当前名称: {{ formData.name }}
                    </span>
                </div>
                <div class="right-btns">
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">
                        {{ isEditMode ? '保存修改' : '保存提交' }}
                    </el-button>
                    <!-- :disabled="!localProjectId || hasDataChanged" -->
                    <el-button type="success" @click="handleNext">
                        下一步
                    </el-button>
                </div>
            </div>
        </div>

        <el-dialog title="选择客户" v-model="dialogVisible" width="500px" destroy-on-close align-center append-to-body>
            <hydFilterBox :form-items="filterConfig" :initial-value="filterValues" @search="handleCustSearch"
                @reset="handleCustReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item label="客户搜索">
                            <el-input v-model="formData.keyword" placeholder="输入代码或名称模糊搜索" prefix-icon="Search" />
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>

            <el-table ref="custTableRef" :data="custTableData" border stripe style="width: 100%" v-loading="custLoading"
                height="400" @selection-change="handleSelectionChange" row-key="code">
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="code" label="客户代码" width="150" sortable />
                <el-table-column prop="name" label="客户名称" show-overflow-tooltip />
            </el-table>

            <template #footer>
                <div class="dialog-footer">
                    <div class="selection-info">
                        已选择：<span class="count">{{ selectionRows.length }}</span> 家客户
                    </div>
                    <div>
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleCustSelect">确定选择</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import { User, More, Select, Right, Search, Warning, House, Document, QuestionFilled, InfoFilled, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { smartAlert } from '@/utils/genericMethods.js'
import hydFilterBox from '@/components/table/hyd-filterBox.vue'

// API
import { getOrgListCompanyApi } from '@/api/baseApi/org.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { addPriceProjectApi, updatePriceProjectApi } from "@/api/productApi/shipway"

const props = defineProps({
    projectId: { type: String, default: '' }
})
const emits = defineEmits(['update:projectId', 'next', 'updateName'])

const localProjectId = ref(props.projectId)
const formRef = ref(null)
const submitting = ref(false)
const hasDataChanged = ref(false)

const formData = reactive({
    orgId: '',
    warehouseCode: '',
    name: '',
    startDate: '',
    endDate: '',
    remark: '',
    customerCodeList: []
})

// 计算属性：是否处于编辑模式 (有ID即为编辑)
const isEditMode = computed(() => !!localProjectId.value)

const rules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    name: [{ required: true, message: '请输入方案名', trigger: 'blur' }],
    startDate: [{ required: true, message: '请选择起始时间', trigger: 'change' }],
    endDate: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
}

// --- 日期限制逻辑 ---
const disabledStartDate = (time) => {
    // 只能选择今天及以后的日期 (可选)
    // return time.getTime() < Date.now() - 8.64e7 

    // 如果有截止日期，起始日期不能晚于截止日期
    if (formData.endDate) {
        return time.getTime() > new Date(formData.endDate).getTime()
    }
    return false
}

const disabledEndDate = (time) => {
    // 如果有起始日期，截止日期不能早于起始日期
    if (formData.startDate) {
        return time.getTime() < new Date(formData.startDate).getTime()
    }
    return false
}

const companyOptions = ref([])
const warehouseOptions = ref([])

// --- 监听数据变化 (Dirty Check) ---
watch(formData, () => {
    if (localProjectId.value) {
        hasDataChanged.value = true
    }
}, { deep: true })

// --- 客户选择弹窗 ---
const dialogVisible = ref(false)
const custLoading = ref(false)
const custTableData = ref([])
const custTableRef = ref(null)
const selectionRows = ref([])
const filterConfig = ref([])
const filterValues = ref({ keyword: '' })

const openCustomerDialog = async () => {
    if (!formData.orgId) {
        ElMessage.warning('请先在上方选择所属公司')
        return
    }
    dialogVisible.value = true
    await getCustomerList()

    await nextTick()
    if (custTableRef.value) {
        custTableRef.value.clearSelection()
        custTableData.value.forEach(row => {
            if (formData.customerCodeList.includes(row.code)) {
                custTableRef.value.toggleRowSelection(row, true)
            }
        })
    }
}

const getCustomerList = async () => {
    custLoading.value = true
    try {
        const res = await getCustomerLikeQueryApi({
            orgId: formData.orgId,
            keyword: filterValues.value.keyword || '*'
        })
        custTableData.value = res.data
    } finally {
        custLoading.value = false
    }
}

const handleCustSearch = (data) => {
    filterValues.value = { ...data }
    getCustomerList()
}

const handleCustReset = (data) => {
    filterValues.value = { ...data }
    getCustomerList()
}

const handleSelectionChange = (val) => {
    selectionRows.value = val
}

const handleCustSelect = () => {
    formData.customerCodeList = selectionRows.value.map(item => item.code)
    dialogVisible.value = false
}

// 外部移除客户
const removeCustomer = (code) => {
    formData.customerCodeList = formData.customerCodeList.filter(c => c !== code)
}

// --- 级联与初始化 ---
const cascaderRef = ref(null)
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
}

const handleOrgChange = () => {
    nextTick(() => {
        if (cascaderRef.value) cascaderRef.value.togglePopperVisible()
    })
    formData.customerCodeList = [] // 公司变更清空客户
}

onMounted(async () => {
    const companyRes = await getOrgListCompanyApi()
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }))
    }
    companyOptions.value = convertToTree(companyRes.data)

    const whRes = await getWhWarehouseApi()
    warehouseOptions.value = whRes.data
})

// --- 提交 ---
const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                let res
                if (isEditMode.value) {
                    const params = {
                        ...formData,
                        id: localProjectId.value
                    }
                    res = await updatePriceProjectApi(params)
                } else {
                    res = await addPriceProjectApi(formData)
                }

                if (res.success) {
                    smartAlert(res.msg, true, 1000)

                    if (!isEditMode.value) {
                        const newId = res.data.id || res.data
                        localProjectId.value = newId
                        emits('update:projectId', newId)
                    }
                    emits('updateName', formData.name)
                    hasDataChanged.value = false
                } else {
                    smartAlert(res.msg, false)
                }
            } catch (e) {
                console.error(e)
            } finally {
                submitting.value = false
            }
        }
    })
}

const handleNext = () => {
    if (hasDataChanged.value) {
        ElMessage.warning('信息已变更，请先保存修改')
        return
    }
    // if (localProjectId.value) {
    //     emits('next')
    // }
    emits('next')
}

watch(() => props.projectId, (val) => {
    localProjectId.value = val
})
</script>

<style scoped lang="scss">
.step-basic-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

// 滚动区域
.scroll-form-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px 20px 80px 20px;

    .info-alert {
        margin-bottom: 20px;

        .custom-alert {
            :deep(.el-alert__content) {
                font-weight: 500;
            }
        }
    }

    .form-content {
        max-width: 1100px;
        margin: 0 auto;
    }
}

// 表单卡片样式
.form-card {
    border: 1px solid #ebeef5;
    border-radius: 6px;
    margin-bottom: 20px;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    :deep(.el-card__header) {
        padding: 12px 20px;
        background-color: #fafafa;
        border-bottom: 1px solid #f0f0f0;
    }

    .card-header {
        display: flex;
        align-items: baseline;
        gap: 12px;

        .title {
            font-size: 16px;
            font-weight: bold;
            color: #303133;
            border-left: 4px solid #409eff;
            padding-left: 10px;
            line-height: 1.2;
        }

        .sub-title {
            font-size: 12px;
            color: #909399;
        }
    }
}

.mr-5 {
    margin-right: 5px;
}

.mb-5 {
    margin-bottom: 5px;
}

.label-icon {
    margin-left: 6px;
    color: #909399;
    cursor: help;
    font-size: 14px;
    vertical-align: middle;
}

// 布局包裹层，确保占满宽度
.customer-input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
}

// 客户选择框样式优化
.customer-trigger-box {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-height: 80px;
    padding: 10px 40px 10px 12px;
    cursor: pointer;
    background-color: #fff;
    position: relative;
    transition: all 0.2s;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    &:hover {
        border-color: #c0c4cc;
        background-color: #fbfbfb;
    }

    &.is-disabled {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }

    .placeholder-text {
        color: #a8abb2;
        font-size: 13px;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 24px;
    }

    .tag-wrapper {
        width: 100%;

        .cust-tag {
            margin-right: 8px;
            margin-bottom: 6px;
        }
    }

    .trigger-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #909399;
        font-size: 18px;
    }
}

// 底部固定按钮区
.fixed-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background: #fff;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 8px 8px;

    .footer-content {
        width: 100%;
        max-width: 1100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .left-info {
            display: flex;
            align-items: center;
            gap: 15px;

            .warning-badge {
                background: #fdf6ec;
                color: #e6a23c;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
                border: 1px solid #faecd8;
                animation: pulse 2s infinite;
            }

            .id-tag {
                background: #f0f9eb;
                color: #67c23a;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                border: 1px solid #e1f3d8;
            }
        }

        .right-btns {
            display: flex;
            gap: 15px;

            .btn-wide {
                width: 120px;
            }
        }
    }
}

// 弹窗 Footer 样式
.dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;

    .selection-info {
        color: #606266;

        .count {
            color: #409eff;
            font-weight: bold;
            margin: 0 2px;
            font-size: 16px;
        }
    }
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 1;
    }
}
</style>