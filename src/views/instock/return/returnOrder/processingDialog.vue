<template>
    <el-dialog v-model="visible" :title="title" width="1000px" align-center destroy-on-close>
        <div class="formBlock">
            <div class="formItem">
                <p>仓库代码</p>
                <p class="formItemContent">{{ formData.warehouseCode }}</p>
            </div>
            <div class="formItem">
                <p>客户代码</p>
                <p class="formItemContent">{{ formData.customerCode }}</p>
            </div>
            <div class="formItem">
                <p>退件单号</p>
                <p class="formItemContent">{{ formData.returnOrderNo }}</p>
            </div>
        </div>
        <!-- 实收商品表格 -->
        <div class="table-block">
            <h3>实收商品</h3>
            <el-table :data="receiveList" border stripe height="200px" style="width: 100%">
                <el-table-column prop="sku" label="SKU" width="150" />
                <el-table-column prop="receivedQty" label="实收数量" width="85" />
                <el-table-column prop="processedQty" label="已处理数量" width="95" />
                <el-table-column prop="pendingQty" label="待处理数量" width="95" />
                <el-table-column prop="method" label="处理方式" width="115">
                    <template #default="scope">
                        <el-select v-model="scope.row.method" placeholder="请选择">
                            <el-option label="销毁" value="销毁" />
                            <el-option label="上架" value="上架" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="handleQty" label="处理数量" width="125">
                    <template #default="scope">
                        <el-input v-model="scope.row.handleQty" v-number />
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="库位">
                    <template #default="scope">
                        <el-input v-model="scope.row.location" placeholder="请输入库位" />
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 处理记录表格 -->
        <div class="table-block">
            <h3>处理记录</h3>
            <el-table :data="recordList" border stripe style="width: 100%" height="200px">
                <el-table-column prop="sku" label="SKU" width="150" />
                <el-table-column prop="method" label="处理方式" width="85" />
                <el-table-column prop="handleQty" label="处理数量" width="85" />
                <el-table-column prop="location" label="库位" width="200" />
                <el-table-column prop="handler" label="处理人" width="120" />
                <el-table-column prop="time" label="处理时间" />
            </el-table>
        </div>

        <!-- 底部按钮 -->
        <template #footer>
            <el-button @click="handleClose">{{ getButtonText('cancel') }}</el-button>
            <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
const props = defineProps({
    title: { type: String, default: "处理弹窗" },
    orderId: { type: String, default: "" }
});
const emits = defineEmits(["saved", "close"]);

const visible = ref(false);
// 表单数据
const formData = reactive({
    warehouseCode: "test1(美西)", // 仓库代码
    customerCode: "test1(张三)", // 客户代码
    returnOrderNo: "ABC1354354" // 退件单号
});
// 表格数据（示例，实际要从接口获取）
const receiveList = ref([
    { sku: "SKU001", receivedQty: 100, processedQty: 20, pendingQty: 80, method: "", handleQty: 0, location: "" },
    { sku: "SKU002", receivedQty: 50, processedQty: 10, pendingQty: 40, method: "", handleQty: 0, location: "" }
]);

const recordList = ref([
    { sku: "SKU001", method: "销毁", handleQty: 10, location: "A01", handler: "张三", time: "2025-08-01 12:00" },
    { sku: "SKU002", method: "上架", handleQty: 5, location: "B02", handler: "李四", time: "2025-08-02 14:30" }
]);

// 暴露方法给父组件
const open = () => {
    visible.value = true;
};
const handleClose = () => {
    visible.value = false;
    emits("close");
};
const handleSave = async () => {
    const payload = receiveList.value.map(item => ({
        sku: item.sku,
        method: item.method,
        handleQty: item.handleQty,
        location: item.location
    }));
    const res = await saveHandleApi(props.orderId, payload);
    if (res.success) {
        visible.value = false;
        emits("saved", payload);
    }
};

// 客户代码
const customerOptions = ref([]);
// 仓库下拉框数据
const warehouseOptions = ref([])
onMounted(async () => {
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    // 客户代码
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
})

defineExpose({ open });
</script>

<style scoped>
.table-block {
    margin-bottom: 20px;
}

.formBlock {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.formItem {
    width: 29%;
    background-color: #f2f3f5;
    padding: 15px 15px;
    border-radius: 5px;
}

.formItemContent {
    font-size: 17px;
    color: black;
    margin-top: 8px;
}
</style>