<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="layout">
                <div class="leftPanel">
                    <div class="module orderIdentifyModule">
                        <h3>
                            <el-icon>
                                <Document />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.orderIdentify') }}
                        </h3> <!-- 订单识别 -->
                        <div class="orderIdentifyForm">
                            <el-select v-model="orderData.codeType" @change="handleCodeTypeChange" style="width: 113px;"
                                :disabled="orderFormDisabled">
                                <el-option v-for="item in codeTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                            <span style="padding: 12px 12px 12px 3px;">:</span>
                            <el-input v-model.trim="orderData.code" :autofocus="true" style="width: 280px;"
                                @keydown.enter.prevent.stop="getOrderInfo()" ref="numberInputRef"
                                :placeholder="$t('outstock_op_outReviewed_add.inputOrderNoOrWaybillNoAndEnter')"
                                :disabled="orderFormDisabled"> <!-- 输入出库单号/运单号后回车 -->
                                <template #append>
                                    <el-button :icon="RefreshLeft" @click="resetWaveInfo" />
                                </template>
                            </el-input>
                        </div>
                    </div>

                    <div class="module waybillScanModule">
                        <h3>
                            <el-icon>
                                <Ticket />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.waybillScan') }}
                        </h3> <!-- 运单扫描 -->
                        <el-form label-width="80px" class="waybillForm">
                            <el-form-item :label="$t('outstock_op_outReviewed_add.waybillNo') + ':'"> <!-- 运单号 -->
                                <el-input v-model.trim="waybillData.number" @keydown.enter.prevent.stop="matchWaybill"
                                    ref="waybillInputRef" :disabled="!orderInfoLoaded || waybillDisabled"
                                    :placeholder="$t('outstock_op_outReviewed_add.scanWaybillNoAndEnter')" />
                                <!-- 扫描运单号后回车 -->
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module skuScanModule">
                        <h3>
                            <el-icon>
                                <Goods />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.skuScan') }}
                        </h3> <!-- 商品扫描 -->
                        <el-form label-width="80px" class="skuForm">
                            <el-form-item :label="$t('outstock_op_outReviewed_add.productBarcode') + ':'"> <!-- 商品条码 -->
                                <el-input v-model.trim="skuData.barcode" @keydown.enter.prevent.stop="matchSku"
                                    ref="skuInputRef"
                                    :disabled="!currentWaybillMatched || currentWaybillSkuFinished || isCurrentPackageSubmitted"
                                    :placeholder="$t('outstock_op_outReviewed_add.scanProductBarcodeAndEnter')" />
                                <!-- 扫描商品条码后回车 -->
                                <div class="progress-text" v-if="currentSkuTotal > 0">
                                    {{ $t('outstock_op_outReviewed_add.currentProgress') }}: {{ currentSkuProgress }}/{{
                                        currentSkuTotal }}
                                    <!-- 当前进度 -->
                                </div>
                                <div class="progress-text" v-else>
                                    {{ $t('outstock_op_outReviewed_add.currentProgress') }}: {{
                                        $t('outstock_op_outReviewed_add.pleaseMatchWaybillFirst') }} <!-- 当前进度：请先匹配运单号 -->
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="module materialScanModule">
                        <h3>
                            <el-icon>
                                <Crop />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.materialScan') }}
                        </h3> <!-- 耗材扫描 -->
                        <el-form label-width="80px" class="materialForm">
                            <el-form-item :label="$t('outstock_op_outReviewed_add.materialBarcode') + ':'">
                                <!-- 耗材条码 -->
                                <el-input v-model.trim="materialData.barcode"
                                    @keydown.enter.prevent.stop="matchMaterial" ref="materialInputRef"
                                    :disabled="!currentWaybillSkuFinished || isCurrentPackageSubmitted"
                                    :placeholder="$t('outstock_op_outReviewed_add.scanMaterialBarcodeAndEnter')" />
                                <!-- 扫描耗材条码后回车 -->
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="submit-section">
                        <el-button type="success" icon="Check" @click="submitReview" :disabled="!canSubmit"
                            class="submit-btn">
                            {{ $t('outstock_op_outReviewed_add.submitCurrentPackage') }} (Ctrl+Enter) <!-- 提交当前包裹 -->
                        </el-button>
                    </div>

                    <div class="shortcut-tips-custom">
                        <div class="shortcut-title">{{ $t('outstock_op_outReviewed_add.shortcutInstructions') }}</div>
                        <!-- 快捷键说明 -->
                        <ul class="shortcut-list">
                            <li><span class="shortcut-key">Ctrl+1</span> - {{
                                $t('outstock_op_outReviewed_add.focusOrderNoInput') }}</li>
                            <!-- 聚焦订单号输入框 -->
                            <li><span class="shortcut-key">Ctrl+2</span> - {{
                                $t('outstock_op_outReviewed_add.focusWaybillNoInput') }}</li>
                            <!-- 聚焦运单号输入框 -->
                            <li><span class="shortcut-key">Ctrl+3</span> - {{
                                $t('outstock_op_outReviewed_add.focusProductBarcodeInput') }}
                            </li> <!-- 聚焦商品条码输入框 -->
                            <li><span class="shortcut-key">Ctrl+4</span> - {{
                                $t('outstock_op_outReviewed_add.focusMaterialBarcodeInput') }}
                            </li> <!-- 聚焦耗材条码输入框 -->
                            <li><span class="shortcut-key">Ctrl+Enter</span> - {{
                                $t('outstock_op_outReviewed_add.submitReview') }}</li>
                            <!-- 提交复核 -->
                        </ul>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="module orderBasicInfoModule">
                        <h3>
                            <el-icon>
                                <InfoFilled />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.orderBasicInfo') }}
                        </h3> <!-- 订单基本信息 -->
                        <div class="basic-info-grid">
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.outboundOrderNo') }}:</span>
                                <!-- 出库单号 -->
                                <span class="info-value">{{ orderBasicInfo.orderNo || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.warehouse') }}:</span>
                                <!-- 仓库 -->
                                <span class="info-value">{{ orderBasicInfo.warehouseCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.customer') }}:</span>
                                <!-- 客户 -->
                                <span class="info-value">{{ orderBasicInfo.customerName || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.customerCode') }}:</span>
                                <!-- 客户代码 -->
                                <span class="info-value">{{ orderBasicInfo.customerCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.logisticsProduct')
                                }}:</span> <!-- 物流产品 -->
                                <span class="info-value">{{ orderBasicInfo.shipwayCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">{{ $t('outstock_op_outReviewed_add.reviewStartTime') }}:</span>
                                <!-- 复核开始时间 -->
                                <span class="info-value">{{ orderBasicInfo.startTime || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="module packageListModule">
                        <h3>
                            <el-icon>
                                <Box />
                            </el-icon>{{ $t('outstock_op_outReviewed_add.packageList') }} <!-- 包裹列表 -->
                            <span class="package-count">{{ packageList.length }}{{
                                $t('outstock_op_outReviewed_add.packages') }}</span>
                            <!-- 个包裹 -->
                        </h3>
                        <div class="package-list-container">
                            <div v-for="(packageItem, packageIndex) in packageList" :key="packageItem.waybillId"
                                class="package-item" :class="{
                                    'matched-package': packageItem.isMatched,
                                    'completed-package': packageItem.isSubmitted
                                }">
                                <div class="package-header">
                                    <span class="package-number">{{ $t('outstock_op_outReviewed_add.package') }} {{
                                        packageIndex + 1
                                    }}</span> <!-- 包裹 -->
                                    <span class="waybill-number">{{ $t('outstock_op_outReviewed_add.waybillNo') }}: {{
                                        formatWaybillNo(packageItem.trackingNo)
                                    }}</span> <!-- 运单号 -->
                                    <el-tag v-if="packageItem.isSubmitted" type="success" size="small"
                                        style="margin-left: auto;">{{
                                            $t('outstock_op_outReviewed_add.submitted') }}</el-tag> <!-- 已提交 -->
                                </div>

                                <div class="table-section">
                                    <div class="table-title">{{ $t('outstock_op_outReviewed_add.productInfo') }}</div>
                                    <!-- 商品信息 -->
                                    <el-table :data="packageItem.orderSkuItems" border style="width: 100%;"
                                        :row-class-name="getSkuRowClassName">
                                        <el-table-column prop="barcode"
                                            :label="$t('outstock_op_outReviewed_add.productBarcode')" width="180" />
                                        <!-- 商品条码 -->
                                        <el-table-column prop="skuName"
                                            :label="$t('outstock_op_outReviewed_add.productName')" show-overflow-tooltip
                                            width="200" /> <!-- 品名 -->
                                        <el-table-column prop="qty"
                                            :label="$t('outstock_op_outReviewed_add.pickingQty')" width="100" />
                                        <!-- 拣货数量 -->
                                        <el-table-column prop="reviewedQty"
                                            :label="$t('outstock_op_outReviewed_add.reviewedQty')" width="100" />
                                        <!-- 已复核数量 -->
                                        <el-table-column :label="$t('outstock_op_outReviewed_add.status')" width="100">
                                            <!-- 状态 -->
                                            <template #default="scope">
                                                <span v-if="scope.row.reviewedQty >= scope.row.qty"
                                                    style="color: green;">{{ $t('outstock_op_outReviewed_add.completed')
                                                    }}</span> <!-- 完成 -->
                                                <span v-else style="color: gray;">{{
                                                    $t('outstock_op_outReviewed_add.inProgress') }}</span> <!-- 进行中 -->
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>

                                <div class="table-section">
                                    <div class="table-title">{{ $t('outstock_op_outReviewed_add.materialInfo') }}</div>
                                    <!-- 耗材信息 -->
                                    <el-table :data="packageItem.consumableList" border style="width: 100%;"
                                        :row-class-name="getMaterialRowClassName">
                                        <el-table-column prop="consumablesBarcode"
                                            :label="$t('outstock_op_outReviewed_add.materialBarcode')" width="180" />
                                        <!-- 耗材条码 -->
                                        <el-table-column prop="consumablesName"
                                            :label="$t('outstock_op_outReviewed_add.materialName')"
                                            show-overflow-tooltip width="200" /> <!-- 耗材名称 -->
                                        <el-table-column prop="quantity"
                                            :label="$t('outstock_op_outReviewed_add.quantity')" width="150"> <!-- 数量 -->
                                            <template #default="scope">
                                                <el-input v-model="scope.row.quantity" v-intNumber="true" size="small"
                                                    :disabled="packageItem.isSubmitted" style="width: 100%" />
                                            </template>
                                        </el-table-column>

                                        <el-table-column :label="$t('outstock_op_outReviewed_add.operation')" width="80"
                                            align="center">
                                            <!-- 操作 -->
                                            <template #default="scope">
                                                <el-button type="danger" link :icon="Delete"
                                                    @click="removeConsumable(packageItem, scope.$index)"
                                                    :disabled="packageItem.isSubmitted">
                                                    {{ $t('outstock_op_outReviewed_add.delete') }} <!-- 删除 -->
                                                </el-button>
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

        <el-dialog v-model="orderSelectDialogVisible" :title="$t('outstock_op_outReviewed_add.selectOutboundOrderNo')"
            width="700px" :close-on-click-modal="false" align-center> <!-- 选择出库单号 -->
            <el-table :data="orderList" border style="width: 100%" @row-click="handleOrderRowClick"
                :row-class-name="getSelectedOrderRowClass">
                <el-table-column prop="orderNo" :label="$t('outstock_op_outReviewed_add.outboundOrderNo')" />
                <!-- 出库单号 -->
                <el-table-column prop="statusName" :label="$t('outstock_op_outReviewed_add.status')" width="150" />
                <!-- 状态 -->
                <el-table-column prop="createdTime" :label="$t('outstock_op_outReviewed_add.createTime')" width="200" />
                <!-- 创建时间 -->
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="orderSelectDialogVisible = false">{{ $t('outstock_op_outReviewed_add.cancel')
                    }}</el-button> <!-- 取消 -->
                    <el-button type="primary" @click="confirmSelectedOrder" :disabled="!selectedOrderId">{{
                        $t('outstock_op_outReviewed_add.confirm') }}</el-button> <!-- 确定 -->
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="复核">
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { Document, Ticket, Goods, Crop, Box, InfoFilled, Delete, RefreshLeft } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
import { getReCheckOutOrderApi, submitReCheckApi, isAvailableAndInStockApi, getOutOrderByCodeApi } from '@/api/outstockApi/op.js';

// 音频文件
import okAudio from '@/assets/audio/ok.wav';
import errorAudio from '@/assets/audio/error.wav';

const audioFiles = ref({
    ok: new Audio(okAudio),
    error: new Audio(errorAudio)
});

// 播放音频函数
const playAudio = (audioKey) => {
    const audio = audioFiles.value[audioKey];
    if (!audio) {
        console.warn(`未找到音频文件: ${audioKey}.wav`);
        return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(error => {
        console.warn('音频播放失败:', error);
    });
};

// 订单识别类型选项
const codeTypeOptions = ref([
    { label: '运单号', value: '1' },
    { label: '出库单号', value: '0' }
]);

// 订单识别数据
const orderData = reactive({
    codeType: '1', // 默认运单号
    code: ''
});

// 运单扫描数据
const waybillData = reactive({
    number: ''
});

// 商品扫描数据
const skuData = reactive({
    barcode: ''
});

// 耗材扫描数据
const materialData = reactive({
    barcode: ''
});

// 输入框引用
const numberInputRef = ref(null);
const waybillInputRef = ref(null);
const skuInputRef = ref(null);
const materialInputRef = ref(null);

// 订单基本信息
const orderBasicInfo = reactive({
    orderId: '',
    orderNo: '',
    warehouseCode: '',
    customerId: '',
    customerCode: '',
    customerName: '',
    shipwayCode: '',
    startTime: ''
});

// 包裹列表数据结构
const packageList = ref([]);

// 状态标记
const orderInfoLoaded = ref(false); // 订单信息是否加载成功
const currentWaybillMatched = ref(false); // 当前运单是否匹配
const currentSkuProgress = ref(0); // 当前商品复核进度
const currentSkuTotal = ref(0); // 当前商品总数量
const currentWaybillSkuFinished = ref(false); // 当前包裹商品是否全部复核完成
const orderFormDisabled = ref(false); // 订单识别表单是否禁用
const waybillDisabled = ref(false); // 运单输入框是否禁用

// 订单选择弹窗相关
const orderSelectDialogVisible = ref(false);
const orderList = ref([]); // 存储完整的订单信息列表
const selectedOrderId = ref(''); // 选中的订单ID
const tempOrderData = ref({}); // 临时存储订单识别数据，用于弹窗选择后恢复

// 计算属性：当前包裹是否已提交
const isCurrentPackageSubmitted = computed(() => {
    const currentPkg = packageList.value.find(pkg => pkg.isMatched);
    return currentPkg ? currentPkg.isSubmitted : false;
});

// 计算属性：是否可以提交当前包裹
const canSubmit = computed(() => {
    // 必须有匹配的运单
    if (!currentWaybillMatched.value) return false;
    // 必须商品复核完成
    if (!currentWaybillSkuFinished.value) return false;
    // 不能是已经提交过的
    if (isCurrentPackageSubmitted.value) return false;
    return true;
});

// 格式化运单号（隐藏最后四位）
const formatWaybillNo = (waybillNo) => {
    if (!waybillNo) return '';
    if (waybillNo.length <= 4) return waybillNo;
    return waybillNo.slice(0, waybillNo.length - 4) + '****';
};

// 处理订单识别类型变化
const handleCodeTypeChange = () => {
    if (orderData.code) {
        getOrderInfo();
    }
};

// 订单输入框重置功能
const resetWaveInfo = () => {
    resetPage();
    nextTick(() => {
        numberInputRef.value?.$el?.querySelector('input')?.focus();
    });
};

// 获取订单信息
const getOrderInfo = async (forceOrderId = '') => {
    if (forceOrderId) {
        return fetchOrderDetails(forceOrderId);
    }
    const codeToUse = orderData.code.trim();
    if (!codeToUse) return;

    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        const searchRes = await getOutOrderByCodeApi({
            code: codeToUse,
            codeType: orderData.codeType
        });

        if (!searchRes.success) {
            playAudio('error');
            smartAlert(searchRes.msg || '搜索订单失败', false);
            return;
        }

        const orderListData = searchRes.data || [];
        if (orderListData.length === 1) {
            const orderId = orderListData[0].id;
            if (orderId) await fetchOrderDetails(orderId);
            else {
                playAudio('error');
                smartAlert('获取订单ID失败', false);
            }
        } else if (orderListData.length > 1) {
            tempOrderData.value = { ...orderData };
            orderList.value = orderListData;
            selectedOrderId.value = '';
            orderSelectDialogVisible.value = true;
            playAudio('error');
        } else {
            playAudio('error');
            smartAlert('未找到匹配的订单信息', false);
        }
    } catch (error) {
        playAudio('error');
        console.error('获取订单信息异常:', error);
        smartAlert('获取订单信息异常，请重试', false);
    } finally {
        loading.close();
    }
};

// 根据订单ID获取订单详情
const fetchOrderDetails = async (orderId) => {
    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        const res = await getReCheckOutOrderApi({
            outOrderId: orderId,
            opType: 1
        });

        if (res.success && res.data) {
            const orderResData = res.data;
            // 填充订单基本信息
            orderBasicInfo.orderId = orderResData.orderId || '';
            orderBasicInfo.orderNo = orderResData.orderNo || '';
            orderBasicInfo.warehouseCode = orderResData.warehouseCode || '';
            orderBasicInfo.customerId = orderResData.customerId || '';
            orderBasicInfo.customerCode = orderResData.customerCode || '';
            orderBasicInfo.customerName = orderResData.customerName || '';
            orderBasicInfo.shipwayCode = orderResData.shipwayCode || '';
            orderBasicInfo.startTime = orderResData.startTime || new Date().toLocaleString();

            // 处理包裹列表
            packageList.value = (orderResData.orderItems || []).map(pkg => ({
                ...pkg,
                isMatched: false,
                isSubmitted: false,
                orderSkuItems: (pkg.orderSkuItems || []).map(sku => ({
                    ...sku,
                    reviewedQty: 0
                })),
                // --- 修改重点：字段名改为 consumablesVOList ---
                consumableList: (pkg.consumablesVOList || []).map(c => ({
                    consumablesCode: c.consumablesCode,
                    consumablesName: c.consumablesName,
                    consumablesBarcode: c.consumablesBarcode,
                    // 优先使用 quantity，如果没有则默认为 1
                    quantity: c.quantity !== undefined ? c.quantity : 1
                })),
                // --- 修改结束 ---
                originalConsumableList: []
            }));

            orderInfoLoaded.value = true;
            orderFormDisabled.value = true;
            playAudio('ok');

            if (orderData.codeType === '1') {
                waybillData.number = orderData.code;
                matchWaybill();
            }
            ElMessage.success('订单信息加载成功');
            nextTick(() => waybillInputRef.value?.$el?.querySelector('input')?.focus());
        } else {
            playAudio('error');
            smartAlert(res.msg || '获取订单详情失败', false);
        }
    } catch (error) {
        playAudio('error');
        console.error('获取订单详情异常:', error);
        smartAlert('获取订单详情异常，请重试', false);
    } finally {
        loading.close();
    }
};

const handleOrderRowClick = (row) => { selectedOrderId.value = row.id; };
const getSelectedOrderRowClass = ({ row }) => { return row.id === selectedOrderId.value ? 'selected-order-row' : ''; };
const confirmSelectedOrder = () => {
    if (!selectedOrderId.value) return;
    orderSelectDialogVisible.value = false;
    getOrderInfo(selectedOrderId.value);
};

// 匹配运单
const matchWaybill = () => {
    if (!waybillData.number.trim() || !orderInfoLoaded.value) return;
    const inputWaybill = waybillData.number.trim();
    const matchedPackage = packageList.value.find(pkg =>
        new RegExp(`^${pkg.trackingNo}$`, 'i').test(inputWaybill)
    );

    if (matchedPackage) {
        if (matchedPackage.isSubmitted) {
            playAudio('error');
            smartAlert('该包裹已提交复核，请扫描其他运单', false);
            waybillData.number = '';
            return;
        }

        // 重置之前匹配的包裹状态（如果有未提交的中间状态）
        packageList.value.forEach(pkg => {
            if (!pkg.isSubmitted) {
                pkg.isMatched = false;
            }
        });

        matchedPackage.isMatched = true;
        currentWaybillMatched.value = true;
        // 匹配成功后，禁用运单输入框，强制走完商品和耗材流程
        waybillDisabled.value = true;
        playAudio('ok');

        currentSkuTotal.value = matchedPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.qty || 0), 0);
        currentSkuProgress.value = matchedPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.reviewedQty || 0), 0);

        const pkgSkuFinished = matchedPackage.orderSkuItems.every(sku => (sku.reviewedQty || 0) >= (sku.qty || 0));
        currentWaybillSkuFinished.value = pkgSkuFinished;

        if (pkgSkuFinished) {
            ElMessage.success('该包裹所有商品已复核完成，请继续处理耗材');
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        } else {
            waybillData.number = '';
            nextTick(() => skuInputRef.value?.$el?.querySelector('input')?.focus());
        }
    } else {
        playAudio('error');
        smartAlert('运单号匹配失败，请检查输入', false);
        waybillData.number = '';
    }
};

// 匹配商品
const matchSku = async () => {
    if (!skuData.barcode.trim() || !currentWaybillMatched.value) return;
    const currentPackage = packageList.value.find(pkg => pkg.isMatched);
    if (!currentPackage) return;

    const inputBarcode = skuData.barcode.trim();
    const matchedSku = currentPackage.orderSkuItems.find(sku =>
        new RegExp(`^${sku.barcode}$`, 'i').test(inputBarcode)
    );

    if (matchedSku) {
        if ((matchedSku.reviewedQty || 0) < (matchedSku.qty || 0)) {
            matchedSku.reviewedQty = (matchedSku.reviewedQty || 0) + 1;
            playAudio('ok');
        } else {
            playAudio('error');
            smartAlert('该商品已完成复核，数量已达上限', false);
            skuData.barcode = '';
            return;
        }

        currentSkuProgress.value = currentPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.reviewedQty || 0), 0);
        const pkgSkuFinished = currentPackage.orderSkuItems.every(sku => (sku.reviewedQty || 0) >= (sku.qty || 0));
        currentWaybillSkuFinished.value = pkgSkuFinished;

        if (pkgSkuFinished) {
            ElMessage.success('该包裹所有商品已复核完成，请继续处理耗材或提交');
            // 注意：商品扫完后不启用运单，必须提交后才启用
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        }
        skuData.barcode = '';
    } else {
        playAudio('error');
        smartAlert('商品条码匹配失败，请检查输入', false);
        skuData.barcode = '';
    }
};

// 匹配耗材
const matchMaterial = async () => {
    if (!materialData.barcode.trim() || !currentWaybillSkuFinished.value) return;

    const currentPackage = packageList.value.find(pkg => pkg.isMatched);
    if (!currentPackage) return;

    try {
        const res = await isAvailableAndInStockApi({
            warehouseCode: orderBasicInfo.warehouseCode,
            customerCode: orderBasicInfo.customerCode,
            consumablesBarcode: materialData.barcode.trim()
        });

        if (!res.success) {
            playAudio('error');
            smartAlert(res.msg || '耗材库存检查失败', false);
            materialData.barcode = '';
            return;
        }

        const materialInfo = res.data;
        if (!materialInfo) {
            playAudio('error');
            smartAlert('未找到该耗材信息', false);
            materialData.barcode = '';
            return;
        }

        // 检查耗材是否已存在
        const existingMaterial = currentPackage.consumableList.find(
            mat => new RegExp(`^${mat.consumablesBarcode}$`, 'i').test(materialInfo.consumablesBarcode || materialData.barcode.trim())
        );

        if (existingMaterial) {
            // 已存在则数量+1 (因为是输入框，也可以手动改，扫描则自动加1)
            existingMaterial.quantity += 1;
        } else {
            // 不存在则新增，初始数量1
            const newMaterial = {
                consumablesCode: materialInfo.consumablesCode,
                consumablesName: materialInfo.consumablesName || `耗材${materialData.barcode.slice(-4)}`,
                consumablesBarcode: materialInfo.consumablesBarcode || materialData.barcode.trim(),
                quantity: 1
            };
            currentPackage.consumableList.push(newMaterial);
        }

        playAudio('ok');
        materialData.barcode = '';
    } catch (error) {
        playAudio('error');
        console.error('耗材处理异常:', error);
        smartAlert('耗材匹配失败，请检查输入', false);
        materialData.barcode = '';
    }
};

//删除耗材
const removeConsumable = (pkg, index) => {
    if (pkg.isSubmitted) return;
    pkg.consumableList.splice(index, 1);
};

// 提交复核 (按包裹提交)
const submitReview = async () => {
    // 获取当前正在操作的包裹
    const currentPackage = packageList.value.find(pkg => pkg.isMatched);

    if (!currentPackage) return;
    if (!canSubmit.value) {
        smartAlert('当前包裹尚未完成商品复核，无法提交', false);
        return;
    }

    const loading = ElLoading.service({ lock: true, text: '提交中...' });
    try {
        // 准备当前包裹的耗材数据
        const consumablesToSubmit = currentPackage.consumableList.length > 0
            ? currentPackage.consumableList
            : currentPackage.originalConsumableList;

        const consumableListPayload = consumablesToSubmit.map(mat => ({
            consumablesCode: mat.consumablesCode,
            consumablesName: mat.consumablesName,
            consumablesBarcode: mat.consumablesBarcode,
            quantity: mat.quantity,
            waybillId: currentPackage.waybillId || '',
            trackingNo: currentPackage.trackingNo || ''
        }));

        // 调用提交复核接口
        const res = await submitReCheckApi({
            outOrderId: orderBasicInfo.orderId,
            customerId: orderBasicInfo.customerId,
            warehouseCode: orderBasicInfo.warehouseCode,
            consumableList: consumableListPayload,
            // 新增参数：当前包裹的 waybillId
            waybillIdList: [currentPackage.waybillId]
        });

        if (res.success) {
            playAudio('ok');
            ElMessage.success('当前包裹复核提交成功');

            // 标记该包裹为已提交
            currentPackage.isSubmitted = true;
            currentPackage.isMatched = false; // 取消匹配高亮，或者保留高亮但变色（CSS控制）

            // 重置当前操作状态，准备扫描下一个包裹
            resetCurrentOperationState();
        } else {
            playAudio('error');
            smartAlert(res.msg || '复核提交失败', false);
        }
    } catch (error) {
        playAudio('error');
        console.error('提交复核异常:', error);
        smartAlert(`提交复核异常: ${error.message || '未知错误'}，请重试`, false);
    } finally {
        loading.close();
    }
};

// 提交成功后重置当前操作区的状态，不重置整个页面
const resetCurrentOperationState = () => {
    waybillData.number = '';
    skuData.barcode = '';
    materialData.barcode = '';
    currentWaybillMatched.value = false;
    currentWaybillSkuFinished.value = false;
    currentSkuProgress.value = 0;
    currentSkuTotal.value = 0;

    // 启用运单输入框，以便扫描下一个
    waybillDisabled.value = false;
    nextTick(() => {
        waybillInputRef.value?.$el?.querySelector('input')?.focus();
    });
};

// 重置整个页面
const resetPage = () => {
    orderData.code = '';
    waybillData.number = '';
    skuData.barcode = '';
    materialData.barcode = '';
    packageList.value = [];
    orderInfoLoaded.value = false;
    currentWaybillMatched.value = false;
    currentSkuProgress.value = 0;
    currentSkuTotal.value = 0;
    currentWaybillSkuFinished.value = false;
    orderFormDisabled.value = false;
    waybillDisabled.value = false;
    orderSelectDialogVisible.value = false;
    orderList.value = [];
    selectedOrderId.value = '';
    Object.keys(orderBasicInfo).forEach(key => {
        orderBasicInfo[key] = '';
    });
    nextTick(() => numberInputRef.value?.$el?.querySelector('input')?.focus());
};

const getSkuRowClassName = ({ row }) => {
    if ((row.reviewedQty || 0) >= (row.qty || 0)) return 'sku-finished-row';
    if ((row.reviewedQty || 0) > 0) return 'sku-matched-row';
    return '';
};

const getMaterialRowClassName = ({ row }) => {
    return row.quantity > 0 ? 'material-matched-row' : '';
};

// 快捷键处理
const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        submitReview();
        return;
    }

    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        nextTick(() => numberInputRef.value?.$el?.querySelector('input')?.focus());
    }
    else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        if (orderInfoLoaded.value && !waybillDisabled.value) {
            nextTick(() => waybillInputRef.value?.$el?.querySelector('input')?.focus());
        }
    }
    else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        if (currentWaybillMatched.value && !currentWaybillSkuFinished.value && !isCurrentPackageSubmitted.value) {
            nextTick(() => skuInputRef.value?.$el?.querySelector('input')?.focus());
        }
    }
    else if (e.ctrlKey && e.key === '4') {
        e.preventDefault();
        if (currentWaybillSkuFinished.value && !isCurrentPackageSubmitted.value) {
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        }
    }
};

