<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>产品信息</p>
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px" style="width: 1200px;">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="产品代码:" prop="code">
                            <el-input v-model.trim="formData.code" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产品名称:" prop="name">
                            <el-input v-model.trim="formData.name" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态:" prop="statusId">
                            <el-select v-model="formData.statusId" value-key="id" disabled>
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="运输方式:" prop="typeId">
                            <el-select v-model="formData.typeId" value-key="id" disabled>
                                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="渠道模式:" prop="channelSelect">
                            <el-select v-model="formData.channelSelect" @change="channelSelectChange" disabled>
                                <el-option v-for="item in channelSelectOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="承运商:" prop="carrierCode">
                            <el-select v-model="formData.carrierCode" @change="handleChannelSelectChange" disabled>
                                <el-option v-for="item in carrierOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="仓库:" prop="warehouseCodeText">
                            <el-input type="textarea" v-model="formData.warehouseCodeText" :rows="1" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="时效范围:">
                            <el-input v-model="formData.minDay" v-number readonly />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxDay" v-number readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="体积范围(M³):">
                            <el-input v-model="formData.minVolume" v-number readonly />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxVolume" v-number readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <el-form-item label="重量范围(KG):">
                            <el-input v-model="formData.minWeight" v-number readonly />
                        </el-form-item>
                        <el-form-item label="-" label-width="35px">
                            <el-input v-model="formData.maxWeight" v-number readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保险服务:">
                            <el-select v-model="formData.insuranceId" disabled>
                                <el-option v-for="item in insuranceOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="签名服务:">
                            <el-select v-model="formData.signatureId" disabled>
                                <el-option v-for="item in signatureOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上传面单:">
                            <el-select v-model="formData.uploadWaybillId" disabled>
                                <el-option v-for="item in uploadWaybillOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="渠道描述:">
                            <el-input v-model="formData.description" type="textarea" :rows="1" readonly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input type="textarea" v-model="formData.remark" :rows="1" readonly />
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
                            :title="item.name">{{ item.name }}
                        </div>
                    </el-splitter-panel>
                    <el-splitter-panel>
                        <div class="panelRight">
                            <div v-if="!formData.carrierCode" class="textTitle">
                                --------------------请先选择承运商--------------------</div>
                            <el-checkbox v-if="formData.channelSelect === 2" v-model="checkAll"
                                :indeterminate="isIndeterminate" @change="handleCheckAllChange" disabled>
                                全选
                            </el-checkbox>
                            <!-- 一对一：单选框 -->
                            <el-radio-group v-if="formData.channelSelect === 1" v-model="formData.shipwayList" disabled>
                                <el-radio v-for="item in filteredShipwayList" :key="item.id" :label="item.id"
                                    size="large">
                                    {{ item.code + '-' + item.name + '[' + item.supplierCode + '-' + item.supplierName +
                                        ']'
                                    }}
                                </el-radio>
                            </el-radio-group>

                            <!-- 一对多：复选框 -->
                            <el-checkbox-group v-else v-model="formData.shipwayList" disabled>
                                <el-checkbox v-for="item in filteredShipwayList" :key="item.id" :label="item.id"
                                    size="large">
                                    {{ item.code + '-' + item.name + '[' + item.supplierCode + '-' + item.supplierName +
                                        ']'
                                    }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-splitter-panel>
                </el-splitter>
            </div>
            <div class="btns" style="width: 1200px;">
                <!-- 关闭 -->
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>

</template>

<script setup name="物流产品详情">
import { ref, computed, onMounted } from 'vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import {
    getProductShipwayTypeEnumApi, getProductShipwayStatusEnumApi, getProductSupplierListApi,
    getProductShipwayBrandListApi, getProductShipwayListByShipwayIdApi, updProductShipwayApi, getProductShipwayInfoApi,
    getProductShipwayChannelListApi, getProductShipwayChannelSelectEnumApi, getProductShipwayUploadWaybillEnumApi, getProductShipwaySignatureEnumApi, getProductShipwayInsuranceEnumApi
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

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    }
})

// 完整渠道列表
const allShipwayList = ref([])
// 当前选中菜单，'1'表示全部
const selectMenu = ref('1')
// 供应商列表
const supplierList = ref([])

// 存储后端返回的初始已选渠道（对象数组，包含 supplierChannelCode & supplierCode）
const initialShipwayList = ref([])

// 表单数据（注意：shipwayList 内部保存 id；单选时是单个 id 值， 多选时是 id 数组）
const formData = ref({
    code: '',
    name: '',
    statusId: '',
    typeId: '',
    carrierCode: '',
    channelSelect: 1, // 默认一对一
    warehouseCodeList: [],
    maxDay: '',
    minDay: '',
    maxVolume: '',
    minVolume: '',
    maxWeight: '',
    minWeight: '',
    description: '',
    remark: '',
    shipwayList: [], // 存 id
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
    ]
};

