<template>
    <div class="step-wh-rent">
        <div class="header-section">
            <div class="basic-config">
                <span class="label">基础配置：</span>
                <el-form :model="basicInfo" :inline="true" class="basic-form" size="default">
                    <el-form-item label="最小体积">
                        <el-input v-model="basicInfo.minVolume" placeholder="请输入" v-number="3" style="width: 120px;">
                            <template #append>m³</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="体积单位">
                        <el-select v-model="basicInfo.volumeUnit" placeholder="请选择" style="width: 150px;">
                            <el-option label="体积单位1" :value="1" />
                            <el-option label="体积单位2" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="!isView">
                        <el-button type="primary" plain @click="handleSaveBasic">保存配置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="actions">
                <!-- :disabled="!basicInfo.id" -->
                <el-button v-if="!isView" type="primary" :icon="Plus" @click="handleAdd"
                    :disabled="!basicInfo.id">新增阶梯报价</el-button>
            </div>
        </div>

        <div class="table-content">
            <el-table :data="tableData" border stripe height="100%" v-loading="loading">
                <el-table-column label="库龄范围 (天)" min-width="150">
                    <template #default="{ row }">
                        <span class="date-range">{{ row.daysStart }}</span>
                        <span class="divider">至</span>
                        <span class="date-range">{{ row.daysEnd === -1 ? '∞' : row.daysEnd }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="unitPrice" label="单价" min-width="150">
                    <template #default="{ row }">
                        <span class="price">{{ row.unitPrice }}</span>
                        <span class="unit"> 元 / {{ getUnitName(basicInfo.volumeUnit) }} / 天</span>
                    </template>
                </el-table-column>

                <el-table-column label="旺季附加费" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div v-if="row.surchargeDTOList && row.surchargeDTOList.length" class="peak-tags">
                            <el-tag v-for="(item, idx) in row.surchargeDTOList" :key="idx" size="small" type="warning"
                                class="mr-5">
                                {{ item.months }}: {{ item.unitPrice }}元
                            </el-tag>
                        </div>
                        <span v-else class="text-gray">-</span>
                    </template>
                </el-table-column>

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

        <WhRentAgeDialog v-if="dialogVisible" v-model="dialogVisible" :project-id="projectId" :wh-rent-id="basicInfo.id"
            :edit-data="currentEditData" @success="getAgeList" :isView="isView" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import WhRentAgeDialog from './components/WhRentAgeDialog.vue'

// API
import {
    getPriceWhRentListByProjectIdApi,
    setPriceWhRentApi,
    getPriceWhRentAgeListByProjectIdApi,
    delPriceWhRentAgeByIdApi
} from "@/api/productApi/shipway"

const props = defineProps({
    projectId: { type: String, required: true },
    isView: { type: Boolean, default: false }
})

const loading = ref(false)
const dialogVisible = ref(false)
const currentEditData = ref(null)
const tableData = ref([])

const basicInfo = reactive({
    id: '',
    priceProjectId: '',
    minVolume: '',
    volumeUnit: 1
})

const getUnitName = (val) => val === 1 ? '单位1' : '单位2'

const getBasicInfo = async () => {
    if (!props.projectId) return
    try {
        const res = await getPriceWhRentListByProjectIdApi({ projectId: props.projectId })
        if (res.success && res.data) {
            Object.assign(basicInfo, res.data)
            basicInfo.priceProjectId = props.projectId
        }
    } catch (e) { console.error(e) }
}

const handleSaveBasic = async () => {
    if (!props.projectId) return
    try {
        const payload = { ...basicInfo, priceProjectId: props.projectId }
        const res = await setPriceWhRentApi(payload)
        if (res.success) {
            ElMessage.success('保存成功')
            getBasicInfo()
        } else {
            ElMessage.error(res.msg)
        }
    } catch (e) { console.error(e) }
}

const getAgeList = async () => {
    if (!props.projectId) return
    loading.value = true
    try {
        const res = await getPriceWhRentAgeListByProjectIdApi({ projectId: props.projectId })
        if (res.success) {
            tableData.value = res.data
        }
    } finally {
        loading.value = false
    }
}

const handleAdd = () => {
    currentEditData.value = null
    dialogVisible.value = true
}

const handleEdit = (row) => {
    currentEditData.value = { ...row }
    dialogVisible.value = true
}

const handleDel = (row) => {
    ElMessageBox.confirm('确认删除该库龄阶梯配置吗？', '提示', { type: 'warning' })
        .then(async () => {
            const res = await delPriceWhRentAgeByIdApi({ id: row.id })
            if (res.success) {
                ElMessage.success('删除成功')
                getAgeList()
            } else {
                ElMessage.error(res.msg)
            }
        }).catch(() => { })
}

onMounted(() => {
    getBasicInfo()
    getAgeList()
})
</script>

<style scoped lang="scss">
.step-wh-rent {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 10px 22px 10px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;

    .header-section {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ebeef5;

        .basic-config {
            display: flex;
            align-items: center;

            .label {
                font-size: 14px;
                font-weight: bold;
                color: #303133;
                margin-right: 10px;
                border-left: 3px solid #409eff;
                padding-left: 8px;
            }

            .basic-form {
                display: flex;
                align-items: center;

                .el-form-item {
                    margin-bottom: 0;
                    margin-right: 15px;
                }
            }
        }
    }

    /* 表格区域 */
    .table-content {
        flex: 1;
        overflow: hidden;

        .date-range {
            font-weight: bold;
            color: #303133;
        }

        .divider {
            margin: 0 5px;
            color: #909399;
        }

        .price {
            font-weight: bold;
            color: #f56c6c;
            font-size: 15px;
        }

        .unit {
            font-size: 12px;
            color: #909399;
        }

        .peak-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }

        .text-gray {
            color: #ccc;
        }
    }
}
</style>