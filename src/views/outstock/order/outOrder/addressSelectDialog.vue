<template>
    <el-dialog title="选择地址" v-model="dialogVisible" width="900" @open="handleDialogOpen" destroy-on-close>
        <!-- 表格 -->
        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="400"
            @row-click="handleRowClick" @row-dblclick="handleRowDblClick" :row-class-name="tableRowClassName">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column :show-overflow-tooltip="true" prop="typeName" label="配置类型" width="100" />
            <el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" width="120" />
            <el-table-column :show-overflow-tooltip="true" prop="phoneNumber1" label="联系电话" width="150" />
            <el-table-column :show-overflow-tooltip="true" prop="addressLine1" label="详细地址" />
        </el-table>

        <!-- 分页器 -->
        <div class="elPagination">
            <el-pagination size="small" background :total="total" :current-page="page" :page-size="pageSize"
                @current-change="handlePageChange" />
        </div>
        <!-- 底部 -->
        <template #footer>
            <div style="display: flex;align-items: center;">
                <div style="margin-right: auto;"><span v-if="selectedRow">已选择：{{ selectedRow.name }}</span></div>
                <el-button @click="dialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleSelect" :disabled="!selectedRow">{{ getButtonText('confirm')
                }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { getBasicAddressPageApi } from '@/api/baseApi/basic.js'
import { trimObjectStrings } from "@/utils/genericMethods.js";

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
const tableData = shallowRef([]);
const loading = ref(false);
const total = ref(0); // 总条数
const page = ref(1); // 当前页码
const pageSize = ref(50); // 每页条数
const selectedRow = ref(null); // 当前选中的行

// 弹窗打开时初始化
function handleDialogOpen() {
    selectedRow.value = null; // 清空选中行
    page.value = 1; // 重置到第一页
    getList(); // 加载数据
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
            page: page.value,
            pageSize: pageSize.value,
            customerCode: props.customerCode
        };
        const res = await getBasicAddressPageApi(trimObjectStrings(data));
        tableData.value = res.data.rows;
        total.value = res.data.total; // 设置总条数
    } finally {
        loading.value = false;
    }
}

// 处理行点击事件
function handleRowClick(row) {
    selectedRow.value = row;
}

// 处理行双击事件
function handleRowDblClick(row) {
    emit("confirm", row);
    dialogVisible.value = false;
}

// 表格行样式，用于高亮选中行
function tableRowClassName({ row }) {
    return row === selectedRow.value ? 'selected-row' : '';
}

// 确认选择
function handleSelect() {
    if (selectedRow.value) {
        dialogVisible.value = false;
        emit("confirm", selectedRow.value);
    }
}

// 按钮文本国际化处理
function getButtonText(type) {
    const texts = {
        cancel: '取消',
        confirm: '确认'
    };
    return texts[type] || '';
}
</script>
<style scoped>
.elPagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

:deep(.el-select) {
    width: 175px !important;
}

/* 选中行的样式 */
:deep(.selected-row) {
    background-color: #f0f7ff !important;
}
</style>
