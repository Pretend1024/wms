<template>
    <div class="step-operation-fee">
        <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增操作费</el-button>
        </div>

        <div class="table-content">
            <el-table :data="tableData" border stripe height="100%" v-loading="loading">
                <el-table-column label="费用类型" prop="feeMainTypeId" width="150">
                    <template #default="{ row }">
                        {{ getFeeTypeName(row.feeMainTypeId) }}
                    </template>
                </el-table-column>
                <el-table-column label="费用小类" prop="feeSubTypeId" width="150">
                    <template #default="{ row }">
                        {{ getFeeSubTypeName(row.feeSubTypeId) }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip />
                <el-table-column prop="createdBy" label="创建人" width="120" />
                <el-table-column prop="createdTime" label="创建时间" width="180" />
                <el-table-column prop="updatedBy" label="更新人" width="120" />
                <el-table-column prop="updatedTime" label="更新时间" width="180" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <OperationFeeDialog v-if="dialogVisible" v-model="dialogVisible" :project-id="projectId"
            :edit-data="currentEditData" @success="getList" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import OperationFeeDialog from './components/OperationFeeDialog.vue'

// API
import {
    getPriceWhOpListByProjectIdApi,
    delPriceWhOpByIdApi
} from "@/api/productApi/shipway"
import { getVasOrderFeeTypeEnumApi } from "@/api/vasApi/vas.js"

const props = defineProps({
    projectId: { type: String, required: true }
})

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const currentEditData = ref(null)
const feeTypeEnum = ref([])

// 获取枚举用于回显名称
const loadEnums = async () => {
    try {
        const res = await getVasOrderFeeTypeEnumApi()
        feeTypeEnum.value = res.data
    } catch (e) {
        console.error(e)
    }
}

const getFeeTypeName = (id) => {
    const item = feeTypeEnum.value.find(i => i.id === id)
    return item ? item.name : id
}

// 模拟小类名称 (实际应有接口)
const getFeeSubTypeName = (id) => {
    return id === 1 ? '测试小类' : id
}

// 获取列表
const getList = async () => {
    if (!props.projectId) return
    loading.value = true
    try {
        const res = await getPriceWhOpListByProjectIdApi({ projectId: props.projectId })
        if (res.success) {
            tableData.value = res.data
        }
    } finally {
        loading.value = false
    }
}

// 新增
const handleAdd = () => {
    currentEditData.value = null
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
    currentEditData.value = { ...row }
    dialogVisible.value = true
}

// 删除
const handleDel = (row) => {
    ElMessageBox.confirm('确认删除该操作费报价吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        try {
            const res = await delPriceWhOpByIdApi({ id: row.id })
            if (res.success) {
                ElMessage.success(res.msg)
                getList()
            } else {
                ElMessage.error(res.msg)
            }
        } catch (e) {
            console.error(e)
        }
    }).catch(() => { })
}

onMounted(async () => {
    await loadEnums()
    getList()
})
</script>

<style scoped lang="scss">
.step-operation-fee {
    height: 100%;
    /* 确保撑满父容器 */
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    /* 关键：包含 padding */

    .header-actions {
        margin-bottom: 10px;
        flex-shrink: 0;
        /* 防止被压缩 */
    }

    .table-content {
        flex: 1;
        /* 占据剩余高度 */
        overflow: hidden;
        /* 触发 BFC，配合 el-table height="100%" */
    }
}
</style>