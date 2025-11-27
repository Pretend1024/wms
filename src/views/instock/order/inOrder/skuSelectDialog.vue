<template>
    <el-dialog title="选择Sku" v-model="dialogVisible" width="900" @open="handleDialogOpen" destroy-on-close>
        <!-- 搜索条件 -->
        <hydFilterBox ref="hydFilterBoxRef" :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
            @reset="handleReset">
            <template #custom-form="{ formData }">
                <el-col>
                    <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
                </el-col>
            </template>
        </hydFilterBox>

        <!-- 表格 -->
        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="400"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="sku" label="Sku" />
            <el-table-column prop="barcode" label="条码" />
            <el-table-column prop="nameCn" label="中文品名" />
            <el-table-column prop="nameEn" label="英文品名" />
        </el-table>

        <!-- 分页器 -->
        <el-pagination size="small" background :total="total" :current-page="page" :page-size="pageSize"
            @current-change="handlePageChange" class="elPagination" />

        <!-- 底部 -->
        <template #footer>
            <div style="display: flex;align-items: center;">
                <div style="margin-right: auto;">已选择：{{ selectedData.size }} 条</div>
                <el-button @click="dialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleSelect">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, computed } from "vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import { getSkuSkuListApi } from '@/api/baseApi/sku.js'
import { trimObjectStrings } from "@/utils/genericMethods.js";
import selectInput from '@/components/table/selectInput.vue'

const props = defineProps({
    customerCode: { type: String, default: "" },
    visible: { type: Boolean, default: false }, // 外部控制显示/隐藏
});


const emit = defineEmits(["update:visible", "confirm"]);

// 弹窗显示状态
const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit("update:visible", val),
});

const tableRef = ref(null);
const tableData = ref([]);
const loading = ref(false);
const total = ref(0); // 总条数
const page = ref(1); // 当前页码
const pageSize = ref(50); // 每页条数

// 过滤器配置
const formConfig = ref([]);
const initValues = ref({ way: 'skuLike', customerCode: props.customerCode });
const way = ref([
    { label: 'SKU', value: 'skuLike' },
    { label: '条码', value: 'barcodeLike' },
    { label: '中文品名', value: 'nameCnLike' },
    { label: '英文品名', value: 'nameEnLike' }
])

// 已选集合 - 存储 sku
const selectedData = ref(new Set());
const lastPageCodes = ref([]);

// 弹窗打开时清空选中数据
function handleDialogOpen() {
    selectedData.value.clear();   // 清空已选集合
    lastPageCodes.value = [];     // 清空当前页选中缓存
    page.value = 1;               // 重置到第一页
    nextTick(() => {
        if (tableRef.value) {
            tableRef.value.clearSelection(); // 清除表格的勾选状态
        }
    });
}

const hydFilterBoxRef = ref(null);

// 搜索
function handleSearch(data) {
    initValues.value = { ...data };
    page.value = 1;
    getList();
}

// 重置
function handleReset(data) {
    initValues.value = { ...data };
    page.value = 1;
    getList();
}

// 分页变化
function handlePageChange(newPage) {
    page.value = newPage;
    getList();
}

// 请求列表
async function getList() {
    loading.value = true;
    lastPageCodes.value = [];
    try {
        const data = {
            ...initValues.value,
            page: page.value,
            pageSize: pageSize.value,
            customerCode: props.customerCode
        };
        const res = await getSkuSkuListApi(trimObjectStrings(data));
        tableData.value = res.data.rows;
        total.value = res.data.total; // 设置总条数
        await nextTick();
        tableRef.value.clearSelection();
        // 用 sku 来回显已选择
        tableData.value.forEach((row) => {
            if (selectedData.value.has(row.sku)) {
                tableRef.value.toggleRowSelection(row, true);
            }
        });
    } finally {
        loading.value = false;
    }
}

// 选中变化
function handleSelectionChange(val) {
    const newPageCodes = val.map((item) => item.sku);
    newPageCodes.forEach((sku) => selectedData.value.add(sku));
    lastPageCodes.value.forEach((sku) => {
        if (!newPageCodes.includes(sku)) {
            selectedData.value.delete(sku);
        }
    });
    lastPageCodes.value = newPageCodes;
}

// 确认选择
function handleSelect() {
    dialogVisible.value = false;
    const result = Array.from(selectedData.value);
    emit("confirm", result);
    hydFilterBoxRef.value.handleReset()
}
</script>
<style scoped>
.elPagination {
    margin-top: 10px;
}

:deep(.el-select) {
    width: 175px !important;
}
</style>