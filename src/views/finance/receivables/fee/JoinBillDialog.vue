<template>
    <el-dialog v-model="isVisible" title="加入账单" width="500px" align-center :before-close="handleClose">
        <el-form label-width="100px" :model="form">
            <el-form-item label="加入范围:">
                <el-radio-group v-model="form.scope">
                    <el-radio label="selection">按勾选 ({{ selectionCount }}条)</el-radio>
                    <el-radio label="condition">按当前查询条件</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="加入方式:">
                <el-radio-group v-model="form.method"
                    style="display: flex; flex-direction: column; align-items: flex-start;">
                    <el-radio :label="1" style="margin-bottom: 5px;">加入现有账单</el-radio>
                    <el-radio :label="2" style="margin-bottom: 5px;">自动创建新账单</el-radio>
                    <el-radio :label="3">自动加入未付款账单</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="账单号:" v-if="form.method === 1" required>
                <el-input v-model="form.targetBillNo" placeholder="请输入账单号" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { smartAlert } from '@/utils/genericMethods.js';

const props = defineProps({
    modelValue: { // v-model 控制显示隐藏
        type: Boolean,
        default: false
    },
    selectionCount: { // 勾选数量
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const form = ref({
    scope: 'selection',
    method: 1,
    targetBillNo: ''
});

// 每次打开弹窗重置表单，但保留 logical defaults
watch(() => props.modelValue, (val) => {
    if (val) {
        form.value = {
            scope: props.selectionCount > 0 ? 'selection' : 'condition',
            method: 1,
            targetBillNo: ''
        };
    }
});

const handleClose = () => {
    isVisible.value = false;
};

const handleConfirm = () => {
    // 1. 基础校验
    if (form.value.scope === 'selection' && props.selectionCount === 0) {
        return smartAlert('请先勾选数据或选择按条件', false);
    }
    if (form.value.method === 1 && !form.value.targetBillNo.trim()) {
        return smartAlert('请输入目标账单号', false);
    }

    // 2. 将数据抛出给父组件处理 API 调用
    emit('confirm', { ...form.value });
};
</script>