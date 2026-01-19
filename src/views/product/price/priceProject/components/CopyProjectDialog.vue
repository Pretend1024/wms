<template>
    <el-dialog v-model="visible" title="复制报价方案" width="900px" :close-on-click-modal="false" destroy-on-close
        align-center @open="handleOpen" @closed="handleClosed">
        <div class="dialog-form-container">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px" label-position="top">
                <el-card class="form-card" shadow="never">
                    <template #header>
                        <div class="card-header">
                            <span class="title">归属配置</span>
                        </div>
                    </template>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="所属公司" prop="orgId">
                                <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                    :props="parentProps" clearable @change="handleOrgChange" placeholder="请选择公司"
                                    style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属仓库" prop="warehouseCode">
                                <el-select v-model="formData.warehouseCode" filterable placeholder="请选择仓库" clearable
                                    style="width: 100%">
                                    <el-option v-for="item in warehouseOptions" :key="item.id"
                                        :label="`${item.code} - ${item.name}`" :value="item.code" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card class="form-card mt-15" shadow="never">
                    <template #header>
                        <div class="card-header">
                            <span class="title">基本信息</span>
                        </div>
                    </template>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="新方案名称" prop="name">
                                <el-input v-model="formData.name" placeholder="请输入新方案名称" clearable maxlength="50"
                                    show-word-limit>
                                    <template #prefix>
                                        <el-icon>
                                            <Document />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="生效起始时间" prop="startDate">
                                <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD"
                                    placeholder="选择起始日期" style="width: 100%" :disabled-date="disabledStartDate" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="截止时间" prop="endDate">
                                <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD"
                                    placeholder="选择截止日期" style="width: 100%" :disabled-date="disabledEndDate" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card class="form-card mt-15" shadow="never">
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
                                        @click="formData.orgId && openCustomerDialog()">
                                        <div v-if="formData.customerCodeList.length === 0" class="placeholder-text">
                                            <el-icon class="mr-5">
                                                <User />
                                            </el-icon>
                                            <span>点击选择客户（未选择则默认适用于全部客户）</span>
                                        </div>
                                        <div v-else class="tag-wrapper">
                                            <el-tag v-for="(code, index) in formData.customerCodeList" :key="index"
                                                size="default" type="primary" effect="light" class="mr-5 mb-5 cust-tag"
                                                closable @close.stop="removeCustomer(code)">
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
                                <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注..."
                                    maxlength="200" show-word-limit />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">
                    确定复制
                </el-button>
            </div>
        </template>

        <el-dialog title="选择客户" v-model="custDialogVisible" width="500px" append-to-body align-center>
            <hydFilterBox :form-items="filterConfig" :initial-value="filterValues" @search="handleCustSearch"
                @reset="handleCustReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item label="客户搜索">
                            <el-input v-model="formData.keyword" placeholder="代码或名称" prefix-icon="Search" />
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>

            <el-table ref="custTableRef" :data="custTableData" border stripe style="width: 100%" v-loading="custLoading"
                height="400" @selection-change="handleSelectionChange" row-key="code">
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
                <el-table-column prop="code" label="客户代码" width="150" sortable />
                <el-table-column prop="name" label="客户名称" show-overflow-tooltip />
            </el-table>

            <template #footer>
                <div class="cust-dialog-footer">
                    <span>已选：{{ selectionRows.length }} 家</span>
                    <div>
                        <el-button @click="custDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleCustSelect">确定</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { Document, User, More, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import hydFilterBox from "@/components/table/hyd-filterBox.vue"

// 接口引用
import { getOrgListCompanyApi } from '@/api/baseApi/org.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { copyPriceProjectByIdApi } from "@/api/productApi/shipway"

const props = defineProps({
    modelValue: Boolean,
    rowData: { type: Object, default: () => ({}) }
})

const emits = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emits('update:modelValue', val)
})

const formRef = ref(null)
const loading = ref(false)
const companyOptions = ref([])
const warehouseOptions = ref([])

// 表单数据
const formData = reactive({
    orgId: '',
    warehouseCode: '',
    name: '',
    startDate: '',
    endDate: '',
    remark: '',
    customerCodeList: []
})

