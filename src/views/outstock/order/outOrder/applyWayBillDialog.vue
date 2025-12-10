<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="600" align-center destroy-on-close @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
            <el-row>
                <el-col :span="12">
                    <!-- 申请类型 -->
                    <el-form-item :label="getLabel('waybillTypeId')" prop="waybillTypeId">
                        <el-select v-model="formData.waybillTypeId" clearable>
                            <el-option v-for="item in waybillTypeIdOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 自提代码 -->
                    <el-form-item :label="getLabel('pickupCode')">
                        <el-input v-model="formData.pickupCode" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 取件时间 -->
                    <el-form-item :label="getLabel('pickupTime')">
                        <el-date-picker v-model="formData.pickupTime" type="datetime" clearable
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                </el-col>
                <!-- 是否预约派件 -->
                <el-col :span="12">
                    <el-form-item :label="getLabel('isPhoneReserved')">
                        <el-switch v-model="formData.isPhoneReserved" active-text="是" inactive-text="否" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 托盘尺寸 -->
                    <el-form-item :label="getLabel('palletSizeCm')">
                        <el-input v-model="formData.palletSizeCm" clearable v-number />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 托盘数量 -->
                    <el-form-item :label="getLabel('palletQty')">
                        <el-input v-model.number="formData.palletQty" clearable v-number />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 托盘重量 -->
                    <el-form-item :label="getLabel('palletWeight')">
                        <el-input v-model.number="formData.palletWeight" clearable v-number />
                    </el-form-item>
                </el-col>
            </el-row>
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 定义组件接收的参数
const props = defineProps({
    waybillTypeIdOptions: {
        type: Array,
        default: () => []
    }
});

// 定义组件抛出的事件
const emit = defineEmits(['confirm', 'cancel', 'close']);

// 表单数据
const formData = reactive({
    waybillTypeId: 10,         // 申请类型（必需）
    pickupCode: '',          // 自提代码（可选）
    pickupTime: '',          // 取件时间（可选）
    isPhoneReserved: false,  // 是否预约派件（可选）
    palletSizeCm: '',        // 托盘尺寸（可选）
    palletQty: null,         // 托盘数量（可选）
    palletWeight: null       // 托盘重量（可选）
});

// 表单引用
const formRef = ref(null);

// 弹窗显示状态
const visible = ref(false);


// 弹窗标题
const dialogTitle = computed(() => t(`outstock_order_outOrder_list.applyTitle`));



// 打开弹窗方法
const open = () => {
    visible.value = true;
    // 重置表单数据
    resetForm();
};

// 重置表单
const resetForm = () => {
    formData.waybillTypeId = 10;
    formData.pickupCode = '';
    formData.pickupTime = '';
    formData.isPhoneReserved = false;
    formData.palletSizeCm = '';
    formData.palletQty = null;
    formData.palletWeight = null;

    if (formRef.value) {
        formRef.value.clearValidate();
    }
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
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>