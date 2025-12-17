<template>
    <div class="viewArea">
        <div class="contentDiv">
            <!-- 上部区域：左侧三模块 + 右侧播种墙 -->
            <div class="topSection">
                <!-- 左侧固定模块：宽度调整为450px -->
                <div class="leftFixedPanel">
                    <!-- 1. 波次信息查询 -->
                    <div class="module waveInfoModule">
                        <h3><el-icon>
                                <Postcard />
                            </el-icon>{{ $t('outstock_op_outShipped_add.waveInfoQuery') }}</h3> <!-- 波次信息查询 -->
                        <el-form :model="waveInfo" label-width="80px" class="waveSearchForm">
                            <!-- 新增分拣类型下拉框 -->
                            <el-form-item :label="$t('outstock_op_outShipped_add.sortingMethod') + ':'"> <!-- 分拣方式 -->
                                <el-select v-model="pickType"
                                    :placeholder="$t('outstock_op_outShipped_add.selectSortingMethod')"
                                    :disabled="waveInfo.waveId !== ''"> <!-- 选择分拣方式 -->
                                    <el-option :label="$t('outstock_op_outShipped_add.byOrder')" value="0" />
                                    <!-- 按照订单 -->
                                    <el-option :label="$t('outstock_op_outShipped_add.byPackage')" value="1" />
                                    <!-- 按照包裹 -->
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('outstock_op_outShipped_add.waveNo') + ':'"> <!-- 波次号 -->
                                <el-input v-model.trim="waveInfo.waveNo" @keyup.enter="loadWaveInfo" ref="waveNoRef"
                                    :placeholder="$t('outstock_op_outShipped_add.inputWaveNoAndEnter')">
                                    <!-- 输入波次号后回车 -->
                                    <template #append>
                                        <el-button :icon="RefreshLeft" @click="resetWaveInfo" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('outstock_op_outShipped_add.waveType') + ':'"> <!-- 波次类型 -->
                                <el-input v-model.trim="waveInfo.waveTypeName" readonly />
                            </el-form-item>
                            <el-form-item :label="$t('outstock_op_outShipped_add.totalOrders') + ':'"> <!-- 订单总数 -->
                                <el-input v-model.trim="waveInfo.orderQty" readonly />
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 2. 商品分拣操作 -->
                    <div class="module barcodeOperateModule">
                        <h3><el-icon>
                                <EditPen />
                            </el-icon>{{ $t('outstock_op_outShipped_add.productSortingOperation') }}</h3>
                        <!-- 商品分拣操作 -->
                        <el-form label-width="80px" class="barcodeForm">
                            <el-form-item :label="$t('outstock_op_outShipped_add.productBarcode') + ':'"> <!-- 商品条码 -->
                                <el-input v-model.trim="currentOp.barcode" @keydown.enter.prevent="submitBarcodeMatch"
                                    ref="barcodeRef"
                                    :placeholder="$t('outstock_op_outShipped_add.scanProductBarcodeAndEnter')"
                                    :disabled="barcodeDisabled" @focus="handleBarcodeFocus" /> <!-- 扫描商品条码后回车 -->
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 3. 订单附件打印：新增下拉框+自动打印复选框 -->
                    <div class="module attachmentModule">
                        <h3>
                            <el-icon>
                                <Folder />
                            </el-icon>
                            {{ $t('outstock_op_outShipped_add.orderAttachmentPrint') }} <!-- 订单附件打印 -->
                            <!-- 显示当前附件所属订单号，仅在有附件时显示 -->
                            <template v-if="attachmentList.length > 0">
                                <span class="attachment-order-info">
                                    ({{ currentAttachmentOrderNo }})
                                </span>
                            </template>
                        </h3>
                        <!-- 附件表格 -->
                        <el-table :data="attachmentList" border style="width: 100%;" height="250">
                            <el-table-column prop="fileType" :label="$t('outstock_op_outShipped_add.fileType')"
                                width="100" /> <!-- 文件类型 -->
                            <el-table-column prop="fileName" :label="$t('outstock_op_outShipped_add.fileName')"
                                show-overflow-tooltip />
                            <!-- 文件名称 -->
                            <el-table-column :label="$t('outstock_op_outShipped_add.operation')" width="105">
                                <!-- 操作 -->
                                <template #default="scope">
                                    <!-- 打印按钮在左侧 -->
                                    <el-button type="text" @click="printAttachment(scope.row)"
                                        :disabled="!isPrintableFile(scope.row.fileName)" style="margin-right: 8px;">
                                        {{ $t('outstock_op_outShipped_add.print') }} <!-- 打印 -->
                                    </el-button>
                                    <!-- 下载按钮在右侧 -->
                                    <el-button type="text" @click="handleFileAction(scope.row)">
                                        {{ $t('outstock_op_outShipped_add.download') }} <!-- 下载 -->
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 新增：打印机选择 + 自动打印复选框 -->
                        <div class="attachmentOperate">
                            <el-select v-model="selectedPrinter"
                                :placeholder="$t('outstock_op_outShipped_add.selectPrinter')" style="width: 220px;">
                                <!-- 选择打印机 -->
                                <el-option v-for="printer in printers" :key="printer" :label="printer"
                                    :value="printer" />
                            </el-select>
                            <el-checkbox v-model="autoPrint" :label="$t('outstock_op_outShipped_add.autoPrint')"
                                style="margin-left: 16px;" /> <!-- 自动打印 -->
                        </div>
                    </div>
                </div>

                <!-- 右侧播种墙 -->
                <div class="rightSeedingWallPanel">
                    <h3><el-icon>
                            <Grid />
                        </el-icon>{{ $t('outstock_op_outShipped_add.seedingWall') }}</h3> <!-- 播种墙 -->
                    <div class="seedingWallContainer">
                        <div v-for="item in seedingWallData" :key="item.orderIndex" :class="[
                            'seedingWallItem',
                            item.isMatched ? 'matched' : '',
                            item.isFinished ? 'finished' : ''
                        ]" @click="getOrderAttachment(item.orderId)">
                            <div class="orderIndex">{{ item.orderIndex }}</div>
                            <div class="orderMain">
                                <!-- 订单号过长时优先显示后面的信息 -->
                                <div class="orderNo" :title="item.orderNo">{{ formatOrderNo(item.orderNo) }}</div>
                                <div class="trackingNo" :title="item.trackingNo" v-if="pickType == '1'">{{
                                    formatOrderNo(item.trackingNo) }}
                                </div>
                                <div class="finishCount">{{ item.finishedQty }}/{{ item.totalQty }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <el-divider />

            <!-- 下部商品明细 -->
            <div class="bottomSection">
                <h3><el-icon>
                        <List />
                    </el-icon>{{ $t('outstock_op_outShipped_add.waveProductDetails') }}</h3> <!-- 波次商品明细 -->
                <el-table :data="skuItemsData" border style="width: 100%;" :row-class-name="getSkuRowClassName">
                    <el-table-column prop="skuBarcode" :label="$t('outstock_op_outShipped_add.productBarcode')"
                        width="280" />
                    <!-- 商品条码 -->
                    <el-table-column prop="skuName" :label="$t('outstock_op_outShipped_add.productName')"
                        show-overflow-tooltip width="280" /> <!-- 商品名称 -->
                    <el-table-column prop="qty" :label="$t('outstock_op_outShipped_add.totalQuantity')" width="100" />
                    <!-- 总数量 -->
                    <el-table-column :label="$t('outstock_op_outShipped_add.outboundOrder')" width="280"> <!-- 出库订单 -->
                        <template #default="scope">
                            <div v-for="order in scope.row.allocateOutOrder" :key="order">{{ order }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup name="二次分拣">
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { ElLoading, ElSelect, ElOption, ElCheckbox, ElMessage } from 'element-plus';
import { RefreshLeft, Postcard, Grid, EditPen, Folder, List } from '@element-plus/icons-vue';
import { smartAlert } from '@/utils/genericMethods.js';
import { getWaveOrderProductDetailsApi, getAllUploadFilesApi, submitRePickApi } from '@/api/outstockApi/op.js'

import printJS from 'print-js';
import 'print-js/dist/print.css';

import okAudio from '@/assets/audio/ok.wav';
import errorAudio from '@/assets/audio/error.wav';
import audio0 from '@/assets/audio/0.wav';
import audio1 from '@/assets/audio/1.wav';
import audio2 from '@/assets/audio/2.wav';
import audio3 from '@/assets/audio/3.wav';
import audio4 from '@/assets/audio/4.wav';
import audio5 from '@/assets/audio/5.wav';
import audio6 from '@/assets/audio/6.wav';
import audio7 from '@/assets/audio/7.wav';
import audio8 from '@/assets/audio/8.wav';
import audio9 from '@/assets/audio/9.wav';
import audio10 from '@/assets/audio/10.wav';

const audioFiles = ref({
    ok: new Audio(okAudio),
    error: new Audio(errorAudio),
    0: new Audio(audio0),
    1: new Audio(audio1),
    2: new Audio(audio2),
    3: new Audio(audio3),
    4: new Audio(audio4),
    5: new Audio(audio5),
    6: new Audio(audio6),
    7: new Audio(audio7),
    8: new Audio(audio8),
    9: new Audio(audio9),
    10: new Audio(audio10)
});

// 播放音频函数
const playAudio = (audioKey) => {
    const audio = audioFiles.value[audioKey];
    if (!audio) {
        console.warn(`未找到音频文件: ${audioKey}.wav`); // 明确提示哪个文件缺失
        return;
    }

    // 停止当前可能正在播放的音频
    audioFiles.value[audioKey].pause();
    audioFiles.value[audioKey].currentTime = 0;

    // 播放音频
    try {
        audioFiles.value[audioKey].play().catch(error => {
            console.warn('音频播放失败:', error);
        });
    } catch (error) {
        console.warn('音频播放异常:', error);
    }
};

// 按顺序播放多个音频
const playAudiosInSequence = (audioKeys, index = 0) => {
    if (index >= audioKeys.length) return;

    const currentKey = audioKeys[index];
    if (!audioFiles.value[currentKey]) {
        // 如果当前音频不存在，继续播放下一个
        playAudiosInSequence(audioKeys, index + 1);
        return;
    }

    // 播放当前音频
    playAudio(currentKey);

    // 当前音频播放结束后，播放下一个
    audioFiles.value[currentKey].onended = () => {
        playAudiosInSequence(audioKeys, index + 1);
    };
};

// 将数字转换为音频键数组（例如21 -> [2, 10, 1]）
const numberToAudioKeys = (number) => {
    if (number < 1 || number > 99) return [];

    // 个位数
    if (number < 10) {
        return [number];
    }

    const tens = Math.floor(number / 10); // 十位
    const ones = number % 10;             // 个位

    const keys = [];

    if (tens === 1) {
        // 10~19
        keys.push(10);
    } else {
        // 20~99
        keys.push(tens);
        keys.push(10);
    }

    if (ones > 0) {
        keys.push(ones);
    }

    return keys;
};

// 新增分拣类型变量，默认0（按照订单）
const pickType = ref('0');
// 标记提示框是否正在显示
const isAlertShowing = ref(false);

// 输入框引用
const waveNoRef = ref(null);
const barcodeRef = ref(null);

// 波次信息
const waveInfo = reactive({
    waveId: '',
    waveNo: '',
    waveTypeName: '',
    orderQty: 0,
    orderItems: [] // 订单列表（含商品明细+已拣数量记录）
});

// 当前操作数据
const currentOp = reactive({
    barcode: '' // 商品条码输入
});

// 核心数据
const seedingWallData = ref([]);    // 播种墙格子数据（finishedQty/总数量）
const skuItemsData = ref([]);       // 商品明细数据（matchedCount/总数量）
const attachmentList = ref([]);     // 附件列表
const currentAttachmentOrderNo = ref(''); // 当前附件所属订单号
const timeRecord = reactive({
    pickStartTime: null,
    pickEndTime: null
});

// 附件打印相关配置
const selectedPrinter = ref(''); // 选中的打印机
const autoPrint = ref(true); // 自动打印开关，默认选中
const printers = ref([]); // 打印机列表
let socket = null; // WebSocket连接
const printedOrders = ref([]); // 已打印的订单ID，避免重复打印

// 页面初始化：聚焦波次号输入框并初始化WebSocket
onMounted(() => {
    focusWaveNoInput();
    initWebSocket();
});

// 页面卸载时关闭WebSocket连接
onUnmounted(() => {
    if (socket) {
        socket.close();
    }
});

// 初始化WebSocket连接
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//localhost:19090/print`; // WebSocket打印服务地址

    socket = new WebSocket(url);

    socket.onopen = function () {
        console.log('WebSocket 连接已建立');
        socket.send('getPrinters'); // 获取打印机列表
    };

    socket.onmessage = function (event) {
        const message = event.data;
        if (message.startsWith('printers:')) {
            // 处理打印机列表
            const printerList = message.split(':')[1].split(',');
            printers.value = printerList;
            if (printerList.length > 0 && !selectedPrinter.value) {
                selectedPrinter.value = printerList[0]; // 默认选择第一个打印机
            }
        } else {
            console.log(`服务端响应: ${message}`);
            ElMessage({
                message: `打印状态: ${message}`,
                type: message.includes('成功') ? 'success' : 'info'
            });
        }
    };

    socket.onclose = function (event) {
        console.log(`WebSocket 连接已关闭(状态码: ${event.code})`);
        if (event.code !== 1000) { // 排除正常关闭（1000）的情况
            ElMessage.error('打印机连接已断开，如需使用请刷新页面重试');
        }
    };

    socket.onerror = function (error) {
        console.error(`WebSocket 错误: ${error.message || '未知错误'}`);
        ElMessage.error(`打印机连接失败: ${error.message || '未知错误'}`);
        // 主动关闭失败的连接，避免资源占用
        if (socket.readyState !== WebSocket.CLOSED) {
            socket.close();
        }
    };
}

// 时间格式化函数：将ISO时间转换为xxxx-xx-xx xx:xx:xx格式
const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 新增：格式化订单号，过长时优先显示后面的信息
const formatOrderNo = (orderNo) => {
    if (!orderNo) return '';
    // 订单号长度超过12位时，只显示最后10位，并在前面加省略号
    if (orderNo.length > 12) {
        return `...${orderNo.slice(-10)}`;
    }
    return orderNo;
};

// 加载波次信息（用pickFinishedQty作总数量，新增currentPicked记录已拣）
const loadWaveInfo = async () => {
    if (isAlertShowing.value) {
        isAlertShowing.value = false;
        return
    }; // 避免重复提示
    if (!waveInfo.waveNo.trim()) return;

    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        // 传递波次号和分拣类型
        const res = await getWaveOrderProductDetailsApi({
            waveNo: waveInfo.waveNo.trim(),
            pickType: pickType.value
        });
        if (res.success && res.data) {
            // 播放成功音频
            playAudio('ok');

            const waveData = res.data;
            // 1. 填充波次基础信息
            waveInfo.waveId = waveData.waveId || '';
            waveInfo.waveTypeName = waveData.waveTypeName || '-';
            waveInfo.orderQty = waveData.orderQty || 0;

            // 2. 处理订单商品：新增currentPicked（已拣数量，初始0），用pickFinishedQty作总数量
            waveInfo.orderItems = (waveData.orderItems || []).map(order => ({
                ...order,
                orderId: order.orderId || '',
                waybillId: order.waybillId || '',
                trackingNo: order.trackingNo || '',
                orderSkuItems: (order.orderSkuItems || []).map(sku => ({
                    ...sku,
                    currentPicked: 0, // 新增：记录当前已拣数量，初始为0
                    totalQty: sku.pickFinishedQty ?? 0 // 核心：pickFinishedQty作为总数量（X）
                }))
            }));

            // 3. 记录拣货开始时间
            timeRecord.pickStartTime = new Date();

            // 4. 初始化播种墙（总数量=订单下所有商品totalQty求和）
            seedingWallData.value = waveInfo.orderItems
                .filter(item => item.orderIndex !== undefined)
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(order => {
                    const totalQty = (order.orderSkuItems || []).reduce(
                        (sum, sku) => sum + sku.totalQty, 0 // 总数量=各商品totalQty之和
                    );
                    return {
                        orderIndex: order.orderIndex,
                        orderNo: order.orderNo || '',
                        orderId: order.orderId || '',         // 用于按订单模式匹配
                        waybillId: order.waybillId || '',   // 用于按包裹模式匹配
                        trackingNo: order.trackingNo || '', // 保存包裹号，用于包裹模式
                        totalQty: totalQty, // 播种墙显示的“X”
                        finishedQty: 0, // 播种墙显示的“0”（初始已拣为0）
                        isMatched: false,
                        isFinished: false
                    };
                });

            // 5. 初始化商品明细（总数量=pickFinishedQty，已拣数初始0，状态初始false）
            skuItemsData.value = (waveData.skuItems || []).map(sku => ({
                ...sku,
                isMatched: false, // 初始无橙色标记
                isFinished: false, // 初始无绿色标记
                matchedCount: 0 // 商品已拣数量（初始0）
            }));

            // 6. 重置已打印订单记录
            printedOrders.value = [];
            // 7. 重置附件相关信息
            attachmentList.value = [];
            currentAttachmentOrderNo.value = '';

            // 8. 聚焦条码输入框
            resetBarcodeInput();
            focusBarcodeInput();
        } else {
            // 播放失败音频
            playAudio('error');
            smartAlert(res.msg || '波次信息获取失败', false);
            isAlertShowing.value = true;
        }
    } catch (error) {
        // 播放失败音频
        playAudio('error');
        console.error('加载波次信息异常:', error);
        smartAlert('接口调用失败，请检查网络', false);
        isAlertShowing.value = true;
    } finally {
        loading.close();
    }
};

