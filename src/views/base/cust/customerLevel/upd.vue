<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item :label="getLabel('name')" prop="name">
            <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
        </el-form-item>
        <el-form-item :label="getLabel('money')" prop="money" v-number>
            <el-input v-model="formData.money" :placeholder="getPlaceholder('money')" v-intNumber />
        </el-form-item>
        <el-form-item :label="getLabel('days')" prop="days">
            <el-input v-model="formData.days" :placeholder="getPlaceholder('days')" v-intNumber />
        </el-form-item>
        <el-form-item :label="getLabel('sortNo')" prop="sortNo">
            <el-input v-model="formData.sortNo" :placeholder="getPlaceholder('sortNo')" v-intNumber="true" />
        </el-form-item>
        <el-form-item :label="getLabel('remark')">
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
        { required: true, message: '请输入等级名称', trigger: 'blur' }
    ],
    money: [
        { required: true, message: '请输入消费金额', trigger: 'blur' }
    ],
    days: [
        { required: true, message: '请输入统计天数', trigger: 'blur' }
    ],
    sortNo: [
        { required: true, message: '请输入排序', trigger: 'blur' }
    ]
};
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>