<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :tableData="tableData" :columns="columns" :loading="loading" :is-tree="true"
                row-key="id" :tree-props="{ children: 'children' }" :defaultExpandAll="defaultExpandAll"
                @row-click="handleRowClick">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" plain @click="handleExpandAll" :icon="Sort">
                        {{ defaultExpandAll ? '全部折叠' : '全部展开' }}
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
                    </div>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
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
import { ref, computed, onMounted, shallowRef, nextTick } from 'vue'; // 补充导入 shallowRef, nextTick
import { Plus, Sort, Delete, EditPen } from '@element-plus/icons-vue';
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'; // 补充导入 ElLoading
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

// 删除操作 (代码暂时注释保留，如需启用请确保 API 引入正确)
const handleDel = (row) => {
    ElMessageBox.confirm('是否要删除本条数据?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            loading.value = true;
            // 注意：这里原代码调用了 delOrganizationDataApi，但当前文件没有引入，且业务场景似乎是删除工单类型
            // 如果需要删除功能，请引入对应的 delWorkOrderTypeByIdApi (假设存在)
            // const res = await delOrganizationDataApi({ id: row.id });
            // smartAlert(res.msg, res.success, 1000);
            // getList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};

// 表格展开/折叠 (适配 vxe-table API)
const hydTableRef = ref(null);
const handleExpandAll = () => {
    const $table = hydTableRef.value?.elTableRef;
    if (!$table) return;

    // 切换状态
    const targetState = !defaultExpandAll.value;
    // 使用 vxe-table 的 setAllTreeExpand 方法
    $table.setAllTreeExpand(targetState);

    // 更新按钮状态
    defaultExpandAll.value = targetState;
};

// 获取数据及处理级联树形数据
const getList = async () => {
    loading.value = true;
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

    // 数据加载完成后，应用默认展开状态
    nextTick(() => {
        const $table = hydTableRef.value?.elTableRef;
        if ($table && defaultExpandAll.value) {
            $table.setAllTreeExpand(true);
        }
    });
};

onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>