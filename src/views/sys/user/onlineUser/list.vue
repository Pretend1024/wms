<template>
    <div class="viewArea">
        <div class="tableDiv">
            <hydTable :tableData="tableData" :columns="columns" :enableSelection="true" :loading="loading"
                @selection-change="handleSelectionChange" @row-click="handleRowClick">
                <!-- 表格上方按钮 -->
                <template #table-buttons>
                    <el-button type="danger" @click="handleLogout" :icon="SemiSelect">
                        {{ getButtonText('forceOffline') }}
                    </el-button>
                </template>
                <template #token="{ row }">
                    <div>
                        <p v-if="!row.self">{{ row.token }}</p>
                        <p v-else style="color: red;">本机</p>
                    </div>
                </template>
            </hydTable>
        </div>
        <!-- 批量删除弹窗组件 -->
        <batchOperationn :dialogTitle="'操作结果'" :isVisible="logoutDialogVisible" :tableData="logoutData"
            :nameField="'id'" :nameLabel="'名称'" :successValue="'会话已注销'" @close="delColse"
            :promptMessage="promptMessage" />
    </div>
</template>

<script setup name='在线用户'>
import { SemiSelect } from "@element-plus/icons-vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue';
import { getOnlineUserListApi, forceLogoutApi } from '@/api/sysApi/user.js'
import { smartAlert } from '@/utils/genericMethods.js'
// 表格数据与列配置
const tableData = ref([]);
const columns = ref([
    { label: '用户代码', prop: 'userCode', width: '125' },
    { label: '用户类型', prop: 'userTypeName', width: '125' },
    { label: 'token', prop: 'token', width: '230', sortable: true, slot: 'token' },
    { label: '登陆时间', prop: 'loginTime', width: '200', sortable: true },
    { label: '登录端', prop: 'terminalName', width: '170', sortable: true, },
    { label: '登录IP', prop: 'loginIp', width: '160', sortable: true },
    { label: '登录位置', prop: 'ipLocation', width: '150' },
    { label: '上次刷新时间', prop: 'refreshTime', width: '200', sortable: true },
]);
const loading = ref(true);

// 选择
const selection = ref({});
const selectionRows = ref([]);

// 表格事件方法
const handleSelectionChange = (selectionList) => {
    selectionRows.value = selectionList;
    console.log('选中的数据：', selectionRows.value);
};
const handleRowClick = (row) => {
    console.log('点击的行数据：', row);
    selection.value = row;
};


// 批量操作相关
const logoutData = ref([]);
const logoutDialogVisible = ref(false);
const promptMessage = ref('')
const handleLogout = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要下线的用户！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要强制下线${selectionRows.value.length > 0 ? selectionRows.value.length + '个' : '该'}在线用户?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const bodyLoading = ElLoading.service({
                lock: true,
                text: 'Loading',
            })
            let res
            logoutDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                res = await forceLogoutApi({ token: selectionRows.value[i].token });
                logoutData.value.push({
                    id: selectionRows.value[i].userCode,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
            bodyLoading.close();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
};
const delColse = () => {
    logoutDialogVisible.value = false;
    logoutData.value = [];
    getList();
};

// 获取列表数据
const getList = async () => {
    const res = await getOnlineUserListApi();
    tableData.value = res.data;
    loading.value = false;
};

onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
// 引入外框css
@use '@/assets/css/viewArea.scss';
</style>