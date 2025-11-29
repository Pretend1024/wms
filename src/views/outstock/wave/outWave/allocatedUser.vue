<template>
    <el-dialog title="选择拣货人" v-model="dialogVisible" width="950" @open="handleDialogOpen" destroy-on-close>
        <!-- 搜索条件：仅搜索用户名 -->
        <hydFilterBox ref="hydFilterBoxRef" :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
            @reset="handleReset">
            <template #custom-form="{ formData }">
                <el-col>
                    <el-form-item :label="getLabel('orgId')">
                        <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                            :props="parentProps" clearable @change="handleCascaderChange"
                            :placeholder="getPlaceholder('orgId')" />
                    </el-form-item>
                </el-col>
            </template>
        </hydFilterBox>

        <!-- 表格：单选限制 -->
        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="400"
            @row-click="handleSelectionChange" highlight-current-row>
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column :show-overflow-tooltip="true" prop="userCode" label="用户代码" />
            <el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" width="120" />
            <el-table-column :show-overflow-tooltip="true" prop="num" label="工号" />
            <el-table-column :show-overflow-tooltip="true" prop="positionName" label="岗位" width="150" />
            <el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色" width="180" />
        </el-table>

        <!-- 分页器 -->
        <div style="display: flex;justify-content: center;">
            <el-pagination size="small" background :total="total" :current-page="page" :page-size="pageSize"
                @current-change="handlePageChange" class="elPagination" />
        </div>
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'code'"
            :nameLabel="'用户代码'" promptMessage="操作完成！" @close="delColse" />
        <template #footer>
            <div style="display: flex;align-items: center;">
                <div style="margin-right: auto;">
                    {{ selectedRow ? `已选中：${selectedRow.name}（用户代码：${selectedRow.userCode}）` : "未选中数据" }}
                </div>
                <el-button @click="handleCancel">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleSelect">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, onMounted } from "vue";
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { allocatePickingUserApi } from '@/api/outstockApi/wave.js'
import { getOrgEmployeeListApi } from '@/api/baseApi/org.js';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
// 工具方法：提示、字符串处理
import { trimObjectStrings, smartAlert } from "@/utils/genericMethods.js";
// 国际化
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    companyOptions: {
        type: Array,
        default: () => []
    }
})

// Emit：仅保留关闭通知
const emit = defineEmits(["close"]);

// 核心状态
const dialogVisible = ref(false);
const initBusinessIds = ref([]);
const selectedRow = ref(null);

// 表格状态
const tableRef = ref(null);
const tableData = shallowRef([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(50);

// 搜索配置
const formConfig = ref([
    { type: 'input', prop: 'name', width: '180' },
    { type: 'input', prop: 'userCode', width: '180' },
]);
// 选择行
const handleSelectionChange = (selection) => {
    selectedRow.value = selection
}

// 搜索初始值
const initValues = ref({
    name: "",
    userCode: ""
});

const hydFilterBoxRef = ref(null);

// 外部打开弹窗方法
const open = (idArr = []) => {
    initBusinessIds.value = idArr;
    dialogVisible.value = true;
};

// 弹窗打开时
async function handleDialogOpen() {
    initValues.value = {
        name: "",
        userCode: ""
    };
}

// 请求用户列表
async function getUsersList() {
    loading.value = true;
    try {
        const reqParams = trimObjectStrings({
            ...initValues.value,
            page: page.value,
            pageSize: pageSize.value,
            orgId: initValues.value.orgId ? initValues.value.orgId[initValues.value.orgId.length - 1] : null
        });

        const res = await getOrgEmployeeListApi(reqParams);
        tableData.value = res.data.rows;
        total.value = res.data.total;

        // 清空选中状态
        selectedRow.value = null;
        if (tableRef.value) {
            tableRef.value.clearSelection();
        }
    } catch (err) {
        smartAlert(t('user.pickPerson.msg.loadFail'), false);
    } finally {
        loading.value = false;
    }
}

// 确认选择
async function handleSelect() {
    if (!selectedRow.value) {
        smartAlert('请选择员工', false);
        return;
    }
    const res = await allocatePickingUserApi(initBusinessIds.value, { pickingUserCode: selectedRow.value.userCode });
    if (res.success) {

        delData.value = res.data.map(item => ({
            code: item.code,
            msg: item.data,
            success: item.success
        }));
        delDialogVisible.value = true;
        console.log(delData.value);

    } else {
        smartAlert(res.msg, false);
    }
}
const delData = ref([]);
const delDialogVisible = ref(false);

const delColse = () => {
    dialogVisible.value = false;
    delDialogVisible.value = false;
    delData.value = [];
    emit("close");
};

// 公司数据
// const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
};
onMounted(async () => {
    // // 获取公司数据
    // const companyRes = await getOrgListCompanyApi();
    // // 处理公司数据
    // const convertToTree = (items) => {
    //     return items.map(item => ({
    //         value: item.id,
    //         label: item.nameCn,
    //         children: item.children ? convertToTree(item.children) : []
    //     }));
    // };
    // companyOptions.value = convertToTree(companyRes.data);
})

function handleCancel() {
    dialogVisible.value = false;
    emit("close");
}

function handleSearch(data) {
    initValues.value = { ...data };
    page.value = 1;
    getUsersList();
}

function handleReset(data) {
    initValues.value = { ...data, name: "", userCode: "" };
    page.value = 1;
    getUsersList();
}

function handlePageChange(newPage) {
    page.value = newPage;
    getUsersList();
}


// 暴露方法
defineExpose({
    open
});
</script>

<style scoped>
.elPagination {
    margin-top: 12px;
    text-align: right;
}

:deep(.el-form-item) {
    margin-right: 16px;
}
</style>