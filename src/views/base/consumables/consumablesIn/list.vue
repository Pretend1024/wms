<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
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
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('billNoList')">
                            <canonicalInput v-model:listName="formData.billNoList"
                                :placeholder="getPlaceholder('billNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col>
                        <el-form-item :label="getLabel('trackingNoList')">
                            <canonicalInput v-model:listName="formData.trackingNoList"
                                :placeholder="getPlaceholder('trackingNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col> -->
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('inbound') }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
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
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
                <template #consumablesCode="{ row }">
                    {{ row.consumablesCode }}({{ row.consumablesName }})
                </template>
                <template #isPublic="{ row }">
                    <span :style="{ color: row.isPublic ? 'green' : 'red' }">{{ row.isPublic ? '是' : '否' }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions"
                :consumablesOptions="consumablesOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="514">
        </exportDialog>
    </div>
</template>
<script setup name="耗材入库">
import { Share, Plus } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getBasicConsumablesInventoryInListApi, addBasicConsumablesInventoryInApi, updBasicConsumablesInventoryApi, getBasicConsumablesListEnumApi } from '@/api/baseApi/consumables.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import AddForm from './add.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', label: '耗材类型', prop: 'consumablesCode', options: [] },
    {
        type: 'select', label: '是否公用', prop: 'isPublic', options: [
            { label: '是', value: true },
            { label: '否', value: false }
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    consumablesCode: '',
    warehouseCode: '',
    customerCode: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    billNoList: [],
    // trackingNoList: [],
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
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '入库单号', prop: 'billNo', width: '145', fixed: 'left', sortable: true },
    // { label: '跟踪单号', prop: 'trackingNo', width: '150', fixed: 'left', sortable: true },
    { label: '耗材条码', prop: 'consumablesBarcode', width: '190', sortable: true },
    { label: '耗材类型', prop: 'consumablesCode', width: '200', sortable: true, slot: 'consumablesCode' },
    { label: '是否公用', prop: 'isPublic', width: '125', slot: 'isPublic' },
    { label: '成本单价', prop: 'costPrice', width: '130', sortable: true },
    { label: '入库数量', prop: 'quantity', width: '140', sortable: true },
    { label: '成本总价', prop: 'totalCostPrice', width: '135', sortable: true },
    { label: '备注', prop: 'remark', width: '250' },

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
// 编辑
const handleEdit = (row) => {
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {
        id: null,
        consumablesBarcode: '',
        consumablesCode: '',
        consumablesName: '',
        customerCode: '',
        quantity: '',
        remark: '',
        warehouseCode: '',
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_consumables_consumablesIn_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

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
        let res;
        if (addData.value.id) {
            res = await updBasicConsumablesInventoryApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addBasicConsumablesInventoryInApi(addData.value);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        smartAlert(res.msg, res.success, 1000)
        loading.value = false;
        bodyLoading.close();
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
    const res = await getBasicConsumablesInventoryInListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    footer.value = res.data.footer[0]
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 仓库下拉框数据
const warehouseOptions = ref([])
// 耗材类型
const consumablesOptions = ref([])
// 筛选客户代码
const customerOptions = ref([]);

onMounted(async () => {
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))

    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))

    const consumablesOptionsRes = await getBasicConsumablesListEnumApi();
    consumablesOptions.value = consumablesOptionsRes.data.map(item => ({
        value: item.code,
        label: item.name + '(' + item.code + ')'
    }));
    formConfig.value[0].options = consumablesOptions.value
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>