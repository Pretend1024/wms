<template>
    <div class="viewArea">
        <div class="bill-info-section" v-loading="infoLoading">
            <div class="section-title">账单详情</div>
            <el-descriptions :column="4" border size="default" class="fixed-descriptions">
                <el-descriptions-item label="账单编号">{{ billInfo.billNo }}</el-descriptions-item>
                <el-descriptions-item label="公司">{{ billInfo.orgName }}</el-descriptions-item>
                <el-descriptions-item label="客户">{{ billInfo.customerCode }}({{ billInfo.customerName
                }})</el-descriptions-item>
                <el-descriptions-item label="账单状态">
                    <el-tag :type="billInfo.billStatusId === 10 ? 'warning' : 'success'">{{ billInfo.billStatusName
                    }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item label="币种">{{ billInfo.currency }}</el-descriptions-item>
                <el-descriptions-item label="总金额">{{ billInfo.totalFeeAmount }}</el-descriptions-item>

                <el-descriptions-item label="已核销金额">
                    <div style="display: flex;justify-content: space-between;">
                        <span>{{ billInfo.writtenOffAmount }}</span>
                        <el-button type="primary" link size="small" icon="List" @click="openWriteOffDialog"
                            style="margin-left: 10px;">核销记录</el-button>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item label="未核销金额">
                    <span style="color: red; font-weight: bold;">{{ billInfo.unwrittenOffAmount }}</span>
                </el-descriptions-item>

                <el-descriptions-item label="起始日期" :span="1">{{ billInfo.billStartDate }}</el-descriptions-item>
                <el-descriptions-item label="结束日期" :span="1">{{ billInfo.billEndDate }}</el-descriptions-item>

                <el-descriptions-item label="核销完成时间" :span="2">{{ billInfo.writeOffCompleteTime
                    }}</el-descriptions-item>

                <el-descriptions-item label="附件" :span="2">
                    <div v-if="billInfo.attachment && parseAttachment(billInfo.attachment).length > 0">
                        <div v-for="(file, index) in parseAttachment(billInfo.attachment)" :key="index">
                            <a :href="file.url" target="_blank" class="file-link">{{ file.name }}</a>
                        </div>
                    </div>
                    <span v-else>无</span>
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">{{ billInfo.remark }}</el-descriptions-item>

            </el-descriptions>
        </div>

        <div class="category-section">
            <div class="tabs-header">
                <div v-for="item in categoryList" :key="item.feeMainTypeId" class="tab-item"
                    :class="{ active: activeCategoryId === item.feeMainTypeId }"
                    @click="handleCategoryChange(item.feeMainTypeId)">
                    <span>{{ item.feeMainTypeName }}</span>
                    <span v-if="item.confirmFeeAmount !== undefined && item.confirmFeeAmount !== null"
                        class="tab-badge">
                        ({{ item.confirmFeeAmount }} {{ item.currency }})
                    </span>
                </div>
            </div>
        </div>

        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="tableLoading" :pageSizes="[20, 50, 100, 200]" @page-change="handlePageChange"
                @sort-change="handleTableSort" @selection-change="handleSelectionChange"
                :tableId="'finance/receivables/customerBill/info'">
                <template #table-buttons>
                    <el-button type="danger" @click="handleExit" :icon="Delete">退出账单</el-button>
                </template>
                <template #statusName="{ row }">
                    <span
                        :style="{ color: row.statusId == 10 ? '#E6A23C' : (row.statusId == 20 ? '#67C23A' : '#F56C6C') }">
                        {{ row.statusName }}
                    </span>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="writeOffDialogVisible" title="核销记录" width="1000px" align-center append-to-body>
            <el-table :data="writeOffTableData" border stripe v-loading="writeOffLoading" height="400"
                style="width: 100%">
                <el-table-column prop="writeOffNo" label="核销单号" width="180" show-overflow-tooltip />
                <el-table-column prop="rechargeNo" label="充值单号" width="180" show-overflow-tooltip />
                <el-table-column prop="currentWriteOffAmount" label="本次核销金额" width="110" />
                <el-table-column prop="billWrittenOffAmountBefore" label="核销前已核销" width="110" />
                <el-table-column prop="billWrittenOffAmountAfter" label="核销后已核销" width="110" />
                <el-table-column prop="billUnwrittenOffAmountAfter" label="剩余待核销" width="100" />
                <el-table-column prop="billStatusNameAfter" label="核销后状态" width="100" />
                <el-table-column prop="writeOffBy" label="操作人" width="100" />
                <el-table-column prop="writeOffTime" label="操作时间" width="200" />
            </el-table>
            <div style="margin-top: 15px; display: flex; justify-content: center;">
                <el-pagination v-model:current-page="writeOffPagination.page"
                    v-model:page-size="writeOffPagination.pageSize" :page-sizes="[10, 20, 50, 100]" :background="true"
                    layout="total, sizes, prev, pager, next, jumper" :total="writeOffPagination.total"
                    @size-change="handleWriteOffSizeChange" @current-change="handleWriteOffCurrentChange" />
            </div>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'关联单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name="应收帐单详情">
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import hydTable from "@/components/table/hyd-table.vue";

import {
    getBillByIdApi,
    getFeeCategoryApi,
    getFeePageApi,
    getBillWriteOffPageApi,
    exitBillByIdApi,
} from '@/api/financeApi/receivables.js';

const route = useRoute();
const billId = ref(route.params.id || '');

// ------------------- 账单详情逻辑 -------------------
const infoLoading = ref(false);
const billInfo = ref({});

/**
 * 获取账单基础详情信息
 */
const getBillInfo = async () => {
    if (!billId.value) return;
    infoLoading.value = true;
    try {
        const res = await getBillByIdApi({ id: billId.value });
        if (res.success) {
            billInfo.value = res.data || {};
        }
    } catch (error) {
        console.error('获取账单详情失败:', error);
    } finally {
        infoLoading.value = false;
    }
};

/**
 * 解析附件JSON字符串为数组
 * @param {String} jsonStr JSON字符串
 * @returns {Array} 文件数组
 */
const parseAttachment = (jsonStr) => {
    try {
        if (!jsonStr) return [];
        return JSON.parse(jsonStr);
    } catch (e) {
        return [];
    }
}

// ------------------- 分类标签逻辑 -------------------
const categoryList = ref([]);
const activeCategoryId = ref(0); // 默认0（全部）

/**
 * 获取费用分类统计数据
 */
const getCategories = async () => {
    try {
        const res = await getFeeCategoryApi({ billId: billId.value });
        if (res.success) {
            categoryList.value = res.data;
        }
    } catch (error) {
        console.error('获取费用分类失败:', error);
    }
};

/**
 * 切换费用分类TAB
 * @param {Number} id 分类ID
 */
const handleCategoryChange = (id) => {
    activeCategoryId.value = id;
    // 重置分页并查询
    pagination.value.currentPage = 1;
    getFeeList();
};

// ------------------- 费用列表逻辑 -------------------
const tableLoading = ref(false);
const tableData = ref([]);
const pagination = ref({ currentPage: 1, pageSize: 20, total: 0 });
const orderBy = ref('');

// 表格列配置
const columns = ref([
    { label: '费用小类', prop: 'feeSubTypeName', width: '120', sortable: true, fixed: 'left' },
    { label: '费用状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true, fixed: 'left' },
    { label: '关联单号', prop: 'orderNo', width: '160', sortable: true, fixed: 'left' },
    { label: '币种', prop: 'currency', width: '80', sortable: true },
    { label: '费用金额', prop: 'feeAmount', width: '100' },
    { label: '费用金额公式', prop: 'expression', width: '140' },
    { label: '确认金额', prop: 'confirmFeeAmount', width: '100' },
    { label: '确认人', prop: 'confirmBy', width: '130' },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '关联单据创建时间', prop: 'orderCreatedTime', width: '200' },
    { label: '创建方式', prop: 'createWayName', width: '120', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
]);

/**
 * 获取费用分页列表数据
 */
const getFeeList = async () => {
    if (!billId.value) return;
    tableLoading.value = true;
    try {
        const params = {
            page: pagination.value.currentPage,
            pageSize: pagination.value.pageSize,
            orderBy: orderBy.value,
            billId: billId.value,
            feeMainTypeId: activeCategoryId.value === 0 ? undefined : activeCategoryId.value
        };
        const res = await getFeePageApi(params);
        if (res.success) {
            tableData.value = Object.freeze(res.data.rows) || [];
            pagination.value.total = res.data.total || 0;
        } else {
            tableData.value = [];
            pagination.value.total = 0;
        }
    } catch (error) {
        console.error('获取费用列表失败:', error);
        tableData.value = [];
    } finally {
        tableLoading.value = false;
    }
};

/**
 * 费用列表分页变化处理
 */
const handlePageChange = ({ pageSize, currentPage }) => {
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getFeeList();
};

/**
 * 费用列表排序处理
 */
const handleTableSort = (sortString) => {
    orderBy.value = sortString;
    getFeeList();
};
const selectionRows = ref([]);
const handleSelectionChange = (selection) => {
    selectionRows.value = selection;
    console.log('当前选中行数据:', selectionRows.value);
};
// 退出账单
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('');
const handleExit = () => {
    if (selectionRows.value.length === 0) {
        ElMessage.warning('请选择要退出的数据！');
        return;
    }
    ElMessageBox.confirm(
        `是否要退出${selectionRows.value.length}条数据?`, '提醒', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
        writeOffLoading.value = true;
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...'
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await exitBillByIdApi({ feeId: selectionRows.value[i].id });
            delData.value.push({
                id: selectionRows.value[i].orderNo,
                msg: res.msg,
                success: res.success
            });
        }
        promptMessage.value = '操作完成！'
    }).catch(() => { });
};
const delColse = () => {
    delDialogVisible.value = false;
    getBillInfo()
    getCategories()
    getFeeList()
};

