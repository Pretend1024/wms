<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="105px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('name')" prop="name">
                    <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input type='textarea' v-model="formData.remark" :placeholder="getPlaceholder('remark')" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <fuelDetailsTable :columns="fuelColumns" :data="fuelTableData" @update:data="fuelTableData = $event" />
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import fuelDetailsTable from './fuelDetailsTable.vue'
import dayjs from 'dayjs'
import { getProductShipwayFuelDetailApi } from '@/api/productApi/shipway.js'

const props = defineProps({
    itemDataId: {
        type: String,
        required: true
    },
    formData: {
        type: Object,
        required: true
    }
});
// 明细表格数据
const fuelTableData = ref([]);
const fuelColumns = ref([
    { label: '生效日期', prop: 'date' },
    { label: '燃油费率(%)', prop: 'rate', width: '150' },
])
const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: '请输入模板名称', trigger: 'blur' }
    ]
};

defineExpose({
    // 校验表单
    validate: () => {
        return formRef.value.validate();
    },
    // 获取表格数据（格式化日期）
    getFuelTableData: () => {
        return fuelTableData.value
            .filter(row => row.dateStart || row.dateEnd || row.rate) // 过滤掉空行
            .map(row => {
                const newRow = { ...row };

                // 格式化日期
                if (newRow.dateStart) {
                    newRow.dateStart = dayjs(newRow.dateStart).format('YYYY-MM-DD 00:00:00');
                }
                if (newRow.dateEnd) {
                    newRow.dateEnd = dayjs(newRow.dateEnd).format('YYYY-MM-DD 00:00:00');
                }

                // 处理费率 (/100)
                if (newRow.rate !== '' && newRow.rate !== null && !isNaN(newRow.rate)) {
                    newRow.rate = Number(newRow.rate) / 100;
                } else {
                    newRow.rate = null; // 非法输入时置空
                }

                return newRow;
            });
    }
});
onMounted(async () => {
    const res = await getProductShipwayFuelDetailApi({ fuelId: props.itemDataId });
    fuelTableData.value = (res.data || []).map(item => ({
        ...item,
        rate: item.rate !== null && !isNaN(item.rate) ? item.rate * 100 : item.rate
    }));
})
</script>

<style scoped>
:deep(.el-cascader) {
    width: 100%;
}

:deep(.el-input) {
    width: 100%;
}
</style>
