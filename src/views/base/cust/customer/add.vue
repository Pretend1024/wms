<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="titleDiv">
                <p v-for="item in tabList" :key="item.value" :class="activeName == item.value ? 'active' : ''"
                    @click="handleTabChange(item.value)">{{ item.label }}</p>
            </div>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                <!-- 基础资料 -->
                <el-row v-show="activeName === 'first'">
                    <el-col :span="24">
                        <p style="border: none;">{{ $t('basicInfo') }}</p>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('orgId')" prop="orgId">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('code')" prop="code">
                            <el-input v-model="formData.code" autocomplete="off" :placeholder="getPlaceholder('code')"
                                @input="setUserCode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('name')" prop="name">
                            <el-input v-model="formData.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('userCode')">
                            <el-input v-model="formData.userCode" autocomplete="off" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('password')" prop="password">
                            <el-input v-model="formData.password" type="password" show-password
                                autocomplete="new-password" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('statusId')" prop="statusId">
                            <el-select v-model="formData.statusId" value-key="id"
                                :placeholder="getPlaceholder('statusId')">
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('salesUserCode')">
                            <el-select v-model="formData.salesUserCode" value-key="id" filterable
                                :placeholder="getPlaceholder('salesUserCode')" popper-class="multi-column-select">
                                <el-option v-for="item in salesUserOptions" :key="item.id" :label="item.nickName"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('financialUserCode')">
                            <el-select v-model="formData.financialUserCode" value-key="id" filterable
                                :placeholder="getPlaceholder('financialUserCode')" popper-class="multi-column-select">
                                <el-option v-for="item in financialUserOptions" :key="item.id" :label="item.nickName"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('levelId')">
                            <el-select v-model="formData.levelId" value-key="id"
                                :placeholder="getPlaceholder('levelId')">
                                <el-option v-for="item in customerLevelOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('remark')">
                            <el-input type="textarea" v-model="formData.remark" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <p style="border: none;">{{ $t('ContactInfo') }}</p>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('countryCode')">
                            <el-select v-model="formData.countryCode" value-key="id" filterable
                                :placeholder="getPlaceholder('countryCode')">
                                <el-option v-for="item in countryOptions" :key="item.id"
                                    :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('province')">
                            <el-input v-model="formData.province" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('city')">
                            <el-input v-model="formData.city" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('address')">
                            <el-input type="textarea" v-model="formData.address" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('postcode')">
                            <el-input v-model="formData.postcode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('contact')">
                            <el-input v-model="formData.contact" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('mobilePhone')" prop="mobilePhone">
                            <el-input v-model="formData.mobilePhone" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="getLabel('email')" prop="email">
                            <el-input v-model="formData.email" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 合同信息 -->
                <el-row v-show="activeName === 'second'">
                    <!-- 上传按钮 -->
                    <el-col :span="24">
                        <el-upload style="margin-bottom: 9px;" ref="contractUploadRef" :http-request="uploadContracts"
                            :multiple="true" :show-file-list="false" :before-upload="beforeUpload">
                            <el-button type="primary">{{ getButtonText('upload') }}</el-button>
                        </el-upload>
                    </el-col>
                    <!-- 数据表格 -->
                    <el-col :span="24">
                        <customerTable :columns="columns" :data="tableData">
                            <template #customBtn="scope">
                                <div class="cursor-pointer" @click="removeContract(scope)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    <span>{{ getButtonText('del') }}</span>
                                </div>
                            </template>
                            <template #beginPicker="{ row }">
                                <el-date-picker v-model="row.contractBegin" type="datetime" placeholder="选择开始日期"
                                    style="width: 100%;" :disabled-date="(time) => disabledBeginDate(time, row)" />
                            </template>

                            <template #endPicker="{ row }">
                                <el-date-picker v-model="row.contractEnd" type="datetime" placeholder="选择结束日期"
                                    style="width: 100%;" :disabled-date="(time) => disabledEndDate(time, row)" />
                            </template>
                            <template #contractFile="{ row }">
                                <a :href="row.contractFile" target="_blank">{{ row.contractFile }}</a>
                            </template>
                        </customerTable>
                    </el-col>
                </el-row>
            </el-form>
            <div class=" btns">
                <!-- 保存和关闭 -->
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="新增客户">
import { Delete } from '@element-plus/icons-vue'
import { getOrgCountryListApi, getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getCustomerStatusEnumApi, getListFinancialUserEnumApi, getListSalesUserEnumApi, getCustomerLevelEnumApi, addCustomerApi } from '@/api/baseApi/cust.js'
import { uploadApi } from '@/api/baseApi/index.js'
import customerTable from '@/components/table/customer-table.vue'
import { smartAlert } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { getColumnText } from '@/utils/i18n/i18nColumns.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
// 表单数据
const formData = ref({
    orgId: '',
    name: '',
    code: '',
    userCode: '',
    password: '',
    financialUserCode: '',
    salesUserCode: '',
    levelId: '',
    contact: '',
    mobilePhone: '',
    email: '',
    countryCode: '',
    province: '',
    city: '',
    postcode: '',
    address: '',
    remark: '',
    statusId: '',
    contracts: [],
});

