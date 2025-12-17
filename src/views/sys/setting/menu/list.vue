<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :tableData="tableData" :columns="columns" :loading="loading" :is-tree="true"
                :tree-props="{ children: 'children' }" @row-click="handleRowClick">
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="success" plain @click="handleToggleExpand" :icon="Sort">
                        {{ isExpanded ? '全部折叠' : '智能展开' }}
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
                        <div class="cursor-pointer" @click="handleAddChildren(row)">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>{{ getButtonText('add') }}</span>
                        </div>
                    </div>
                </template>

                <template #terminal="{ row }">
                    <el-tag v-if="row.terminal == '1'" type="success">员工PC端</el-tag>
                    <el-tag v-if="row.terminal == '2'" type="warning">员工App</el-tag>
                    <el-tag v-if="row.terminal == '3'" type="primary">客户PC端</el-tag>
                </template>
                <template #display="{ row }">
                    <el-tag v-if="row.display" type="success">否</el-tag>
                    <el-tag v-else type="danger">是</el-tag>
                </template>
                <template #nameCn="{ row }">
                    <span>{{ row.nameCn }}</span>
                </template>
                <template #nameEn="{ row }">
                    <span>{{ row.nameEn }}</span>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <component :is="currentForm" ref="childFormRef" :form-data="addData" :parent-id-list="parentIdList"
                :type-enum="TypeEnum" :loginTerminalEnum="loginTerminalEnum" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="菜单">
import { ref, computed, onMounted, shallowRef, nextTick } from 'vue';
import { Plus, Sort, EditPen } from '@element-plus/icons-vue';
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { getSettingMenuApi, getMenuTypeEnumApi, getLoginTerminalEnumApi, addSettingMenuApi, updSettingMenuByIdApi } from '@/api/sysApi/setting.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表格及状态
const hydTableRef = ref(null);
const tableData = shallowRef([]);
const loading = ref(true);
const isExpanded = ref(true);

const columns = ref([
    { label: '菜单中文', prop: 'nameCn', width: '180' },
    { label: '菜单英文', prop: 'nameEn', width: '180' },
    { label: '用户端', prop: 'terminal', width: '135', slot: 'terminal' },
    { label: '类型', prop: 'typeName', width: '100' },
    { label: '是否隐藏', prop: 'display', width: '120', slot: 'display' },
    { label: 'URL', prop: 'url', width: '250' },
    { label: '图标', prop: 'iconCls', width: '100' },
    { label: '序号', prop: 'sortNo', width: '120' },
    { label: '权限代码', prop: 'permissionCode', width: '320' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '150', fixed: 'right', slot: 'customBtn' }
]);

const selection = ref({});
const handleRowClick = (row) => {
    selection.value = row;
};

// ================== 核心折叠/展开逻辑 ==================

/**
 * 智能递归展开函数
 * 逻辑：如果子节点中存在 typeId 为 20 的项（按钮），则视为叶子层级，不展开当前行。
 * 否则展开当前行并继续递归检查子级。
 * @param {Array} data 数据源
 */
const expandRecursive = (data) => {
    const elTable = hydTableRef.value?.elTableRef;
    if (!elTable) return;

    data.forEach(row => {
        if (row.children && row.children.length > 0) {
            // 检查子节点是否包含 typeId 为 20 的数据
            // 注意：这里假设只要有一个子节点是按钮，就不展开该行（通常按钮和子菜单不会混排，或者混排时也不建议展开）
            const hasButtonChild = row.children.some(child => child.typeId == 20);

            if (!hasButtonChild) {
                // 如果子级不是按钮，展开当前行
                elTable.toggleRowExpansion(row, true);
                // 继续递归检查子级
                expandRecursive(row.children);
            } else {
                // 如果子级包含按钮，折叠当前行（不展开）
                elTable.toggleRowExpansion(row, false);
            }
        }
    });
};

/**
 * 递归折叠函数
 */
const collapseRecursive = (data) => {
    const elTable = hydTableRef.value?.elTableRef;
    if (!elTable) return;

    data.forEach(row => {
        elTable.toggleRowExpansion(row, false);
        if (row.children && row.children.length > 0) {
            collapseRecursive(row.children);
        }
    });
};

/**
 * 切换按钮点击事件
 */
const handleToggleExpand = () => {
    isExpanded.value = !isExpanded.value;

    if (isExpanded.value) {
        // 智能展开：避开 typeId=20 的层级
        expandRecursive(tableData.value);
    } else {
        // 全部折叠
        collapseRecursive(tableData.value);
    }
};

// ================== 数据获取 ==================

const getList = async () => {
    loading.value = true;
    const res = await getSettingMenuApi({});
    tableData.value = res.data;

    // 构建上级部门下拉树
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    parentIdList.value = convertToTree(res.data);

    loading.value = false;

    // 使用 nextTick 确保表格渲染完毕，再执行智能展开
    nextTick(() => {
        expandRecursive(tableData.value);
        isExpanded.value = true;
    });
};

// ================== 其他业务逻辑 (新增/编辑/枚举) ==================

const centerDialogVisible = ref(false);
const addData = ref({});
const dialogMode = ref('add');
const dialogTitle = computed(() => t(`sys_setting_menu_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const childFormRef = ref(null);
const TypeEnum = ref([]);
const parentIdList = ref([]);
const loginTerminalEnum = ref([]);

const getTypeEnum = async () => {
    const res = await getMenuTypeEnumApi();
    TypeEnum.value = res.data;
};
const getLoginTerminalEnum = async () => {
    const res = await getLoginTerminalEnumApi();
    loginTerminalEnum.value = res.data;
}

const handleAdd = () => {
    if (!TypeEnum.value.length) getTypeEnum();
    if (!loginTerminalEnum.value.length) getLoginTerminalEnum();
    addData.value = {
        nameCn: '', nameEn: '', typeId: null, parentId: '',
        terminal: '', url: '', sortNo: '', permissionCode: '', display: true
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleEdit = (row) => {
    if (!TypeEnum.value.length) getTypeEnum();
    if (!loginTerminalEnum.value.length) getLoginTerminalEnum();
    addData.value = { ...row };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

const handleAddChildren = (row) => {
    if (!TypeEnum.value.length) getTypeEnum();
    if (!loginTerminalEnum.value.length) getLoginTerminalEnum();
    addData.value = {
        parentId: row.id, nameCn: '', sortNo: '', nameEn: '',
        typeId: null, terminal: '', url: '', permissionCode: ''
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

const handleDialogConfirm = async () => {
    if (Array.isArray(addData.value.parentId)) {
        addData.value.parentId = addData.value.parentId[addData.value.parentId.length - 1];
    }
    try {
        await childFormRef.value.validate();
        const loadingInstance = ElLoading.service({ lock: true, text: 'Loading' });
        try {
            const api = addData.value.id ? updSettingMenuByIdApi : addSettingMenuApi;
            const res = await api(addData.value);
            loadingInstance.close();
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                centerDialogVisible.value = false;
                getList();
            }
        } catch (e) {
            loadingInstance.close();
            smartAlert(e.msg || '操作失败', false, 1000);
        }
    } catch (e) {
        smartAlert(e.msg || '操作失败', false, 1000);
    }
};

onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>