// 筛选后的渠道列表（基于 supplierId）
const filteredShipwayList = computed(() => {
    if (selectMenu.value === '1') {
        return allShipwayList.value
    }
    return allShipwayList.value.filter(
        (i) => i.supplierId != null && String(i.supplierId) === String(selectMenu.value)
    )
})

// Helper: 根据后端的 channel 对象数组映射为 allShipwayList 中对应的 id 列表
// 输入可以是： [{ supplierChannelCode: 'S006', supplierCode: 'TEST005' }, ...]
// 返回 id 数组（只返回能匹配到的）
const channelsToIds = (channels = []) => {
    if (!channels) return []
    const normalized = Array.isArray(channels) ? channels.slice() : [channels]
    const ids = []
    normalized.forEach(it => {
        if (!it) return
        if (typeof it === 'string') {
            // 只有 code 情况，优先匹配第一个 code 相等项
            const found = allShipwayList.value.find(i => String(i.code) === String(it))
            if (found) ids.push(found.id)
        } else if (typeof it === 'object') {
            // 同时匹配 supplierChannelCode (code) 和 supplierCode（更精确）
            const found = allShipwayList.value.find(i =>
                String(i.code) === String(it.supplierChannelCode) &&
                (String(i.supplierCode) === String(it.supplierCode))
            )
            if (found) {
                ids.push(found.id)
            } else {
                // 如果没有完全匹配（可能历史数据只有 code），退回到只匹配 code（但优先使用精确匹配）
                const fallback = allShipwayList.value.find(i => String(i.code) === String(it.supplierChannelCode))
                if (fallback) ids.push(fallback.id)
            }
        }
    })
    return ids
}

// Helper: 把 id 数组映射成对应 code 数组（用于提交：supplierChannelCode）
const idsToCodes = (ids = []) => {
    if (!ids) return []
    const idArr = Array.isArray(ids) ? ids : [ids]
    return allShipwayList.value
        .filter(i => idArr.includes(i.id))
        .map(i => i.code)
}

// Helper: 把 id 数组映射成对应 supplierCode 数组（用于提交）
const idsToSupplierCodes = (ids = []) => {
    if (!ids) return []
    const idArr = Array.isArray(ids) ? ids : [ids]
    return allShipwayList.value
        .filter(i => idArr.includes(i.id))
        .map(i => (i.supplierCode != null ? String(i.supplierCode) : ''))
}

// ---------- 辅助：统一返回当前已选 id 数组（兼容单选/多选） ----------
const getSelectedIdArray = () => {
    const v = formData.value.shipwayList
    if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') {
        return v ? [v] : []
    }
    return Array.isArray(v) ? v.slice() : (v ? [v] : [])
}

// ---------- 半选状态（基于右侧可见项判断，使用 id） ----------
const isIndeterminate = computed(() => {
    if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') return false
    const visible = filteredShipwayList.value
    const total = visible.length
    if (total === 0) return false
    const selected = getSelectedIdArray()
    const checkedCount = visible.reduce((cnt, item) => {
        return cnt + (selected.includes(item.id) ? 1 : 0)
    }, 0)
    return checkedCount > 0 && checkedCount < total
})

// ---------- 全选控制（get/set 都只基于右侧可见项，使用 id） ----------
const checkAll = computed({
    get() {
        if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') return false
        const visible = filteredShipwayList.value
        const total = visible.length
        if (total === 0) return false
        const selected = getSelectedIdArray()
        return visible.every((item) => selected.includes(item.id))
    },
    set(val) {
        if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') return
        const visibleIds = filteredShipwayList.value.map((i) => i.id)
        const selected = getSelectedIdArray()
        if (val) {
            // 选中所有可见项：并入 selected（保留不可见已选）
            const union = Array.from(new Set([...selected, ...visibleIds]))
            formData.value.shipwayList = union
        } else {
            // 取消可见项：移除 visibleIds
            const remaining = selected.filter((id) => !visibleIds.includes(id))
            formData.value.shipwayList = remaining
        }
    }
})

// 响应全选复选框的 @change 事件
const handleCheckAllChange = (val) => {
    if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') return
    checkAll.value = val
}

// 点击供应商菜单
const handleSelect = (menu) => {
    selectMenu.value = menu
}

