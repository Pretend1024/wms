<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="600" align-center destroy-on-close @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
            <!-- 仓库 -->
            <el-form-item v-if="type === 'warehouse'" :label="getLabel('warehouseCode')">
                <el-select v-model="formData.warehouseCode" clearable>
                    <el-option v-for="item in warehouseOptions" :key="item.code" :label="`${item.code}-${item.name}`"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <!-- 渠道 -->
            <el-form-item v-if="type === 'channel'" :label="getLabel('carrierCode')">
                <el-select v-model="formData.carrierCode" clearable @change="selectChannel">
                    <el-option v-for="item in carrierOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="type === 'channel'" :label="getLabel('shipwayId')">
                <el-select v-model="formData.shipwayCode" clearable>
                    <el-option v-for="item in productOptions" :key="item.id" :label="item.name" :value="item.code" />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleConfirm">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getProductShipwayListApi } from '@/api/productApi/shipway.js'
import { getProductShipwayBrandListApi } from '@/api/productApi/shipway.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 定义组件接收的参数
const props = defineProps({
    // 表单类型，用于控制显示内容
    type: {
        type: String,
        required: true,
        validator: (value) => ['ware', 'ware2'].includes(value)
    },
    warehouseOptions: {
        type: Array,
        default: () => []
    }
});

// 定义组件抛出的事件
const emit = defineEmits(['confirm', 'cancel', 'close']);

// 表单数据
const formData = reactive({
    warehouseCode: '',
    shipwayCode: '',
    carrierCode: ''
});

// 表单引用
const formRef = ref(null);

// 弹窗显示状态
const visible = ref(false);

// 弹窗标题
const dialogTitle = computed(() => t(`outstock_order_outOrder_list.${props.type}Title`));

// 打开弹窗方法
const open = () => {
    visible.value = true;
    // 重置表单数据
    formData.warehouseCode = '';
    formData.shipwayCode = '';
    formData.carrierCode = '';
    selectChannel()
};

// 关闭弹窗方法
const close = () => {
    visible.value = false;
};

// 处理取消按钮
const handleCancel = () => {
    emit('cancel');
    close();
};

// 处理关闭事件
const handleClose = () => {
    emit('close');
};

// 处理确定按钮
const handleConfirm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            // 验证通过，将表单数据传递给父组件
            emit('confirm', { ...formData });
            close();
        }
    });
};

// 暴露方法给父组件
defineExpose({
    open,
    close
});
const productOptions = ref([])
const carrierOptions = ref([])
const selectChannel = async () => {
    const productRes = await getProductShipwayListApi({
        carrierCode: formData.carrierCode,
    })
    productOptions.value = productRes.data
}
onMounted(async () => {
    // 承运商数据
    const carrierRes = await getProductShipwayBrandListApi()
    carrierOptions.value = carrierRes.data.map(item => ({
        label: item.name,
        value: item.code
    }))
})
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>