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
                        <el-form-item :label="getLabel('warehouseCodeList')">
                            <el-select v-model="formData.warehouseCode"
                                :placeholder="getPlaceholder('warehouseCodeList')" clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCodeList')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCodeList')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('adjustNoList')">
                            <canonicalInput v-model:listName="formData.adjustNoList"
                                :placeholder="getPlaceholder('adjustNoList')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable ref="hydTableRef" :footer="footer" :tableData="tableData" :columns="columns"
                :pagination="pagination" :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort" :strikeCondition="row => row.qty == 0"
                :excludeStrikeProps="['序号', 'action']" :preserveExpanded="true" @expand="handleTableExpand">

                <template #expand="{ row }">
                    <!-- 关键：判断行是否展开，展开才渲染子组件 -->
                    <component v-if="expandedRowIds.has(row.id)" :is="currentForm" :id="row.id" :view="view"
                        :is-expanded="true" />
                </template>
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                    }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <!-- 备注 -->
                        <div class="cursor-pointer" @click="handleRemark(row)">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('remark') }}</span>
                        </div>
                        <!-- 生效 -->
                        <div class="cursor-pointer" @click="(row.statusId == 10) && handleEffective(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10) }">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('effective') }}</span>
                        </div>
                        <!-- 失效 -->
                        <div class="cursor-pointer" @click="(row.statusId == 10) && handleInvalid(row)"
                            :class="{ 'btnDisable': !(row.statusId == 10) }">
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>{{ getButtonText('invalid') }}</span>
                        </div>
                        <!-- 详情 -->
                        <div class="cursor-pointer" @click.stop="handleDetail(row)" v-show="!row.isExpanded">
                            <el-icon>
                                <Connection />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click.stop="handleDetailClose(row)" v-show="row.isExpanded">
                            <el-icon>
                                <Connection />
                            </el-icon>
                            <span>{{ getButtonText('close') }}</span>
                        </div>
                    </div>
                </template>
                <template template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName ? row.customerName : '无' }})
                </template>

                <template #status="{ row }">
                    <span :style="{ color: row.statusId == 20 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="306">
        </exportDialog>
    </div>
</template>
<script setup name="调整">
import { getAdjustTypeApi, getAdjustStatusApi, getAdjustPageApi, updateRemarkApi, executeApi, cancelApi } from '@/api/inventoryApi/inventory.js'
import { Share } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import listDetail from './listDetail.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '盘点单号', prop: 'inventoryCheckNo', placeholder: '请输入盘点单号' },
    { type: 'select', label: '盘点类型', prop: 'typeId', placeholder: '请选择盘点类型', options: [] },
    { type: 'select', label: '状态', prop: 'statusId', placeholder: '请选择状态', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false, offsetDays: 30 },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = data;
    // 判断是否有orgId，没有则删除
    if (!data.orgId) {
        delete initValues.value.orgId;
    } else {
        initValues.value.orgId = data.orgId[data.orgId.length - 1]
    }

    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    { label: '调整单号', prop: 'adjustNo', width: '130', fixed: 'left' },
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    { label: '仓库代码', prop: 'warehouseCode', width: '135', sortable: true, fixed: 'left' },
    { label: '客户', prop: 'customerCode', width: '200', slot: 'customer', fixed: 'left' },
    { label: '盘点单号', prop: 'inventoryCheckNo', width: '180' },
    { label: '调整类型', prop: 'typeName', width: '110', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'status' },
    { label: '总增加数量', prop: 'totalAdd', width: '130', sortable: true },
    { label: '总减少数量', prop: 'totalSub', width: '130', sortable: true },
    { label: 'SKU个数', prop: 'skuQty', width: '115', sortable: true },
    { label: '库位个数', prop: 'locationQty', width: '115', sortable: true },
    { label: '备注', prop: 'remark', width: '200' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '250', fixed: 'right', slot: 'customBtn' }
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}

const expandedRowIds = ref(new Set());

// 新增：处理展开/收起事件
const handleTableExpand = (row, expanded) => {
    const rowId = row.id;
    if (expanded) {
        expandedRowIds.value.add(rowId); // 展开：添加到Set
    } else {
        expandedRowIds.value.delete(rowId); // 收起：从Set移除
    }
};

// 备注
const handleRemark = async (row) => {
    ElMessageBox.prompt(
        `请输入备注信息：`,
        '添加备注',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            inputPlaceholder: '请输入备注',
        }
    )
        .then(async ({ value }) => {
            // value为用户输入的备注内容
            if (!value) {
                ElMessage({
                    type: 'warning',
                    message: '请输入备注信息！'
                });
                return;
            }
            const remark = value.trim();
            const res = await updateRemarkApi({ id: row.id, remark });
            smartAlert(res.msg, res.success, 1000);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

// 生效
const handleEffective = async (row) => {
    ElMessageBox.confirm(
        `是否确定生效?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await executeApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 作废
const handleInvalid = async (row) => {
    ElMessageBox.confirm(
        `是否作废生效?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await cancelApi({ id: row.id });
            smartAlert(res.msg, res.success, 1000);
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])


const currentForm = listDetail;
const hydTableRef = ref(null);
// 查看详情
const handleDetail = (row) => {
    hydTableRef.value.expandRowByKey(row.id);
}
const handleDetailClose = (row) => {
    hydTableRef.value.collapseRowByKey(row.id);
}

// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const requestData = {
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...initValues.value
    };
    const res = await getAdjustPageApi(requestData);
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

onMounted(async () => {
    // 客户数据
    const customerRes = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = customerRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
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
    // 状态
    const statusRes = await getAdjustStatusApi()
    formConfig.value[2].options = statusRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))

    // 类型
    const typeEnumRes = await getAdjustTypeApi({});
    formConfig.value[1].options = typeEnumRes.data.map(item => ({
        label: item.name,
        value: item.id
    }))
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