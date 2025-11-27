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

        <!-- 表格：去掉多选框，改为行点击选中 -->
        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="400"
            @row-click="handleRowClick" :highlight-current-row="true">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column :show-overflow-tooltip="true" prop="sku" label="Sku" />
            <el-table-column :show-overflow-tooltip="true" prop="barcode" label="条码" />
            <el-table-column :show-overflow-tooltip="true" prop="nameCn" label="中文品名" />
            <el-table-column :show-overflow-tooltip="true" prop="nameEn" label="英文品名" />
        </el-table>

        <!-- 分页器 -->
        <el-pagination size="small" background :total="total" :current-page="page" :page-size="pageSize"
            @current-change="handlePageChange" class="elPagination" />

        <!-- 底部 -->
        <template #footer>
            <div style="display: flex;align-items: center;">
                <div style="margin-right: auto;">
                    已选择：{{ selectedRow?.sku || '无' }}
                    <span v-if="selectedRow?.nameCn">（{{ selectedRow.nameCn }}）</span>
                </div>
                <el-button @click="dialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleSelect" :disabled="!selectedRow">{{ getButtonText('confirm')
                    }}</el-button>
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
    customerId: { type: String, default: "" },
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
const initValues = ref({ way: 'skuLike', customerId: props.customerId });
const way = ref([
    { label: 'SKU', value: 'skuLike' },
    { label: '条码', value: 'barcodeLike' },
    { label: '中文品名', value: 'nameCnLike' },
    { label: '英文品名', value: 'nameEnLike' }
])

// 已选行：存储单个SKU对象（改为单选）
const selectedRow = ref(null);

// 弹窗打开时清空选中数据
function handleDialogOpen() {
    selectedRow.value = null; // 清空已选行
    page.value = 1; // 重置到第一页
    nextTick(() => {
        if (tableRef.value) {
            tableRef.value.setCurrentRow(null); // 清除表格当前行高亮
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
    try {
        const data = {
            ...initValues.value,
            page: page.value,
            pageSize: pageSize.value,
            customerId: props.customerId
        };
        const res = await getSkuSkuListApi(trimObjectStrings(data));
        tableData.value = res.data.rows;
        total.value = res.data.total; // 设置总条数
        await nextTick();
        // 回显已选中行的高亮状态
        if (selectedRow.value) {
            const targetRow = tableData.value.find(row => row.sku === selectedRow.value.sku);
            if (targetRow) {
                tableRef.value.setCurrentRow(targetRow);
            }
        }
    } finally {
        loading.value = false;
    }
}

// 行点击事件：选中当前行
function handleRowClick(row) {
    selectedRow.value = row;
    tableRef.value.setCurrentRow(row); // 高亮当前行
}

// 确认选择：传递选中的SKU对象
function handleSelect() {
    if (!selectedRow.value) return;
    dialogVisible.value = false;
    emit("confirm", selectedRow.value); // 传递完整SKU对象
    hydFilterBoxRef.value.handleReset();
}

// 按钮文本
const getButtonText = (type) => type === 'confirm' ? '确认' : '取消';
</script>
<style scoped>
.elPagination {
    margin-top: 10px;
}

:deep(.el-select) {
    width: 175px !important;
}

/* 高亮行样式优化 */
:deep(.el-table__row.current-row) {
    background-color: #e6f7ff !important;
}
</style>