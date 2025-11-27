<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'messageContent:add'" :icon="Plus">
                        {{ getButtonText('add') }}
                    </el-button>
                    <el-button type="danger" @click="handleDel" :icon="DeleteFilled">
                        {{ getButtonText('del') }}
                    </el-button>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <span>{{ getButtonText('detail') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDownload(row)" v-if="row.fileUrl">
                            <span>{{ getButtonText('attachment') }}</span>
                        </div>
                    </div>
                </template>
                <template #link="{ row }">
                    <!-- 新页面打开 -->
                    <a :href="row.link" target="_blank">{{ row.link }}</a>
                </template>
                <template #fileUrl='{ row, column, index }'>
                    <a :href="toDownloadTempPath(row.fileUrl)" target="_blank">{{ row.fileUrl }}</a>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="900" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :notifyScopeOptions="notifyScopeOptions"
                :typeOptions="typeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ addData.id ? getButtonText('close') :
                        getButtonText('cancel') }}</el-button>
                    <el-button v-show="!addData.id" type="primary" @click="handleDialogConfirm">{{ getButtonText
                        ('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 批量删除弹窗组件 -->
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'标题'"
            :successValue="'删除成功'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='消息通知'>
import { ref, computed, onMounted } from 'vue';
import { Plus, DeleteFilled } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import AddForm from './add.vue';
import CheckForm from './check.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { toDownloadTempPath } from '@/utils/downLoad.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getMessageContentPageListApi, getMessageContentTypeEnumApi, getMessageContentNotifyScopeEnumApi, addMessageContentApi, delMessageContentApi, getMessageContentByIdApi } from '@/api/sysApi/user.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'select', label: '通知范围', prop: 'notifyScopeId', options: [] },
    { type: 'select', label: '消息类型', prop: 'typeId', options: [] },
    { type: 'input', label: '标题', prop: 'title' },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    notifyScopeId: '',
    typeId: '',
    title: ''
});

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data
    };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    };
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};
// 表格数据与列配置
const tableData = ref([]);
const columns = ref([
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '消息类型', prop: 'typeName', width: '160', sortable: true },
    { label: '标题', prop: 'title', width: '250' },
    { label: '内容', prop: 'content', width: '500' },
    { label: '链接', prop: 'link', width: '220', slot: 'link' },
    { label: '附件', prop: 'fileUrl', width: '220', slot: 'fileUrl' },
    { label: '通知范围', prop: 'notifyScopeName', width: '145', sortable: true },
    { label: '指定用户', prop: 'notifyUser', width: '200' },
    { label: '提醒方式', prop: 'notifyWayName', width: '145' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '130', fixed: 'right', slot: 'customBtn' }
]);
const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
});
const loading = ref(true);

// 选择及排序数据
const selection = ref({});
const selectionRows = ref([]);
const orderBy = ref('');

// 表格事件方法
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
    console.log('选中的数据：', selectionRows.value);
};
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize;
    pagination.value.currentPage = currentPage;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString);
    orderBy.value = sortString;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({
    id: null,
    title: '',
    content: '',
    link: '',
    fileUrl: '',
    notifyScopeId: '',
    notifyWayId: '',
    notifyUser: '',
    typeId: '',
    notifyUser: ''
});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'check'
const dialogTitle = computed(() => t(`sys_msg_messageContent_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : CheckForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        title: '',
        content: '',
        link: '',
        fileUrl: '',
        notifyScopeId: '',
        notifyWayId: '',
        notifyUser: '',
        typeId: '',
        notifyUser: ''
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑按钮
const handleEdit = async (row) => {
    const res = await getMessageContentByIdApi({ id: row.id });
    addData.value = {
        ...res.data,
    };
    dialogMode.value = 'check';
    centerDialogVisible.value = true;
};
// 下载按钮
const handleDownload = (row) => {
    window.open(toDownloadTempPath(row.fileUrl), '_blank')
};

// 批量删除相关
const delData = ref([]);
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
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delMessageContentApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].title,
                    msg: res.msg,
                    success: res.success
                });

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

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    // 判断addData.value.content的值是否是<p><br></p>，如果是，则将其置为空字符串
    if (addData.value.content === '<p><br></p>') {
        smartAlert('内容不能为空', false);
        return;
    }
    try {
        await childFormRef.value.validate();
        const bodyLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
        })
        loading.value = true;
        let res = await addMessageContentApi(addData.value);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            centerDialogVisible.value = false;
        } else {
            loading.value = false;
        }
        bodyLoading.close();
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getMessageContentPageListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    });
    tableData.value = res.data.rows;
    loading.value = false;
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    };
};
// 获取枚举数据
const notifyScopeOptions = ref([]);
const typeOptions = ref([]);
onMounted(async () => {
    const typeEnumRes = await getMessageContentTypeEnumApi()
    formConfig.value[1].options = typeEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    typeOptions.value = formConfig.value[1].options
    const scopeEnumRes = await getMessageContentNotifyScopeEnumApi()
    formConfig.value[0].options = scopeEnumRes.data.map(item => ({ value: item.id, label: item.name }));
    notifyScopeOptions.value = formConfig.value[0].options
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>