const inputs = [numberInputRef, waybillInputRef, skuInputRef, materialInputRef];
const setupInputKeydownListeners = () => {
    inputs.forEach(ref => {
        nextTick(() => {
            const inputEl = ref.value?.$el?.querySelector('input');
            if (inputEl) {
                inputEl.addEventListener('keydown', handleKeyDown);
            }
        });
    });
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    setupInputKeydownListeners();
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    inputs.forEach(ref => {
        const inputEl = ref.value?.$el?.querySelector('input');
        if (inputEl) {
            inputEl.removeEventListener('keydown', handleKeyDown);
        }
    });
});
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
    gap: 4.9px;
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
    box-sizing: border-box;
}

.orderIdentifyForm {
    display: flex;
    align-items: center;
    width: 100%;
}

.progress-text {
    font-size: 13px;
    color: #606266;
    margin-top: 8px;
    margin-bottom: 6px;
}

.package-list-container {
    max-height: calc(100vh - 370px);
    overflow-y: auto;
    padding-right: 8px;
}

.package-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    transition: all 0.3s;
}

.matched-package {
    border-color: #ff7d00;
    box-shadow: 0 0 0 2px rgba(255, 125, 0, 0.1);
}

.completed-package {
    border-color: #52c41a;
    background-color: #f6ffed;
    opacity: 0.8;
}

