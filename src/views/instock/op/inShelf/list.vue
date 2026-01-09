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
                    <el-col>
                        <el-form-item :label="getLabel('locationCodeList')">
                            <canonicalInput v-model:listName="formData.locationCodeList"
                                :placeholder="getPlaceholder('locationCodeList')" clearable>
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
                    <el-button type="info" @click="handleDel" v-permission="'cancel'" :icon="CloseBold">{{ getButtonText('cancel')
                    }}</el-button>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
            </hydTable>
        </div>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="203">
        </exportDialog>
        <!-- 取消 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'入库单号'" :successValue="successValue" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="上架记录">
import { Share, CloseBold } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getOrderInShelfListApi, cancelOrderInShelfApi, getOrderQualityEnumApi, getOrderInShelfMethodEnumApi } from '@/api/instockApi/order.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', label: '品质', prop: 'qualityId', options: [] },
    { type: 'select', label: '上架方法', prop: 'inShelfMethodId', options: [] },
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
    { label: '上架方式', prop: 'inShelfMethodName', width: '135' },
    { label: 'SKU', prop: 'sku', width: '160', sortable: true },
    { label: '条码', prop: 'barcode', width: '160', sortable: true },
    { label: '品名', prop: 'skuName', width: '150' },
    { label: '品质', prop: 'qualityName', width: '150', sortable: true },
    { label: '上架件数', prop: 'qty', width: '180', sortable: true },
    { label: '箱号', prop: 'boxNo', width: '150', sortable: true },
    { label: '箱规', prop: 'boxBatch', width: '200', sortable: true },
    { label: '箱数', prop: 'boxQty', width: '200', sortable: true },
    { label: '箱内件数', prop: 'boxInnerQty', width: '200', sortable: true },
    { label: '上架备注', prop: 'remark', width: '250' },
    { label: '登录端', prop: 'terminalName', width: '160' },
    { label: 'IP地址', prop: 'ip', width: '130', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
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
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 取消
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const successValue = ref('取消成功！')
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
                const res = await cancelOrderInShelfApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].inOrderNo,
                    msg: res.msg,
                    success: res.success
                });
                if (res.success) {
                    successValue.value = res.msg
                }
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

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOrderInShelfListApi({
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
    // 仓库数据
    const warehouseRes = await getWhWarehouseApi()
    warehouseOptions.value = warehouseRes.data.map(item => ({
        label: item.code + '(' + item.name + ')',
        value: item.code
    }))
    // 品质数据
    const qualityRes = await getOrderQualityEnumApi()
    formConfig.value[0].options = qualityRes.data.map(item => ({ label: item.name, value: item.id }))
    // 上架方法
    const shelfMethodRes = await getOrderInShelfMethodEnumApi()
    formConfig.value[1].options = shelfMethodRes.data.map(item => ({ label: item.name, value: item.id }))
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