<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="700" align-center :show-close="false"
        :close-on-click-modal="false" destroy-on-close>
        <el-table :data="tableData" height="600">
            <el-table-column type="index" width="55" fixed align="center" label="序号"></el-table-column>
            <el-table-column :property="nameField" :label="nameLabel"></el-table-column>
            <el-table-column :property="tableData.successValue" label="结果" width="55">
                <template #default="scope">
                    <p :style="{ color: isSuccess(scope.row) ? 'green' : 'red' }">
                        {{ isSuccess(scope.row) ? '成功' : '失败' }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column :label="resultLabel">
                <template #default="scope">
                    <p :style="{ color: isSuccess(scope.row) ? 'green' : 'red' }">
                        {{ scope.row[resultField] }}
                    </p>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <p>操作进度：{{ props.promptMessage }}</p>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    // 父组件控制弹窗显示状态（只读）
    isVisible: {
        type: Boolean,
        default: false
    },
    dialogTitle: {
        type: String,
        default: '删除结果'
    },
    tableData: {
        type: Array,
        default: () => []
    },
    nameField: {
        type: String,
        required: true // 名称列字段（如：id/name/code）
    },
    nameLabel: {
        type: String,
        required: true // 名称列显示名（如：名称/编号/代码）
    },
    resultField: {
        type: String,
        default: 'msg' // 结果列字段（如：msg/status）
    },
    successValue: {
        type: [String, Number, Boolean], // 成功时的值（用于颜色判断）
        default: 'success'
    },
    resultLabel: {
        type: String,
        default: '消息' // 结果列显示名
    },
    promptMessage: {
        type: String, // 提示消息
        default: '未完成'
    }

});

const emits = defineEmits(['close']); // 定义关闭事件

// 子组件本地状态（避免直接修改 prop）
const visible = ref(props.isVisible);

// 监听父组件 prop 变化（同步到本地状态）
watch(() => props.isVisible, (newVal) => {
    visible.value = newVal;
});

// 关闭弹窗时触发事件
const handleClose = () => {
    visible.value = false;
    emits('close'); // 通知父组件关闭
};

// 结果颜色判断
const isSuccess = (row) => {
    if ('success' in row) {
        return row.success === true;
    }
    // 原来的逻辑：支持字符串或其他类型
    const value = row[props.resultField];
    if (typeof value === 'string') {
        return value.includes(props.successValue);
    }
    return value === props.successValue;
};
</script>

<style scoped lang="scss">
.dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        font-size: 17px;
        color: green;
    }
}
</style>