<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :loading="loading" :enableSelection="true"
                @selection-change="handleSelectionChange" :pagination="pagination" @page-change="handlePageChange"
                :tableId="'sys/setting/app/list'">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'sysApp:add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'sysApp:delete'" :icon="Delete">
                        {{ getButtonText('del') }}
                    </el-button>
                    <el-button type="success" @click="handleExport" v-permission="'sysApp:export'" :icon="Share">
                        {{ getButtonText('export') }}
                    </el-button>
                </template>

                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDetail(row)" style="margin-left: 10px;">
                            <el-icon>
                                <View />
                            </el-icon>
                            <span>详情</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>

        <AddDialog ref="addDialogRef" @confirm="getList" :type-options="typeOptions" />
        <UpdDialog ref="updDialogRef" @confirm="getList" :type-options="typeOptions" />

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="resultDialogVisible" :tableData="resultData"
            :nameField="'id'" :nameLabel="'版本号'" @close="resultClose" :promptMessage="promptMessage" />

        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="901">
        </exportDialog>
    </div>
</template>

<script setup name="app版本">
import { ref, onMounted, shallowRef } from 'vue';
import { Plus, Delete, EditPen, Share, View } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import AddDialog from './add.vue';
import UpdDialog from './upd.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import { getSysAppListApi, delSysAppByIdApi, getSysAppTypeEnumApi } from '@/api/sysApi/setting.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';

const loading = ref(false);
const tableData = shallowRef([]);
const selectionRows = ref([]);
const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 });
const typeOptions = ref([]);

const addDialogRef = ref(null);
const updDialogRef = ref(null);
const exportDialogRef = ref(null);

// 筛选配置
const formConfig = ref([
    { type: 'select', label: 'APP类型', prop: 'typeId', options: [] },
    { type: 'input', label: '版本号', prop: 'versionNo' }
]);
const initValues = ref({ typeId: '', versionNo: '' });

const columns = ref([
    { label: 'APP类型', prop: 'typeName', width: '120' },
    { label: '版本号', prop: 'versionNo', width: '120' },
    { label: '安装包下载地址', prop: 'fileUrl', width: '250', showOverflowTooltip: true },
    { label: '下载页面', prop: 'publishPage', width: '200' },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '180', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '180', sortable: true },
    { label: '操作', prop: 'action', width: '150', fixed: 'right', slot: 'customBtn' }
]);

const getList = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.value.currentPage,
            pageSize: pagination.value.pageSize,
            ...trimObjectStrings(initValues.value)
        };
        const res = await getSysAppListApi(params);
        tableData.value = res.data.rows;
        pagination.value.total = res.data.total;
    } finally {
        loading.value = false;
    }
};

const handleSearch = (val) => {
    initValues.value = val;
    pagination.value.currentPage = 1;
    getList();
};

const handleReset = (val) => {
    initValues.value = val;
    getList();
};

const handleAdd = () => addDialogRef.value.open();
const handleEdit = (row) => updDialogRef.value.open(row, false);
const handleDetail = (row) => updDialogRef.value.open(row, true);

// 批量删除逻辑
const resultDialogVisible = ref(false);
const resultData = ref([]);
const promptMessage = ref('');
const handleDel = () => {
    if (selectionRows.value.length === 0) return ElMessage.warning('请选择数据');
    ElMessageBox.confirm(`确定删除选中的 ${selectionRows.value.length} 条数据吗？`, '提示', { type: 'warning' }).then(async () => {
        resultData.value = [];
        resultDialogVisible.value = true;
        promptMessage.value = '正在删除...';
        for (const item of selectionRows.value) {
            const res = await delSysAppByIdApi({ id: item.id });
            resultData.value.push({ id: item.versionNo, msg: res.msg, success: res.success });
        }
        promptMessage.value = '操作完成';
        getList();
    });
};

const handlePageChange = ({ currentPage, pageSize }) => {
    pagination.value.currentPage = currentPage;
    pagination.value.pageSize = pageSize;
    getList();
};

const handleSelectionChange = (val) => selectionRows.value = val;
const handleExport = () => exportDialogRef.value.openExportDialog();
const resultClose = () => resultDialogVisible.value = false;

onMounted(async () => {
    const res = await getSysAppTypeEnumApi();
    typeOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
    formConfig.value[0].options = typeOptions.value;
    getList();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>