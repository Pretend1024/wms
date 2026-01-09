<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="600" align-center destroy-on-close @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
            <el-form-item v-if="type === 'warehouse'" :label="getLabel('warehouseCode')" prop="warehouseCode">
                <el-select v-model="formData.warehouseCode" clearable placeholder="请选择仓库" style="width: 100%">
                    <el-option v-for="item in warehouseOptions" :key="item.code" :label="`${item.code}-${item.name}`"
                        :value="item.code" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="type === 'channel'" :label="getLabel('carrierCode')" prop="carrierCode">
                <el-select v-model="formData.carrierCode" clearable @change="selectChannel" placeholder="请选择渠道"
                    style="width: 100%">
                    <el-option v-for="item in carrierOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="type === 'channel'" :label="getLabel('shipwayId')" prop="shipwayCode">
                <el-select v-model="formData.shipwayCode" clearable placeholder="请选择产品" style="width: 100%">
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
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
        validator: (value) => ['warehouse', 'channel'].includes(value)
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

// --- 校验规则 ---
const rules = reactive({
    warehouseCode: [
        { required: true, message: '请选择仓库', trigger: 'change' }
    ],
    carrierCode: [
        { required: true, message: '请选择渠道', trigger: 'change' }
    ],
    shipwayCode: [
        { required: true, message: '请选择产品', trigger: 'change' }
    ]
});

// 弹窗显示状态
const visible = ref(false);

// 弹窗标题
const dialogTitle = computed(() => t(`outstock_order_outOrder_list.${props.type}Title`));

// 打开弹窗方法
const open = () => {
    visible.value = true;
    // 使用 nextTick 确保 DOM 更新后重置表单，这样可以清除校验红字
    nextTick(() => {
        if (formRef.value) {
            formRef.value.resetFields(); // 重置数据和校验状态
        } else {
            //以此作为兜底，防止第一次打开 ref 为空
            formData.warehouseCode = '';
            formData.shipwayCode = '';
            formData.carrierCode = '';
        }
        // 如果是渠道类型，重置后可能需要清空下拉选项或重新获取
        if (props.type === 'channel') {
            productOptions.value = [];
        }
    })
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
const handleConfirm = async () => {
    if (!formRef.value) return;

    // 调用校验
    await formRef.value.validate((valid) => {
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
    // 切换渠道时，清空已选的产品
    formData.shipwayCode = '';

    if (!formData.carrierCode) {
        productOptions.value = [];
        return;
    }

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