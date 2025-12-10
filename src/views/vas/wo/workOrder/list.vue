<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <!-- 公司 -->
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <!-- 客户 -->
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 工单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('workOrderNo')">
                            <canonicalInput v-model:listName="formData.workOrderNoList"
                                :placeholder="getPlaceholder('workOrderNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 业务类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('relatedBizType')">
                            <el-select v-model="formData.relatedBizType" :placeholder="getPlaceholder('relatedBizType')"
                                clearable>
                                <el-option v-for="item in bizTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 关联单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('relatedBizNo')">
                            <canonicalInput v-model:listName="formData.relatedBizNoList"
                                :placeholder="getPlaceholder('relatedBizNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 优先级 -->
                    <el-col>
                        <el-form-item :label="getLabel('priorityId')">
                            <el-select v-model="formData.priorityId" :placeholder="getPlaceholder('priorityId')"
                                clearable>
                                <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 一级问题 -->
                    <el-col>
                        <el-form-item :label="getLabel('typeId')">
                            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" clearable>
                                <el-option v-for="item in workOrderTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否解决 -->
                    <el-col>
                        <el-form-item :label="getLabel('isSolved')">
                            <el-select v-model="formData.isSolved" :placeholder="getPlaceholder('isSolved')" clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 与我有关 -->
                    <el-col>
                        <el-form-item :label="getLabel('isRelated')">
                            <el-select v-model="formData.isRelated" :placeholder="getPlaceholder('isRelated')"
                                clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
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
                            <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                                getButtonText('del')
                            }}</el-button>
                            <!-- <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                            }}</el-button> -->
                        </div>
                    </div>
                </template>

                <template #workOrderNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.workOrderNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span v-show="row.statusId != 1" class="copyText" @click="handleInfo(row)">{{ row.workOrderNo
                        }}</span>
                        <span v-show="row.statusId == 1" class="copyText" style="color: green;"
                            @click="handleEdit(row)">{{ row.workOrderNo
                            }}</span>
                    </div>
                </template>

                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>

                <template #employeeNum="{ row }">
                    <span>{{ row.employeeNum }} {{ row.employeeName ? `(${row.employeeName})` : '' }}</span>
                </template>

                <template #isSolved="{ row }">
                    <span :style="{ color: row.isSolved ? 'green' : 'red' }">{{ row.isSolved ? '是' : '否' }}</span>
                </template>

                <template #isTimeout="{ row }">
                    <span :style="{ color: row.isTimeout ? 'red' : 'green' }">{{ row.isTimeout ? '是' : '否' }}</span>
                </template>

                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId !== 30 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>

                <template #isClosed="{ row }">
                    <span :style="{ color: row.isClosed ? 'red' : 'green' }">{{ row.isClosed ? '是' : '否' }}</span>
                </template>

                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer"
                            @click="(row.statusId == 10 || row.statusId == 20) && handleEdit(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10 || row.statusId == 20) }">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'工单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="工单">
import * as api from '@/api/vasApi/wo.js';
import { Plus, Delete, Share, Edit } from '@element-plus/icons-vue' // 补充Edit图标引入
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'

import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'

const refreshStore = useRefreshStore()

