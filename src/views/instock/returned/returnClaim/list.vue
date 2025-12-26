<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('carrierCode')">
                            <el-select v-model="formData.carrierCode" :placeholder="getPlaceholder('carrierCode')"
                                clearable>
                                <el-option v-for="item in carrierOptions" :key="item.value" :label="item.label"
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
                        <el-form-item :label="getLabel('trackingNoList')">
                            <canonicalInput v-model:listName="formData.trackingNoList"
                                :placeholder="getPlaceholder('trackingNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleClaimBatch" :icon="Select">{{ getButtonText('claim')
                    }}</el-button>
                    <el-button type="danger" @click="handleDestroy" :icon="Close">{{ getButtonText('destroy')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;" v-if="row.statusId !== 3">
                        <div class="cursor-pointer" @click="handleClaim" v-if="row.statusId == 1">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('claim') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDel(row)" v-if="row.statusId == 1">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>{{ getButtonText('del') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog title="销毁类型选择" v-model="destoryDialogVisible" width="500" align-center destroy-on-close>
            <el-form ref="formRef" label-width="115px">
                <el-form-item label="销毁类型:">
                    <el-select v-model="destroyTypeId" placeholder=" 请选择销毁类型" clearable>
                        <el-option v-for="item in destroyTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="destoryDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleUpdStatus">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'物流单号'" successValue="销毁成功" @close="delColse" :promptMessage="promptMessage" />
        <!-- 认领 -->
        <claimDialog ref="claimDialogRef" :isVisible="claimDialogVisible" :isMulti="isMulti"
            @close="claimDialogVisible = false" @confirm="handleClaimConfirm">
        </claimDialog>
        <!-- 新增 -->
        <addDialog ref="addDialogRef" @confirm="addDialogConfirm" />
    </div>
</template>
<script setup name="认领">
import { Plus, Delete, Close, Select, Van, SoldOut } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { getReturnOrderClaimApi, destroyReturnOrderClaimApi, getReturnOrderClaimStatusEnumApi, getReturnOrderClaimDestroyTypeEnumApi, delReturnOrderClaimApi, verifyReturnOrderClaimApi, addReturnOrderClaimApi } from '@/api/instockApi/return.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import claimDialog from './claimDialog.vue'
import addDialog from './add.vue'
import router from '@/router/index.js'

// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false, offsetDays: 30 },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '承运商名称', width: '155', prop: 'carrierName', sortable: true, flex: 'left' },
    { label: '物流单号', width: '150', prop: 'trackingNo', sortable: true, flex: 'left' },
    { label: '状态', width: '115', prop: 'statusName', sortable: true, flex: 'left' },
    { label: '客户', width: '200', prop: 'customerCode', sortable: true, slot: 'customer', flex: 'left' },
    { label: '认领时间', width: '200', prop: 'claimTime', sortable: true },
    { label: '销毁类型', width: '180', prop: 'destroyTypeName', sortable: true },
    { label: '销毁备注', width: '225', prop: 'destroyRemark' },
    { label: '销毁人', width: '165', prop: 'destroyBy', sortable: true },
    { label: '销毁时间', width: '200', prop: 'destroyTime', sortable: true },
    { label: '备注', width: '225', prop: 'remark' },
    { label: '创建人', width: '110', prop: 'createdBy' },
    { label: '创建时间', width: '200', prop: 'createdTime', sortable: true },
    { label: '更新人', width: '120', prop: 'updatedBy' },
    { label: '更新时间', width: '200', prop: 'updatedTime', sortable: true },
    { label: '操作', width: '135', fixed: 'right', prop: 'action', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
    console.log('选中的数据：', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 新增
const addDialogRef = ref(null)
const handleAdd = async () => {
    addDialogRef.value.open();
}
const addDialogConfirm = async (data) => {
    const res = await addReturnOrderClaimApi(data)
    smartAlert(res.msg, res.success, 1000)
    if (res.success) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    }
};

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 认领
const claimDialogVisible = ref(false)
const isMulti = ref(false)
const claimDialogRef = ref(null)
// 单个认领
const handleClaim = async () => {
    isMulti.value = false;
    claimDialogVisible.value = true;
}
// 批量认领
const handleClaimBatch = async () => {
    isMulti.value = true;
    claimDialogVisible.value = true;
}
// 认领确认
const handleClaimConfirm = async (data) => {
    let trackingNos = data
    if (Array.isArray(data)) {
        trackingNos = data.join(',');
    }
    console.log('认领数据：', trackingNos)
    const res = await verifyReturnOrderClaimApi({ trackingNos });
    smartAlert(res.msg, res.success, 1000)
    if (!res.success) return;
    router.push({
        name: '新增退件单',
        params: { trackingNos: trackingNos },
    })
    claimDialogVisible.value = false;
}
// 删除
const handleDel = async (row) => {
    ElMessageBox.confirm(
        `是否要删除该条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await delReturnOrderClaimApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000)
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        })
}
// 销毁
const destroyTypeOptions = ref([])
const destroyTypeId = ref('')
const handleDestroy = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要销毁的数据！'
        });
        return;
    }
    destoryDialogVisible.value = true;
}

// 销毁弹窗
const destoryDialogVisible = ref(false)
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleUpdStatus = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要销毁的数据！'
        });
        return;
    }
    loading.value = true;
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await destroyReturnOrderClaimApi({ id: selectionRows.value[i].id, destroyTypeId: destroyTypeId.value });
        delData.value.push({
            id: selectionRows.value[i].trackingNo,
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'

};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    destoryDialogVisible.value = false;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getReturnOrderClaimApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    footer.value = res.data.footer[0]
    // console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 承运商
const carrierOptions = ref([])
// 状态
const statusOptions = ref([])
onMounted(async () => {
    //   销毁类型
    const destroyTypeRes = await getReturnOrderClaimStatusEnumApi()
    destroyTypeOptions.value = destroyTypeRes.data.map(item => ({ label: item.name, value: item.id }))
    // 承运商数据
    const carrierRes = await getProductShipwayBrandListApi()
    carrierOptions.value = carrierRes.data.map(item => ({
        label: item.name,
        value: item.code
    }))
    // 状态
    const statusRes = await getReturnOrderClaimDestroyTypeEnumApi()
    statusOptions.value = statusRes.data.map(item => ({ label: item.name, value: item.id }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>