<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="layout">
                <div class="leftPanel">
                    <div class="module orderIdentifyModule">
                        <h3>
                            <el-icon>
                                <Search />
                            </el-icon>
                            订单识别
                        </h3>
                        <div class="orderIdentifyForm">
                            <el-select v-model="queryConfig.codeType" style="width: 113px;">
                                <el-option label="运单号" value="1" />
                                <el-option label="出库单号" value="0" />
                            </el-select>
                            <span style="padding: 12px 12px 12px 3px;">:</span>
                            <el-input v-model.trim="queryConfig.code" :autofocus="true" style="width: 280px;"
                                @keydown.enter.prevent.stop="handleScanOrder" ref="orderInputRef" placeholder="输入号码后回车"
                                :disabled="loading || isOrderLocked">
                                <template #append>
                                    <el-button :icon="RefreshLeft" @click="resetPage" />
                                </template>
                            </el-input>
                        </div>
                    </div>

                    <div class="module operateModule" v-if="currentOrder.orderId">
                        <h3>
                            <el-icon>
                                <Box />
                            </el-icon>
                            归位操作
                        </h3>
                        <el-form label-width="80px" class="common-form" @submit.prevent>
                            <el-form-item label="商品条码:">
                                <el-input v-model.trim="operateForm.barcode" ref="barcodeInputRef"
                                    placeholder="扫描SKU或条码" @keydown.enter.prevent.stop="handleScanBarcode"
                                    :disabled="loading">
                                </el-input>
                            </el-form-item>

                            <div class="current-sku-info" v-if="currentOpItem">
                                <div class="info-row"><b>SKU:</b> {{ currentOpItem.sku }}</div>
                                <div class="info-row"><b>品名:</b> {{ currentOpItem.skuNameCn }}</div>
                                <div class="info-row"><b>原库位:</b> {{ currentOpItem.locationCode }}</div>
                                <div class="info-row"><b>待归位:</b> <span class="highlight">{{
                                    getPendingQty(currentOpItem) }}</span></div>
                            </div>

                            <el-form-item label="上架库位:">
                                <el-input v-model.trim="operateForm.locationCode" ref="locationInputRef"
                                    placeholder="扫描库位" @keydown.enter.prevent.stop="handleScanLocation"
                                    :disabled="!currentOpItem || loading">
                                </el-input>
                            </el-form-item>

                            <el-form-item label="上架数量:">
                                <el-input v-model="operateForm.quantity" v-intNumber ref="qtyInputRef"
                                    style="width: 100%;" @keydown.enter.prevent.stop="handleSubmitShelf"
                                    :disabled="!operateForm.locationCode || loading" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="module orderInfoModule">
                        <h3>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                            订单信息
                        </h3>
                        <div class="basic-info-grid">
                            <div class="info-item">
                                <span class="info-label">出库单号:</span>
                                <span class="info-value">{{ currentOrder.orderNo || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">状态:</span>
                                <span class="info-value">{{ currentOrder.statusName || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">仓库:</span>
                                <span class="info-value">{{ currentOrder.warehouseCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">客户:</span>
                                <span class="info-value">{{ currentOrder.customerCode ? currentOrder.customerCode + "("
                                    +
                                    currentOrder.customerName + ")"
                                    || '-'
                                    : "-" }}</span>
                            </div>
                            <div class="info-item full-width">
                                <span class="info-label">跟踪单号:</span>
                                <span class="info-value">{{ currentOrder.trackingNos || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="module listModule">
                        <h3>
                            <el-icon>
                                <List />
                            </el-icon>
                            归位明细
                        </h3>
                        <el-table :data="inventoryList" border style="width: 100%; height: 100%;" stripe
                            :row-class-name="tableRowClassName">
                            <el-table-column prop="sku" label="SKU" width="220" show-overflow-tooltip />
                            <el-table-column prop="barcode" label="条码" width="220" show-overflow-tooltip />
                            <el-table-column prop="locationCode" label="原库位" width="220" show-overflow-tooltip />
                            <el-table-column label="数量统计" align="center">
                                <el-table-column prop="outQuantity" label="已下架" width="90" />
                                <el-table-column prop="onQuantity" label="已归位" width="90">
                                    <template #default="scope">
                                        <span style="color: green; font-weight: bold;">{{ scope.row.onQuantity || 0
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="待归位" width="90">
                                    <template #default="scope">
                                        <span style="color: red;">{{ getPendingQty(scope.row) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
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

<script setup name="归位上架">
import { Search, InfoFilled, List, RefreshLeft, Box } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
// 引入API，包含新增的接口
import { getOutOrderByCodeApi, getOutOrderWithInventoryApi, submitReturnOnShelfApi } from '@/api/outstockApi/op.js';

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
const isOrderLocked = ref(false); // 是否锁定当前订单进行操作

// Refs for focus
const orderInputRef = ref(null);
const barcodeInputRef = ref(null);
const locationInputRef = ref(null);
const qtyInputRef = ref(null);

// 查询配置
const queryConfig = reactive({
    codeType: '1',
    code: ''
});

// 订单与列表数据
const currentOrder = reactive({});
const inventoryList = ref([]);
const currentOpItem = ref(null); // 当前正在操作的行对象

// 操作表单
const operateForm = reactive({
    barcode: '',
    locationCode: '',
    quantity: undefined
});

// 弹窗相关
const orderSelectDialogVisible = ref(false);
const orderList = ref([]);
const selectedOrderId = ref('');

// --- 生命周期 ---
onMounted(() => {
    focusInput('order');
});

// --- 核心逻辑 1: 扫描订单 ---
const handleScanOrder = async () => {
    const codeToUse = queryConfig.code.trim();
    if (!codeToUse) return;

    resetCurrentInfo();
    const loadingInstance = ElLoading.service({ lock: true, text: '正在查询订单...' });
    loading.value = true;

    try {
        const res = await getOutOrderByCodeApi({
            code: codeToUse,
            codeType: queryConfig.codeType
        });

        if (!res.success) {
            playAudio('error');
            smartAlert(res.msg || '查询失败', false);
            // 失败清空并聚焦
            queryConfig.code = '';
            focusInput('order');
            return;
        }

        const dataList = res.data || [];
        if (dataList.length === 0) {
            playAudio('error');
            smartAlert('未找到匹配的订单', false);
            queryConfig.code = '';
            focusInput('order');
        } else if (dataList.length === 1) {
            await fetchOrderInventory(dataList[0].id);
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
        queryConfig.code = '';
        focusInput('order');
    } finally {
        loadingInstance.close();
        loading.value = false;
    }
};

// --- 核心逻辑 2: 获取订单详情及下架记录 ---
const fetchOrderInventory = async (orderId) => {
    try {
        const res = await getOutOrderWithInventoryApi({
            outOrderId: orderId,
            opType: "4" // 需求固定参数
        });

        if (res.success && res.data) {
            // 填充头部信息
            Object.assign(currentOrder, res.data);

            // 填充列表
            inventoryList.value = (res.data.inventoryList || []).map(item => ({
                ...item,
                onQuantity: item.onQuantity || 0 // 确保有默认值
            }));

            isOrderLocked.value = true;
            playAudio('ok');
            ElMessage.success('订单识别成功，请扫描商品条码');

            // 成功后聚焦下一个输入框 (条码)
            focusInput('barcode');
        } else {
            playAudio('error');
            smartAlert(res.msg || '获取订单明细失败', false);
            queryConfig.code = '';
            focusInput('order');
        }
    } catch (e) {
        console.error(e);
        playAudio('error');
        smartAlert('获取详情接口异常', false);
        queryConfig.code = '';
        focusInput('order');
    }
};

// --- 核心逻辑 3: 扫描商品条码 ---
const handleScanBarcode = () => {
    const rawInput = operateForm.barcode.trim();
    if (!rawInput) return;

    // 辅助函数：忽略大小写匹配
    const isMatch = (dbValue) => {
        if (!dbValue) return false;
        return dbValue.localeCompare(rawInput, undefined, { sensitivity: 'base' }) === 0;
    };

    // 【核心修改点】
    // 必须匹配条码、待归位数量 > 0
    const validTarget = inventoryList.value.find(item => {
        const matchFound = isMatch(item.sku) || isMatch(item.barcode);
        const hasPending = getPendingQty(item) > 0;
        return matchFound && hasPending;
    });

    if (validTarget) {
        // 找到了符合条件的有效行 ===
        currentOpItem.value = validTarget;
        playAudio('ok');
        // 成功后聚焦下一个输入框 (库位)
        focusInput('location');
    } else {
        // === 情况2：没找到有效行，现在判断原因给提示 ===

        // 尝试找一下有没有“已完成”的同码商品，用于区分提示语
        // 这里不需要判断 > 0，只要码对就行
        const finishedTarget = inventoryList.value.find(item => {
            return isMatch(item.sku) || isMatch(item.barcode);
        });

        playAudio('error');

        if (finishedTarget) {
            smartAlert('该商品已全部归位', false, 1000);
        } else {
            smartAlert('条码不在下架记录中，或输入错误', false, 1000);
        }

        // 失败后清空并重新聚焦
        operateForm.barcode = '';
        focusInput('barcode');
    }
};

// --- 核心逻辑 4: 扫描上架库位 ---
const handleScanLocation = () => {
    const loc = operateForm.locationCode.trim();
    if (!loc) return;

    playAudio('ok');

    // 自动填入剩余待归位数量
    operateForm.quantity = getPendingQty(currentOpItem.value);

    // 成功后聚焦下一个输入框 (数量)
    focusInput('qty');
};

// --- 核心逻辑 5: 提交上架 ---
const handleSubmitShelf = async () => {
    if (!operateForm.locationCode || !operateForm.quantity) return;

    const qty = Number(operateForm.quantity);
    const maxQty = getPendingQty(currentOpItem.value);

    if (qty <= 0) {
        playAudio('error');
        smartAlert('数量必须大于0', false, 1000);
        focusInput('qty'); // 聚焦数量
        return;
    }

    if (qty > maxQty) {
        playAudio('error');
        smartAlert(`数量不能大于待归位数量 (${maxQty})`, false, 1000);
        focusInput('qty'); // 聚焦数量
        return;
    }

    loading.value = true;
    try {
        const payload = {
            orderId: currentOrder.orderId,
            inventoryList: [
                {
                    id: currentOpItem.value.id, // 使用 inventoryList 中的 id
                    onQuantity: qty,            // 本次上架数量
                    locationCode: operateForm.locationCode
                }
            ]
        };

        const res = await submitReturnOnShelfApi(payload);

        if (res.success) {
            playAudio('ok');
            ElMessage.success('归位成功');

            // 前端更新列表显示
            currentOpItem.value.onQuantity = (currentOpItem.value.onQuantity || 0) + qty;

            // 重置操作区，准备扫描下一个商品
            resetOperateForm();
            focusInput('barcode');
        } else {
            playAudio('error');
            smartAlert(res.msg || '提交失败', false);
            // 提交失败通常聚焦在数量或库位，这里选择聚焦库位让用户重试
            operateForm.locationCode = '';
            focusInput('location');
        }
    } catch (e) {
        console.error(e);
        playAudio('error');
        smartAlert('提交接口异常', false);
    } finally {
        loading.value = false;
    }
};

// --- 辅助方法 ---
const getPendingQty = (row) => {
    if (!row) return 0;
    const out = Number(row.outQuantity) || 0;
    const on = Number(row.onQuantity) || 0;
    return Math.max(0, out - on);
};

const resetOperateForm = () => {
    operateForm.barcode = '';
    operateForm.locationCode = '';
    operateForm.quantity = undefined;
    currentOpItem.value = null;
};

const resetCurrentInfo = () => {
    // 清空对象属性但保持响应式
    Object.keys(currentOrder).forEach(key => delete currentOrder[key]);
    inventoryList.value = [];
    isOrderLocked.value = false;
    resetOperateForm();
};

const resetPage = () => {
    queryConfig.code = '';
    resetCurrentInfo();
    focusInput('order');
};

// 聚焦封装
const focusInput = (type) => {
    nextTick(() => {
        let target = null;
        if (type === 'order') target = orderInputRef.value;
        else if (type === 'barcode') target = barcodeInputRef.value;
        else if (type === 'location') target = locationInputRef.value;
        else if (type === 'qty') target = qtyInputRef.value;

        if (target) {
            // Element Plus Input 组件聚焦
            if (target.$el && target.$el.querySelector('input')) {
                target.$el.querySelector('input').focus();
            } else if (target.focus) {
                target.focus();
            }
        }
    });
};

// 弹窗相关逻辑
const handleOrderRowClick = (row) => { selectedOrderId.value = row.id; };
const getSelectedOrderRowClass = ({ row }) => { return row.id === selectedOrderId.value ? 'selected-order-row' : ''; };
const confirmSelectedOrder = () => {
    if (!selectedOrderId.value) return;
    orderSelectDialogVisible.value = false;
    fetchOrderInventory(selectedOrderId.value);
};

// 表格样式
const tableRowClassName = ({ row }) => {
    // 如果该行待归位为0，显示灰色背景表示完成
    if (getPendingQty(row) <= 0) {
        return 'finished-row';
    }
    return '';
};
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
    gap: 15px;
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

.listModule {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 防止撑开页面 */
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

.common-form {
    margin-top: 8px;
    width: 100%;

    .el-form-item {
        margin-bottom: 18px;
        /* 稍微加大间距 */
    }

    .el-select,
    .el-input,
    .el-input-number {
        width: 100%;
    }
}

/* 当前操作商品提示框 */
.current-sku-info {
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #606266;

    .info-row {
        margin-bottom: 4px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .highlight {
        color: #f56c6c;
        font-weight: bold;
        font-size: 16px;
    }
}

/* 订单基本信息网格 */
.basic-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding-top: 5px;
}

.full-width {
    grid-column: span 2;
}

.info-item {
    display: flex;
    line-height: 1.6;
    font-size: 14px;
    align-items: center;
}

.info-label {
    flex: 0 0 70px;
    color: #909399;
}

.info-value {
    flex: 1;
    word-break: break-all;
    color: #303133;
    font-weight: 500;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

:deep(.selected-order-row) {
    background-color: #ffdab9 !important;
}

:deep(.finished-row) {
    background-color: #f0f9eb;
    color: #67c23a;
}

:deep(.el-form) {
    width: 395px !important;
}
</style>