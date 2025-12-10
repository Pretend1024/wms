<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 出库单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('outOrder')">
                            <canonicalInput v-model:listName="formData.orderNoList"
                                :placeholder="getPlaceholder('outOrder')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 跟踪号 -->
                    <el-col>
                        <el-form-item :label="getLabel('trackingNo')">
                            <canonicalInput v-model:listName="formData.trackingNoList"
                                :placeholder="getPlaceholder('trackingNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 状态 -->
                    <!-- <el-col>
                        <el-form-item :label="getLabel('status')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('status')" clearable>
                                <el-option label="已解决" :value="20" />
                                <el-option label="未解决" :value="10" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- 类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('typeId')">
                            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" clearable>
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('msg')">
                            <el-input v-model="formData.msg" :placeholder="getPlaceholder('msg')" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 时间 -->
                    <el-col>
                        <selectDate ref="dateSelectRef" :options="timeTypeOptions"
                            :initialDateRange="selectDateData.dateRange" @change="handleTimeChange"></selectDate>
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
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <el-button type="danger" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('addProblem')
                            }}</el-button>
                            <el-button type="success" @click="handleClose" :icon="Check">{{
                                getButtonText('closeProblem')
                                }}</el-button>
                        </div>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId !== 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
            </hydTable>
        </div>
        <addProblemDialog ref="addProblemDialogRef" @close="handleAddClose" :typeOptions="typeOptions" />
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'出库单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="问题管理">
import { getOutstockOrderProblemApi, getOutstockOrderProblemTypeEnumApi, getOutstockOrderProblemStatusCountApi, closeOutstockOrderProblemApi, getOutstockOrderProblemTimeFilterEnumApi } from '@/api/outstockApi/problem.js'
import addProblemDialog from './addProblemDialog.vue'

import { Close, SemiSelect, Check, Plus } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { outstockOrderHoldupListApi, outstockOrderHoldupFailApi, outstockOrderHoldupSuccessApi, outstockOrderCancelHoldUpApi, getOrderHoldupStatusApi } from '@/api/outstockApi/holdup.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([])

// 初始化表单数据
const initValues = ref({
    orgId: [],
})
const dateSelectRef = ref(null)
const timeTypeOptions = ref([])
// 初始化日期范围
const getDefaultDateRange = () => {
    const time2 = new Date();
    time2.setHours(23, 59, 59, 999);

    const time1 = new Date(time2);
    time1.setDate(time1.getDate() - 30);
    time1.setHours(0, 0, 0, 0);

    // 格式化为 YYYY-MM-DD HH:mm:ss 格式
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    return [formatDate(time1), formatDate(time2)];
};
const selectDateData = ref({
    dateType: 10,
    dateRange: getDefaultDateRange()
})
const handleTimeChange = (data) => {
    selectDateData.value = data
}

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: statusIdsArr.value,
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[1] : '',
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    selectDateData.value = {
        dateType: 10,
        dateRange: getDefaultDateRange()
    }
    nextTick(() => {
        dateSelectRef.value.reset();
    })

    initValues.value = {
        ...data,
        statusIdList: [],
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[1] : '',
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '135', slot: 'customer', fixed: 'left', sortable: true },
    { label: '出库单号', prop: 'outOrderNo', width: '150', fixed: 'left' },
    { label: '问题类型', prop: 'typeName', width: '150', sortable: true },
    { label: '问题状态', prop: 'statusName', width: '125', sortable: true, slot: 'statusName' },
    { label: '问题描述', prop: 'msg', width: '250' },
    { label: '解决信息', prop: 'solveRemark', width: '250' },
    { label: '解决人', prop: 'solveBy', width: '110' },
    { label: '解决时间', prop: 'solveTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    // { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
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

const addProblemDialogRef = ref(null)
// 添加问题
const handleAdd = () => {
    addProblemDialogRef.value.open();
}
// 问题弹窗关闭
const handleAddClose = () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)

}
// 关闭问题
const handleClose = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要关闭的数据！'
        });
        return;
    }
    // 使用prompt创建带输入框的对话框
    ElMessageBox.prompt(
        `请输入解决备注`,
        '关闭问题',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async ({ value }) => {
            const solveRemark = value.trim();
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await closeOutstockOrderProblemApi({ id: selectionRows.value[i].id, solveRemark });
                delData.value.push({
                    id: selectionRows.value[i].outOrderNo,
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
}

// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
// 取消
const handleCancel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消拦截${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单?`,
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
                const res = await outstockOrderCancelHoldUpApi({ outOrderId: selectionRows.value[i].outOrderId });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
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
// 成功
const handleSuccess = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择成功的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单是否已完成拦截?`,
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
                const res = await outstockOrderHoldupSuccessApi({ outOrderId: selectionRows.value[i].outOrderId });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
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
// 失败
const handleFailure = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择失败的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单是否拦截失败?`,
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
                const res = await outstockOrderHoldupFailApi({ outOrderId: selectionRows.value[i].outOrderId });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
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
    getStatus()
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOutstockOrderProblemApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        orgId: initValues.value.orgId[initValues.value.orgId.length - 1]
    })
    tableData.value = res.data.rows
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}

// 获状态栏
const getStatus = async () => {
    const data = {
        ...trimObjectStrings(initValues.value),
    }
    if (data.orgId.length > 0) {
        data.orgId = data.orgId[data.orgId.length - 1]
    } else {
        delete data.orgId
    }
    delete data.statusIdList
    const res = await getOutstockOrderProblemStatusCountApi(data)
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
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
// 仓库数据
const warehouseOptions = ref([])
// 拦截状态
const statusOptions = ref([])

// 问题类型
const typeOptions = ref([])

onMounted(async () => {
    // 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    // 处理公司数据
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 获取仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 获取拦截状态
    const holdUpStatusRes = await getOrderHoldupStatusApi()
    statusOptions.value = holdUpStatusRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    // 获取问题类型
    const typeRes = await getOutstockOrderProblemTypeEnumApi()
    typeOptions.value = typeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    // 获取时间筛选类型
    const timeTypeRes = await getOutstockOrderProblemTimeFilterEnumApi()
    timeTypeOptions.value = timeTypeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

// 多选输入框
:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>