const rules = {
    orgId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    name: [{ required: true, message: '请输入方案名', trigger: 'blur' }],
    startDate: [{ required: true, message: '请选择起始时间', trigger: 'change' }],
    endDate: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
}

// 初始化弹窗
const handleOpen = async () => {
    loading.value = false
    // 初始化下拉数据
    initOptions()

    // 回填基础数据 (假设rowData里有这些字段，或者根据业务逻辑设置默认值)
    if (props.rowData) {
        formData.orgId = props.rowData.orgId || ''
        formData.warehouseCode = props.rowData.warehouseCode || ''
        formData.name = props.rowData.name ? `${props.rowData.name} (复制)` : ''
        formData.startDate = '' // 复制通常重置时间
        formData.endDate = ''
        formData.remark = props.rowData.remark || ''
        // 注意：表格行数据通常不包含完整的客户列表，可能需要额外接口获取或者留空让用户选
        // 这里假设复制时不默认带入旧客户，或者你也可以调用详情接口获取后再赋值
        formData.customerCodeList = []
    }
}

const handleClosed = () => {
    if (formRef.value) formRef.value.resetFields()
    formData.customerCodeList = []
}

// 级联配置
const parentProps = { checkStrictly: true, expandTrigger: 'hover', emitPath: false }

const initOptions = async () => {
    const [companyRes, whRes] = await Promise.all([
        getOrgListCompanyApi(),
        getWhWarehouseApi()
    ])

    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }))
    }
    companyOptions.value = convertToTree(companyRes.data)
    warehouseOptions.value = whRes.data
}

// --- 客户选择逻辑 (复用参考代码) ---
const custDialogVisible = ref(false)
const custLoading = ref(false)
const custTableData = ref([])
const custTableRef = ref(null)
const selectionRows = ref([])
const filterConfig = ref([]) // 搜索配置留空只用插槽
const filterValues = ref({ keyword: '' })

const handleOrgChange = () => {
    formData.customerCodeList = [] // 公司变，清空客户
}

const openCustomerDialog = async () => {
    if (!formData.orgId) {
        ElMessage.warning('请先选择所属公司')
        return
    }
    custDialogVisible.value = true
    await getCustomerList()

    // 回显选中状态
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
    custDialogVisible.value = false
}
const removeCustomer = (code) => {
    formData.customerCodeList = formData.customerCodeList.filter(c => c !== code)
}

// 日期禁用逻辑
const disabledStartDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7
}
const disabledEndDate = (time) => {
    if (formData.startDate) return time.getTime() < new Date(formData.startDate).getTime()
    return false
}

// 提交复制
const handleConfirm = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const params = {
                    ...formData,
                    oldProjectId: props.rowData.id // 关键参数：旧ID
                }

                const res = await copyPriceProjectByIdApi(params)

                if (res.success) {
                    ElMessage.success('复制成功')
                    visible.value = false
                    emits('success',
                        res.data
                    )
                } else {
                    ElMessage.error(res.msg || '复制失败')
                }
            } catch (error) {
                console.error(error)
                ElMessage.error('系统异常')
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<style scoped lang="scss">
.dialog-form-container {
    max-height: 600px;
    overflow-y: auto;
    padding: 0 10px;
}

.customer-input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.form-card {
    border: 1px solid #ebeef5;

    :deep(.el-card__header) {
        padding: 10px 15px;
        background-color: #f5f7fa;
    }

    .card-header .title {
        font-weight: bold;
        border-left: 3px solid #409eff;
        padding-left: 8px;
    }
}

.mt-15 {
    margin-top: 15px;
}

.mr-5 {
    margin-right: 5px;
}

.mb-5 {
    margin-bottom: 5px;
}

// 客户选择框样式 (复用)
.customer-trigger-box {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-height: 80px;
    padding: 8px 30px 8px 10px;
    cursor: pointer;
    position: relative;

    &:hover {
        border-color: #c0c4cc;
    }

    &.is-disabled {
        background-color: #f5f7fa;
        cursor: not-allowed;
    }

    .trigger-icon {
        position: absolute;
        top: 8px;
        right: 8px;
        color: #909399;
    }

    .placeholder-text {
        color: #a8abb2;
        font-size: 13px;
        display: flex;
        align-items: center;
        padding-top: 5px;
    }
}

.cust-dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>