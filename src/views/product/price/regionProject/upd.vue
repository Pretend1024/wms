<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-form-item :label="getLabel('name')" prop="name">
            <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" disabled />
        </el-form-item>
        <el-form-item :label="getLabel('typeId')" prop="typeId">
            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" disabled>
                <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
            </el-select>
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
    },
    projectTypeOptions: {
        type: Array,
        required: true
    }
});
console.log('props', props);

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入模板名称', trigger: 'blur' }
    ],
    typeId: [
        { required: true, message: '请选择模板类型', trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>