.package-item:not(.matched-package):not(.completed-package):hover {
    border-color: #c0c4cc;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.package-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-weight: 500;
    padding-bottom: 8px;
    border-bottom: 1px dashed #e4e7ed;
}

.package-number {
    margin-right: 10px;
    font-weight: 600;
    color: #1f2329;
}

.waybill-number {
    margin-left: 50px;
    font-size: 14px;
    color: #606266;
}

.package-count {
    font-size: 14px;
    color: #606266;
    margin-left: 8px;
}

.table-section {
    margin-bottom: 15px;

    &:last-child {
        margin-bottom: 0;
    }
}

.table-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    margin-bottom: 8px;
    padding-left: 5px;
}

.submit-section {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.submit-btn {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 500;
}

.shortcut-tips-custom {
    margin-top: 15px;
    background: #333;
    color: #fff;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    .shortcut-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        border-bottom: 1px solid #555;
        padding-bottom: 6px;
    }

    .shortcut-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 6px;
            display: flex;
            align-items: center;

            .shortcut-key {
                display: inline-block;
                background: #555;
                color: #fff;
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 8px;
                font-size: 13px;
            }
        }
    }
}

:deep(.selected-order-row) {
    background-color: #e6f7ff !important;
}

.basic-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 15px;
    padding-top: 5px;
}

