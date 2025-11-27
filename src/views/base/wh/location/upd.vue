<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="113px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode">
                    <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                        @change="selectWh" disabled>
                        <el-option v-for="item in warehouseEnumOptions" :key="item.id" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('zoneCode')" prop="zoneCode">
                    <el-select v-model="formData.zoneCode" :placeholder="getPlaceholder('zoneCode')">
                        <el-option v-for="item in zoneEnumOptions" :key="item.code" :label="`${item.code}-${item.name}`"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('sizeTypeCode')" prop="sizeTypeCode">
                    <el-select v-model="formData.sizeTypeCode" :placeholder="getPlaceholder('sizeTypeCode')">
                        <el-option v-for="item in sizeTypeEnumOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('statusId')" prop="statusId">
                    <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')">
                        <el-option v-for="item in statusEnumOptions" :key="item.value" :label="item.label"
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
                <el-form-item :label="getLabel('lineNumber')" prop="lineNumber">
                    <el-input v-model="formData.lineNumber" v-intNumber :placeholder="getPlaceholder('lineNumber')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('xcoord')" prop="xcoord">
                    <el-input v-model="formData.xcoord" v-intNumber :placeholder="getPlaceholder('xcoord')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('ycoord')" prop="ycoord">
                    <el-input v-model="formData.ycoord" v-intNumber :placeholder="getPlaceholder('ycoord')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('zcoord')" prop="zcoord">
                    <el-input v-model="formData.zcoord" v-intNumber :placeholder="getPlaceholder('zcoord')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('accessEase')" prop="accessEase">
                    <template #label>
                        <div style="display: flex;align-items: center;">
                            <span>{{ getLabel('accessEase') }}</span>
                            <el-tooltip content="1=极易，5=极难" placement="bottom" effect="light">
                                <el-icon size="16">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </template>
                    <el-input v-model="formData.accessEase" v-intNumber :placeholder="getPlaceholder('accessEase')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('distanceToDock')" prop="distanceToDock">
                    <el-input v-model="formData.distanceToDock" v-intNumber
                        :placeholder="getPlaceholder('distanceToDock')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('skuQty')" prop="skuQty">
                    <el-input v-model="formData.skuQty" v-intNumber :placeholder="getPlaceholder('skuQty')" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('batchNoQty')" prop="batchNoQty">
                    <el-input v-model="formData.batchNoQty" v-intNumber :placeholder="getPlaceholder('batchNoQty')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { getWhZoneEnumApi } from '@/api/baseApi/wh.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    warehouseEnumOptions: {
        type: Array,
        required: true
    },
    sizeTypeEnumOptions: {
        type: Array,
        required: true
    },
    statusEnumOptions: {
        type: Array,
        required: true
    }

});

const formRef = ref(null);

const rules = {
    warehouseCode: [
        { required: true, message: '请选择仓库', trigger: 'change' }
    ],
    zoneCode: [
        { required: true, message: '请选择库区', trigger: 'change' }
    ],
    sizeTypeCode: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    code: [
        { required: true, message: '请输入库位代码', trigger: 'blur' },
        { pattern: /^\S+$/, message: '库位代码不能为空格', trigger: 'blur' }
    ],
    lineNumber: [
        { required: true, message: '请输入动线号', trigger: 'blur' }
    ],
    saturation: [
        { required: true, message: '请输入饱和度', trigger: 'blur' }
    ],
    batchNoQty: [
        { required: true, message: '请输入最大批次数', trigger: 'blur' }
    ],
    skuQty: [
        { required: true, message: '请输入最大SKU个数', trigger: 'blur' }
    ],
    xcoord: [
        { required: true, message: '请输入x坐标', trigger: 'blur' }
    ],
    ycoord: [
        { required: true, message: '请输入y坐标', trigger: 'blur' }
    ],
    zcoord: [
        { required: true, message: '请输入z坐标', trigger: 'blur' }
    ],
    accessEase: [
        { required: true, message: '请输入存取难度', trigger: 'blur' }
    ],
    distanceToDock: [
        { required: true, message: '请输入与出货月台间的距离等级', trigger: 'blur' }
    ]
};

// 库区下拉框数据
const zoneEnumOptions = ref([]);
// 仓库选择事件
const selectWh = async (value) => {
    const res = await getWhZoneEnumApi({ warehouseCode: value });
    zoneEnumOptions.value = res.data;
}
onMounted(() => {
    selectWh(props.formData.warehouseCode);
})

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>