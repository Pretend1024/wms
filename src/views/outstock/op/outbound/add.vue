<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="layout">
                <div class="leftPanel">

                    <div class="module operationModule">
                        <h3>
                            <el-icon>
                                <Box />
                            </el-icon>{{ $t('outstock_op_outbound_add.outboundOperation') }} <!-- 出库操作 -->
                        </h3>
                        <el-form :model="formData" label-position="top" class="operation-form">

                            <el-form-item>
                                <template #label>
                                    <div class="custom-label">
                                        <span>{{ $t('outstock_op_outbound_add.supplier') }}</span> <!-- 服务商 -->
                                        <el-checkbox v-model="formData.verifySupplier" size="small">{{
                                            $t('outstock_op_outbound_add.verifySupplier') }}</el-checkbox>
                                        <!-- 校验服务商 -->
                                    </div>
                                </template>
                                <el-select v-model="formData.supplierId"
                                    :placeholder="$t('outstock_op_outbound_add.supplier')" filterable clearable
                                    @change="handleSupplierChange"> <!-- placeholder：服务商 -->
                                    <el-option v-for="item in supplierOptions" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <template #label>
                                    <div class="custom-label">
                                        <span>{{ $t('outstock_op_outbound_add.supplierChannel') }}</span> <!-- 服务商渠道 -->
                                        <el-checkbox v-model="formData.verifyChannel" size="small">{{
                                            $t('outstock_op_outbound_add.verifyChannel') }}</el-checkbox> <!-- 校验渠道 -->
                                    </div>
                                </template>
                                <el-select v-model="formData.channelId"
                                    :placeholder="$t('outstock_op_outbound_add.supplierChannel')" filterable clearable
                                    :disabled="!formData.supplierId"> <!-- placeholder：服务商渠道 -->
                                    <el-option v-for="item in channelOptions" :key="item.id"
                                        :label="item.code + '(' + item.name + ')'" :value="item.id" />
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="$t('outstock_op_outbound_add.trackingNo')"> <!-- label：跟踪单号 -->
                                <el-input ref="trackingInputRef" v-model.trim="formData.trackingNo"
                                    :placeholder="$t('outstock_op_outbound_add.scanOrInputTrackingNo')" clearable
                                    @keydown.enter.prevent="handleScan"> <!-- placeholder：扫描或输入跟踪单号后回车 -->
                                    <template #prefix>
                                        <el-icon>
                                            <Aim />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module statsModule">
                        <h3>
                            <el-icon>
                                <DataAnalysis />
                            </el-icon>{{ $t('outstock_op_outbound_add.todayOutboundStats') }} <!-- 今日出库统计 -->
                        </h3>
                        <div class="stats-grid">
                            <div class="stats-card pending">
                                <div class="stats-label">{{ $t('outstock_op_outbound_add.pendingOutbound') }}</div>
                                <!-- 待出库数 -->
                                <div class="stats-value">{{ statistics.pending }}</div>
                            </div>
                            <div class="stats-card success">
                                <div class="stats-label">{{ $t('outstock_op_outbound_add.todayOutbound') }}</div>
                                <!-- 今日出库数 -->
                                <div class="stats-value">{{ statistics.today }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="module logModule">
                        <h3>
                            <el-icon>
                                <List />
                            </el-icon>{{ $t('outstock_op_outbound_add.operationRecords') }} <!-- 操作记录 -->
                            <el-button link type="primary" size="small" @click="clearLogs" style="margin-left: auto;">{{
                                $t('outstock_op_outbound_add.clear')
                                }}</el-button> <!-- 清空 -->
                        </h3>
                        <el-table :data="logList" border stripe height="100%" style="width: 100%">
                            <el-table-column prop="trackingNo" :label="$t('outstock_op_outbound_add.trackingNo')"
                                min-width="200" show-overflow-tooltip /> <!-- label：跟踪单号 -->
                            <el-table-column prop="supplierName" :label="$t('outstock_op_outbound_add.supplier')"
                                min-width="210" show-overflow-tooltip /> <!-- label：服务商 -->
                            <el-table-column prop="channelName" :label="$t('outstock_op_outbound_add.supplierChannel')"
                                min-width="210" show-overflow-tooltip /> <!-- label：服务商渠道 -->
                            <el-table-column prop="result" :label="$t('outstock_op_outbound_add.operationResult')"
                                min-width="220">
                                <!-- label：操作结果 -->
                                <template #default="{ row }">
                                    <el-tag :type="row.success ? 'success' : 'danger'" effect="dark" size="small">
                                        {{ row.success ? $t('outstock_op_outbound_add.success') :
                                            $t('outstock_op_outbound_add.failure') }} <!-- success：成功；failure：失败 -->
                                    </el-tag>
                                    <span v-if="!row.success" class="error-msg">{{ row.msg }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="time" :label="$t('outstock_op_outbound_add.operationTime')"
                                width="160" />
                            <!-- label：操作时间 -->
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog v-model="orderSelectDialogVisible" :title="$t('outstock_op_outbound_add.selectOutboundOrderNo')"
            width="700px" :close-on-click-modal="false" align-center> <!-- title：选择出库单号 -->
            <el-table :data="orderList" border style="width: 100%" @row-click="handleOrderRowClick"
                :row-class-name="getSelectedOrderRowClass">
                <el-table-column prop="orderNo" :label="$t('outstock_op_outbound_add.outboundOrderNo')" />
                <!-- label：出库单号 -->
                <el-table-column prop="statusName" :label="$t('outstock_op_outbound_add.status')" width="150" />
                <!-- label：状态 -->
                <el-table-column prop="createdTime" :label="$t('outstock_op_outbound_add.createTime')" width="200" />
                <!-- label：创建时间 -->
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="orderSelectDialogVisible = false">{{ $t('outstock_op_outbound_add.cancel')
                    }}</el-button> <!-- 取消 -->
                    <el-button type="primary" @click="confirmSelectedOrder" :disabled="!selectedOrderId">{{
                        $t('outstock_op_outbound_add.confirm') }}</el-button> <!-- 确定 -->
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="出库">
import { ref, reactive, nextTick, onMounted } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { Box, Aim, DataAnalysis, List } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { smartAlert } from '@/utils/genericMethods.js';

// 音频资源
import okAudio from '@/assets/audio/ok.wav';
import errorAudio from '@/assets/audio/error.wav';

// 接口
import { getProductSupplierListApi, getProductSupplierChannelListApi } from '@/api/productApi/shipway.js';
import { submitOutboundStockApi, getOutboundOrderDataApi, getOutOrderByCodeApi } from '@/api/outstockApi/op.js';

// --- 状态定义 ---

const trackingInputRef = ref(null);

// 表单数据
const formData = reactive({
    supplierId: '',
    verifySupplier: false,
    channelId: '',
    verifyChannel: false,
    trackingNo: ''
});

// 下拉选项
const supplierOptions = ref([]);
const channelOptions = ref([]);

// 统计数据
const statistics = reactive({
    pending: 0,
    today: 0
});

// 操作日志
const logList = ref([]);

// 订单选择弹窗相关
const orderSelectDialogVisible = ref(false);
const orderList = ref([]);
const selectedOrderId = ref('');

// 音频对象
const audioMap = {
    ok: new Audio(okAudio),
    error: new Audio(errorAudio)
};

// --- 方法定义 ---

// 播放音效
const playSound = (type) => {
    const audio = audioMap[type];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('音频播放失败', e));
    }
};

