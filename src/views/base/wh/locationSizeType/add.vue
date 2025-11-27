<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-form-item :label="getLabel('name')" prop="name">
            <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
        </el-form-item>
        <el-form-item :label="getLabel('code')" prop="code">
            <el-input v-model="formData.code" :placeholder="getPlaceholder('code')" />
        </el-form-item>
        <el-form-item :label="getLabel('length')" prop="length">
            <el-input v-model="formData.length" v-number :placeholder="getPlaceholder('length')" />
        </el-form-item>
        <el-form-item :label="getLabel('width')" prop="width">
            <el-input v-model="formData.width" v-number :placeholder="getPlaceholder('width')" />
        </el-form-item>
        <el-form-item :label="getLabel('height')" prop="height">
            <el-input v-model="formData.height" v-number :placeholder="getPlaceholder('height')" />
        </el-form-item>
        <el-form-item :label="getLabel('volume')">
            <el-input v-model="formData.volume" disabled :placeholder="getPlaceholder('volume')" />
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
        { required: true, message: '请输入名称', trigger: 'blur' },
        { pattern: /^\S+$/, message: '名称不能为空格', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入代码', trigger: 'blur' }
    ],
    length: [
        { required: true, message: '请输入长度', trigger: 'blur' }
    ],
    width: [
        { required: true, message: '请输入宽度', trigger: 'blur' }
    ],
    height: [
        { required: true, message: '请输入高度', trigger: 'blur' }
    ],
    volume: [
        { required: true, message: '请输入体积', trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>