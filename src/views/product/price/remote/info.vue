<template>
    <div class="tableDiv">
        <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
            :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
            @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
            <!-- 表格上方按钮 -->
            <template #table-buttons>
                <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus"> {{ getButtonText('add') }}</el-button>
                <el-button type="success" @click="handleImportAdd" :icon="UploadFilled">{{ getButtonText('import')
                    }}</el-button>
                <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export') }}</el-button>
                <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="DeleteFilled">{{ getButtonText('del') }}</el-button>
                <el-button type="warning" @click="handleTest" :icon="ZoomIn">{{ getButtonText('test') }}</el-button>
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
            <template #country="{ row }">
                <span>{{ row.countryCode + '(' + row.countryName + ')' }}</span>
            </template>
            <template #postalCode="{ row }">
                <span v-if="row.postalCodeStart">{{ row.postalCodeStart + '-' + row.postalCodeEnd }}</span>
            </template>
        </hydTable>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="650" align-center destroy-on-close>
        <!-- 动态加载新增或编辑的表单组件 -->
        <component :is="currentForm" ref="childFormRef" :formData="addData" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 批量删除弹窗组件 -->
    <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'国家'"
        :successValue="'删除成功'" @close="delColse" :promptMessage="promptMessage" />
    <!-- 导出弹窗 -->
    <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="519">
    </exportDialog>
    <!-- 导入弹窗 -->
    <importDialog ref="importDialogRef" :typeId="561" :id="importId" :importTitle="'导入偏远库明细'" @close='handleSearch'>
    </importDialog>
    <!-- 测试弹窗 -->
    <testDialog ref="zipcodeDialog" :remoteId="remoteId"></testDialog>

</template>

<script setup name='偏远库明细'>
import { ref, computed, onMounted } from 'vue';
import { Plus, DeleteFilled, UploadFilled, Share, ZoomIn, Search, RefreshLeft } from "@element-plus/icons-vue";
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import importDialog from '@/components/print-export-importDialog/importDialog.vue';
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './infoAdd.vue';
import UpdForm from './infoUpd.vue';
import testDialog from './testDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { smartAlert } from '@/utils/genericMethods.js'
import { getProductShipwayRemoteDetailApi, updProductShipwayRemoteDetailApi, addProductShipwayRemoteDetailApi, delProductShipwayRemoteDetailApi } from '@/api/productApi/shipway.js'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';

const props = defineProps({
    infoData: { type: Object, required: true }
});
// 搜索事件
const handleSearch = async () => {
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 国家数据
const countryOptions = ref([]);
// 表格数据与列配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '偏远类型', prop: 'typeName', width: '110', sortable: true },
    { label: '国家', prop: 'countryCode', width: '150', slot: 'country', sortable: true },
    { label: '规则', prop: 'ruleName', width: '120', sortable: true },
    { label: '邮编范围', prop: 'postalCode', width: '150', slot: 'postalCode' },
    { label: '邮编前缀', prop: 'content', width: '150' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '80', fixed: 'right', slot: 'customBtn' }
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

// 用于导出的筛选条件
const initValues = ref({ remoteId: props.infoData.id });

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
const addData = ref();
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => dialogMode.value === 'add' ? '新增明细' : '编辑明细'); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        typeId: '',
        content: '',
        countryCode: '',
        postalCodeEnd: '',
        postalCodeStart: '',
        ruleId: '',
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
// 批量删除相关
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
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delProductShipwayRemoteDetailApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].countryCode + '-' + selectionRows.value[i].ruleName,
                    msg: res.msg,
                    success: res.success
                });

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
// 导入
const importDialogRef = ref(null);
const importId = ref(null)
const handleImportAdd = async () => {
    importId.value = props.infoData.id;
    importDialogRef.value.openImportDialog()
    // router.push({
    //     name: '导入文件',
    //     params: { typeId: 61, typeName: '导入偏远库明细', id: props.infoData.id },
    // })
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 测试按钮
const zipcodeDialog = ref(null);
const remoteId = ref(null);
const handleTest = () => {
    remoteId.value = props.infoData.id;
    zipcodeDialog.value.openDialog();
}

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const data = { ...addData.value, remoteId: props.infoData.id }
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updProductShipwayRemoteDetailApi(data);
            console.log('修改数据:', res);
        } else {
            res = await addProductShipwayRemoteDetailApi(data);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        smartAlert(res.msg, res.success, 1000)
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
    const res = await getProductShipwayRemoteDetailApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        remoteId: props.infoData.id
    });
    tableData.value = Object.freeze(res.data.rows);
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
    loading.value = false;
};
watch(
    () => props.infoData.id,
    (newId) => {
        if (newId) {
            initValues.value.remoteId = newId;
            pagination.value.currentPage = 1;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
    },
    { immediate: true }
);

defineExpose({ getList })
onMounted(async () => {
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data;
})
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';

.tableDiv {
    height: 450px;
}

.searchDiv {
    display: flex;
    align-items: center;
    margin: 0 45px 0 auto;
}
</style>