.info-item {
    display: flex;
    line-height: 1.8;
}

.info-label {
    flex: 0 0 100px;
    color: #606266;
    font-weight: 500;
}

.info-value {
    flex: 1;
    word-break: break-all;
    color: #303133;
}

:deep(.el-table__body .sku-matched-row) {
    background-color: #fff3cd !important;
}

:deep(.el-table__body .sku-finished-row) {
    background-color: #f0f9eb !important;
}

:deep(.el-table__body .material-matched-row) {
    background-color: #e6f7ff !important;
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
    margin-top: 8px;
    width: 100% !important;

    .el-form-item {
        margin-bottom: 15px;
    }

    .el-input,
    .el-select {
        width: 100%;
    }
}

:deep(.el-table) {
    font-size: 14px;
    margin-top: 8px;
    width: 100%;
}

:deep(.el-table__header th) {
    background-color: #f5f7fa;
    font-weight: 500;
}

:deep(.el-scrollbar__bar) {
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .el-scrollbar__thumb {
        background-color: rgba(0, 0, 0, 0.3);

        &:hover {
            background-color: rgba(0, 0, 0, 0.5);
        }
    }
}

@media (max-width: 1400px) {
    .leftPanel {
        width: 380px;
        flex: 0 0 380px;
    }

    .basic-info-grid {
        grid-template-columns: 1fr;
    }
}
</style>