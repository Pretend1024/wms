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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
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
                        <div class="cursor-pointer" @click="handleConfigure(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('config') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleTest(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('test') }}</span>
                        </div>
                    </div>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData"
                :projectTypeOptions="projectTypeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 测试弹窗 -->
        <testDialog ref="zipcodeDialog" :regionProjectId="regionProjectId"></testDialog>
    </div>
</template>

<script setup name='分区模板'>
import { ref, computed, onMounted } from 'vue';
import { Plus } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import router from '@/router/index.js'
import { ElMessage, ElMessageBox } from 'element-plus';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getProductShipwayRegionProjectApi, addProductShipwayRegionProjectApi, getProductShipwayRegionProjectTypeEnumApi, updProductShipwayRegionProjectApi } from "@/api/productApi/shipway.js";
import testDialog from './testDialog.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '模板名称', prop: 'name', },
    { type: 'select', label: '模板类型', prop: 'typeId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    customerCode: '',
    platformSkuList: [],
    skuList: [],
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
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
// 表格数据与列配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '模板名称', prop: 'name', width: '180', sortable: true },
    { label: '模板类型', prop: 'typeName', width: '180', sortable: true },
    { label: '备注', prop: 'remark', width: '300' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '230', fixed: 'right', slot: 'customBtn' }
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
    name: '',
    remark: '',
    sortNo: null,
});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`product_price_regionProject_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        name: '',
        remark: '',
        typeId: null,
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑按钮
const handleEdit = (row) => {
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};
// 配置按钮
const handleConfigure = (row) => {
    router.push({
        name: '配置分区',
        params: { id: row.id, name: row.name },
    })
}
// 测试按钮
const zipcodeDialog = ref(null);
const regionProjectId = ref(null);
const handleTest = (row) => {
    regionProjectId.value = row.id;
    zipcodeDialog.value.openDialog();
}


// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updProductShipwayRegionProjectApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addProductShipwayRegionProjectApi(addData.value);
        }
        if (res.success) {
            ElMessage({
                type: 'success',
                message: res.msg,
            });
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);

        } else {
            loading.value = false;
            centerDialogVisible.value = true;
            ElMessageBox.alert(res.msg, '提醒', {
                confirmButtonText: '确定',
                type: 'warning'
            });
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

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayRegionProjectApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = Object.freeze(res.data.rows);
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
// 分区模板类型枚举数据

const projectTypeOptions = ref([]);
onMounted(async () => {
    const res = await getProductShipwayRegionProjectTypeEnumApi();
    projectTypeOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.id
    }));
    formConfig.value[1].options = projectTypeOptions.value;
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>