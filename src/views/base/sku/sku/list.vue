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
                        <el-form-item :label="getLabel('skuList')">
                            <canonicalInput v-model:listName="formData.skuList" :placeholder="getPlaceholder('skuList')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('barcodeList')">
                            <canonicalInput v-model:listName="formData.barcodeList"
                                :placeholder="getPlaceholder('barcodeList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusMenu" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 客户审核 -->
                    <el-col>
                        <el-form-item :label="getLabel('cusStatusId')">
                            <el-select v-model="formData.cusStatusId" :placeholder="getPlaceholder('cusStatusId')"
                                clearable>
                                <el-option v-for="item in cusStatusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否新品 -->
                    <el-col>
                        <el-form-item :label="getLabel('isNew')">
                            <el-select v-model="formData.isNew" :placeholder="getPlaceholder('isNew')" clearable>
                                <el-option v-for="item in isNewOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否复测 -->
                    <el-col>
                        <el-form-item :label="getLabel('isCheckedSize')">
                            <el-select v-model="formData.isCheckedSize" :placeholder="getPlaceholder('isCheckedSize')"
                                clearable>
                                <el-option v-for="item in isCheckedSizeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 危险类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('dangerId')">
                            <el-select v-model="formData.dangerId" :placeholder="getPlaceholder('dangerId')" clearable>
                                <el-option v-for="item in dangerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 带电类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('electrifiedId')">
                            <el-select v-model="formData.electrifiedId" :placeholder="getPlaceholder('electrifiedId')"
                                clearable>
                                <el-option v-for="item in electrifiedOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <selectInput :options="way" :formData="formData" selectKey="way"></selectInput>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" :icon="Delete">{{ getButtonText('del') }}</el-button>
                    <el-button type="warning" @click="handleAudit" :icon="Finished">{{ getButtonText('audit')
                    }}</el-button>

                    <el-dropdown trigger="click">
                        <el-button type="success">
                            {{ getButtonText('import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleImportAdd">{{ getButtonText('importCreate')
                                    }}</el-dropdown-item>
                                <el-dropdown-item @click="handleImportUpd">{{ getButtonText('importUpdate')
                                    }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                    }}</el-button>
                    <el-button type="info" @click="handlePrint" :icon="Printer">{{ getButtonText('print') }}</el-button>
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
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId == 20 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #cusStatusName="{ row, column, index }">
                    <span :style="{ color: row.cusStatusId == 20 ? 'green' : 'red' }">{{ row.cusStatusName }}</span>
                </template>
                <template #isCheckedSize="{ row, column, index }">
                    <span :style="{ color: row.isCheckedSize ? 'green' : 'red' }">{{ row.isCheckedSize ? '是' : '否'
                    }}</span>
                </template>
                <template #actualLength="{ row, column, index }">
                    <span>{{ row.length }}</span>
                </template>
                <template #actualWidth="{ row, column, index }">
                    <span>{{ row.width }}</span>
                </template>
                <template #actualHeight="{ row, column, index }">
                    <span>{{ row.height }}</span>
                </template>
                <template #actualVolume="{ row, column, index }">
                    <span>{{ row.volume }}</span>
                </template>
                <template #isNew="{ row, column, index }">
                    <span :style="{ color: row.isNew ? 'red' : 'green' }">{{ row.isNew ? '是' : '否' }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 审核弹窗 -->
        <el-dialog title="审核" v-model="auditDialogVisible" width="25%" align-center destroy-on-close>
            <el-form-item label="审核状态:">
                <el-select v-model="auditStatusId" placeholder="请输选择状态">
                    <el-option v-for="item in auditStatusOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="auditDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="audit">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="111">
        </exportDialog>
        <!-- 打印弹窗 -->
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="111">
        </printDialog>

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'SKU'" :successValue="delDataMsg" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="SKU">
import { Plus, UploadFilled, Delete, Printer, Finished, Share, } from '@element-plus/icons-vue'
import * as api from '@/api/baseApi/sku.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import selectInput from '@/components/table/selectInput.vue'
import router from '@/router/index.js'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    customerCode: '',
    skuList: [],
    name: '',
    statusId: '',
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    cusStatusId: '',
    isNew: '',
    dangerId: '',
    electrifiedId: '',
    way: 'skuLike'
})
const way = ref([
    { label: 'SKU', value: 'skuLike' },
    { label: '条码', value: 'barcodeLike' },
    { label: '中文品名', value: 'nameCnLike' },
    { label: '英文品名', value: 'nameEnLike' },
])
// 搜索事件
const handleSearch = (data) => {
    loading.value = true
    // 根据data.way的值来删掉不需要的字段
    initValues.value = {
        ...data,
        orgId: data.orgId ? data.orgId[data.orgId.length - 1] : ''
    }
    // 定义所有可能的字段
    const fields = way.value.map(item => item.value);
    // 筛选出需要删除的字段（排除当前选中的way）
    const fieldsToDelete = fields.filter(field => field !== data.way);
    // 循环删除不需要的字段
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '125', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerName', width: '200', fixed: 'left', slot: 'customer', sortable: true },
    { label: 'SKU', prop: 'sku', width: '180', fixed: 'left', sortable: true },
    { label: '条码', prop: 'barcode', width: '180', sortable: true },
    { label: '中文品名', prop: 'nameCn', width: '230', sortable: true },
    { label: '英文品名', prop: 'nameEn', width: '230', sortable: true },
    { label: '仓库审核', prop: 'statusName', width: '180', slot: 'statusName', sortable: true },
    { label: '客户审核', prop: 'cusStatusName', width: '170', slot: 'cusStatusName', sortable: true },
    { label: '新品', prop: 'isNew', width: '155', slot: 'isNew', sortable: true },
    { label: '预报长(CM)', prop: 'cusLength', width: '220', sortable: true },
    { label: '预报宽(CM)', prop: 'cusWidth', width: '220', sortable: true },
    { label: '预报高(CM)', prop: 'cusHeight', width: '220', sortable: true },
    { label: '预报体积(M³)', prop: 'cusVolume', width: '220', sortable: true },
    { label: '复测', prop: 'isCheckedSize', width: '180', sortable: true, slot: 'isCheckedSize' },
    { label: '复测长(CM)', prop: 'length', width: '255', sortable: true },
    { label: '复测宽(CM)', prop: 'width', width: '255', sortable: true },
    { label: '复测高(CM)', prop: 'height', width: '255', sortable: true },
    { label: '复测(M³)', prop: 'volume', width: '255', sortable: true },
    { label: '毛重(KG)', prop: 'grossWeight', width: '195', sortable: true },
    { label: '净重(KG)', prop: 'netWeight', width: '175', sortable: true },
    { label: '规格型号', prop: 'model', width: '180' },
    { label: '单位价格', prop: 'unitValue', width: '135', sortable: true },
    { label: '报关品名', prop: 'customsName', width: '200' },
    { label: '报关价格', prop: 'customsValue', width: '175', sortable: true },
    { label: '币种代码', prop: 'currency', width: '175' },
    { label: '危险类型', prop: 'dangerName', width: '155', sortable: true },
    { label: '带电类型', prop: 'electrifiedName', width: '175', sortable: true },
    { label: '原产国代码', prop: 'originCountry', width: '230', sortable: true },
    { label: '海关编码', prop: 'hsCode', width: '125', sortable: true },
    { label: '行邮税号', prop: 'taxCode', width: '175' },
    { label: '计量单位', prop: 'unit', width: '210' },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '周转率', prop: 'turnoverRate', width: '175', sortable: true },
    { label: '周转率等级', prop: 'turnoverLevel', width: '175', sortable: true },
    { label: '周期订单量', prop: 'orderQty', width: '230', sortable: true },
    { label: '周期出货量', prop: 'outQty', width: '260', sortable: true },
    { label: '统计周期起始', prop: 'statsBegin', width: '220', sortable: true },
    { label: '统计周期截至', prop: 'statsEnd', width: '210', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
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
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑SKU',
        params: { id: row.id, name: row.sku },
    })
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    router.push('/base/sku/sku/add')
}
// 审核
const auditDialogVisible = ref(false);
const auditStatusId = ref('');
const auditStatusOptions = ref([])
const handleAudit = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要审核的数据！'
        });
        return;
    }
    auditDialogVisible.value = true;
}
// 审核确定
const audit = async () => {
    if (!auditStatusId.value) {
        smartAlert('请选择审核状态', false)
        return;
    }
    delDataMsg.value = '更新成功'
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await api.updateSkuStatusApi({ id: selectionRows.value[i].id, statusId: auditStatusId.value })
        console.log('审核数据:', res)
        delData.value.push({
            id: selectionRows.value[i].sku,
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
    auditStatusId.value = '';
    auditDialogVisible.value = false;
}
// 打印
const printDialogRef = ref(null)
const handlePrint = async () => {
    printDialogRef.value.openPrintDialog()
}
// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 111, typeName: 'SKU创建' },
    })
}
const handleImportUpd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 112, typeName: 'SKU更新' },
    })
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
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
            delData.value = [];
            promptMessage.value = '操作中...'
            delDataMsg.value = '删除成功'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await api.delSkuSkuDataApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].sku,
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
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await api.getSkuSkuListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    // console.log('表格数据:', tableData.value)
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    loading.value = false
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
    const result = await api.getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
// 状态数据
const statusMenu = ref([])

const cusStatusOptions = ref([])
const isNewOptions = ref([
    { label: '是', value: true },
    { label: '否', value: false }
])
const isCheckedSizeOptions = ref([
    { label: '是', value: true },
    { label: '否', value: false }
])
const dangerOptions = ref([])
const electrifiedOptions = ref([])
onMounted(async () => {
    // 获取状态菜单
    const res = await api.getSkuStatusEnumListApi()
    statusMenu.value = res.data.map(item => ({ label: item.name, value: item.id }))
    formConfig.value[0] = {
        ...formConfig.value[0],
        options: statusMenu.value,
    }
    auditStatusOptions.value = statusMenu.value
    const result = await api.getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    // 获取客户状态
    const cusStatusRes = await api.getSkuCusStatusEnumListApi()
    cusStatusOptions.value = cusStatusRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取危险类型
    const dangerRes = await api.getSkuDangerEnumListApi()
    dangerOptions.value = dangerRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取带电类型
    const electrifiedRes = await api.getSkuElectrifiedEnumListApi()
    electrifiedOptions.value = electrifiedRes.data.map(item => ({ label: item.name, value: item.id }))
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
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshSkuList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshSkuList = false
    }
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>