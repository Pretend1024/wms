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
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('skuList')">
                            <canonicalInput v-model:listName="formData.skuList" :placeholder="getPlaceholder('skuList')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('barcodeList')">
                            <canonicalInput v-model:listName="formData.barcodeList"
                                :placeholder="getPlaceholder('barcodeList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusMenu" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('cusStatusId')">
                            <el-select v-model="formData.cusStatusId" :placeholder="getPlaceholder('cusStatusId')"
                                clearable>
                                <el-option v-for="item in cusStatusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('isNew')">
                            <el-select v-model="formData.isNew" :placeholder="getPlaceholder('isNew')" clearable>
                                <el-option v-for="item in isNewOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('isCheckedSize')">
                            <el-select v-model="formData.isCheckedSize" :placeholder="getPlaceholder('isCheckedSize')"
                                clearable>
                                <el-option v-for="item in isCheckedSizeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('dangerId')">
                            <el-select v-model="formData.dangerId" :placeholder="getPlaceholder('dangerId')" clearable>
                                <el-option v-for="item in dangerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('electrifiedId')">
                            <el-select v-model="formData.electrifiedId" :placeholder="getPlaceholder('electrifiedId')"
                                clearable>
                                <el-option v-for="item in electrifiedOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
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
                    <el-button type="warning" @click="handleAudit" v-permission="'updateStatus'" :icon="Finished">{{
                        getButtonText('audit')
                    }}</el-button>
                    <el-dropdown trigger="click" v-permission="'sku:importAdd,sku:importUpd'">
                        <el-button type="success">
                            {{ getButtonText('import') }}<el-icon class="el-icon--right">
                                <ArrowDown />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleImportAdd">{{ getButtonText('importCreate')
                                }}</el-dropdown-item>
                                <el-dropdown-item @click="handleImportUpd">{{ getButtonText('importUpdate')
                                }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button type="success" @click="handleExport" v-permission="'export'" :icon="Share">{{
                        getButtonText('export')
                    }}</el-button>
                    <el-button type="info" @click="handlePrint" v-permission="'print'" :icon="Printer">{{
                        getButtonText('print')
                    }}</el-button>
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
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 20 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #cusStatusName="{ row }">
                    <span :style="{ color: row.cusStatusId == 20 ? 'green' : 'red' }">{{ row.cusStatusName }}</span>
                </template>
                <template #isCheckedSize="{ row }">
                    <span :style="{ color: row.isCheckedSize ? 'green' : 'red' }">{{ row.isCheckedSize ? t('yes') :
                        t('no')
                    }}</span>
                </template>
                <template #actualLength="{ row }">
                    <span>{{ row.length }}</span>
                </template>
                <template #actualWidth="{ row }">
                    <span>{{ row.width }}</span>
                </template>
                <template #actualHeight="{ row }">
                    <span>{{ row.height }}</span>
                </template>
                <template #actualVolume="{ row }">
                    <span>{{ row.volume }}</span>
                </template>
                <template #isNew="{ row }">
                    <span :style="{ color: row.isNew ? 'red' : 'green' }">{{ row.isNew ? t('yes') : t('no') }}</span>
                </template>
                <template #mainImgUrl="{ row }">
                    <div style="display: flex; justify-content: center; align-items: center; cursor: pointer;"
                        @click="openImageDialog(row)" v-permission="'edit'">
                        <el-image v-if="row.mainImgUrl" :src="row.mainImgUrl"
                            style="width: 40px; height: 40px; border-radius: 4px;" fit="cover" />
                        <div v-else class="cursor-pointer">
                            <el-icon>
                                <Upload />
                            </el-icon>
                            <span>{{ getButtonText('upload') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <el-dialog :title="t('base_sku_sku_list.audit')" v-model="auditDialogVisible" width="25%" align-center
            destroy-on-close>
            <el-form-item :label="t('base_sku_sku_list.auditStatus')">
                <el-select v-model="auditStatusId" :placeholder="t('base_sku_sku_list.selectAuditStatus')">
                    <el-option v-for="item in auditStatusOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="auditDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="audit">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <SkuImageDialog v-model="imgDialogVisible" :skuData="currentSku" @closed="handleImgDialogClosed" />
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="101">
        </exportDialog>
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="101">
        </printDialog>

        <batchOperationn :dialogTitle="t('base_sku_sku_list.operationResult')" :isVisible="delDialogVisible"
            :tableData="delData" :nameField="'id'" :nameLabel="t('base_sku_sku_list.sku')" :successValue="delDataMsg"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="SKU">
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, shallowRef, onMounted, nextTick, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Delete, Printer, Finished, Share, EditPen, ArrowDown, Upload } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import selectInput from '@/components/table/selectInput.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import SkuImageDialog from './SkuImageDialog.vue';

// 1.3 API引入
import {
    getSkuSkuListApi,
    delSkuSkuDataApi,
    updateSkuStatusApi,
    getSkuStatusEnumListApi,
    getSkuCusStatusEnumListApi,
    getSkuDangerEnumListApi,
    getSkuElectrifiedEnumListApi,
    getCustomerLikeQueryApi
} from '@/api/baseApi/sku.js';
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';

// 1.4 工具类及Store
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

import { useRefreshStore } from '@/store/refresh.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();
const refreshStore = useRefreshStore();
const loading = ref(true);

// 搜索表单配置
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    customerCode: '',
    skuList: [],
    name: '',
    statusId: '',
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    cusStatusId: '',
    isNew: '',
    dangerId: '',
    electrifiedId: '',
    way: 'skuLike'
});

