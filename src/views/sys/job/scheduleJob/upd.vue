<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('jobGroupId')" prop="jobGroupId">
                    <el-select v-model="formData.jobGroupId" :placeholder="getPlaceholder('jobGroupId')">
                        <el-option v-for="(item, index) in JobGroupOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('jobName')" prop="jobName">
                    <el-input v-model="formData.jobName" :placeholder="getPlaceholder('jobName')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('jobStatusId')" prop="jobStatusId">
                    <el-select v-model="formData.jobStatusId" :placeholder="getPlaceholder('jobStatusId')">
                        <el-option v-for="(item, index) in StatusEnumOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('cronExpression')" prop="cronExpression">
                    <el-input v-model="formData.cronExpression" :placeholder="getPlaceholder('cronExpression')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('description')" prop="description">
                    <el-input v-model="formData.description" :placeholder="getPlaceholder('description')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('isConcurrent')" prop="isConcurrent">
                    <el-select v-model="formData.isConcurrent" :placeholder="getPlaceholder('isConcurrent')">
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('springId')" prop="springId">
                    <el-input v-model="formData.springId" :placeholder="getPlaceholder('springId')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('methodName')" prop="methodName">
                    <el-input v-model="formData.methodName" :placeholder="getPlaceholder('methodName')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('args')">
                    <el-input v-model="formData.args" :placeholder="getPlaceholder('args')" />
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
    JobGroupOptions: {
        type: Array,
        required: true
    },
    StatusEnumOptions: {
        type: Array,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    jobGroupId: [
        { required: true, message: '请选择任务分组', trigger: 'change' }
    ],
    jobName: [
        { required: true, message: '请输入任务名称', trigger: 'blur' }
    ],
    jobStatusId: [
        { required: true, message: '请选择是否启动', trigger: 'change' }
    ],
    cronExpression: [
        { required: true, message: '请输入 cron 表达式', trigger: 'blur' },
    ],
    description: [
        { required: true, message: '请输入任务描述', trigger: 'blur' }
    ],
    isConcurrent: [
        { required: true, message: '请选择是否并发', trigger: 'change' }
    ],
    springId: [
        { required: true, message: '请输入执行 BeanId', trigger: 'blur' }
    ],
    methodName: [
        { required: true, message: '请输入执行 bean 方法名', trigger: 'blur' }
    ],
    args: [
        { required: true, message: '请输入参数', trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>