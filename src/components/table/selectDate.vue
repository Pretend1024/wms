<template>
    <div class="select-input">
        <el-select v-model="selectedType">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span>:</span>
        <el-date-picker v-model="dateRange" type="datetimerange" :format="dateFormat" :value-format="dateFormat"
            :style="{ width: labelWidth + 'px' }"
            :placeholder="userMenuStore.lang === 'zh' ? ['开始时间', '结束时间'] : ['Start time', 'End time']" clearable
            :default-time="defaultTime" />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import useUserMenuStore from '@/store/userMenu';
const userMenuStore = useUserMenuStore()

// 定义事件，向父组件传递选择结果
const emit = defineEmits(['change']);

// 根据语言设置不同的宽度
const labelWidth = computed(() => (userMenuStore.lang === 'zh' ? 157 : 212))
// 日期时间格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

// 默认时间范围，避免选择日期时没有时间部分
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
]

// 选中的类型
const selectedType = ref('');
// 日期范围 [开始时间, 结束时间]
const dateRange = ref([]);

const props = defineProps({
    options: { // 下拉数据 [{label:'名称', value:'xxx'}]
        type: Array,
        required: true
    },
    // 可选：初始日期类型
    initialDateType: {
        type: Number,
        default: 10
    },
    // 可选：初始日期范围
    initialDateRange: {
        type: Array,
        default: () => []
    }
})

// 初始化数据
selectedType.value = props.initialDateType;
dateRange.value = props.initialDateRange;

// 重置方法：恢复到初始值
const reset = () => {
    selectedType.value = props.initialDateType;
    dateRange.value = [...props.initialDateRange];
}

// 暴露重置方法给外部调用
defineExpose({ reset })

// 监听类型变化，触发事件
watch(selectedType, (value) => {
    emit('change', {
        dateType: value,
        dateRange: dateRange.value
    });
})

// 监听日期范围变化，触发事件
watch(dateRange, (value) => {
    emit('change', {
        dateType: selectedType.value,
        dateRange: value
    });
})
</script>

<style scoped>
.select-input {
    display: inline-flex;
    align-items: center;
}

.el-select {
    width: 80px;
    margin-left: 10px;
}

.el-date-picker {
    margin-left: 5px;
}
</style>