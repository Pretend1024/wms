<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('snapshotDate')">
                            <el-date-picker v-model="formData.snapshotDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :placeholder="getPlaceholder('snapshotDate')" />
                        </el-form-item>
                    </el-col>
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
                        <el-form-item :label="getLabel('sourceNo')">
                            <canonicalInput v-model:listName="formData.sourceNoList"
                                :placeholder="getPlaceholder('sourceNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('inShelfDate')">
                            <el-date-picker v-model="formData.inShelfDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :placeholder="getPlaceholder('inShelfDate')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('zoneCode')">
                            <el-select v-model="formData.zoneCode" :placeholder="getPlaceholder('zoneCode')" clearable>
                                <el-option v-for="item in zoneEnumOptions" :key="item.typeId"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('locationCodeList')">
                            <canonicalInput v-model:listName="formData.locationCodeList"
                                :placeholder="getPlaceholder('locationCodeList')" clearable>
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
                        <el-form-item :label="getLabel('qualityId')">
                            <el-select v-model="formData.qualityId" :placeholder="getPlaceholder('qualityId')"
                                clearable>
                                <el-option v-for="item in qualityOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
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
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
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
                <template #skuName="{ row }">
                    {{ row.skuNameCn + ' ' + row.skuNameEn }}
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" title="库存日志" width="1200" align-center destroy-on-close>
            <div style="height: 500px;">
                <LogForm :formData="addData"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="303"
            :extraParams="{ view }">
        </exportDialog>
    </div>
</template>
<script setup name="库存快照">
import { Share } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi, getWhZoneEnumApi } from '@/api/baseApi/wh.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import LogForm from './logTable.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { getInventoryInventorySnapshotPageApi } from '@/api/inventoryApi/inventory.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([])

// 初始化表单数据
const initValues = ref({
    // 默认为今天的前一天
    snapshotDate: (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    })()
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
    { label: '快照日期', prop: 'snapshotDate', fixed: 'left', width: '200' },
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '状态', prop: 'statusName', width: '110', sortable: true },
    { label: '库区', prop: 'zoneCode', width: '115' },
    { label: '库位', prop: 'locationCode', width: '165', sortable: true },
    { label: 'sku', prop: 'sku', width: '150' },
    { label: '条码', prop: 'barcode', width: '160', sortable: true },
    { label: '品质', prop: 'qualityName', width: '125', sortable: true },
    { label: '总数', prop: 'qtyTotal', width: '135', sortable: true },
    { label: '可用数', prop: 'qtyAvail', width: '145', sortable: true },
    { label: '锁定数', prop: 'qtyLock', width: '155', sortable: true },
    { label: '来源单号', prop: 'sourceNo', width: '165', sortable: true },
    { label: '批次号', prop: 'batchNo', width: '110' },
    { label: '上架日期', prop: 'inShelfDate', width: '200' },
    { label: '品名', prop: 'skuName', width: '170', sortable: true, slot: 'skuName' },
    { label: 'sku长', prop: 'length', width: '150', sortable: true },
    { label: 'sku宽', prop: 'width', width: '150', sortable: true },
    { label: 'sku高', prop: 'height', width: '150', sortable: true },
    { label: 'sku体积', prop: 'skuVolume', width: '150', sortable: true },
    { label: '库存创建时间', prop: 'createdTime', width: '240', sortable: true },
    { label: '库存创建人', prop: 'createdBy', width: '230' },
    { label: '快照创建时间', prop: 'snapshotTime', width: '240', sortable: true },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
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
// 日志
const handleLog = async (row) => {
    addData.value = { ...row };
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}


// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getInventoryInventorySnapshotPageApi({
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
// 库区下拉框数据
const zoneEnumOptions = ref([]);

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
// 品质
const qualityOptions = ref([])
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
    // 品质
    const qualityRes = await getOrderQualityEnumApi()
    qualityOptions.value = qualityRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取库区数据
    const res = await getWhZoneEnumApi();
    zoneEnumOptions.value = res.data;
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