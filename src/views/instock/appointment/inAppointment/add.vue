<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
        <div class="formItem">
            <el-row>
                <el-col :span="24">
                    <p class="title">申请信息</p>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('warehouseId')" prop="warehouseId">
                        <el-select v-model="formData.warehouseId" :placeholder="getPlaceholder('warehouseId')"
                            @change="handleManualAppointment">
                            <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('date')" prop="date">
                        <el-date-picker v-model="formData.date" type="date" format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD" :placeholder="getPlaceholder('date')"
                            @change="handleManualAppointment" :disabled-date="disabledDate" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('platformCode')" prop="platformCode">
                        <el-select v-model="formData.platformCode" :placeholder="getPlaceholder('platformCode')"
                            @change="handlePlatformChange">
                            <el-option v-for="item in platformOptions" :key="item.id" :label="item.platformName"
                                :value="item.platformCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('expectedStartTime')" prop="expectedStartTime">
                        <el-time-select v-model="formData.expectedStartTime" start="00:00" step="01:00" end="23:00"
                            :min-time="platformMinTime" :max-time="platformMaxTime"
                            :placeholder="getPlaceholder('expectedStartTime')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('appointmentNoList')" prop="appointmentNo">
                        <el-input v-model="formData.appointmentNo" v-number
                            :placeholder="getPlaceholder('appointmentNoList')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('appointmentTypeId')" prop="appointmentTypeId">
                        <el-select v-model="formData.appointmentTypeId"
                            :placeholder="getPlaceholder('appointmentTypeId')">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('deliveryTypeId')" prop="deliveryTypeId">
                        <el-select v-model="formData.deliveryTypeId" :placeholder="getPlaceholder('deliveryTypeId')">
                            <el-option v-for="item in deliveryTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="formItem">
            <el-row>
                <el-col :span="24">
                    <p class="title">客户信息</p>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('customerCode')" prop="customerCode">
                        <el-select v-model="formData.customerCode" filterable
                            :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select" clearable>
                            <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('contactPerson')">
                        <el-input v-model="formData.contactPerson" :placeholder="getPlaceholder('contactPerson')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('contactPhone')">
                        <el-input v-model="formData.contactPhone" :placeholder="getPlaceholder('contactPhone')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('carNumber')">
                        <el-input v-model="formData.carNumber" :placeholder="getPlaceholder('carNumber')" />
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item :label="getLabel('remark')">
                        <el-input v-model="formData.remark" type="textarea" autosize
                            :placeholder="getPlaceholder('remark')" />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="formItem">
            <el-row>
                <el-col :span="24">
                    <p class="title">货物信息</p>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('inOrderNo')">
                        <el-input v-model="formData.inOrderNo" :placeholder="getPlaceholder('inOrderNo')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('containerType')">
                        <el-select v-model="formData.containerType" value-key="id"
                            :placeholder="getPlaceholder('containerType')">
                            <el-option v-for="item in cabinetOptions" :key="item.id"
                                :label="`${item.code} -${item.name} `" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('containerNumber')">
                        <el-input v-model="formData.containerNumber" :placeholder="getPlaceholder('containerNumber')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('boxQty')">
                        <el-input v-model="formData.boxQty" v-intNumber :placeholder="getPlaceholder('boxQty')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('skuQty')">
                        <el-input v-model="formData.skuQty" v-intNumber :placeholder="getPlaceholder('skuQty')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('goodsQty')">
                        <el-input v-model="formData.goodsQty" v-intNumber :placeholder="getPlaceholder('goodsQty')" />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </el-form>
    <platformReservationsTable :rooms="platformOptions.map(p => ({ ...p, platformId: p.id }))" :bookings="bookings"
        @booking-click="onBookingClick" :currentBooking="currentBooking" />
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted, watch, defineEmits } from 'vue';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getWhPlatformSelectApi, getWhPlatformAppointmentApi } from "@/api/baseApi/wh.js";
import { getInstockInOrderCabinetTypeEnumApi } from '@/api/instockApi/order.js';
import platformReservationsTable from './platformReservationsTable.vue'

// 定义emit用于修改父组件的formData（修复单向数据流）
const emit = defineEmits(['update:formData']);

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    statusOptions: {
        type: Array,
        default: () => []
    },
    typeOptions: {
        type: Array,
        default: () => []
    },
    warehouseOptions: {
        type: Array,
        default: () => []
    },
    deliveryTypeOptions: {
        type: Array,
        default: () => []
    }
});

const formRef = ref(null);