// 提交条码匹配
const submitBarcodeMatch = async () => {
    const inputBarcode = currentOp.barcode.trim();
    if (!inputBarcode) return;
    console.log('当前输入条码:', inputBarcode);

    if (seedingWallData.value.length === 0) {
        smartAlert('请先加载波次信息', true);
        focusWaveNoInput();
        return;
    }

    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        // 1. 清空所有行状态（播种墙+商品明细），确保仅当前匹配行有颜色
        seedingWallData.value.forEach(item => {
            item.isMatched = false;
        });
        // 新逻辑：仅清空橙色，保留绿色
        skuItemsData.value.forEach(sku => {
            sku.isMatched = false; // 橙色标记清空
        });

        // 2. 执行条码匹配
        const matchResult = caseInsensitiveBarcodeMatch(inputBarcode);

        if (matchResult.success) {
            const { orderNo, skuBarcode, orderId, waybillId } = matchResult.data;

            // ======= 新增：根据分拣方式选择匹配键（orderId 或 waybillId） =======
            const matchKey = pickType.value === '1' ? 'waybillId' : 'orderId';
            // 优先使用对应 id（waybillId 或 orderId），若不存在则回退到另一个 id，最后回退到 orderNo（兼容旧逻辑）
            let idToMatch;
            if (matchKey === 'waybillId') {
                idToMatch = waybillId || orderId || orderNo;
            } else {
                idToMatch = orderId || waybillId || orderNo;
            }
            // =================================================================================

            // 3. 更新播种墙：重新计算订单总已拣数量
            const targetWallItem = seedingWallData.value.find(item => {
                // 如果格子上存在对应的 key（orderId 或 waybillId），优先按该 key 匹配
                if (item[matchKey]) {
                    return item[matchKey] === idToMatch;
                }
                // 否则回退到 orderNo 匹配（兼容旧数据）
                return item.orderNo === orderNo;
            });

            const targetOrder = waveInfo.orderItems.find(item => {
                if (item[matchKey]) {
                    return item[matchKey] === idToMatch;
                }
                return item.orderNo === orderNo;
            });

            if (targetWallItem && targetOrder) {
                // 播放格子下标音频
                const audioKeys = numberToAudioKeys(targetWallItem.orderIndex);
                playAudiosInSequence(audioKeys);

                const orderTotalPicked = targetOrder.orderSkuItems.reduce(
                    (sum, sku) => sum + sku.currentPicked, 0
                );
                targetWallItem.finishedQty = orderTotalPicked;
                targetWallItem.isMatched = true; // 播种墙当前匹配行显橙色

                // 检查订单是否刚刚完成（从非完成状态变为完成状态）
                const wasFinished = targetWallItem.isFinished;
                targetWallItem.isFinished = orderTotalPicked >= targetWallItem.totalQty; // 完成显绿色

                // 订单完成且是刚刚完成的状态变化，才加载附件并可能打印
                if (targetWallItem.isFinished && !wasFinished) {
                    // 附件请求仍使用 orderId（后端通常以 orderId 获取附件）
                    await getOrderAttachment(targetOrder.orderId);

                    // 只有勾选自动打印且未打印过该订单，才打印所有附件
                    if (autoPrint.value && !printedOrders.value.includes(targetOrder.orderId)) {
                        // 记录已打印的订单ID，避免重复打印
                        printedOrders.value.push(targetOrder.orderId);
                        // 打印所有附件
                        printAllAttachments();
                    }
                }
            } else {
                // 未找到对应格子：记录日志以便排查（不影响后续商品行标记逻辑）
                console.warn('未找到播种墙条目：', { matchKey, idToMatch, orderNo });
            }

            // 4. 标记当前匹配的商品行（橙色/绿色）
            const targetSku = skuItemsData.value.find(item => item.skuBarcode === skuBarcode);
            if (targetSku) {
                // 关键修复：累加所有订单中该商品的已拣数量（解决多订单共享商品的完成状态判断）
                const totalPicked = waveInfo.orderItems.reduce((sum, order) => {
                    const skuInOrder = order.orderSkuItems.find(sku => sku.barcode === skuBarcode);
                    return sum + (skuInOrder?.currentPicked || 0);
                }, 0);

                targetSku.matchedCount = totalPicked; // 用总已拣数量更新
                targetSku.isMatched = true;
                // 当总已拣数量 >= 商品总需求数量时，标记为完成（绿色）
                targetSku.isFinished = targetSku.matchedCount >= targetSku.qty;
            }

            // 5. 检查所有订单是否完成
            const allFinished = seedingWallData.value.every(item => item.isFinished);
            if (allFinished) {
                timeRecord.pickEndTime = new Date();
                await submitFinalRePick();
                // 提交完成后重置除播种墙外的内容并聚焦波次号输入框
                resetExceptSeedingWall();
                focusWaveNoInput()
            } else {
                resetBarcodeInput();
                focusBarcodeInput();
            }
        } else {
            // 匹配失败，播放错误音频
            playAudio('error');
            smartAlert(matchResult.msg || '未匹配到商品条码，请重新扫描', false);
            resetBarcodeInput();
            focusBarcodeInput();
        }
    } catch (error) {
        // 匹配异常，播放错误音频
        playAudio('error');
        console.error('条码匹配异常:', error);
        smartAlert('匹配处理失败，请重试', false);
        resetBarcodeInput();
        focusBarcodeInput();
    } finally {
        loading.close();
    }
};


