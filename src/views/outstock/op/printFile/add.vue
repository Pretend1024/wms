<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="layout">
                <div class="leftPanel">
                    <div class="module orderIdentifyModule">
                        <h3>
                            <el-icon>
                                <Document />
                            </el-icon>
                            订单识别
                        </h3>
                        <div class="orderIdentifyForm">
                            <el-select v-model="queryConfig.codeType" @change="handleCodeTypeChange"
                                style="width: 113px;">
                                <el-option label="运单号" value="1" />
                                <el-option label="出库单号" value="0" />
                            </el-select>
                            <span style="padding: 12px 12px 12px 3px;">:</span>
                            <el-input v-model.trim="queryConfig.code" :autofocus="true" style="width: 280px;"
                                @keydown.enter.prevent.stop="handleScan" ref="scanInputRef" placeholder="输入号码后回车"
                                :disabled="loading">
                                <template #append>
                                    <el-button :icon="RefreshLeft" @click="resetPage" />
                                </template>
                            </el-input>
                        </div>
                    </div>

                    <div class="module printConfigModule">
                        <h3>
                            <el-icon>
                                <Printer />
                            </el-icon>
                            打印配置
                        </h3>
                        <el-form label-width="80px" class="common-form">
                            <el-form-item label="打印内容:">
                                <el-select v-model="printContentType" placeholder="请选择">
                                    <el-option label="运单&附件" value="1" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="打印机:">
                                <el-select v-model="selectedPrinter" placeholder="选择打印机">
                                    <el-option v-for="printer in printers" :key="printer" :label="printer"
                                        :value="printer" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选项:">
                                <el-checkbox v-model="autoPrint" label="识别后自动打印" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module orderInfoModule">
                        <h3>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                            当前订单信息
                        </h3>
                        <div class="basic-info-grid">
                            <div class="info-item full-width">
                                <span class="info-label">出库单号:</span>
                                <span class="info-value">{{ currentOrder.orderNo || '-' }}</span>
                            </div>
                            <div class="info-item full-width">
                                <span class="info-label">跟踪单号:</span>
                                <span class="info-value">{{ currentOrder.trackingNos || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">物流产品:</span>
                                <span class="info-value">{{ currentOrder.shipwayCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">承运商:</span>
                                <span class="info-value">{{ currentOrder.carrierCode || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="module attachmentModule">
                        <h3>
                            <el-icon>
                                <Folder />
                            </el-icon>
                            附件列表
                        </h3>
                        <el-table :data="currentAttachments" border style="width: 100%;" height="250">
                            <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip />
                            <el-table-column label="操作" width="80" align="center">
                                <template #default="scope">
                                    <el-button type="primary" link @click="previewAttachment(scope.row)">
                                        预览
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="module historyModule">
                        <h3>
                            <el-icon>
                                <List />
                            </el-icon>
                            操作记录
                        </h3>
                        <div class="table-container">
                            <el-table :data="historyList" border style="width: 100%; height: 100%;">
                                <el-table-column prop="scanNo" label="扫描单号" width="160" show-overflow-tooltip />

                                <el-table-column label="订单信息" min-width="180">
                                    <template #default="scope">
                                        <div class="cell-line">单号: <b>{{ scope.row.orderNo }}</b></div>
                                        <div class="cell-line sub-text">跟踪: {{ scope.row.trackingNos }}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="物流信息" width="180" show-overflow-tooltip>
                                    <template #default="scope">
                                        <div class="cell-line">渠道: {{ scope.row.shipwayCode }}</div>
                                        <div class="cell-line sub-text">承运: {{ scope.row.carrierCode }}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column label="附件" min-width="240" show-overflow-tooltip>
                                    <template #default="scope">
                                        <div class="attachment-tags">
                                            <el-tag v-for="(file, index) in scope.row.attachments" :key="index"
                                                class="file-tag" @click="previewAttachment(file)">
                                                {{ file.fileName }}
                                            </el-tag>
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="operateTime" label="操作时间" width="85" show-overflow-tooltip />
                                <el-table-column label="操作" width="120" fixed="right">
                                    <template #default="scope">
                                        <el-button type="primary" link @click="rePrintRow(scope.row)">打印</el-button>
                                        <el-button type="danger" link @click="deleteRow(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination-bar">
                            <el-pagination v-model:current-page="pagination.currentPage"
                                v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50, 100]"
                                layout="total, sizes, prev, pager, next" :total="pagination.total"
                                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog v-model="orderSelectDialogVisible" title="选择出库单号" width="700px" :close-on-click-modal="false"
            align-center>
            <el-table :data="orderList" border style="width: 100%" @row-click="handleOrderRowClick"
                :row-class-name="getSelectedOrderRowClass">
                <el-table-column prop="orderNo" label="出库单号" />
                <el-table-column prop="statusName" label="状态" width="150" />
                <el-table-column prop="createdTime" label="创建时间" width="200" />
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="orderSelectDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmSelectedOrder" :disabled="!selectedOrderId">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="打印">
import { Document, Printer, InfoFilled, Folder, List, RefreshLeft } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
import { getOutOrderByCodeApi, getAllUploadFilesApi } from '@/api/outstockApi/op.js';

import printJS from 'print-js';
import 'print-js/dist/print.css';

// 音频逻辑
import okAudio from '@/assets/audio/ok.wav';
import errorAudio from '@/assets/audio/error.wav';
const audioFiles = ref({ ok: new Audio(okAudio), error: new Audio(errorAudio) });
const playAudio = (key) => {
    try {
        audioFiles.value[key].currentTime = 0;
        audioFiles.value[key].play();
    } catch (e) { console.warn('Audio play failed', e); }
};

// --- 状态定义 ---
const loading = ref(false);
const scanInputRef = ref(null);
const printContentType = ref('1');

// 查询配置
const queryConfig = reactive({
    codeType: '1', // 1: 运单号, 0: 出库单号
    code: ''
});

// 当前订单信息
const currentOrder = reactive({
    orderId: '',
    orderNo: '',
    trackingNos: '',
    shipwayCode: '',
    carrierCode: ''
});
const currentAttachments = ref([]);

// 打印机配置
const selectedPrinter = ref('');
const autoPrint = ref(true);
const printers = ref([]);
let socket = null;

// 历史记录与分页
const allHistoryData = ref([]);
const pagination = reactive({ currentPage: 1, pageSize: 50, total: 0 });
const historyList = computed(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return allHistoryData.value.slice(start, end);
});

// 弹窗相关
const orderSelectDialogVisible = ref(false);
const orderList = ref([]);
const selectedOrderId = ref('');

// --- 生命周期 ---
onMounted(() => {
    initWebSocket();
    focusInput();
});

onUnmounted(() => {
    if (socket) socket.close();
});

// --- WebSocket 打印逻辑 ---
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//localhost:19090/print`;
    socket = new WebSocket(url);
    socket.onopen = () => socket.send('getPrinters');
    socket.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith('printers:')) {
            const list = message.split(':')[1].split(',');
            printers.value = list;
            if (list.length > 0 && !selectedPrinter.value) selectedPrinter.value = list[0];
        }
    };
    socket.onclose = (e) => { if (e.code !== 1000) ElMessage.error('打印机连接断开'); };
}

// --- 核心逻辑：扫描处理 ---
const handleCodeTypeChange = () => {
    if (queryConfig.code) handleScan();
};

const handleScan = async () => {
    const codeToUse = queryConfig.code.trim();
    if (!codeToUse) return;

    resetCurrentInfo();

    const loadingInstance = ElLoading.service({ lock: true, text: 'loading...' });
    loading.value = true;

    try {
        const res = await getOutOrderByCodeApi({
            code: codeToUse,
            codeType: queryConfig.codeType
        });

        if (!res.success) {
            playAudio('error');
            smartAlert(res.msg || '查询失败', false);
            return;
        }

        const dataList = res.data || [];

        if (dataList.length === 0) {
            playAudio('error');
            smartAlert('未找到匹配的订单', false);
        } else if (dataList.length === 1) {
            // 取数组第一项
            await processOrder(dataList[0]);
        } else {
            playAudio('error');
            orderList.value = dataList;
            selectedOrderId.value = '';
            orderSelectDialogVisible.value = true;
        }
    } catch (error) {
        console.error(error);
        playAudio('error');
        smartAlert('系统异常', false);
    } finally {
        loadingInstance.close();
        loading.value = false;
        if (!orderSelectDialogVisible.value) {
            focusInput();
        }
    }
};

// 处理选中的订单
const processOrder = async (orderData) => {
    // 1. 填充基本信息
    currentOrder.orderId = orderData.id;
    currentOrder.orderNo = orderData.orderNo;
    currentOrder.trackingNos = orderData.trackingNos || ''; 
    currentOrder.shipwayCode = orderData.shipwayCode || ''; 
    currentOrder.carrierCode = orderData.carrierCode || ''; 

    // 2. 获取附件
    try {
        const fileRes = await getAllUploadFilesApi({ outOrderId: currentOrder.orderId });
        if (fileRes.success) {
            currentAttachments.value = (fileRes.data.uploadFile || []).map(file => ({
                fileType: file.fileType || '未知',
                fileName: file.fileName || '未命名',
                fileUrl: file.filePath || ''
            }));
        } else {
            currentAttachments.value = [];
        }

        // 3. 记录历史
        addHistoryRecord(queryConfig.code);

        // 4. 自动打印
        if (autoPrint.value && currentAttachments.value.length > 0) {
            printFiles(currentAttachments.value);
            ElMessage.success('识别成功，开始打印');
        } else if (currentAttachments.value.length === 0) {
            ElMessage.warning('识别成功，但该订单无附件');
        } else {
            ElMessage.success('识别成功');
        }
        playAudio('ok');

        // 5. 成功后清空输入框
        queryConfig.code = '';

    } catch (e) {
        console.error('获取附件失败', e);
        smartAlert('获取附件列表失败', false);
    }
};

// 弹窗逻辑
const handleOrderRowClick = (row) => { selectedOrderId.value = row.id; };
const getSelectedOrderRowClass = ({ row }) => { return row.id === selectedOrderId.value ? 'selected-order-row' : ''; };
const confirmSelectedOrder = () => {
    if (!selectedOrderId.value) return;
    const targetOrder = orderList.value.find(o => o.id === selectedOrderId.value);
    orderSelectDialogVisible.value = false;
    if (targetOrder) {
        processOrder(targetOrder);
    }
    focusInput();
};

// 添加历史记录
const addHistoryRecord = (scanNo) => {
    const record = {
        scanNo: scanNo,
        orderNo: currentOrder.orderNo,
        trackingNos: currentOrder.trackingNos, // 保存跟踪号
        shipwayCode: currentOrder.shipwayCode, // 保存物流产品
        carrierCode: currentOrder.carrierCode, // 保存承运商
        attachments: [...currentAttachments.value],
        operateTime: formatDateTime(new Date())
    };
    allHistoryData.value.unshift(record);
    pagination.total = allHistoryData.value.length;
};

// --- 打印逻辑 ---
const printFiles = (files) => {
    if (!selectedPrinter.value) {
        ElMessage.warning('请先选择打印机');
        return;
    }
    const printableFiles = files.filter(file => isPrintableFile(file.fileName));
    if (printableFiles.length === 0) return;

    printableFiles.forEach((file, index) => {
        setTimeout(() => {
            if (file.fileUrl) {
                const message = `${file.fileUrl};${selectedPrinter.value}`;
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(message);
                }
            }
        }, index * 300);
    });
};

