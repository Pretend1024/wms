<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('objNo')" class="compact-item">
                            <el-input v-model="formData.objNo" :placeholder="getPlaceholder('objNo')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('userCode')">
                            <el-input v-model="formData.userCode" :placeholder="getPlaceholder('userCode')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('objTypeId')">
                            <el-select v-model="formData.objTypeId" filterable
                                :placeholder="getPlaceholder('objTypeId')" clearable popper-class="multi-column-select">
                                <el-option v-for="item in objTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @row-click="handleRowClick"
                @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #isSuccess="{ row, column, index }">
                    <span :style="{ color: row.isSuccess ? 'green' : 'red' }">{{ row.isSuccess ? '成功' : '失败' }}</span>
                </template>
                <template #message="{ row }">
                    <div v-html="row.message"></div>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="viewDetails(row)">
                            <el-icon>
                                <View />
                            </el-icon>
                            <span>{{ getButtonText('view') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" title="详情" width="700" align-center destroy-on-close>
            <el-form :model="selection" label-width="110px">
                <el-form-item :label="getLabel('userCode')">
                    <el-input v-model="selection.userCode" disabled />
                </el-form-item>
                <el-form-item :label="getLabel('createdTime')">
                    <el-input v-model="selection.createdTime" disabled />
                </el-form-item>
                <el-form-item :label="getLabel('objTypeName')">
                    <el-input v-model="selection.objTypeName" disabled />
                </el-form-item>
                <el-form-item :label="getLabel('objNo')">
                    <el-input v-model="selection.objNo" disabled />
                </el-form-item>
                <el-form-item :label="getLabel('indexNo1')">
                    <el-input v-model="selection.indexNo1" disabled />
                </el-form-item>
                <el-form-item :label="getLabel('isSuccess')">
                    <el-select v-model="selection.isSuccess" disabled>
                        <el-option label="成功" :value="true" />
                        <el-option label="失败" :value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="getLabel('message')">
                    <div class="messageDiv">
                        <p v-html="selection.message"></p>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup name="操作日志">
import { View } from "@element-plus/icons-vue";
import { getPpLogListApi, getObjTypeEnumApi } from '@/api/sysApi/setting.js';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()

// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    // { type: 'input', label: '关键单号', prop: 'objNo' },
    // { type: 'input', label: '用户代码', prop: 'userCode' },
    // { type: 'select', label: '对象类型', prop: 'objTypeId', options: [] },
    { type: 'input', label: '操作类型', prop: 'opType' },
    {
        type: 'select', label: '操作结果', prop: 'isSuccess', options: [
            { label: '成功', value: true },
            { label: '失败', value: false }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    userCode: '',
    objTypeId: '',
    opType: '',
    objNo: '',
    indexNo: '',
    isSuccess: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
});

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data
    };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    };
    refreshStore.indexNo = '';
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 表格数据--------------------------------------
const tableData = ref([]);
// 表格列配置
const columns = ref([
    { label: '用户代码', prop: 'userCode', width: '140', sortable: true, fixed: 'left' },
    { label: '操作时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '对象类型', prop: 'objTypeName', width: '155', sortable: true },
    { label: '单号1', prop: 'indexNo1', width: '200', sortable: true, },
    { label: '单号2', prop: 'indexNo2', width: '200', sortable: true, },
    { label: '单号3', prop: 'indexNo3', width: '200', sortable: true, },
    { label: '操作类型', prop: 'opType', width: '200', sortable: true, },
    { label: '操作结果', prop: 'isSuccess', width: '220', slot: 'isSuccess', sortable: true },
    { label: '操作消息', prop: 'message', width: '500', slot: 'message' },
    { label: '登录端', prop: 'terminalName', width: '220', sortable: true, },
    { label: 'IP地址', prop: 'ip_address', width: '150', sortable: true },
    { label: 'IP所在城市地址', prop: 'ip_location', width: '220', sortable: true },
    { label: '浏览器', prop: 'browser', width: '120', sortable: true },
    { label: '操作系统', prop: 'os', width: '220', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '105', fixed: 'right', slot: 'customBtn' }
]);

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});

const loading = ref(true);

const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage);
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 排序条件
const orderBy = ref('');

// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString);
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 选择的行数据
const selection = ref({});
// 弹窗
const dialogVisible = ref(false);
// 查看详情
const viewDetails = (row) => {
    selection.value = row;
    dialogVisible.value = true;
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getPpLogListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        indexNo: refreshStore.indexNo,
    });
    tableData.value = res.data.rows;
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
// 获取对象类型枚举
const objTypeOptions = ref([]);
onMounted(async () => {
    const res = await getObjTypeEnumApi();
    objTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }));
});
// keepalive激活
onActivated(() => {
    if (refreshStore.indexNo) {
        console.log('keepalive被激活', refreshStore.indexNo);
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.messageDiv {
    width: 100%;
    height: 250px;
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    background-color: #f5f7fa;
    overflow-y: auto;
    padding: 1px 11px;
    color: #a8abb2;
}
</style>