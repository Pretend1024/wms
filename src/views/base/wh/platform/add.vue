<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('platformCode')" prop="platformCode">
                    <el-input v-model="formData.platformCode" :placeholder="getPlaceholder('platformCode')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('platformName')" prop="platformName">
                    <el-input v-model="formData.platformName" :placeholder="getPlaceholder('platformName')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode">
                    <el-select v-model="formData.warehouseCode" filterable
                        :placeholder="getPlaceholder('warehouseCode')">
                        <el-option v-for="item in warehouseOptions" :key="item.id" :label="`${item.code}-${item.name}`"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')">
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('startTime')" prop="startTime">
                    <el-time-select v-model="formData.startTime" :max-time="formData.endTime" start="00:00" step="01:00"
                        end="23:00" :placeholder="getPlaceholder('startTime')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('endTime')" prop="endTime">
                    <el-time-select v-model="formData.endTime" :min-time="formData.startTime" start="00:00" step="01:00"
                        end="23:00" :placeholder="getPlaceholder('endTime')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('weekdays')" prop="weekdays">
                    <el-select v-model="formData.weekdays" multiple collapse-tags :max-collapse-tags="3"
                        :placeholder="getPlaceholder('weekdays')">
                        <el-option v-for="item in weekDaysOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('maxCapacity')">
                    <el-input v-model="formData.maxCapacity" :placeholder="getPlaceholder('maxCapacity')" v-intNumber/>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type="textarea" v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
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
    statusOptions: {
        type: Array,
        required: true
    }
});

const formRef = ref(null);

const rules = {
    platformCode: [
        { required: true, message: '请输入月台代码', trigger: 'blur' }
    ],
    platformName: [
        { required: true, message: '请输入月台名称', trigger: 'blur' }
    ],
    warehouseCode: [
        { required: true, message: '请选择所属仓库', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请输入月台状态', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请选择开启时间', trigger: 'change' }
    ],
    endTime: [
        { required: true, message: '请选择关闭时间', trigger: 'change' }
    ],
    weekdays: [
        { required: true, message: '请选择工作日', trigger: 'change' }
    ]
};
const weekDaysOptions = [
    { label: '周一', value: '1' },
    { label: '周二', value: '2' },
    { label: '周三', value: '3' },
    { label: '周四', value: '4' },
    { label: '周五', value: '5' },
    { label: '周六', value: '6' },
    { label: '周日', value: '7' }
]
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>