const rePrintRow = (row) => {
    if (!row.attachments || row.attachments.length === 0) {
        ElMessage.warning('无附件');
        return;
    }
    printFiles(row.attachments);
    ElMessage.success('已重新发送');
};

// --- 通用方法 ---
const resetPage = () => {
    queryConfig.code = '';
    resetCurrentInfo();
    focusInput();
};

const resetCurrentInfo = () => {
    currentOrder.orderId = '';
    currentOrder.orderNo = '';
    currentOrder.trackingNos = '';
    currentOrder.shipwayCode = '';
    currentOrder.carrierCode = '';
    currentAttachments.value = [];
};

const previewAttachment = (file) => {
    if (file.fileUrl) window.open(`${file.fileUrl}?t=${Date.now()}`, '_blank');
};

const isPrintableFile = (name) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return lower.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|webp)$/.test(lower);
};

const deleteRow = (index) => {
    const realIndex = (pagination.currentPage - 1) * pagination.pageSize + index;
    allHistoryData.value.splice(realIndex, 1);
    pagination.total = allHistoryData.value.length;
};

const formatDateTime = (date) => {
    const pad = n => String(n).padStart(2, '0');
    return ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const focusInput = () => {
    nextTick(() => scanInputRef.value?.$el?.querySelector('input')?.focus());
};

const handleSizeChange = (val) => { pagination.pageSize = val; };
const handleCurrentChange = (val) => { pagination.currentPage = val; };
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    width: 100%;
    height: 100%;
}