// ------------------- 核销记录弹窗逻辑 -------------------
const writeOffDialogVisible = ref(false);
const writeOffLoading = ref(false);
const writeOffTableData = ref([]);
const writeOffPagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
});

/**
 * 打开核销记录弹窗
 */
const openWriteOffDialog = () => {
    if (!billInfo.value.billNo) {
        return ElMessage.warning('未能获取账单编号');
    }
    writeOffDialogVisible.value = true;
    writeOffPagination.page = 1; // 重置页码
    getWriteOffList();
};

/**
 * 获取核销记录列表
 */
const getWriteOffList = async () => {
    writeOffLoading.value = true;
    try {
        const params = {
            billNo: billInfo.value.billNo,
            page: writeOffPagination.page,
            pageSize: writeOffPagination.pageSize
        };
        const res = await getBillWriteOffPageApi(params);
        if (res.success) {
            writeOffTableData.value = Object.freeze(res.data.rows) || [];
            writeOffPagination.total = res.data.total || 0;
        } else {
            writeOffTableData.value = [];
            writeOffPagination.total = 0;
        }
    } catch (error) {
        console.error('获取核销记录失败:', error);
        writeOffTableData.value = [];
    } finally {
        writeOffLoading.value = false;
    }
};

/**
 * 核销记录分页 - 每页条数变化
 */