const formRef = ref(null)
// 保存 — 将所选 id 映射回 code 与 supplierCode 后提交
const handleSave = async () => {
    const valid = await formRef.value.validate()
    if (!valid) return

    // 得到选中的 id 列表（兼容单选/多选）
    const selectedIds = formData.value.channelSelect == 1 || formData.value.channelSelect === '1'
        ? (formData.value.shipwayList ? [formData.value.shipwayList] : [])
        : (Array.isArray(formData.value.shipwayList) ? formData.value.shipwayList : [])

    // 将 id -> item（包含 code 与 supplierCode）
    const dtoList = selectedIds.map((id) => {
        const item = allShipwayList.value.find((i) => String(i.id) === String(id))
        return {
            supplierChannelCode: item?.code || '',
            supplierCode: item?.supplierCode?.toString() || ''
        }
    })

    const payload = {
        ...formData.value,
        shipwayChannelAddDTOList: dtoList
    }

    const res = await updProductShipwayApi(payload)
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

// 切换渠道模式（val 为 channelSelect）
// 拉取后端保存的 channelList（包含 supplierChannelCode & supplierCode）并存入 initialShipwayList
const channelSelectChange = async (val) => {
    formData.value.channelSelect = val
    try {
        const res = await getProductShipwayChannelListApi({ shipwayId: route.params.id, channelSelect: val })
        const list = res.data || []
        // 保存为对象数组，后面根据 allShipwayList 去映射 id
        initialShipwayList.value = list.map(i => ({
            supplierChannelCode: i.supplierChannelCode,
            supplierCode: i.supplierCode
        }))
    } catch (err) {
        initialShipwayList.value = []
    }

    // 如果 allShipwayList 已加载，则直接映射为 id 并设置 formData
    if (allShipwayList.value && allShipwayList.value.length > 0) {
        const mappedIds = channelsToIds(initialShipwayList.value)
        if (val === 1 || val === '1') {
            formData.value.shipwayList = mappedIds[0] || ''
        } else {
            formData.value.shipwayList = mappedIds
        }
    } else {
        // 若渠道列表还未加载（例如还没选承运商），先把选中置空，等待 handleChannelSelectChange 恢复
        formData.value.shipwayList = (val === 1 || val === '1') ? '' : []
    }
}

// 获取并设置渠道列表（当承运商变化时），并恢复初始选中（把 initialShipwayList -> ids）
const handleChannelSelectChange = async () => {
    const res = await getProductShipwayListByShipwayIdApi({ carrierCode: formData.value.carrierCode })
    allShipwayList.value = res.data || []
    selectMenu.value = '1'
    // initialShipwayList -> ids 映射（如果有初始已选）
    if (initialShipwayList.value && initialShipwayList.value.length > 0) {
        const mappedIds = channelsToIds(initialShipwayList.value)
        if (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') {
            formData.value.shipwayList = mappedIds[0] || ''
        } else {
            formData.value.shipwayList = mappedIds
        }
    } else {
        // 没有 initial 已选，则清空
        formData.value.shipwayList = (formData.value.channelSelect == 1 || formData.value.channelSelect === '1') ? '' : []
    }
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
    const loading = ElLoading.service({ lock: true, text: 'Loading' })
    try {
        // 仓库
        const wh = await getWhWarehouseApi()
        warehouseOptions.value = wh.data || []
        // 运输方式
        const ty = await getProductShipwayTypeEnumApi()
        typeOptions.value = ty.data || []
        // 状态
        const st = await getProductShipwayStatusEnumApi()
        statusOptions.value = st.data || []
        // 服务商
        const sp = await getProductSupplierListApi()
        supplierList.value = sp.data || []
        // 承运商
        const cb = await getProductShipwayBrandListApi()
        carrierOptions.value = cb.data || []
        // 渠道模式
        const cs = await getProductShipwayChannelSelectEnumApi()
        channelSelectOptions.value = cs.data || []
        // 保险服务
        const ins = await getProductShipwayInsuranceEnumApi()
        insuranceOptions.value = ins.data || []
        // 签名服务
        const sig = await getProductShipwaySignatureEnumApi()
        signatureOptions.value = sig.data || []
        // 上传面单
        const up = await getProductShipwayUploadWaybillEnumApi()
        uploadWaybillOptions.value = up.data || []

        // 获取详情（包含后端保存的 supplierChannelCode & supplierCode 列表）
        const res = await getProductShipwayInfoApi({ id: route.params.id || '' })
        const info = res.data || {}
        // 保存初始已选为对象数组（包含 supplierChannelCode & supplierCode）
        initialShipwayList.value = (info.shipwayChannelList || []).map(i => ({
            supplierChannelCode: i.supplierChannelCode,
            supplierCode: i.supplierCode
        }))

        // 表单赋值（warehouseList -> warehouseCode 列表）
        Object.assign(formData.value, {
            ...info,
            warehouseCodeList: (info.warehouseList || []).map(item => item.warehouseCode)
        })

        // 触发 channelSelectChange（会请求后端 channelList 并尝试映射）
        await channelSelectChange(formData.value.channelSelect)

        // 加载渠道列表（根据 carrierCode）并恢复选中（handleChannelSelectChange 会把 initialShipwayList -> ids）
        await handleChannelSelectChange()
    } finally {
        loading.close()
    }
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
