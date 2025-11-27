<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-form-item :label="getLabel('continentId')" prop="continentId">
            <el-select v-model="formData.continentId" :placeholder="getPlaceholder('continentId')">
                <el-option v-for="(item, index) in continentEnumOptions" :key="index" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="getLabel('nameCn')" prop="nameCn">
            <el-input v-model="formData.nameCn" :placeholder="getPlaceholder('nameCn')" />
        </el-form-item>
        <el-form-item :label="getLabel('nameEn')" prop="nameEn">
            <el-input v-model="formData.nameEn" :placeholder="getPlaceholder('nameEn')" />
        </el-form-item>
        <el-form-item :label="getLabel('code')" prop="code">
            <el-input v-model="formData.code" disabled :placeholder="getPlaceholder('code')" />
        </el-form-item>
        <el-form-item :label="getLabel('code3')" prop="code3">
            <el-input v-model="formData.code3" disabled :placeholder="getPlaceholder('code3')" />
        </el-form-item>
        <el-form-item :label="getLabel('currency')">
            <el-input v-model="formData.currency" :placeholder="getPlaceholder('currency')" />
        </el-form-item>
        <el-form-item :label="getLabel('phoneAreaCode')">
            <el-input v-model="formData.phoneAreaCode" :placeholder="getPlaceholder('phoneAreaCode')" />
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
    continentEnumOptions: {
        type: Array,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    continentId: [
        { required: true, message: '请选择洲名', trigger: 'change' }
    ],
    nameCn: [
        { required: true, message: '请输入国家中文名', trigger: 'blur' }
    ],
    nameEn: [
        { required: true, message: '请输入国家英文名', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入二字码', trigger: 'blur' }
    ],
    code3: [
        { required: true, message: '请输入三字码', trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>