const way = ref([
    { label: 'SKU', value: 'skuLike' },
    { label: '条码', value: 'barcodeLike' },
    { label: '中文品名', value: 'nameCnLike' },
    { label: '英文品名', value: 'nameEnLike' },
]);

// 下拉选项数据
const customerOptions = ref([]);
const companyOptions = ref([]);
const statusMenu = ref([]);
const cusStatusOptions = ref([]);
const isNewOptions = ref([
    { label: '是', value: true },
    { label: '否', value: false }
]);
const isCheckedSizeOptions = ref([
    { label: '是', value: true },
    { label: '否', value: false }
]);
const dangerOptions = ref([]);
const electrifiedOptions = ref([]);

const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};

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

// 批量操作/删除相关
const delData = ref([]);
const delDataMsg = ref(t('base_sku_sku_list.deleteSuccess'));
const promptMessage = ref('');
const delDialogVisible = ref(false);

// 审核弹窗
const auditDialogVisible = ref(false);
const auditStatusId = ref('');
const auditStatusOptions = ref([]);

// 图片弹窗
const imgDialogVisible = ref(false);
const currentSku = ref({});

// 打印与导出
const printDialogRef = ref(null);
const exportDialogRef = ref(null);

/* 3. 计算属性 - Columns (保持原样) */
const columns = ref([
    { label: '公司', prop: 'orgName', width: '125', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerName', width: '200', fixed: 'left', slot: 'customer', sortable: true },
    { label: 'SKU', prop: 'sku', width: '180', fixed: 'left', sortable: true },
    { label: '条码', prop: 'barcode', width: '180', sortable: true },
    { label: '图片', prop: 'mainImgUrl', width: '100', slot: 'mainImgUrl' },
    { label: '中文品名', prop: 'nameCn', width: '230', sortable: true },
    { label: '英文品名', prop: 'nameEn', width: '230', sortable: true },
    { label: '仓库审核', prop: 'statusName', width: '180', slot: 'statusName', sortable: true },
    { label: '客户审核', prop: 'cusStatusName', width: '170', slot: 'cusStatusName', sortable: true },
    { label: '新品', prop: 'isNew', width: '155', slot: 'isNew', sortable: true },
    { label: '预报长(CM)', prop: 'cusLength', width: '220', sortable: true },
    { label: '预报宽(CM)', prop: 'cusWidth', width: '220', sortable: true },
    { label: '预报高(CM)', prop: 'cusHeight', width: '220', sortable: true },
    { label: '预报体积(M³)', prop: 'cusVolume', width: '220', sortable: true },
    { label: '复测', prop: 'isCheckedSize', width: '180', sortable: true, slot: 'isCheckedSize' },
    { label: '复测长(CM)', prop: 'length', width: '255', sortable: true },
    { label: '复测宽(CM)', prop: 'width', width: '255', sortable: true },
    { label: '复测高(CM)', prop: 'height', width: '255', sortable: true },
    { label: '复测(M³)', prop: 'volume', width: '255', sortable: true },
    { label: '毛重(KG)', prop: 'grossWeight', width: '195', sortable: true },
    { label: '净重(KG)', prop: 'netWeight', width: '175', sortable: true },
    { label: '规格型号', prop: 'model', width: '180' },
    { label: '单位价格', prop: 'unitValue', width: '135', sortable: true },
    { label: '报关品名', prop: 'customsName', width: '200' },
    { label: '报关价格', prop: 'customsValue', width: '175', sortable: true },
    { label: '币种代码', prop: 'currency', width: '175' },
    { label: '危险类型', prop: 'dangerName', width: '155', sortable: true },
    { label: '带电类型', prop: 'electrifiedName', width: '175', sortable: true },
    { label: '原产国代码', prop: 'originCountry', width: '230', sortable: true },
    { label: '海关编码', prop: 'hsCode', width: '125', sortable: true },
    { label: '行邮税号', prop: 'taxCode', width: '175' },
    { label: '计量单位', prop: 'unit', width: '210' },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '周转率', prop: 'turnoverRate', width: '175', sortable: true },
    { label: '周转率等级', prop: 'turnoverLevel', width: '175', sortable: true },
    { label: '周期订单量', prop: 'orderQty', width: '230', sortable: true },
    { label: '周期出货量', prop: 'outQty', width: '260', sortable: true },
    { label: '统计周期起始', prop: 'statsBegin', width: '220', sortable: true },
    { label: '统计周期截至', prop: 'statsEnd', width: '210', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]);

/* 4. 业务逻辑 */

// 搜索
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = { ...data };

    // 处理动态搜索字段
    const fields = way.value.map(item => item.value);
    const fieldsToDelete = fields.filter(field => field !== data.way);
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });

    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置
