<template>
    <el-dialog title="选择SKU" v-model="dialogVisible" width="900" @open="handleDialogOpen" destroy-on-close>
        <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch" @reset="handleReset">
            <template #custom-form="{ formData }">
                <el-col>
                    <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
                </el-col>
            </template>
        </hydFilterBox>

        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="450"
            @selection-change="handleSelectionChange" :row-key="row => row.sku">
            <el-table-column type="selection" width="55" align="center" label-class-name="DisabledSelection"
                :selectable="isSelectable" />
            <el-table-column type="index" label="序号" width="55" align="center">
                <template #default="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="sku" label="SKU" show-overflow-tooltip />
            <el-table-column prop="barcode" label="条码" show-overflow-tooltip />
            <el-table-column prop="nameCn" label="中文品名" show-overflow-tooltip />
            <el-table-column prop="nameEn" label="英文品名" show-overflow-tooltip />
        </el-table>

        <!-- 分页器 -->
        <el-pagination style="margin-top: 10px; text-align:right;" background layout="prev, pager, next, sizes, total"
            :page-size="pageSize" :current-page="currentPage" :total="total" @current-change="handlePageChange"
            @size-change="handleSizeChange" />

        <!-- 弹窗底部 -->
        <template #footer>
            <div style="display:flex;align-items:center;">
                <div style="margin-right:auto;">已选择：{{ selectedSkuSet.size }} / {{ MAX }}</div>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSelect">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import selectInput from "@/components/table/selectInput.vue";
import { getSkuSkuListApi } from "@/api/baseApi/sku.js";
import { trimObjectStrings } from "@/utils/genericMethods.js";

const MAX = 10;

const props = defineProps({
    visible: { type: Boolean, default: false }, // 弹窗显隐（v-model绑定）
    customerCode: { type: String, default: '' }, // 客户代码（用于筛选该客户的SKU）
    existingSkus: { type: Array, default: () => [] } // 已选中的SKU（父组件表格中已有的）
});

// 子组件对外暴露的事件
const emit = defineEmits(["update:visible", "confirm"]);

// 弹窗显隐控制
const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit("update:visible", val) // 通知父组件更新显隐状态
});

const tableRef = ref(null);
const tableData = shallowRef([]);
const loading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);

const formConfig = ref([]);
const initValues = ref({
    way: "skuLike"
});

const way = ref([
    { label: "SKU", value: "skuLike" },
    { label: "条码", value: "barcodeLike" },
    { label: "中文品名", value: "nameCnLike" },
    { label: "英文品名", value: "nameEnLike" }
]);

// 全局选中的SKU集合
const selectedSkuSet = ref(new Set());
// 当前页的选中SKU缓存
const lastPageSkus = ref([]);
// 初始化/分页切换时阻塞selection-change事件
const suppressSelectionChange = ref(false);

// 控制表格行是否可勾选
const isSelectable = (row) => {
    return selectedSkuSet.value.has(row.sku) || selectedSkuSet.value.size < MAX;
};

// 弹窗打开
async function handleDialogOpen() {
    selectedSkuSet.value = new Set(Array.isArray(props.existingSkus) ? props.existingSkus : []);
    currentPage.value = 1;
    await getList();
}

// 获取SKU列表
async function getList() {
    loading.value = true;
    lastPageSkus.value = [];
    try {
        const params = {
            ...initValues.value,
            page: currentPage.value,
            pageSize: pageSize.value,
            customerCode: props.customerCode,
            ...trimObjectStrings(initValues.value)
        };

        const res = await getSkuSkuListApi(params);
        tableData.value = Object.freeze(res.data.rows) || [];
        total.value = res.data.total || 0;

        // 等待DOM渲染完成后，再进行程序化选中（避免表格未渲染导致选中失败）
        await nextTick();
        if (tableRef.value) {
            suppressSelectionChange.value = true; // 阻塞selection-change事件
            tableRef.value.clearSelection(); // 先清空当前页的选中状态

            // 遍历当前页数据，将已在全局选中集合中的SKU程序化选中
            tableData.value.forEach(row => {
                if (selectedSkuSet.value.has(row.sku)) {
                    tableRef.value.toggleRowSelection(row, true);
                }
            });

            // 同步当前页的选中状态到lastPageSkus
            lastPageSkus.value = tableData.value
                .filter(row => selectedSkuSet.value.has(row.sku))
                .map(row => row.sku);

            // 等待Element Plus内部选中状态更新完成
            await new Promise(resolve => setTimeout(resolve, 50));
            suppressSelectionChange.value = false; // 恢复selection-change事件
        }
    } catch (error) {
        ElMessage.error('SKU列表加载失败，请重试');
        console.error('SKU列表请求错误：', error);
    } finally {
        loading.value = false;
    }
}

// 搜索按钮触发
function handleSearch(data) {
    // 根据data.way的值来删掉不需要的字段
    initValues.value = {
        ...data
    }
    // 定义所有可能的字段
    const fields = way.value.map(item => item.value);
    // 筛选出需要删除的字段（排除当前选中的way）
    const fieldsToDelete = fields.filter(field => field !== data.way);
    // 循环删除不需要的字段
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });
    currentPage.value = 1;
    getList();
}

// 重置按钮
function handleReset(data) {
    initValues.value = { ...data, way: "skuLike" };
    currentPage.value = 1;
    getList();
}

// 页码切换触发
function handlePageChange(page) {
    currentPage.value = page;
    getList();
}

// 每页条数切换触发
function handleSizeChange(size) {
    pageSize.value = size;
    currentPage.value = 1;
    getList();
}

// 表格勾选状态变化触发
function handleSelectionChange(selectedRows) {
    // 初始化/分页切换时阻塞，避免程序化选中触发此逻辑
    if (suppressSelectionChange.value) return;

    // 当前页最新的选中SKU数组
    const newPageSkus = selectedRows.map(item => item.sku);

    // 1. 处理新增选中：未在全局集合中且未超最大数量的，加入集合
    newPageSkus.forEach(sku => {
        if (!selectedSkuSet.value.has(sku) && selectedSkuSet.value.size < MAX) {
            selectedSkuSet.value.add(sku);
        }
    });

    // 2. 处理取消选中：上一页选中但当前页未选中的，从集合中删除
    lastPageSkus.value.forEach(sku => {
        if (!newPageSkus.includes(sku)) {
            selectedSkuSet.value.delete(sku);
        }
    });

    // 3. 更新当前页的选中缓存（供下一次变化对比）
    lastPageSkus.value = newPageSkus;
}

// 监听父组件已选SKU变化（父组件删除SKU时，同步更新弹窗的选中状态）
watch(() => props.existingSkus, (newExistingSkus) => {
    const newSet = new Set(Array.isArray(newExistingSkus) ? newExistingSkus : []);
    // 移除全局集合中不在父组件已选列表中的SKU
    selectedSkuSet.value.forEach(sku => {
        if (!newSet.has(sku)) {
            selectedSkuSet.value.delete(sku);
        }
    });
}, { deep: true });

// 确认选择按钮触发
function handleSelect() {
    if (selectedSkuSet.size === 0) {
        ElMessage.warning('请至少选择一个SKU');
        return;
    }
    dialogVisible.value = false;
    emit("confirm", Array.from(selectedSkuSet.value));
}
</script>

<style scoped>
/* 隐藏表格全选框（仅保留行选择框） */
:deep(.DisabledSelection .cell .el-checkbox) {
    display: none !important;
    position: relative;
}

:deep(.DisabledSelection .cell:before) {
    content: "选择";
    position: absolute;
    left: 14px;
    color: #606266;
    font-size: 14px;
}
</style>