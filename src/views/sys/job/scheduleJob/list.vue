<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'scheduleJob:add'" :icon="Plus">{{
                        getButtonText('add') }}
                    </el-button>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #jobStatusName="{ row }">
                    <span :style="{ color: row.jobStatusId == 1 ? 'green' : 'red' }">{{ row.jobStatusName }}</span>
                </template>
                <template #isConcurrent="{ row }">
                    <span :style="{ color: row.isConcurrent ? 'green' : 'red' }">{{ row.isConcurrent ? '可并发' : '不可并发'
                        }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :StatusEnumOptions="StatusEnumOptions"
                :JobGroupOptions="JobGroupOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name='定时任务'>
import { Plus } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getScheduleJobListApi, getScheduleJobGroupEnumApi, getScheduleJobStatusEnumApi, addScheduleJobApi, updateScheduleJobApi } from '@/api/sysApi/user.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'select', label: '任务分组', prop: 'jobGroupId', options: [] },
    { type: 'select', label: '任务状态', prop: 'jobStatusId', options: [] },
    { type: 'input', label: '执行Id', prop: 'springId' },
]);

// 初始化表单数据
const initValues = ref({
    jobGroupId: '',
    jobStatusId: '',
    springId: ''
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};
// 表格数据与列配置
const tableData = ref([]);
const columns = ref([
    { label: '任务分组', prop: 'jobGroupName', width: '150', sortable: true },
    { label: '任务名称', prop: 'jobName', width: '150', sortable: true },
    { label: 'cron表达式', prop: 'cronExpression', width: '150' },
    { label: '状态', prop: 'jobStatusName', width: '125', slot: 'jobStatusName', sortable: true },
    { label: '描述', prop: 'description', width: '250' },
    { label: '是否并发', prop: 'isConcurrent', width: '160', slot: 'isConcurrent', sortable: true },
    { label: '执行beanId', prop: 'springId', width: '200', sortable: true },
    { label: '执行方法名', prop: 'methodName', width: '125' },
    { label: '参数', prop: 'args', width: '200' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '105', fixed: 'right', slot: 'customBtn' }
]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const loading = ref(true);

// 选择及排序数据
const selection = ref({});
const selectionRows = ref([]);
const orderBy = ref('');

// 表格事件方法
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
    console.log('选中的数据：', selectionRows.value);
};
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString);
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({
    id: null,
    jobGroupId: '',
    jobName: '',
    cronExpression: '',
    jobStatusId: '',
    description: '',
    isConcurrent: '',
    springId: '',
    methodName: '',
    args: '',
});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`sys_job_scheduleJob_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        jobGroupId: '',
        jobName: '',
        cronExpression: '',
        jobStatusId: '',
        description: '',
        isConcurrent: '',
        springId: '',
        methodName: '',
        args: '',
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑按钮
const handleEdit = (row) => {
    addData.value = {
        ...row
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};
// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const bodyLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
        })
        loading.value = true;
        let res
        if (dialogMode.value === 'upd') {
            res = await updateScheduleJobApi(addData.value);
        } else {
            res = await addScheduleJobApi(addData.value);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            centerDialogVisible.value = false;
        } else {
            loading.value = false;
        }
        bodyLoading.close();
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getScheduleJobListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = res.data.rows;
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
// 获取枚举数据
const StatusEnumOptions = ref([]);
const JobGroupOptions = ref([]);
onMounted(async () => {
    const groupEnumRes = await getScheduleJobGroupEnumApi()
    formConfig.value[0].options = groupEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    JobGroupOptions.value = formConfig.value[0].options
    const statusEnumRes = await getScheduleJobStatusEnumApi()
    formConfig.value[1].options = statusEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    StatusEnumOptions.value = formConfig.value[1].options
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>