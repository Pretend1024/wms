<template>
    <div class="viewArea">
        <div class="contentDiv">
            <!-- 左右分栏布局 -->
            <div class="layout">
                <!-- 左侧操作区域 -->
                <div class="leftPanel">
                    <!-- 1. 订单识别区域 -->
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
                                @keydown.enter.prevent.stop="getOrderInfo()" ref="numberInputRef"
                                placeholder="输入出库单号/运单号后回车" :disabled="orderFormDisabled">
                                <template #append>
                                    <el-button :icon="RefreshLeft" @click="resetWaveInfo" />
                                </template>
                            </el-input>
                        </div>
                    </div>

                    <!-- 2. 运单扫描区域 -->
                    <div class="module waybillScanModule">
                        <h3>
                            <el-icon>
                                <Ticket />
                            </el-icon>运单扫描
                        </h3>
                        <el-form label-width="80px" class="waybillForm">
                            <el-form-item label="运单号:">
                                <el-input v-model.trim="waybillData.number" @keydown.enter.prevent.stop="matchWaybill"
                                    ref="waybillInputRef" :disabled="!orderInfoLoaded || waybillDisabled"
                                    placeholder="扫描运单号后回车" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 3. 商品扫描区域 -->
                    <div class="module skuScanModule">
                        <h3>
                            <el-icon>
                                <Goods />
                            </el-icon>商品扫描
                        </h3>
                        <el-form label-width="80px" class="skuForm">
                            <el-form-item label="商品条码:">
                                <el-input v-model.trim="skuData.barcode" @keydown.enter.prevent.stop="matchSku"
                                    ref="skuInputRef"
                                    :disabled="!currentWaybillMatched || currentWaybillSkuFinished || allSkuFinished"
                                    placeholder="扫描商品条码后回车" />
                                <!-- 进度显示 -->
                                <div class="progress-text" v-if="currentSkuTotal > 0">
                                    当前进度: {{ currentSkuProgress }}/{{ currentSkuTotal }}
                                </div>
                                <div class="progress-text" v-else>
                                    当前进度: 请先匹配运单号
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 4. 耗材扫描区域 -->
                    <div class="module materialScanModule">
                        <h3>
                            <el-icon>
                                <Crop />
                            </el-icon>耗材扫描
                        </h3>
                        <el-form label-width="80px" class="materialForm">
                            <el-form-item label="耗材条码:">
                                <el-input v-model.trim="materialData.barcode"
                                    @keydown.enter.prevent.stop="matchMaterial" ref="materialInputRef"
                                    :disabled="!currentWaybillSkuFinished" @focus="checkAllSkuFinished"
                                    placeholder="扫描耗材条码后回车" />
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 提交复核 -->
                    <div class="submit-section">
                        <el-button type="success" icon="Check" @click="submitReview" :disabled="!isReviewComplete"
                            class="submit-btn">
                            提交复核 (Ctrl+Enter)
                        </el-button>
                    </div>

                    <!-- 自定义快捷键说明 -->
                    <div class="shortcut-tips-custom">
                        <div class="shortcut-title">快捷键说明</div>
                        <ul class="shortcut-list">
                            <li><span class="shortcut-key">Ctrl+1</span> - 聚焦订单号输入框</li>
                            <li><span class="shortcut-key">Ctrl+2</span> - 聚焦运单号输入框</li>
                            <li><span class="shortcut-key">Ctrl+3</span> - 聚焦商品条码输入框</li>
                            <li><span class="shortcut-key">Ctrl+4</span> - 聚焦耗材条码输入框</li>
                            <li><span class="shortcut-key">Ctrl+Enter</span> - 提交复核</li>
                        </ul>
                    </div>
                </div>

                <!-- 右侧信息展示区域 -->
                <div class="rightPanel">
                    <!-- 订单基本信息 -->
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
                                <span class="info-label">客户代码:</span>
                                <span class="info-value">{{ orderBasicInfo.customerCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">物流渠道:</span>
                                <span class="info-value">{{ orderBasicInfo.shipwayCode || '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">复核开始时间:</span>
                                <span class="info-value">{{ orderBasicInfo.startTime || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 包裹列表 -->
                    <div class="module packageListModule">
                        <h3>
                            <el-icon>
                                <Box />
                            </el-icon>包裹列表
                            <span class="package-count">{{ packageList.length }}个包裹</span>
                        </h3>
                        <div class="package-list-container">
                            <div v-for="(packageItem, packageIndex) in packageList" :key="packageItem.waybillId"
                                class="package-item" :class="{
                                    'matched-package': packageItem.isMatched,
                                    'completed-package': packageItem.isCompleted && !packageItem.isMatched
                                }">
                                <div class="package-header">
                                    <span class="package-number">包裹 {{ packageIndex + 1 }}</span>
                                    <span class="waybill-number">运单号: {{ formatWaybillNo(packageItem.trackingNo)
                                        }}</span>
                                </div>

                                <!-- 商品列表 -->
                                <div class="table-section">
                                    <div class="table-title">商品信息</div>
                                    <el-table :data="packageItem.orderSkuItems" border style="width: 100%;"
                                        :row-class-name="getSkuRowClassName">
                                        <el-table-column prop="barcode" label="商品条码" width="180" />
                                        <el-table-column prop="skuName" label="品名" show-overflow-tooltip width="200" />
                                        <el-table-column prop="qty" label="拣货数量" width="100" />
                                        <el-table-column prop="reviewedQty" label="已复核数量" width="100" />
                                        <el-table-column label="状态" width="100">
                                            <template #default="scope">
                                                <span v-if="scope.row.reviewedQty >= scope.row.qty"
                                                    style="color: green;">完成</span>
                                                <span v-else style="color: gray;">进行中</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>

                                <!-- 耗材列表 -->
                                <div class="table-section">
                                    <div class="table-title">耗材信息</div>
                                    <el-table :data="packageItem.consumableList" border style="width: 100%;"
                                        :row-class-name="getMaterialRowClassName">
                                        <el-table-column prop="consumablesBarcode" label="耗材条码" width="180" />
                                        <el-table-column prop="consumablesName" label="耗材名称" show-overflow-tooltip
                                            width="200" />
                                        <el-table-column prop="quantity" label="数量" width="100" />
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 订单选择弹窗 -->
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

<script setup name="复核">
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { ElTag, ElInput, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElMessage, ElLoading, ElDialog } from 'element-plus';
import { Document, Ticket, Goods, Crop, Box, InfoFilled, Check, RefreshLeft } from '@element-plus/icons-vue';
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

// 计算属性：所有包裹商品是否都已完成
const allSkuFinished = computed(() => {
    return packageList.value.every(pkg => {
        return pkg.orderSkuItems.every(sku => (sku.reviewedQty || 0) >= (sku.qty || 0));
    });
});

// 计算属性：是否可以提交复核
const isReviewComplete = computed(() => {
    if (!orderInfoLoaded.value) return false;

    // 检查所有包裹的商品是否完成
    return packageList.value.every(pkg => {
        const skuAllFinished = pkg.orderSkuItems.every(sku => sku.reviewedQty >= sku.qty);
        return skuAllFinished;
    });
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

// 获取订单信息 - 先调用新接口getOutOrderByCodeApi
const getOrderInfo = async (forceOrderId = '') => {
    // 如果有强制传入的订单ID，则直接使用它调用详情接口
    if (forceOrderId) {
        return fetchOrderDetails(forceOrderId);
    }

    // 否则先调用搜索接口
    const codeToUse = orderData.code.trim();
    if (!codeToUse) return;

    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        // 先调用新接口搜索订单
        const searchRes = await getOutOrderByCodeApi({
            code: codeToUse,
            codeType: orderData.codeType
        });

        if (!searchRes.success) {
            playAudio('error');
            smartAlert(searchRes.msg || '搜索订单失败', false);
            return;
        }

        // 检查返回的订单列表
        const orderListData = searchRes.data || [];

        if (orderListData.length === 1) {
            // 只有一条数据，直接使用其ID获取详情
            const orderId = orderListData[0].id;
            if (orderId) {
                await fetchOrderDetails(orderId);
            } else {
                playAudio('error');
                smartAlert('获取订单ID失败', false);
            }
        } else if (orderListData.length > 1) {
            // 多条数据，显示选择弹窗
            tempOrderData.value = { ...orderData };
            orderList.value = orderListData;
            selectedOrderId.value = '';
            orderSelectDialogVisible.value = true;
            playAudio('error');
        } else {
            // 没有找到数据
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
                isCompleted: false,
                orderSkuItems: (pkg.orderSkuItems || []).map(sku => ({
                    ...sku,
                    reviewedQty: 0
                })),
                consumableList: [],
                originalConsumableList: []
            }));

            orderInfoLoaded.value = true;
            orderFormDisabled.value = true;
            playAudio('ok');
            console.log('订单信息加载成功:', orderData);
            if(orderData.codeType === '1'){
                waybillData.number = orderData.code; 
                matchWaybill();
            }
            ElMessage.success('订单信息加载成功');

            // 聚焦运单号输入框
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

// 处理订单选择表格行点击
const handleOrderRowClick = (row) => {
    selectedOrderId.value = row.id;
};

// 获取选中订单行的样式
const getSelectedOrderRowClass = ({ row }) => {
    return row.id === selectedOrderId.value ? 'selected-order-row' : '';
};

// 确认选择的订单
const confirmSelectedOrder = () => {
    if (!selectedOrderId.value) return;

    // 关闭弹窗
    orderSelectDialogVisible.value = false;

    // 根据选中的订单ID获取详情
    getOrderInfo(selectedOrderId.value);
};

// 匹配运单 - 不区分大小写
const matchWaybill = () => {
    if (!waybillData.number.trim() || !orderInfoLoaded.value) return;

    const inputWaybill = waybillData.number.trim();
    // 使用正则表达式进行不区分大小写匹配
    const matchedPackage = packageList.value.find(pkg =>
        new RegExp(`^${pkg.trackingNo}$`, 'i').test(inputWaybill)
    );

    if (matchedPackage) {
        // 重置之前匹配的包裹状态
        packageList.value.forEach(pkg => {
            pkg.isMatched = false;
        });

        // 设置当前匹配的包裹
        matchedPackage.isMatched = true;
        currentWaybillMatched.value = true;
        // 匹配到运单后禁用运单号输入框
        waybillDisabled.value = true;
        playAudio('ok');

        // 计算当前商品进度
        currentSkuTotal.value = matchedPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.qty || 0), 0);
        currentSkuProgress.value = matchedPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.reviewedQty || 0), 0);

        // 检查是否所有商品已复核完成
        const pkgSkuFinished = matchedPackage.orderSkuItems.every(sku => (sku.reviewedQty || 0) >= (sku.qty || 0));
        currentWaybillSkuFinished.value = pkgSkuFinished;

        if (pkgSkuFinished) {
            // 标记包裹为已完成
            matchedPackage.isCompleted = true;
            ElMessage.success('该包裹所有商品已复核完成，请继续处理耗材');
            // 聚焦耗材条码输入框
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        }

        // 清空运单号输入框
        waybillData.number = '';

        // 聚焦商品条码输入框
        nextTick(() => skuInputRef.value?.$el?.querySelector('input')?.focus());
    } else {
        playAudio('error');
        smartAlert('运单号匹配失败，请检查输入', false);
        waybillData.number = '';
    }
};

// 匹配商品 - 不区分大小写
const matchSku = async () => {
    if (!skuData.barcode.trim() || !currentWaybillMatched.value) return;

    // 找到当前匹配的包裹
    const currentPackage = packageList.value.find(pkg => pkg.isMatched);
    if (!currentPackage) return;

    const inputBarcode = skuData.barcode.trim();
    // 使用正则表达式进行不区分大小写匹配
    const matchedSku = currentPackage.orderSkuItems.find(sku =>
        new RegExp(`^${sku.barcode}$`, 'i').test(inputBarcode)
    );

    if (matchedSku) {
        // 检查是否已达到拣货数量
        if ((matchedSku.reviewedQty || 0) < (matchedSku.qty || 0)) {
            matchedSku.reviewedQty = (matchedSku.reviewedQty || 0) + 1;
            playAudio('ok');
        } else {
            playAudio('error');
            smartAlert('该商品已完成复核，数量已达上限', false);
            skuData.barcode = '';
            return;
        }

        // 更新进度
        currentSkuProgress.value = currentPackage.orderSkuItems.reduce((sum, sku) => sum + (sku.reviewedQty || 0), 0);

        // 检查是否所有商品已复核完成
        const pkgSkuFinished = currentPackage.orderSkuItems.every(sku => (sku.reviewedQty || 0) >= (sku.qty || 0));
        currentWaybillSkuFinished.value = pkgSkuFinished;

        if (pkgSkuFinished) {
            // 标记包裹为已完成
            currentPackage.isCompleted = true;
            // 商品复核完成后启用运单号输入框
            waybillDisabled.value = false;
            ElMessage.success('该包裹所有商品已复核完成，请继续处理耗材或扫描下一运单');
            // 聚焦耗材条码输入框
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        }

        skuData.barcode = '';
    } else {
        playAudio('error');
        smartAlert('商品条码匹配失败，请检查输入', false);
        skuData.barcode = '';
    }
};

// 聚焦耗材时检查所有商品是否完成，若完成则禁用运单号输入框
const checkAllSkuFinished = () => {
    if (allSkuFinished.value) {
        waybillDisabled.value = true;
    }
};

// 匹配耗材
const matchMaterial = async () => {
    if (!materialData.barcode.trim() || !currentWaybillSkuFinished.value) return;

    const currentPackage = packageList.value.find(pkg => pkg.isMatched);
    if (!currentPackage) return;

    try {
        // 调用耗材库存检查接口
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

        // 构建耗材数据
        const newMaterial = {
            consumablesCode: materialInfo.consumablesCode,
            consumablesName: materialInfo.consumablesName || `耗材${materialData.barcode.slice(-4)}`,
            consumablesBarcode: materialInfo.consumablesBarcode || materialData.barcode.trim(),
            quantity: 1
        };

        // 检查是否已存在该耗材
        const existingMaterialIndex = currentPackage.consumableList.findIndex(
            mat => new RegExp(`^${mat.consumablesBarcode}$`, 'i').test(newMaterial.consumablesBarcode)
        );

        if (existingMaterialIndex > -1) {
            // 已存在则数量+1
            currentPackage.consumableList[existingMaterialIndex].quantity += 1;
        } else {
            // 不存在则新增
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

// 商品行样式
const getSkuRowClassName = ({ row }) => {
    if ((row.reviewedQty || 0) >= (row.qty || 0)) return 'sku-finished-row';
    if ((row.reviewedQty || 0) > 0) return 'sku-matched-row';
    return '';
};

// 耗材行样式
const getMaterialRowClassName = ({ row }) => {
    return row.quantity > 0 ? 'material-matched-row' : '';
};

// 提交复核
const submitReview = async () => {
    if (!isReviewComplete.value) {
        smartAlert('复核未完成，请检查所有包裹的商品和耗材', false);
        return;
    }

    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    console.log(packageList.value);
    try {
        // 收集所有包裹的耗材信息（注意：这里修正了原代码中waybillId和trackingNo未定义的问题，应从pkg中获取）
        const allConsumables = [];
        packageList.value.forEach(pkg => {
            const consumables = pkg.consumableList.length > 0
                ? pkg.consumableList
                : pkg.originalConsumableList;

            allConsumables.push(...consumables.map(mat => ({
                consumablesCode: mat.consumablesCode,
                consumablesName: mat.consumablesName,
                consumablesBarcode: mat.consumablesBarcode,
                quantity: mat.quantity,
                waybillId: pkg.waybillId || '', // 从当前包裹pkg中获取waybillId
                trackingNo: pkg.trackingNo || ''  // 从当前包裹pkg中获取trackingNo
            })));
        });

        // 调用提交复核接口
        const res = await submitReCheckApi({
            outOrderId: orderBasicInfo.orderId,
            customerId: orderBasicInfo.customerId,
            warehouseCode: orderBasicInfo.warehouseCode,
            consumableList: allConsumables,
        });

        if (res.success) {
            playAudio('ok');
            ElMessage.success('复核提交成功');
            resetPage();
        } else {
            playAudio('error');
            smartAlert(res.msg || '复核提交失败', false);
        }
    } catch (error) {
        playAudio('error');
        console.error('提交复核异常:', error);
        // 修改错误提示，包含具体错误信息
        smartAlert(`提交复核异常: ${error.message || '未知错误'}，请重试`, false);
    } finally {
        loading.close();
    }
};

// 重置页面
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
    // 清空订单基本信息
    Object.keys(orderBasicInfo).forEach(key => {
        orderBasicInfo[key] = '';
    });

    // 聚焦到初始输入框
    nextTick(() => numberInputRef.value?.$el?.querySelector('input')?.focus());
};

// 快捷键处理
const handleKeyDown = (e) => {
    // 无论当前聚焦元素是什么，优先处理Ctrl+Enter提交
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault(); // 阻止默认行为（如输入框换行）
        e.stopPropagation(); // 阻止事件冒泡
        submitReview();
        return; // 处理后直接返回，避免其他逻辑干扰
    }

    // Ctrl+1: 聚焦单号输入框
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        nextTick(() => numberInputRef.value?.$el?.querySelector('input')?.focus());
    }
    // Ctrl+2: 聚焦运单号输入框
    else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        if (orderInfoLoaded.value && !waybillDisabled.value) {
            nextTick(() => waybillInputRef.value?.$el?.querySelector('input')?.focus());
        } else {
            smartAlert(waybillDisabled.value ? '当前包裹商品尚未完成复核，运单号输入框已禁用' : '请先加载订单信息', false);
        }
    }
    // Ctrl+3: 聚焦商品条码输入框
    else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        if (currentWaybillMatched.value && !currentWaybillSkuFinished.value && !allSkuFinished.value) {
            nextTick(() => skuInputRef.value?.$el?.querySelector('input')?.focus());
        } else {
            smartAlert(allSkuFinished.value ? '所有商品已完成复核' : '请先匹配运单号或完成当前商品复核', false);
        }
    }
    // Ctrl+4: 聚焦耗材条码输入框
    else if (e.ctrlKey && e.key === '4') {
        e.preventDefault();
        if (currentWaybillSkuFinished.value) {
            nextTick(() => materialInputRef.value?.$el?.querySelector('input')?.focus());
        } else {
            smartAlert('请先完成商品复核', false);
        }
    }
};

// 为所有输入框添加独立的keydown监听（确保在输入框聚焦时也能捕获快捷键）
const inputs = [
    numberInputRef,
    waybillInputRef,
    skuInputRef,
    materialInputRef
];
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

    // 移除输入框的事件监听
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

// 当前匹配的包裹显示橙色边框
.matched-package {
    border-color: #ff7d00;
    box-shadow: 0 0 0 2px rgba(255, 125, 0, 0.1);
}

// 已完成的包裹显示绿色边框
.completed-package {
    border-color: #52c41a;
    box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
}

// 只有未匹配且未完成的包裹才有悬停效果
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
    margin-left: auto;
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

// 自定义快捷键说明样式
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

// 订单选择表格样式
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