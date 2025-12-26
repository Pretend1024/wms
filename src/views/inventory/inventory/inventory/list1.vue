<template>
    <div class="viewArea">
        <div class="filterDiv">
            <!-- <div class="tags">
                <div style="background-color: white;" @click="tagsItemClick(item)" v-for="item in tags"
                    :key="item.value" :class="{ active: item.value == view }">
                    <div class="tagsItem"
                        :class="{ active: item.value == view, activeNext: item.value == view + 1, activeLast: item.value == view - 1 }"
                        type="warning" effect="light">
                        {{ item.label }}
                    </div>
                </div>
            </div> -->

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
                        <el-form-item :label="getLabel('warehouseCodeList')">
                            <el-select v-model="formData.warehouseCodeList"
                                :placeholder="getPlaceholder('warehouseCodeList')" clearable multiple collapse-tags>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCodeList')">
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCodeList')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('businessId')">
                            <el-select v-model="formData.businessId" :placeholder="getPlaceholder('businessId')"
                                clearable>
                                <el-option v-for="item in businessOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('sourceNoList')">
                            <canonicalInput v-model:listName="formData.sourceNoList"
                                :placeholder="getPlaceholder('sourceNoList')" clearable>
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
                            <canonicalInput v-model:listName="formData.barcodeList"
                                :placeholder="getPlaceholder('barcode')" clearable>
                            </canonicalInput>
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
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('qtyTotalMin')">
                            <el-input v-model="formData.qtyTotalMin" :placeholder="getPlaceholder('qtyTotalMin')"
                                v-number></el-input>
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
                @sort-change="handleTableSort" :strikeCondition="row => row.qty == 0"
                :excludeStrikeProps="['序号', 'action']">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="warning" @click="handleLock" :icon="Lock">{{ getButtonText('freeze') }}</el-button>
                    <el-button type="warning" @click="handleUnLock" :icon="Unlock">{{ getButtonText('unfreeze')
                    }}</el-button>
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
                        <el-dropdown v-if="view == 1">
                            <span class="cursor-pointer">
                                {{ getButtonText('operate') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleQtyEdit(row, 'lock')">{{
                                        getButtonText('lockQuantity') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="handleQtyEdit(row, 'total')">{{
                                        getButtonText('adjustQuantity') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>
                <template #skuName="{ row }">
                    {{ row.skuNameCn + ' ' + row.skuNameEn }}
                </template>
                <template #status="{ row }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #qtyTotal="{ row }">
                    <el-popover trigger="hover" placement="top" width="auto" @show="getQtyPopoverData(row, 1)"
                        :show-after="600">
                        <template #reference>
                            <p style="cursor: pointer;color: blue;">{{ row.qtyTotal }}</p>
                        </template>
                        <qtyTable :data="qtyPopoverDataMap.get(`${row.id}_1`)?.data || []"
                            :loading="qtyPopoverDataMap.get(`${row.id}_1`)?.loading || false" />
                    </el-popover>
                </template>

                <template #qtyAvail="{ row }">
                    <el-popover trigger="hover" placement="top" width="auto" @show="getQtyPopoverData(row, 2)"
                        :show-after="600">
                        <template #reference>
                            <p style="cursor: pointer;color: blue;">{{ row.qtyAvail }}</p>
                        </template>
                        <qtyTable :data="qtyPopoverDataMap.get(`${row.id}_2`)?.data || []"
                            :loading="qtyPopoverDataMap.get(`${row.id}_2`)?.loading || false" />
                    </el-popover>
                </template>

                <template #qtyLock="{ row }">
                    <el-popover trigger="hover" placement="top" width="auto" @show="getQtyPopoverData(row, 3)"
                        :show-after="600">
                        <template #reference>
                            <p style="cursor: pointer;color: blue;">{{ row.qtyLock }}</p>
                        </template>
                        <qtyTable :data="qtyPopoverDataMap.get(`${row.id}_3`)?.data || []"
                            :loading="qtyPopoverDataMap.get(`${row.id}_3`)?.loading || false" />
                    </el-popover>
                </template>

            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" title="库存日志" width="1200" align-center destroy-on-close>
            <div style="height: 530px;">
                <LogForm :formData="addData" :view="view"></LogForm>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 锁定/调整数量弹窗 -->
        <el-dialog v-model="qtyDialogVisible" :title="dialogTitle" width="800" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="qtyChildFormRef" :id="qtyDataId"
                :customerOptions="initialFilteredOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="qtyDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleQtyDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues"
            :extraParams="{ view }" :exportType="300">
        </exportDialog>
        <!-- 取消 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'SKU (库位)'" :successValue="successValue" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="详细库存">
import { Share, Unlock, Lock } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi, getWhZoneEnumApi } from '@/api/baseApi/wh.js'
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import selectInput from '@/components/table/selectInput.vue'
import LogForm from './logTable.vue';
import qtyTable from './qtyTable.vue';
import qtyLockForm from './qtyLockForm.vue';
import qtyTotalForm from './qtyTotalForm.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js';
import { getInventoryInventoryPageApi, getInventoryInventoryStatusApi, postInventoryInventoryUnlockApi, postInventoryInventoryLockApi, getInventoryListQtyDetailPageApi, getInventoryInventoryInventoryViewEnumApi, postInventoryInventoryAdjustQtyApi, postInventoryInventoryLockQtyApi, getInventoryInventoryCreateWayEnumApi } from '@/api/inventoryApi/inventory.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', prop: 'createWay', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

const tags = ref([])
const tagsItemClick = (item) => {
    loading.value = true;
    view.value = item.value
    console.log(view.value)
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, false);
}
const view = ref(1)

// 初始化表单数据
const initValues = ref({
    qtyTotalMin: 1,
    way: 'locationCodeLike',
    orgId: '',
})

const way = ref([
    { label: '库位', value: 'locationCodeLike' },
    { label: 'SKU', value: 'skuLike' }
])

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;

    initValues.value = data;
    // 定义所有可能的字段
    const fields = way.value.map(item => item.value);
    // 筛选出需要删除的字段（排除当前选中的way）
    const fieldsToDelete = fields.filter(field => field !== data.way);
    // 循环删除不需要的字段
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerName', width: '200', slot: 'customer', fixed: 'left' },
    { label: '状态', prop: 'statusName', width: '110', sortable: true, slot: 'status' },
    { label: '库区', prop: 'zoneCode', width: '115' },
    { label: '库位', prop: 'locationCode', width: '180', sortable: true },
    { label: 'sku', prop: 'sku', width: '150' },
    { label: '条码', prop: 'barcode', width: '160', sortable: true },
    { label: '品质', prop: 'qualityName', width: '125', sortable: true },
    { label: '总数', prop: 'qtyTotal', width: '125', sortable: true, slot: 'qtyTotal' },
    { label: '可用数', prop: 'qtyAvail', width: '135', sortable: true, slot: 'qtyAvail' },
    { label: '锁定数', prop: 'qtyLock', width: '145', sortable: true, slot: 'qtyLock' },
    { label: '业务类型', prop: 'businessName', width: '120', sortable: true, sortAlias: 'businessId' },
    { label: '来源单号', prop: 'sourceNo', width: '150', sortable: true },
    { label: '批次号', prop: 'batchNo', width: '110' },
    { label: '上架日期', prop: 'inShelfDate', width: '200' },
    { label: '品名', prop: 'skuName', width: '170', sortable: true, slot: 'skuName' },
    { label: 'sku长', prop: 'length', width: '150', sortable: true },
    { label: 'sku宽', prop: 'width', width: '150', sortable: true },
    { label: 'sku高', prop: 'height', width: '150', sortable: true },
    { label: 'sku体积', prop: 'skuVolume', width: '145', sortable: true },
    { label: '创建方式', prop: 'createWayName', width: '160', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '130', fixed: 'right', slot: 'customBtn' }
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
}
// 编辑
const handleEdit = (row) => {

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

// 冻结和解冻相关
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const successValue = ref('冻结成功')
const handleLock = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要冻结的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要冻结${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
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
            successValue.value = '冻结成功'
            for (let i = 0; i < selectionRows.value.length; i++) {
                console.log('冻结的行数据:', { id: selectionRows.value[i].id })
                const res = await postInventoryInventoryLockApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].sku + ' ( ' + selectionRows.value[i].locationCode + ' )',
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
// 解除冻结
const handleUnLock = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要解除冻结的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要解除冻结${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
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
            successValue.value = '解除冻结成功'
            for (let i = 0; i < selectionRows.value.length; i++) {
                console.log('解除冻结的行数据:', { id: selectionRows.value[i].id })
                const res = await postInventoryInventoryUnlockApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].sku + ' ( ' + selectionRows.value[i].locationCode + ' )',
                    msg: res.msg,
                    success: res.success
                });
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
};


// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});


// 数量调整弹窗相关
const qtyDialogVisible = ref(false);
const qtyDataId = ref({});
const qtyChildFormRef = ref(null);
// 区分锁定和调整数量的模式
const dialogMode = ref('lock');
const dialogTitle = computed(() => dialogMode.value === 'lock' ? '锁定数量' : '调整数量');
const currentForm = computed(() => dialogMode.value === 'lock' ? qtyLockForm : qtyTotalForm);

// 锁定/调整数量
const handleQtyEdit = (row, mode) => {
    dialogMode.value = mode;
    qtyDataId.value = row.id;
    qtyDialogVisible.value = true;
}

// 确认锁定/调整数量
const handleQtyDialogConfirm = async () => {
    const data = qtyChildFormRef.value.getResult()
    const res = dialogMode.value === 'lock' ? await postInventoryInventoryLockQtyApi(data) : await postInventoryInventoryAdjustQtyApi(data);
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        qtyDialogVisible.value = false;
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value, true);
    }
}

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 获取数量明细
// 存储每行的详情数据缓存
const qtyPopoverDataMap = reactive(new Map()) // key: `${row.id}_${type}` => { loading, data }

