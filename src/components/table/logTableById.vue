<template>
    <div style="height: 100%;">
        <hydTable :footer="footer" :tableData="data" :columns="columns" :loading="loading">
            <template #isSuccess="{ row }">
                <span :style="{ color: row.isSuccess ? 'green' : 'red' }">{{ row.isSuccess ? '成功' : '失败' }}</span>
            </template>
            <template #message="{ row }">
                <div v-html="row.message"></div>
            </template>
        </hydTable>
    </div>
</template>

<script setup>
import { getOpLogApi } from '@/api/baseApi/index.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});
const data = ref()

// 表格列配置
const columns = ref([
    { label: '用户代码', prop: 'userCode', width: '125', sortable: true, fixed: 'left' },
    { label: '操作时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '操作类型', prop: 'opType', width: '125', sortable: true, },
    { label: '操作结果', prop: 'isSuccess', width: '110', slot: 'isSuccess', sortable: true },
    { label: '操作消息', prop: 'message', width: '650', slot: 'message' },
    { label: '登录端', prop: 'terminalName', width: '100', sortable: true, },
    { label: 'IP地址', prop: 'ip_address', width: '150', sortable: true },
    { label: 'IP所在城市地址', prop: 'ip_location', width: '160', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
]);

const formRef = ref(null);

defineExpose({
    validate: () => {
        return formRef.value.validate();
    }
});
onMounted(async () => {
    const res = await getOpLogApi({ objId: props.formData.id })
    data.value = res.data
})
</script>