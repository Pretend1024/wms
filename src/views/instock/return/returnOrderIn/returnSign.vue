<template>
    <div class="sign-container">
        <div class="left-panel">
            <el-card class="box-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">退货签收</span>
                    </div>
                </template>

                <el-form :model="formData" label-position="top" @submit.prevent>
                    <el-form-item label="放入认领池">
                        <div class="switch-wrapper">
                            <el-switch v-model="formData.autoPutClaimPool" inline-prompt active-text="开启"
                                inactive-text="关闭" style="--el-switch-on-color: #13ce66;" />
                            <span class="switch-tip">{{ formData.autoPutClaimPool ? '自动归入待认领' : '需手动处理' }}</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="签收仓库">
                        <el-select v-model="formData.warehouseId" placeholder="请选择仓库" filterable style="width: 100%">
                            <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="跟踪单号" class="tracking-item">
                        <el-input ref="trackingInputRef" v-model.trim="formData.trackingNo" placeholder="扫码或输入单号"
                            clearable size="large" class="tracking-input" @keyup.enter="handleSign">
                            <template #prefix>
                                <el-icon>
                                    <Scissor />
                                </el-icon> </template>
                        </el-input>
                    </el-form-item>

                    <div class="operation-tip">
                        <el-alert title="输入单号后按回车键直接提交" type="info" show-icon :closable="false" />
                    </div>
                </el-form>
            </el-card>
        </div>

        <div class="right-panel">
            <el-card class="box-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">操作记录 <span class="sub-title">(本次会话)</span></span>
                        <el-button link type="primary" size="small" @click="operationLogs = []">清空记录</el-button>
                    </div>
                </template>

                <el-table :data="operationLogs" border stripe height="100%" style="width: 100%"
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
                    <el-table-column type="index" label="序号" width="60" align="center" />
                    <el-table-column prop="trackingNo" label="跟踪单号" min-width="180">
                        <template #default="{ row }">
                            <span style="font-weight: bold; color: #303133;">{{ row.trackingNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouseName" label="仓库" width="140" show-overflow-tooltip />
                    <el-table-column prop="status" label="状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.status ? 'success' : 'danger'" effect="light" round>
                                {{ row.status ? '成功' : '失败' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="msg" label="返回信息" min-width="200" show-overflow-tooltip>
                        <template #default="{ row }">
                            <span :class="row.status ? 'msg-success' : 'msg-error'">{{ row.msg }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="操作时间" width="170" align="center" />
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script setup name="退货签收">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Scissor } from '@element-plus/icons-vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { returnSignApi } from '@/api/instockApi/return.js'
import { smartAlert } from '@/utils/genericMethods.js'


// 表单数据
const formData = reactive({
    warehouseId: '',
    trackingNo: '',
    autoPutClaimPool: true
})

// 下拉选项与状态
const warehouseOptions = ref([])
const trackingInputRef = ref(null)
const operationLogs = ref([]) // 操作记录列表

/**
 * 初始化加载
 */
onMounted(async () => {
    await getWarehouseList()
    focusInput()
})

/**
 * 获取仓库列表
 */
const getWarehouseList = async () => {
    try {
        const res = await getWhWarehouseApi()
        if (res.success) {
            warehouseOptions.value = res.data.map(item => ({
                label: `${item.code}(${item.name})`,
                value: item.id
            }))

            if (warehouseOptions.value.length === 1) {
                formData.warehouseId = warehouseOptions.value[0].value
            }
        }
    } catch (error) {
        console.error('获取仓库列表失败', error)
    }
}

/**
 * 提交签收
 */
const handleSign = async () => {
    if (!formData.warehouseId) {
        smartAlert('请先选择签收仓库', false)
        return
    }
    if (!formData.trackingNo) {
        smartAlert('请输入跟踪单号', false)
        return
    }

    const submitData = {
        trackingNo: formData.trackingNo,
        warehouseId: formData.warehouseId,
        autoPutClaimPool: formData.autoPutClaimPool
    }

    // 获取仓库名用于显示
    const currentWh = warehouseOptions.value.find(item => item.value === formData.warehouseId)
    const whName = currentWh ? currentWh.label : formData.warehouseId

    try {
        const res = await returnSignApi(submitData)

        // 记录日志
        operationLogs.value.unshift({
            trackingNo: submitData.trackingNo,
            warehouseName: whName,
            status: res.success,
            msg: res.msg,
            time: new Date().toLocaleString()
        })

        if (res.success) {
            ElMessage.success(res.msg)
            formData.trackingNo = '' // 清空输入
        } else {
            smartAlert(res.msg, false)
            // 失败时全选文本方便修改
            if (trackingInputRef.value) trackingInputRef.value.select()
        }

    } catch (error) {
        operationLogs.value.unshift({
            trackingNo: submitData.trackingNo,
            warehouseName: whName,
            status: false,
            msg: '网络请求异常',
            time: new Date().toLocaleString()
        })
    } finally {
        nextTick(() => {
            if (!formData.trackingNo) focusInput()
        })
    }
}

const focusInput = () => {
    if (trackingInputRef.value) {
        trackingInputRef.value.focus()
    }
}
</script>

<style scoped lang="scss">
.sign-container {
    display: flex;
    height: calc(100vh - 120px);
    padding: 16px;
    background-color: #f0f2f5;
    gap: 16px;
}

/* 左侧面板样式 */
.left-panel {
    flex: 0 0 380px;
    display: flex;
    flex-direction: column;
}

/* 右侧面板样式 */
.right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.box-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: none;

    :deep(.el-card__body) {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background-color: #409eff;
            margin-right: 8px;
            border-radius: 2px;
        }
    }

    .sub-title {
        font-size: 12px;
        color: #909399;
        font-weight: normal;
        margin-left: 5px;
    }
}

.switch-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.switch-tip {
    font-size: 12px;
    color: #909399;
}

/* 跟踪单号输入框样式增强 */
.tracking-input {
    :deep(.el-input__inner) {
        font-weight: bold;
        font-size: 16px;
        color: #303133;
    }
}

.operation-tip {
    margin-top: 20px;
}

.msg-error {
    color: #f56c6c;
}

:deep(.el-form-item--default) {
    margin-bottom: 22px;
}
</style>