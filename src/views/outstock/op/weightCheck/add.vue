<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="layout">
                <div class="leftPanel">

                    <div class="module settingModule">
                        <h3>
                            <el-icon>
                                <Setting />
                            </el-icon>基础设置
                        </h3>
                        <el-form label-width="80px">
                            <el-form-item label="单位类型:">
                                <el-select v-model="settings.unitType" placeholder="选择单位" style="width: 100%"
                                    :disabled="orderInfoLoaded">
                                    <el-option v-for="item in unitOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作选项:">
                                <div style="display: flex; gap: 15px;">
                                    <el-checkbox v-model="settings.isOutboundStock" label="自动出库" />
                                    <el-checkbox v-model="settings.enableMaterialScan" label="扫描耗材" />
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module orderIdentifyModule">
                        <h3>
                            <el-icon>
                                <Document />
                            </el-icon>订单识别
                        </h3>
                        <div class="orderIdentifyForm">
                            <el-select v-model="orderData.codeType" @change="handleCodeTypeChange" style="width: 113px;"
                                :disabled="orderFormDisabled">
                                <el-option v-for="item in codeTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                            <span style="padding: 12px 12px 12px 3px;">:</span>
                            <el-input v-model.trim="orderData.code" :autofocus="true" style="width: 280px;"
                                @keydown.enter.prevent="getOrderInfo()" ref="numberInputRef" placeholder="输入单号后回车"
                                :disabled="orderFormDisabled">
                                <template #append>
                                    <el-button :icon="RefreshLeft" @click="resetAllInfo" />
                                </template>
                            </el-input>
                        </div>
                    </div>

                    <div class="module waybillScanModule">
                        <h3>
                            <el-icon>
                                <Ticket />
                            </el-icon>运单扫描
                        </h3>
                        <el-form label-width="80px" class="waybillForm">
                            <el-form-item label="运单号:">
                                <el-input v-model.trim="waybillData.number" @keydown.enter.prevent="matchWaybill"
                                    ref="waybillInputRef" :disabled="!orderInfoLoaded || waybillDisabled"
                                    placeholder="扫描运单号后回车" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module weightScanModule">
                        <h3>
                            <el-icon>
                                <ScaleToOriginal />
                            </el-icon>称重
                        </h3>
                        <el-form label-width="80px" class="skuForm">
                            <el-form-item :label="`重量(${currentUnitLabel}):`">
                                <el-input v-model.trim="weightData.value" @keydown.enter.prevent="handleWeightEnter"
                                    ref="weightInputRef" type="number" :disabled="!currentWaybillMatched"
                                    placeholder="输入重量后回车" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module materialScanModule">
                        <h3>
                            <el-icon>
                                <Crop />
                            </el-icon>耗材扫描
                        </h3>
                        <el-form label-width="80px" class="materialForm">
                            <el-form-item label="耗材条码:">
                                <el-input v-model.trim="materialData.barcode" @keydown.enter.prevent="matchMaterial"
                                    ref="materialInputRef" :disabled="!canScanMaterial" placeholder="扫描耗材条码后回车" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="submit-section">
                        <el-button type="success" icon="Check" @click="submitWeighing" :disabled="!canSubmit"
                            class="submit-btn">
                            提交 (Ctrl+Enter)
                        </el-button>
                    </div>

                    <div class="shortcut-tips-custom">
                        <div class="shortcut-title">快捷键说明</div>
                        <ul class="shortcut-list">
                            <li><span class="shortcut-key">Ctrl+1</span> - 聚焦订单号</li>
                            <li><span class="shortcut-key">Ctrl+2</span> - 聚焦运单号</li>
                            <li><span class="shortcut-key">Ctrl+3</span> - 聚焦重量</li>
                            <li><span class="shortcut-key">Ctrl+4</span> - 聚焦耗材</li>
                            <li><span class="shortcut-key">Ctrl+Enter</span> - 提交</li>
                        </ul>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="module orderBasicInfoModule">
                        <h3>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>订单基本信息
                        </h3>
                        <div class="basic-info-grid">
                            <div class="info-item">
                                <span class="info-label">出库单号:</span>
                                <span class="info-value">{{ orderBasicInfo.orderNo || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">仓库:</span>
                                <span class="info-value">{{ orderBasicInfo.warehouseCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">客户:</span>
                                <span class="info-value">{{ orderBasicInfo.customerName || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">物流渠道:</span>
                                <span class="info-value">{{ orderBasicInfo.shipwayCode || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="module packageListModule">
                        <h3>
                            <el-icon>
                                <Box />
                            </el-icon>包裹列表
                            <span class="package-count">{{ packageList.length }}个包裹</span>
                        </h3>
                        <div class="package-list-container">
                            <div v-for="(packageItem, packageIndex) in packageList"
                                :key="packageItem.waybillId || packageIndex" class="package-item" :class="{
                                    'matched-package': packageItem.isMatched,
                                    'completed-package': packageItem.isCompleted && !packageItem.isMatched
                                }">
                                <div class="package-header">
                                    <span class="package-number">包裹 {{ packageIndex + 1 }}</span>
                                    <span class="waybill-number">运单号: {{ formatWaybillNo(packageItem.trackingNo)
                                        }}</span>
                                </div>

                                <div class="package-info-row">
                                    <div class="pkg-info-item highlight">
                                        <span class="label">当前重量:</span>
                                        <span class="value">
                                            {{ packageItem.realWeight ? packageItem.realWeight : '-' }}
                                            {{ packageItem.realWeight ? currentUnitLabel : '' }}

                                            <span v-if="packageItem.outWeightKg || packageItem.outWeightLb"
                                                style="font-size: 13px; color: #666; margin-left: 8px; font-weight: normal;">
                                                (出库: {{ packageItem.outWeightKg || 0 }}kg / {{ packageItem.outWeightLb
                                                    || 0 }}lb)
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div class="table-section">
                                    <div class="table-title">商品信息</div>
                                    <el-table :data="packageItem.orderSkuItems" border style="width: 100%;"
                                        size="small">
                                        <el-table-column prop="barcode" label="商品条码" />
                                        <el-table-column prop="skuName" label="品名" show-overflow-tooltip />
                                        <el-table-column prop="pickFinishedQty" label="已拣数量" width="100"
                                            align="center" />
                                    </el-table>
                                </div>

                                <div class="table-section">
                                    <div class="table-title">耗材信息</div>
                                    <el-table :data="packageItem.consumableList" border style="width: 100%;"
                                        size="small">
                                        <el-table-column prop="consumablesCode" label="耗材代码" />
                                        <el-table-column prop="consumablesName" label="耗材名称" show-overflow-tooltip />
                                        <el-table-column label="数量" width="140" align="center">
                                            <template #default="{ row }">
                                                <el-input-number v-model="row.quantity" :min="1" size="small"
                                                    style="width: 110px;" :disabled="packageItem.isCompleted"
                                                    @change="() => { }" />
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="60" align="center">
                                            <template #default="{ $index }">
                                                <el-button type="danger" link :icon="Delete"
                                                    :disabled="packageItem.isCompleted"
                                                    @click="removeConsumable(packageItem, $index)" />
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
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

<script setup name="称重">
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { Document, Ticket, ScaleToOriginal, Crop, Box, InfoFilled, Check, RefreshLeft, Setting, Delete } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
import { getReCheckOutOrderApi, isAvailableAndInStockApi, getOutOrderByCodeApi, submitWeightCheckApi } from '@/api/outstockApi/op.js';
import { getUnitTypeEnumApi } from '@/api/baseApi/basic.js';
import okAudio from '@/assets/audio/ok.wav';
import errorAudio from '@/assets/audio/error.wav';

// 音频控制
const audioFiles = ref({ ok: new Audio(okAudio), error: new Audio(errorAudio) });
const playAudio = (key) => {
    const audio = audioFiles.value[key];
    if (audio) {
        audio.pause(); audio.currentTime = 0;
        audio.play().catch(e => console.warn('音频播放失败', e));
    }
};

// --- 基础设置 ---
const settings = reactive({
    unitType: '',
    isOutboundStock: true, // 自动出库
    enableMaterialScan: false // 扫描耗材
});

const unitOptions = ref([]);
const currentUnitLabel = computed(() => {
    const type = String(settings.unitType);
    if (type === '1') return 'kg';
    if (type === '2') return 'lb';
    if (type === '3') return 'oz';
    const opt = unitOptions.value.find(o => String(o.value) === type);
    return opt ? opt.label : '';
});

// --- 数据模型 ---
const codeTypeOptions = ref([{ label: '运单号', value: '1' }, { label: '出库单号', value: '0' }]);
const orderData = reactive({ codeType: '1', code: '' });
const waybillData = reactive({ number: '' });
const weightData = reactive({ value: '' });
const materialData = reactive({ barcode: '' });

// Refs
const numberInputRef = ref(null);
const waybillInputRef = ref(null);
const weightInputRef = ref(null);
const materialInputRef = ref(null);

const orderBasicInfo = reactive({});
const packageList = ref([]);
const selectedOrderId = ref('');
const orderList = ref([]);
const orderSelectDialogVisible = ref(false);

// 状态
const orderInfoLoaded = ref(false);
const currentWaybillMatched = ref(false);
const orderFormDisabled = ref(false);
const waybillDisabled = ref(false);

// --- 计算属性 ---
const canScanMaterial = computed(() => {
    return currentWaybillMatched.value && settings.enableMaterialScan;
});

const canSubmit = computed(() => {
    // 必须有匹配包裹且有重量
    if (!currentWaybillMatched.value || !weightData.value) return false;
    return true;
});

// --- 方法 ---

// 辅助：安全聚焦方法，兼容 Element Plus 组件和原生 DOM
const safeFocus = (refObj) => {
    if (!refObj.value) return;
    if (typeof refObj.value.focus === 'function') {
        refObj.value.focus(); // Element Plus 推荐方式
    } else if (refObj.value.$el && refObj.value.$el.querySelector('input')) {
        refObj.value.$el.querySelector('input').focus(); // 兜底
    }
};

const resetAllInfo = () => {
    orderData.code = '';
    orderInfoLoaded.value = false;
    orderFormDisabled.value = false;
    packageList.value = [];
    Object.keys(orderBasicInfo).forEach(k => delete orderBasicInfo[k]);
    resetPartialInfo();
    nextTick(() => safeFocus(numberInputRef));
};

const resetPartialInfo = () => {
    waybillData.number = '';
    weightData.value = '';
    materialData.barcode = '';
    currentWaybillMatched.value = false;
    waybillDisabled.value = false;
    packageList.value.forEach(pkg => pkg.isMatched = false);
    nextTick(() => {
        if (orderInfoLoaded.value) safeFocus(waybillInputRef);
    });
};

const formatWaybillNo = (no) => no && no.length > 4 ? no.slice(0, -4) + '****' : no;
// 修改点2: 删除 formatDimensions 和 hasDimensions 函数

const handleCodeTypeChange = () => { if (orderData.code) getOrderInfo(); };

// 1. 获取订单
const getOrderInfo = async (forceOrderId = '') => {
    if (forceOrderId) return fetchOrderDetails(forceOrderId);
    const code = orderData.code.trim();
    if (!code) return;

    const loading = ElLoading.service({ lock: true, text: '搜索订单...' });
    try {
        const res = await getOutOrderByCodeApi({ code, codeType: orderData.codeType });
        if (!res.success) {
            playAudio('error'); smartAlert(res.msg || '搜索失败', false); return;
        }
        const list = res.data || [];
        if (list.length === 1) await fetchOrderDetails(list[0].id);
        else if (list.length > 1) {
            orderList.value = list;
            selectedOrderId.value = '';
            orderSelectDialogVisible.value = true;
            playAudio('error');
        } else {
            playAudio('error'); smartAlert('未找到订单', false);
        }
    } catch (e) {
        playAudio('error'); smartAlert('异常: ' + e.message, false);
    } finally {
        loading.close();
    }
};

const fetchOrderDetails = async (orderId) => {
    const loading = ElLoading.service({ lock: true, text: '加载详情...' });
    try {
        const res = await getReCheckOutOrderApi({ outOrderId: orderId, opType: 2 });
        if (res.success && res.data) {
            const data = res.data;
            Object.assign(orderBasicInfo, {
                orderId: data.orderId,
                orderNo: data.orderNo,
                warehouseCode: data.warehouseCode,
                customerCode: data.customerCode,
                customerName: data.customerName,
                shipwayCode: data.shipwayCode
            });

            // 处理包裹
            packageList.value = (data.orderItems || []).map(pkg => ({
                ...pkg,
                isMatched: false,
                isCompleted: false,
                realWeight: '',
                // 耗材列表
                consumableList: (pkg.consumablesVOList || []).map(c => ({
                    id: c.id, // 【关键】原有数据必须保留 ID
                    consumablesCode: c.consumablesCode,
                    consumablesName: c.consumablesName,
                    consumablesBarcode: c.consumablesBarcode || '',
                    quantity: c.quantity || 1
                }))
            }));

            orderInfoLoaded.value = true;
            orderFormDisabled.value = true;
            playAudio('ok');
            ElMessage.success('加载成功');

            if (orderData.codeType === '1') {
                waybillData.number = orderData.code;
                matchWaybill();
            } else {
                nextTick(() => safeFocus(waybillInputRef));
            }
        } else {
            playAudio('error'); smartAlert(res.msg || '获取失败', false);
        }
    } finally {
        loading.close();
    }
};

// 订单选择
const handleOrderRowClick = (row) => selectedOrderId.value = row.id;
const getSelectedOrderRowClass = ({ row }) => row.id === selectedOrderId.value ? 'selected-order-row' : '';
const confirmSelectedOrder = () => {
    if (selectedOrderId.value) {
        orderSelectDialogVisible.value = false;
        getOrderInfo(selectedOrderId.value);
    }
};

// 2. 匹配运单
const matchWaybill = () => {
    if (!waybillData.number.trim() || !orderInfoLoaded.value) return;
    const inputNo = waybillData.number.trim();
    const pkg = packageList.value.find(p => new RegExp(`^${p.trackingNo}$`, 'i').test(inputNo));

    if (pkg) {
        packageList.value.forEach(p => p.isMatched = false);
        pkg.isMatched = true;
        currentWaybillMatched.value = true;
        waybillDisabled.value = true;
        playAudio('ok');
        nextTick(() => safeFocus(weightInputRef));
    } else {
        playAudio('error'); smartAlert('未找到该运单', false); waybillData.number = '';
    }
};

// 3. 重量输入
const handleWeightEnter = () => {
    if (!weightData.value || parseFloat(weightData.value) <= 0) {
        smartAlert('请输入有效重量', false); return;
    }

    const pkg = packageList.value.find(p => p.isMatched);
    if (pkg) pkg.realWeight = weightData.value;

    if (!settings.enableMaterialScan) {
        submitWeighing();
    } else {
        playAudio('ok');
        nextTick(() => safeFocus(materialInputRef));
    }
};

// 4. 耗材扫描
const matchMaterial = async () => {
    const code = materialData.barcode.trim();
    if (!code || !currentWaybillMatched.value) return;
    const pkg = packageList.value.find(p => p.isMatched);
    if (!pkg) return;

    // A. 检查是否已存在
    const existItem = pkg.consumableList.find(c =>
        (c.consumablesBarcode && c.consumablesBarcode === code) ||
        (c.consumablesCode === code)
    );

    if (existItem) {
        existItem.quantity++;
        playAudio('ok');
        materialData.barcode = '';
    } else {
        // B. 不存在，调用接口查询
        try {
            const res = await isAvailableAndInStockApi({
                warehouseCode: orderBasicInfo.warehouseCode,
                customerCode: orderBasicInfo.customerCode,
                consumablesBarcode: code
            });
            if (res.success && res.data) {
                pkg.consumableList.push({
                    consumablesCode: res.data.consumablesCode,
                    consumablesName: res.data.consumablesName,
                    consumablesBarcode: res.data.consumablesBarcode || code,
                    quantity: 1,
                    isNew: true
                });
                playAudio('ok');
                materialData.barcode = '';
            } else {
                playAudio('error'); smartAlert(res.msg || '耗材无效', false); materialData.barcode = '';
            }
        } catch (e) {
            playAudio('error'); smartAlert('校验异常', false); materialData.barcode = '';
        }
    }
};

const removeConsumable = (pkg, index) => {
    pkg.consumableList.splice(index, 1);
};

// 5. 提交
const submitWeighing = async () => {
    if (!canSubmit.value) return;
    const pkg = packageList.value.find(p => p.isMatched);
    if (!pkg) return;

    const loading = ElLoading.service({ lock: true, text: '提交中...' });
    try {
        const params = {
            outOrderId: orderBasicInfo.orderId,
            isOutboundStock: settings.isOutboundStock,
            waybillWeightList: [{
                waybillId: pkg.waybillId,
                realWeight: Number(weightData.value),
                unitType: Number(settings.unitType)
            }],
            consumableList: pkg.consumableList.map(c => ({
                id: c.id || null,
                consumablesCode: c.consumablesCode,
                consumablesName: c.consumablesName || '',
                consumablesBarcode: c.consumablesBarcode || '',
                quantity: c.quantity,
                trackingNo: pkg.trackingNo,
                waybillId: pkg.waybillId
            }))
        };

        const res = await submitWeightCheckApi(params);
        if (res.success) {
            playAudio('ok');
            ElMessage.success('提交成功');
            pkg.isCompleted = true;
            resetPartialInfo();
        } else {
            playAudio('error');
            smartAlert(res.msg || '提交失败', false);
        }
    } catch (e) {
        playAudio('error'); smartAlert('提交异常', false);
    } finally {
        loading.close();
    }
};

// --- 快捷键逻辑 ---
const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault(); e.stopPropagation();
        submitWeighing();
        return;
    }

    const focusMap = { '1': numberInputRef, '2': waybillInputRef, '3': weightInputRef, '4': materialInputRef };
    if (e.ctrlKey && focusMap[e.key]) {
        e.preventDefault(); e.stopPropagation();

        if (e.key === '2' && (!orderInfoLoaded.value || waybillDisabled.value)) return;
        if (e.key === '3' && !currentWaybillMatched.value) return;
        if (e.key === '4' && !canScanMaterial.value) return;

        nextTick(() => safeFocus(focusMap[e.key]));
    }
};

onMounted(async () => {
    try {
        const res = await getUnitTypeEnumApi();
        if (res.success) {
            unitOptions.value = res.data.map(i => ({ label: i.name, value: i.id }));
            if (unitOptions.value.length) settings.unitType = unitOptions.value[0].value;
        }
    } catch (e) { console.error(e); }

    // 全局绑定键盘事件
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    width: 100%;
}

.leftPanel {
    width: 420px;
    flex: 0 0 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.rightPanel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
}

.module {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.orderIdentifyForm {
    display: flex;
    align-items: center;
    width: 100%;
}

.submit-section {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.submit-btn {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 500;
}

.basic-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 15px;
}

.info-item {
    display: flex;
    line-height: 1.8;

    .info-label {
        flex: 0 0 80px;
        color: #606266;
        font-weight: 500;
    }

    .info-value {
        flex: 1;
        color: #303133;
        word-break: break-all;
    }
}

.package-list-container {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    padding-right: 8px;
}

.package-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    transition: all 0.3s;

    &.matched-package {
        border-color: #ff7d00;
        box-shadow: 0 0 0 2px rgba(255, 125, 0, 0.1);
    }

    &.completed-package {
        border-color: #52c41a;
        background-color: #f6ffed;
    }
}

.package-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #e4e7ed;
    font-weight: 600;

    .package-number {
        margin-right: 15px;
        color: #1f2329;
    }

    .waybill-number {
        color: #606266;
        font-size: 14px;
        margin-left: auto;
    }
}

.package-info-row {
    display: flex;
    gap: 20px;
    margin-bottom: 12px;
    font-size: 14px;

    .pkg-info-item {
        .label {
            color: #909399;
            margin-right: 5px;
        }

        .value {
            color: #303133;
            font-weight: 500;
        }

        &.highlight .value {
            color: #409eff;
            font-size: 16px;
            font-weight: bold;
        }
    }
}

.table-section {
    margin-top: 10px;

    .table-title {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 5px;
        color: #606266;
    }
}

.shortcut-tips-custom {
    margin-top: 15px;
    background: #333;
    color: #fff;
    border-radius: 6px;
    padding: 12px;

    .shortcut-title {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 8px;
        border-bottom: 1px solid #555;
        padding-bottom: 5px;
    }

    .shortcut-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 5px;
            font-size: 13px;

            .shortcut-key {
                background: #555;
                padding: 1px 5px;
                border-radius: 3px;
                margin-right: 8px;
            }
        }
    }
}

.el-form {
    width: 390px !important;

    .el-form-item {
        margin-bottom: 0;

        &+.el-form-item {
            margin-top: 15px;
        }
    }
}
</style>