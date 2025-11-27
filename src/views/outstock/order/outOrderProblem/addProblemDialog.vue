<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="600" align-center destroy-on-close @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
            <el-row>
                <el-col :span="24">
                    <!-- 出库单号 -->
                    <el-form-item :label="getLabel('outOrder')" prop="outOrderNoList">
                        <canonicalInput v-model:listName="formData.outOrderNoList"
                            :placeholder="getPlaceholder('outOrder')" clearable>
                        </canonicalInput>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 问题类型 -->
                    <el-form-item :label="getLabel('typeId')" prop="typeId">
                        <el-select v-model="formData.typeId" clearable :placeholder="getPlaceholder('typeId')">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 问题描述 -->
                    <el-form-item :label="getLabel('msg')">
                        <el-input v-model="formData.msg" clearable type='textarea' />
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
import { ref, reactive, computed } from 'vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { smartAlert } from '@/utils/genericMethods.js'
import { getPlaceholder } from '@/utils/i18n/i18nLabels.js'
import { addOutstockOrderProblemApi } from '@/api/outstockApi/problem.js'

// 定义组件接收的参数（问题类型选项）
const props = defineProps({
    typeOptions: {
        type: Array,
        default: () => []
    }
});

// 定义组件抛出的事件
const emit = defineEmits(['confirm', 'cancel', 'close']);

// 表单数据（与模板中v-model绑定的字段对应）
const formData = reactive({
    outOrderNoList: [], // 出库单号列表（canonicalInput绑定）
    typeId: null,       // 问题类型ID（下拉选择绑定）
    msg: ''             // 问题描述（文本域绑定）
});

// 表单验证规则
const rules = reactive({
    outOrderNoList: [
        { required: true, message: getPlaceholder('outOrder'), trigger: 'input' }
    ],
    typeId: [
        { required: true, message: getPlaceholder('typeId'), trigger: 'change' }
    ]
});

// 表单引用
const formRef = ref(null);

// 弹窗显示状态
const visible = ref(false);

// 弹窗标题
const dialogTitle = computed(() => t(`outstock_order_outOrderProblem_list.addTitle`));

// 打开弹窗方法
const open = () => {
    visible.value = true;
    // 重置表单数据
    resetForm();
};

// 重置表单（清空字段和验证状态）
const resetForm = () => {
    formData.outOrderNoList = [];
    formData.typeId = null;
    formData.msg = '';
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

// 处理确定按钮（表单验证通过后提交）
const handleConfirm = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            // 传递表单数据给父组件
            emit('confirm', { ...formData });
            const res = await addOutstockOrderProblemApi(formData)
            smartAlert(res.msg, res.success, 1000)
            if (res.success) {
                close();
            }
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