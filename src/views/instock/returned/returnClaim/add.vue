<template>
    <el-dialog v-model="visible" :title="$t('instock_returned_returnClaim_list.addTitle')" width="500px" align-center
        :close-on-click-modal="false" destroy-on-close @close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" style="padding: 10px 20px 0 0;">
            <el-form-item :label="getLabel('warehouseCode')" prop="warehouseId">
                <el-select v-model="formData.warehouseId" :placeholder="getPlaceholder('warehouseCode')" clearable
                    filterable style="width: 100%;">
                    <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="getLabel('trackingNoList')" prop="trackingNos">
                <canonicalInput v-model:listName="formData.trackingNos" :placeholder="getPlaceholder('trackingNoList')"
                    clearable />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">{{ getButtonText('cancel') }}</el-button>
            <el-button type="primary" @click="handleConfirm">{{ getButtonText('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { getButtonText, getLabel, getPlaceholder } from '@/utils/i18n/i18nLabels';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';

const emits = defineEmits(['confirm']);

const visible = ref(false);
const formRef = ref(null);
const warehouseOptions = ref([]);

const formData = ref({
    warehouseId: '',
    trackingNos: []
});

// 校验规则
const rules = {
    warehouseId: [{ required: true, message: getPlaceholder('warehouseCode'), trigger: 'change' }],
    trackingNos: [{ required: true, message: getPlaceholder('trackingNoList'), trigger: 'change' }]
};

/**
 * 内部获取仓库数据的方法
 */
const fetchWarehouseData = async () => {
    if (warehouseOptions.value.length > 0) return; // 避免重复加载
    try {
        const res = await getWhWarehouseApi();
        if (res.success) {
            warehouseOptions.value = res.data.map(item => ({
                label: `${item.code}-${item.name}`,
                value: item.id // 这里根据业务需要，可以是item.id或item.code
            }));
        }
    } catch (error) {
        console.error('获取仓库列表失败:', error);
    }
};

/**
 * 暴露给外部的打开方法
 */
const open = () => {
    visible.value = true;
    fetchWarehouseData(); // 打开时确保有数据
};

const handleClose = () => {
    visible.value = false;
    // 重置表单
    formData.value = {
        warehouseId: '',
        trackingNos: []
    };
    nextTick(() => {
        if (formRef.value) formRef.value.resetFields();
    });
};

const handleConfirm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
        if (valid) {
            // 确定时将内部维护的 formData 传出
            emits('confirm', { ...formData.value });
            visible.value = false;
        }
    });
};

/**
 * 暴露给外部获取当前数据的方法
 */
const getFormData = () => {
    return formData.value;
};

// 暴露 API 给外部 ref 实例
defineExpose({
    open,
    getFormData,
    handleClose
});
</script>

<style scoped>
:deep(.formatted-input-wrapper) {
    width: 100%;
}
</style>