const getQtyPopoverData = async (row, type) => {
    const key = `${row.id}_${type}`
    qtyPopoverDataMap.set(key, { loading: true, data: [] })
    const res = await getInventoryListQtyDetailPageApi({ qtyType: type, view: view.value, inventoryId: row.id })
    if (res.success) {
        qtyPopoverDataMap.set(key, { loading: false, data: res.data || [] })
    } else {
        qtyPopoverDataMap.set(key, { loading: false, data: [] })
    }
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy, isparameter) => {
    const requestData = {
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        view: view.value,
    };

    // 根据 isparameter 的值决定是否合并 initValues
    if (isparameter) {
        Object.assign(requestData, trimObjectStrings(initValues.value));
    }

    const res = await getInventoryInventoryPageApi(requestData);
    tableData.value = res.data.rows;
    footer.value = res.data.footer[0];
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
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
const initialFilteredOptions = ref([])
// 品质
const qualityOptions = ref([])
// 状态
const statusOptions = ref([])
// 业务类型
const businessOptions = ref([])

onMounted(async () => {
    // 初始化标签数据
    // const res = await getInventoryInventoryInventoryViewEnumApi()
    // tags.value = res.data.map(item => ({ label: item.name, value: item.id }))
    // 客户数据
    const customerRes = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
    // 库区数据
    const zoneEnumRes = await getWhZoneEnumApi({ warehouseCode: '' });
    zoneEnumOptions.value = zoneEnumRes.data;
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
    // 业务类型
    const businessRes = await getInstockInOrderBusinessEnumApi()
    businessOptions.value = businessRes.data.map(item => ({ label: item.name, value: item.id }))
    // 品质
    const qualityRes = await getOrderQualityEnumApi()
    qualityOptions.value = qualityRes.data.map(item => ({ label: item.name, value: item.id }))
    // 获取状态数据
    const statusRes = await getInventoryInventoryStatusApi();
    statusOptions.value = statusRes.data.map(item => ({ label: item.name, value: item.id }))
    // 创建方式
    const createWayRes = await getInventoryInventoryCreateWayEnumApi();
    formConfig.value[0].options = createWayRes.data.map(item => ({ label: item.name, value: item.id }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.tags {
    display: flex;
    font-size: 17px;
    color: #474849;

    .tagsItem {
        padding: 5px 15px;
        background-color: #f0f1f3;
        // 字体
        font-family: sans-serif;
        cursor: pointer;
        transition: all 0.5s ease;
    }

    .active {
        background-color: white;
        border-radius: 15px 15px 0 0;
        color: #ff914e;
        transform: translateY(0);
    }

    .activeNext {
        border-radius: 0 0 0 15px;
    }

    .activeLast {
        border-radius: 0 0 15px 0;
    }
}

:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>