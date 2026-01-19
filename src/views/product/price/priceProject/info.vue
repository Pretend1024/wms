<template>
    <div class="viewArea upd-price-project-page">
        <div class="steps-wrapper">
            <el-steps :active="activeStep" finish-status="success" align-center class="custom-steps">
                <el-step title="方案基础信息" />
                <el-step title="物流报价" />
                <el-step title="操作费报价" />
                <el-step title="仓租报价" />
            </el-steps>
        </div>

        <div class="content-wrapper">
            <KeepAlive>
                <Step1Basic v-if="activeStep === 0" ref="step1Ref" v-model:projectId="projectId" @next="nextStep"
                    @updateName="handleUpdateName" isView />
            </KeepAlive>
            <KeepAlive>
                <div v-if="activeStep === 1" class="step-wrapper">
                    <div class="component-area">
                        <Step2Logistics :project-id="projectId" isView />
                    </div>
                    <div class="fixed-footer">
                        <div class="footer-content">
                            <div class="left-info">
                                <span class="id-tag">
                                    <el-icon>
                                        <Link />
                                    </el-icon> 当前名称: {{ projectName }}
                                </span>
                            </div>
                            <div class="right-btns">
                                <el-button @click="prevStep">上一步</el-button>
                                <el-button type="primary" @click="nextStep">下一步</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </KeepAlive>
            <KeepAlive>
                <div v-if="activeStep === 2" class="step-wrapper">
                    <div class="component-area">
                        <Step3OperationFee :project-id="projectId" isView />
                    </div>
                    <div class="fixed-footer">
                        <div class="footer-content">
                            <div class="left-info">
                                <span class="id-tag"><el-icon>
                                        <Link />
                                    </el-icon> 当前名称: {{ projectName }}
                                </span>
                            </div>
                            <div class="right-btns">
                                <el-button @click="prevStep">上一步</el-button>
                                <el-button type="primary" @click="nextStep">下一步</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </KeepAlive>
            <KeepAlive>
                <div v-if="activeStep === 3" class="step-wrapper">
                    <div class="component-area">
                        <Step4WhRent :project-id="projectId" isView />
                    </div>
                    <div class="fixed-footer">
                        <div class="footer-content">
                            <div class="left-info">
                                <span class="id-tag"><el-icon>
                                        <Link />
                                    </el-icon> 当前名称: {{ projectName }}</span>
                            </div>
                            <div class="right-btns">
                                <el-button @click="prevStep">上一步</el-button>
                                <el-button type="success" @click="handleFinish">完成配置</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </KeepAlive>
        </div>
    </div>
</template>

<script setup name="报价方案详情">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import Step1Basic from './Step1Basic.vue'
import Step2Logistics from './Step2Logistics.vue'
import Step3OperationFee from './Step3OperationFee.vue'
import Step4WhRent from './Step4WhRent.vue'
import { getPriceProjectInfoByIdApi } from '@/api/productApi/shipway'
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()

const props = defineProps({
    id: {
        type: String,
        required: true,
        default: ''
    },
})
const route = useRoute()
const activeStep = ref(0)
const projectId = ref('')
const projectName = ref('')
const step1Ref = ref(null)

const handleUpdateName = (name) => {
    projectName.value = name
}

// 初始化数据
const initData = async () => {
    openMainLoading()
    const id = props.id
    try {
        const res = await getPriceProjectInfoByIdApi({ id })
        if (res.success && res.data) {
            const data = res.data
            projectId.value = data.id
            projectName.value = data.name

            // 回显Step1数据
            await nextTick()
            if (step1Ref.value) {
                step1Ref.value.formData.orgId = data.orgId
                step1Ref.value.formData.warehouseCode = data.warehouseCode
                step1Ref.value.formData.name = data.name
                step1Ref.value.formData.startDate = data.startDate
                step1Ref.value.formData.endDate = data.endDate
                step1Ref.value.formData.remark = data.remark
                step1Ref.value.formData.customerCodeList = data.customerCodeList || []
                await nextTick()
                step1Ref.value.hasDataChanged = false
                closeMainLoading()
            }
        } else {
            ElMessage.error(res.msg || '获取详情失败')
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('系统异常，请稍后重试')
    }
}

// 下一步
const nextStep = () => {
    if (activeStep.value < 3) {
        activeStep.value++
    }
}

// 上一步
const prevStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--
    }
}

// 完成
const handleFinish = () => {
    ElMessage.success('方案配置完成')
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ name: '报价方案' })
}

onMounted(() => {
    initData()
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.upd-price-project-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f5f7fa;
}

.steps-wrapper {
    background: #fff;
    padding: 25px 50px 10px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    :deep(.el-step__title) {
        font-size: 15px;
        font-weight: 500;
        margin-top: 5px;
    }

    :deep(.el-step__head) {
        .el-step__line {
            background-color: #e4e7ed;
            top: 11px;
        }

        .el-step__icon {
            width: 24px;
            height: 24px;
            border-width: 2px;
        }
    }

    :deep(.el-step__head.is-process) {
        .el-step__icon {
            background-color: #409eff;
            border-color: #409eff;
            color: #fff;
            box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
        }
    }
}

.content-wrapper {
    flex: 1;
    overflow: hidden;
    position: relative;
    padding: 0 10px;
}

/* 步骤2/3/4 的通用全屏容器样式 */
.step-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    // 组件区域：自动撑开，预留底部按钮高度
    .component-area {
        flex: 1;
        overflow: hidden;
        padding-bottom: 64px;
    }
}

/* 统一的底部按钮样式 */
.fixed-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background: #fff;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 8px 8px;

    .footer-content {
        width: 100%;
        max-width: 1100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .left-info {
            .id-tag {
                background: #f0f9eb;
                color: #67c23a;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                border: 1px solid #e1f3d8;
            }
        }

        .right-btns {
            display: flex;
            gap: 15px;
        }
    }
}
</style>