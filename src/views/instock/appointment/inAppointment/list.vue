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
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('platformCode')">
                            <el-select v-model="formData.platformCode" :placeholder="getPlaceholder('platformCode')">
                                <el-option v-for="item in platformOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('appointmentNoList')">
                            <canonicalInput v-model:listName="formData.appointmentNoList"
                                :placeholder="getPlaceholder('appointmentNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :loading="loading" :tableData="tableData" :columns="columns"
                :pagination="pagination" :enableSelection="true" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <template #table-buttons>
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('add')
                            }}</el-button>
                            <el-button type="success" @click="handleConfirm(20)" :icon="Check">{{ getButtonText
                                ('auditPass') }}</el-button>
                            <el-button type="danger" @click="handleConfirm(40)" :icon="Close">{{ getButtonText
                                ('auditReject') }}</el-button>
                            <el-button type="info" plain @click="handleConfirm(50)" :icon="Place">{{ getButtonText
                                ('shipped') }}</el-button>
                        </div>
                    </div>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div v-if="row.statusId == 10" class="cursor-pointer" @click="handleCancel(row)">
                            <el-icon>
                                <CloseBold />
                            </el-icon>
                            <span>{{ getButtonText('cancel') }}</span>
                        </div>
                        <div v-if="row.statusId == 20 || row.statusId == 50" class="cursor-pointer"
                            @click="handleCheckIn(row)">
                            <el-icon>
                                <Check />
                            </el-icon>
                            <span>{{ getButtonText('signIn') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
                <template #platformCode="{ row }">
                    {{ row.platformCode }}({{ row.platformName }})
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 30 || row.statusId == 40 ? 'red' : 'green' }">{{
                        row.statusName
                        }}</span>
                </template>
                <template #isLateCheckin="{ row }">
                    {{ row.isLateCheckin ? '是' : '否' }}
                </template>
            </hydTable>
        </div>
        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1355" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" v-model:formData="addData" :typeOptions="typeOptions"
                :statusOptions="statusOptions" :warehouseOptions="warehouseOptions"
                :deliveryTypeOptions="deliveryTypeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'更新结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'客户-月台名称'" successValue="更新成功" @close="delColse" :promptMessage="promptMessage" />

        <!-- 签到弹窗 -->
        <el-dialog v-model="showCheckInDialog" title="确认签到" width="30%" align-center destroy-on-close>
            <div style="margin-bottom: 20px;">请选择签到时间：</div>
            <el-date-picker v-model="checkInTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" :disabled-date="disabledDate" />
            <template #footer>
                <el-button @click="showCheckInDialog = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="confirmCheckIn">{{ getButtonText('confirm') }}</el-button>
            </template>
        </el-dialog>

    </div>
