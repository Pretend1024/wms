<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>服务商信息</p>
            <el-form :model="formData" :rules='rules' ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="服务商代码:" prop="code">
                            <el-input v-model.trim="formData.code" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="服务商名称:" prop="name">
                            <el-input v-model.trim="formData.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:" prop="statusId">
                            <el-select v-model="formData.statusId">
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:" prop="typeId">
                            <el-select v-model="formData.typeId">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="登录网站:" prop="website">
                            <el-input v-model.trim="formData.website" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contactName">
                            <el-input v-model.trim="formData.contactName" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号:" prop="mobilePhone">
                            <el-input v-model.trim="formData.mobilePhone" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model.trim="formData.email" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系地址:">
                            <el-input v-model.trim="formData.contactAddress" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="formData.remark" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider border-style="dashed" />
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账号:" prop="account">
                            <el-input v-model.trim="formData.account" autocomplete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="密码:">
                            <el-input v-model.trim="formData.password" type="password" show-password
                                autocomplete="new-password" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="公司:" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange(index)" />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="公司:" prop="orgId">
                            <template #label>
                                <div style="display: flex;align-items: center;">
                                    <span>公司:</span>
                                    <el-tooltip content="账号所属公司" placement="bottom" effect="light">
                                        <el-icon size="16">
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange(index)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="拥有者:" prop="owner">
                            <el-input v-model.trim="formData.owner" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="api接口:" prop="apiId">
                            <el-select v-model="formData.apiId" @change="selectApi">
                                <el-option v-for="item in apiOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label="api配置:" prop="apiConfig">
                            <el-input type="textarea" :rows="3" v-model="formData.apiConfig" />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div class="titleDiv">
                <p class="active">服务商渠道</p>
            </div>
            <div>
                <el-button type="primary" @click="handleSubmitChannel">新增渠道</el-button>
            </div>
            <div class="tableDiv">
                <channel ref="channelRef" :formData="supplierAccountAddDTOList" @delete-item="handleDelChannel">
                </channel>
            </div>
            <div class="bottomDiv">
                <el-button type="primary" @click="handleSubmit">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="编辑服务商">
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { updProductSupplierApi, getProductSupplierStatusEnumApi, getProductSupplierTypeEnumApi, getProductSupplierAccountApiEnumApi, getProductSupplierInfoApi, getProductSupplierApiJsonApi } from '@/api/productApi/shipway.js'
import { smartAlert } from '@/utils/genericMethods.js'
import channel from './channel.vue'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
const poros = defineProps({
    id: {
        type: String,
        default: ''
    }
});

// 渠道数据
const supplierAccountAddDTOList = ref([]);
// 新增渠道
const handleSubmitChannel = () => {
    supplierAccountAddDTOList.value.push({
        code: '',
        name: '',
        remake: ''
    });
}
// 删除渠道
const handleDelChannel = (index) => {
    supplierAccountAddDTOList.value.splice(index, 1);
}
const formRef = ref(null);
const channelRef = ref(null);
// 表单数据
const formData = ref({
    code: '',
    contactAddress: '',
    contactName: '',
    email: '',
    mobilePhone: '',
    name: '',
    remark: '',
    statusId: '',
    typeId: '',
    website: ''
});

const rules = {
    code: [
        { required: true, message: '请输入服务商代码', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入服务商名称', trigger: 'blur' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    typeId: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    website: [
        { required: true, message: '请输入登录网站', trigger: 'blur' }
    ],
    contactName: [
        { required: true, message: '请输入联系人', trigger: 'blur' }
    ],
    mobilePhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    contactAddress: [
        { required: true, message: '请输入联系地址', trigger: 'blur' }
    ],
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    orgId: [
        { required: true, message: '请选择公司', trigger: 'change' }
    ],
    apiId: [
        { required: true, message: '请选择api接口', trigger: 'blur' }
    ],
    owner: [
        { required: true, message: '请输入拥有者', trigger: 'blur' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    apiConfig: [
        { required: true, message: '请输入api配置', trigger: 'blur' }
    ]
};
// 保存
const handleSubmit = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await channelRef.value?.validateForms();

                const loading = ElLoading.service({
                    lock: true,
                    text: 'Loading'
                })

                if (Array.isArray(formData.value.orgId)) {
                    formData.value.orgId = formData.value.orgId[formData.value.orgId.length - 1];
                }
                supplierAccountAddDTOList.value.forEach(item => {
                    if (item.carrierServiceCode === undefined) {
                        item.carrierServiceCode = '';
                    }
                });

                const data = { ...formData.value, supplierChannelUpdDTOList: supplierAccountAddDTOList.value }
                console.log(data)
                const res = await updProductSupplierApi(data)
                if (res.success) {
                    refreshStore.shouldRefreshSupplierList = true// 设置刷新标记
                    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
                    router.push('/product/shipway/supplier/list')
                }
                smartAlert(res.msg, res.success, 1000)
                loading.close()
            }
            catch (e) {
                console.error(e)
            }
        }
    })
}
// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/product/shipway/supplier/list' })
}
// 服务商状态
const statusOptions = ref([])
// 服务商类型
const typeOptions = ref([])
// 服务商API接口
const apiOptions = ref([])
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref([]); // 修改为数组引用
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (index) => {
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    })
};
onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading'
    })
    // 获取状态
    const res = await getProductSupplierStatusEnumApi()
    statusOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
    // 获取服务商类型
    const res2 = await getProductSupplierTypeEnumApi()
    typeOptions.value = res2.data.map(item => ({ label: item.name, value: item.id }))
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
    const res4 = await getProductSupplierAccountApiEnumApi()
    apiOptions.value = res4.data.map(item => ({ label: item.name, value: item.id }))

    // 获取详情
    const res5 = await getProductSupplierInfoApi({ id: poros.id })
    formData.value = res5.data
    // supplierAccountAddDTOList.value = res3.data.supplierAccountList
    supplierAccountAddDTOList.value = res5.data.supplierChannelList
    loading.close()
})
// 选择api接口
const selectApi = async () => {
    const res = await getProductSupplierApiJsonApi({ apiId: formData.value.apiId })
    formData.value.apiConfig = res.data
}
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.titleDiv {
    display: flex;
    width: 100%;
    height: 45px;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;

    p {
        border: none !important;
        margin-bottom: 0 !important;
        font-size: 18px !important;
        padding: 0 15px 10px !important;
    }

    p:hover {
        font-size: 22px !important;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    p.active {
        color: #ff914e;
        height: 30px !important;
        font-size: 22px !important;
        border-bottom: 2px solid #ff914e !important;
    }
}


.bottomDiv {
    width: 1200px;
    display: flex;
    justify-content: center;
}
</style>