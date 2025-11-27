<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #loginResult="{ row, column, index }">
                    <span :style="{ color: row.loginResult ? 'green' : 'red' }">{{ row.loginResult }}</span>
                </template>
            </hydTable>
        </div>
    </div>
</template>
<script setup name="登录日志">
import { getLoginLogApi } from '@/api/sysApi/setting.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'input', label: '用户代码', prop: 'userCode' },
    { type: 'input', label: '手机号码', prop: 'mobilePhone' },
    {
        type: 'select', label: '登录结果', prop: 'isSuccess', options: [
            { label: '登录成功', value: true },
            { label: '登录失败', value: false }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    userCode: '',
    mobilePhone: '',
    isSuccess: '',
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
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = ref([])
// 表格列配置
const columns = ref([
    { label: '用户代码', prop: 'userCode', width: '140', sortable: true, fixed: 'left' },
    { label: '手机号码', prop: 'mobilePhone', width: '165', sortable: true },
    { label: '短信验证码', prop: 'smsCode', width: '140' },
    { label: '登录端', prop: 'terminalName', width: '170', sortable: true, },
    { label: '登录IP', prop: 'ipAddress', width: '150', sortable: true, },
    { label: '登录位置', prop: 'ipLocation', width: '200', sortable: true },
    { label: '登录时间', prop: 'loginTime', width: '200', sortable: true },
    { label: '登录结果', prop: 'loginResult', width: '150', slot: 'loginResult', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },

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

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getLoginLogApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>