// 搜索表单配置项
const formConfig = ref([
    { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({
    orgId: [],
})

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
    statusIdsArr.value = []
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}

// 表格数据
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '工单号', prop: 'workOrderNo', width: '180', fixed: 'left', sortable: true, slot: 'workOrderNo' },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '一级问题', prop: 'typeName', width: '120', sortable: true },
    { label: '二级问题', prop: 'secondTypeName', width: '140', sortable: true },
    { label: '关联业务类型', prop: 'relatedBizTypeName', width: '165', sortable: true },
    { label: '关联单号', prop: 'relatedBizNo', width: '180' },
    { label: '标题', prop: 'title', width: '165', sortable: true },
    { label: '当前处理人', prop: 'employeeNum', width: '180', sortable: true, slot: 'employeeNum' },
    { label: '联系人', prop: 'contact', width: '120', sortable: true },
    { label: '手机号', prop: 'phone', width: '150', sortable: true },
    { label: '是否解决', prop: 'isSolved', width: '120', slot: 'isSolved', sortable: true },
    { label: '评分', prop: 'score', width: '90', sortable: true },
    { label: '反馈', prop: 'feedback', width: '180' },
    { label: '最新处理时间', prop: 'handledTime', width: '200', sortable: true },
    { label: '是否超时', prop: 'isTimeout', width: '120', sortable: true, slot: 'isTimeout' },
    { label: '超时时间', prop: 'overtime', width: '200', sortable: true },
    { label: '状态', prop: 'statusName', width: '200', sortable: true, slot: 'statusName' },
    { label: '内容', prop: 'content', width: '200' },
    { label: '优先级', prop: 'priorityName', width: '100', sortable: true },
    { label: '提醒时间', prop: 'reminderTime', width: '200', sortable: true },
    { label: '是否关闭', prop: 'isClosed', width: '120', sortable: true, slot: 'isClosed' },
    { label: '关闭时间', prop: 'closedTime', width: '200', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    // { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 0
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
}

const handleRowClick = (row) => {
    // console.log('点击的行数据：', row)
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 排序条件
const orderBy = ref('')
const handleTableSort = (sortString) => {
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑工单', // 修正路由名称
        params: { id: row.id, name: row.workOrderNo },
    })
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '工单详情', // 修正路由名称
        params: { id: row.id, name: row.workOrderNo },
    })
}

// 删除
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        loading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...'
        for (let i = 0; i < selectionRows.value.length; i++) {
            // 注意：这里假设 api.deleteWorkOrderApi 存在，需根据实际 wo.js 调整
            const res = await api.delWorkOrderByIdApi({ id: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].workOrderNo,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消' });
    });
};

const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus()
};

// 导出
const handleExport = () => {
    // 导出逻辑
    ElMessage.info('导出功能开发中')
}

// 选择的行数据
const selectionRows = ref([])

// 添加按钮
const handleAdd = async () => {
    router.push('/vas/wo/workOrder/add')
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await api.getWorkOrderPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        orgId: initValues.value.orgId[initValues.value.orgId.length - 1]
    })
    tableData.value = res.data.rows
    footer.value = res.data.footer ? res.data.footer[0] : {}
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
        orgId: initValues.value.orgId ? initValues.value.orgId[initValues.value.orgId.length - 1] : null
    }
    delete data.statusIdList
    const res = await api.getCountGroupByStatusApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...(initValues.value.statusIdList || [])]
}

const statusIdsList = ref([])
const statusIdsArr = ref([])
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

const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            if (cascaderRef.value) cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};

// 下拉选项变量定义
const customerOptions = ref([]);
const bizTypeOptions = ref([]); // 业务类型选项
const priorityOptions = ref([]); // 优先级选项
const workOrderTypeOptions = ref([]); // 工单类型选项 (预留)

onMounted(async () => {
    // 1. 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);

    // 2. 获取客户数据
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))

    // 3. 获取业务类型 (替代原来的 FirstLeg)
    const bizTypeRes = await api.getBizTypeEnumApi();
    bizTypeOptions.value = bizTypeRes.data.map(item => ({ label: item.name, value: item.id }));

    // 4. 获取优先级 (替代原来的 Business)
    const priorityRes = await api.getPriorityEnumApi();
    priorityOptions.value = priorityRes.data.map(item => ({ label: item.name, value: item.id }));

    // 5. 获取工单类型 (如需在其他地方使用)
    const typeRes = await api.getWorkOrderTypeListApi();
    // 假设返回结构为树形或列表，此处暂存
    workOrderTypeOptions.value = typeRes.data || [];
})

// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshWorkOrderList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshWorkOrderList = false
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}

.copyDiv {
    cursor: pointer;
    color: var(--el-color-primary);
}
</style>