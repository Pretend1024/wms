<template>
    <div class="content background">
        <div class="title">
            <span class="iconfont icon-qushi"></span>
            <p>{{ $t('OrderTrend') }}</p>
            <div>
                <label style="margin-right: 10px;">
                    <input type="radio" value="day" v-model="timeType" /> {{ $t('PerDiem') }}
                </label>
                <label>
                    <input type="radio" value="month" v-model="timeType" /> {{ $t('PerMensem') }}
                </label>
            </div>
        </div>
        <div class="recentsContent">
            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>

<script setup name="OrderTrend">
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const timeType = ref('day')  // 默认选择按天
const chartRef = ref(null)

// 格式化日期函数
const formatDate = (date, formatType) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return formatType === 'month'
        ? `${year}/${month}`
        : `${year}/${month}/${day}`
}

// 生成模拟数据
const generateMockData = () => {
    // 生成30天前到今天的日期数组
    const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return formatDate(date, 'day')
    })

    // 生成24个月前到现在的月份数组
    const months = Array.from({ length: 24 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (23 - i))
        return formatDate(date, 'month')
    })

    // 生成随机单量数据
    const generateRandomData = (count, min = 50, max = 200) => {
        return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
    }

    return {
        days,
        months,
        dayData: generateRandomData(30),
        monthData: generateRandomData(24)
    }
}

const mockData = ref(generateMockData())

// 计算属性：根据时间类型获取对应的数据
const chartData = computed(() => {
    return timeType.value === 'day'
        ? { xAxis: mockData.value.days, series: mockData.value.dayData }
        : { xAxis: mockData.value.months, series: mockData.value.monthData }
})

const setChart = () => {
    const chartInstance = echarts.init(chartRef.value)

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            formatter: (params) => {
                const param = params[0]
                return `
                  <div style="font-weight: bold;">${param.name}</div>
                  <div>订单量: ${param.value}</div>
                `
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: timeType.value === 'day' ? '15%' : '8%', // 为了避免日期标签重叠
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chartData.value.xAxis,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                rotate: timeType.value === 'day' ? 45 : 0,
                interval: 0, // 强制显示所有标签
                fontSize: 11 // 减小字体大小，避免拥挤
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            min: 0,
            max: (value) => Math.ceil(value.max * 1.1) // 设置y轴最大值为数据最大值的1.1倍
        },
        series: [
            {
                data: chartData.value.series,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#2196f3',
                    width: 3
                },
                itemStyle: {
                    color: '#2196f3',
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowBlur: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(33, 150, 243, 0.4)' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(33, 150, 243, 0)' // 100% 处的颜色
                        }]
                    }
                },
                symbol: 'circle',
                symbolSize: 8,
                showSymbol: false,
                emphasis: {
                    showSymbol: true
                }
            }
        ]
    }

    chartInstance.setOption(option)

    // 监听窗口变化，调整图表大小
    const resizeHandler = () => {
        chartInstance.resize()
    }

    window.addEventListener('resize', resizeHandler)

    // 组件卸载时移除事件监听
    return () => {
        window.removeEventListener('resize', resizeHandler)
        chartInstance.dispose()
    }
}

// 初次加载时设置图表
onMounted(() => {
    setChart()
})

// 监听 timeType 的变化
watch(timeType, () => {
    setChart()  // 重新绘制图表
})
</script>

<style scoped lang="scss">
$default-padding: 20px;
$default-margin: 20px;

.content {
    padding: $default-padding;
    margin: 10px 0;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

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

        input[type="radio"] {
            margin-right: 5px;
        }
    }
}

.background {
    background-color: white;
}

.recentsContent {
    padding-top: 15px;
}

.iconfont {
    color: #1677ff;
    font-size: 24px;
    margin-right: 5px;
}
</style>