.leftPanel {
    width: 420px;
    flex: 0 0 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
}

.rightPanel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    height: 100%;
}

.module {
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    flex-shrink: 0;
}

.orderIdentifyForm {
    display: flex;
    align-items: center;
    width: 100%;
}

h3 {
    margin: 0 0 15px 0;
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

.el-form {
    width: 390px !important;
}

.common-form {
    margin-top: 8px;
    width: 100%;

    .el-form-item {
        margin-bottom: 12px;
    }

    .el-select,
    .el-input {
        width: 100%;
    }
}

/* 订单基本信息网格 */
.basic-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding-top: 5px;
}

/* 跨两列 */
.full-width {
    grid-column: span 2;
}

.info-item {
    display: flex;
    line-height: 1.6;
    font-size: 14px;
}

.info-label {
    flex: 0 0 80px;
    color: #606266;
    font-weight: 500;
}

.info-value {
    flex: 1;
    word-break: break-all;
    color: #303133;
}

.attachmentModule {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.historyModule {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.table-container {
    flex: 1;
    overflow: hidden;
}

.cell-line {
    line-height: 1.4;

    &.sub-text {
        color: #909399;
        font-size: 12px;
    }
}

.attachment-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.file-tag {
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}

.pagination-bar {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}

:deep(.selected-order-row) {
    background-color: #ffdab9 !important;
}
</style>