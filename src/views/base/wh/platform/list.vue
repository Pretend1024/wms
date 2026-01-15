<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :loading="loading" :columns="columns" :pagination="pagination"
                :enableSelection="true" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" @click="handleDel(10)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('enable') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel(20)" v-permission="'updateStatus'" :icon="Edit">
                        {{ getButtonText('disable') }}
                    </el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleInfo(row)" v-permission="'platformTimeslot:list'">
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
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="800" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions"
                :statusOptions="statusOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="appointmentTableVisible" :title="t('base_wh_platform_list.appointmentStatus')" width="1200"
            destroy-on-close top="7vh">
            <AppointmentTable :platformId="AppointmentTableData.platformId" :startTime="AppointmentTableData.startTime"
                :endTime="AppointmentTableData.endTime" @cellClick="handleCellClick">
            </AppointmentTable>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="appointmentTableVisible = false">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :dialogTitle="t('base_wh_platform_list.updateResult')" :isVisible="delDialogVisible"
            :tableData="delData" :nameField="'id'" :nameLabel="t('base_wh_platform_list.platformName')"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='月台'>
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Edit, Document } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import canonicalInput from '@/components/table/canonicalInpt.vue';
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import AppointmentTable from './AppointmentTable.vue';

// 1.3 API引入
import {
    getWhPlatformListApi,
    addWhPlatformApi,
    updWhPlatformApi,
    getWhWarehouseApi,
    getWhPlatformStatusEnumApi,
    updWhPlatformStatusApi,
    getWhPlatformAppointmentDetailApi
} from "@/api/baseApi/wh.js";

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
    { type: 'input', label: '月台名称', prop: 'platformName' },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({});

// 表格数据与分页
const tableData = shallowRef([]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const orderBy = ref('');

// 选中数据
const selection = ref({});
const selectionRows = ref([]);

// 弹窗状态
const centerDialogVisible = ref(false);
const dialogMode = ref('add'); // 'add' | 'upd'
const childFormRef = ref(null);
const addData = ref({});

// 预约弹窗
const appointmentTableVisible = ref(false);
const AppointmentTableData = ref({});

// 批量操作相关
const delData = ref([]);
const promptMessage = ref('');
const delDialogVisible = ref(false);

// 下拉选项数据
const warehouseOptions = ref([]);
const statusOptions = ref([]);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
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

// 弹窗标题
const dialogTitle = computed(() => t(`base_wh_platform_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getWhPlatformListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = Object.freeze(res.data.rows);
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
    loading.value = false;
};

// 搜索
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 新增
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

// 编辑
const handleEdit = (row) => {
    console.log('编辑：', row);
    addData.value = {
        ...row,
        weekdays: row.weekdays.split(','), // 字符串转数组
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 批量修改状态 (启用/禁用)
const handleDel = (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_wh_platform_list.selectChange')
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_wh_platform_list.confirmChange', { count: selectionRows.value.length }),
        t('base_wh_platform_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            delData.value = [];
            promptMessage.value = t('base_wh_platform_list.processing');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await updWhPlatformStatusApi({ id: selectionRows.value[i].id, statusId: statusId });
                delData.value.push({
                    id: selectionRows.value[i].platformName,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('base_wh_platform_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_wh_platform_list.operationCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        const data = { ...addData.value };

        // 处理 weekdays
        if (Array.isArray(data.weekdays)) {
            data.weekdays = data.weekdays.map(Number).sort((a, b) => a - b).join(',');
        }

        let res;
        if (data.id) {
            res = await updWhPlatformApi(data);
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

// 打开预约详情
const handleInfo = async (row) => {
    AppointmentTableData.value.platformId = row.id;
    AppointmentTableData.value.startTime = row.startTime;
    AppointmentTableData.value.endTime = row.endTime;
    appointmentTableVisible.value = true;
};

// 预约单元格点击详情
const handleCellClick = async (cellData) => {
    console.log('单元格数据:', cellData);
    // 这里如果 cellData 没有 appointment，则不请求详情，或者根据业务逻辑处理
    if (!cellData.appointment) return;

    const res = await getWhPlatformAppointmentDetailApi({ appointmentNo: cellData.appointment.appointmentNo });
    const content = `
            <div class="mb-3">
                <div class="mt-2">
                    <p><span class="text-gray-600 mr-2">${t('base_wh_platform_list.appointmentNo')}:</span>${res.data.appointmentNo}</p>
                    <p><span class="text-gray-600 mr-2">${t('base_wh_platform_list.appointmentTime')}:</span>${res.data.expectedStartTime}</p>
                    <p><span class="text-gray-600 mr-2">${t('base_wh_platform_list.status')}:</span>${res.data.statusName}</p>
                    <p><span class="text-gray-600 mr-2">${t('base_wh_platform_list.company')}:</span>${res.data.orgName}</p>
                    ${res.data.customerName ? `<p><span class="text-gray-600 mr-2">${t('base_wh_platform_list.customer')}:</span>${res.data.customerCode} (${res.data.customerName})</p>` : ''}
                </div>
            </div>
        `;

    ElMessageBox.confirm(
        content,
        t('base_wh_platform_list.viewAppointmentDetail'),
        {
            cancelButtonText: t('base_wh_platform_list.close'),
            showConfirmButton: false,
            dangerouslyUseHTMLString: true,
        }
    );
};

/* 5. 辅助方法 */

// 表格选中
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
};

// 行点击
const handleRowClick = (row) => {
    selection.value = row;
};

// 分页变化
const handlePageChange = ({ pageSize, currentPage }) => {
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 排序变化
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗取消
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 批量结果弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [warehouseRes, statusRes] = await Promise.all([
        getWhWarehouseApi(),
        getWhPlatformStatusEnumApi()
    ]);

    // 仓库数据
    warehouseOptions.value = warehouseRes.data;

    // 状态数据
    statusOptions.value = statusRes.data;
    formConfig.value[1].options = statusOptions.value.map(item => ({
        label: item.name,
        value: item.id
    }));

});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>