const rules = {
    warehouseId: [
        { required: true, message: '请选择仓库代码', trigger: 'change' }
    ],
    deliveryTypeId: [
        { required: true, message: '请选择送仓类型', trigger: 'change' }
    ],
    documentSourceId: [
        { required: true, message: '请选择单据来源', trigger: 'change' }
    ],
    date: [
        { required: true, message: '请选择预约日期', trigger: 'change' }
    ],
    expectedStartTime: [
        { required: true, message: '请选择预约开始时间', trigger: 'change' }
    ],
    platformCode: [
        { required: true, message: '请选择月台代码', trigger: 'change' }
    ],
    appointmentTypeId: [
        { required: true, message: '请选择预约类型', trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请输入客户代码', trigger: 'blur' }
    ],
    inOrderNo: [
        { required: true, message: '请输入入库单号', trigger: 'blur' }
    ],
    appointmentNo: [
        { required: true, message: '请输入预约单号', trigger: 'blur' },
    ]
};

// 禁用今天之前的日期和30天后的日期
const disabledDate = (time) => {
    const today = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(today.getDate() + 30);
    return time.getTime() < today.setHours(0, 0, 0, 0) ||
        time.getTime() > fifteenDaysLater.setHours(23, 59, 59, 999);
};

// 预约数据点击事件
const onBookingClick = (b) => {
    console.log('你点击了预订：', b)
}

// 客户选项列表
const customerOptions = ref([]);
// 月台选项列表
const platformOptions = ref([]);
// 预约情况数据
const bookings = ref([]);

// 手动触发预约数据获取（仅用户选择仓库/日期时执行）
const handleManualAppointment = () => {
    getAppointmentData(true);
};

// 获取预约数据（isManual：是否手动触发）
const getAppointmentData = async (isManual = false) => {
    if (!props.formData.warehouseId || !props.formData.date) return;

    // 仅手动触发时清空月台（通过emit通知父组件修改）
    if (isManual) {
        emit('update:formData', {
            ...props.formData,
            platformCode: ''
        });
    }

    const res = await getWhPlatformAppointmentApi({ date: props.formData.date });
    const res2 = await getWhPlatformSelectApi({
        warehouseId: props.formData.warehouseId,
        appointmentDate: props.formData.date + ' 00:00:00'
    });
    platformOptions.value = res2.data;
    bookings.value = res.data;
    console.log('预约情况弹窗相关:', bookings.value)
};

// 暴露表单校验方法
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});

// 货柜型号列表
const cabinetOptions = ref([]);

onMounted(async () => {
    // 初始化货柜型号
    const cabinetRes = await getInstockInOrderCabinetTypeEnumApi();
    cabinetOptions.value = cabinetRes.data;

    // 初始化客户列表
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }));
});

// 当前选中的预约信息
const currentBooking = ref({
    platformCode: '',
    expectedStartTime: ''
});

// 监听月台和时间变化更新当前预约信息
watch(
    () => [props.formData.platformCode, props.formData.expectedStartTime],
    ([newPlatformCode, newTime]) => {
        currentBooking.value = {
            platformCode: newPlatformCode,
            expectedStartTime: newTime
        };
    },
    { immediate: true }
);

// 月台时间范围
const platformMinTime = ref(null);
const platformMaxTime = ref(null);

// 处理月台选择变化
const handlePlatformChange = (platformCode) => {
    platformMinTime.value = null;
    platformMaxTime.value = null;

    if (!platformCode || !platformOptions.value.length) return;

    // 查找匹配的月台信息
    const matchedBooking = platformOptions.value.find(
        item => item.platformCode === platformCode
    );

    if (matchedBooking && matchedBooking.startTime && matchedBooking.endTime) {
        // 解析原始开始时间
        const [startHour, startMinute] = matchedBooking.startTime.split(':').map(Number);
        const minTime = new Date();
        minTime.setHours(startHour - 1, startMinute, 0);

        // 处理跨天情况
        if (minTime.getHours() < 0) {
            platformMinTime.value = '00:00';
        } else {
            platformMinTime.value = `${String(minTime.getHours()).padStart(2, '0')}:${String(minTime.getMinutes()).padStart(2, '0')}`;
        }
        platformMaxTime.value = matchedBooking.endTime;

        // 检查当前时间是否超出范围，超出则清空（通过emit修改）
        if (props.formData.expectedStartTime) {
            const currentTime = props.formData.expectedStartTime;
            if (currentTime < platformMinTime.value || currentTime > platformMaxTime.value) {
                emit('update:formData', {
                    ...props.formData,
                    expectedStartTime: ''
                });
            }
        }
    }
};
</script>

<style scoped>
:deep(.el-cascader) {
    width: 100%;
}

:deep(.el-input) {
    width: 100%;
}

.title {
    margin-bottom: 3px;
    padding-bottom: 5px;
    font-size: 17px;
    font-weight: 550;
}

.formItem {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    margin: 5px 0;
}
</style>