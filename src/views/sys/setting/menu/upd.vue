<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('parentId')" prop="parentId">
                    <el-cascader ref="cascaderRef" v-model="formData.parentId" :options="parentIdList"
                        :props="parentProps" clearable @change="handleCascaderChange"
                        :placeholder="getPlaceholder('parentId')" />
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
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" value-key="id" style="width: 240px"
                        :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="item in typeEnum" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('terminal')" prop="terminal">
                    <el-select v-model="formData.terminal" value-key="id" style="width: 240px"
                        :placeholder="getPlaceholder('terminal')">
                        <el-option v-for="item in loginTerminalEnum" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('iconCls')">
                    <el-input v-model="formData.iconCls" :placeholder="getPlaceholder('iconCls')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('url')">
                    <el-input v-model="formData.url" autocomplete="off" :placeholder="getPlaceholder('url')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('permissionCode')">
                    <el-input v-model="formData.permissionCode" autocomplete="off"
                        :placeholder="getPlaceholder('permissionCode')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('display')">
                    <el-select v-model="formData.display" :placeholder="getPlaceholder('display')">
                        <el-option label="是" :value="false" />
                        <el-option label="否" :value="true" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('sortNo')">
                    <el-input v-model="formData.sortNo" :placeholder="getPlaceholder('sortNo')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, nextTick } from 'vue';

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
    ,
    loginTerminalEnum: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);
const cascaderRef = ref(null);

const rules = {
    typeId: [
        { required: true, message: '请选择类型', trigger: 'blur' }
    ],
    nameCn: [
        { required: true, message: '请输入中文名', trigger: 'blur' }
    ],
    parentId: [
        { required: true, message: '请选择上级菜单', trigger: 'change' }
    ],
    terminal: [
        { required: true, message: '请选择用户端', trigger: 'change' }
    ],
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
</script>

<style scoped lang="scss">
:deep(.el-cascader) {
    width: 100%;
}
</style>