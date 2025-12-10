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
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- sku -->
                    <el-col>
                        <el-form-item :label="getLabel('skuList')">
                            <canonicalInput v-model:listName="formData.skuList" :placeholder="getPlaceholder('skuList')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- SN -->
                    <el-col>
                        <el-form-item :label="getLabel('sn')">
                            <canonicalInput v-model:listName="formData.snList" :placeholder="getPlaceholder('sn')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 状态 -->
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 入库单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('inOrderNoList')">
                            <canonicalInput v-model:listName="formData.inOrderNoList"
                                :placeholder="getPlaceholder('inOrderNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 出库单号 -->
                    <el-col>
                        <el-form-item :label="getLabel('outOrderNoList')">
                            <canonicalInput v-model:listName="formData.outOrderNoList"
                                :placeholder="getPlaceholder('outOrderNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 库位号 -->
                    <el-col>
                        <el-form-item :label="getLabel('locationCodeList')">
                            <canonicalInput v-model:listName="formData.locationCodeList"
                                :placeholder="getPlaceholder('locationCodeList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :footer="footer" :tableData="tableData" :columns="columns"
                :pagination="pagination" :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{ getButtonText('del') }}</el-button>
                    <el-button type="success" @click="handleImportAdd" :icon="UploadFilled">{{ getButtonText('import')
                    }}</el-button>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <!-- 编辑 -->
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>

                <template #status="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1000" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :warehouseOptions="warehouseOptions"
                :customerOptions="initialFilteredOptions" :productOptions="productOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="305">
        </exportDialog>

        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'SN'"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="SN库存">
import { getInventorySnStatusApi, getInventorySnPageApi, delInventorySnDeleteByIdApi, addInventorySnAddApi, updInventorySnUpdateByIdApi } from '@/api/inventoryApi/inventory.js'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { Share, Plus, Delete, UploadFilled } from '@element-plus/icons-vue'
import router from '@/router/index.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false, offsetDays: 30 },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = data;
    // 判断是否有orgId，没有则删除
    if (!data.orgId) {
        delete initValues.value.orgId;
    } else {
        initValues.value.orgId = data.orgId[data.orgId.length - 1]
    }

    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerCode', width: '200', slot: 'customer', fixed: 'left' },
    { label: '入库单号', prop: 'inOrderNo', width: '180' },
    { label: 'SKU', prop: 'sku', width: '180' },
    { label: '条码', prop: 'barcode', width: '180' },
    { label: '序列号', prop: 'sn', width: '180' },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'status' },
    { label: '收货时间', prop: 'receiptTime', width: '200', sortable: true },
    { label: '上架时间', prop: 'inshelfTime', width: '200', sortable: true },
    { label: '库龄(天数)', prop: 'instockDays', width: '130' },
    { label: '库位号', prop: 'locationCode', width: '130' },
    { label: '出库单号', prop: 'outOrderNo', width: '180', sortable: true },
    { label: '发货时间', prop: 'shippedTime', width: '200', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

// 弹窗
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`instock_inventory_inventorySn_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

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
        const data = { ...addData.value };
        if (addData.value.id) {
            res = await updInventorySnUpdateByIdApi(data);
            console.log('修改数据:', res);
        } else {
            res = await addInventorySnAddApi(data);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
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
// 编辑
const handleEdit = (row) => {
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
    addData.value = {}
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}

// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
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
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delInventorySnDeleteByIdApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].sn,
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
                message: '已取消删除'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: {
            typeId: 305, typeName: '导入创建SN库存'
        },
    })
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const requestData = {
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...initValues.value
    };
    const res = await getInventorySnPageApi(requestData);
    tableData.value = res.data.rows;
    footer.value = res.data.footer[0];
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
// 仓库下拉框数据
const warehouseOptions = ref([])
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
const initialFilteredOptions = ref([])
// 状态
const statusOptions = ref([])

onMounted(async () => {
    // 客户数据
    const customerRes = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
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
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    // 状态
    const statusRes = await getInventorySnStatusApi()
    statusOptions.value = statusRes.data
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.tags {
    display: flex;
    font-size: 17px;
    color: #474849;

    .tagsItem {
        padding: 5px 15px;
        background-color: #f0f1f3;
        // 字体
        font-family: sans-serif;
        cursor: pointer;
        transition: all 0.5s ease;
    }

    .active {
        background-color: white;
        border-radius: 15px 15px 0 0;
        color: #ff914e;
        transform: translateY(0);
    }

    .activeNext {
        border-radius: 0 0 0 15px;
    }

    .activeLast {
        border-radius: 0 0 15px 0;
    }
}

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