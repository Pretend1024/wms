<template>
    <div class="step-logistics">
        <div class="header-actions" v-if="!isView">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增物流报价</el-button>
        </div>

        <div class="table-content">
            <el-table :data="tableData" border stripe height="100%" v-loading="loading">
                <el-table-column prop="shipwayCode" label="物流产品" width="150" fixed="left" />
                <el-table-column prop="regionProjectName" label="分区方案" width="150" show-overflow-tooltip />
                <el-table-column prop="remoteName" label="偏远库" width="120" />
                <el-table-column prop="fuelName" label="燃油费模板" width="150" />
                <el-table-column prop="currency" label="币种" width="80" />
                <el-table-column prop="unitTypeName" label="单位类型" width="100" />
                <el-table-column prop="billingWeightCountTypeName" label="计费粒度" width="100" />
                <el-table-column prop="volumeWeightMode" label="体积重系数" width="100" />
                <el-table-column prop="billingWeightRuleName" label="计费重规则" width="250" />
                <el-table-column prop="weightRoundRuleName" label="计费重取整" width="250" />
                <el-table-column prop="bulkWeightRuleName" label="分泡规则" width="100" />
                <el-table-column label="免泡方式" width="180">
                    <template #default="{ row }">
                        {{ row.bulkWeightFreeTypeName }}
                        <span v-if="row.bulkWeightFreeValue">({{ row.bulkWeightFreeValue }})</span>
                    </template>
                </el-table-column>
                <el-table-column prop="minBillingWeight" label="最小计费重" width="100" />
                <el-table-column prop="createdBy" label="创建人" width="100" />
                <el-table-column prop="createdTime" label="创建时间" width="200" />
                <el-table-column prop="updatedBy" label="更新人" width="100" />
                <el-table-column prop="updatedTime" label="更新时间" width="200" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <LogisticsDialog v-if="dialogVisible" v-model="dialogVisible" :project-id="projectId"
            :edit-data="currentEditData" :exclude-shipway-ids="existingShipwayIds" @success="getList"
            :isView="isView" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LogisticsDialog from './components/LogisticsDialog.vue'

// API
import {
    getPriceShipwayListByProjectIdApi,
    delPriceShipwayByIdApi
} from "@/api/productApi/shipway"

const props = defineProps({
    projectId: { type: String, required: true },
    isView: { type: Boolean, default: false }
})

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const currentEditData = ref(null)

// 计算已存在的 shipwayId 列表，传给弹窗做禁用判断
const existingShipwayIds = computed(() => {
    return tableData.value.map(item => item.shipwayId)
})

// 获取列表
const getList = async () => {
    if (!props.projectId) return
    loading.value = true
    try {
        const res = await getPriceShipwayListByProjectIdApi({ projectId: props.projectId })
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
    ElMessageBox.confirm('确认删除该物流报价吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        try {
            const res = await delPriceShipwayByIdApi({ id: row.id })
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

onMounted(() => {
    getList()
})
</script>

<style scoped lang="scss">
.step-logistics {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;

    .header-actions {
        margin-bottom: 10px;
    }

    .table-content {
        flex: 0.98;
        overflow: hidden;
    }
}
</style>