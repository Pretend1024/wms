<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="入库单号:">
                    <el-input v-model="formData.inOrderNo" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收货方式:">
                    <el-input v-model="formData.receiptMethodName" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="SKU:">
                    <el-input v-model="formData.sku" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="箱号:">
                    <el-input v-model="formData.boxNo" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="原收货件数:">
                    <el-input v-model="formData.qty" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="新收货件数:" prop="newQty">
                    <el-input v-model.trim.number="formData.newQty" type="number" :min="1" @blur="validateQty" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});


const formRef = ref(null);

const rules = {
    newQty: [
        { required: true, message: '请输入收货件数', trigger: 'blur' }
    ]
};
// 实时监听输入变化
watch(() => props.formData.newQty, (val) => {
    // 清除非数字字符
    if (val && isNaN(Number(val))) {
        props.formData.newQty = val.replace(/[^\d]/g, '');
    }
    // 限制最小值为 1
    if (val && Number(val) < 1) {
        props.formData.newQty = 1;
    }
});
// 失去焦点时再次验证
const validateQty = () => {
    if (!props.formData.newQty || Number(props.formData.newQty) < 1) {
        props.formData.newQty = 1;
    }
};
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>