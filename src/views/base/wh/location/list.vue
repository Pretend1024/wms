<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData, getColSpan }">
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')" class="compact-item">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                @change="selectWh" clearable>
                                <el-option v-for="item in warehouseEnumOptions" :key="item.id"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('zoneCode')" class="compact-item">
                            <el-select v-model="zoneCode" :placeholder="getPlaceholder('zoneCode')" clearable
                                ref="zoneSelectRef">
                                <el-option v-for="item in zoneEnumOptions" :key="item.typeId"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('codeList')">
                            <canonicalInput v-model:listName="formData.codeList"
                                :placeholder="getPlaceholder('codeList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('sizeTypeCode')" class="compact-item">
                            <el-select v-model="formData.sizeTypeCode" :placeholder="getPlaceholder('sizeTypeCode')"
                                clearable>
                                <el-option v-for="item in sizeTypeEnumOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')" class="compact-item">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusEnumOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('qualityId')" class="compact-item">
                            <el-select v-model="formData.qualityId" :placeholder="getPlaceholder('qualityId')"
                                clearable>
                                <el-option v-for="item in qualityEnumOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('saturation')" class="compact-item">
                            <el-select v-model="formData.saturation" :placeholder="getPlaceholder('saturation')"
                                clearable>
                                <el-option v-for="item in saturationOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('xcoord')" class="compact-item">
                            <el-input v-model="formData.xcoord" :placeholder="getPlaceholder('xcoord')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('ycoord')" class="compact-item">
                            <el-input v-model="formData.ycoord" :placeholder="getPlaceholder('ycoord')" clearable
                                v-number />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('zcoord')" class="compact-item">
                            <el-input v-model="formData.zcoord" :placeholder="getPlaceholder('zcoord')" clearable
                                v-number />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('accessEase')" class="compact-item">
                            <el-input v-model="formData.accessEase" :placeholder="getPlaceholder('accessEase')"
                                clearable v-number />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="DeleteFilled">{{
                        getButtonText('del') }}
                    </el-button>
                    <el-dropdown trigger="click" v-permission="'sku:importAdd,sku:importUpd'">
                        <el-button type="success">
                            {{ getButtonText('import') }}<el-icon class="el-icon--right">
                                <arrow-down />
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
                    <el-button type="success" @click="handleExport" :icon="Share" v-permission="'export'">{{
                        getButtonText('export')
                        }}</el-button>
                    <el-button type="info" @click="handlePrint" :icon="Printer" v-permission="'print'">{{
                        getButtonText('print') }}</el-button>
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
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId === 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="750" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :formData="addData"
                :sizeTypeEnumOptions="sizeTypeEnumOptions" :warehouseEnumOptions="warehouseEnumOptions"
                :statusEnumOptions="statusEnumOptions" :qualityEnumOptions="qualityEnumOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="t('base_wh_location_list.locationCode')" @close="delColse" :promptMessage="promptMessage" />
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="102">
        </exportDialog>
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="104">
        </printDialog>

    </div>
</template>

<script setup name='库位'>
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, DeleteFilled, Printer, Share, EditPen, ArrowDown } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';

// 1.2 组件引入
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import selectInput from '@/components/table/selectInput.vue';
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getWhLocationListApi,
    addWhLocationApi,
    updWhLocationApi,
    delWhLocationApi,
    getWhWarehouseApi,
    getWhZoneEnumApi,
    getWhLocationSizeTypeEnumApi,
    getWhLocationStatusEnumApi,
    getWhLocationSaturationEnumApi
} from '@/api/baseApi/wh.js';
import { getInventoryInventoryQualityEnumApi } from '@/api/inventoryApi/inventory.js';

// 1.4 工具类引入
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';


/* 2. 全局变量与状态 */
const { t } = useI18n();
const loading = ref(true);

// 搜索表单配置 (Label保持中文)
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd' },
]);

// 初始化表单数据
const initValues = ref({
    warehouseCode: '',
    zoneCode: '',
    sizeTypeCode: '',
    codeList: [],
    saturation: '',
    xcoord: null,
    ycoord: null,
    zcoord: null,
    accessEase: null,
    createdTimeBegin: '',
    createdTimeEnd: '',
    way: 'codeLike'
});

const way = ref([
    { label: '库位', value: 'codeLike' }
]);

// 下拉选项数据
const warehouseEnumOptions = ref([]);
const zoneEnumOptions = ref([]);
const sizeTypeEnumOptions = ref([]);
const statusEnumOptions = ref([]);
const saturationOptions = ref([]);
const qualityEnumOptions = ref([]);
const zoneCode = ref('');

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

// 打印与导出
const printDialogRef = ref(null);
const exportDialogRef = ref(null);

