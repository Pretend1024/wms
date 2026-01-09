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
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #isDanger="{ row }">
                    <el-tag v-if="row.isDanger" type="danger">是</el-tag>
                    <el-tag v-else type="success">否</el-tag>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData"
                :warehouseTypeEnumOptions="warehouseTypeEnumOptions"
                :warehouseStatusEnumOptions="warehouseStatusEnumOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel"> 取消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name='仓库'>
import { Plus } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getWhWarehouseListApi, getWhWarehouseTypeEnumApi, getWhWarehouseStatusEnumApi, addWhWarehouseApi, updWhWarehouseApi } from '@/api/baseApi/wh.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'select', label: '类型', prop: 'typeId', options: [] },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
]);

// 初始化表单数据
const initValues = ref({
    typeId: '',
    statusId: ''
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
const tableData = shallowRef([]);
const columns = ref([
    { label: '仓库代码', prop: 'code', width: '180', fixed: 'left', sortable: true },
    { label: '仓库名称', prop: 'name', width: '190', fixed: 'left', sortable: true },
    { label: '仓库类型', prop: 'typeName', width: '180', sortable: true, sortAlias: 'typeId' },
    { label: '状态', prop: 'statusName', width: '125', sortable: true, slot: 'statusName', sortAlias: 'statusId' },
    { label: '货型', prop: 'cargoSizeName', width: '135', sortable: true, sortAlias: 'cargoSizeId' },
    { label: '危险品仓', prop: 'isDanger', width: '125', sortable: true, slot: 'isDanger' },
    { label: '平方米', prop: 'squareMeter', width: '100', sortable: true },
    { label: '时区', prop: 'timeZoneName', width: '125' },
    { label: '国家名称', prop: 'countryName', width: '140' },
    { label: '省份', prop: 'province', width: '120' },
    { label: '城市', prop: 'city', width: '120' },
    { label: '区', prop: 'county', width: '120' },
    { label: '街道地址', prop: 'addressLine1', width: '200' },
    { label: '街道地址2', prop: 'addressLine2', width: '200' },
    { label: '邮编', prop: 'postalCode', width: '150' },
    { label: '收件人名', prop: 'receiverName', width: '120' },
    { label: '收件人电话', prop: 'phone', width: '150' },
    { label: '备注', prop: 'remark', width: '150' },
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
    typeId: '',
    code: '',
    name: '',
    squareMeter: '',
    countryCode: '',
    province: '',
    city: '',
    county: '',
    addressLine1: '',
    addressLine2: '',
    timeZoneId: '',
    postalCode: '',
    receiverName: '',
    phone: '',
    remark: '',
    statusId: '',
    isDanger: null
});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_wh_warehouse_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        typeId: '',
        code: '',
        name: '',
        squareMeter: '',
        countryCode: '',
        province: '',
        city: '',
        county: '',
        addressLine1: '',
        addressLine2: '',
        timeZoneId: '',
        postalCode: '',
        receiverName: '',
        phone: '',
        remark: '',
        statusId: '',
        isDanger: null
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑按钮
const handleEdit = async (row) => {
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res = null;
        if (dialogMode.value === 'upd') {
            res = await updWhWarehouseApi(addData.value);
        } else {
            res = await addWhWarehouseApi(addData.value);
        }
        smartAlert(res.msg, res.success, 1000);
        loading.value = false;
        if (res.success) {
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            centerDialogVisible.value = false;
        }
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
    const res = await getWhWarehouseListApi({
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
// 获取枚举数据
const warehouseTypeEnumOptions = ref([]);
const warehouseStatusEnumOptions = ref([]);
onMounted(async () => {
    const warehouseTypeEnumRes = await getWhWarehouseTypeEnumApi()
    formConfig.value[0].options = warehouseTypeEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    warehouseTypeEnumOptions.value = formConfig.value[0].options

    const warehouseStatusEnumRes = await getWhWarehouseStatusEnumApi()
    formConfig.value[1].options = warehouseStatusEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    warehouseStatusEnumOptions.value = formConfig.value[1].options
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>