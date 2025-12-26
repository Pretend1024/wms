<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <!-- <template #custom-form="{ formData }">
                    <el-col >
                        <el-form-item label="插槽测试:" class="compact-item">
                            <el-input v-model="formData.customInput" placeholder="请输入测试内容" />
                        </el-form-item>
                    </el-col>
                </template> -->
                <template #custom-form="{ formData, getColSpan }">
                    <el-col>
                        <el-form-item :label="getLabel('typeId')" class="compact-item">
                            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" clearable
                                filterable popper-class="multi-column-select">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')" class="compact-item">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
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
                <template #table-buttons>
                    <el-button type="danger" @click="handleDel"  :icon="Close">{{ getButtonText('close') }}
                    </el-button>
                </template>
                <template #fileUrl='{ row, column, index }'>
                    <a :href="toDownloadTempPath(row.fileUrl)" target="_blank">{{ row.fileUrl }}</a>
                </template>
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId == 3 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleParticulars(row)">
                            <span>{{ getButtonText('view') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDownload(row)" v-if="row.fileUrl">
                            <span>{{ getButtonText('download') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="dialogVisible" title="查看" width="700" align-center destroy-on-close>
            <el-form :model="addData">
                <el-form-item label="用户代码:" label-width="110px">
                    <el-input v-model="addData.customerCode" disabled />
                </el-form-item>
                <el-form-item label="模板类型:" label-width="110px">
                    <el-input v-model="addData.typeName" disabled />
                </el-form-item>
                <el-form-item label="任务编号:" label-width="110px">
                    <el-input v-model="addData.jobNo" disabled />
                </el-form-item>
                <el-form-item label="参数:" label-width="110px">
                    <el-input type="textarea" v-model="addData.exportParam" :rows="7" disabled />
                </el-form-item>
                <el-form-item label="进度反馈消息:" label-width="110px">
                    <el-input type="textarea" v-model="addData.feedbackMsg" :rows="2" disabled />
                </el-form-item>
                <el-form-item label="状态:" label-width="110px">
                    <el-input v-model="addData.statusName" disabled />
                </el-form-item>
                <el-form-item label="导出总数:" label-width="110px">
                    <el-input v-model="addData.exportTotal" disabled />
                </el-form-item>
                <el-form-item label="已导出数:" label-width="110px">
                    <el-input v-model="addData.exportAlready" disabled />
                </el-form-item>
                <el-form-item label="开始时间:" label-width="110px">
                    <el-input v-model="addData.startTime" disabled />
                </el-form-item>
                <el-form-item label="结束时间:" label-width="110px">
                    <el-input v-model="addData.endTime" disabled />
                </el-form-item>
                <el-form-item label="任务创建时间:" label-width="110px">
                    <el-input v-model="addData.createdTime" disabled />
                </el-form-item>
                <el-form-item label="文件路径:" label-width="110px">
                    <a :href="toDownloadTempPath(addData.fileUrl)" target="_blank">{{ addData.fileUrl }}</a>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            nameLabel="导出编号" successValue="关闭成功" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="我的下载">
import { Close } from "@element-plus/icons-vue";
import { getExportJobListApi, getTypeEnumApi, getStatusEnumApi } from "@/api/userApi/index.js"
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { toDownloadTempPath } from '@/utils/downLoad.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { exportJobCloseByIdApi } from '@/api/sysApi/setting.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
let statusOptions = ref([])
let typeOptions = ref([])
const formConfig = ref([
    // { type: 'input', label: '用户代码', prop: 'createdBy' },
    { type: 'input', label: '任务编号', prop: 'jobNo' },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({
    createdBy: '',
    typeId: '',
    statusId: '',
    jobNo: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
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
        ...data
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '导出编号', prop: 'jobNo', width: '200', fixed: 'left' },
    { label: '导出类型', prop: 'typeName', width: '130', sortable: true, fixed: 'left' },
    { label: '模板名称', prop: 'templateName', width: '150', fixed: 'left' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '状态', prop: 'statusName', width: '85', sortable: true, slot: 'statusName' },
    { label: '导出总数', prop: 'exportTotal', width: '85' },
    { label: '已导出数', prop: 'exportAlready', width: '100' },
    { label: '进度', prop: 'progress', width: '85' },
    { label: '导出参数', prop: 'exportParam', width: '200' },
    { label: '客户名称', prop: 'customerName', width: '135' },
    { label: '文件大小', prop: 'fileSize', width: '130' },
    { label: '导出文件路径', prop: 'fileUrl', width: '200', slot: 'fileUrl' },
    { label: '进度反馈消息', prop: 'feedbackMsg', width: '200' },
    { label: '进度反馈时间', prop: 'feedbackTime', width: '200', sortable: true },
    { label: '开始时间', prop: 'startTime', width: '200', sortable: true },
    { label: '结束时间', prop: 'endTime', width: '200', sortable: true },
    { label: '耗时(s)', prop: 'elapsedTime', width: '85' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '125', fixed: 'right', slot: 'customBtn' }
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
// 消息详情
const handleParticulars = async (row) => {
    // 弹窗
    dialogVisible.value = true
    // 弹窗数据
    addData.value = { ...row }
}
// 下载
const handleDownload = async (row) => {
    window.open(toDownloadTempPath(row.fileUrl))
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

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 关闭
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要关闭的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要关闭${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await exportJobCloseByIdApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].jobNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};


// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getExportJobListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        self: true,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    tableData.value.forEach(item => {
        item.elapsedTime = item.startTime && item.endTime ? (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000 : ''
        item.progress = item.exportAlready ? (item.exportAlready / item.exportTotal) * 100 + '%' : ''
    })
    console.log('获取列表:', res.data)
}

onMounted(async () => {
    const res = await getTypeEnumApi()
    typeOptions.value = res.data.map(item => {
        return {
            label: item.name,
            value: item.id
        }
    })
    const res2 = await getStatusEnumApi()
    statusOptions.value = res2.data.map(item => {
        return {
            label: item.name,
            value: item.id
        }
    })

})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>