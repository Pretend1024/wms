<template>
    <el-table :data="data" border stripe style="width: 100%">
        <el-table-column v-for="(col, index) in columns" :key="index" :label="col.label" v-bind="getColumnProps(col)">
            <!-- 单元格插槽 -->
            <template v-if="col.slot" #default="scope">
                <slot :name="col.slot" v-bind="scope" />
            </template>
            <!-- 表头插槽 -->
            <template v-if="col.headerSlot" #header="scope">
                <slot :name="col.headerSlot" v-bind="scope" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    /**
     * 列配置数组，支持属性:
     * label: 列头文字
     * prop: 字段名
     * width: 宽度
     * fixed: 'left' | 'right'
     * showOverflowTooltip: boolean
     * slot: 单元格插槽名称
     * headerSlot: 表头插槽名称
     */
    columns: {
        type: Array,
        required: true
    },
    /** 表格数据 */
    data: {
        type: Array,
        required: true
    }
});

function getColumnProps(col) {
    const props = {};
    ['prop', 'width', 'fixed', 'showOverflowTooltip'].forEach(key => {
        if (col[key] !== undefined) {
            props[key] = col[key];
        }
    });
    return props;
}
</script>