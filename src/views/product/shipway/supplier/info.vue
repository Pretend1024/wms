<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>服务商信息</p>
            <el-form :model="formData" :rules='rules' ref="formRef" label-width="115px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="服务商代码:">
                            <el-input v-model.trim="formData.code" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="服务商名称:">
                            <el-input v-model.trim="formData.name" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <el-select v-model="formData.statusId" disabled>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <el-select v-model="formData.typeId" disabled>
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="登录网站:">
                            <el-input v-model.trim="formData.website" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:">
                            <el-input v-model.trim="formData.contactName" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号:">
                            <el-input v-model.trim="formData.mobilePhone" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="邮箱:">
                            <el-input v-model.trim="formData.email" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系地址:">
                            <el-input v-model.trim="formData.contactAddress" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:">
                            <el-input type="textarea" autosize v-model="formData.remark" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider border-style="dashed" />
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账号:">
                            <el-input v-model.trim="formData.account" autocomplete="off" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="密码:">
                            <el-input v-model.trim="formData.password" type="password" show-password
                                autocomplete="new-password" readonly />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="公司:">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange(index)" disabled />
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
                                :props="parentProps" clearable @change="handleCascaderChange(index)" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="拥有者:">
                            <el-input v-model.trim="formData.owner" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="api接口:">
                            <el-select v-model="formData.apiId" disabled>
                                <el-option v-for="item in apiOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label="api配置:">
                            <el-input type="textarea" :rows="3" v-model="formData.apiConfig" readonly />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div class="titleDiv">
                <p class="active">服务商渠道</p>
            </div>
            <div>
                <channel ref="channelRef" :formData="supplierAccountAddDTOList" @delete-item="handleDelChannel"
                    :readonly="true">
                </channel>
            </div>
            <div class="bottomDiv">
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="服务商详情">
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { updProductSupplierApi, getProductSupplierStatusEnumApi, getProductSupplierTypeEnumApi, getProductSupplierAccountApiEnumApi, getProductSupplierInfoApi } from '@/api/productApi/shipway.js'
import { smartAlert } from '@/utils/genericMethods.js'
import channel from './channel.vue'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
const poros = defineProps({
    id: {
        type: String,
        default: ''
    }
});

// 渠道数据
const supplierAccountAddDTOList = ref([]);

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
        target: ".contentDiv",
        text: 'Loading',
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