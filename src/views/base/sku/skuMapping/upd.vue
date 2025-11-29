<template>
    <div class="form-container">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                        <el-select v-model="formData.customerCode" filterable
                            :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select" clearable
                            disabled>
                            <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="getLabel('platformSku')" prop="platformSku">
                        <el-input v-model="formData.platformSku" :placeholder="getPlaceholder('platformSku')"
                            disabled />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 选择SKU按钮 -->
        <el-button type="primary" :icon="Plus" @click="handleAddRow" style="margin-bottom: 10px;">
            选择SKU
        </el-button>

        <!-- SKU表格 -->
        <el-table :data="tableData" border stripe style="width: 100%;" height="380">
            <el-table-column label="SKU" prop="sku" />
            <!-- 数量 -->
            <el-table-column label="数量" width="130">
                <template #default="scope">
                    <el-input v-model="scope.row.qty" v-intNumber placeholder="请输入数量" style="width: 100%;" />
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button type="danger" size="small" :icon="Delete" @click="handleDeleteRow(scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- SKU选择弹窗 -->
    <skuSelectDialog v-model:visible="skuDialogVisible" :customerCode="formData.customerCode"
        :existingSkus="tableData.map(item => item.sku)" @confirm="handleSkuConfirm" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import skuSelectDialog from './skuSelectDialog.vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getSkuMappingDataByIdApi } from '@/api/baseApi/sku.js';

// 父组件传入的props
const props = defineProps({
    customerOptions: { type: Array, default: () => [] },
    formData: {
        type: Object,
        default: () => ({
            id: '',
            customerCode: '',
            platformSku: ''
        })
    },
});


const formRef = ref(null);
const tableData = shallowRef([]);
const skuDialogVisible = ref(false);

// 表单校验规则
const rules = {
    customerCode: [{ required: true, message: '请输入客户代码', trigger: 'change' }],
    platformSku: [{ required: true, message: '请输入SKU映射', trigger: 'blur' }]
};

// 打开SKU选择弹窗（先校验客户代码）
const handleAddRow = () => {
    if (!props.formData.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    skuDialogVisible.value = true;
};

// 确认选择SKU
const handleSkuConfirm = (selectedSkus) => {
    // 保留已有SKU的数量
    const oldQtyMap = new Map(tableData.value.map(item => [item.sku, item.qty]));
    tableData.value = selectedSkus.map(sku => ({
        sku,
        qty: oldQtyMap.has(sku) ? oldQtyMap.get(sku) : 1
    }));
};

// 删除表格中的SKU行
const handleDeleteRow = (index) => {
    tableData.value.splice(index, 1);
};

onMounted(async () => {
    const res = await getSkuMappingDataByIdApi({ id: props.formData.id });
    if (res.success) {
        tableData.value = res.data.items.map(item => ({
            sku: item.sku,
            qty: item.qty
        }));
    }
});

defineExpose({
    validate: () => formRef.value?.validate() || Promise.reject(),
    getTableData: () => [...tableData.value]
});
</script>

<style scoped>
.form-container {
    padding: 20px;
}

:deep(.el-table .el-input) {
    width: 100%;
}

:deep(.el-cascader) {
    width: 100%;
}
</style>