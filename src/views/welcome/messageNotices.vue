<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData, getColSpan }">
                    <el-col>
                        <el-form-item :label="getLabel('messageTypeId')" class="compact-item">
                            <el-select v-model="formData.messageTypeId" :placeholder="getPlaceholder('messageTypeId')"
                                clearable>
                                <el-option v-for="item in msgTypeMenu" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
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
                    <el-button type="primary" @click="handleBatchRead" :icon="ChatDotRound">{{
                        getButtonText('batchRead') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{ getButtonText('del') }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleParticulars(row)">
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDownload(row)" v-if="row.fileUrl">
                            <span>{{ getButtonText('attachment') }}</span>
                        </div>
                    </div>
                </template>
                <template #link="{ row, column, index }">
                    <a :href="row.link" target="_blank">{{ row.link }}</a>
                </template>
                <template #fileUrl='{ row, column, index }'>
                    <a :href="toDownloadTempPath(row.fileUrl)" target="_blank">{{ row.fileUrl }}</a>
                </template>
                <template #isReaded="{ row, column, index }">
                    <el-tag v-if="row.isReaded" type="success">已读</el-tag>
                    <el-tag v-else type="danger">未读</el-tag>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="dialogVisible" title="消息详情" width="900" align-center @close="handleClose" destroy-on-close>
            <el-form :model="addData">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="消息类型:" label-width="110px">
                            <el-input v-model="addData.typeName" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通知范围:" label-width="110px">
                            <el-input v-model="addData.notifyScopeName" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="标题:" label-width="110px">
                            <el-input v-model="addData.title" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容:" label-width="110px">
                            <div class="htmlContent" v-html="addData.content"> </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addData.fileUrl">
                        <el-form-item label="附件:" label-width="110px">
                            <a :href="toDownloadTempPath(addData.fileUrl)" target="_blank" class="ellipsis-link">{{
                                addData.fileUrl }}</a>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addData.link">
                        <el-form-item label="链接:" label-width="110px">
                            <a :href="toDownloadTempPath(addData.link)" target="_blank" class="ellipsis-link">{{
                                addData.link
                                }}</a>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间:" label-width="110px">
                            <el-input v-model="addData.createdTime" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
                    <el-button type="primary" @click="handleConfirm"
                        :disabled="currentIndex.value === tableData.length - 1">
                        下一条
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'标题'"
            :successValue="'删除成功'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="我的消息">
import { ChatDotRound, Delete } from '@element-plus/icons-vue'
import { getMessageNoticesApi, delMessageNoticesDataApi, getBatchReadApi, getNewMessageTypeEnumApi } from "@/api/userApi/index.js"
import { getBatchReadByIdApi } from '@/api/userApi/index.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { toDownloadTempPath } from '@/utils/downLoad.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
let msgTypeMenu = ref([])
const formConfig = ref([
    { type: 'input', label: '标题', prop: 'title' },
    {
        type: 'select', label: '是否已读', prop: 'isReaded', options: [
            { label: '已读', value: true },
            { label: '未读', value: false },
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    title: '',
    messageTypeId: '',
    isReaded: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        keyword: data.title || '',
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '是否已读', prop: 'isReaded', width: '85', fixed: 'left', slot: 'isReaded' },
    { label: '消息类型', prop: 'typeName', width: '85', fixed: 'left' },
    { label: '通知范围', prop: 'notifyScopeName', width: '85', fixed: 'left' },
    { label: '标题', prop: 'title', width: '200', fixed: 'left' },
    { label: '内容', prop: 'content', width: '800' },
    { label: '链接', prop: 'link', width: '250', slot: 'link' },
    { label: '附件', prop: 'fileUrl', width: '220', slot: 'fileUrl' },
    { label: '阅读时间', prop: 'readTime', width: '165', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '135', fixed: 'right', slot: 'customBtn' }
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
    console.log('选中的数据:', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据:', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化:', pageSize, currentPage)
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
// 附件下载
const handleDownload = (row) => {
    window.open(toDownloadTempPath(row.fileUrl), '_blank')
};
// 消息详情
const handleParticulars = async (row) => {
    // 弹窗
    dialogVisible.value = true
    // 弹窗数据
    addData.value = { ...row }
    const res = await getBatchReadByIdApi({
        id: row.id
    })
    console.log('批量已读:', res)
    // 查找当前消息在 tableData 中的索引
    currentIndex.value = tableData.value.findIndex(item => item.id === row.id)
}
// 弹窗
const dialogVisible = ref(false)
// 弹窗数据
const addData = ref({
    typeName: '',
    notifyScopeName: '',
    title: '',
    content: '',
    link: '',
    createdTime: '',
})
// 当前消息索引
const currentIndex = ref(-1)
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])
// 批量删除数据
const delData = ref([])
// 删除弹窗
const delDialogVisible = ref(false)
const promptMessage = ref('')
// 删除弹窗关闭
const delColse = () => {
    delDialogVisible.value = false
    delData.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！',
        })
        return
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            loading.value = true
            delDialogVisible.value = true
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delMessageNoticesDataApi({ id: selectionRows.value[i].id })
                delData.value.push({
                    id: selectionRows.value[i].title,
                    msg: res.msg,
                    success: res.success
                })
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
// 批量已读
const handleBatchRead = async () => {
    if (selection.value.id === undefined && selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要批量已读的数据！',
        })
        return
    }
    let res
    const bodyLoading = ElLoading.service({
        lock: true,
        text: 'Loading',
    })
    if (selectionRows.value.length > 0) {
        res = await getBatchReadApi({
            idList: selectionRows.value.map(item => item.id)
        })

    } else {
        res = await getBatchReadApi({
            idList: [selection.value.id]
        })
    }
    if (res.success) {
        ElMessage({
            type: 'success',
            message: res.msg,
        })
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        bodyLoading.close()
    }
    console.log('已读:', res)
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getMessageNoticesApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        keyword: initValues.value.title,
    })
    tableData.value = res.data.rows
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    console.log('获取岗位列表:', res.data)
}
// 下一条逻辑
const handleConfirm = async () => {
    if (currentIndex.value === -1) {
        // 未选中任何消息（防御性判断）
        ElMessage({ message: '请先选择一条消息', type: 'warning' })
        return
    }

    const nextIndex = currentIndex.value + 1
    if (nextIndex < tableData.value.length) {
        // 存在下一条消息，更新数据
        currentIndex.value = nextIndex
        const row = tableData.value[nextIndex]
        const res = await getBatchReadByIdApi({
            id: row.id
        })
        addData.value = res.data
    } else {
        // 已是最后一条消息
        ElMessage({ message: '已经是最后一条消息', type: 'info' })
    }
}
// 关闭弹窗
const handleClose = () => {
    dialogVisible.value = false
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    currentIndex.value = -1 // 重置当前索引
}
onMounted(async () => {
    const res = await getNewMessageTypeEnumApi()
    msgTypeMenu.value = res.data.map(item => ({ label: item.name, value: item.id }))
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.ellipsis-link {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}

.htmlContent {
    height: 450px;
    background-color: #f5f7fa;
    width: 100%;
    border: 1px solid #e4e7ed;
    border-radius: 3px;
    overflow-y: auto;
    padding: 5px;
}
</style>