const handleReset = (data) => {
    loading.value = true;
    initValues.value = { ...data };
    handleCascaderChange();
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 列表查询
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getSkuSkuListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = Object.freeze(res.data.rows);
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
    loading.value = false;
};

// 公司选择改变
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value?.togglePopperVisible();
        });
    }
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));
};

// 新增
const handleAdd = async () => {
    router.push('/base/sku/sku/add');
};

// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑SKU',
        params: { id: row.id, name: row.sku },
    });
};

// 打开图片弹窗
const openImageDialog = (row) => {
    currentSku.value = row;
    imgDialogVisible.value = true;
};

// 图片弹窗关闭回调
const handleImgDialogClosed = (isRefresh) => {
    if (isRefresh) {
        getList(pagination.value.currentPage, pagination.value.pageSize);
    }
};

// 打开审核弹窗
const handleAudit = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_sku_sku_list.selectAuditData')
        });
        return;
    }
    auditDialogVisible.value = true;
};

// 审核确认
const audit = async () => {
    if (!auditStatusId.value) {
        smartAlert(t('base_sku_sku_list.selectAuditStatus'), false, 1000);
        return;
    }
    delDataMsg.value = t('base_sku_sku_list.auditSuccess');
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = t('base_sku_sku_list.processing');

    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await updateSkuStatusApi({ id: selectionRows.value[i].id, statusId: auditStatusId.value });
        delData.value.push({
            id: selectionRows.value[i].sku,
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = t('base_sku_sku_list.operationComplete');
    auditStatusId.value = '';
    auditDialogVisible.value = false;
};

// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 101, typeName: t('base_sku_sku_list.importCreate') },
    });
};
const handleImportUpd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 102, typeName: t('base_sku_sku_list.importUpdate') },
    });
};

// 导出
const handleExport = async () => {
    exportDialogRef.value.openExportDialog();
};

// 打印
const handlePrint = async () => {
    printDialogRef.value.openPrintDialog();
};

// 删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_sku_sku_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_sku_sku_list.confirmDelete', { count: selectionRows.value.length }),
        t('base_sku_sku_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = t('base_sku_sku_list.processing');
            delDataMsg.value = t('base_sku_sku_list.deleteSuccess');
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delSkuSkuDataApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].sku,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('base_sku_sku_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_sku_sku_list.deleteCanceled')
            });
        });
};

// 批量结果弹窗关闭
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 5. 辅助方法 */

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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [statusRes, customerRes, cusStatusRes, dangerRes, electrifiedRes, companyRes] = await Promise.all([
        getSkuStatusEnumListApi(),
        getCustomerLikeQueryApi({ keyword: '*' }),
        getSkuCusStatusEnumListApi(),
        getSkuDangerEnumListApi(),
        getSkuElectrifiedEnumListApi(),
        getOrgListCompanyApi()
    ]);

    // 处理状态菜单
    statusMenu.value = statusRes.data.map(item => ({ label: item.name, value: item.id }));
    formConfig.value[0] = {
        ...formConfig.value[0],
        options: statusMenu.value,
    };
    auditStatusOptions.value = statusMenu.value;

    // 处理客户下拉
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));

    // 其他下拉选项
    cusStatusOptions.value = cusStatusRes.data.map(item => ({ label: item.name, value: item.id }));
    dangerOptions.value = dangerRes.data.map(item => ({ label: item.name, value: item.id }));
    electrifiedOptions.value = electrifiedRes.data.map(item => ({ label: item.name, value: item.id }));

    // 处理公司数据 (Tree)
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);

    // 初始化列表
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
});

onActivated(() => {
    if (refreshStore.shouldRefreshSkuList) {
        console.log('刷新数据');
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        refreshStore.shouldRefreshSkuList = false;
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>