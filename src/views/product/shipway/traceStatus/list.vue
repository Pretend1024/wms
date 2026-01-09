<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('statusId')">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')" filterable>
                                <el-option v-for="item in traceNodeOptions" :key="item.value" :label="item.label"
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
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{
                        getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{
                        getButtonText('del') }}</el-button>
                    <el-button type="warning" @click="handleRefresh" :icon="Refresh">{{ getButtonText('refreshCache')
                        }}</el-button>
                    <el-button type="success" @click="handleTest" :icon="Connection">{{ getButtonText('test')
                        }}</el-button>
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
                <template #isEnable="{ row }">
                    <span :style="{ color: row.isEnable ? 'green' : 'red' }">{{ row.isEnable ? '是' : '否' }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="700" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :logicTypeOptions="logicTypeOptions"
                :conditionTypeOptions="conditionTypeOptions" :traceNodeOptions="traceNodeOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'状态名称'"
            @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="轨迹解析">
import { getBasicTraceStatusPageApi, addBasicTraceStatusApi, updBasicTraceStatusApi, delBasicTraceStatusApi, getBasicTraceStatusByIdApi, getBasicTraceStatusConditionTypeEnumApi, getBasicTraceStatusLogicTypeEnumApi, getBasicTraceStatusRefreshCacheApi, getBasicTraceStatusTestApi } from '@/api/productApi/shipway.js'
import { getOutstockOrderTraceNodeEnumApi } from '@/api/outstockApi/trace.js'

import { Plus, Delete, Refresh, Connection } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '关键词', prop: 'remark', placeholder: '请输入关键词' },
    {
        type: 'select', label: '是否启用', prop: 'isEnable', placeholder: '请选择是否启用', options: [
            { label: '是', value: true },
            { label: '否', value: false },
        ]
    },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

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
    { label: '状态ID', prop: 'statusId', width: '110', sortable: true },
    { label: '状态名称', prop: 'statusName', width: '135', sortable: true },
    { label: '是否启用', prop: 'isEnable', width: '115', sortable: true, slot: 'isEnable' },
    { label: '备注', prop: 'remark', width: '250' },

    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
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
const handleEdit = async (row) => {
    // 通过接口获取完整数据
    const res = await getBasicTraceStatusByIdApi({ id: row.id })
    if (res.success) {
        addData.value = res.data;
        dialogMode.value = 'upd';
    } else {
        smartAlert(res.msg, res.success, 1000)
    }
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {};
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_basic_traceStatus_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);


// 删除
const delData = ref([]);
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
        `是否要删除${selectionRows.value.length}条数据?`,
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
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delBasicTraceStatusApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].statusName,
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
                message: '已取消'
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
    try {
        await childFormRef.value.validate();
        loading.value = true;
        let res;
        if (addData.value.id) {
            res = await updBasicTraceStatusApi(addData.value);
        } else {
            res = await addBasicTraceStatusApi(addData.value);
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

// 刷新缓存
const handleRefresh = async () => {
    ElMessageBox.confirm(
        `是否要刷缓存?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await getBasicTraceStatusRefreshCacheApi()
            smartAlert(res.msg, res.success, 1000)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

// 测试
const handleTest = () => {
    ElMessageBox.prompt('请输入轨迹内容', '测试', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入测试内容',
        inputErrorMessage: '内容不能为空',
        inputValidator: (value) => {
            return !!value || '请输入轨迹内容'
        }
    })
        .then(async ({ value }) => {
            try {
                const res = await getBasicTraceStatusTestApi({ testTraceConfig: value })
                const msg = `状态名称: ${res.data.name}， 状态ID: ${res.data.id}， 是否客户可见: ${res.data.value ? '是' : '否'}`;
                // 统一提示
                smartAlert(msg, false, 1000)
            } catch (error) {
                console.error('测试接口调用失败:', error)
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            })
        })
}

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicTraceStatusPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    // console.log('表格数据:', tableData.value)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}

// 条件类型枚举选项
const conditionTypeOptions = ref([])
// 逻辑类型枚举选项
const logicTypeOptions = ref([])
// 轨迹节点枚举
const traceNodeOptions = ref([])

onMounted(async () => {
    const res2 = await getBasicTraceStatusConditionTypeEnumApi()
    conditionTypeOptions.value = res2.data.map(item => ({ label: item.name, value: item.id }))
    const res3 = await getBasicTraceStatusLogicTypeEnumApi()
    logicTypeOptions.value = res3.data.map(item => ({ label: item.name, value: item.id }))
    const res4 = await getOutstockOrderTraceNodeEnumApi()
    traceNodeOptions.value = res4.data.map(item => ({ label: item.name, value: item.id }))
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>