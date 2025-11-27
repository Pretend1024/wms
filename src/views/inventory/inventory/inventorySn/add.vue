<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <!-- 客户（必填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                    <el-select v-model="formData.customerCode" filterable :placeholder="getPlaceholder('customerCode')"
                        clearable popper-class="multi-column-select">
                        <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 仓库（必填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode">
                    <el-select v-model="formData.warehouseCode" filterable
                        :placeholder="getPlaceholder('warehouseCode')" clearable>
                        <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- 入库单号（必填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('inOrderNo')" prop="inOrderNo">
                    <el-input v-model="formData.inOrderNo" :placeholder="getPlaceholder('inOrderNo')" />
                </el-form-item>
            </el-col>

            <!-- SKU（必填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('sku')" prop="sku">
                    <el-input v-model="formData.sku" :placeholder="getPlaceholder('sku')" />
                </el-form-item>
            </el-col>

            <!-- SN（必填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('sn')" prop="sn">
                    <el-input v-model="formData.sn" :placeholder="getPlaceholder('sn')" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="getLabel('shippedTime')">
                    <el-input v-model="formData.shippedTime" readonly disabled />
                </el-form-item>
            </el-col>
            <!-- 收货时间（选填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('receiptTime')">
                    <el-date-picker v-model="formData.receiptTime" type="datetime"
                        :placeholder="getPlaceholder('receiptTime')" value-format="YYYY-MM-DDTHH:mm:ss" />
                </el-form-item>
            </el-col>

            <!-- 上架时间（选填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('inshelfTime')">
                    <el-date-picker v-model="formData.inshelfTime" type="datetime"
                        :placeholder="getPlaceholder('inshelfTime')" value-format="YYYY-MM-DDTHH:mm:ss" />
                </el-form-item>
            </el-col>
            <!-- 库位号（选填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('locationCode')">
                    <el-input v-model="formData.locationCode" :placeholder="getPlaceholder('locationCode')" />
                </el-form-item>
            </el-col>

            <!-- 出库单号（选填） -->
            <el-col :span="8">
                <el-form-item :label="getLabel('outOrderNo')">
                    <el-input v-model="formData.outOrderNo" :placeholder="getPlaceholder('outOrderNo')" />
                </el-form-item>
            </el-col>





            <!-- 备注（选填） -->
            <el-col :span="24">
                <el-form-item :label="getLabel('remark')">
                    <el-input v-model="formData.remark" :placeholder="getPlaceholder('remark')" type="textarea" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>

    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>

        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import { getLabel } from '@/utils/i18n/i18nLabels.js';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    customerOptions: {
        type: Array,
        required: true
    },
    warehouseOptions: {
        type: Array,
        required: true
    },
});

const formRef = ref(null);

const rules = {
    customerCode: [
        { required: true, message: '请选择' + getLabel('customerCode'), trigger: 'change' }
    ],
    warehouseCode: [
        { required: true, message: '请选择' + getLabel('warehouseCode'), trigger: 'change' }
    ],
    inOrderNo: [
        { required: true, message: '请输入' + getLabel('inOrderNo'), trigger: 'blur' }
    ],
    sku: [
        { required: true, message: '请输入' + getLabel('sku'), trigger: 'blur' }
    ],
    sn: [
        { required: true, message: '请输入' + getLabel('sn'), trigger: 'blur' }
    ]
};

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
</script>

<style scoped lang="scss">
p {
    font-size: 22px;
    padding: 0 0 10px 15px;
    margin-top: 5px;
    margin-bottom: 15px;
    font-weight: 550;
    border-bottom: 1px solid #ccc;
}
</style>