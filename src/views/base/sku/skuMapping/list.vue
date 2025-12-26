<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('orgId')" class="compact-item">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')" class="compact-item">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('platformSkuList')">
                            <canonicalInput v-model:listName="formData.platformSkuList"
                                :placeholder="getPlaceholder('platformSkuList')" clearable>
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                        getButtonText('del') }}</el-button>
                    <el-button type="success" @click="handleImportAdd" v-permission="'importAdd'"
                        :icon="UploadFilled">{{ getButtonText('import')
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
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData"
                :customerOptions="initialFilteredOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'平台Sku'"
            :successValue="delDataMsg" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="SKU映射">
import { Plus, Delete, UploadFilled } from '@element-plus/icons-vue'
import * as api from '@/api/baseApi/sku.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import router from '@/router/index.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    customerCode: '',
    platformSkuList: [],
    skuList: [],
    orgId: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
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
// 表格列配置
const columns = ref([
    { label: '公司', prop: 'orgName', width: '185', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerName', width: '200', fixed: 'left', slot: 'customer' },
    { label: '平台Sku', prop: 'platformSku', width: '250', sortable: true },
    { label: 'sku', prop: 'sku', width: '250', sortable: true },
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
    console.log('编辑：', row);
    // 将当前行数据填充到表单数据中
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {
        id: null,
        platformSku: '',
        items: [],
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_sku_skuMapping_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);


// 删除
const delData = ref([]);
const delDataMsg = ref('删除成功')
const delDialogVisible = ref(false);
const promptMessage = ref('')
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
                const res = await api.delSkuMappingDataApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].platformSku,
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
// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 113, typeName: '导入创建sku映射' },
    })
}
// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const data = { ...addData.value, items: childFormRef.value.getTableData() };
        loading.value = true;
        let res;
        if (data.id) {
            res = await api.updateSkuMappingDataApi(data);
        } else {
            res = await api.addSkuMappingDataApi(data);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        smartAlert(res.msg, res.success, 1000)
        loading.value = false;
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
    const res = await api.getSkuMappingListApi({
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
    const result = await api.getCustomerLikeQueryApi({ keyword: '*', orgId: e });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);
const initialFilteredOptions = ref([])

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
    const result = await api.getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
    initialFilteredOptions.value = JSON.parse(JSON.stringify(customerOptions.value));
    companyOptions.value = convertToTree(companyRes.data);
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>