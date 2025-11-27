<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('codeList')">
                            <canonicalInput v-model:listName="formData.codeList"
                                :placeholder="getPlaceholder('codeList')" clearable>
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
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('operate') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="openChannel(row)">{{ getButtonText('channelInfo')
                                        }}</el-dropdown-item>
                                    <el-dropdown-item @click="handleEdit(row)">{{ getButtonText('edit')
                                    }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #website="{ row, column, index }">
                    <a :href="row.website" target="_blank">{{ row.website }}</a>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog title="渠道信息" v-model="ChannelDialogVisible" width="1480" align-center destroy-on-close>
            <el-button type="primary" @click="handleSubmitChannel">{{ getButtonText('addChannel') }}</el-button>
            <div style="height: 500px; overflow-y: auto;">
                <channel v-if="supplierChannelAddDTOList.length > 0" ref="channelListRef"
                    :formData="supplierChannelAddDTOList" @delete-item="handleDelChannel">
                </channel>
                <div v-else>
                    <p style="text-align: center;">暂无数据</p>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="ChannelDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleSaveChannel">
                        保存
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="518">
        </exportDialog>
    </div>
</template>
<script setup name="服务商(代理)">
import { Plus, Delete, Share } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getProductSupplierApi, getProductSupplierStatusEnumApi, getProductSupplierTypeEnumApi, getProductSupplierAccountListApi, getProductSupplierChannelListApi, updProductSupplierChannelApi, updProductSupplierAccountApi } from '@/api/productApi/shipway.js'
import channel from './channel.vue'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import router from '@/router/index.js'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', label: '类型', prop: 'typeId', options: [] },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({
    codeList: [],
    typeId: '',
    statusId: '',
    createdTimeBegin: '',
    createdTimeEnd: ''
})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
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
const tableData = ref([])
// 表格列配置
const columns = ref([
    { label: '服务商代码', width: '180', prop: 'code', fixed: 'left', sortable: true },
    { label: '服务商名称', width: '180', prop: 'name', fixed: 'left', sortable: true },
    { label: '服务商类型', prop: 'typeName', width: '180', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'statusName' },
    { label: '服务商登录网站', prop: 'website', width: '200', slot: 'website' },
    { label: '联系人', prop: 'contactName', width: '180', sortable: true },
    { label: '手机号', prop: 'mobilePhone', width: '135' },
    { label: '邮箱', prop: 'email', width: '200' },
    { label: '联系地址', prop: 'contactAddress', width: '200', sortable: true },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '账号', prop: 'account', width: '120' },
    { label: '公司', prop: 'orgName', width: '135', sortable: true },
    { label: '拥有者', prop: 'owner', width: '120' },
    { label: 'API接口', prop: 'apiName', width: '180', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '155', fixed: 'right', slot: 'customBtn' }
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
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑服务商',
        params: { id: row.id, name: row.name },
    })
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '服务商详情',
        params: { id: row.id, name: row.name },
    })
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    router.push('/product/shipway/supplier/add')
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
const dataId = ref('')

// 渠道
const ChannelDialogVisible = ref(false)
const channelListRef = ref(null)
const supplierChannelAddDTOList = ref([])
const handleDelChannel = (index) => {
    supplierChannelAddDTOList.value.splice(index, 1)
}
// 新增渠道
const handleSubmitChannel = () => {
    supplierChannelAddDTOList.value.push({
        code: '',
        name: '',
        remake: ''
    });
}
const openChannel = async (row) => {
    dataId.value = row.id
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const res = await getProductSupplierChannelListApi({ supplierId: row.id })
    console.log(res)
    supplierChannelAddDTOList.value = res.data
    console.log('渠道数据:', supplierChannelAddDTOList.value)
    loading.close()
    ChannelDialogVisible.value = true;
}

// 保存渠道
const handleSaveChannel = async () => {
    if (supplierChannelAddDTOList.value.length) {
        await channelListRef.value.validateForms()
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const data = {
        supplierId: dataId.value,
        supplierChannelUpdDTOList: supplierChannelAddDTOList.value
    }
    console.log('保存渠道:', data)

    const res = await updProductSupplierChannelApi(data)
    smartAlert(res.msg, res.success, 1000)
    loading.close()
    if (res.success) {
        ChannelDialogVisible.value = false;
    }
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductSupplierApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    // console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}

onMounted(async () => {
    // 获取状态
    const res = await getProductSupplierStatusEnumApi()
    formConfig.value[1].options = res.data.map(item => ({ label: item.name, value: item.id }))
    // 获取服务商类型
    const res2 = await getProductSupplierTypeEnumApi()
    formConfig.value[0].options = res2.data.map(item => ({ label: item.name, value: item.id }))
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshSupplierList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshSupplierList = false
    }
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>