<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode">
                    <el-select v-model="formData.warehouseCode" value-key="id" filterable disabled
                        :placeholder="getPlaceholder('warehouseCode')">
                        <el-option v-for="item in warehouseOptions" :key="item.id" :label="`${item.code}-${item.name}`"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('code')" prop="code">
                    <el-input v-model="formData.code" disabled :placeholder="getPlaceholder('code')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    warehouseOptions: {
        type: Array,
        required: true
    },
    typeOptions: {
        type: Array,
        required: true
    },
});

const formRef = ref(null);

const rules = {
    code: [
        { required: true, message: '请输入代码', trigger: 'blur' },
        { pattern: /^\S+$/, message: '代码不能为空格', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { pattern: /^\S+$/, message: '名称不能为空格', trigger: 'blur' }
    ],
    typeId: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    warehouseCode: [
        { required: true, message: '请选择仓库', trigger: 'change' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>