// 修正：严格按订单索引和商品索引升序匹配条码
const caseInsensitiveBarcodeMatch = (inputBarcode) => {
    const barcodeReg = new RegExp(`^${inputBarcode}$`, 'i');

    // 1. 确保订单列表按 orderIndex 升序（避免原始数据顺序错误）
    const sortedOrders = [...waveInfo.orderItems].sort((a, b) => a.orderIndex - b.orderIndex);

    // 2. 按排序后的订单顺序遍历（从第一个订单开始）
    for (let orderIndex = 0; orderIndex < sortedOrders.length; orderIndex++) {
        const order = sortedOrders[orderIndex];
        if (!order.orderSkuItems || order.orderSkuItems.length === 0) continue;

        // 3. 按商品索引升序遍历（从订单内第一个商品开始）
        for (let skuIndex = 0; skuIndex < order.orderSkuItems.length; skuIndex++) {
            const sku = order.orderSkuItems[skuIndex];
            if (!sku.barcode || sku.totalQty <= 0) continue;

            // 条码匹配且未拣满：优先匹配当前顺序的商品
            if (barcodeReg.test(sku.barcode) && sku.currentPicked < sku.totalQty) {
                sku.currentPicked += 1;
                return {
                    success: true,
                    data: {
                        orderNo: order.orderNo,
                        skuBarcode: sku.barcode,
                        orderId: order.orderId || '',       // 返回 orderId（可能为空，但通常接口已提供）
                        waybillId: order.waybillId || ''  // 返回 waybillId（按包裹模式使用）
                    }
                };
            }

            // 条码匹配但已拣满：继续检查下一个顺序的商品（不中断遍历）
            if (barcodeReg.test(sku.barcode) && sku.currentPicked >= sku.totalQty) {
                continue;
            }
        }
    }

    // 遍历完所有顺序商品后仍无匹配
    return {
        success: false,
        msg: `未匹配到商品条码【${inputBarcode}】，或所有该条码商品已拣满`
    };
};


