<template>
    <div class="tableView" style="position: sticky;width:1425px;left:0;">
        <el-table v-loading="loading" :data="tableData" border :row-key="(row) => row.id">
            <el-table-column :show-overflow-tooltip="true" v-for="(item, index) in columns" :key="index"
                :prop="item.prop" :label="getColumnText(item.prop)" :width="item.width">
                <template v-if="item.slot === 'customer'" #default="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { getAdjustDetailListByAdjustIdApi } from "@/api/inventoryApi/inventory.js";
import { getColumnText } from '@/utils/i18n/i18nColumns.js'

const props = defineProps({
    id: { type: [String, Number], required: true },
    view: { type: Number, required: false },
    isExpanded: { type: Boolean, default: false }
});

const tableData = ref([]);

const columns = ref([
    { label: '客户', prop: 'customerCode', width: '200', slot: 'customer' },
    { label: 'SKU', prop: 'sku', width: '180' },
    { label: '条码', prop: 'barcode', width: '180' },
    { label: '入库单号', prop: 'inOrderNo', width: '180' },
    { label: '库位号', prop: 'locationCode', width: '180' },
    { label: '品质', prop: 'qualityName', width: '180' },
    { label: '调整数量', prop: 'adjustQty', width: '180' },
    { label: '库存', prop: 'inventoryId', width: '180' },
]);

const loading = ref(false);
const hasLoaded = ref(false);

// 请求函数（仅在需要时调用）
const getList = async () => {
    if (!props.id) return;
    loading.value = true;
    try {
        const res = await getAdjustDetailListByAdjustIdApi({ adjustId: props.id });
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