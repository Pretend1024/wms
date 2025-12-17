<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')">
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('firstLeg')">
                            <el-select v-model="formData.firstLegId" :placeholder="getPlaceholder('firstLeg')">
                                <el-option v-for="item in firstLegOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('business')">
                            <el-select v-model="formData.businessId" :placeholder="getPlaceholder('business')">
                                <el-option v-for="item in businessOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col>
                        <el-form-item :label="getLabel('type')">
                            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('type')">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col>
                        <el-form-item :label="getLabel('arrivalType')">
                            <el-select v-model="formData.arrivalTypeId" :placeholder="getPlaceholder('arrivalType')">
                                <el-option v-for="item in arrivalTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('orderNo')">
                            <canonicalInput v-model:listName="formData.orderNoList"
                                :placeholder="getPlaceholder('orderNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('trackingNo1')">
                            <canonicalInput v-model:listName="formData.trackingNo1List"
                                :placeholder="getPlaceholder('trackingNo1')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('trackingNo2')">
                            <canonicalInput v-model:listName="formData.trackingNo2List"
                                :placeholder="getPlaceholder('trackingNo2')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('containerNumber')">
                            <canonicalInput v-model:listName="formData.containerNumberList"
                                :placeholder="getPlaceholder('containerNumber')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort" :strike-condition="(row) => row.statusId == 99"
                :excludeStrikeProps="['index', 'action', 'orderNo', 'statusName']"
                :red-text-condition="(row) => row.statusId === 99"
                :exclude-red-text-props="['index', 'action', 'orderNo', 'statusName']">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                                getButtonText('add')
                            }}</el-button>
                            <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                                getButtonText('del')
                            }}</el-button>
                            <!-- <el-button type="warning" @click="handleConfirm" :icon="Finished">确认</el-button>
                            <el-button type="warning" @click="handleCancelConfirm" :icon="Minus">取消确认</el-button> -->
                            <el-dropdown trigger="click">
                                <el-button type="warning">
                                    {{ getButtonText('status') }}<el-icon
                                        class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleConfirm">在途</el-dropdown-item>
                                        <el-dropdown-item @click="handleCancelConfirm">草稿</el-dropdown-item>
                                        <el-dropdown-item @click="handleFinishReceipt">已收货</el-dropdown-item>
                                        <el-dropdown-item @click="handleConfirmEnd">确认完结</el-dropdown-item>
                                        <el-dropdown-item @click="handleCancelEnd">取消完结</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                                }}</el-button>
                            <!-- <el-button type="info" @click="handlePrint" :icon="Printer">{{getButtonText ('print') }}</el-button> -->
                        </div>
                    </div>
                </template>
                <template #orderNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.orderNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span class="copyText" @click="handleInfo(row)">{{ row.orderNo }}</span>
                    </div>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer"
                            @click="(row.statusId == 10 || row.statusId == 20) && handleEdit(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10 || row.statusId == 20) }">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('print') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handlePrint('1', row)">{{
                                        getButtonText('printInboundOrder') }}</el-dropdown-item>
                                    <el-dropdown-item @click="handlePrint('2', row)">{{
                                        getButtonText('printBoxLabel') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('more') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleCopy(row)">{{ getButtonText('copy')
                                        }}</el-dropdown-item>
                                    <el-dropdown-item @click="handleCancel(row)">{{ getButtonText('cancelReceipt')
                                        }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId !== 99 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
            </hydTable>
        </div>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="221">
        </exportDialog>
        <!-- 打印弹窗 -->
        <printDialog ref="printDialogRef" :selectionRows="[selectionItem]" :printType="printType" :disabled="true">
        </printDialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'入库单号'" :successValue="delDataMsg" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="入库单">
import { Plus, Delete, Share } from '@element-plus/icons-vue'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getOrderInOrderListApi, getInOrderCountGroupByStatusApi, getInstockInOrderFirstLegEnumApi, getInstockInOrderTypeEnumApi, getInstockInOrderBusinessEnumApi, getInstockInOrderCabinetTypeEnumApi, getInstockInOrderCalculateFeeStatusEnumApi, getInstockInOrderArrivalTypeEnumApi, deleteOrderInOrderApi, cancelConfirmOrderInOrderApi, confirmOrderInOrderApi, getInstockInOrderReceiptMethodEnumApi, finishReceiptOrderInOrderApi, confirmEndOrderInOrderApi, cancelEndOrderInOrderApi, updOrderInOrderCancelInReceiptByIdApi, getInstockInOrderCreateWayEnumApi } from '@/api/instockApi/order.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', prop: 'containerType', options: [] },
    { type: 'input', prop: 'totalNo' },
    { type: 'input', prop: 'sku' },
    { type: 'select', prop: 'hasRemark', options: [{ label: '是', value: true }, { label: '否', value: false }] },
    { type: 'select', prop: 'calculateFeeStatus', options: [] },
    { type: 'select', prop: 'receiptMethodId', options: [] },
    { type: 'select', prop: 'createWay', options: [] },
    { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true }
])


