<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('codeList')">
                            <canonicalInput v-model:listName="formData.codeList"
                                :placeholder="getPlaceholder('codeList')" clearable>
                            </canonicalInput>
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
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleDel(10)" :icon="Edit">{{ getButtonText('enable')
                    }}</el-button>
                    <el-button type="danger" @click="handleDel(20)" :icon="Edit">{{ getButtonText('disable')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleLog(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('log') }}</span>
                        </div>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #channelSelect="{ row }">
                    <span>{{ row.channelSelect == 1 ? '一对一' : '取价格低者' }}</span>
                </template>
                <template #weight="{ row }">
                    <span>{{ row.minWeight && row.maxWeight ? row.minWeight + '-' + row.maxWeight : '' }}</span>
                </template>
                <template #volume="{ row }">
                    <span>{{ row.minVolume && row.maxVolume ? row.minVolume + '-' + row.maxVolume : '' }}</span>
                </template>
                <template #day="{ row }">
                    <span>{{ row.minDay && row.maxDay ? row.minDay + '-' + row.maxDay : '' }}</span>
                </template>
            </hydTable>
        </div>
        <batchOperationn :dialogTitle="'状态更改结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'产品'" :successValue="delDataMsg" @close="delColse" :promptMessage="promptMessage" />
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" title="日志" width="1300" align-center destroy-on-close>
            <div style="height: 500px;">
                <LogForm :formData="addData"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup name="物流产品">
import { Plus, Tickets, Edit } from '@element-plus/icons-vue'
import { getProductShipwayPageApi, getProductShipwayStatusEnumApi, getProductShipwayTypeEnumApi, setProductShipwayShipwayUpdateStatusApi, getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import LogForm from '@/components/table/logTableById.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'input', label: '产品名称', prop: 'name' },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'select', label: '运输方式', prop: 'typeId', options: [] },
    { type: 'select', label: '承运商', prop: 'carrierCode', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({
    num: '',
    statusId: '',
    orgId: '',
    departmentId: '',
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
    departmentOptions.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '产品代码', prop: 'code', width: '155', fixed: 'left', sortable: true },
    { label: '产品名称', prop: 'productName', width: '140', fixed: 'left', slot: 'name', sortAlias: 'name' },
    { label: '状态', prop: 'statusName', width: '125', sortable: true, slot: 'statusName' },
    { label: '运输方式', prop: 'typeName', width: '180', sortable: true },
    { label: '渠道模式', prop: 'channelSelect', width: '180', slot: 'channelSelect', sortable: true },
    { label: '承运商', prop: 'carrierName', width: '115', sortable: true },
    { label: '重量范围(实重KG)', prop: 'weight', width: '240', slot: 'weight' },
    { label: '体积范围(M³)', prop: 'volume', width: '220', slot: 'volume' },
    { label: '时效范围(天数)', prop: 'day', width: '240', slot: 'day' },
    { label: '保险服务', prop: 'insuranceName', width: '200' },
    { label: '签名服务', prop: 'signatureName', width: '200' },
    { label: '上传面单', prop: 'uploadWaybillName', width: '200' },
    { label: '渠道描述', prop: 'description', width: '200' },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
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
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑物流产品',
        params: { id: row.id, name: row.name },
    })
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '物流产品详情',
        params: { id: row.id, name: row.name },
    })
}
// 日志
const handleLog = async (row) => {
    addData.value = { ...row };
    centerDialogVisible.value = true;
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    router.push('/product/shipway/shipway/add')
}
// 删除
const delData = ref([]);
const delDataMsg = ref('删除成功')
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
        `是否要${statusId == 10 ? '启用' : '停用'}${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;

            delData.value = [];
            promptMessage.value = '操作中...'
            delDataMsg.value = '更新状态成功'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await setProductShipwayShipwayUpdateStatusApi({ id: selectionRows.value[i].id, statusId });
                delData.value.push({
                    id: selectionRows.value[i].code + '-' + selectionRows.value[i].name,
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

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
    })
    tableData.value = res.data.rows
    console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 部门数据
const departmentOptions = ref([]);

onMounted(async () => {
    // 获取状态菜单
    const res = await getProductShipwayStatusEnumApi()
    formConfig.value[1].options = res.data.map((item) => ({
        value: item.id,
        label: item.name
    }));
    // 获取运输方式菜单
    const res1 = await getProductShipwayTypeEnumApi()
    formConfig.value[2].options = res1.data.map((item) => ({
        value: item.id,
        label: item.name
    }));
    // 获取承运商
    const res2 = await getProductShipwayBrandListApi()
    formConfig.value[3].options = res2.data.map((item) => ({
        value: item.code,
        label: item.name
    }));
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshShipwayList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshShipwayList = false
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>