</template>
<script setup name="预约单">
import { Plus, Place, Close, Check } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getInstockInAppointmentListApi, addInstockInAppointmentApi, updInstockInAppointmentApi, getInstockInAppointmentStatusEnumApi, getInstockInAppointmentTypeEnumApi, updInstockInAppointmentStatusApi, checkInInstockInAppointmentApi, getInstockInAppointmentDeliveryTypeEnumApi, getInstockInAppointmentCountGroupByStatusApi, getInstockInAppointmentCreateWayEnumApi } from '@/api/instockApi/order.js'
import { getWhWarehouseApi, getWhPlatformSelectApi } from "@/api/baseApi/wh.js";
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '入库单号', prop: 'inOrderNo' },
    { type: 'select', label: '预约类型', prop: 'appointmentTypeId', options: [] },
    {
        type: 'select', label: '是否迟到', prop: 'isLateCheckin', options: [
            { label: '是', value: true },
            { label: '否', value: false }
        ]
    },
    { type: 'select', label: '送仓类型', prop: 'deliveryTypeId', options: [] },
    { type: 'select', prop: 'createWay', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
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
        statusIdList: statusIdsArr.value
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: []
    }
    if (platformOptions.value.length > 0) {
        platformOptions.value = []
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '月台', prop: 'platformCode', width: '200', fixed: 'left', sortable: true, slot: 'platformCode' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '预约单号', prop: 'appointmentNo', width: '150', sortable: true },
    { label: '入库单号', prop: 'inOrderNo', width: '160', sortable: true },
    { label: '预约状态', prop: 'statusName', width: '160', sortable: true, slot: 'statusName' },
    { label: '预约类型', prop: 'appointmentTypeName', width: '160', sortable: true },
    { label: '预约时间', prop: 'expectedStartTime', width: '200', sortable: true },
    { label: '签到时间', prop: 'checkinTime', width: '200' },
    { label: '是否迟到', prop: 'isLateCheckin', width: '85', slot: 'isLateCheckin' },
    { label: '送仓类型', prop: 'deliveryTypeName', width: '170', sortable: true },
    { label: '创建方式', prop: 'createWayName', width: '130', sortable: true },
    { label: '备注', prop: 'remark', width: '250' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '200', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

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
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 编辑
const handleEdit = (row) => {
    console.log('编辑：', row);
    const data = { ...row }
    const [datePartStart, timePartStart] = data.expectedStartTime.split(' ');
    data.date = datePartStart;
    data.expectedStartTime = timePartStart;
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...data,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 签到
const showCheckInDialog = ref(false)
const checkInTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const currentRow = ref(null)
// 打开签到弹窗
const handleCheckIn = (row) => {
    currentRow.value = row
    checkInTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
    showCheckInDialog.value = true
}
// 确认签到
const confirmCheckIn = async () => {
    const res = await checkInInstockInAppointmentApi({
        id: currentRow.value.id,
        checkInTime: checkInTime.value
    })
    smartAlert(res.msg, res.success, 1000)
    showCheckInDialog.value = false

    if (res.success) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        getStatus()
    }
}
const disabledDate = (time) => {
    // 禁用今天之后的日期
    return time.getTime() > Date.now();
}
// 取消预约
const handleCancel = async (row) => {
    ElMessageBox.confirm(
        `是否要取消条预约?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await updInstockInAppointmentStatusApi({ id: row.id, statusId: 30 });
            smartAlert(res.msg, res.success, 1000)
            if (res.success) {
                getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
                getStatus()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`instock_appointment_inAppointment_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);


// 删除
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleConfirm = (statusId) => {
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
                const res = await updInstockInAppointmentStatusApi({ id: selectionRows.value[i].id, statusId: statusId });
                delData.value.push({
                    id: selectionRows.value[i].customerName + '-' + selectionRows.value[i].platformName,
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
    getStatus()
};
// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res;
        loading.value = true;
        const data = { ...addData.value, expectedStartTime: addData.value.date + ' ' + addData.value.expectedStartTime };
        if (addData.value.id) {
            res = await updInstockInAppointmentApi(data);
            console.log('修改数据:', res);
        } else {
            res = await addInstockInAppointmentApi(data);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            getStatus()
        }
        loading.value = false;
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};
// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getInstockInAppointmentListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    loading.value = false
}

// 获状态栏
const getStatus = async () => {
    const data = { ...trimObjectStrings(initValues.value) }
    delete data.statusIdList
    const res = await getInstockInAppointmentCountGroupByStatusApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...initValues.value.statusIdList]
}
// 状态栏
const statusIdsList = ref([])
// 状态栏数组
const statusIdsArr = ref([])
// 状态改变事件
const handleStatusChange = async (e) => {
    loading.value = true;
    let list = [...statusIdsArr.value];

    if (list.includes(null)) {
        list = [];
    }

    initValues.value.statusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

// 筛选客户代码
const customerOptions = ref([]);
// 状态
const statusOptions = ref([])
// 类型
const typeOptions = ref([])
// 仓库下拉列表数据
const warehouseOptions = ref([])
// 送仓类型
const deliveryTypeOptions = ref([])
// 月台
const platformOptions = ref([])
// 筛选月台
const handleFilterWh = async (query) => {
    const res = await getWhPlatformSelectApi({ warehouseId: query })
    platformOptions.value = res.data.map(item => ({
        value: item.platformCode,
        label: item.platformCode + '-' + item.platformName
    }))
};
onMounted(async () => {
    const res = await getInstockInAppointmentStatusEnumApi()
    statusOptions.value = res.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    const res2 = await getInstockInAppointmentTypeEnumApi()
    typeOptions.value = res2.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    formConfig.value[1].options = typeOptions.value
    const res3 = await getWhWarehouseApi()
    warehouseOptions.value = res3.data.map(item => ({
        value: item.id,
        label: item.code + '-' + item.name
    }))
    // 送仓类型
    const res4 = await getInstockInAppointmentDeliveryTypeEnumApi()
    deliveryTypeOptions.value = res4.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    formConfig.value[3].options = deliveryTypeOptions.value
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 创建方式
    const res5 = await getInstockInAppointmentCreateWayEnumApi()
    formConfig.value[4].options = res5.data.map(item => ({
        value: item.id,
        label: item.name
    }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>