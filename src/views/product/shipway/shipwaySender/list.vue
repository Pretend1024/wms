<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('configTypeId')" class="compact-item">
                            <el-select v-model="formData.configTypeId" :placeholder="getPlaceholder('configTypeId')"
                                clearable>
                                <el-option v-for="item in configTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('warehouseId')" class="compact-item">
                            <el-select v-model="formData.warehouseId" :placeholder="getPlaceholder('warehouseId')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('shipwayId')" class="compact-item">
                            <el-select v-model="formData.shipwayId" :placeholder="getPlaceholder('shipwayId')" clearable
                                filterable>
                                <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')" class="compact-item">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">
                        {{ getButtonText('del') }}
                    </el-button>
                </template>
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)" v-permission="'edit'">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode ? row.customerCode + '(' + row.customerName + ')' : '' }}
                </template>
                <template #country="{ row }">
                    {{ row.countryCode }}({{ row.countryName }})
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1000" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData" :configTypeOptions="configTypeOptions"
                :customerOptions="customerOptions" :warehouseOptions="warehouseOptions"
                :productOptions="productOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('product_shipway_shipwaySender_list.addressLabel')" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="回邮地址">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, shallowRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue'; // Template中未直接使用，可能在custom-form插槽依赖
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getProductShipwayPostApi,
    getProductShipwayConfigTypeEnumApi,
    getProductShipwayListApi,
    addProductShipwayPostApi,
    updProductShipwayPostApi,
    delProductShipwayPostApi
} from '@/api/productApi/shipway.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
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

// 批量删除相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

// 下拉选项数据
const configTypeOptions = ref([]);
const customerOptions = ref([]);
const warehouseOptions = ref([]);
const productOptions = ref([]);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '配置类型', prop: 'configTypeName', width: '150', sortable: true },
    { label: '仓库代码', prop: 'warehouseCode', width: '120', sortable: true },
    { label: '物流产品', prop: 'shipwayCode', width: '150', sortable: true },
    { label: '客户', prop: 'customerCode', width: '150', sortable: true, slot: 'customer' },
    { label: '国家', prop: 'countryCode', width: '120', sortable: true, slot: 'country' },
    { label: '省份', prop: 'province', width: '120' },
    { label: '城市', prop: 'city', width: '120' },
    { label: '区', prop: 'county', width: '120' },
    { label: '地址', prop: 'addressLine1', width: '200', sortable: true },
    { label: '备用地址', prop: 'addressLine2', width: '200', sortable: true },
    { label: '门牌号', prop: 'houseNumber', width: '120' },
    { label: '邮编', prop: 'postalCode', width: '100', sortable: true },
    { label: '公司名', prop: 'company', width: '175', sortable: true },
    { label: '联系人名', prop: 'name', width: '150', sortable: true },
    { label: '邮箱', prop: 'email', width: '220', sortable: true },
    { label: '证件号码', prop: 'identityNumber', width: '200', sortable: true },
    { label: '联系电话', prop: 'phoneNumber1', width: '150' },
    { label: '备用电话', prop: 'phoneNumber2', width: '150' },
    { label: '备注', prop: 'remark', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120', sortable: true },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`product_shipway_shipwaySender_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayPostApi({
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
const handleAdd = async () => {
    addData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 批量删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('product_shipway_shipwaySender_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('product_shipway_shipwaySender_list.confirmDelete', { count: selectionRows.value.length }),
        t('product_shipway_shipwaySender_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('product_shipway_shipwaySender_list.processing');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delProductShipwayPostApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].province + selectionRows.value[i].city + selectionRows.value[i].county,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('product_shipway_shipwaySender_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('product_shipway_shipwaySender_list.deleteCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        const data = { ...addData.value };
        // 根据配置类型清理无关字段
        if (data.configTypeId === 1) {
            data.customerCode = '';
            data.shipwayId = '';
        }
        if (data.configTypeId === 2) {
            data.customerCode = '';
        }
        if (data.configTypeId === 3) {
            data.shipwayId = '';
        }

        if (addData.value.id) {
            res = await updProductShipwayPostApi(data);
        } else {
            res = await addProductShipwayPostApi(data);
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

/* 5. 辅助方法 */

// 表格选中
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
};

// 行点击
const handleRowClick = (row) => {
    selection.value = row;
};

// 分页变化
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
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

// 批量删除弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [typeRes, custRes, whRes, productRes] = await Promise.all([
        getProductShipwayConfigTypeEnumApi(),
        getCustomerLikeQueryApi({ keyword: '*' }),
        getWhWarehouseApi(),
        getProductShipwayListApi()
    ]);

    // 配置类型
    configTypeOptions.value = typeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }));

    // 客户代码
    customerOptions.value = custRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));

    // 仓库
    warehouseOptions.value = whRes.data.map(item => ({
        value: item.id,
        label: item.code + '-' + item.name,
        countryCode: item.countryCode
    }));

    // 物流产品
    productOptions.value = productRes.data.map(item => ({
        value: item.id,
        label: item.name + "(" + item.carrierName + ")"
    }));
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>