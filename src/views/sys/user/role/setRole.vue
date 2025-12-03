<template>
    <h4>{{ props.formData.name }}</h4>
    <el-table ref="tableRef" v-loading="loading" :data="tableData" row-key="id" default-expand-all border
        max-height="450" @select="handleRowSelect" @select-all="handleSelectAll">
        <el-table-column type="index" width="55" fixed align='center' label="序号"></el-table-column>
        <el-table-column type="selection" width="55" align='center' />

        <el-table-column prop="nameCn" label="菜单名字">
            <template #default="{ row }">
                <div class="menu-row-wrapper">
                    <span class="menu-label">{{ row.nameCn }}</span>
                    <div v-if="row.buttons && row.buttons.length > 0" class="menu-buttons">
                        <el-checkbox v-for="btn in row.buttons" :key="btn.id" v-model="btn.checked" :label="btn.nameCn"
                            @change="(val) => handleButtonChange(val, row)">
                            {{ btn.nameCn }}
                        </el-checkbox>
                    </div>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { getUserRoleMenuApi } from '@/api/sysApi/user.js'

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const tableData = ref([]);
const loading = ref(true);
const tableRef = ref(null);

onMounted(async () => {
    const res = await getUserRoleMenuApi({ roleId: props.formData.id })
    // 1. 处理数据
    tableData.value = processTreeData(res.data);

    // 2. 初始化选中状态（核心修改点）
    nextTick(() => {
        initSelection(tableData.value);
    });
    loading.value = false;
})

// 处理菜单数据为树结构
const processTreeData = (data) => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
        const isAuthorized = item.authorized || false;

        let newItem = {
            ...item,
            checked: isAuthorized,
            buttons: [],
            children: []
        };

        if (item.children && item.children.length > 0) {
            const buttons = [];
            const subMenus = [];

            item.children.forEach(child => {
                // typeId 20 是按钮
                if (child.typeId == 20) {
                    buttons.push({
                        ...child,
                        // 优先使用按钮自己的权限状态，如果父级没权限，按钮肯定没权限
                        checked: child.authorized || false
                    });
                } else {
                    subMenus.push(child);
                }
            });

            newItem.buttons = buttons;

            if (subMenus.length > 0) {
                newItem.children = processTreeData(subMenus);
            }
        }
        return newItem;
    });
};

//只勾选叶子节点
const initSelection = (nodes) => {
    nodes.forEach(row => {
        const hasChildren = row.children && row.children.length > 0;

        if (hasChildren) {
            // 如果有子菜单，千万不要勾选当前行！
            // 而是递归进去，让子菜单的状态来决定父菜单的状态
            initSelection(row.children);
        } else {
            // 只有当它是最底层的菜单（叶子节点）
            if (row.checked) {
                tableRef.value.toggleRowSelection(row, true);
            }
        }
    });
};

// ================== 联动逻辑，用于用户手动操作 ==================
// 递归同步节点下所有按钮的选中状态
const toggleButtonsRecursive = (node, status) => {
    if (node.buttons && node.buttons.length > 0) {
        node.buttons.forEach(btn => {
            btn.checked = status;
        });
    }
    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            toggleButtonsRecursive(child, status);
        });
    }
};
// 行选择时联动按钮
const handleRowSelect = (selection, row) => {
    const isSelected = selection.some(item => item.id === row.id);
    toggleButtonsRecursive(row, isSelected);
};
// 全选/取消全选时联动所有按钮
const handleSelectAll = (selection) => {
    const isAllSelected = selection.length > 0;
    tableData.value.forEach(node => {
        toggleButtonsRecursive(node, isAllSelected);
    });
};

// 按钮勾选时自动选中所属菜单
const handleButtonChange = (val, parentRow) => {
    if (val) {
        tableRef.value.toggleRowSelection(parentRow, true);
    }
};
// 获取最终选中的菜单和按钮 ID
const handleSelection = async () => {
    const selectedRows = tableRef.value.getSelectionRows();
    let ids = new Set(selectedRows.map(row => row.id));
    const findCheckedButtons = (nodes) => {
        nodes.forEach(row => {
            if (row.buttons && row.buttons.length > 0) {
                row.buttons.forEach(btn => {
                    if (btn.checked) ids.add(btn.id);
                })
            }
            if (row.children && row.children.length > 0) {
                findCheckedButtons(row.children);
            }
        })
    }
    findCheckedButtons(tableData.value);

    return Array.from(ids);
}

defineExpose({
    handleSelection
});
</script>

<style scoped>
h4 {
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    margin: 0;
}

:deep(.el-table .cell) {
    white-space: normal !important;
    display: block;
}

.menu-row-wrapper {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    width: auto;
    max-width: 100%;
}

.menu-label {
    margin-right: 20px;
    font-weight: normal;
    color: #606266;
    flex-shrink: 0;
    line-height: 24px;
    margin-top: 0;
    margin-bottom: 0;
    display: inline-block;
    width: 75px;
}

.menu-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 315px;
}

.menu-buttons :deep(.el-checkbox) {
    margin-right: 0;
    height: 24px;
    line-height: 24px;
}
</style>