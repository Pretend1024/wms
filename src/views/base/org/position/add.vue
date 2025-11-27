<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item :label="getLabel('name')" prop="name">
            <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
        </el-form-item>
        <el-form-item :label="getLabel('remark')" prop="remark">
            <el-input type="textarea" v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入岗位名称', trigger: 'change' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>