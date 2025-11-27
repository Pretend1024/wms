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
                <el-form-item label="原人工锁定:">
                    <el-input v-model="formData.qtyLock" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="原可用数:">
                    <el-input v-model="formData.qtyAvail" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="新人工锁定:">
                    <el-input v-model="qtyLockAfter" readonly />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="新可用数:">
                    <!-- <el-input v-model="formData.qtyTotal" readonly /> -->
                    <el-input v-model="qtyAvailAfter" readonly />
                </el-form-item>
            </el-col>



            <el-divider />
            <el-col :span="24">
                <div style="display: flex;align-items: center;">
                    <el-form-item label="操作数量:" style="width: 384px;">
                        <el-input v-model="qty" type="number" @input="handleQtyInput" @blur="handleQtyBlur" />
                    </el-form-item>
                    <span style="margin:0 0 18px 5px;">注意：正数增加锁定 , 负数减少锁定</span>
                </div>
            </el-col>

        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getInventoryInventoryInfoApi, getInventoryInventoryLockQtyApi } from '@/api/inventoryApi/inventory.js'

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
// 新锁定数量
const qtyLockAfter = ref(0);
// 新可用数
const qtyAvailAfter = ref(0);
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
            currentValue = currentValue.replace(/-/g, '', 1);
            if (currentValue.length > 0) {
                currentValue = '-' + currentValue;
            }
        }
    }

    // 更新输入框值
    qty.value = currentValue;

    // 转换为数字进行计算
    const qtyNum = Number(currentValue) || 0;
    const qtyLockBefore = Number(formData.value.qtyLock) || 0;
    const qtyAvail = Number(formData.value.qtyAvail) || 0;

    // 计算最大最小值限制
    const maxQty = qtyAvail;       // 最大值为可用数
    const minQty = -qtyLockBefore; // 最小值为-原锁定数量

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

    // 计算新锁定数量
    qtyLockAfter.value = qtyLockBefore + fixedQty;
    // 计算新可用数
    qtyAvailAfter.value = qtyAvail - fixedQty;
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
    const resLock = await getInventoryInventoryLockQtyApi({ id: props.id });
    formData.value = res.data || {};
    formData.value.qtyLock = resLock.data || 0;
    // 初始化新锁定数量为原锁定数量
    qtyLockAfter.value = formData.value.qtyLock || 0;
    // 初始化新可用数为原可用数
    qtyAvailAfter.value = formData.value.qtyAvail || 0;
});

defineExpose({
    validate: () => {
        return formRef.value?.validate() || Promise.resolve(false);
    },
    // 可以暴露获取结果的方法供父组件使用
    getResult: () => ({
        id: props.id,
        qty: Number(qty.value) || 0
    })
});
</script>

<style scoped>
:deep(.el-divider--horizontal) {
    margin: 12px 0;
}
</style>
