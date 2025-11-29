<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>产品信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px" style="width: 1200px;">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="产品代码:" prop="code">
                            <el-input v-model.trim="formData.code" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产品名称:" prop="name">
                            <el-input v-model.trim="formData.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态:" prop="statusId">
                            <el-select v-model="formData.statusId" value-key="id" placeholder="请选择状态">
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="运输方式:" prop="typeId">
                            <el-select v-model="formData.typeId" value-key="id" placeholder="请选择运输方式">
                                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="渠道模式:" prop="channelSelect">
                            <el-select v-model="formData.channelSelect" placeholder="请选择到仓类型"
                                @change="channelSelectChange">
                                <el-option v-for="item in channelSelectOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="承运商:" prop="carrierCode">
                            <el-select v-model="formData.carrierCode" placeholder="请选择承运商"
                                @change="handleChannelSelectChange">
                                <el-option v-for="item in carrierOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="仓库:" prop="warehouseCodeList">
                            <el-select v-model="formData.warehouseCodeList" value-key="id" placeholder="请选择仓库" multiple
                                clearable collapse-tags :max-collapse-tags="7">
                                <el-option v-for="item in warehouseOptions" :key="item.id"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="时效范围:">
                            <el-input v-model="formData.minDay" v-intNumber placeholder="最小时效" />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxDay" v-intNumber placeholder="最大时效" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="体积范围(M³):">
                            <el-input v-model="formData.minVolume" v-number placeholder="最小体积" />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxVolume" v-number placeholder="最大体积" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="重量范围(KG):">
                            <el-input v-model="formData.minWeight" v-number placeholder="最小重量" />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxWeight" v-number placeholder="最大重量" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保险服务:">
                            <el-select v-model="formData.insuranceId" placeholder="请选择保险服务">
                                <el-option v-for="item in insuranceOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="签名服务:">
                            <el-select v-model="formData.signatureId" placeholder="请选择签名服务">
                                <el-option v-for="item in signatureOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上传面单:">
                            <el-select v-model="formData.uploadWaybillId" placeholder="请选择上传面单">
                                <el-option v-for="item in uploadWaybillOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="渠道描述:">
                            <el-input v-model="formData.description" type="textarea" :rows="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input type="textarea" v-model="formData.remark" :rows="1" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <p>渠道信息</p>
            <div class="channelDiv">
                <el-splitter>
                    <el-splitter-panel size="200">
                        <div class="panel" :class="{ active: selectMenu === '1' }" @click="handleSelect('1')">全部</div>
                        <div class="panel" v-for="item in supplierList" :key="item.id"
                            :class="{ active: selectMenu === item.id }" @click="handleSelect(item.id)"
                            :title="item.name">{{
                                item.name }}
                        </div>
                    </el-splitter-panel>
                    <el-splitter-panel>
                        <div class="panelRight">
                            <div v-if="!formData.carrierCode" class="textTitle">
                                --------------------请先选择承运商--------------------</div>
                            <el-checkbox v-if="formData.channelSelect == '2'" v-model="checkAll"
                                :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                                全选
                            </el-checkbox>
                            <!-- 一对一：单选框（value 用 id） -->
                            <el-radio-group v-if="formData.channelSelect == '1'" v-model="formData.shipwayList">
                                <el-radio v-for="item in filteredShipwayList" :key="item.id" :label="item.id"
                                    size="large">
                                    {{ item.code + '-' + item.name + '[' + item.supplierCode + '-' + item.supplierName +
                                        ']' }}
                                </el-radio>
                            </el-radio-group>

                            <!-- 一对多：复选框（value 用 id） -->
                            <el-checkbox-group v-else v-model="formData.shipwayList">
                                <el-checkbox v-for="item in filteredShipwayList" :key="item.id" :label="item.id"
                                    size="large">
                                    {{ item.code + '-' + item.name + '[' + item.supplierCode + '-' + item.supplierName +
                                        ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-splitter-panel>
                </el-splitter>
            </div>
            <div class="btns" style="width: 1200px;">
                <!-- 保存和关闭 -->
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="新增物流产品">
import { ref, computed, onMounted } from 'vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import {
    getProductShipwayTypeEnumApi, getProductShipwayStatusEnumApi, getProductSupplierListApi, getProductShipwayBrandListApi,
    getProductShipwayListByShipwayIdApi, addProductShipwayApi, getProductShipwayChannelSelectEnumApi, getProductShipwayUploadWaybillEnumApi, getProductShipwaySignatureEnumApi, getProductShipwayInsuranceEnumApi
} from '@/api/productApi/shipway.js'
import { smartAlert } from '@/utils/genericMethods.js'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'
import tagsStore from '@/store/tags.js'
import { useRefreshStore } from '@/store/refresh.js'
import { ElLoading } from 'element-plus'

const route = useRoute()
const useTagsStore = tagsStore()
const refreshStore = useRefreshStore()

// 完整渠道列表，用于筛选和“全部”展示
const allShipwayList = ref([])
// 当前选中菜单：'1' 表示全部，否则为 supplierId 字符串/number
const selectMenu = ref('1')
// 供应商列表
const supplierList = ref([])

// 表单数据
const formData = ref({
    code: '',
    name: '',
    statusId: '',
    typeId: '',
    carrierCode: '',
    channelSelect: 1, // 默认一对一（注意：视后端数据可能是数字或字符串，示例保持原样）
    warehouseCodeList: [],
    maxDay: '',
    minDay: '',
    maxVolume: '',
    minVolume: '',
    maxWeight: '',
    minWeight: '',
    insuranceId: '',
    signatureId: '',
    uploadWaybillId: '',
    description: '',
    remark: '',
    // 注意：shipwayList 现在存放的是 id（单选时是单个 id 值，复选时是 id 数组）
    shipwayList: [],
    shipwayChannelAddDTOList: []
})
const rules = {
    code: [
        { required: true, message: '请输入产品代码', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入产品名称', trigger: 'blur' }
    ],
    statusId: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    typeId: [
        { required: true, message: '请选择运输方式', trigger: 'change' }
    ],
    carrierCode: [
        { required: true, message: '请选择承运商', trigger: 'change' }
    ],
    warehouseCodeList: [
        { required: true, message: '请选择仓库', trigger: 'change' }
    ],
    maxDay: [
        { required: true, message: '请输入时效最大天数', trigger: 'blur' },
    ],
    maxVolume: [
        { required: true, message: '请输入最大体积', trigger: 'blur' },
    ],
    maxWeight: [
        { required: true, message: '请输入最大重量', trigger: 'blur' },
    ],
    minDay: [
        { required: true, message: '请输入时效最小天数', trigger: 'blur' },
    ],
    minVolume: [
        { required: true, message: '请输入最小体积', trigger: 'blur' },
    ],
    minWeight: [
        { required: true, message: '请输入最小重量', trigger: 'blur' },
    ],
};

// 筛选后的渠道列表
const filteredShipwayList = computed(() => {
    if (selectMenu.value === '1') {
        return allShipwayList.value
    }
    return allShipwayList.value.filter(
        (i) => i.supplierId.toString() === selectMenu.value.toString()
    )
})

// 半选状态：注意 shipwayList 存的是 id（单选时为单个 id）
const isIndeterminate = computed(() => {
    const total = filteredShipwayList.value.length
    // 处理单选值与多选值的一致判断：统一把单选值视为长度 1 的数组
    const selected = Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : (formData.value.shipwayList ? [formData.value.shipwayList] : [])
    const checkedCount = selected.filter((id) =>
        filteredShipwayList.value.some((i) => i.id == id)
    ).length
    return checkedCount > 0 && checkedCount < total
})

// 全选控制（get / set 都以 id 为单位）
const checkAll = computed({
    get() {
        const total = filteredShipwayList.value.length
        const selected = Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : (formData.value.shipwayList ? [formData.value.shipwayList] : [])
        const checkedCount = selected.filter((id) =>
            filteredShipwayList.value.some((i) => i.id == id)
        ).length
        return total > 0 && checkedCount === total
    },
    set(val) {
        if (val) {
            // 选中所有可见项，并保留之前已选（去重）
            const ids = filteredShipwayList.value.map((i) => i.id)
            const current = Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : (formData.value.shipwayList ? [formData.value.shipwayList] : [])
            formData.value.shipwayList = Array.from(new Set([...current, ...ids]))
        } else {
            // 取消当前可见项
            const current = Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : (formData.value.shipwayList ? [formData.value.shipwayList] : [])
            formData.value.shipwayList = current.filter(
                (id) => !filteredShipwayList.value.some((i) => i.id == id)
            )
            // 如果 channelSelect 为 单选模式，则把单选重置为空（保持类型一致）
            if (formData.value.channelSelect == '1' || formData.value.channelSelect == 1) {
                // 单选模式，用空字符串表示无选择（与原行为兼容）
                formData.value.shipwayList = []
            }
        }
    }
})

// 点击供应商菜单
const handleSelect = (menu) => {
    selectMenu.value = menu
}

// 响应全选复选框的 @change 事件
const handleCheckAllChange = (val) => {
    checkAll.value = val
}
const formRef = ref(null)
// 保存
const handleSave = async () => {
    const valid = await formRef.value.validate()
    if (!valid) return

    // 兼容单选和多选：统一得到选中的 id 数组
    const selectedIds = formData.value.channelSelect == '1'
        ? (formData.value.shipwayList ? [formData.value.shipwayList] : [])
        : (Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : [])

    // 构造 DTO 数组：提交时仍要使用 supplierChannelCode = item.code（即用 code 提交），supplierCode 保持原逻辑
    const dtoList = selectedIds.map((id) => {
        const item = allShipwayList.value.find((i) => i.id == id)
        return {
            supplierChannelCode: item?.code || '', // **保持用 code 提交**
            supplierCode: item?.supplierCode?.toString() || ''
        }
    })
    const payload = {
        ...formData.value,
        shipwayChannelAddDTOList: dtoList
    }

    const res = await addProductShipwayApi(payload)
    smartAlert(res.msg, res.success, 1000)
    if (res.success) {
        refreshStore.shouldRefreshShipwayList = true
        useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
            (item) => item.path !== route.fullPath
        )
        router.push('/product/shipway/shipway/list')
    }
}

// 关闭
const handleClose = () => {
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
        (item) => item.path !== route.fullPath
    )
    router.push('/product/shipway/shipway/list')
}

