<template>
    <el-form style="width: auto;" :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input v-model="formData.remark" type="textarea" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>

const props = defineProps({
    formData: { type: Object, required: true }
})

const formRef = ref(null)

const rules = {
    name: [{ required: true, message: '请输入偏远库名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}



defineExpose({ validate: () => formRef.value.validate() })
</script>
