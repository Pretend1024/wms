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
                            @change="getAppointmentData">
                            <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('date')" prop="date">
                        <el-date-picker v-model="formData.date" type="date" format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD" :placeholder="getPlaceholder('date')" @change="getAppointmentData"
                            :disabled-date="disabledDate" />
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
                            :disabled="props.formData.statusId == 60"
                            :placeholder="getPlaceholder('expectedStartTime')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('appointmentNo')" prop="appointmentNo">
                        <el-input v-model="formData.appointmentNo" v-number
                            :placeholder="getPlaceholder('appointmentNo')" />
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
                        <el-input v-model="formData.boxQty" v-number :placeholder="getPlaceholder('boxQty')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('skuQty')">
                        <el-input v-model="formData.skuQty" v-number :placeholder="getPlaceholder('skuQty')" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="getLabel('goodsQty')">
                        <el-input v-model="formData.goodsQty" v-number :placeholder="getPlaceholder('goodsQty')" />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </el-form>
    <platformReservationsTable :rooms="platformOptions.map(p => ({ ...p, platformId: p.id }))" :bookings="bookings"
        :currentBooking="currentBooking" :editingBooking="editingBooking" @booking-click="onBookingClick" />

</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getWhPlatformSelectApi, getWhPlatformAppointmentApi } from "@/api/baseApi/wh.js";
import { getInstockInOrderCabinetTypeEnumApi } from '@/api/instockApi/order.js';
import platformReservationsTable from './platformReservationsTable.vue'
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
// 禁用今天之前的日期和15天后的日期
const disabledDate = (time) => {
    const today = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(today.getDate() + 30);

    // 禁用今天之前的日期和30天后的日期
    return time.getTime() < today.setHours(0, 0, 0, 0) ||
        time.getTime() > fifteenDaysLater.setHours(23, 59, 59, 999);
};
// 预约数据
const onBookingClick = (b) => {
    console.log('你点击了预订：', b)
}
// 筛选客户代码
const customerOptions = ref([]);

const platformOptions = ref([])
// 预约情况弹窗相关
const bookings = ref([]);
const getAppointmentData = async () => {
    if (!props.formData.date || !props.formData.warehouseId) return;
    const res = await getWhPlatformAppointmentApi({ date: props.formData.date });
    const res2 = await getWhPlatformSelectApi({ warehouseId: props.formData.warehouseId, appointmentDate: props.formData.date + ' 00:00:00' })
    platformOptions.value = res2.data
    bookings.value = res.data;
    console.log('预约情况弹窗相关:', bookings.value)
}
defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});

// 货柜型号
const cabinetOptions = ref([])
onMounted(async () => {
    // 货柜型号
    const cabinetRes = await getInstockInOrderCabinetTypeEnumApi()
    cabinetOptions.value = cabinetRes.data
})

// 当前预约信息
const currentBooking = ref({
    platformCode: '',
    expectedStartTime: ''
});
// 编辑中的预约信息
const editingBooking = ref({
    platformCode: props.formData.platformCode || '',
    expectedStartTime: props.formData.expectedStartTime || ''
});
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
onMounted(async () => {
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    setTimeout(() => {
        handlePlatformChange(props.formData.platformCode);
    }, 300);
    getAppointmentData();
})

// 存储月台时间范围
const platformMinTime = ref(null);
const platformMaxTime = ref(null);

// 处理月台选择变化
const handlePlatformChange = (platformCode) => {
    console.log('选择的月台代码:', platformCode);
    // 重置时间限制
    platformMinTime.value = null;
    platformMaxTime.value = null;
    console.log('匹配的预约信息:', platformOptions.value);
    if (!platformCode || !platformOptions.value.length) return;

    // 查找匹配的预约信息
    const matchedBooking = platformOptions.value.find(
        item => item.platformCode === platformCode
    );

    if (matchedBooking && matchedBooking.startTime && matchedBooking.endTime) {
        // 解析原始开始时间
        const [startHour, startMinute] = matchedBooking.startTime.split(':').map(Number);

        // 计算最小时间（原始最小时间 - 1小时）
        const minTime = new Date();
        minTime.setHours(startHour - 1, startMinute, 0);

        // 处理跨天情况（如果减1小时后小时为负数，强制设为00:00）
        if (minTime.getHours() < 0) {
            platformMinTime.value = '00:00'; // 直接设为00:00，避免跨天
        } else {
            // 格式化回"HH:mm"格式
            platformMinTime.value = `${String(minTime.getHours()).padStart(2, '0')}:${String(minTime.getMinutes()).padStart(2, '0')}`;
        }
        // 最大时间保持原始值
        platformMaxTime.value = matchedBooking.endTime;
        // 如果当前选择的时间超出新范围，重置时间
        if (props.formData.expectedStartTime) {
            const currentTime = props.formData.expectedStartTime;
            if (currentTime < platformMinTime.value || currentTime > platformMaxTime.value) {
                props.formData.expectedStartTime = '';
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