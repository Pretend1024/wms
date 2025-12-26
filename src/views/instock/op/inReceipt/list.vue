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
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('inOrderNoList')">
                            <canonicalInput v-model:listName="formData.inOrderNoList"
                                :placeholder="getPlaceholder('inOrderNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('receiptMethodId')">
                            <el-select v-model="formData.receiptMethodId"
                                :placeholder="getPlaceholder('receiptMethodId')" clearable>
                                <el-option v-for="item in receiptMethodOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('skuList')">
                            <canonicalInput v-model:listName="formData.skuList" :placeholder="getPlaceholder('skuList')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('barcode')">
                            <el-input v-model="formData.barcode" :placeholder="getPlaceholder('barcode')" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('boxNoList')">
                            <canonicalInput v-model:listName="formData.boxNoList"
                                :placeholder="getPlaceholder('boxNoList')" clearable>
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
                @sort-change="handleTableSort" :strikeCondition="row => row.qty == 0"
                :excludeStrikeProps="['序号', 'action']">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                        }}</el-button>
                    <el-button type="info" @click="handleDel" v-permission="'cancel'" :icon="CloseBold">{{
                        getButtonText('cancel')
                        }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleLog(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('log') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1000" align-center destroy-on-close>
            <UpdForm v-if="dialogMode != 'log'" ref="childFormRef" :formData="addData"
                :warehouseOptions="warehouseOptions" :consumablesOptions="consumablesOptions"></UpdForm>
            <div style="height: 500px;" v-else>
                <LogForm :formData="addData"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" v-if="dialogMode == 'upd'" @click="handleDialogConfirm">{{ getButtonText
                        ('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="222">
        </exportDialog>
        <!-- 取消 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'入库单号'" successValue="更新收货数量成功" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="收货记录">
import { Share, CloseBold } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getInstockInOrderReceiptMethodEnumApi, getOrderInReceiptListApi, cancelOrderInReceiptApi, updOrderInReceiptUpdateQtyByIdApi } from '@/api/instockApi/order.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import LogForm from '@/components/table/logTableById.vue';
import UpdForm from './upd.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    orgId: '',
    receiptMethodId: '',
    warehouseCode: '',
    customerCode: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    skuList: [],
    boxNoList: [],
})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    { label: '仓库', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '入库单号', prop: 'inOrderNo', width: '200', fixed: 'left', sortable: true },
    { label: '收货方式', prop: 'receiptMethodName', width: '200' },
    { label: 'SKU', prop: 'sku', width: '160', sortable: true },
    { label: '条码', prop: 'barcode', width: '160', sortable: true },
    { label: '品名', prop: 'skuName', width: '150' },
    { label: '收货件数', prop: 'qty', width: '110', sortable: true },
    { label: '箱号', prop: 'boxNo', width: '150', sortable: true },
    { label: '箱规', prop: 'boxBatch', width: '200', sortable: true },
    { label: '箱数', prop: 'boxQty', width: '200', sortable: true },
    { label: '箱内件数', prop: 'boxInnerQty', width: '200', sortable: true },
    { label: '收货备注', prop: 'remark', width: '250' },
    { label: '登录端', prop: 'terminalName', width: '160' },
    { label: 'IP地址', prop: 'ip', width: '130', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '150', fixed: 'right', slot: 'customBtn' }
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
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 日志
const handleLog = async (row) => {
    addData.value = { ...row };
    dialogMode.value = 'log';
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 取消
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await cancelOrderInReceiptApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].inOrderNo,
                    msg: res.msg,
                    success: res.success
                });
                // console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};


// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分日志与编辑
const dialogMode = ref('log'); // 'add' 或 'upd'

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const bodyLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
        })
        loading.value = true;
        const data = {
            id: addData.value.id,
            qty: addData.value.newQty,
        }
        let res = await updOrderInReceiptUpdateQtyByIdApi(data);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        smartAlert(res.msg, res.success, 1000)
        loading.value = false;
        bodyLoading.close();
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOrderInReceiptListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    footer.value = res.data.footer[0]
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 仓库下拉框数据
const warehouseOptions = ref([])
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
// 收货方式
const receiptMethodOptions = ref([])
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
    // 收货方式
    const res = await getInstockInOrderReceiptMethodEnumApi()
    receiptMethodOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>