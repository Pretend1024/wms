<template>
    <el-form :model="formData" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="仓库代码:">
                    <el-input v-model="formData.warehouseCode" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="客户代码:">
                    <el-select v-model="formData.customerCode" disabled>
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="入库单号:">
                    <el-input v-model="formData.inOrderNo" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="SKU:">
                    <el-input v-model="formData.sku" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="库位:">
                    <el-input v-model="formData.locationCode" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="品质:">
                    <el-input v-model="formData.qualityName" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="总数:">
                    <el-input v-model="formData.qtyTotal" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="可用数:">
                    <el-input v-model="formData.qtyAvail" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="新总数:">
                    <el-input v-model="qtyTotalAfter" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="新可用数:">
                    <el-input v-model="qtyAvailAfter" readonly />
                </el-form-item>
            </el-col>
            <el-divider />
            <el-col :span="24">
                <div style="display: flex;align-items: center;">
                    <el-form-item label="操作数量:" style="width: 384px;">
                        <el-input v-model="qty" type="number" @input="handleQtyInput" @blur="handleQtyBlur" />
                    </el-form-item>
                    <span style="margin:0 0 18px 5px;">注意：正数增加 , 负数减少 </span>
                </div>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注:">
                    <el-input v-model="remark" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getInventoryInventoryInfoApi } from '@/api/inventoryApi/inventory.js'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    customerOptions: {
        type: Array,
        default: () => []
    }
});
const formData = ref({});
const qtyTotalAfter = ref(0);
const qtyAvailAfter = ref(0);
const remark = ref('');
const qty = ref('');

const formRef = ref(null);

const handleQtyInput = () => {
    let currentValue = qty.value || '';

    // 允许一个负号开头，其余为数字
    if (!/^-?\d*$/.test(currentValue)) {
        // 过滤非法字符
        currentValue = currentValue.replace(/[^\d-]/g, '');
        // 确保最多只有一个负号且在开头
        if (currentValue.indexOf('-') !== currentValue.lastIndexOf('-')) {
            const firstMinus = currentValue.indexOf('-');
            currentValue = currentValue.substring(0, firstMinus + 1) +
                currentValue.substring(firstMinus + 1).replace(/-/g, '');
        }
    }

    // 更新输入框值
    qty.value = currentValue;

    // 转换为数字进行计算
    const qtyNum = Number(currentValue) || 0;
    const qtyTotal = Number(formData.value.qtyTotal) || 0;
    const qtyAvail = Number(formData.value.qtyAvail) || 0;

    // 计算最大最小值限制
    const maxQty = 1000000 - qtyTotal;        // 最大值为1000000
    const minQty = -qtyAvail;      // 最小值为-可用数量（确保新可用数不小于0）

    // 超出范围时自动修正
    let fixedQty = qtyNum;
    if (qtyNum < minQty) {
        fixedQty = minQty;
    } else if (qtyNum > maxQty) {
        fixedQty = maxQty;
    }

    // 修正后更新值
    if (fixedQty !== qtyNum) {
        qty.value = fixedQty.toString();
    }

    // 计算新总数和新可用数
    qtyTotalAfter.value = qtyTotal + fixedQty;
    qtyAvailAfter.value = qtyAvail + fixedQty;
};

const handleQtyBlur = () => {
    // 失去焦点时如果为空或非数字，设置为0
    if (!qty.value || isNaN(Number(qty.value))) {
        qty.value = '0';
    }
    // 重新计算确保值正确
    handleQtyInput();
};

onMounted(async () => {
    const res = await getInventoryInventoryInfoApi({ id: props.id });
    formData.value = res.data || {};
    // 初始化新总数和新可用数
    qtyTotalAfter.value = Number(formData.value.qtyTotal) || 0;
    qtyAvailAfter.value = Number(formData.value.qtyAvail) || 0;
});

defineExpose({
    validate: () => {
        return formRef.value?.validate() || Promise.resolve(false);
    },
    // 暴露获取结果的方法供父组件使用
    getResult: () => (
        {
            warehouseId: formData.value.warehouseId,
            remark: remark.value,
            detailList: [{
                inventoryId: props.id,
                adjustQty: Number(qty.value) || 0
            }]
        }
    )
});
</script>

<style scoped>
:deep(.el-divider--horizontal) {
    margin: 12px 0;
}
</style>