// 判断文件是否可打印（PDF或图片）
const isPrintableFile = (fileName) => {
    if (!fileName) return false;
    const lowerFileName = fileName.toLowerCase();
    return lowerFileName.endsWith('.pdf') ||
        isImageFile(fileName);
};

// 判断是否为PDF文件
const isPdfFile = (fileName) => {
    if (!fileName) return false;
    return fileName.toLowerCase().endsWith('.pdf');
};

// 判断是否为图片文件
const isImageFile = (fileName) => {
    if (!fileName) return false;
    const lowerFileName = fileName.toLowerCase();
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/.test(lowerFileName);
};

// 处理文件操作：PDF和图片在新标签页打开，其他文件直接下载
const handleFileAction = (file) => {
    if (!file.fileUrl) {
        smartAlert('无文件地址', false);
        return;
    }

    // 加时间戳避免缓存
    const urlWithTimestamp = `${file.fileUrl}?t=${new Date().getTime()}`;

    if (isPdfFile(file.fileName) || isImageFile(file.fileName)) {
        // PDF和图片在新标签页打开，不在当前页面显示
        window.open(urlWithTimestamp, '_blank');
    } else {
        // 其他文件直接下载（通过a标签，不会在当前页面显示）
        const downloadLink = document.createElement('a');
        downloadLink.href = urlWithTimestamp;
        // 设置下载文件名
        if (file.fileName) downloadLink.download = file.fileName;
        // 模拟点击并移除元素
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
};

// 打印所有附件
const printAllAttachments = () => {
    if (!selectedPrinter.value) {
        ElMessage.warning('请先选择打印机');
        return;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        ElMessage.error('打印机连接未建立，请稍候重试');
        return;
    }

    if (attachmentList.value.length === 0) {
        ElMessage.info('没有附件需要打印');
        return;
    }

    // 筛选出可打印的文件
    const printableFiles = attachmentList.value.filter(file => isPrintableFile(file.fileName));

    if (printableFiles.length === 0) {
        ElMessage.info('没有可打印的附件（仅支持PDF和图片）');
        return;
    }

    // 逐个打印所有可打印附件（添加延迟避免请求密集）
    printableFiles.forEach((file, index) => {
        setTimeout(() => {
            if (file.fileUrl) {
                const message = `${file.fileUrl};${selectedPrinter.value}`;
                socket.send(message);
                console.log(`已发送打印请求: ${message}`);
            }
        }, index * 300);
    });
};

// 打印单个附件
// const printAttachment = (file) => {
//     // 非可打印文件直接返回
//     if (!isPrintableFile(file.fileName)) {
//         ElMessage.warning('仅支持PDF和图片文件打印');
//         return;
//     }

//     // 清理残留的打印容器和样式，避免叠加
//     const existingPrintContainer = document.querySelector('.print-container');
//     const existingPrintStyle = document.querySelector('style[media="print"]');
//     if (existingPrintContainer) document.body.removeChild(existingPrintContainer);
//     if (existingPrintStyle) document.head.removeChild(existingPrintStyle);

//     if (!file.fileUrl) {
//         smartAlert('无附件下载/打印地址', false);
//         return;
//     }

//     const fileUrl = file.fileUrl.toLowerCase();
//     const isImage = isImageFile(file.fileName);
//     const isPdf = isPdfFile(file.fileName);

//     // 以下为PDF/图片的打印逻辑
//     const printContainer = document.createElement('div');
//     printContainer.className = 'print-container';
//     printContainer.style.position = 'fixed';
//     printContainer.style.left = '-9999px';
//     printContainer.style.top = '100';
//     printContainer.style.width = '100%';
//     printContainer.style.maxWidth = '790px';
//     document.body.appendChild(printContainer);

//     let contentElement;
//     if (isImage) {
//         contentElement = document.createElement('img');
//         contentElement.src = `${file.fileUrl}?t=${new Date().getTime()}`; // 禁用缓存
//         contentElement.style.maxWidth = '100%';
//         contentElement.style.maxHeight = '100vh';
//         contentElement.style.margin = '0 auto';
//         contentElement.alt = file.fileName || '打印图片';
//     } else if (isPdf) {
//         contentElement = document.createElement('iframe');
//         // 加时间戳避免缓存，确保加载最新PDF
//         contentElement.src = `${file.fileUrl}?t=${new Date().getTime()}`;
//         contentElement.style.width = '100%';
//         contentElement.style.height = '95vh';
//         contentElement.style.border = 'none';
//         contentElement.style.margin = '0';
//     }

//     printContainer.appendChild(contentElement);

//     // 强化打印样式，确保仅显示文件内容
//     const printStyle = document.createElement('style');
//     printStyle.setAttribute('media', 'print');
//     printStyle.textContent = `
//     @media print {
//       body > *:not(.print-container) { display: none !important; }
//       .print-container {
//         position: static !important;
//         left: 0 !important;
//         top: 200 !important;
//         width: 100% !important;
//         height: 93% !important;
//         margin: 0 !important;
//         padding: 0 !important;
//       }
//       @page {
//         margin: 0;
//         size: A4;
//       }
//       html, body {
//         margin: 0 !important;
//         padding: 0 !important;
//         width: 100% !important;
//         height: 100% !important;
//          zoom: 100% !important; 
//          transform: scale(1) !important; 
//         transform-origin: center !important; 
//       }
//       .print-container img, .print-container iframe {
//         display: block !important;
//         width: 100% !important;
//         height: 100% !important;
//         border: none !important;
//       }
//     }
//   `;
//     document.head.appendChild(printStyle);

//     // 等待内容加载（优化PDF渲染时机）
//     const waitForLoad = () => {
//         return new Promise((resolve, reject) => {
//             if (isImage) {
//                 const checkImageLoaded = () => {
//                     if (contentElement.naturalWidth > 0) resolve('image-loaded');
//                     else reject(new Error('图片加载失败'));
//                 };
//                 contentElement.onload = checkImageLoaded;
//                 contentElement.onerror = () => reject(new Error('图片加载出错'));
//                 setTimeout(() => reject(new Error('图片加载超时')), 10000);
//             } else if (isPdf) {
//                 let loadTriggered = false;
//                 // 监听iframe加载完成（PDF渲染可能滞后，增加延迟确认）
//                 contentElement.onload = () => {
//                     if (!loadTriggered) {
//                         loadTriggered = true;
//                         // 延迟500ms确保PDF渲染完成（关键优化）
//                         setTimeout(() => resolve('pdf-loaded'), 500);
//                     }
//                 };
//                 contentElement.onerror = () => {
//                     if (!loadTriggered) {
//                         loadTriggered = true;
//                         reject(new Error('PDF加载出错（可能跨域）'));
//                     }
//                 };
//                 // 延长超时时间到20秒，给大型PDF足够加载时间
//                 setTimeout(() => {
//                     if (!loadTriggered) {
//                         loadTriggered = true;
//                         resolve('pdf-timeout');
//                     }
//                 }, 20000);
//             }
//         });
//     };

//     // 执行打印
//     waitForLoad()
//         .then(() => {
//             // 统一使用window.print()，减少浏览器差异（关键优化）
//             window.print();
//             // ElMessage.success(`已触发打印：${file.fileName || '未知文件'}`);
//         })
//         .catch((error) => {
//             smartAlert(`打印失败：${error.message}`, false);
//         })
//         .finally(() => {
//             const cleanUp = () => {
//                 document.body.removeChild(printContainer);
//                 document.head.removeChild(printStyle);
//                 window.removeEventListener('afterprint', cleanUp);
//             };
//             window.addEventListener('afterprint', cleanUp);
//             setTimeout(cleanUp, 3000);
//         });
// };
const printAttachment = (file) => {
    if (!file.fileUrl) {
        smartAlert('无附件地址', false);
        return;
    }

    // 加时间戳
    const url = `${file.fileUrl}?t=${new Date().getTime()}`;
    const isPdf = isPdfFile(file.fileName);
    const isImage = isImageFile(file.fileName);

    if (isPdf) {
        // 打印 PDF
        printJS({
            printable: url,
            type: 'pdf',
            showModal: true, // 可选：显示加载中遮罩
            modalMessage: '正在准备打印文件...',
            onError: (err) => {
                console.error(err);
                ElMessage.error('打印失败，请检查文件地址或跨域设置');
            }
        });
    } else if (isImage) {
        // 打印图片
        printJS({
            printable: url,
            type: 'image',
            header: null, // 图片顶部不显示标题
            imageStyle: 'width:100%;', // 强制图片宽度自适应纸张
            showModal: true,
            modalMessage: '正在加载图片...',
            onError: (err) => {
                ElMessage.error('图片加载失败');
            }
        });
    } else {
        ElMessage.warning('仅支持PDF和图片打印');
    }
};

// 除播种墙外的内容重置
const resetExceptSeedingWall = () => {
    // 保留播种墙数据，重置其他数据
    waveInfo.waveNo = '';
    waveInfo.waveId = '';
    waveInfo.waveTypeName = '';
    waveInfo.orderQty = 0;
    waveInfo.orderItems = [];
    skuItemsData.value = [];
    attachmentList.value = [];
    currentAttachmentOrderNo.value = '';
    printedOrders.value = [];
    resetBarcodeInput();
    // 重置时间记录
    timeRecord.pickStartTime = null;
    timeRecord.pickEndTime = null;
};

// 条码输入框聚焦时检查波次号
const handleBarcodeFocus = () => {
    // 检查波次号是否为空（去除首尾空格后判断）
    if (!waveInfo.waveNo.trim()) {
        // 延迟聚焦波次号（确保当前输入框失焦后再聚焦，避免冲突）
        setTimeout(() => {
            focusWaveNoInput();
        }, 100);
    }
};

// 提交拣货完成信息
const submitFinalRePick = async () => {
    if (!waveInfo.waveId || !timeRecord.pickStartTime) return;
    try {
        // 使用格式化后的时间提交
        const res = await submitRePickApi({
            waveId: waveInfo.waveId,
            pickStartTime: formatDateTime(timeRecord.pickStartTime),
            pickEndTime: formatDateTime(timeRecord.pickEndTime)
        });
        smartAlert(res.msg, res.success, 1000);
    } catch (error) {
        console.error('提交完成信息失败:', error);
        smartAlert('提交完成信息失败', false);
    }
};

// 获取订单附件
const getOrderAttachment = async (orderId) => {
    if (!orderId) return;
    const loading = ElLoading.service({ lock: true, text: 'loading...' });
    try {
        const res = await getAllUploadFilesApi({ outOrderId: orderId });
        attachmentList.value = res.success ? res.data.uploadFile.map(file => ({
            fileType: file.fileType || '未知',
            fileName: file.fileName || '未命名',
            fileUrl: file.filePath || ''
        })) : [];

        // 记录当前附件所属订单号
        const currentOrder = waveInfo.orderItems.find(item => item.orderId === orderId);
        currentAttachmentOrderNo.value = currentOrder ? currentOrder.orderNo : '';
    } catch (error) {
        console.error('获取附件失败:', error);
        smartAlert('加载附件失败', false);
    } finally {
        loading.close();
    }
};

// 重置波次信息（包括播种墙）
const resetWaveInfo = () => {
    waveInfo.waveNo = '';
    waveInfo.waveId = '';
    waveInfo.waveTypeName = '';
    waveInfo.orderQty = 0;
    waveInfo.orderItems = [];
    seedingWallData.value = []; // 清空播种墙
    skuItemsData.value = [];
    attachmentList.value = [];
    currentAttachmentOrderNo.value = '';
    printedOrders.value = [];
    resetBarcodeInput();
    focusWaveNoInput();
};

// 重置条码输入框
const resetBarcodeInput = () => {
    currentOp.barcode = '';
};

// 聚焦波次号输入框
const focusWaveNoInput = () => {
    nextTick(() => waveNoRef.value?.$el?.querySelector('input')?.focus());
};

// 聚焦条码输入框
const focusBarcodeInput = () => {
    nextTick(() => barcodeRef.value?.$el?.querySelector('input')?.focus());
};

// 商品明细行样式
const getSkuRowClassName = ({ row }) => {
    if (row.isFinished) return 'sku-finished-row';
    if (row.isMatched) return 'sku-matched-row';
    return '';
};
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.topSection {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    align-items: stretch;
}

/* 左侧固定面板：宽度调整为450px */
.leftFixedPanel {
    width: 450px;
    flex: 0 0 450px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.module {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
}

/* 附件订单信息样式 */
.attachment-order-info {
    font-size: 14px;
    font-weight: normal;
    color: #606266;
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    display: inline-block;
}

/* 附件操作区样式 */
.attachmentOperate {
    display: flex;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
}

.rightSeedingWallPanel {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.seedingWallContainer {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px;
    background-color: #f9fafc;
    border-radius: 4px;
    max-height: 100%;
    overflow-y: auto;
    align-content: flex-start;
}

.seedingWallItem {
    position: relative;
    min-width: 100px;
    max-width: 150px;
    height: 100px;
    flex: 1 0 auto;
    border: 2px solid #dcdfe6;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    box-sizing: border-box;

    .orderIndex {
        position: absolute;
        top: 8px;
        left: 8px;
        font-size: 12px;
        color: #909399;
    }

    .orderMain {
        text-align: center;
        width: 100%;
    }

    .orderNo {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
    }

    .trackingNo {
        font-size: 12px;
        color: #606266;
        white-space: nowrap;
        overflow: hidden;

    }

    .finishCount {
        font-size: 16px;
        font-weight: 600;
        color: #409eff;
    }
}

/* 匹配状态：橙色边框+文字 */
.seedingWallItem.matched {
    border-color: #f7ba1e;

    .finishCount {
        color: #f7ba1e;
    }
}

/* 完成状态：绿色边框+文字（覆盖匹配状态） */
.seedingWallItem.finished {
    border-color: #67c23a;

    .finishCount {
        color: #67c23a;
    }
}

.bottomSection {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
}

/* 商品明细行颜色 */
:deep(.el-table__body .sku-matched-row) {
    background-color: #fff3cd !important;
}

:deep(.el-table__body .sku-finished-row) {
    background-color: #f0f9eb !important;
}

h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
    display: flex;
    align-items: center;

    .el-icon {
        margin-right: 8px;
        color: #409eff;
    }
}

.waveSearchForm,
.barcodeForm {
    margin-top: 8px;
    width: 100% !important;

    .el-form-item {
        margin-bottom: 12px;
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

/* 适配下拉框和复选框样式 */
:deep(.el-select),
:deep(.el-checkbox) {
    font-size: 14px;
}

/* 禁用状态的打印按钮样式 */
:deep(.el-button.is-disabled.is-text) {
    color: #c0c4cc !important;
    cursor: not-allowed !important;
}

/* 操作列按钮间距 */
:deep(.el-table .cell .el-button) {
    margin: 0 4px;
}

@media (max-width: 768px) {
    .topSection {
        flex-direction: column;
    }

    .leftFixedPanel {
        width: 100%;
        flex: none;
    }

    .attachment-order-info {
        max-width: 150px;
    }

    .attachmentOperate {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    :deep(.el-select) {
        width: 100% !important;
    }
}
</style>