const formRef = ref(null);
// 验证规则
const rules = {
    name: [
        { required: true, message: '请输入客户名称', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入客户代码', trigger: 'blur' }
    ],
    userCode: [
        { required: true, message: '请输入用户代码', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    financialUserCode: [
        { required: true, message: '请选择财务用户', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    salesUserCode: [
        { required: true, message: '请选择销售用户', trigger: 'change' }
    ],
    levelId: [
        { required: true, message: '请选择客户等级', trigger: 'change' },
    ],
    contact: [
        { required: true, message: '请输入联系人', trigger: 'blur' }
    ],
    mobilePhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    countryCode: [
        { required: true, message: '请选择国家', trigger: 'change' }
    ],
    province: [
        { required: true, message: '请输入省份', trigger: 'blur' }
    ],
    city: [
        { required: true, message: '请输入城市', trigger: 'blur' }
    ],
    postcode: [
        { required: true, message: '请输入邮编', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
    remark: [
        { required: true, message: '请输入备注', trigger: 'blur' }
    ],
    orgId: [
        { required: true, message: '请选择公司', trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ]
};

// 设置用户代码
const setUserCode = (e) => {
    formData.value.userCode = e
}
// 表格数据
const tableData = ref([]);
const columns = [
    { label: getColumnText('contractFile'), prop: 'contractFile', width: '300', fixed: 'left', slot: 'contractFile' },
    { label: getColumnText('contractBegin'), prop: 'contractBegin', width: '220', slot: 'beginPicker' },
    { label: getColumnText('contractEnd'), prop: 'contractEnd', width: '220', slot: 'endPicker' },
    { label: getColumnText('action'), prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
]
// 上传引用
const contractUploadRef = ref(null)
// 上传前校验
const beforeUpload = (file) => {
    if (file.name.endsWith('.exe') || file.name.endsWith('.bat') || file.name.endsWith('.sh')) {
        smartAlert('请勿上传.exe、.bat、.sh类型的可执行文件，请更换其他类型文件上传。', false);
        return false;
    }
    return true;
};
// 上传合同附件
const uploadContracts = async ({ file }) => {
    try {
        const res = await uploadApi(file, { path: 'temp' })
        // 返回的地址
        const urls = Array.isArray(res.data) ? res.data : [res.data]
        urls.forEach(url => {
            tableData.value.push({
                contractFile: url,
                contractBegin: null,
                contractEnd: null
            })
        })
        // 清空文件列表
        contractUploadRef.value.clearFiles()
    } catch (err) {
        smartAlert('合同上传失败', false)
    }
}

const disabledBeginDate = (time, row) => {
    // 如果结束时间已选择，开始时间不能超过结束时间
    if (row.contractEnd) {
        // 转换为时间戳比较（精确到毫秒）
        return time.getTime() > new Date(row.contractEnd).getTime();
    }
    return false; // 未选择结束时间时不限制
}

// 限制结束时间：不能早于已选择的开始时间
const disabledEndDate = (time, row) => {
    // 如果开始时间已选择，结束时间不能早于开始时间
    if (row.contractBegin) {
        // 转换为时间戳比较（精确到毫秒）
        return time.getTime() < new Date(row.contractBegin).getTime();
    }
    return false; // 未选择开始时间时不限制
}

// 删除合同行
const removeContract = (scope) => {
    const index = scope.$index;
    tableData.value.splice(index, 1)
}
// 切换tab
const activeName = ref('first');
const handleTabChange = (tab) => {
    activeName.value = tab;
}
const tabList = [
    { value: 'first', label: t('BasicData') },
    { value: 'second', label: t('ContractDocuments') }
]

// 财务用户数据
const financialUserOptions = ref([])
// 销售用户数据
const salesUserOptions = ref([])
// 用户等级数据
const customerLevelOptions = ref([])

// 国家数据
const countryOptions = ref([])
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover',
    emitPath: false,
};
const handleCascaderChange = async (e) => {
    //获取财务用户数据
    const financialRes = await getListFinancialUserEnumApi({ orgId: e });
    financialUserOptions.value = financialRes.data
    // 获取销售用户数据
    const salesRes = await getListSalesUserEnumApi({ orgId: e });
    salesUserOptions.value = salesRes.data
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
};
// 状态数据
const statusOptions = ref([])
// 保存
const handleSave = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            // 处理合同数据
            formData.value.contracts = tableData.value
            const form = { ...formData.value };
            const res = await addCustomerApi(form);
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                refreshStore.shouldRefreshCustomerList = true// 设置刷新标记
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
                router.push('/base/cust/customer/list')
            } else {
                console.log(res);
            }
            console.log('Form Data:', formData.value);
        } else {
            smartAlert('请检查必填数据！', false, 1000);
        }
    });
}
// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/base/cust/customer/list' })
}
onMounted(async () => {
    // 获取等级数据
    const levelRes = await getCustomerLevelEnumApi();
    customerLevelOptions.value = levelRes.data.rows
    // 获取国家数据
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data
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
    // 获取状态数据
    const statusRes = await getCustomerStatusEnumApi();
    statusOptions.value = statusRes.data
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

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

.cursor-pointer {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: red;
}
</style>