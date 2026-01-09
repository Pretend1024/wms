<template>
    <el-dialog v-model="visible" :title="title" width="1000px" align-center destroy-on-close
        :close-on-click-modal="false">

        <div class="formBlock">
            <div class="formItem">
                <p>仓库信息</p>
                <p class="formItemContent">{{ formData.warehouseCode ?
                    `${formData.warehouseCode}(${formData.warehouseName})` : '-' }}</p>
            </div>
            <div class="formItem">
                <p>客户信息</p>
                <p class="formItemContent">{{ formData.customerCode ?
                    `${formData.customerCode}(${formData.customerName})` : '-' }}</p>
            </div>
            <div class="formItem">
                <p>退件单号</p>
                <p class="formItemContent">{{ formData.orderNo }}</p>
            </div>
        </div>

        <div class="table-block">
            <h3>实收商品</h3>
            <el-table :data="receiveList" border stripe height="250px" style="width: 100%">
                <el-table-column prop="sku" label="SKU" width="180" show-overflow-tooltip />
                <el-table-column prop="qualityName" label="品质" width="100" show-overflow-tooltip />
                <el-table-column prop="receivedQty" label="实收数量" width="90" align="center" />
                <el-table-column prop="processedQty" label="已处理" width="90" align="center" />
                <el-table-column prop="pendingQty" label="待处理" width="90" align="center">
                    <template #default="{ row }">
                        <span style="color: #f56c6c; font-weight: bold;">{{ row.pendingQty }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="处理方式" width="130">
                    <template #default="{ row }">
                        <el-select v-model="row.editProcessWayId" placeholder="请选择" :disabled="row.pendingQty <= 0">
                            <el-option v-for="item in processOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column label="本次处理数量" width="110">
                    <template #default="{ row }">
                        <el-input-number v-model="row.editHandleQty" :min="0" :max="row.pendingQty" :controls="false"
                            style="width: 100%" :disabled="row.pendingQty <= 0" placeholder="数量" />
                    </template>
                </el-table-column>

                <el-table-column label="目标库位">
                    <template #default="{ row }">
                        <el-input v-model="row.editLocationCode" placeholder="请输入库位" :disabled="row.pendingQty <= 0" />
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="table-block">
            <h3>处理记录</h3>
            <el-table :data="recordList" border stripe style="width: 100%" height="200px">
                <el-table-column prop="sku" label="SKU" width="150" show-overflow-tooltip />
                <el-table-column prop="processWayName" label="处理方式" width="100" />
                <el-table-column prop="qty" label="处理数量" width="100" />
                <el-table-column prop="locationCode" label="库位" width="150" />
                <el-table-column prop="createdBy" label="处理人" width="120" />
                <el-table-column prop="createdTime" label="处理时间" show-overflow-tooltip />
            </el-table>
        </div>

        <template #footer>
            <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            <el-button type="primary" :loading="saveLoading" @click="handleSave">{{ getButtonText('save') }}</el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getButtonText } from '@/utils/i18n/i18nLabels'
import {
    getReturnOrderProcessApi,
    saveReturnOrderProcessApi,
    getReturnOrderProcessWayEnumApi
} from '@/api/instockApi/return'

const props = defineProps({
    title: { type: String, default: "处理退件" },
    orderId: { type: String, default: "" }
});
const emits = defineEmits(["saved", "close"]);

// 主弹窗控制
const visible = ref(false);
const saveLoading = ref(false);

// 表单基础信息
const formData = ref({
    warehouseCode: "",
    warehouseName: "",
    customerCode: "",
    customerName: "",
    orderNo: ""
});

// 列表数据
const receiveList = ref([]); // 实收商品列表（可操作）
const recordList = ref([]);  // 历史记录列表
const processOptions = ref([]); // 处理方式枚举数据

/**
 * 打开弹窗
 * 并行调用：获取详情数据 + 获取枚举数据
 */
const open = async () => {
    visible.value = true;
    try {
        await Promise.all([loadData(), loadEnumData()]);
    } catch (error) {
        console.error(error);
    } 
};

/**
 * 获取处理方式枚举
 */
const loadEnumData = async () => {
    try {
        const res = await getReturnOrderProcessWayEnumApi();
        if (res.success) {
            processOptions.value = res.data.map(item => ({
                label: item.name,
                value: item.id
            }));
        }
    } catch (error) {
        console.error("获取处理方式枚举失败", error);
    }
}

/**
 * 获取详情数据
 */
const loadData = async () => {
    if (!props.orderId) return;
    try {
        const res = await getReturnOrderProcessApi({ returnOrderId: props.orderId });
        if (res.success && res.data) {
            const data = res.data;

            // 1. 填充头部基础信息
            formData.value = {
                warehouseCode: data.warehouseCode,
                warehouseName: data.warehouseName,
                customerCode: data.customerCode,
                customerName: data.customerName,
                orderNo: data.orderNo
            };

            // 2. 填充实收商品列表，并初始化编辑字段
            receiveList.value = (data.receivedProducts || []).map(item => ({
                ...item,
                editProcessWayId: '', // 编辑的处理方式
                editHandleQty: null,      // 编辑的处理数量
                editLocationCode: ''   // 编辑的库位
            }));

            // 3. 填充历史记录
            recordList.value = data.processRecords || [];
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('数据加载失败');
    }
};

/**
 * 关闭主弹窗
 */
const handleClose = () => {
    visible.value = false;
    emits("close");
};

/**
 * 保存处理结果
 * 逻辑：筛选有效行 -> 组装 List -> 一次性调用接口
 */
const handleSave = async () => {
    // 1. 筛选出有效的处理项 (数量 > 0)
    const validItems = receiveList.value.filter(item => item.editHandleQty > 0);

    if (validItems.length === 0) {
        ElMessage.warning('请至少填写一项处理数量');
        return;
    }

    // 2. 校验必填项
    for (const item of validItems) {
        if (!item.editProcessWayId) {
            ElMessage.warning(`SKU: ${item.sku} 请选择处理方式`);
            return;
        }
        if (item.editHandleQty > item.pendingQty) {
            ElMessage.warning(`SKU: ${item.sku} 处理数量(${item.editHandleQty})不能大于待处理数量(${item.pendingQty})`);
            return;
        }
    }

    saveLoading.value = true;

    try {
        // 3. 构造请求参数数组
        const payloadList = validItems.map(item => ({
            returnOrderId: props.orderId,
            sku: item.sku,
            qualityId: item.qualityId,
            processWayId: item.editProcessWayId,
            qty: item.editHandleQty,
            locationCode: item.editLocationCode,
            remark: ""
        }));
        // 4. 调用批量保存接口
        const res = await saveReturnOrderProcessApi(payloadList);

        if (res.success) {
            ElMessage.success('处理成功');
            await loadData();
            emits("saved");
        } else {
            ElMessage.error(res.msg || '处理失败');
        }

    } catch (error) {
        console.error(error);
        ElMessage.error('系统异常');
    } finally {
        saveLoading.value = false;
    }
};

defineExpose({ open });
</script>

<style scoped>
.table-block {
    margin-bottom: 20px;
}

.table-block h3 {
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: bold;
    border-left: 4px solid #409eff;
    padding-left: 10px;
}

.formBlock {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.formItem {
    width: 30%;
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    box-sizing: border-box;
}

.formItem p:first-child {
    color: #909399;
    font-size: 13px;
    margin-bottom: 5px;
}

.formItemContent {
    font-size: 16px;
    color: #303133;
    font-weight: 500;
    margin: 0;
}
</style>