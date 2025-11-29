<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('codeList')">
                            <canonicalInput v-model:listName="formData.codeList"
                                :placeholder="getPlaceholder('codeList')" clearable>
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
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="success" @click="handleDel(10)" :icon="Edit">{{ getButtonText('enable')
                        }}</el-button>
                    <el-button type="danger" @click="handleDel(20)" :icon="Edit">{{ getButtonText('disable')
                        }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleInfo(row)">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #code="{ row }">
                    <span>{{ row.code }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #statusName="{ row, column, index }">
                    <span :style="{ color: row.statusId == 10 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1300" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :statusOptions="statusOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button v-if="dialogMode != 'info'" type="primary" @click="handleDialogConfirm">{{ getButtonText
                        ('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 删除 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'承运商代码'" :successValue="delDataMsg" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="承运商">
import { Plus, Edit, Share } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getProductShipwayBrandPageApi, getProductShipwayBrandStatusEnumApi, getProductSupplierTypeEnumApi, getProductSupplierAccountListApi, getProductSupplierChannelListApi, updProductSupplierChannelApi, updProductSupplierAccountApi, addProductShipwayBrandApi, getProductShipwayBrandInfoApi, updProductShipwayBrandApi, setProductShipwayCarrierUpdateStatusApi } from '@/api/productApi/shipway.js'
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import InfoForm from './info.vue';
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '承运名称', prop: 'name', clearable: true },
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true }
])

// 初始化表单数据
const initValues = ref({
    codeList: [],
    name: '',
    statusId: '',
    createdTimeBegin: '',
    createdTimeEnd: ''
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '承运商代码', width: '150', prop: 'code', fixed: 'left', sortable: true },
    { label: '承运商名称', width: '150', prop: 'name', fixed: 'left', sortable: true },
    { label: '状态', prop: 'statusName', width: '100', sortable: true, slot: 'statusName' },
    { label: '备注', prop: 'remark', width: '225' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '145', fixed: 'right', slot: 'customBtn' }
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

// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`product_shipway_carrier_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : dialogMode.value == 'upd' ? UpdForm : InfoForm);

// 编辑按钮
const handleEdit = async (row) => {
    const res = await getProductShipwayBrandInfoApi({ id: row.id })
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...res.data,
        carrierServiceAddDTOList: res.data.carrierServiceList
    };
    console.log('编辑数据:', addData.value);
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};
// 详情按钮
const handleInfo = async (row) => {
    const res = await getProductShipwayBrandInfoApi({ id: row.id })
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...res.data,
        carrierServiceAddDTOList: res.data.carrierServiceList
    };
    console.log('详情数据:', addData.value);
    dialogMode.value = 'info';
    centerDialogVisible.value = true;
}
// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    console.log('提交数据:', addData.value);
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validateMain();
        await childFormRef.value.validateServices();
        const bodyLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
        })
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updProductShipwayBrandApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addProductShipwayBrandApi(addData.value);
        }
        if (res.success) {
            ElMessage({
                type: 'success',
                message: res.msg,
            });
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);

        } else {
            loading.value = false;
            centerDialogVisible.value = true;
            ElMessageBox.alert(res.msg, '提醒', {
                confirmButtonText: '确定',
                type: 'warning'
            });
        }
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

// 删除
const delData = ref([]);
const delDataMsg = ref('删除成功')
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleDel = (statusId) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要更改的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要${statusId == 10 ? '启用' : '停用'}${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDataMsg.value = '更新状态成功'
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await setProductShipwayCarrierUpdateStatusApi({ id: selectionRows.value[i].id, statusId: statusId });
                delData.value.push({
                    id: selectionRows.value[i].code + '-' + selectionRows.value[i].name,
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

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {
        id: null,
        code: '',
        remark: '',
        name: '',
        statusId: '',
        carrierServiceAddDTOList: [],
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
const dataId = ref('')
// 账号
const AccountDialogVisible = ref(false)
const accountListRef = ref(null)
const supplierAccountAddDTOList = ref([])
const handleDeleteAccount = (index) => {
    supplierAccountAddDTOList.value.splice(index, 1)
}
// 新增账号
const handleSubmitAccount = () => {
    supplierAccountAddDTOList.value.push({
        account: '',
        password: '',
        orgId: '',
        owner: '',
        apiId: '',
        statusId: '',
        apiConfig: ''
    });
}
const openAccount = async (row) => {
    dataId.value = row.id
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const res = await getProductSupplierAccountListApi({ supplierId: row.id })
    supplierAccountAddDTOList.value = res.data
    loading.close()
    AccountDialogVisible.value = true;
}
// 保存账号
const handleSaveAccount = async () => {
    if (supplierAccountAddDTOList.value.length) {
        await accountListRef.value.validateForms()
    }
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const processedAccounts = supplierAccountAddDTOList.value.map(item => {
        const newItem = { ...item };
        if (Array.isArray(newItem.orgId)) {
            newItem.orgId = newItem.orgId[newItem.orgId.length - 1];
        }
        return newItem;
    });

    const data = {
        supplierId: dataId.value,
        supplierAccountUpdDTOList: processedAccounts
    };
    console.log('保存账号:', data)
    const res = await updProductSupplierAccountApi(data)
    smartAlert(res.msg, res.success, 1000)
    loading.close()
    if (res.success) {
        AccountDialogVisible.value = false;
    }
}

// 渠道
const ChannelDialogVisible = ref(false)
const channelListRef = ref(null)
const supplierChannelAddDTOList = ref([])
const handleDelChannel = (index) => {
    supplierChannelAddDTOList.value.splice(index, 1)
}
// 新增渠道
const handleSubmitChannel = () => {
    supplierChannelAddDTOList.value.push({
        code: '',
        name: '',
        remake: ''
    });
}
const openChannel = async (row) => {
    dataId.value = row.id
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const res = await getProductSupplierChannelListApi({ supplierId: row.id })
    console.log(res)
    supplierChannelAddDTOList.value = res.data
    console.log('渠道数据:', supplierChannelAddDTOList.value)
    loading.close()
    ChannelDialogVisible.value = true;
}

// 保存渠道
const handleSaveChannel = async () => {
    if (supplierChannelAddDTOList.value.length) {
        await channelListRef.value.validateForms()
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    const data = {
        supplierId: dataId.value,
        supplierChannelUpdDTOList: supplierChannelAddDTOList.value
    }
    console.log('保存渠道:', data)

    const res = await updProductSupplierChannelApi(data)
    smartAlert(res.msg, res.success, 1000)
    loading.close()
    if (res.success) {
        ChannelDialogVisible.value = false;
    }
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getProductShipwayBrandPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    // console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 承运商状态
const statusOptions = ref([])
onMounted(async () => {
    // 获取状态
    const res = await getProductShipwayBrandStatusEnumApi()
    statusOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    formConfig.value[1].options = statusOptions.value

})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshSupplierList) {
        console.log('刷新数据')
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshSupplierList = false
    }
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>