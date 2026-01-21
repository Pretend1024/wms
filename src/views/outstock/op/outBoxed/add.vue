<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="wavePickContainer">
                <div class="leftPanel">
                    <h3><el-icon>
                            <Postcard />
                        </el-icon>
                        {{ $t('outstock_op_outBoxed_add.waveBasicInfo') }}</h3> <el-form :model="waveInfo"
                        label-width="80px" class="waveBasicForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.waveNo') + ':'"> <el-input
                                        v-model.trim="waveInfo.waveNo" @keyup.enter="loadWaveInfo" ref="waveNoRef"
                                        :placeholder="$t('outstock_op_outBoxed_add.inputWaveNoAndEnter')">
                                        <template #append>
                                            <el-button :icon="RefreshLeft" @click="resetWaveInfo" />
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.warehouse') + ':'"> <el-input
                                        v-model.trim="waveInfo.warehouse" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.shipper') + ':'"> <el-input
                                        v-model.trim="waveInfo.shipper" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.picker') + ':'"> <el-input
                                        v-model.trim="waveInfo.picker" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.orderCount') + ':'"> <el-input
                                        v-model.trim="waveInfo.orderCount" readonly />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('outstock_op_outBoxed_add.skuCount') + ':'"> <el-input
                                        v-model.trim="waveInfo.skuCount" readonly />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-divider />
                    <h3><el-icon>
                            <Edit />
                        </el-icon>{{ $t('outstock_op_outBoxed_add.pickOperationProcess') }}</h3> <el-form
                        label-width="80px" class="pickOpForm">
                        <el-form-item :label="$t('outstock_op_outBoxed_add.scanLocation') + ':'"> <el-input
                                v-model.trim="currentOp.locationCode" @keyup.enter="checkLocation" ref="locationRef"
                                :placeholder="$t('outstock_op_outBoxed_add.scanLocationAndEnter')" />
                        </el-form-item>
                        <el-form-item :label="$t('outstock_op_outBoxed_add.barcode') + ':'"> <el-input
                                v-model.trim="currentOp.barcode" @keyup.enter="checkBarcode" ref="barcodeRef"
                                :placeholder="$t('outstock_op_outBoxed_add.scanBarcodeAndEnter')" /> </el-form-item>
                        <el-form-item :label="$t('outstock_op_outBoxed_add.stockQty') + ':'"> <el-input
                                v-model.trim="currentOp.stockQty" readonly ref="stockQtyRef" />
                        </el-form-item>
                        <el-form-item :label="$t('outstock_op_outBoxed_add.pickQty') + ':'"> <el-input
                                v-model.trim="currentOp.pickQty" type="number" @keyup.enter="submitPick"
                                ref="pickQtyRef" :placeholder="$t('outstock_op_outBoxed_add.inputPickQtyAndEnter')" />
                        </el-form-item>
                    </el-form>
                    <el-divider />
                    <h3><el-icon>
                            <DocumentChecked />
                        </el-icon>{{ $t('outstock_op_outBoxed_add.operationRecords') }}</h3>
                    <div class="operationRecordTable">
                        <el-table :data="operationRecords" border style="width: 100%;" height="200">
                            <el-table-column show-overflow-tooltip prop="locationCode"
                                :label="$t('outstock_op_outBoxed_add.locationCode')" width="120" /> <el-table-column
                                show-overflow-tooltip prop="barcode"
                                :label="$t('outstock_op_outBoxed_add.productBarcode')" width="150" /> <el-table-column
                                prop="stockQty" :label="$t('outstock_op_outBoxed_add.stock')" width="80" />
                            <el-table-column prop="pickQty" :label="$t('outstock_op_outBoxed_add.pendingPickQty')"
                                width="85" />
                            <el-table-column show-overflow-tooltip prop="operateTime"
                                :label="$t('outstock_op_outBoxed_add.operateTime')" width="160" /> </el-table>
                    </div>
                </div>

                <div class="rightPanel">
                    <div class="waveHeaderInfo">
                        <span>{{ $t('outstock_op_outBoxed_add.waveNo') }}：{{ waveNo || '-' }}</span> <span>{{
                            $t('outstock_op_outBoxed_add.createTime') }}：{{ waveInfo.createTime || '-' }}</span>
                        <span>{{ $t('outstock_op_outBoxed_add.status') }}：{{ waveInfo.status || '-' }}</span>
                    </div>

                    <h3><el-icon>
                            <Checked />
                        </el-icon>{{ $t('outstock_op_outBoxed_add.wavePickList') }}</h3> <el-table
                        :data="wavePickDetails" border height="350" style="width: 100%; margin-bottom: 20px;"
                        :row-class-name="getRowClassName" ref="pickTableRef">
                        <el-table-column show-overflow-tooltip :label="$t('outstock_op_outBoxed_add.locationCode')"
                            width="140">
                            <template #default="scope">
                                <span v-html="highlightLocation(scope.row.locationCode)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('outstock_op_outBoxed_add.barcode')" width="140"> <template
                                #default="scope">
                                <span v-html="highlightSku(scope.row.skuBarcode)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="sku" :label="$t('outstock_op_outBoxed_add.sku')"
                            width="150" />
                        <el-table-column show-overflow-tooltip prop="skuName"
                            :label="$t('outstock_op_outBoxed_add.skuName')" width="180" /> <el-table-column
                            prop="pickQty" :label="$t('outstock_op_outBoxed_add.pendingPickQty')" width="83">
                            <template #default="{ row }">
                                <span>{{ row.pickQty - row.pickFinishedQty }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pickFinishedQty" :label="$t('outstock_op_outBoxed_add.pickedQty')"
                            width="84" />
                        <el-table-column prop="status" :label="$t('outstock_op_outBoxed_add.status')" width="85">
                            <template #default="{ row }">
                                <span :style="{ color: row.isFinished == 1 ? 'green' : 'red' }">{{ row.isFinished == 1 ?
                                    $t('outstock_op_outBoxed_add.completed') :
                                    $t('outstock_op_outBoxed_add.uncompleted') }}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                    <h3><el-icon>
                            <List />
                        </el-icon>{{ $t('outstock_op_outBoxed_add.orderDetails') }}</h3> <el-table
                        :data="flattenedOrderDetails" border height="300" style="width: 100%;"
                        :span-method="objectSpanMethod">
                        <el-table-column prop="orderNo" :label="$t('outstock_op_outBoxed_add.orderNo')" />
                        <el-table-column :label="$t('outstock_op_outBoxed_add.barcode')" width="220"> <template
                                #default="{ row }">
                                {{ row.barcode }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('outstock_op_outBoxed_add.sku')" width="160"> <template
                                #default="{ row }">
                                {{ row.sku }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('outstock_op_outBoxed_add.skuName')" width="180"
                            show-overflow-tooltip>
                            <template #default="{ row }">
                                {{ row.skuName }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('outstock_op_outBoxed_add.pickQuantity')" width="100">
                            <template #default="{ row }">
                                {{ row.pickQty || 0 }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="拣货">
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshLeft } from '@element-plus/icons-vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js';
import { getOutstockWaveByWaveNoApi, submitPickApi } from '@/api/outstockApi/op.js'

// 输入框ref声明
const waveNoRef = ref(null);
const locationRef = ref(null);
const barcodeRef = ref(null);
const stockQtyRef = ref(null);
const pickQtyRef = ref(null);
const pickTableRef = ref(null); // 拣货表格ref

// 波次基本信息
const waveInfo = reactive({
    waveId: '',
    waveNo: '',
    warehouse: '',
    shipper: '',
    picker: '',
    orderCount: '',
    skuCount: '',
    createTime: '',  // 创建时间
    status: ''       // 状态
});
// 当前波次
let waveNo = ref('');

// 当前操作数据：库位、条码、库存数量、拣货数量
const currentOp = reactive({
    locationCode: '',
    barcode: '',
    stockQty: '',
    pickQty: ''
});

// 波次拣货明细
const wavePickDetails = ref([]);
// 原始订单明细（嵌套结构）
const orderDetails = ref([]);
// 扁平化后的订单明细（用于表格渲染，解决嵌套问题）
const flattenedOrderDetails = computed(() => {
    let result = [];
    orderDetails.value.forEach(order => {
        // 遍历orderSkuItems，生成每行数据
        order.orderSkuItems.forEach(skuItem => {
            result.push({
                // 携带订单号（用于合并行）
                orderNo: order.orderNo,
                // 取自orderSkuItems的字段
                sku: skuItem.sku,
                skuName: skuItem.skuName,
                barcode: skuItem.barcode,
                // 待拣数量：假设接口返回字段为qty（可根据实际接口调整）
                pickQty: skuItem.qty || 0,
                // 已拣数量：初始为0，后续拣货时更新（可根据实际业务逻辑调整）
                pickFinishedQty: skuItem.pickFinishedQty || 0,
                // 保留原始skuItem数据（便于后续操作）
                rawSkuItem: skuItem
            });
        });
    });
    return result;
});

// 操作记录
const operationRecords = ref([]);

// 计算表格合并跨度（核心：合并相同orderNo的行）
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    // 只处理"订单号"列（columnIndex=0），其他列不合并
    if (columnIndex === 0) {
        const currentOrderNo = row.orderNo;
        let span = 1;
        let startRowIndex = rowIndex;

        // 向前查找：当前行是否与上一行orderNo相同，相同则当前行跨度为0（隐藏）
        if (rowIndex > 0) {
            const prevRow = flattenedOrderDetails.value[rowIndex - 1];
            if (prevRow.orderNo === currentOrderNo) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        }

        // 向后查找：统计当前orderNo共有多少行，确定第一行的跨度
        for (let i = rowIndex + 1; i < flattenedOrderDetails.value.length; i++) {
            const nextRow = flattenedOrderDetails.value[i];
            if (nextRow.orderNo === currentOrderNo) {
                span++;
            } else {
                break;
            }
        }

        // 返回第一行的跨度（向下合并span行）
        return {
            rowspan: span,
            colspan: 1
        };
    }
};

// 加载波次信息（预留接口位置）
const loadWaveInfo = async () => {
    if (!waveInfo.waveNo) return;
    try {
        const res = await getOutstockWaveByWaveNoApi({ waveNo: waveInfo.waveNo });
        console.log('loadWaveInfo res', res);
        if (!res.success) {
            smartAlert(res.msg, false)
            return;
        }
        // 接口数据赋值
        waveInfo.warehouse = res.data.warehouseCode;
        waveInfo.waveId = res.data.waveId;
        waveInfo.shipper = res.data.customerCode;
        waveInfo.picker = res.data.allocatedEmployeeName;
        waveInfo.orderCount = res.data.orderQty;
        waveInfo.skuCount = res.data.skuQty;
        waveInfo.createTime = res.data.createdTime;
        waveInfo.status = res.data.statusName;
        wavePickDetails.value = res.data.wavePickItems || [];
        // 原始订单明细（嵌套结构）
        orderDetails.value = res.data.orderItems || [];
        waveNo.value = waveInfo.waveNo;
        focusLocationInput();
    } catch (error) {
        console.error('loadWaveInfo error', error);
        smartAlert(error, false)
    }
};

// 检查库位（预留接口位置）
const checkLocation = async () => {
    if (!currentOp.locationCode) return;

    // 清除之前的高亮
    clearRowHighlight();

    // 查找匹配库位的记录
    const targetIndex = wavePickDetails.value.findIndex(item =>
        // 当返回值为 0 时，表示两个字符串在忽略大小写的情况下相等
        item.locationCode.localeCompare(currentOp.locationCode, undefined, { sensitivity: 'base' }) === 0
    );
    if (targetIndex > -1) {
        // 定位到匹配库位的第一行
        await scrollToRow(targetIndex);
        focusBarcodeInput();
    } else {
        // ElMessage.warning('库位不存在于当前波次中，请重新扫描');
        smartAlert('库位不存在于当前波次中，请重新扫描', true, 1000);
        currentOp.locationCode = '';
        focusLocationInput();
    }
};

// 检查条码（预留接口位置）
const checkBarcode = async () => {
    if (!currentOp.barcode) return;

    // 查找库位和商品都匹配的记录
    const targetIndex = wavePickDetails.value.findIndex(item =>
        item.locationCode.localeCompare(currentOp.locationCode, undefined, { sensitivity: 'base' }) === 0 &&
        item.skuBarcode.localeCompare(currentOp.barcode, undefined, { sensitivity: 'base' }) === 0
    );

    if (targetIndex > -1) {
        // 先清除之前的高亮
        clearRowHighlight();
        // 滚动到匹配行
        await scrollToRow(targetIndex);
        // 高亮整行（黄色背景）
        highlightMatchedRow(targetIndex);

        // 模拟库存（可根据实际接口调整字段）
        console.log('wavePickDetails.value[targetIndex]', wavePickDetails.value[targetIndex]);
        currentOp.stockQty = wavePickDetails.value[targetIndex].pickQty;
        currentOp.pickQty = wavePickDetails.value[targetIndex].pickQty;
        focusPickQtyInput();
    } else {
        // ElMessage.warning('商品条码在当前库位下不存在，请重新扫描');
        smartAlert('商品条码在当前库位下不存在，请重新扫描', true, 1000);
        currentOp.barcode = '';
        focusBarcodeInput();
    }
};

// 提交拣货（预留接口位置）- 新增：同步更新订单明细的已拣数量
// 提交拣货（根据后端状态码触发重置，仅更新波次拣货单数据）
const submitPick = async () => {
    // 1. 核心参数校验：确保所有必要数据合法
    if (!waveInfo.waveId) {
        // ElMessage.warning('波次信息未加载，请重新获取波次');
        smartAlert('波次信息未加载，请重新获取波次', true, 1000);
        return;
    }
    if (!currentOp.locationCode) {
        // ElMessage.warning('请先扫描库位');
        smartAlert('请先扫描库位', true, 1000);
        focusLocationInput();
        return;
    }
    if (!currentOp.barcode) {
        // ElMessage.warning('请先扫描SKU');
        smartAlert('请先扫描SKU', true, 1000);
        focusBarcodeInput();
        return;
    }

    const pickQty = Number(currentOp.pickQty);
    if (isNaN(pickQty) || pickQty <= 0) {
        // ElMessage.warning('请输入有效的拣货数量（大于0的数字）');
        smartAlert('请输入有效的拣货数量（大于0的数字）', true, 1000);
        focusPickQtyInput();
        return;
    }

    // 查找波次中对应的拣货记录（用于后续数据更新）
    const targetIndex = wavePickDetails.value.findIndex(item =>
        item.locationCode.toLowerCase() === currentOp.locationCode.toLowerCase() &&
        item.skuBarcode.toLowerCase() === currentOp.barcode.toLowerCase() // 注意：原代码用sku匹配，此处修正为skuBarcode（与条码扫描匹配）
    );
    if (targetIndex === -1) {
        // ElMessage.warning('当前库位+SKU组合不存在于波次中，请重新扫描');
        smartAlert('当前库位+SKU组合不存在于波次中，请重新扫描', true, 1000);
        resetBarcodeInfo();
        return;
    }
    const target = wavePickDetails.value[targetIndex];

    try {
        // 2. 调用提交拣货接口
        const res = await submitPickApi({
            waveId: waveInfo.waveId,
            locationCode: currentOp.locationCode.toUpperCase(),
            barcode: currentOp.barcode,
            outQuantity: pickQty
        });

        // 3. 接口调用成功：按后端状态码处理
        if (res.success) {
            // 获取后端返回的状态码（10=波次完成，20=库位完成，30=条码完成，50=未完成）
            const backendStatusCode = res.data;
            // 提示信息适配状态码
            const statusTips = {
                10: '波次拣货全部完成！',
                20: '当前库位拣货完成！',
                30: '当前SKU拣货完成！',
                50: '拣货提交成功'
            };
            smartAlert(statusTips[backendStatusCode], true, 1000)
            // ElMessage.success(statusTips[backendStatusCode] || '✅ 拣货提交成功');

            // 4. 仅更新波次拣货单数据（待拣数量、已拣数量、完成状态）
            // 计算新的已拣数量（不超过原始待拣数量）
            const newPickedQty = Math.min(target.pickFinishedQty + pickQty, target.pickQty);
            // 计算新的待拣数量（不小于0）
            // const newRemainingQty = Math.max(target.pickQty - newPickedQty, 0);
            // 更新目标行数据
            target.pickFinishedQty = newPickedQty;
            // target.pickQty = newRemainingQty;
            // 标记完成状态（待拣数量为0时设为完成）
            target.isFinished = target.pickQty - target.pickFinishedQty === 0 ? 1 : 0;

            // 5. 添加操作记录
            addOperationRecord({
                locationCode: currentOp.locationCode,
                barcode: currentOp.barcode,
                stockQty: currentOp.stockQty,
                pickQty: pickQty,
                operateTime: new Date().toLocaleString('zh-CN', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                })
            });

            // 6. 根据后端状态码执行重置和聚焦
            switch (backendStatusCode) {
                // 波次完成：清空所有信息，光标回波次号输入框
                case 10:
                    resetWaveInfo();
                    focusWaveNoInput();
                    break;
                // 库位完成：清空操作区（库位+条码+库存+拣货数），光标回库位输入框
                case 20:
                    resetLocationInfo(); // 原方法已清空locationCode及以下字段
                    focusLocationInput();
                    break;
                // 条码完成：清空条码+库存+拣货数，光标回条码输入框
                case 30:
                    resetBarcodeInfo(); // 原方法已清空barcode及以下字段
                    focusBarcodeInput();
                    break;
                // 未完成：仅清空当前拣货数量，光标保持在拣货数量框（便于连续拣货）
                case 50:
                    currentOp.pickQty = '';
                    focusPickQtyInput();
                    break;
                default:
                    currentOp.pickQty = '';
                    focusPickQtyInput();
            }

        } else {
            smartAlert(res.msg || '拣货提交失败，请重试', false);
        }

    } catch (error) {
        console.error('submitPick api error:', error);
        smartAlert('接口调用异常，请检查网络或联系管理员', false);
    }
};

// 添加操作记录
const addOperationRecord = (record) => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    operationRecords.value.unshift({
        operateTime: formattedTime,
        ...record
    });

    if (operationRecords.value.length > 20) {
        operationRecords.value.pop();
    }
};

// 正则特殊字符转义
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 高亮库位文本
function highlightLocation(text) {
    const kw = currentOp.locationCode?.trim()
    if (!kw) return text
    const reg = new RegExp(`(${escapeRegExp(kw)})`, 'ig')
    return text.replace(reg, '<span class="highlight-text">$1</span>')
}

// 高亮SKU文本
function highlightSku(text) {
    const kw = currentOp.barcode?.trim()
    if (!kw) return text
    const reg = new RegExp(`(${escapeRegExp(kw)})`, 'ig')
    return text.replace(reg, '<span class="highlight-text">$1</span>')
}

// 滚动到指定行
const scrollToRow = async (index) => {
    await nextTick()
    const table = pickTableRef.value
    if (table) {
        // 设置当前行并滚动到视图
        table.setCurrentRow(wavePickDetails.value[index])
        const rows = table.$el.querySelectorAll('.el-table__body tr')
        if (rows[index]) {
            rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }
}

// 高亮匹配的行（整行黄色）
const highlightMatchedRow = async (index) => {
    await nextTick()
    const table = pickTableRef.value
    if (table) {
        const rows = table.$el.querySelectorAll('.el-table__body tr')
        if (rows[index]) {
            rows[index].classList.add('highlight-row')
        }
    }
}

// 清除行高亮
const clearRowHighlight = async () => {
    await nextTick()
    const table = pickTableRef.value
    if (table) {
        const rows = table.$el.querySelectorAll('.el-table__body tr')
        rows.forEach(row => {
            row.classList.remove('highlight-row')
        })
    }
}

// 行类名方法（已完成行绿色）
const getRowClassName = ({ row }) => {
    return row.isFinished ? 'completed-row' : '';
};

// 聚焦方法
const focusWaveNoInput = () => {
    nextTick(() => {
        const elInput = waveNoRef.value?.$el?.querySelector('input');
        if (elInput) elInput.focus();
    });
};

const focusLocationInput = () => {
    nextTick(() => {
        const elInput = locationRef.value?.$el?.querySelector('input');
        if (elInput) elInput.focus();
    });
};

const focusBarcodeInput = () => {
    nextTick(() => {
        const elInput = barcodeRef.value?.$el?.querySelector('input');
        if (elInput) elInput.focus();
    });
};

const focusPickQtyInput = () => {
    nextTick(() => {
        const elInput = pickQtyRef.value?.$el?.querySelector('input');
        if (elInput) elInput.focus();
        // 如果输入框有值，则选中内容
        if (elInput.value.trim()) {
            elInput.select();
        }
    });
};

// 重置方法
const resetWaveInfo = () => {
    waveInfo.waveNo = '';
    waveInfo.warehouse = '';
    waveInfo.shipper = '';
    waveInfo.picker = '';
    waveInfo.orderCount = '';
    waveInfo.skuCount = '';
    waveInfo.createTime = '';
    waveInfo.status = '';
    waveNo.value = '';
    wavePickDetails.value = [];
    orderDetails.value = [];
    operationRecords.value = [];
    resetLocationInfo();
    clearRowHighlight();
};

const resetLocationInfo = () => {
    currentOp.locationCode = '';
    resetBarcodeInfo();
    clearRowHighlight();
};

const resetBarcodeInfo = () => {
    currentOp.barcode = '';
    currentOp.stockQty = '';
    currentOp.pickQty = '';
    clearRowHighlight();
};

// 初始化聚焦
onMounted(() => {
    focusWaveNoInput();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.contentDiv {
    padding: 0 !important;
}

.wavePickContainer {
    display: flex;
    gap: 15px;
    height: 100%;
    box-sizing: border-box;
    background-color: #f0f1f3;
    flex-shrink: 0;
}

.leftPanel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 420px;
    /* 优化：减小默认宽度 */
    flex: 0 0 420px;
    /* 优化：固定宽度，避免压缩 */
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    overflow-y: auto;

    .el-form {
        width: 100% !important;
        /* 优化：改为100%宽度，适应父容器 */
    }

    h3 {
        margin: 0 0 15px 0;
        color: #1f2329;
        font-size: 18px;
        font-weight: 800;
        display: flex;
        align-items: center;

        .el-icon {
            margin-right: 6px;
            color: #409eff;
            font-size: 22px;
        }
    }

    .operationRecordTable {
        min-height: 200px;
    }
}

.rightPanel {
    flex: 1;
    /* 优化：自动占据剩余空间 */
    min-width: 0;
    /* 优化：防止flex子元素内容（如表格）溢出容器 */
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;

    h3 {
        margin: 0 0 15px 0;
        color: #1f2329;
        font-size: 18px;
        font-weight: 800;
        display: flex;
        align-items: center;

        .el-icon {
            margin-right: 6px;
            color: #409eff;
            font-size: 22px;
        }
    }
}

.waveBasicForm,
.pickOpForm {
    margin-bottom: 10px;
}

// 波次信息头部样式
.waveHeaderInfo {
    text-align: center;
    padding: 12px 0;
    background-color: #409eff;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 16px;

    span {
        margin: 0 10px;
        color: #fff;
        font-weight: 600;

        &:not(:last-child) {
            border-right: 1px solid #e5e6eb;
            padding-right: 10px;
        }
    }
}

// 文本高亮样式（库位和商品文本）
:deep(.highlight-text) {
    background: #ffe58f;
    color: #333;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
}

// 整行高亮样式（库位和商品都匹配时）
:deep(.el-table__body .highlight-row) {
    background-color: #ffe58f !important;
}

// 已完成行样式
:deep(.el-table__body .completed-row) {
    background-color: #c2f9c2 !important;
}

// 表格合并行样式优化（避免边框断裂）
:deep(.el-table__cell) {
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__header .el-table__cell) {
    border-bottom: 1px solid #ebeef5;
}

h3 {
    margin: 0 0 15px 0;
    color: #1f2329;
    font-size: 16px;
    font-weight: 500;
}

// 表格样式
:deep(.el-table) {
    font-size: 14px;
}

:deep(.el-table__header th) {
    background-color: #f5f7fa;
    font-weight: 500;
}

:deep(.el-divider--horizontal) {
    margin: 0;
}

// 响应式处理：屏幕宽度小于1100px时，改为上下布局
@media (max-width: 1100px) {
    .wavePickContainer {
        flex-direction: column;
        /* 改为垂直布局 */
        overflow-y: auto;
        /* 允许容器滚动 */
    }

    .leftPanel {
        width: 100%;
        /* 占满宽度 */
        flex: none;
        max-height: none;
    }

    .rightPanel {
        width: 100%;
        /* 占满宽度 */
        flex: none;
        height: auto;
    }
}
</style>