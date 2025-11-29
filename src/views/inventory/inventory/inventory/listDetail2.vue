<template>
    <div class="tableView" style="position: sticky;width:1425px;left:0;">
        <el-table v-loading="loading" :data="tableData" border :row-key="(row) => row.id">
            <!-- <el-table-column lable="序号" type="index" width="68" align="center" fixed /> -->
            <el-table-column :show-overflow-tooltip="true" v-for="(item, index) in columns" :key="index"
                :prop="item.prop" :label="getColumnText(item.prop)" :width="item.width" />
        </el-table>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { getInventoryInventoryListDetailApi } from "@/api/inventoryApi/inventory.js";
import { getColumnText } from '@/utils/i18n/i18nColumns.js'

const props = defineProps({
    id: { type: [String, Number], required: true },
    view: { type: Number, required: false },
    isExpanded: { type: Boolean, default: false }
});

const tableData = shallowRef([]);
const columns = ref([
    { label: '入库单号', prop: 'inOrderNo', width: '180' },
    { label: '状态', prop: 'statusName', width: '100' },
    { label: '上架日期', prop: 'inShelfDate', width: '140' },
    { label: '库龄', prop: 'instockDays', width: '100' },
    { label: '总数', prop: 'qtyTotal', width: '85' },
    { label: '可用数', prop: 'qtyAvail', width: '85' },
    { label: '锁定数量', prop: 'qtyLock', width: '85' },
]);

const loading = ref(false);
const hasLoaded = ref(false);

// 请求函数（仅在需要时调用）
const getList = async () => {
    if (!props.id) return;
    loading.value = true;
    try {
        const res = await getInventoryInventoryListDetailApi({ view: props.view, id: props.id });
        tableData.value = res.data || [];
        hasLoaded.value = true;
    } catch (err) {
        console.error('获取展开行数据失败：', err);
        tableData.value = [];
    } finally {
        loading.value = false;
    }
};

// 监听 isExpanded 与 id：当 isExpanded 为 true 时触发加载。
// 这里采用 hasLoaded 控制只第一次展开请求；若你想每次展开都刷新，请删除 hasLoaded 条件。
watch(
    [() => props.isExpanded, () => props.id],
    ([newIsExpanded, newId], [oldIsExpanded, oldId]) => {
        if (newIsExpanded && (!hasLoaded.value || newId !== oldId)) {
            getList();
        } else if (!newIsExpanded) {
            // 如果收起希望清空数据（可选），这里不强制清空，保留以便再次展开展示快速
            // tableData.value = []
        }
    },
    { immediate: true }
);

// 组件卸载时清理状态（防止复用带来脏数据）
onUnmounted(() => {
    hasLoaded.value = false;
    tableData.value = [];
});
</script>


<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';

.tableDiv {
    padding: 0;
}

:deep(.el-table__header-wrapper th) {
    background-color: white !important;
    font-weight: 400;
}

.tableView {
    padding: 10px 55px;
    margin: -8px 0;
    background: #f8f9fa;
}
</style>