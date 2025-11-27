<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type="textarea" v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
    ]
};
// 暴露 validate 方法，供父组件调用
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>
