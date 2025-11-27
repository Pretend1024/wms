<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :tableData="tableData" :columns="columns" :loading="loading" :is-tree="true"
                :row-key="id" :tree-props="{ children: 'children' }" :defaultExpandAll="defaultExpandAll"
                @row-click="handleRowClick">
                <!-- 表格上方操作按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'menu:add'" :icon="Plus">{{ getButtonText
                        ('add') }}</el-button>
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
                    </div>
                </template>
                <template #terminal="{ row }">
                    <div v-if="row.terminal == '1'">
                        <el-tag type="success">员工PC端</el-tag>
                    </div>
                    <div v-if="row.terminal == '2'">
                        <el-tag type="warning">员工App</el-tag>
                    </div>
                    <div v-if="row.terminal == '3'">
                        <el-tag type="primary">客户PC端</el-tag>
                    </div>
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
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 根据 dialogMode 动态加载 add.vue 或 upd.vue -->
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

<script setup name="系统菜单">
import { ref, computed, onMounted } from 'vue';
import { Plus, Sort, Delete, EditPen } from '@element-plus/icons-vue';
import hydTable from '@/components/table/hyd-table.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { getSettingMenuApi, getMenuTypeEnumApi, getLoginTerminalEnumApi, addSettingMenuApi, updSettingMenuByIdApi } from '@/api/sysApi/setting.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 表格数据及配置
const tableData = ref([]);
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
    nameCn: '',
    nameEn: '',
    typeId: null,
    parentId: '',
    terminal: '',
    url: '',
    display: '',
    permissionCode: '',
    sortNo: ''
});

// dialogMode 用于区分 "add"（新增）与 "upd"（编辑）
const dialogMode = ref('add');
const dialogTitle = computed(() => t(`sys_setting_menu_list.${dialogMode.value}Title`));
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);
const childFormRef = ref(null);

// 部门类型枚举和上级部门数据
const TypeEnum = ref([]);
const parentIdList = ref([]);
const loginTerminalEnum = ref([]);

// 点击新增
const handleAdd = async () => {
    if (TypeEnum.value.length === 0) {
        getTypeEnum()
    }
    if (loginTerminalEnum.value.length === 0) {
        getLoginTerminalEnum()
    }
    // 重置表单数据
    addData.value = {
        nameCn: '',
        nameEn: '',
        typeId: null,
        parentId: '',
        terminal: '',
        url: '',
        sortNo: '',
        permissionCode: '',
        display: true,
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 点击编辑
const handleEdit = async (row) => {
    if (TypeEnum.value.length === 0) {
        getTypeEnum()
    }
    if (loginTerminalEnum.value.length === 0) {
        getLoginTerminalEnum()
    }
    addData.value = {
        ...row
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};

// 点击新增子部门
const handleAddChildren = async (row) => {
    if (TypeEnum.value.length === 0) {
        getTypeEnum()
    }
    if (loginTerminalEnum.value.length === 0) {
        getLoginTerminalEnum()
    }
    addData.value = {
        parentId: row.id,
        nameCn: '',
        sortNo: '',
        nameEn: '',
        typeId: null,
        terminal: '',
        url: '',
        permissionCode: '',
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
    // 判断是否是数组
    if (Array.isArray(addData.value.parentId)) {
        const len = addData.value.parentId.length;
        addData.value.parentId = addData.value.parentId[len - 1];
    }
    console.log('提交的数据:', addData.value);
    loading.value = true;
    try {
        // 表单验证
        await childFormRef.value.validate();
        const loadingInstance = ElLoading.service({
            lock: true,
            text: 'Loading'
        });
        try {
            // 根据是否存在ID选择API
            const api = addData.value.id ? updSettingMenuByIdApi : addSettingMenuApi;
            const res = await api(addData.value);
            console.log('提交成功:', res);
            loadingInstance.close();
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                centerDialogVisible.value = false;
                getList();
            }
        } catch (error) {
            loadingInstance.close();
            smartAlert(error.msg, false, 1000);
        }
        loading.value = false;
    } catch (error) {
        throw error; // 抛出错误以便外部处理
    }
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
    const res = await getSettingMenuApi({});
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
// 获取下拉框枚举数据
const getTypeEnum = async () => {
    const resType = await getMenuTypeEnumApi();
    TypeEnum.value = resType.data;
};
const getLoginTerminalEnum = async () => {
    const resLoginTerminalEnum = await getLoginTerminalEnumApi();
    loginTerminalEnum.value = resLoginTerminalEnum.data;
}

onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>