<template>
    <h4>{{ props.formData.name }}</h4>
    <el-table ref="tableRef" v-loading="loading" :data="tableData" row-key="id" default-expand-all border
        max-height="450">
        <el-table-column type="index" width="55" fixed align='center' label="序号"></el-table-column>
        <el-table-column type="selection" width="55" align='center' />
        <el-table-column prop="nameCn" label="菜单名字" />
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

const tableData = shallowRef([]);
const loading = ref(true);
const tableRef = ref(null);
const menuIds = ref([])

const handleSelection = async () => {
    menuIds.value = tableRef.value.getSelectionRows().map(row => row.id);
    return menuIds.value;
}

onMounted(async () => {
    const res = await getUserRoleMenuApi({ roleId: props.formData.id })
    tableData.value = processTreeData(res.data);
    // console.log('表格数据:', tableData.value);
    // 设置选中状态
    nextTick(() => {
        const toggleSelection = (nodes) => {
            nodes.forEach(row => {
                if (row.checked) {
                    tableRef.value.toggleRowSelection(row, true);
                }
                if (row.children) {
                    toggleSelection(row.children); // 递归处理子节点
                }
            });
        };
        toggleSelection(tableData.value);
    });
    loading.value = false;
})

defineExpose({
    handleSelection
});

// 递归处理树形数据，设置checked状态
const processTreeData = (data) => {
    return data.map(item => {
        // 先处理子节点
        const children = processTreeData(item.children || []);
        let checked = item.authorized;
        // 如果有子节点，检查子节点是否存在未选中的情况
        if (children.length > 0) {
            const hasUnauthorizedChild = children.some(child => !child.checked);
            if (hasUnauthorizedChild) {
                checked = false;
            }
        }
        return {
            ...item,
            checked,
            children
        };
    });
};
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
</style>