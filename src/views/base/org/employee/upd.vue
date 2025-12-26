<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div class="contentDivTop">
                <div class="formDiv">
                    <p>员工信息</p>
                    <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px"
                        style="width: auto;padding-right: 10px;">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('orgId')" prop="orgId">
                                    <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                        :props="parentProps" clearable @change="handleCascaderChange" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('departmentId')" prop="departmentId">
                                    <el-select v-model="formData.departmentId" value-key="id"
                                        :placeholder="getPlaceholder('departmentId')">
                                        <el-option v-for="item in departmentOptions" :key="item.id" :label="item.nameCn"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('name')" prop="name">
                                    <el-input v-model="formData.name" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('num')">
                                    <el-input v-model="formData.num" disabled :placeholder="getPlaceholder('num')" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('sex')">
                                    <el-select v-model="formData.sex" value-key="id"
                                        :placeholder="getPlaceholder('sex')">
                                        <el-option label="男" :value="1" />
                                        <el-option label="女" :value="0" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('nationId')">
                                    <el-select v-model="formData.nationId" value-key="id" filterable
                                        :placeholder="getPlaceholder('nationId')">
                                        <el-option v-for="item in nationOptions" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('positionIdList')" prop="positionIdList">
                                    <el-select v-model="formData.positionIdList" multiple
                                        :placeholder="getPlaceholder('positionIdList')" clearable :max-collapse-tags="3"
                                        collapse-tags collapse-tags-tooltip>
                                        <el-option v-for="item in positionOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('roleIds')" prop="roleIds">
                                    <el-select v-model="formData.roleIds" multiple
                                        :placeholder="getPlaceholder('roleIds')" clearable :max-collapse-tags="3"
                                        collapse-tags collapse-tags-tooltip>
                                        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('statusId')">
                                    <el-select v-model="formData.statusId" value-key="id"
                                        :placeholder="getPlaceholder('statusId')" clearable disabled>
                                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('entryTime')">
                                    <el-date-picker v-model="formData.entryTime" type="date"
                                        :placeholder="getPlaceholder('entryTime')" format="YYYY/MM/DD"
                                        value-format="YYYY-MM-DD" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="getLabel('departureTime')">
                                    <el-date-picker v-model="formData.departureTime" type="date"
                                        :placeholder="getPlaceholder('departureTime')" format="YYYY/MM/DD"
                                        value-format="YYYY-MM-DD" disabled />
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
                            <el-col :span="12">
                                <el-form-item :label="getLabel('postcode')">
                                    <el-input v-model="formData.postcode" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item :label="getLabel('address')">
                                    <el-input type="textarea" v-model="formData.address" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="authorityDiv">
                    <p style="display: flex;align-items: center;">
                        {{ $t("Authority") }}
                        <el-tooltip :content='$t("RulePrompt")' effect="light" placement="bottom">
                            <el-icon class="elIcon" @click="openHint">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </p>
                    <div class="authorityDivContent">
                        <!-- 仓库权限 -->
                        <div class="authorityDivWh">
                            <el-form-item :label='$t("WhsePermScp")'>
                                <el-switch v-model="whSwitch" :active-text='$t("Desig.")'
                                    :inactive-text='$t("Default")' />
                            </el-form-item>
                            <div class="checkbox-container" v-show="whSwitch">
                                <el-checkbox v-model="whCheckAll" @change="handleWhCheckAllChange">
                                    {{ $t("SelectAll") }}
                                </el-checkbox>
                                <el-checkbox-group v-model="whCheckedList" @change="handleWhCheckedChange">
                                    <el-checkbox v-for="item in whList" :key="item.id" :label="item.id">
                                        {{ item.code + '(' + item.name + ')' }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>

                        <!-- 客户权限 -->
                        <div class="authorityDivCus">
                            <el-form-item :label='$t("CustPermScp")'>
                                <el-switch v-model="cusSwitch" :active-text='$t("Desig.")'
                                    :inactive-text='$t("Default")' />
                            </el-form-item>
                            <div class="checkbox-container" v-show="cusSwitch">
                                <div class="search-bar">
                                    <el-checkbox v-model="cusCheckAll" @change="handleCusCheckAllChange"
                                        style="width: 93px">
                                        {{ $t("SelectAll") }}
                                        {{ cusCheckedList.length ? cusCheckedList.length : 0 }}/{{ cusList.length }}
                                    </el-checkbox>
                                    <el-input v-model="cusSearch" :placeholder="$t('SearchCustomer')" clearable
                                        @input="filterCusList" style="width: 200px" />
                                </div>

                                <el-checkbox-group v-model="cusCheckedList" @change="handleCusCheckedChange">
                                    <div class="cus-checkbox-grid">
                                        <el-checkbox v-for="item in filteredCusList" :key="item.value"
                                            :label="item.value">
                                            {{ item.label }}
                                        </el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns" style="width: 1200px;">
                <!-- 保存和关闭 -->
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>
<script setup name="编辑员工">
import { QuestionFilled } from '@element-plus/icons-vue'
import { getPositionListApi } from "@/api/baseApi/org.js";
import { getUserDataPermScopeEnumApi, getOrgNationListApi, getOrgCountryListApi, getOrgListDepartmentApi, getOrgListCompanyApi, addOrgEmployeeApi, getOrgStatusEnumApi, getOrgEmployeeByIdApi, updEmployeeDataApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getUserRoleApi } from '@/api/sysApi/user.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { getButtonText } from '@/utils/i18n/i18nLabels.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

// 表单数据
const formData = ref({
    positionIdList: [],
    roleIds: [],
    orgId: '',
    departmentId: '',
    name: '',
    mobilePhone: '',
    sex: '',
    entryTime: '',
    country: '',
    countryCode: '',
    countryName: '',
    nation: '',
    nationId: '',
    nationName: '',
    province: '',
    city: '',
    postcode: '',
    address: '',
    email: '',
    userCode: '',
    password: '',
    num: '',
    statusId: '',
    status: null
});

const formRef = ref(null);
// 验证规则
const rules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    userCode: [
        { required: true, message: '请输入用户代码', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    orgId: [
        { required: true, message: '请选择公司', trigger: 'change' }
    ],
    departmentId: [
        { required: true, message: '请选择部门', trigger: 'change' }
    ],
    positionIdList: [
        { type: 'array', required: true, message: '请选择岗位', trigger: 'change' }
    ],
    roleIds: [
        { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
    ],
    entryTime: [
        { required: true, message: '请选择入职时间', trigger: 'change' }
    ],
    mobilePhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
};
// 打开规则提示
const openHint = () => {
    ElMessageBox.alert(t("DataPermissionDescription"), t("RulePrompt"), {
        confirmButtonText: getButtonText('confirm'),
        dangerouslyUseHTMLString: true,

    });
};

// 仓库权限
const whSwitch = ref(false);
const whList = ref([]);
const whCheckedList = ref([]);
const whCheckAll = ref(false);

const handleWhCheckAllChange = (val) => {
    whCheckedList.value = val ? whList.value.map((item) => item.id) : [];
};
const handleWhCheckedChange = (val) => {
    whCheckAll.value = val.length === whList.value.length;
};

// 客户权限
const cusSwitch = ref(false);
const cusList = ref([]);
const cusCheckedList = ref([]);
const cusCheckAll = ref(false);
const cusSearch = ref("");
const filteredCusList = ref([...cusList.value]);

const filterCusList = () => {
    if (!cusSearch.value) {
        filteredCusList.value = cusList.value;
    } else {
        filteredCusList.value = cusList.value.filter((item) =>
            item.label.includes(cusSearch.value)
        );
    }
};
// 全选/取消全选
const handleCusCheckAllChange = (val) => {
    cusCheckedList.value = val
        ? filteredCusList.value.map((item) => item.value)
        : [];
};
const handleCusCheckedChange = (val) => {
    cusCheckAll.value = val.length === filteredCusList.value.length;
};

// 岗位数据
const positionOptions = ref([])
// 角色数据
const roleOptions = ref([])
// 民族数据
const nationOptions = ref([])
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
// 公司改变事件
const handleCascaderChange = async () => {
    // 如果值为空，清空部门数据
    if (!formData.value.orgId) {
        departmentOptions.value = [];
        formData.value.departmentId = '';
        return;
    }
    nextTick(() => {
        cascaderRef.value.togglePopperVisible()
    });
    const res = await getOrgListDepartmentApi({ parentId: formData.value.orgId });
    // 清空选择的部门
    formData.value.departmentId = '';
    departmentOptions.value = res.data;
    console.log('部门数据:', departmentOptions.value)
};
// 部门数据
const departmentOptions = ref([])
// 权限开关
const dataPermScopeEnum = ref([])
// 状态数据
const statusOptions = ref([])
// 保存
const handleSave = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            const form = {
                ...formData.value, id: props.id,
                warehouseIds: whCheckedList.value,
                customerIds: cusCheckedList.value,
                warehouseScope: whSwitch.value ? dataPermScopeEnum.value[0] : dataPermScopeEnum.value[1],
                customerScope: cusSwitch.value ? dataPermScopeEnum.value[0] : dataPermScopeEnum.value[1],
            };
            const res = await updEmployeeDataApi(form);
            smartAlert(res.msg, res.success, 1000);
            if (res.success) {
                refreshStore.shouldRefreshEmployeeList = true// 设置刷新标记
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
                router.push('/base/org/employee/list')
            } else {
                console.log(res);
            }
            console.log('Form Data:', formData.value);
        } else {
            console.log('Form validation failed.');
        }
    });
}
// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/base/org/employee/list' })
}
onMounted(async () => {
    ElLoading.service({
        lock: true,
        text: '加载中...',
    })
    // 获取岗位数据
    const positionRes = await getPositionListApi();
    positionOptions.value = positionRes.data.rows.map(item => ({
        value: item.id,
        label: item.name,
    }))
    // 获取民族数据
    const nationRes = await getOrgNationListApi();
    nationOptions.value = nationRes.data.rows
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
    const statusRes = await getOrgStatusEnumApi();
    statusOptions.value = statusRes.data
    // 仓库数据
    const res = await getWhWarehouseApi()
    whList.value = res.data
    // 客户数据
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    cusList.value = result.data ? result.data.map((item) => ({
        value: item.id,
        label: `${item.code}(${item.name})`,
    })) : []
    filteredCusList.value = cusList.value; // 初始化
    // 权限枚举
    const dataPermScopeEnumRes = await getUserDataPermScopeEnumApi()
    dataPermScopeEnum.value = dataPermScopeEnumRes.data
    console.log('权限枚举:', dataPermScopeEnum.value)
    // 角色数据
    const roleRes = await getUserRoleApi()
    roleOptions.value = roleRes.data
    // 获取员工信息
    const employeeRes = await getOrgEmployeeByIdApi({ id: props.id })
    console.log('员工信息:', employeeRes.data);
    formData.value = {
        ...employeeRes.data,
        positionIdList: employeeRes.data.positionList.map(item => item.id),
        roleIds: employeeRes.data.roleIds,
    }
    whSwitch.value = employeeRes.data.warehouseScope == dataPermScopeEnum.value[0]
    console.log('仓库权限:', whSwitch.value)
    whCheckedList.value = employeeRes.data.warehouseIds
    cusSwitch.value = employeeRes.data.customerScope == dataPermScopeEnum.value[0]
    cusCheckedList.value = employeeRes.data.customerIds || []
    // 获取部门数据
    const departmentRes = await getOrgListDepartmentApi({ parentId: employeeRes.data.orgId });
    departmentOptions.value = departmentRes.data
    ElLoading.service().close()
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

:deep(.el-date-editor) {
    width: 100% !important;
}

.contentDivTop {
    display: flex;
    width: 100%;

    .formDiv {
        width: 600px;
    }

    .authorityDiv {
        flex: 1;
        margin-left: 20px;

        .elIcon {
            cursor: pointer;
        }

        .authorityDivContent {
            display: flex;
            margin-top: 12px;
            padding-left: 10px;
        }

        .authorityDivWh,
        .authorityDivCus {
            margin-right: 16px;
            height: 502px;
            overflow: hidden;
        }

        .authorityDivWh {
            width: 300px;
        }

        .authorityDivCus {
            width: 340px;
        }

        .checkbox-container {
            margin-top: 8px;
            height: calc(100% - 50px);
            overflow-y: auto;
        }

        .cus-checkbox-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px 8px;
            margin-top: 8px;
        }

        .search-bar {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 12px;
        }
    }
}

:deep(.el-checkbox) {
    margin-right: 10px;
    width: 130px;
}
</style>