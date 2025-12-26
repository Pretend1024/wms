<template>
    <el-dialog v-model="visible" :title="$t('instock_returned_returnClaim_list.title')" width="450" align-center
        :show-close="false" :close-on-click-modal="false" destroy-on-close>
        <el-form ref="formRef" :model="formData" label-width="90px" style="height: 70px;">
            <el-form-item :label="getLabel('orderNo')" v-if="!isMulti">
                <el-input v-model="formData.orderNo" clearable :placeholder="getPlaceholder('orderNo')" />
            </el-form-item>
            <el-form-item :label="getLabel('orderNo')" v-else>
                <canonicalInput v-model:listName="formData.orderNoList" :placeholder="getPlaceholder('orderNoList')"
                    clearable>
                </canonicalInput>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            <el-button type="primary" @click="handleConfirm">{{ getButtonText('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    isMulti: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['close', 'confirm']);

const formData = ref({
    orderNo: '',
    orderNoList: []
});

// 子组件本地 visible 状态
const visible = ref(props.isVisible);

// 监听父组件 prop 变化（同步到本地状态）
watch(() => props.isVisible, (newVal) => {
    visible.value = newVal;
});

// 关闭弹窗时触发事件
const handleClose = () => {
    // 重置表单数据
    formData.value = {
        orderNo: '',
        orderNoList: []
    }
    visible.value = false;
    emits('close');
};
const handleConfirm = () => {
    const data = props.isMulti ? formData.value.orderNoList : formData.value.orderNo;
    emits('confirm', data);
};

// 暴露方法给父组件
const getFormData = () => {
    if (props.isMulti) {
        return formData.value.orderNoList;
    } else {
        return formData.value.orderNo;
    }
};

defineExpose({
    getFormData
});
</script>

<style scoped>
:deep(.formatted-input-wrapper) {
    width: 100%;
}
</style>
