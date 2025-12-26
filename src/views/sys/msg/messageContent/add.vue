<template>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-row>
            <el-col :span="24">
                <el-form-item :label="getLabel('title')" prop="title">
                    <el-input v-model="formData.title" :placeholder="getPlaceholder('title')" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('typeId')" prop="typeId">
                    <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')">
                        <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('notifyWayId')" prop="notifyWayId">
                    <el-select v-model="formData.notifyWayId" :placeholder="getPlaceholder('notifyWayId')">
                        <el-option v-for="(item, index) in notifyWayOptions" :key="index" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('link')">
                    <el-input v-model="formData.link" :placeholder="getPlaceholder('link')" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('fileUrl')">
                    <el-input v-model="formData.fileUrl" :placeholder="getPlaceholder('fileUrl')" clearable>
                        <template #append>
                            <el-upload v-model:file-list="fileList" class="upload-demo" :auto-upload="true"
                                :http-request="handleUpload" :before-upload="beforeUpload" :limit="1"
                                :show-file-list="false">
                                <el-button :icon="UploadFilled" />
                            </el-upload>
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item :label="getLabel('content')" prop="content">
                    <!-- 富文本编辑器补充placeholder（需确保组件支持该属性） -->
                    <richTextEditor v-model="formData.content" :placeholder="getPlaceholder('content')">
                    </richTextEditor>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('notifyScopeId')" prop="notifyScopeId">
                    <el-select v-model="formData.notifyScopeId" :placeholder="getPlaceholder('notifyScopeId')">
                        <el-option v-for="(item, index) in notifyScopeOptions" :key="index" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('notifyUser')" v-show="formData.notifyScopeId === 20">
                    <el-input v-model="formData.notifyUser" :placeholder="getPlaceholder('notifyUser')">
                        <template #append>
                            <el-button :icon="More" @click="selectUser" />
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>

    <el-dialog title="选择用户" v-model="dialogVisible" width="45%" destroy-on-close>
        <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch" @reset="handleReset">
            <template #custom-form="{ formData }">
                <el-col>
                    <el-form-item :label="getLabel('orgId')">
                        <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                            :props="parentProps" clearable @change="handleCascaderChange"
                            :placeholder="getPlaceholder('orgId')" />
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item :label="getLabel('codeFuzzy')">
                        <el-input v-model="formData.codeFuzzy" :placeholder="getPlaceholder('codeFuzzy')" />
                    </el-form-item>
                </el-col>
            </template>
        </hydFilterBox>
        <el-table ref="tableRef" :data="tableData" border stripe style="width: 100%" :loading="loading" height="450"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="orgName" label="公司" />
            <el-table-column prop="code" label="用户代码" />
            <el-table-column prop="nickName" label="昵称" />
            <el-table-column prop="userTypeName" label="类型" width="85" />
        </el-table>
        <template #footer>
            <div style="display: flex;align-items: center;">
                <!-- 显示选中的条数 -->
                <div style="margin-right: auto;">已选择：{{ selectedUserSet.size }} 条</div>
                <el-button @click="dialogVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="handleSelect">{{ getButtonText('confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted, nextTick } from 'vue'
import { More, UploadFilled } from '@element-plus/icons-vue'
import hydFilterBox from '@/components/table/hyd-filterBox.vue'
import { uploadApi } from '@/api/baseApi/index.js'
import { getUserUserListApi, getUserStatusEnumApi, getUserTypeEnumApi, getMessageContentNotifyWayEnumApi } from '@/api/sysApi/user.js'
import { trimObjectStrings, smartAlert } from '@/utils/genericMethods.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';

const props = defineProps({
    formData: { type: Object, required: true },
    typeOptions: { type: Array, required: true },
    notifyScopeOptions: { type: Array, required: true }
})

const formRef = ref(null)
const tableRef = ref(null)
const tableData = shallowRef([])
const loading = ref(false)
const dialogVisible = ref(false)

const formConfig = ref([
    { type: 'select', label: '状态', prop: 'statusId', options: [] },
    { type: 'select', label: '类型', prop: 'userTypeId', options: [] }
])
const initValues = ref({ statusId: '', userTypeId: '', codeFuzzy: '', orgId: '' })

// 跨页选中用户代码的集合，用于记录所有选中的用户代码
const selectedUserSet = ref(new Set())
// 记录当前页已选中的用户代码
const lastPageCodes = ref([])

const rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    notifyScopeId: [{ required: true, message: '请选择通知范围', trigger: 'change' }],
    notifyWayId: [{ required: true, message: '请选择提醒方式', trigger: 'change' }],
    typeId: [{ required: true, message: '请选择消息类型', trigger: 'change' }]
}

onMounted(async () => {
    const statusRes = await getUserStatusEnumApi()
    formConfig.value[0].options = statusRes.data.map(item => ({ label: item.name, value: item.id }))
    const typeRes = await getUserTypeEnumApi()
    formConfig.value[1].options = typeRes.data.map(item => ({ label: item.name, value: item.id }))
})

function handleSearch(data) {
    initValues.value = { ...data }
    getList()
}

function handleReset(data) {
    console.log('handleReset', data)
    initValues.value = { ...data }
    getList()
}

async function getList() {
    loading.value = true
    // 重置当前页已选中的用户代码
    lastPageCodes.value = []
    try {
        const data = {
            ...initValues.value,
            page: 1,
            pageSize: 1000
        }
        const res = await getUserUserListApi(trimObjectStrings(data))
        tableData.value = res.data.rows
        if (dialogVisible.value) {
            await nextTick()
            tableRef.value.clearSelection()
            // 根据跨页集合进行选中
            tableData.value.forEach(row => {
                if (selectedUserSet.value.has(row.code)) {
                    tableRef.value.toggleRowSelection(row, true)
                }
            })
        }
    } finally {
        loading.value = false
    }
}

// -----------------------------------------------------文件上传
const fileList = ref([]);
// 文件上传前校验
const beforeUpload = (file) => {
    return true;
};
// 自定义上传处理
const handleUpload = async (options) => {
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
    })
    try {
        const res = await uploadApi(options.file, { path: 'temp' });
        console.log(res, '上传头像返回值')
        props.formData.fileUrl = res.data;
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        smartAlert('上传失败，请检查网络', false, 1000)
        console.log('上传失败，请重试', error);
    } finally {
        fileList.value = [];
        loading.close();
    }
};


// 打开选择用户对话框
async function selectUser() {
    dialogVisible.value = true
    // 初始化选中集合
    if (props.formData.notifyUser) {
        props.formData.notifyUser.split(',').forEach(code => selectedUserSet.value.add(code))
    }
}
// 处理表格行选中状态变化事件
function handleSelectionChange(val) {
    const newPageCodes = val.map(item => item.code)
    // 新选中项加入集合
    newPageCodes.forEach(code => selectedUserSet.value.add(code))
    // 取消选择项从集合中移除
    lastPageCodes.value.forEach(code => {
        if (!newPageCodes.includes(code)) {
            selectedUserSet.value.delete(code)
        }
    })
    lastPageCodes.value = newPageCodes
}
// 确定选择用户操作
function handleSelect() {
    dialogVisible.value = false
    props.formData.notifyUser = Array.from(selectedUserSet.value).join(',')
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
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
};
// 提醒方式
const notifyWayOptions = ref([])
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
    companyOptions.value = convertToTree(companyRes.data);
    // 获取提醒方式
    const res = await getMessageContentNotifyWayEnumApi()
    notifyWayOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
})

defineExpose({ validate: () => formRef.value.validate() })
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 0 0 0;
}
</style>