// 1. 获取下拉数据
const initOptions = async () => {
    try {
        const resSup = await getProductSupplierListApi();
        if (resSup.success) supplierOptions.value = resSup.data || [];
    } catch (error) {
        console.error('初始化选项失败', error);
    }
};

const handleSupplierChange = () => {
    //清空渠道选项
    formData.channelId = '';
    channelOptions.value = [];
    //重新获取渠道选项
    if (formData.supplierId) {
        getProductSupplierChannelListApi({ supplierId: formData.supplierId }).then(res => {
            if (res.success) channelOptions.value = res.data || [];
        })
    }

};

// 2. 获取统计数据
const getStatistics = async () => {
    try {
        const res = await getOutboundOrderDataApi();
        if (res.success && res.data) {
            statistics.pending = res.data.waitOutBoundOrderQty || 0;
            statistics.today = res.data.todayOutBoundOrderQty || 0;
        }
    } catch (e) {
        console.warn('获取统计失败', e);
    }
};

// 3. 扫描处理
const handleScan = async () => {
    const trackingNo = formData.trackingNo.trim();
    if (!trackingNo) return;

    // 必填校验
    if (!formData.supplierId) {
        ElMessage.warning('请选择服务商');
        playSound('error');
        nextTick(() => trackingInputRef.value?.focus());
        return;
    }
    if (!formData.channelId) {
        ElMessage.warning('请选择服务商渠道');
        playSound('error');
        nextTick(() => trackingInputRef.value?.focus());
        return;
    }

    const loading = ElLoading.service({ lock: true, text: '查询订单中...' });
    try {
        const res = await getOutOrderByCodeApi({ code: trackingNo, codeType: '1' });
        if (res.success) {
            const list = res.data || [];
            if (list.length === 1) {
                await executeSubmit(list[0].id, trackingNo);
            } else if (list.length > 1) {
                orderList.value = list;
                selectedOrderId.value = '';
                orderSelectDialogVisible.value = true;
                playSound('error');
            } else {
                handleFailure(trackingNo, '未找到该跟踪号对应的订单');
            }
        } else {
            handleFailure(trackingNo, res.msg || '查询失败');
        }
    } catch (e) {
        console.error(e);
        handleFailure(trackingNo, '系统异常');
    } finally {
        loading.close();
    }
};

