<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('jobNo')">
                            <el-input v-model="formData.jobNo" :placeholder="getPlaceholder('jobNo')" />
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('typeId')">
                            <el-select v-model="formData.typeId" filterable :placeholder="getPlaceholder('typeId')"
                                clearable popper-class="multi-column-select">
                                <el-option v-for="item in typeEnumOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
                :loading="loading" :pageSizes="[20, 50, 100, 200, 500]" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="danger" @click="handleAdd" v-permission="'closeById'" :icon="Close">{{
                        getButtonText('close') }}
                    </el-button>
                </template>
                <!-- 操作列按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <span>{{ getButtonText('view') }}</span>
                        </div>
                        <div class="cursor-pointer" @click="handleDownload(row)" v-if="row.fileUrl">
                            <span>{{ getButtonText('download') }}</span>
                        </div>
                    </div>
                </template>
                <template #fileUrl="{ row }">
                    <a :href="toDownloadTempPath(row.fileUrl)" target="_blank">{{ row.fileUrl }}</a>
                </template>
                <template #statusName="{ row }">
                    <el-tag :type="row.statusId == 4 ? 'danger' : 'success'">{{ row.statusName }}</el-tag>
                </template>
                <template #async="{ row }">
                    <span :style="{ color: row.async ? 'green' : 'red' }">{{ row.async ? '是' : '否' }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="800" align-center destroy-on-close>
            <!-- 直接使用内联模板替代动态组件 -->
            <div v-if="dialogMode === 'check'">
                <el-form :model="addData" label-width="115px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('jobNo')">
                                <el-input v-model="addData.jobNo" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('templateName')">
                                <el-input v-model="addData.templateName" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('typeName')">
                                <el-input v-model="addData.typeName" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('statusName')">
                                <el-input v-model="addData.statusName" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('importParam')">
                                <el-input v-model="addData.importParam" disabled type="textarea" :rows="1" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('importTotal')">
                                <el-input v-model="addData.importTotal" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('customerName')">
                                <el-input v-model="addData.customerName" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('fileSize')">
                                <el-input v-model="addData.fileSize" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('handlerWayName')">
                                <el-input v-model="addData.handlerWayName" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('fileUrl')">
                                <a :href="toDownloadTempPath(addData.fileUrl)" target="_blank">{{ addData.fileUrl }}</a>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('returnMessage')">
                                <el-input v-model="addData.returnMessage" disabled type="textarea" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('returnData')">
                                <div style="display: flex; width: 100%; align-items: flex-start; gap: 10px;">
                                    <el-input v-model="addData.returnData" disabled>
                                        <template #append v-if="addData.returnData">
                                            <el-button type="primary" @click="handleViewJson">
                                                {{ getButtonText('format') }}
                                            </el-button>
                                        </template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('feedbackMsg')">
                                <el-input v-model="addData.feedbackMsg" disabled type="textarea" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('feedbackTime')">
                                <el-input v-model="addData.feedbackTime" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('async')">
                                <el-select v-model="addData.async" disabled>
                                    <el-option :label="$t('yes')" :value="true" />
                                    <el-option :label="$t('no')" :value="false" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="getLabel('localFileUrl')">
                                <el-input v-model="addData.localFileUrl" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('startTime')">
                                <el-input v-model="addData.startTime" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="getLabel('endTime')">
                                <el-input v-model="addData.endTime" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('close') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- JSON格式化弹窗 -->
        <el-dialog v-model="jsonDialogVisible" :title="$t('sys_job_importJob_list.resultTitle')" width="60%"
            align-center append-to-body>
            <div class="json-viewer">
                <pre>{{ formattedJson }}</pre>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="jsonDialogVisible = false">{{ getButtonText('close') }}</el-button>
                </span>
            </template>
        </el-dialog>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            nameLabel="导入编号" successValue="关闭成功" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='我的导入'>
import { ref, shallowRef, computed, onMounted } from 'vue';
import { Close } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { toDownloadTempPath } from '@/utils/downLoad.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getImportJobListApi, getImportJobTypeEnumApi, getImportJobStatusEnumApi, importJobCloseByIdApi } from '@/api/sysApi/setting.js'
import { useI18n } from 'vue-i18n';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
const { t } = useI18n();

// 搜索表单配置项------------------------------------------------
const formConfig = ref([
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
]);

// 初始化表单数据
const initValues = ref({
    typeId: '',
    statusId: ''
});

// 搜索事件
const handleSearch = (data) => {
    initValues.value = {
        ...data
    };
    loading.value = true;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 重置事件
const handleReset = (data) => {
    initValues.value = {
        ...data,
    };
    loading.value = true;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 表格数据与列配置
const tableData = shallowRef([]);
const columns = ref([
    { label: '导入编号', prop: 'jobNo', width: '200', sortable: true, fixed: 'left' },
    { label: '导入类型', prop: 'typeName', width: '150', sortable: true, fixed: 'left' },
    { label: '模板名称', prop: 'templateName', width: '180', sortable: true, fixed: 'left' },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '状态', prop: 'statusName', width: '120', sortable: true, slot: 'statusName' },
    { label: '导入参数', prop: 'importParam', width: '300' },
    { label: '导入总数', prop: 'importTotal', width: '155', sortable: true },
    { label: '客户名称', prop: 'customerName', width: '175', sortable: true },
    { label: '文件大小', prop: 'fileSize', width: '120', sortable: true },
    { label: '文件路径', prop: 'fileUrl', width: '150', slot: 'fileUrl' },
    { label: '处理方式', prop: 'handlerWayName', width: '170' },
    { label: '返回消息', prop: 'returnMessage', width: '200' },
    { label: '进度反馈消息', prop: 'feedbackMsg', width: '200' },
    { label: '进度反馈时间', prop: 'feedbackTime', width: '220', sortable: true },
    { label: '本地文件路径', prop: 'localFileUrl', width: '300' },
    { label: '是否异步', prop: 'async', width: '120', sortable: true, slot: 'async' },
    { label: '开始时间', prop: 'startTime', width: '200', sortable: true },
    { label: '结束时间', prop: 'endTime', width: '200', sortable: true },
    { label: '耗时(s)', prop: 'elapsedTime', width: '175' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '更新人', prop: 'updatedBy', width: '120' },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '125', fixed: 'right', slot: 'customBtn' }
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
const addData = ref({});
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'/'check'
const dialogTitle = computed(() => t(`sys_job_importJob_list.${dialogMode.value}Title`)); // 可根据模式调整标题

// JSON格式化弹窗相关
const jsonDialogVisible = ref(false)
const formattedJson = ref('')

// 编辑按钮
const handleEdit = async (row) => {
    addData.value = {
        ...row,
    };
    dialogMode.value = 'check';
    centerDialogVisible.value = true;
};

// 下载
const handleDownload = async (row) => {
    window.open(toDownloadTempPath(row.fileUrl))
}

// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 解析 JSON 数据并格式化显示
const handleViewJson = () => {
    const rawData = addData.value.returnData
    if (!rawData) return

    try {
        // 尝试解析 JSON
        const jsonObj = JSON.parse(rawData)
        // 重新转换为字符串，使用 2 个空格缩进实现格式化
        formattedJson.value = JSON.stringify(jsonObj, null, 2)
        jsonDialogVisible.value = true
    } catch (error) {
        console.error('JSON解析失败', error)
        // 如果解析失败（可能不是JSON字符串），则直接显示原始内容
        formattedJson.value = rawData
        smartAlert('数据不是有效的JSON格式，已按原样显示', false)
        jsonDialogVisible.value = true
    }
}

// 关闭（批量操作）
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleAdd = () => { // 原代码中按钮绑定的是handleAdd，但逻辑是删除/关闭，保持原有命名兼容
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要关闭的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要关闭${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
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
                const res = await importJobCloseByIdApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].jobNo,
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
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 获取列表数据
const getList = async (currentPage, pageSize, orderBy) => {
    try {
        const res = await getImportJobListApi({
            page: currentPage,
            pageSize: pageSize,
            isSelf: true,
            orderBy,
            ...trimObjectStrings(initValues.value)
        });
        tableData.value = Object.freeze(res.data.rows);
        pagination.value = {
            currentPage: res.data.page,
            pageSize: pageSize,
            total: res.data.total
        };
        // 计算耗时
        tableData.value.forEach(item => {
            item.elapsedTime = item.startTime && item.endTime ? (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000 : ''
            item.progress = item.exportAlready != 0 ? (item.exportAlready / item.exportTotal) * 100 + '%' : ''
        })
    } catch (error) {
        console.error('获取列表失败:', error);
        smartAlert('获取数据失败', false);
    } finally {
        loading.value = false;
    }
};

// 获取枚举数据
const typeEnumOptions = ref([]);
const statusEnumOptions = ref([]);
onMounted(async () => {
    try {
        const typeEnumRes = await getImportJobTypeEnumApi()
        typeEnumOptions.value = typeEnumRes.data.map(item => ({ value: item.id, label: item.name }));

        const statusEnumRes = await getImportJobStatusEnumApi()
        formConfig.value[0].options = statusEnumRes.data.map(item => ({ value: item.id, label: item.name }));
        statusEnumOptions.value = formConfig.value[0].options;

        // 初始化加载列表数据
        await getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    } catch (error) {
        console.error('获取枚举数据失败:', error);
        smartAlert('初始化数据失败', false);
    }
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';

/* JSON 查看器样式 */
.json-viewer {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    max-height: 500px;
    overflow: auto;
}

.json-viewer pre {
    margin: 0;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    /* 允许换行 */
    word-wrap: break-word;
    /* 允许长单词换行 */
    color: #333;
}

.dialog-footer {
    text-align: right;
}
</style>