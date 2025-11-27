<template>
    <div style="width: 260px;">
        <el-table :data="data" border size="small" max-height="200" style="width: 100%;" v-loading="loading"
            show-summary :summary-method="getSummaries">
            <el-table-column prop="opTypeName" label="操作类型" min-width="100" />
            <el-table-column prop="changeQty" label="操作数量" min-width="80" />
        </el-table>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Array,
    loading: Boolean
})

// 表格底部合计函数
const getSummaries = ({ columns, data }) => {
    const sums = []
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (column.property === 'changeQty') {
            const total = data.reduce((acc, item) => {
                const val = Number(item.changeQty)
                return acc + (isNaN(val) ? 0 : val)
            }, 0)
            sums[index] = total
        } else {
            sums[index] = ''
        }
    })
    return sums
}
</script>