// 辅助：统一处理失败
const handleFailure = (trackingNo, msg) => {
    playSound('error');
    smartAlert(msg, false);
    addLog(trackingNo, false, msg);
    resetInput();
};

// 4. 选择订单逻辑
const handleOrderRowClick = (row) => selectedOrderId.value = row.id;
const getSelectedOrderRowClass = ({ row }) => row.id === selectedOrderId.value ? 'selected-order-row' : '';
const confirmSelectedOrder = async () => {
    if (selectedOrderId.value) {
        orderSelectDialogVisible.value = false;
        await executeSubmit(selectedOrderId.value, formData.trackingNo);
    }
};

// 5. 执行提交
const executeSubmit = async (outOrderId, trackingNo) => {
    const loading = ElLoading.service({ lock: true, text: '正在出库...' });
    try {
        const params = {
            outOrderId: outOrderId,
            supplierId: formData.supplierId,
            supplierChannelId: formData.channelId,
            isCheckSupplier: formData.verifySupplier,
            isCheckSupplierChannel: formData.verifyChannel,
            trackingNo: trackingNo
        };

        const res = await submitOutboundStockApi(params);
        if (res.success) {
            playSound('ok');
            ElMessage.success('出库成功');
            addLog(trackingNo, true);
            getStatistics(); // 刷新待出库和今日出库
        } else {
            handleFailure(trackingNo, res.msg || '出库失败');
        }
    } catch (e) {
        handleFailure(trackingNo, '提交异常');
    } finally {
        loading.close();
        resetInput();
    }
};

// 辅助：添加日志
const addLog = (trackingNo, isSuccess, msg = '') => {
    const currentSupplier = supplierOptions.value.find(i => i.id === formData.supplierId);
    const currentChannel = channelOptions.value.find(i => i.id === formData.channelId);

    const logItem = {
        trackingNo,
        supplierName: currentSupplier ? currentSupplier.name : '-',
        channelName: currentChannel ? currentChannel.name : '-',
        time: dayjs().format('MM-DD HH:mm:ss'),
        success: isSuccess,
        msg: msg
    };
    logList.value.unshift(logItem);
};

const resetInput = () => {
    formData.trackingNo = '';
    nextTick(() => {
        trackingInputRef.value?.focus();
    });
};

const clearLogs = () => {
    logList.value = [];
};

onMounted(() => {
    initOptions();
    getStatistics();
    resetInput();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.layout {
    display: flex;
    gap: 16px;
    height: 100%;
    width: 100%;
    align-items: flex-start;
}

.el-form {
    width: 370px !important;
}

.leftPanel {
    width: 400px;
    flex: 0 0 400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
}

.rightPanel {
    flex: 1;
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.module {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    &.logModule {
        flex: 1;
        overflow: hidden;
    }
}

h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .el-icon {
        margin-right: 8px;
        color: #409eff;
    }
}

.custom-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    span {
        font-weight: 500;
        color: #606266;
    }
}

.operation-form {

    .el-select,
    .el-input {
        width: 100%;
    }
}

/* 统计卡片样式 */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.stats-card {
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    .stats-label {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 5px;
    }

    .stats-value {
        font-size: 24px;
        font-weight: bold;
    }

    &.pending {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    }

    &.success {
        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        color: #1f2329;
    }
}

/* 错误消息 */
.error-msg {
    color: #f56c6c;
    font-size: 12px;
    margin-left: 8px;
}

/* 表格选中行样式 */
:deep(.selected-order-row) {
    background-color: #ecf5ff !important;
    cursor: pointer;
}

/* 表格相关 */
:deep(.el-table__inner-wrapper) {
    height: 100% !important;
}

@media (max-width: 1200px) {
    .leftPanel {
        width: 320px;
        flex: 0 0 320px;
    }

    .el-form {
        width: 280px !important;
    }
}
</style>