// 初始化表单数据
const initValues = ref({
    orgId: '',
    customerCode: '',
    warehouseCode: '',
    firstLegId: '',
    businessId: '',
    orderNoList: [],
    trackingNo1List: [],
    trackingNo2List: [],
    totalNo: '',
    containerType: '',
    containerNumberList: [],
    sku: '',
    hasRemark: '',
    calculateFeeStatus: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    statusIdList: '',
})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: statusIdsArr.value
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: []
    }
    statusIdsArr.value = []
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '135', slot: 'customer', fixed: 'left', sortable: true },
    { label: '入库单号', prop: 'orderNo', width: '250', fixed: 'left', slot: 'orderNo' },
    // { label: '入库单类型', prop: 'typeName', width: '165', sortable: true },
    { label: '业务类型', prop: 'businessName', width: '165', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', slot: 'statusName', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '总单号', prop: 'totalNo', width: '120' },
    { label: '头程类型', prop: 'firstLegName', width: '180', sortable: true },
    { label: '到仓类型', prop: 'arrivalTypeName', width: '150', sortable: true },
    { label: '头程单号', prop: 'trackingNo1', width: '200' },
    { label: '尾程单号', prop: 'trackingNo2', width: '200' },
    { label: '计划到仓时间', prop: 'plannedArrivalTime', width: '215', sortable: true },
    { label: '实际到仓时间', prop: 'actualArrivalTime', width: '200', sortable: true },
    { label: '货柜型号', prop: 'containerType', width: '170', sortable: true },
    { label: '货柜号', prop: 'containerNumber', width: '170', sortable: true },
    { label: '预报箱规数', prop: 'boxBatchQty', width: '140', sortable: true, sortAlias: 'b.boxBatchQty' },
    { label: 'SKU种类数', prop: 'skuQty', width: '140', sortable: true, sortAlias: 'c.skuQty' },
    { label: '预报箱数', prop: 'boxQty', width: '140', sortable: true, sortAlias: 'b.boxQty' },
    { label: '预报件数', prop: 'goodsQty', width: '140', sortable: true, sortAlias: 'c.goodsQty' },
    { label: '预报立方', prop: 'totalVolume', width: '140', },
    { label: '收货箱数', prop: 'receiptBoxQty', width: '140', sortable: true, sortAlias: 'd.receiptBoxQty' },
    { label: '收货件数', prop: 'receiptGoodsQty', width: '140', sortable: true, sortAlias: 'd.receiptGoodsQty' },
    { label: '上架箱数', prop: 'shelfBoxQty', width: '140', sortable: true, sortAlias: 'e.shelfBoxQty' },
    { label: '上架件数', prop: 'shelfGoodsQty', width: '140', sortable: true, sortAlias: 'e.shelfGoodsQty' },
    { label: '收货方式', prop: 'receiptMethodName', width: '180', sortAlias: 'a.receiptMethodId' },
    { label: '备注', prop: 'remark', width: '150' },
    { label: '完结时间', prop: 'confirmEndTime', width: '200', sortable: true },
    { label: '计费状态', prop: 'calculateFeeStatus', width: '160', sortable: true },
    { label: '计费时间', prop: 'calculateFeeTime', width: '200', sortable: true },
    { label: '计费次数', prop: 'calculateFeeCount', width: '125' },
    { label: '计费消息', prop: 'calculateFeeMsg', width: '150' },
    { label: '创建方式', prop: 'createWayName', width: '160', sortable: true },
    { label: '接口类型', prop: 'apiTypeName', width: '105' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '210', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
    console.log('选中的数据：', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑入库单',
        params: { id: row.id, name: row.orderNo },
    })
}
// 详情
const handleInfo = (row) => {
    router.push({
        name: '入库单详情',
        params: { id: row.id, name: row.orderNo },
    })
}
// 复制
const handleCopy = (row) => {
    router.push({
        name: '入库单复制',
        params: { id: row.id },
    })
}
// 取消收货
const handleCancel = (row) => {
    ElMessageBox.confirm(
        `是否要取消${row.orderNo}的收货数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await updOrderInOrderCancelInReceiptByIdApi({ id: row.id });
            console.log('删除数据:', res);
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            getStatus()
            smartAlert(res.msg, res.success, 1000)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 删除
const delData = ref([]);
const delDataMsg = ref('删除成功')
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '删除成功'
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await deleteOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus()
};
// 在途
const handleConfirm = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要变更的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为在途状态?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;

            delData.value = [];
            promptMessage.value = '操作中...'
            delDataMsg.value = '更新成功'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await confirmOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('确认数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 草稿
const handleCancelConfirm = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要变更的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为草稿状态?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '更新成功'
            delData.value = [];
            promptMessage.value = '操作中...'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await cancelConfirmOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('确认数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 已收货
const handleFinishReceipt = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要变更的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为已收货状态?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '更新成功'
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await finishReceiptOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('确认数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 完结
const handleConfirmEnd = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要变更的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为完结状态?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '更新成功'
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await confirmEndOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('确认数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 取消完结
const handleCancelEnd = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要变更的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为取消完结状态?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '更新成功'
            delData.value = [];
            promptMessage.value = '操作中...'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await cancelEndOrderInOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('确认数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
// 打印
const printDialogRef = ref(null)
const selectionItem = ref({}) // 用于存储单个选中行数据
const printType = ref(221) // 默认入库单打印类型
const handlePrint = async (index, row) => {
    selectionItem.value = row
    if (index == 1) {
        printType.value = 221 // 入库单打印
    } else if (index == 2) {
        printType.value = 222 // 箱唛打印
    } else {
        ElMessage({
            type: 'warning',
            message: '请选择打印类型！'
        });
        return;
    }
    console.log('打印类型:', printType.value)
    printDialogRef.value.openPrintDialog(printType.value)
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加按钮
const handleAdd = async () => {
    router.push('/instock/order/inOrder/add')
}
// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOrderInOrderListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        orgId: initValues.value.orgId[initValues.value.orgId.length - 1]
    })
    tableData.value = res.data.rows
    footer.value = res.data.footer[0]
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 获状态栏
const getStatus = async () => {
    const data = { ...trimObjectStrings(initValues.value) }
    delete data.statusIdList
    const res = await getInOrderCountGroupByStatusApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...initValues.value.statusIdList]
}
// 状态栏
const statusIdsList = ref([])
// 状态栏数组
const statusIdsArr = ref([])
// 状态改变事件
const handleStatusChange = async (e) => {
    loading.value = true;
    let list = [...statusIdsArr.value];

    if (list.includes(null)) {
        list = [];
    }

    initValues.value.statusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
// 仓库数据
const warehouseOptions = ref([])
// 头程类型
const firstLegOptions = ref([])
// 业务类型
const businessOptions = ref([])
// 入库类型
const typeOptions = ref([])
// 到仓类型
const arrivalTypeOptions = ref([])
onMounted(async () => {
    // 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    // 处理公司数据
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 获取货柜类型
    const cabinetRes = await getInstockInOrderCabinetTypeEnumApi()
    formConfig.value[0].options = cabinetRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 获取仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))
    // 获取头程类型
    const firstLegRes = await getInstockInOrderFirstLegEnumApi()
    firstLegOptions.value = firstLegRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取业务类型
    const businessRes = await getInstockInOrderBusinessEnumApi()
    businessOptions.value = businessRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取入库类型
    const typeRes = await getInstockInOrderTypeEnumApi()
    typeOptions.value = typeRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取到仓类型
    const arrivalTypeRes = await getInstockInOrderArrivalTypeEnumApi()
    arrivalTypeOptions.value = arrivalTypeRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取计费状态
    const calculateFeeRes = await getInstockInOrderCalculateFeeStatusEnumApi()
    formConfig.value[4].options = calculateFeeRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取收货方式
    const receiptMethodRes = await getInstockInOrderReceiptMethodEnumApi()
    formConfig.value[5].options = receiptMethodRes.data.map(item => ({ label: item.name, value: item.id }))
    // 创建方式
    const createMethodRes = await getInstockInOrderCreateWayEnumApi()
    formConfig.value[6].options = createMethodRes.data.map(item => ({ label: item.name, value: item.id }))
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshInOrderList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshInOrderList = false
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>