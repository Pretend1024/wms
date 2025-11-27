<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('parentId')">
                    <el-cascader ref="cascaderRef" v-model="formData.parentId" :options="parentIdList"
                        :props="parentProps" clearable @change="handleCascaderChange"
                        :placeholder="getPlaceholder('parentId')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="item in typeEnum" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('nameCn')" prop="nameCn">
                    <el-input v-model="formData.nameCn" autocomplete="off" :placeholder="getPlaceholder('nameCn')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('nameEn')">
                    <el-input v-model="formData.nameEn" autocomplete="off" :placeholder="getPlaceholder('nameEn')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('leader')">
                    <el-input v-model="formData.leader" autocomplete="off" :placeholder="getPlaceholder('leader')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type="textarea" v-model="formData.remark" autocomplete="off"
                        :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
            <el-col :span="24" v-show="formData.typeId == 10">
                <el-form-item :label="getLabel('code')" prop="code" :rules="formData.typeId == 10 ? [
                    { required: true, message: '请输入公司代码', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ] : []">
                    <el-input v-model="formData.code" autocomplete="off" :placeholder="getPlaceholder('code')" />
                </el-form-item>
            </el-col>
            <el-col :span="24" v-show="formData.typeId == 10">
                <el-form-item :label="getLabel('warehouseId')">
                    <el-select v-model="formData.warehouseId" filterable :placeholder="getPlaceholder('warehouseId')">
                        <el-option v-for="item in warehouseOptions" :key="item.id" :label="`${item.code}-${item.name}`"
                            :value="item.id" />
                    </el-select>
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
        required: true
    },
    typeEnum: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);
const cascaderRef = ref(null);

const rules = {
    typeId: [
        { required: true, message: '请选择类型名', trigger: 'change' }
    ],
    nameCn: [
        { required: true, message: '请输入中文名', trigger: 'blur' }
    ]
};

const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};

const handleCascaderChange = () => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
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

<style scoped lang="scss">
:deep(.el-cascader) {
    width: 100%;
}
</style>