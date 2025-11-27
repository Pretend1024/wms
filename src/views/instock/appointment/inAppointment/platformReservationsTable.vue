<template>
    <div>
        <el-table :data="tableData" border :header-cell-style="headerCellStyle" :cell-style="cellStyle"
            style="width: 100%" height="300px">
            <!-- 月台列 -->
            <el-table-column prop="platformName" label="月台" fixed="left" width="120" />

            <!-- 小时列 -->
            <el-table-column width="55px" v-for="col in timeColumns" :key="col.hour" :label="col.label"
                :prop="String(col.hour)">
                <template #default="{ row }">
                    <div :class="getCellClass(row.bookingsMap[col.hour])"
                        @click="handleClick(row.bookingsMap[col.hour])">
                        {{ getCellText(row.bookingsMap[col.hour]) }}
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// Props定义
const props = defineProps({
    rooms: {
        type: Array,
        required: true,
        description: '月台列表数据，包含platformId、platformCode、platformName等字段'
    },
    bookings: {
        type: Array,
        required: true,
        description: '预约数据，包含platformId、hour、statusId、statusName等字段'
    },
    currentBooking: {
        type: Object,
        default: () => ({}),
        description: '当前选中的预约信息，包含platformCode和expectedStartTime字段'
    },
    editingBooking: {
        type: Object,
        default: () => ({}),
        description: '当前正在编辑的预约信息，用于回显之前的预约位置，包含platformCode和expectedStartTime字段'
    }
})

// 表头样式
const headerCellStyle = { textAlign: 'center', padding: '4px' }
// 单元格样式
const cellStyle = { padding: '0', textAlign: 'center' }

// 生成时间段列（0:00-1:00 格式）
const timeColumns = computed(() => {
    return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        label: `${String(i).padStart(2, '0')}:00-${String(i + 1).padStart(2, '0')}:00`
    }))
})

// 解析当前预约的小时数（用于匹配表格列）
const currentHour = computed(() => {
    const { expectedStartTime } = props.currentBooking;
    if (!expectedStartTime) return -1; // 无时间时返回-1（不匹配任何列）

    // 从时间字符串中提取小时（如"09:30" -> 9）
    const hourStr = expectedStartTime.split(':')[0];
    return parseInt(hourStr, 10) || -1; // 转换为数字，无效时返回-1
});

// 解析编辑中预约的小时数
const editingHour = computed(() => {
    const { expectedStartTime } = props.editingBooking;
    if (!expectedStartTime) return -1;

    const hourStr = expectedStartTime.split(':')[0];
    return parseInt(hourStr, 10) || -1;
});

// 构造表格数据：按 platformId 分组，并生成每行的 hour => booking 映射
const tableData = computed(() => {
    // 每次计算时重新生成数据，确保不保留旧的标记
    return props.rooms.map(room => {
        // 每次都创建新的bookingsMap，避免引用旧对象
        const bookingsMap = {};
        // 初始化24小时的空数据
        for (let hour = 0; hour < 24; hour++) {
            bookingsMap[hour] = null;
        }

        // 填充预约数据
        props.bookings.forEach(b => {
            if (b.platformId === room.platformId && typeof b.hour === 'number' && b.hour >= 0 && b.hour <= 23) {
                bookingsMap[b.hour] = { ...b }; // 深拷贝，避免修改原数据
            }
        });

        // 标记当前预约（只标记最新的）
        const { platformCode } = props.currentBooking;
        const currentHour = parseInt(props.currentBooking.expectedStartTime?.split(':')[0] || -1, 10);
        if (platformCode && room.platformCode === platformCode && currentHour >= 0 && currentHour <= 23) {
            // 覆盖旧的标记，只保留最新的当前预约
            bookingsMap[currentHour] = bookingsMap[currentHour]
                ? { ...bookingsMap[currentHour], isCurrentBooking: true }
                : {
                    isCurrentBooking: true,
                    platformId: room.platformId,
                    hour: currentHour
                };
        }

        // 标记正在编辑的预约（如果有）
        const { platformCode: editingPlatformCode } = props.editingBooking;
        const editingHour = parseInt(props.editingBooking.expectedStartTime?.split(':')[0] || -1, 10);
        if (editingPlatformCode && room.platformCode === editingPlatformCode && editingHour >= 0 && editingHour <= 23) {
            // 编辑状态优先级低于当前选中状态
            if (!bookingsMap[editingHour]?.isCurrentBooking) {
                bookingsMap[editingHour] = bookingsMap[editingHour]
                    ? { ...bookingsMap[editingHour], isEditing: true }
                    : {
                        isEditing: true,
                        platformId: room.platformId,
                        hour: editingHour
                    };
            }
        }

        return {
            ...room,
            bookingsMap
        };
    });
});

// 样式选择器
function getCellClass(cellData) {
    // 优先判断是否为当前预约
    if (cellData?.isCurrentBooking) return 'cell-green';
    // 其次判断是否为正在编辑的预约
    if (cellData?.isEditing) return 'cell-orange';

    if (!cellData) return 'cell-other';
    if (cellData.statusId === 1) return 'cell-blue';  // 显示文字，蓝色
    if (cellData.statusId === 2) return 'cell-gray';  // 灰色，无文字
    return 'cell-other';  // 默认样式
}

// 获取单元格文本内容
function getCellText(cellData) {
    // 当前预约显示固定文本
    if (cellData?.isCurrentBooking) return '当前预约';
    // 编辑中的预约显示固定文本
    if (cellData?.isEditing) return '编辑中';

    if (!cellData) return '';
    if (cellData.statusId === 1) return cellData.statusName || '';
    return '';  // 其他状态不显示文字
}

// 单元格点击事件
function handleClick(booking) {
    if (booking && booking.id) {
        console.log('点击预约：', booking)
        // 可以在这里添加自定义点击逻辑，比如触发父组件事件
        // emit('booking-click', booking)
    }
}
</script>

<style scoped>
.cell-blue {
    background-color: #409EFF;
    color: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.cell-gray {
    background-color: #e0e0e0;
    color: transparent;
    min-height: 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: default;
}

.cell-green {
    background-color: #52c41a;
    color: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.cell-orange {
    background-color: #fa8c16;
    color: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.cell-other {
    background-color: #f2f2f2;
    color: #666;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

:deep(.cell) {
    padding: 0;
    font-size: 14px;
}
</style>    