<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <!-- <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{getButtonText ('del') }}</el-button> -->
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDel(row)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>{{ getButtonText('del') }}</span>
                        </div>
                    </div>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #date="{ row }">
                    <span>{{ row.minDate + " 至 " + row.maxDate }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :itemDataId="itemDataId" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup name="燃油模板">
import { Plus, Delete } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { getProductShipwayFuelApi, addProductShipwayFuelApi, updProductShipwayFuelApi, delProductShipwayFuelApi } from '@/api/productApi/shipway.js'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '模板名称', prop: 'name' },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

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
// 表格列配置
const columns = ref([
    { label: '模板名称', prop: 'name', width: '180', fixed: 'left', sortable: true },
    { label: '燃油记录', prop: 'fuelRecord', width: '145', sortable: true },
    { label: '生效日期', prop: 'date', width: '250', sortable: true, slot: 'date' },
    { label: '燃油费率(%)', prop: 'rate', width: '150', sortable: true },
    { label: '备注', prop: 'remark', width: '400' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '135', fixed: 'right', slot: 'customBtn' }
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
// 弹窗
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`product_price_fuel_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    console.log('当前表单数据:', addData.value);
    console.log('当前表单数据:', childFormRef.value.getFuelTableData());
    try {
        await childFormRef.value.validate();
        loading.value = true;
        const data = {
            ...addData.value,
            fuelDetailAddDTOList: childFormRef.value.getFuelTableData()
        };
        let res;
        if (dialogMode.value === 'upd') {
            res = await updProductShipwayFuelApi(data);
        } else {
            res = await addProductShipwayFuelApi(data);
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
const itemDataId = ref(null); // 用于编辑时传递的行数据 ID
// 编辑
const handleEdit = (row) => {
    itemDataId.value = row.id; // 设置要编辑的行数据 ID
    addData.value = { ...row }; // 传递当前行数据到表单
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 删除
const handleDel = async (row) => {
    ElMessageBox.confirm(
        `是否要删除该条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await delProductShipwayFuelApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000)
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
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
    addData.value = {
        name: '',
        fuelLog: '',
    }
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayFuelApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = (res.data.rows || []).map(item => ({
        ...item,
        minDate: item.minDate?.split(' ')[0] || item.minDate,
        maxDate: item.maxDate?.split(' ')[0] || item.maxDate,
        rate: item.rate !== null && !isNaN(item.rate) ? item.rate * 100 : item.rate
    }));
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

.ellipsis-link {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
</style>