/* 3. 计算属性 */
// 表格列定义 (Label保持中文)
const columns = ref([
    { label: '仓库代码', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '库区代码', prop: 'zoneCode', width: '120', fixed: 'left', sortable: true },
    { label: '库位代码', prop: 'code', width: '170', fixed: 'left', sortable: true },
    { label: '状态', prop: 'statusName', width: '120', slot: 'statusName', sortable: true },
    { label: '品质', prop: 'qualityName', width: '120', sortable: true },
    { label: '尺寸类型', prop: 'sizeTypeName', width: '120', sortable: true },
    { label: '长(CM)', prop: 'length', width: '110', sortable: true },
    { label: '宽(CM)', prop: 'width', width: '110', sortable: true },
    { label: '高(CM)', prop: 'height', width: '110', sortable: true },
    { label: '体积(M³)', prop: 'volume', width: '120', sortable: true },
    { label: '动线号', prop: 'lineNumber', width: '125', sortable: true },
    { label: 'x坐标', prop: 'xcoord', width: '125', sortable: true },
    { label: 'y坐标', prop: 'ycoord', width: '125', sortable: true },
    { label: 'z坐标', prop: 'zcoord', width: '125', sortable: true },
    { label: '存取难度', prop: 'accessEase', width: '180', sortable: true },
    { label: '与月台间距', prop: 'distanceToDock', width: '170', sortable: true },
    { label: '饱和度', prop: 'saturation', width: '135', sortable: true },
    { label: '库存SKU个数', prop: 'inventorySkuQty', width: '170' },
    { label: '库存件数', prop: 'inventoryGoodsQty', width: '190' },
    { label: '库存体积(M³)', prop: 'inventoryGoodsVolume', width: '210' },
    { label: '最大批次数', prop: 'batchNoQty', width: '210', sortable: true },
    { label: '最大SKU个数', prop: 'skuQty', width: '190', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '105', fixed: 'right', slot: 'customBtn' }
]);

// 弹窗标题
const dialogTitle = computed(() => t(`base_wh_location_list.${dialogMode.value}Title`));
// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getWhLocationListApi({
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
    data.xcoord = Number(data.xcoord) || null;
    data.ycoord = Number(data.ycoord) || null;
    data.zcoord = Number(data.zcoord) || null;
    data.accessEase = Number(data.accessEase) || null;
    initValues.value = {
        ...data,
        zoneCode: zoneCode.value,
    };
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
    zoneCode.value = '';
    initValues.value = {
        ...data,
        zoneCode: '',
    };
    zoneEnumOptions.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 新增
const handleAdd = () => {
    addData.value = {
        id: null,
        warehouseCode: '',
        zoneCode: '',
        sizeTypeCode: '',
        code: '',
        lineNumber: '',
        saturation: '',
        skuQty: '',
        batchNoQty: '',
        statusId: '',
        xcoord: null,
        ycoord: null,
        zcoord: null,
        accessEase: null,
        distanceToDock: null,
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 打印
const handlePrint = async () => {
    printDialogRef.value.openPrintDialog();
};

// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 104, typeName: t('base_wh_location_list.importCreate') },
    });
};
const handleImportUpd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 105, typeName: t('base_wh_location_list.importUpdate') },
    });
};

// 导出
const handleExport = async () => {
    exportDialogRef.value.openExportDialog();
};

// 批量删除
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: t('base_wh_location_list.selectDelete')
        });
        return;
    }
    ElMessageBox.confirm(
        t('base_wh_location_list.confirmDelete', { count: selectionRows.value.length }),
        t('base_wh_location_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = t('base_wh_location_list.processing');
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delWhLocationApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].code,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = t('base_wh_location_list.operationComplete');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_wh_location_list.deleteCanceled')
            });
        });
};

// 弹窗确认
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res = null;
        const data = { ...addData.value };
        data.xcoord = Number(data.xcoord);
        data.ycoord = Number(data.ycoord);
        data.zcoord = Number(data.zcoord);
        data.accessEase = Number(data.accessEase);
        data.saturation = Number(data.saturation);

        if (dialogMode.value === 'upd') {
            res = await updWhLocationApi(data);
        } else {
            res = await addWhLocationApi(data);
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

/* 5. 辅助方法 */

// 表格选中
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
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
    loading.value = true;
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

// 仓库选择事件
const selectWh = async (value) => {
    if (!value) {
        zoneEnumOptions.value = [];
        zoneCode.value = '';
        return;
    }
    const res = await getWhZoneEnumApi({ warehouseCode: value });
    zoneEnumOptions.value = res.data;
};

/* 6. 生命周期 */
onMounted(async () => {
    // 使用 Promise.all 并发请求
    const [warehouseRes, sizeTypeRes, statusRes, saturationRes, qualityRes] = await Promise.all([
        getWhWarehouseApi(),
        getWhLocationSizeTypeEnumApi(),
        getWhLocationStatusEnumApi(),
        getWhLocationSaturationEnumApi(),
        getInventoryInventoryQualityEnumApi()
    ]);

    warehouseEnumOptions.value = warehouseRes.data;

    sizeTypeEnumOptions.value = sizeTypeRes.data.map(item => ({
        label: item.name,
        value: item.code
    }));

    statusEnumOptions.value = statusRes.data.map(item => ({
        label: item.name,
        value: item.id
    }));

    saturationOptions.value = saturationRes.data.map(item => ({
        label: item.name,
        value: item.id
    }));

    qualityEnumOptions.value = qualityRes.data.map(item => ({
        label: item.name,
        value: item.id
    }));
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>