<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('warehouseId')">
                            <el-select v-model="formData.warehouseId" :placeholder="getPlaceholder('warehouseId')"
                                @change="handleFilterWh">
                                <el-option v-for="item in warehouseOptions" :key="item.value"
                                    :label="item.code + ' - ' + item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('platformCodeList')">
                            <canonicalInput v-model:listName="formData.platformCodeList"
                                :placeholder="getPlaceholder('platformCodeList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :loading="loading" :columns="columns" :pagination="pagination"
                :enableSelection="true" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleDel(10)" :icon="Edit">{{ getButtonText('enable')
                        }}</el-button>
                    <el-button type="danger" @click="handleDel(20)" :icon="Edit">{{ getButtonText('disable')
                        }}</el-button>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleInfo(row)">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('appointment') }}</span>
                        </div>
                    </div>
                </template>
                <template #time="{ row }">
                    <span>{{ row.startTime }} - {{ row.endTime }}</span>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="800" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions"
                :statusOptions="statusOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="appointmentTableVisible" title="预约情况" width="1200" destroy-on-close top="7vh">
            <AppointmentTable :platformId="AppointmentTableData.platformId" :startTime="AppointmentTableData.startTime"
                :endTime="AppointmentTableData.endTime" @cellClick="handleCellClick">
            </AppointmentTable>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="appointmentTableVisible = false">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 批量删除弹窗组件 -->
        <batchOperationn :dialogTitle="'更新结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'月台名称'" :successValue="'更新状态成功'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='月台列表'>
import { Plus, Edit } from "@element-plus/icons-vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getWhPlatformListApi, addWhPlatformApi, updWhPlatformApi, getWhWarehouseApi, getWhPlatformStatusEnumApi, getWhPlatformAppointmentApi, updWhPlatformStatusApi, getWhPlatformAppointmentDetailApi } from "@/api/baseApi/wh.js";
import AppointmentTable from './AppointmentTable.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '月台名称', prop: 'platformName' },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})
const loading = ref(true)

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
// 表格数据与列配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '月台代码', prop: 'platformCode', width: '170', sortable: true, fixed: 'left' },
    { label: '月台名称', prop: 'platformName', width: '170', sortable: true, fixed: 'left' },
    { label: '月台状态', prop: 'statusName', width: '175', sortable: true, slot: 'statusName' },
    { label: '开启时段', prop: 'startTime', width: '175', sortable: true, slot: 'time' },
    { label: '今日预约数', prop: 'appointmentCount', width: '170', sortable: true },
    { label: '工作日', prop: 'weekdays', width: '120' },
    { label: '车辆最大容纳量', prop: 'maxCapacity', width: '200' },
    { label: '备注', prop: 'remark', width: '300' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '180', fixed: 'right', slot: 'customBtn' }
]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});

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
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_wh_platform_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 预约情况弹窗相关
const appointmentTableVisible = ref(false);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        platformCode: '',
        platformName: '',
        warehouseCode: '',
        statusId: '',
        startTime: null,
        endTime: null,
        weekdays: ['1', '2', '3', '4', '5'], // 默认工作日为周一至周五
        maxCapacity: null,
        remark: ''
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 修改状态
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleDel = (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要更改的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要更改${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            delData.value = [];
            promptMessage.value = '操作中...'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await updWhPlatformStatusApi({ id: selectionRows.value[i].id, statusId: statusId });
                delData.value.push({
                    id: selectionRows.value[i].platformName,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
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


// 编辑按钮
const handleEdit = (row) => {
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...row,
        // 将weekdays字符串转换为数组
        weekdays: row.weekdays.split(','),
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res;
        loading.value = true;
        const data = {
            ...addData.value,
        }
        // 将weekdays数组转换成用逗号分隔的字符串,并且从小到大排序,先判断是否是数组
        if (Array.isArray(data.weekdays)) {
            data.weekdays = data.weekdays.map(Number).sort((a, b) => a - b);
            data.weekdays = data.weekdays.join(',');
        }

        if (data.id) {
            res = await updWhPlatformApi(data);
            console.log('修改数据:', res);
        } else {
            res = await addWhPlatformApi(data);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        loading.value = false;
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};
// 预约情况
const AppointmentTableData = ref({});
const handleInfo = async (row) => {
    AppointmentTableData.value.platformId = row.id;
    AppointmentTableData.value.startTime = row.startTime;
    AppointmentTableData.value.endTime = row.endTime;
    appointmentTableVisible.value = true;
}
// 预约情况详情
const handleCellClick = async (cellData) => {
    console.log('单元格数据:', cellData);
    const res = await getWhPlatformAppointmentDetailApi({ appointmentNo: cellData.appointment.appointmentNo });
    const content = `
            <div class="mb-3">
                <div class="mt-2">
                    <p><span class="text-gray-600 mr-2">预约单号:</span>${res.data.appointmentNo}</p>
                    <p><span class="text-gray-600 mr-2">预约时间:</span>${res.data.expectedStartTime}</p>
                    <p><span class="text-gray-600 mr-2">状态:</span>${res.data.statusName}</p>
                    <p><span class="text-gray-600 mr-2">公司:</span>${res.data.orgName}</p>
                    ${res.data.customerName ? `<p><span class="text-gray-600 mr-2">客户:</span>${res.data.customerCode} (${res.data.customerName})</p>` : ''}
                </div>
            </div>
        `

    ElMessageBox.confirm(
        content,
        '查看预约详情',
        {
            cancelButtonText: '关闭',
            showConfirmButton: false,
            dangerouslyUseHTMLString: true,
            callback: (action) => {
                if (action === 'confirm') {
                    emits('cellClick', {
                        timeSlot,
                        date,
                        appointment
                    })
                }
            }
        }
    )

};

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getWhPlatformListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = res.data.rows;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
    loading.value = false;
};

// 仓库下拉列表数据
const warehouseOptions = ref([])
// 月台状态
const statusOptions = ref([])

onMounted(async () => {
    const res = await getWhWarehouseApi()
    warehouseOptions.value = res.data
    const res2 = await getWhPlatformStatusEnumApi()
    statusOptions.value = res2.data
    formConfig.value[1].options = statusOptions.value.map(item => ({
        label: item.name,
        value: item.id
    }))

});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>