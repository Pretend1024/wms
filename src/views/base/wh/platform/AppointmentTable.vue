<template>
    <div>
        <!-- 周选择器 -->
        <div style="margin-bottom: 16px; display: flex; justify-content: flex-end;">
            <el-date-picker v-model="selectedWeek" type="week" format="YYYY 第 ww 周" placeholder="请选择周"
                @change="handleWeekChange" />
        </div>
        <!-- 表格展示 -->
        <el-table :data="timeSlots" border style="width: 100%" height="550px">
            <!-- 时间段列 -->
            <el-table-column label="时间段" prop="time" width="105" fixed />

            <!-- 动态日期列 -->
            <el-table-column v-for="date in dateColumns" :key="date" :label="formatLabel(date)" :prop="date"
                :label-class-name="getHeaderClass">
                <template #default="{ row }">
                    <div :class="getCellClass(row[date])"
                        @click="row[date] && row[date].appointmentNo && emitCellClick(row[date])">
                        {{ row[date]?.statusId !== 0 ? row[date]?.statusName : '' }}
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getWhPlatformAppointmentApi } from '@/api/baseApi/wh'

const props = defineProps({
    platformId: {
        type: [String, Number],
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['cellClick'])

// 当前日期
const today = dayjs().format('YYYY-MM-DD')

// 默认当前周
const selectedWeek = ref(dayjs())

// 表头样式
const formatLabel = (dateStr) => {
    const date = dayjs(dateStr)
    const isToday = date.format('YYYY-MM-DD') === today
    return `${date.format('MM-DD')}${isToday ? ' (今天)' : ''}`
}

const getHeaderClass = ({ column }) => {
    const dateStr = column.property
    return dayjs(dateStr).format('YYYY-MM-DD') === today ? 'header-today' : 'header-other'
}

// 数据源
const appointments = ref([])

// API 获取预约数据
const fetchAppointments = async () => {
    const startOfWeek = dayjs(selectedWeek.value).startOf('week').add(1, 'day') // 周一
    const endOfWeek = dayjs(startOfWeek).add(6, 'day') // 周日

    const dateBegin = startOfWeek.format('YYYY-MM-DD')
    const dateEnd = endOfWeek.format('YYYY-MM-DD')

    const res = await getWhPlatformAppointmentApi({
        platformId: props.platformId,
        dateBegin,
        dateEnd,
    })

    appointments.value = res.data || []
}

// 获取所有日期列 - 根据选择的周直接生成周一到周日
const dateColumns = computed(() => {
    const startOfWeek = dayjs(selectedWeek.value).startOf('week').add(1, 'day') // 周一
    const columns = []
    
    for (let i = 0; i < 7; i++) {
        const date = dayjs(startOfWeek).add(i, 'day')
        columns.push(date.format('YYYY-MM-DD'))
    }
    
    return columns
})

// 时间段行数据
const timeSlots = computed(() => {
    const startHour = parseInt(props.startTime.split(':')[0])
    const endHour = parseInt(props.endTime.split(':')[0])
    const slots = []

    for (let h = startHour; h < endHour; h++) {
        const nextHour = h + 1
        const row = {
            time: `${String(h).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`
        }

        // 初始化所有日期列
        dateColumns.value.forEach(date => {
            row[date] = null
        })

        // 填充有预约的数据
        for (const appt of appointments.value) {
            const dateKey = dayjs(appt.date).format('YYYY-MM-DD')
            if (appt.hour === h && dateColumns.value.includes(dateKey)) {
                row[dateKey] = appt
            }
        }

        slots.push(row)
    }

    return slots
})

// 单元格样式
const getCellClass = (cellData) => {
    return cellData?.statusId && cellData.statusId !== 0 ? 'cell-active' : 'cell-inactive'
}

// 点击单元格事件抛出
const emitCellClick = (appointment) => {
    emit('cellClick', { appointment })
}

// 切换周
const handleWeekChange = () => {
    fetchAppointments()
}

// 首次加载
onMounted(() => {
    fetchAppointments()
})
</script>

<style scoped>
.header-today {
    background-color: #409EFF;
    color: white;
    text-align: center;
}

.header-other {
    text-align: right;
}

.cell-active {
    background-color: #409EFF;
    color: white;
    text-align: center;
    cursor: pointer;
}

.cell-inactive {
    text-align: center;
}
</style>