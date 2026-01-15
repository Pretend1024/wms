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
                        {{ defaultExpandAll ? getButtonText('collapseAll') : getButtonText('expandAll') }}
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
                        <div class="cursor-pointer" @click="handleAddChildren(row)" v-permission="'add'">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>{{ getButtonText('add') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDel(row)" v-permission="'delete'">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>{{ getButtonText('del') }}</span>
                        </div>
                    </div>
                </template>
            </hydTable>
        </div>
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
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
/* 1. 引入 */
// 1.1 Vue核心及插件
import { ref, computed, onMounted, shallowRef, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plus, Sort, Delete, EditPen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 1.2 组件引入
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';

// 1.3 API引入
import {
    getOrganizationListApi,
    getOrganizationTypeEnumApi,
    addOrganizationDataApi,
    updateOrganizationDataApi,
    delOrganizationDataApi
} from '@/api/baseApi/org.js';

// 1.4 工具类引入
import { smartAlert } from '@/utils/genericMethods.js';
import { getButtonText } from '@/utils/i18n/i18nLabels.js';

/* 2. 全局变量与状态 */
const { t } = useI18n();

// 表格数据
const tableData = shallowRef([]);
const loading = ref(true);
const defaultExpandAll = ref(true);
const hydTableRef = ref(null);
const selection = ref({});

// 弹窗状态
const centerDialogVisible = ref(false);
const dialogMode = ref('add');
const childFormRef = ref(null);

// 字典/枚举数据
const TypeEnum = ref([]);
const parentIdList = ref([]);

// 表单数据模型
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

/* 3. 计算属性 */
// 表格列定义
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

// 弹窗标题
const dialogTitle = computed(() => t(`base_org_organization_list.${dialogMode.value}Title`));

// 当前表单组件
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

/* 4. 业务逻辑 (CRUD) */

// 获取列表数据
const getList = async () => {
    loading.value = true;
    try {
        const res = await getOrganizationListApi({});
        tableData.value = res.data;
        parentIdList.value = convertToTree(res.data);
    } finally {
        loading.value = false;
        // 保持展开状态逻辑
        nextTick(() => {
            const $table = hydTableRef.value?.elTableRef;
            if ($table && defaultExpandAll.value) {
                $table.setAllTreeExpand(true);
            }
        });
    }
};

// 点击新增
const handleAdd = async () => {
    await ensureTypeEnum();
    resetFormData();
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击新增子部门
const handleAddChildren = async (row) => {
    await ensureTypeEnum();
    resetFormData();
    addData.value.parentId = row.id;
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击编辑
const handleEdit = async (row) => {
    await ensureTypeEnum();
    addData.value = {
        ...row,
        type: TypeEnum.value.find(item => item.id === row.typeId)
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 点击删除
const handleDel = (row) => {
    ElMessageBox.confirm(
        t('base_org_organization_list.confirmDelete'),
        t('base_org_organization_list.reminder'),
        {
            confirmButtonText: getButtonText('confirm'),
            cancelButtonText: getButtonText('cancel'),
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await delOrganizationDataApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                await getList();
                await ensureTypeEnum(true);
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('base_org_organization_list.deleteCanceled')
            });
        });
};

// 弹窗确认保存
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();

        // 数据处理
        if (Array.isArray(addData.value.parentId)) {
            const len = addData.value.parentId.length;
            addData.value.parentId = len > 0 ? addData.value.parentId[len - 1] : '0';
        }
        if (!addData.value.parentId) {
            addData.value.parentId = '0';
        }

        const data = { ...addData.value };
        let res;

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

/* 5. 辅助方法 */

// 弹窗取消
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 表格行点击
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};

// 切换展开/折叠
const handleExpandAll = () => {
    const $table = hydTableRef.value?.elTableRef;
    if (!$table) return;
    const targetState = !defaultExpandAll.value;
    $table.setAllTreeExpand(targetState);
    defaultExpandAll.value = targetState;
};

// 确保枚举数据已加载
const ensureTypeEnum = async (force = false) => {
    if (TypeEnum.value.length === 0 || force) {
        const resType = await getOrganizationTypeEnumApi();
        TypeEnum.value = resType.data;
    }
};

// 重置表单数据
const resetFormData = () => {
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
};

// 树形数据转换递归函数
const convertToTree = (items) => {
    return items.map(item => ({
        value: item.id,
        label: item.nameCn,
        children: item.children ? convertToTree(item.children) : []
    }));
};

/* 6. 生命周期 */
onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>