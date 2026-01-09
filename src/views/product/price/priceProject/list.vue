<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" value-key="id" filterable
                                :placeholder="getPlaceholder('warehouseCode')" clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.id"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('isValid')">
                            <el-select v-model="formData.isValid" :placeholder="getPlaceholder('isValid')" clearable>
                                <el-option label="是" :value="true" />
                                <el-option label="否" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('dateValid')">
                            <el-date-picker v-model="formData.dateValid" type="date" value-format="YYYY-MM-DD"
                                :placeholder="getPlaceholder('dateValid')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>

        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">

                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" @click="handleEnable" v-permission="'enable'" :icon="VideoPlay">
                        {{ getButtonText('enable') }}
                    </el-button>
                    <el-button type="warning" @click="handleDisable" v-permission="'disable'" :icon="VideoPause">
                        {{ getButtonText('disable') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">
                        {{ getButtonText('del') }}
                    </el-button>
                </template>

                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleCopy(row)">
                            <el-icon>
                                <CopyDocument />
                            </el-icon>
                            <span>{{ getButtonText('copy') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleLog(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('log') }}</span>
                        </div>
                    </div>
                </template>
                <template #name="{ row }">
                    <div class="copyDiv">
                        <span class="copyText" @click="handleView(row)">{{ row.name }}</span>
                    </div>
                </template>

                <template #statusName="{ row }">
                    <el-tag :type="row.statusId === 1 ? 'success' : 'info'">{{ row.statusName }}</el-tag>
                </template>
            </hydTable>
        </div>
        <!-- 日志弹窗 -->
        <el-dialog v-model="centerDialogVisible" width="1000" align-center destroy-on-close>
            <div style="height: 500px;">
                <LogForm :formData="logData"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="batchDialogVisible" :tableData="batchResultData"
            :nameField="'id'" :nameLabel="'方案名'" @close="batchClose" :promptMessage="batchPromptMessage" />
    </div>
</template>

<script setup name="新增报价方案">
import { ref, shallowRef, reactive, onMounted, nextTick, onActivated } from 'vue'
import { Plus, Delete, VideoPlay, VideoPause, EditPen, View, CopyDocument, Tickets } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router/index.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue"
import hydTable from "@/components/table/hyd-table.vue"
import LogForm from '@/components/table/logTableById.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'

// 接口引用
import { getOrgListCompanyApi } from '@/api/baseApi/org.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import {
    getPriceProjectStatusEnumApi,
    getPriceProjectPageApi,
    activatePriceProjectByIdApi,
    stopPriceProjectByIdApi,
    deletePriceProjectByIdApi
} from "@/api/productApi/shipway"


// --- 搜索配置 ---
const formConfig = ref([
    { type: 'input', label: '方案名', prop: 'name' }
])

const initValues = ref({
    orgId: '',
    warehouseCode: '',
    customerCode: '',
    name: '',
    statusId: '',
    isValid: '',
    dateValid: ''
})

// --- 下拉数据源 ---
const companyOptions = ref([])
const warehouseOptions = ref([])
const customerOptions = ref([])
const statusOptions = ref([])

// --- 表格配置 ---
const tableData = shallowRef([])
const columns = ref([
    { label: '公司', prop: 'orgName', width: '150', sortable: true },
    { label: '方案名', prop: 'name', width: '180', sortable: true, slot: 'name' },
    { label: '仓库', prop: 'warehouseCode', width: '120', sortable: true },
    { label: '客户', prop: 'customers', width: '200' },
    { label: '版本', prop: 'version', width: '100' },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName' },
    { label: '起始日期', prop: 'startDate', width: '120', sortable: true },
    { label: '截止日期', prop: 'endDate', width: '120', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '170', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '170', sortable: true },
    { label: '操作', prop: 'action', width: '180', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 0
})
const loading = ref(true)
const orderBy = ref('')
const selectionRows = ref([])

// --- 事件处理 ---

// 搜索
const handleSearch = (data) => {
    loading.value = true
    initValues.value = { ...data }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 重置
const handleReset = (data) => {
    loading.value = true
    initValues.value = { ...data }
    handleCascaderChange() // 重置客户下拉
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 表格选中
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
}

const handleRowClick = (row) => {
    // console.log('点击行:', row)
}

// 分页
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 排序
const handleTableSort = (sortString) => {
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// --- 业务操作 ---

// 新增
const handleAdd = () => {
    router.push({ name: '新增报价方案' })
}

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑报价方案',
        query: { id: row.id }
    })
}

// 查看
const handleView = (row) => {
    router.push({
        name: '报价方案详情',
        query: { id: row.id, type: 'view' }
    })
}

// 复制
const handleCopy = (row) => {
    router.push({
        name: '复制报价方案',
        query: { id: row.id }
    })
}
const centerDialogVisible = ref(false)
const logData = ref({})
// 日志
const handleLog = (row) => {
    centerDialogVisible.value = true;
    logData.value = { ...row };
}


// --- 批量操作逻辑 (启用/停用/删除) ---
const batchDialogVisible = ref(false)
const batchResultData = ref([])
const batchPromptMessage = ref('')

const executeBatchOperation = (operationName, apiFunc) => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning(`请选择要${operationName}的数据！`)
        return
    }
    ElMessageBox.confirm(
        `是否要${operationName}${selectionRows.value.length}条数据?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true
        batchResultData.value = []
        batchPromptMessage.value = '操作中...'
        batchDialogVisible.value = true

        for (let i = 0; i < selectionRows.value.length; i++) {
            // 注意：此处需要调用实际的API，假设接口接收对象 { id: ... }
            // 如果没有实际接口，此处会报错，请确保引入了对应的API
            try {
                const res = await apiFunc({ id: selectionRows.value[i].id })
                batchResultData.value.push({
                    id: selectionRows.value[i].name, // 结果列显示方案名
                    msg: res.msg,
                    success: res.success
                })
            } catch (error) {
                batchResultData.value.push({
                    id: selectionRows.value[i].name,
                    msg: '请求失败',
                    success: false
                })
            }
        }
        batchPromptMessage.value = '操作完成！'
    }).catch(() => {
        ElMessage.info(`已取消${operationName}`)
    })
}

// 启用
const handleEnable = () => {
    executeBatchOperation('启用', activatePriceProjectByIdApi)
}

// 停用
const handleDisable = () => {
    executeBatchOperation('停用', stopPriceProjectByIdApi)
}

// 删除
const handleDel = () => {
    executeBatchOperation('删除', deletePriceProjectByIdApi)
}

const batchClose = () => {
    batchDialogVisible.value = false
    batchResultData.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// --- 数据获取 ---

const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getPriceProjectPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    loading.value = false
}

// 级联选择器配置
const cascaderRef = ref(null)
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
}

// 公司切换联动客户
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        })
    }
    const orgId = e ? e : ''
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId })
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
}

onMounted(async () => {
    // 1. 获取公司
    const companyRes = await getOrgListCompanyApi()
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }))
    }
    companyOptions.value = convertToTree(companyRes.data)

    // 2. 获取仓库
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data

    // 3. 获取初始客户列表
    const cusRes = await getCustomerLikeQueryApi({ keyword: '*' })
    customerOptions.value = cusRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))

    // 4. 获取状态枚举
    const statusRes = await getPriceProjectStatusEnumApi()
    statusOptions.value = statusRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

:deep(.el-dropdown) {
    outline: none;
}
</style>