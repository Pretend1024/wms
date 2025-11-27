<template>
    <el-dialog :title="$t('outstock_trace_outTrack_list.delTitle')" v-model="dialogVisible" width="900px" align-center
        destroy-on-close :close-on-click-modal="false" @open="handleDialogOpen" @close="handleDialogClose">
        <!-- 左右分栏布局 -->
        <el-row :gutter="20" style="height: 500px;">
            <!-- 左侧表单（1/3宽度） -->
            <el-col :span="8">
                <el-form :model="formData" :rules="formRules" ref="formRef" label-width="90px" class="form-container">
                    <!-- 起始时间 -->
                    <el-form-item :label="getLabel('traceTimeBegin')" prop="traceTimeBegin">
                        <el-date-picker v-model="formData.traceTimeBegin" type="datetime"
                            :placeholder="getPlaceholder('traceTimeBegin')" value-format="YYYY-MM-DD HH:mm:ss"
                            :disabled-date="(time) => disabledDate(time, 'begin')" />
                    </el-form-item>
                    <!-- 结束时间 -->
                    <el-form-item :label="getLabel('traceTimeEnd')" prop="traceTimeEnd">
                        <el-date-picker v-model="formData.traceTimeEnd" type="datetime"
                            :placeholder="getPlaceholder('traceTimeEnd')" value-format="YYYY-MM-DD HH:mm:ss"
                            :disabled-date="(time) => disabledDate(time, 'end')" />
                    </el-form-item>
                    <!-- 轨迹详情 -->
                    <el-form-item :label="getLabel('traceEvent')">
                        <el-input v-model="formData.traceEvent" :placeholder="getPlaceholder('traceEvent')"
                            type="textarea" :rows="5" maxlength="500" />
                    </el-form-item>
                    <el-button type="primary" @click="handleBatchDelete" :loading="submitLoading"
                        :disabled="tableData.some(item => item.loading)">
                        {{ getButtonText('confirmDelete') }}
                    </el-button>
                </el-form>
            </el-col>

            <!-- 右侧表格（2/3宽度） -->
            <el-col :span="16">
                <div class="table-container" style="height: 100%;">
                    <el-table :data="tableData" border stripe style="width: 100%; " :height="500"
                        :loading="tableLoading">
                        <el-table-column type="index" width="55" fixed align="center"
                            :label="getColumnText('index')"></el-table-column>
                        <el-table-column prop="outOrderNo" :label="getColumnText('outOrderNo')"
                            :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="getColumnText('success')" width="70" align="center">
                            <template #default="scope">
                                <span :style="{ color: scope.row.success ? 'green' : 'red', fontWeight: '500' }">
                                    {{ scope.row.success ? '成功' : '失败' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="getColumnText('msg')" :show-overflow-tooltip="true">
                            <template #default="scope">
                                <span :style="{ color: scope.row.success ? 'green' : 'red' }">
                                    {{ scope.row.msg || (scope.row.success ? '删除成功' : '删除失败') }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>

        <!-- 底部按钮区 -->
        <template #footer>
            <div class="dialog-footer">
                <p class="progress-text">
                    操作进度：{{ batchProgressText }}
                </p>
                <div>
                    <el-button @click="closeDialog">{{ getButtonText('close') }}</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, computed } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { deleteOutstockOrderTraceApi } from '@/api/outstockApi/trace.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 定义Props - 外部传入配置
const props = defineProps({
    // 外部传入的trackId数组（必填）
    selectedTrackList: {
        type: Array,
        required: true
    }
});

// 定义Emits - 向外部传递事件
const emit = defineEmits([
    'close' // 弹窗关闭事件（供外部后续操作）
]);

// 弹窗核心状态
const dialogVisible = ref(false); // 弹窗显示状态（内部控制）
const formRef = ref(null); // 表单引用
const submitLoading = ref(false); // 提交按钮加载状态
const tableLoading = ref(false); // 表格加载状态

// 表单数据
const formData = ref({
    traceTimeBegin: '', // 轨迹起始时间
    traceTimeEnd: '', // 轨迹结束时间
    traceEvent: '' // 轨迹描述
});

// 表单校验规则
const formRules = ref({
    traceTimeBegin: [
        { required: true, message: '请选择轨迹起始时间', trigger: 'change' }
    ],
    traceTimeEnd: [
        { required: true, message: '请选择轨迹结束时间', trigger: 'change' }
    ]
});

// 表格数据（初始为空，点击删除后填充）
const tableData = ref([]);

// 批量操作进度文本
const batchProgressText = computed(() => {
    if (tableData.value.length === 0) return t(`outstock_trace_outTrack_list.status0`);
    const total = tableData.value.length;
    const successCount = tableData.value.filter(item => item.success).length;
    const failCount = tableData.value.filter(item => item.success === false).length;
    const pendingCount = total - successCount - failCount;

    if (pendingCount > 0) {
        return `${t('outstock_trace_outTrack_list.status1')}：${successCount} ${t('outstock_trace_outTrack_list.status3')} / ${failCount} ${t('outstock_trace_outTrack_list.status4')} / ${pendingCount} ${t('outstock_trace_outTrack_list.status1')}`;
    } else {
        return `${t('outstock_trace_outTrack_list.status2')}：${successCount} ${t('outstock_trace_outTrack_list.status3')} / ${failCount} ${t('outstock_trace_outTrack_list.status4')}`;
    }
});

/**
 * 弹窗打开时初始化
 */
const handleDialogOpen = () => {
    nextTick(() => {
        // 重置表单
        resetForm();
        // 初始表格为空
        tableData.value = [];
    });
};

/**
 * 弹窗关闭时触发外部事件
 */
const handleDialogClose = () => {
    emit('close');
};

/**
 * 修正后的日期禁用逻辑
 * @param {Date} time - 当前选择的时间
 * @param {string} type - 时间类型：begin（起始时间）/ end（结束时间）
 * @returns {boolean} - 是否禁用该时间
 */
const disabledDate = (time, type) => {
    // 时间戳统一转为毫秒级（避免时区问题）
    const currentTime = time.getTime();

    // 2. 起始时间（begin）的额外禁用规则：不能晚于已选择的结束时间
    if (type === 'begin' && formData.value.traceTimeEnd) {
        const endTime = new Date(formData.value.traceTimeEnd).getTime();
        // 起始时间 > 结束时间 → 禁用
        const isAfterEnd = currentTime > endTime;
        return isAfterEnd;
    }

    // 3. 结束时间（end）的额外禁用规则：不能早于已选择的起始时间
    if (type === 'end' && formData.value.traceTimeBegin) {
        const beginTime = new Date(formData.value.traceTimeBegin).getTime();
        // 结束时间 < 起始时间 → 禁用
        const isBeforeBegin = currentTime < beginTime;
        return isBeforeBegin;
    }
};

/**
 * 重置表单
 */
const resetForm = () => {
    formData.value = {
        traceTimeBegin: '',
        traceTimeEnd: '',
        traceEvent: ''
    };
    if (formRef.value) {
        formRef.value.clearValidate();
    }
    // 重置表格为空
    tableData.value = [];
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
    dialogVisible.value = false;
};

/**
 * 批量删除（循环调用接口）
 */
const handleBatchDelete = async () => {
    try {
        // 1. 表单校验
        await formRef.value.validate();

        // 2. 状态初始化
        submitLoading.value = true;
        tableLoading.value = true;

        // 3. 初始化表格数据
        tableData.value = props.selectedTrackList.map(item => ({
            trackId: item.id, // 统一转为字符串
            outOrderNo: item.outOrderNo, // 统一转为字符串
            success: null, // 初始状态：null（未处理），true（成功），false（失败）
            msg: '', // 结果消息
            loading: false // 单个请求加载状态
        }));

        // 4. 组装接口请求参数（表单数据）
        const requestParams = {
            traceTimeBegin: formData.value.traceTimeBegin,
            traceTimeEnd: formData.value.traceTimeEnd,
            traceEvent: formData.value.traceEvent
        };

        // 5. 循环调用接口（并行执行，提高效率）
        const requestPromises = tableData.value.map((item, index) => {
            // 标记单个请求加载状态
            tableData.value[index].loading = true;

            return deleteOutstockOrderTraceApi({
                trackId: item.trackId,
                ...requestParams
            })
                .then(res => {
                    // 接口成功响应（根据实际接口返回格式调整）
                    const success = res.success || res.code === 200;
                    tableData.value[index] = {
                        ...tableData.value[index],
                        success,
                        msg: res.msg || (success ? '删除成功' : '删除失败'),
                        loading: false
                    };
                    return res;
                })
                .catch(error => {
                    // 接口请求失败
                    tableData.value[index] = {
                        ...tableData.value[index],
                        success: false,
                        msg: error.message || '网络异常，删除失败',
                        loading: false
                    };
                    return error;
                });
        });

        // 6. 等待所有请求完成
        await Promise.all(requestPromises);

        // 7. 操作完成提示
        const successCount = tableData.value.filter(item => item.success).length;
        const total = tableData.value.length;
        if (successCount === total) {
            smartAlert('批量删除操作成功', true, 1000);
        } else if (successCount === 0) {
            smartAlert('批量删除操作失败', false);
        } else {
            smartAlert(`部分删除成功，共${successCount}条成功，${total - successCount}条失败`, false);
        }
    } catch (error) {
        console.error('批量删除操作失败：', error);
    } finally {
        // 重置加载状态
        submitLoading.value = false;
        tableLoading.value = false;
    }
};

/**
 * 暴露给外部的核心方法
 */
defineExpose({
    // 打开弹窗（外部唯一打开方式）
    openDialog: () => {
        dialogVisible.value = true;
    },
    // 关闭弹窗（外部可手动调用）
    closeDialog: closeDialog,
    // 重置表单和表格状态（外部可选调用）
    reset: () => {
        resetForm();
    },
    // 获取批量操作结果（外部可选调用）
    getBatchResult: () => {
        return [...tableData.value];
    }
});
</script>

<style scoped>
/* 表单容器样式 */
.form-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 0;
}

/* 表格容器样式 */
.table-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

/* 底部按钮区样式 */
.dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

/* 进度文本样式 */
.progress-text {
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin: 0;
}

/* 适配弹窗样式 */
:deep(.el-dialog__body) {
    padding: 20px;
    overflow: hidden;
}

:deep(.el-form-item) {
    margin-bottom: 0;
}

/* 日期选择器宽度适配 */
:deep(.el-date-editor) {
    width: 100% !important;
}

/* 表格行高优化 */
:deep(.el-table__row) {
    height: 50px;
}

/* 表格空文本样式优化 */
:deep(.el-table__empty-text) {
    font-size: 14px;
    color: var(--el-text-color-placeholder);
}
</style>