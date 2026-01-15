<template>
    <div class="viewArea add-price-project-page">
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
                <Step1Basic v-if="activeStep === 0" v-model:projectId="projectId" @next="nextStep"
                    @updateName="handleUpdateName" />
            </KeepAlive>
            <KeepAlive>
                <div v-if="activeStep === 1" class="step-wrapper">
                    <div class="component-area">
                        <Step2Logistics :project-id="projectId" />
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
                        <Step3OperationFee :project-id="projectId" />
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
                        <Step4WhRent :project-id="projectId" />
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
                                <el-button type="success" @click="handleFinish">完成创建</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </KeepAlive>
        </div>
    </div>
</template>

<script setup name="新增报价方案">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import Step1Basic from './Step1Basic.vue'
import Step2Logistics from './Step2Logistics.vue'
import Step3OperationFee from './Step3OperationFee.vue'
import Step4WhRent from './Step4WhRent.vue'

const router = useRouter()
const activeStep = ref(0)
const projectId = ref('')

const projectName = ref('')

const handleUpdateName = (name) => {
    projectName.value = name
}

// 下一步
const nextStep = () => {
    // if (activeStep.value === 0 && !projectId.value) {
    //     ElMessage.warning('请先提交基础信息以生成方案ID')
    //     return
    // }
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
    ElMessage.success('方案添加完成')
    router.push({ name: '报价方案列表' })
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.add-price-project-page {
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

/* 占位容器样式 (居中显示) */
.placeholder-container {
    height: 100%;
    background: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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