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
                        <div class="cursor-pointer" @click="handleAddChildren(row)">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>{{ getButtonText('add') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDel(row)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>{{ getButtonText('del') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 根据 dialogMode 动态加载 add.vue 或 upd.vue -->
            <component :is="currentForm" ref="childFormRef" :form-data="addData" :parent-id-list="parentIdList"
                :type-enum="TypeEnum" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="公司部门">
import { ref, computed, onMounted } from 'vue';
import { Plus, Sort, Delete, EditPen } from '@element-plus/icons-vue';
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
    getOrganizationListApi, getOrganizationTypeEnumApi, addOrganizationDataApi, updateOrganizationDataApi,
    delOrganizationDataApi
} from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表格数据及配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '中文名', prop: 'nameCn', width: '180' },
    { label: '英文名', prop: 'nameEn', width: '180' },
    { label: '公司代码', prop: 'code', width: '130' },
    { label: '绑定仓库', prop: 'warehouseCode', width: '135' },
    { label: '公司/部门', prop: 'typeName', width: '100' },
    { label: '负责人', prop: 'leader', width: '100' },
    { label: '备注', prop: 'remark', width: '250' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
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
const addData = ref({
    leader: '',
    nameCn: '',
    nameEn: '',
    parentId: '',
    remark: '',
    sortNo: null,
    typeName: '',
    typeId: null,
    type: null,
});

// dialogMode 用于区分 "add"（新增）与 "upd"（编辑）
const dialogMode = ref('add');
const dialogTitle = computed(() => t(`base_org_organization_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const childFormRef = ref(null);

// 部门类型枚举和上级部门数据
const TypeEnum = ref([]);
const parentIdList = ref([]);

// 点击新增
const handleAdd = async () => {
    if (TypeEnum.value.length === 0) {
        const resType = await getOrganizationTypeEnumApi();
        TypeEnum.value = resType.data;
    }
    // 重置表单数据
    addData.value = {
        leader: '',
        nameCn: '',
        nameEn: '',
        parentId: '',
        remark: '',
        sortNo: null,
        typeName: '',
        typeId: null,
        type: null
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击编辑
const handleEdit = async (row) => {
    if (TypeEnum.value.length === 0) {
        const resType = await getOrganizationTypeEnumApi();
        TypeEnum.value = resType.data;
    }
    addData.value = {
        ...row,
        type: TypeEnum.value.find(item => item.id === row.typeId)
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 点击新增子部门
const handleAddChildren = async (row) => {
    if (TypeEnum.value.length === 0) {
        const resType = await getOrganizationTypeEnumApi();
        TypeEnum.value = resType.data;
    }
    addData.value = {
        parentId: row.id,
        leader: '',
        nameCn: '',
        nameEn: '',
        remark: '',
        sortNo: null,
        typeName: '',
        typeId: null,
        type: null
    };
    dialogMode.value = 'add';
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
        // 处理 cascader 选择数据（若为数组则取最后一项）
        if (Array.isArray(addData.value.parentId)) {
            const len = addData.value.parentId.length;
            addData.value.parentId = len > 0 ? addData.value.parentId[len - 1] : '0';
            if (addData.value.parentId === '') {
                addData.value.parentId = '0';
            }
        }
        const data = {
            ...addData.value
        };
        if (dialogMode.value === 'upd') {
            res = await updateOrganizationDataApi(data);
        } else {
            res = await addOrganizationDataApi(data);
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
            const resType = await getOrganizationTypeEnumApi();
            TypeEnum.value = resType.data;
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
    const res = await getOrganizationListApi({});
    tableData.value = res.data;
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
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