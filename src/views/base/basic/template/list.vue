<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData, getColSpan }">
                    <el-col>
                        <el-form-item :label="getLabel('atypeId')">
                            <el-select v-model="formData.atypeId" value-key="id"
                                :placeholder="getPlaceholder('atypeId')" @change="getBType">
                                <el-option v-for="item in templateATypeOptions" :key="item.id" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('btypeId')">
                            <el-select v-model="formData.btypeId" value-key="id"
                                :placeholder="getPlaceholder('btypeId')" filterable popper-class="multi-column-select">
                                <el-option v-for="item in templateBTypeOptions" :key="item.id" :label="item.label"
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
                @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <!-- <el-button type="danger" @click="handleDel" :icon="Delete">{{getButtonText ('del') }}</el-button> -->
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #fileUrl="{ row }">
                    <a :href="toDownloadTempPath(row.fileUrl)" target="_blank" class="ellipsis-link">{{
                        row.fileUrl }}</a>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId == 1 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
                <template #cusStatusName="{ row }">
                    <span :style="{ color: row.cusStatusId == 20 ? 'green' : 'red' }">{{ row.cusStatusName }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData"
                :templateATypeOptions="templateATypeOptions" :statusOptions="statusOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup name="模板">
import { Plus, Delete } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { toDownloadTempPath } from '@/utils/downLoad.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { getBasicTemplateListApi, getBasicTemplateATypeEnumApi, getBasicTemplateBTypeEnumApi, getBasicTemplateStatusEnumApi, addBasicTemplateApi, updBasicTemplateApi } from '@/api/baseApi/basic.js'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({
    atypeId: '',
    btypeId: '',
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
    templateBTypeOptions.value = []
}
// 表格数据--------------------------------------
const tableData = ref([])
// 表格列配置
const columns = ref([
    { label: '模板类型', prop: 'atypeName', width: '180', fixed: 'left', sortable: true },
    { label: '数据类型', prop: 'btypeName', width: '125', fixed: 'left', sortable: true },
    { label: '数据类型id', prop: 'btypeId', width: '180', fixed: 'left', sortable: true },
    { label: '状态', prop: 'statusName', width: '120', fixed: 'left', sortable: true, slot: 'statusName' },
    { label: '模板名称', prop: 'name', width: '180', sortable: true, fixed: 'left' },
    { label: '模板文件', prop: 'fileUrl', width: '180', slot: 'fileUrl' },
    { label: '备注', prop: 'remark', width: '400' },
    { label: '排序', prop: 'sortNo', width: '125', sortable: true },
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
// 弹窗
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_basic_template_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

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
        let res;
        if (addData.value.id) {
            res = await updBasicTemplateApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addBasicTemplateApi(addData.value);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
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
// 编辑
const handleEdit = (row) => {
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
        atypeId: '',
        btypeId: '',
        statusId: '',
        name: '',
        fileUrl: '',
        remark: '',
        sortNo: ''
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicTemplateListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = res.data.rows
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}


// 模板类型
const templateATypeOptions = ref([])
// 数据类型
const templateBTypeOptions = ref([])
// 状态
const statusOptions = ref([])
// 获取数据类型
const getBType = async (e) => {
    const res = await getBasicTemplateBTypeEnumApi({ atypeId: e })
    templateBTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
}

onMounted(async () => {
    // 获取状态菜单
    const res = await getBasicTemplateStatusEnumApi()
    statusOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    formConfig.value[0].options = statusOptions.value
    // 获取模板类型菜单
    const res2 = await getBasicTemplateATypeEnumApi()
    templateATypeOptions.value = res2.data.map(item => ({ label: item.name, value: item.id }))
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.ellipsis-link {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
</style>