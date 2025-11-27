<template>
    <h4>批量分配角色</h4>
    <el-table ref="tableRef" v-loading="loading" :data="tableData" row-key="id" default-expand-all border
        max-height="450">
        <el-table-column type="index" width="55" fixed align='center' label="序号"></el-table-column>
        <el-table-column type="selection" width="55" align='center' />
        <el-table-column prop="name" label="角色名字" />
    </el-table>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { getUserListUserRoleApi, getUserRoleApi } from '@/api/sysApi/user.js'

const props = defineProps({
    formData: {
        type: Object
    }
});

const tableData = ref([]);
const loading = ref(true);
const tableRef = ref(null);
const roleIds = ref([])

const handleSelection = async () => {
    roleIds.value = tableRef.value.getSelectionRows().map(row => row.id);
    return roleIds.value;
}

onMounted(async () => {
    let res
    res = await getUserRoleApi({ pageSize: 0 })
    tableData.value = res.data;
    // 设置选中状态
    nextTick(() => {
        tableData.value.forEach(row => {
            if (row.authorized) {
                tableRef.value.toggleRowSelection(row, true);
            }
        });
    });
    loading.value = false;
})

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
</style>