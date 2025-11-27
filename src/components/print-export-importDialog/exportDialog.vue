<template>
    <!-- 导出弹窗 -->
    <el-dialog title="导出" v-model="exportDialogVisible" width="35%" align-center destroy-on-close
        @closed="resetExportForm">
        <el-form-item label="导出范围:" class="compact-item">
            <el-select v-model="exportForm.type" placeholder="请选择导出范围">
                <el-option label="按勾选" :value="1" />
                <el-option label="按条件" :value="2" />
            </el-select>
        </el-form-item>
        <el-form-item label="导出格式:" class="compact-item">
            <el-select v-model="exportForm.templateName" placeholder="请选择导出格式">
                <el-option v-for="item in exportTypeOptions" :key="item.name" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="exportDialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleExportConfirm">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElLoading } from 'element-plus';
import { getTemplateApi } from '@/api/baseApi/index.js';
import { smartAlert } from '@/utils/genericMethods.js'
import * as api from '@/api/baseApi/exportApi.js'
// 定义接口映射
const apiMap = {
    111: api.exportSkuApi,

    221: api.exportWhinOrderApi,
    223: api.exportInShelfApi,
    224: api.exportReturnOrderApi,

    300: api.exportInventoryApi,
    301: api.exportInventoryLogApi,
    302: api.exportInventorySnapshotApi,
    305: api.exportInventorySnApi,
    306: api.exportInventoryAdjustApi,

    400: api.exportOutOrderApi,
    402: api.exportOutOrderTraceApi,

    512: api.exportWhLocationApi,
    513: api.exportConsumablesInventoryApi,
    514: api.exportConsumablesInApi,
    515: api.exportConsumablesOutApi,
    522: api.exportConsumablesInReceivingApi,
    518: api.exportProductSupplierApi,
    519: api.exportRemoteDetailApi,

    603: api.exportCustomerAccountApi,
    604: api.exportCustomerCreditApi,
    605: api.exportCustomerRechargeApi,
    606: api.exportInOrderFeeApi,
    607: api.exportOutOrderFeeApi,
    609: api.exportVasOrderFeeApi,
};
// 接收外部参数
const props = defineProps({
    selectionRows: {
        type: Array,
        default: () => []
    },
    initValues: {
        type: Object,
        default: () => ({})
    },
    exportType: {
        type: Number,
        required: true
    },
    otherParameters: {
        type: Object,
        default: () => ({})
    }
});

// 组件内部状态
const exportDialogVisible = ref(false);
const exportForm = ref({
    type: '',
    templateName: ''
});
const exportTypeOptions = ref([]);

// 打开导出弹窗
const openExportDialog = () => {
    if (exportTypeOptions.value.length === 0) {
        loadExportTemplates();
    }
    exportDialogVisible.value = true;
};

// 加载导出模板列表
const loadExportTemplates = async () => {
    try {
        const res = await getTemplateApi({ atypeId: 2, btypeId: props.exportType });
        exportTypeOptions.value = res.data || [];
    } catch (error) {
        console.error('加载导出模板失败', error);
        smartAlert('加载导出模板失败，请重试', false);
    }
};

// 确定导出处理
const handleExportConfirm = async () => {
    if (!exportForm.value.templateName) {
        smartAlert('请选择导出格式', false);
        return;
    }

    const apiParams = ref({ ...props.otherParameters }); // 合并其他参数
    if (exportForm.value.type == '1') {
        if (props.selectionRows.length === 0) {
            smartAlert('请选择要导出的数据！', true, 1000);
            return;
        }
        apiParams.value.idList = props.selectionRows.map(item => item.id);
    } else {
        apiParams.value = { ...props.initValues, ...props.otherParameters };
        if (apiParams.value.orgId && apiParams.value.orgId.length === 0) {
            delete apiParams.value.orgId;
        }
    }
    const exportApi = apiMap[props.exportType]; // 根据类型选择对应的API
    if (!exportApi) {
        smartAlert('未找到对应的API', false);
        return;
    }
    Object.assign(apiParams.value, {
        // templateName: exportForm.value.templateName,
        // exportTypeId: props.exportType,
        templateId: exportForm.value.templateName
    });

    const bodyLoading = ElLoading.service({ text: '正在生成导出文件...' });
    try {
        const res = await exportApi(apiParams.value);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            exportDialogVisible.value = false;
            // 清空表单
            exportForm.value = { type: '', templateName: '' };
        }
    } catch (error) {
        console.error('导出请求失败', error);
        smartAlert('导出失败，请检查参数或联系管理员', false);
    } finally {
        bodyLoading.close();
    }
};

// 重置导出表单
const resetExportForm = () => {
    exportForm.value = {
        type: '',
        templateName: ''
    };
};

// 暴露给外部的打开弹窗方法
defineExpose({
    openExportDialog
});
</script>