const handleWriteOffSizeChange = (val) => {
    writeOffPagination.pageSize = val;
    writeOffPagination.page = 1; // 切换页大小重置为第一页
    getWriteOffList();
};

/**
 * 核销记录分页 - 页码变化
 */
const handleWriteOffCurrentChange = (val) => {
    writeOffPagination.page = val;
    getWriteOffList();
};

// ------------------- 生命周期 -------------------
onMounted(async () => {
    openMainLoading()
    if (billId.value) {
        await Promise.all([
            getBillInfo(),
            getCategories(),
            getFeeList()
        ]);
    } else {
        ElMessage.error('参数异常：未获取到账单ID');
    }
    closeMainLoading()
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* CSS：强制描述列表列宽均匀 */
.fixed-descriptions {
    :deep(table) {
        table-layout: fixed;
    }

    :deep(.el-descriptions__label) {
        width: 10%;
        text-align: center;
        color: #606266;
        font-weight: 500;
        background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
        width: 15%;
    }
}

.bill-info-section {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #303133;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }

    .file-link {
        color: #409EFF;
        text-decoration: none;
        margin-right: 10px;
        display: inline-block;

        &:hover {
            text-decoration: underline;
        }
    }
}

.category-section {
    background-color: #fff;
    padding: 2px 15px 0 15px;
    border-bottom: 1px solid #ebeef5;

    .tabs-header {
        display: flex;
        gap: 20px;

        .tab-item {
            padding: 10px 0;
            cursor: pointer;
            font-size: 14px;
            color: #606266;
            position: relative;
            transition: color 0.3s;
            display: flex;
            align-items: center;
            gap: 4px;

            .tab-badge {
                font-size: 12px;
                color: #909399;
            }

            &:hover {
                color: #409EFF;

                .tab-badge {
                    color: #409EFF;
                }
            }

            &.active {
                color: #409EFF;
                font-weight: 500;

                .tab-badge {
                    color: #409EFF;
                }

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #409EFF;
                }
            }
        }
    }
}

.tableDiv {
    padding-top: 10px;
    height: calc(100vh - 450px);
    min-height: 400px;
}

.link-text {
    color: #409EFF;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}
</style>