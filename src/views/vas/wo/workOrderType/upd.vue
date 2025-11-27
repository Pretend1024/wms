<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('parentId')">
                    <el-select v-model="formData.parentId" :placeholder="getPlaceholder('parentId')" clearable
                        :disabled="formData.parentId == 0">
                        <el-option v-for="item in localParentIdList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" autocomplete="off" :placeholder="getPlaceholder('name')"
                        clearable />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')">
                    <el-input v-model="formData.sortNo" :placeholder="getPlaceholder('sortNo')" v-intNumber />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, nextTick } from 'vue';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    parentIdList: {
        type: Array,
        required: true,

    }
});
// 显示以及元素父级
const localParentIdList = ref([]);
watch(() => props.parentIdList, (newVal) => {
    localParentIdList.value = [{ value: '0', label: '无' }, ...newVal];
}, { immediate: true });

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入类型名称', trigger: 'blur' }
    ]
};
// 暴露 validate 方法，供父组件调用
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
const warehouseOptions = ref([])
onMounted(async () => {
    const res = await getWhWarehouseApi()
    warehouseOptions.value = res.data
})
</script>