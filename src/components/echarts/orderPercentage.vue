<template>
    <div class="content background">
        <div class="title">
            <span :class="['iconfont', `${props.iconfont}`]"></span>
            <p>{{ props.title }}</p>
        </div>
        <div class="recentsContent">
            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>

<script setup name="OrderPercentage">
import { ref, onMounted, watch, computed, defineProps, onUnmounted } from 'vue'
import echarts from '@/utils/echarts-config'

const props = defineProps({
    customerData: {
        type: Array,
        required: true,
        default: () => []
    },
    title: {
        type: String,
        default: '客户订单比例'
    },
    iconfont: {
        type: String
    }
})

const chartRef = ref(null)
const chartInstance = ref(null)

// 处理数据：合并其他客户，仅在tooltip显示
const processedData = computed(() => {
    const sorted = [...props.customerData].sort((a, b) => b.value - a.value)
    const top10 = sorted.slice(0, 10)
    const other = sorted.slice(10).reduce((sum, item) => sum + item.value, 0)
    return other > 0 ? [...top10, { value: other, name: '其他客户' }] : top10
})

const renderChart = () => {
    if (chartInstance.value) chartInstance.value.dispose()
    const chartDom = chartRef.value
    chartInstance.value = echarts.init(chartDom)

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)', // 悬浮提示（方框内容）
            backgroundColor: 'white',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            padding: 10
        },
        legend: {
            show: true,
            orient: 'vertical',    // 垂直排列
            left: 'right',         // 靠右显示
            top: 'center',         // 垂直居中
            align: 'left',         // 文字左对齐
            textStyle: {
                fontSize: 14       // 调整文字大小
            }
        },
        series: [
            {
                type: 'pie',
                radius: '60%',
                center: ['37%', '50%'],
                data: processedData.value,
                label: { show: false },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        ]
    }

    chartInstance.value.setOption(option)
}

onMounted(() => {
    renderChart()
    window.addEventListener('resize', () => chartInstance.value?.resize())
    onUnmounted(() => window.removeEventListener('resize', () => { }))
})

watch(() => props.customerData, renderChart)
onUnmounted(() => chartInstance.value?.dispose())
</script>

<style scoped lang="scss">
.content {
    padding: 20px;
    margin: 10px 0;
    border-radius: 15px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .title {
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;

        p {
            font-weight: 550;
            margin: 0;
            flex: 1;
        }
    }
}

.background {
    background-color: white;
}

.recentsContent {
    width: 100%;
    height: 100%;
}

.iconfont {
    color: #1677ff;
    font-size: 24px;
    margin-right: 5px;
}
</style>