const channelSelectChange = () => {
    // 切换模式时清空已选（单选置空， 多选置空数组）
    if (formData.value.channelSelect == '1' || formData.value.channelSelect == 1) {
        formData.value.shipwayList = [] // 单选时保持为空
    } else {
        formData.value.shipwayList = []
    }
}

// 当承运商变化时，重新拉取渠道数据并清空选中
const handleChannelSelectChange = async () => {
    const res = await getProductShipwayListByShipwayIdApi({
        carrierCode: formData.value.carrierCode
    })
    allShipwayList.value = res.data
    selectMenu.value = '1'
    // 同样，清空选中（单选清空，复选清空数组）
    formData.value.shipwayList = []
}

// 其他枚举数据
const warehouseOptions = ref([])
const typeOptions = ref([])
const statusOptions = ref([])
const carrierOptions = ref([])
const channelSelectOptions = ref([])
// 保险服务/签名服务/上传面单等枚举数据
const insuranceOptions = ref([])
const signatureOptions = ref([])
const uploadWaybillOptions = ref([])

onMounted(async () => {
    const loading = ElLoading.service({ lock: true, target: ".contentDiv", text: 'Loading' })
    // 仓库
    const wh = await getWhWarehouseApi()
    warehouseOptions.value = wh.data
    // 运输方式
    const ty = await getProductShipwayTypeEnumApi()
    typeOptions.value = ty.data
    // 状态
    const st = await getProductShipwayStatusEnumApi()
    statusOptions.value = st.data
    // 服务商
    const sp = await getProductSupplierListApi()
    supplierList.value = sp.data
    // 承运商
    const cb = await getProductShipwayBrandListApi()
    carrierOptions.value = cb.data
    // 渠道模式
    const ch = await getProductShipwayChannelSelectEnumApi()
    channelSelectOptions.value = ch.data
    // 保险服务
    const ins = await getProductShipwayInsuranceEnumApi()
    insuranceOptions.value = ins.data
    // 签名服务
    const sig = await getProductShipwaySignatureEnumApi()
    signatureOptions.value = sig.data
    // 上传面单
    const up = await getProductShipwayUploadWaybillEnumApi()
    uploadWaybillOptions.value = up.data
    loading.close()
})
</script>


<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.channelDiv {
    height: 265px;
    width: 1300px;

    .panel {
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        // 超出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
    }

    .panel:not(.active):hover {
        background-color: #f5f5f5;
    }

    .active {
        background-color: #d5e2ff;
    }

    .panelRight {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 5px 15px;
        overflow-y: auto;

        .textTitle {
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #999;
        }
    }
}

:deep(.el-input) {
    width: 100% !important;
}

:deep(.input-error-text .el-input__wrapper) {
    box-shadow: 0 0 0 1px #ff3a3a !important;
}

:deep(.input-error-text .el-input__inner) {
    color: #ff3a3a !important;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
    font-size: 18px;
}

:deep(.el-radio.el-radio--large .el-radio__label) {
    font-size: 18px;
}

:deep(.el-checkbox__label) {
    font-size: 18px;
}
</style>
