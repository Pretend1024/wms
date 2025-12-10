<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :tableData="tableData" :columns="columns" :loading="loading" :is-tree="true"
                :row-key="id" :tree-props="{ children: 'children' }" :defaultExpandAll="defaultExpandAll"
                @row-click="handleRowClick">
                <!-- 表格上方操作按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" plain @click="handleExpandAll" :icon="Sort">
                        {{ getButtonText('expand') }}
                    </el-button>
                </template>
                <!-- 自定义操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <!-- <div class="cursor-pointer" @click="handleDel(row)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>{{ getButtonText('del') }}</span>
                        </div> -->
                    </div>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 根据 dialogMode 动态加载 add.vue 或 upd.vue -->
            <component :is="currentForm" ref="childFormRef" :form-data="addData" :parent-id-list="parentIdList" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="问题类型">
import { ref, computed, onMounted } from 'vue';
import { Plus, Sort, Delete, EditPen } from '@element-plus/icons-vue';
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getWorkOrderTypeListApi, addWorkOrderTypeApi, updWorkOrderTypeByIdApi } from '@/api/vasApi/wo.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表格数据及配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '类型名称', prop: 'name', width: '180' },
    { label: '排序', prop: 'sortNo', width: '85', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '110', fixed: 'right', slot: 'customBtn' }
]);
const loading = ref(true);
const defaultExpandAll = ref(true);

const selection = ref({});
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};

// 弹窗及表单数据
const centerDialogVisible = ref(false);
const addData = ref({});

// dialogMode 用于区分 "add"（新增）与 "upd"（编辑）
const dialogMode = ref('add');
const dialogTitle = computed(() => t(`vas_wo_workOrderType_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const childFormRef = ref(null);

// 部门类型枚举和上级部门数据
const parentIdList = ref([]);

// 点击新增
const handleAdd = async () => {
    // 重置表单数据
    addData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击编辑
const handleEdit = async (row) => {
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 弹窗取消回调
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 弹窗确定回调
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        let res = null;
        const data = {
            ...addData.value
        };
        if (dialogMode.value === 'upd') {
            res = await updWorkOrderTypeByIdApi(data);
        } else {
            res = await addWorkOrderTypeApi(data);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            getList();
            centerDialogVisible.value = false;
        }
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};

// 删除操作
const handleDel = (row) => {
    ElMessageBox.confirm('是否要删除本条数据?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            loading.value = true;
            const bodyLoading = ElLoading.service({
                lock: true,
                text: 'Loading',
            })
            const res = await delOrganizationDataApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000);
            getList();
            bodyLoading.close();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};

// 表格展开/折叠
const hydTableRef = ref(null);
const handleExpandAll = () => {
    const elTable = hydTableRef.value?.elTableRef;
    if (!elTable) return;
    const processExpansion = (rows, expanded) => {
        rows.forEach(row => {
            elTable.toggleRowExpansion(row, expanded);
            if (row.children?.length) {
                processExpansion(row.children, expanded);
            }
        });
    };
    const targetState = !defaultExpandAll.value;
    processExpansion(tableData.value, targetState);
    defaultExpandAll.value = targetState;
};

// 获取数据及处理级联树形数据
const getList = async () => {
    const res = await getWorkOrderTypeListApi({});
    tableData.value = res.data;
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.name,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    parentIdList.value = convertToTree(res.data);
    loading.value = false;
};

onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>