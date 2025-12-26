<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('feeMainTypeId')" class="compact-item">
                            <el-select v-model="formData.feeMainTypeId" :placeholder="getPlaceholder('feeMainTypeId')"
                                clearable @change="(val) => handleFilterMainTypeChange(val, formData)">
                                <el-option v-for="item in feeMainTypeEnum" :key="item.id" :label="item.label"
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                        getButtonText('del') }}</el-button>
                </template>
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
                <template #isMandatory="{ row }">
                    <span :style="{ color: row.isMandatory ? 'green' : 'red' }">{{ row.isMandatory ? '是' : '否' }}</span>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="800" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :initData="dialogMode === 'add' ? {} : editInitData"
                :feeMainTypeEnum="feeMainTypeEnum" :priceDimensionEnum="priceDimensionEnum" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'费用小类-费用单位'"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="计费项目">
import { ref, computed, onMounted, nextTick, shallowRef } from 'vue';
import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

// 接口导入
import { getFeeMainTypeEnumApi, getFeeTypeEnumApi } from '@/api/financeApi/receivables.js';
import { getFeeUnitTypeEnumApi, getFeePriceDimensionEnumApi, getProductShipwayPriceItemPageApi, addProductShipwayPriceItemApi, updProductShipwayPriceItemApi, delProductShipwayPriceItemApi } from '@/api/productApi/shipway.js';

// 工具与组件导入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'; // 引入批量操作组件
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// -------------------------- 核心数据定义 --------------------------
const editInitData = ref({});
const feeMainTypeEnum = ref([]);
const priceDimensionEnum = ref([]);

// -------------------------- 搜索表单配置 --------------------------
const formConfig = ref([
    { type: 'select', label: '费用小类', prop: 'feeSubTypeId', options: [] },
    { type: 'select', label: '费用单位', prop: 'feeUnitTypeId', options: [] },
]);

const initValues = ref({
    feeMainTypeId: '',
    feeSubTypeId: '',
    feeUnitTypeId: ''
});

// 处理搜索栏的大类联动
const handleFilterMainTypeChange = async (val, formData) => {
    formData.feeSubTypeId = '';
    formData.feeUnitTypeId = '';
    if (!val) {
        formConfig.value[0].options = [];
        formConfig.value[1].options = [];
        return;
    }
    try {
        const [subTypeRes, unitTypeRes] = await Promise.all([
            getFeeTypeEnumApi({ mainTypeId: val }),
            getFeeUnitTypeEnumApi({ mainTypeId: val })
        ]);
        formConfig.value[0].options = subTypeRes.data.map(item => ({ label: item.name, value: item.id }));
        formConfig.value[1].options = unitTypeRes.data.map(item => ({ label: item.name, value: item.id }));
    } catch (error) {
        console.error('加载联动数据失败', error);
    }
};

const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    formConfig.value[0].options = [];
    formConfig.value[1].options = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// -------------------------- 表格配置 --------------------------
const tableData = shallowRef([]);
const columns = ref([
    { label: '费用大类', prop: 'feeMainTypeName', width: '120', sortable: true, sortAlias: 'feeMainTypeId' },
    { label: '费用小类', prop: 'feeSubTypeName', width: '120', sortable: true, sortAlias: 'feeSubTypeId' },
    { label: '费用单位', prop: 'feeUnitTypeName', width: '125', sortable: true },
    { label: '计费条件', prop: 'chargeCondition', width: '150' },
    { label: '条件描述', prop: 'conditionDesc', width: '200' },
    { label: '计费维度', prop: 'priceDimensionName', width: '120', sortable: true },
    { label: '是否必选', prop: 'isMandatory', width: '125', slot: 'isMandatory', sortable: true },
    { label: '排序', prop: 'sortNo', width: '80', sortable: true },
    { label: '备注', prop: 'remark', width: '150' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
]);

const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 });
const loading = ref(true);
const selectionRows = ref([]); // 批量选择数据
const selection = ref({});
const orderBy = ref('');

const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
};

const handleRowClick = (row) => {
    selection.value = row;
};

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true;
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(currentPage, pageSize, orderBy.value);
};

const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, sortString);
};

// -------------------------- 弹窗逻辑 --------------------------
const centerDialogVisible = ref(false);
const childFormRef = ref(null);
const dialogMode = ref('add');

const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const dialogTitle = computed(() => dialogMode.value === 'add' ? t(`product_price_priceItem_list.addTitle`) : t(`product_price_priceItem_list.addTitle`));

const handleAdd = () => {
    editInitData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleEdit = (row) => {
    editInitData.value = JSON.parse(JSON.stringify(row));
    dialogMode.value = 'upd';
    nextTick(() => {
        centerDialogVisible.value = true;
    });
};

const handleDialogCancel = () => {
    centerDialogVisible.value = false;
    nextTick(() => {
        childFormRef.value?.resetFields();
    });
};

const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    let bodyLoading = null;
    try {
        await childFormRef.value.validate();
        const formData = childFormRef.value.getFormData();
        bodyLoading = ElLoading.service({ lock: true, text: 'Saving...' });
        let res;
        if (formData.id) {
            res = await updProductShipwayPriceItemApi(formData);
        } else {
            res = await addProductShipwayPriceItemApi(formData);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res?.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
    } catch (error) {
        console.error('Dialog confirm error:', error);
    } finally {
        if (bodyLoading) bodyLoading.close();
    }
};

// -------------------------- 删除功能 (参考批量操作组件) --------------------------
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');

// 仅处理批量删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要删除的数据！');
        return;
    }

    ElMessageBox.confirm(
        `是否要删除选中的${selectionRows.value.length}条数据?`,
        '提醒',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        loading.value = true;
        delData.value = [];
        promptMessage.value = '操作中...';
        delDialogVisible.value = true;

        // 批量删除循环
        for (const row of selectionRows.value) {
            try {
                const res = await delProductShipwayPriceItemApi({ id: row.id });
                delData.value.push({
                    id: row.feeSubTypeName + ' - ' + row.feeUnitTypeName,
                    msg: res?.msg || '删除成功',
                    success: res?.success || false
                });
            } catch (error) {
                delData.value.push({
                    id: row.id,
                    msg: '请求异常',
                    success: false
                });
            }
        }
        promptMessage.value = '操作完成！';
    }).catch(() => {
        ElMessage.info('已取消');
    });
};

const delColse = () => {
    delDialogVisible.value = false;
    loading.value = false; // 确保关闭表格loading
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// -------------------------- 数据加载 --------------------------
const getList = async (currentPage, pageSize, orderByStr) => {
    try {
        const res = await getProductShipwayPriceItemPageApi({
            page: currentPage,
            pageSize: pageSize,
            orderBy: orderByStr,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = Object.freeze(res.data.rows);
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
    } catch (error) {
        console.error('列表加载失败', error);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    const [mainTypeRes, dimRes] = await Promise.all([
        getFeeMainTypeEnumApi(),
        getFeePriceDimensionEnumApi()
    ]);
    feeMainTypeEnum.value = mainTypeRes.data.map(item => ({ label: item.name, value: item.id }));
    priceDimensionEnum.value = dimRes.data.map(item => ({ label: item.name, value: item.id }));
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>