<template>
    <el-dialog v-model="visible" :title="$t('instock_returned_returnClaim_list.title')" width="450" align-center
        :show-close="false" :close-on-click-modal="false" destroy-on-close>
        <el-form ref="formRef" :model="formData" label-width="90px">

            <el-form-item :label="getLabel('customerCode')">
                <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                    clearable popper-class="multi-column-select">
                    <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="getLabel('trackingNoList')" v-if="!isMulti">
                <el-input v-model="formData.orderNo" clearable :placeholder="getPlaceholder('trackingNoList')" />
            </el-form-item>

            <el-form-item :label="getLabel('trackingNoList')" v-else>
                <canonicalInput v-model:listName="formData.orderNoList" :placeholder="getPlaceholder('trackingNoList')"
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
import { ref, watch, onMounted } from 'vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
// 引入API
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';

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

// 客户下拉选项
const customerOptions = ref([]);

const formData = ref({
    customerCode: '', // 新增字段
    orderNo: '',
    orderNoList: []
});

// 子组件本地 visible 状态
const visible = ref(props.isVisible);

// 获取客户列表数据
const initCustomerData = async () => {
    try {
        // TODO: 这里假设 orgId 存储在 localStorage 中，请根据实际项目（如 Pinia/Vuex）进行调整
        const orgId = localStorage.getItem('orgId') || '';

        const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
        if (result && result.data) {
            customerOptions.value = result.data.map(item => ({
                value: item.code,
                label: item.code + '(' + item.name + ')'
            }));
        }
    } catch (error) {
        console.error('获取客户列表失败', error);
    }
};

// 组件挂载时获取数据
onMounted(() => {
    initCustomerData();
});

// 监听父组件 prop 变化（同步到本地状态）
watch(() => props.isVisible, (newVal) => {
    visible.value = newVal;
});

// 关闭弹窗时触发事件
const handleClose = () => {
    // 重置表单数据
    formData.value = {
        customerCode: '', // 重置客户
        orderNo: '',
        orderNoList: []
    }
    visible.value = false;
    emits('close');
};

const handleConfirm = () => {
    const orderData = props.isMulti ? formData.value.orderNoList : formData.value.orderNo;

    // 返回包含 订单数据 和 客户代码 的对象
    // 如果父组件只需要原来的数据格式，你可以只传 orderData，但通常既然选了客户，父组件就需要这个值
    emits('confirm', {
        data: orderData,
        customerCode: formData.value.customerCode
    });
};

// 暴露方法给父组件
const getFormData = () => {
    // 保持原有逻辑的同时，建议父组件也能获取到 customerCode
    const orderData = props.isMulti ? formData.value.orderNoList : formData.value.orderNo;
    return {
        data: orderData,
        customerCode: formData.value.customerCode
    };
};

defineExpose({
    getFormData
});
</script>

<style scoped>
:deep(.formatted-input-wrapper) {
    width: 100%;
}

:deep(.el-select) {
    width: 100%;
}
</style>