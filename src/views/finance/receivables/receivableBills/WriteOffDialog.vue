<template>
    <el-dialog v-model="visible" title="账单核销" width="900px" align-center destroy-on-close :close-on-click-modal="false">
        <div v-loading="loading" class="pay-dialog-content">
            <div class="section-title">
                待核销账单信息
                <span v-if="summaryData.totalUnwrittenOffAmountSum"
                    style="font-size: 12px; color: #666; font-weight: normal; margin-left: 10px;">
                    (合计待核销: <span style="color: red; font-weight: bold">{{ summaryData.totalUnwrittenOffAmountSum
                        }}</span> {{
                            currentCurrency }})
                </span>
            </div>
            <el-table :data="billList" border style="width: 100%; margin-bottom: 20px" max-height="200" show-summary
                :summary-method="getBillSummary">
                <el-table-column prop="billNo" label="账单编号" width="180" show-overflow-tooltip />
                <el-table-column prop="customerCode" label="客户" width="150" show-overflow-tooltip />
                <el-table-column prop="currency" label="币种" width="80" />
                <el-table-column prop="totalFeeAmount" label="总金额" width="120" />
                <el-table-column prop="writtenOffAmount" label="已核销金额" width="120" />
                <el-table-column prop="unwrittenOffAmount" label="待核销金额" width="120">
                    <template #default="{ row }">
                        <span style="color: red; font-weight: bold">{{ row.unwrittenOffAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            </el-table>

            <div class="section-title">选择充值账户余额 ({{ currentCurrency }})</div>
            <el-table :data="rechargeList" border style="width: 100%; margin-bottom: 20px" max-height="200"
                @row-click="handleRechargeRowClick" highlight-current-row>
                <el-table-column width="48" align="center">
                    <template #default="{ row }">
                        <el-radio v-model="selectedRechargeId" :label="row.id"><span></span></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="customerCode" label="客户" width="150" show-overflow-tooltip />
                <el-table-column prop="currency" label="币种" width="80" />
                <el-table-column prop="payAmount" label="充值金额" width="120" />
                <el-table-column prop="usedAmount" label="已用金额" width="120" />
                <el-table-column prop="remainingAmount" label="可用余额" width="120">
                    <template #default="{ row }">
                        <span style="color: green; font-weight: bold">{{ row.remainingAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            </el-table>

            <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="核销金额" prop="writtenOffAmount">
                            <el-input v-model="formData.writtenOffAmount" v-number="3" placeholder="请输入核销金额">
                                <template #append>{{ currentCurrency }}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="核销备注" prop="remark">
                            <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="submitting">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getWriteOffBillListByIdApi,
    getRechargeByCustomerCodeAndCurrencyApi,
    writeOffBillByIdApi
} from '@/api/financeApi/receivables.js';
import { smartAlert } from '@/utils/genericMethods.js';

const emit = defineEmits(['success']);

const visible = ref(false);
const loading = ref(false);
const submitting = ref(false);
const formRef = ref(null);

// 数据源
const billList = ref([]);
const summaryData = ref({});
const rechargeList = ref([]);
const currentCurrency = ref('');
const targetBillIds = ref([]);

// 表单与选中项
const selectedRechargeId = ref(null);
const formData = reactive({
    writtenOffAmount: '',
    remark: ''
});

const rules = {
    writtenOffAmount: [
        { required: true, message: '请输入核销金额', trigger: 'blur' }
    ]
};

/**
 * 打开弹窗方法
 * 功能：初始化数据，调用接口获取账单列表并校验一致性，成功后获取对应客户币种的充值记录
 * @param {Array} ids 选中的账单ID数组
 */
const open = async (ids) => {
    visible.value = true;
    loading.value = true;
    // 重置页面数据
    billList.value = [];
    summaryData.value = {};
    rechargeList.value = [];
    selectedRechargeId.value = null;
    formData.writtenOffAmount = '';
    formData.remark = '';
    currentCurrency.value = '';
    targetBillIds.value = ids;

    try {
        // 1. 获取账单列表
        const res = await getWriteOffBillListByIdApi(ids);

        if (!res.success) {
            smartAlert(res.msg || '账单校验失败', false);
            visible.value = false;
            return;
        }

        billList.value = res.data.billList || [];
        summaryData.value = res.data;

        if (billList.value.length === 0) {
            ElMessage.warning('未获取到有效的账单信息');
            visible.value = false;
            return;
        }

        const sampleBill = billList.value[0];
        currentCurrency.value = sampleBill.currency;

        // 设置默认核销金额为接口返回的合计待核销金额
        formData.writtenOffAmount = res.data.totalUnwrittenOffAmountSum || null;

        // 2. 获取充值记录
        const rechargeRes = await getRechargeByCustomerCodeAndCurrencyApi({
            customerCode: sampleBill.customerCode,
            currency: sampleBill.currency
        });

        if (rechargeRes.success) {
            rechargeList.value = rechargeRes.data || [];
        }

    } catch (error) {
        console.error('初始化核销信息异常:', error);
        smartAlert('网络异常，无法获取核销信息', false);
        visible.value = false;
    } finally {
        loading.value = false;
    }
};

//充值记录行点击事件
const handleRechargeRowClick = (row) => {
    selectedRechargeId.value = row.id;
};

/**
 * 账单列表底部合计方法
 * 功能：计算账单列表底部的“总金额”、“已核销金额”和“待核销金额”
 */
const getBillSummary = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        // 第一列显示文本
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        // 仅统计指定的三个金额列
        const targetProps = ['totalFeeAmount', 'writtenOffAmount', 'unwrittenOffAmount'];
        if (targetProps.includes(column.property)) {
            const values = data.map((item) => Number(item[column.property]));
            if (!values.every((value) => Number.isNaN(value))) {
                const total = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    return !Number.isNaN(value) ? prev + curr : prev;
                }, 0);
                // 保留三位小数
                sums[index] = total.toFixed(3);
            } else {
                sums[index] = '0.000';
            }
        } else {
            // 其他列留空
            sums[index] = '';
        }
    });
    return sums;
};

// 确认核销提交
const handleConfirm = async () => {
    if (!selectedRechargeId.value) {
        ElMessage.warning('请选择一条充值记录进行扣款');
        return;
    }

    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true;
            try {
                const params = {
                    billIds: targetBillIds.value,
                    rechargeId: selectedRechargeId.value,
                    writtenOffAmount: Number(formData.writtenOffAmount),
                    remark: formData.remark
                };

                const res = await writeOffBillByIdApi(params);

                smartAlert(res.msg, res.success, 1000);

                if (res.success) {
                    visible.value = false;
                    emit('success');
                }
            } catch (error) {
                console.error('核销请求失败:', error);
                smartAlert('核销请求异常', false);
            } finally {
                submitting.value = false;
            }
        }
    });
};

defineExpose({
    open
});
</script>

<style scoped>
.section-title {
    font-size: 15px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 4px solid #409EFF;
    display: flex;
    align-items: center;
}

.pay-dialog-content {
    min-height: 300px;
}
</style>