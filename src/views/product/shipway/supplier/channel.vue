<template>
    <div class="tableDivItem" v-for="(item, index) in formData" :key="index">
        <div class="index-label">{{ index + 1 }}</div>
        <el-form :model="item" :rules="rules" :ref="el => setFormRef(el, index)" label-width="105px"
            style="width: 100%">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="渠道代码:" prop="code">
                        <el-input v-model.trim="item.code" :readonly="readonly" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="渠道名称:" prop="name">
                        <el-input v-model.trim="item.name" :readonly="readonly" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="承运商:" prop="carrierCode">
                        <el-select v-model="item.carrierCode" @change="(val) => onCarrierChange(val, index)"
                            :disabled="readonly">
                            <el-option v-for="opt in carrierOptions" :key="opt.id" :label="opt.name"
                                :value="opt.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="承运商服务:" prop="carrierServiceCode">
                        <el-select v-model="item.carrierServiceCode" clearable :disabled="readonly">
                            <el-option v-for="svc in item.carrierServiceOptions" :key="svc.id" :label="svc.name"
                                :value="svc.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注:">
                        <el-input type="textarea" autosize v-model="item.remark" :readonly="readonly" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="actions" v-if="!readonly">
            <el-icon :size="22" @click="handleDelAccount(index)">
                <CloseBold />
            </el-icon>
        </div>
        <div v-else style="width: 30px; height: 1px;"></div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
    getProductShipwayBrandListApi,
    getProductShipwayListByCarrierIdApi
} from '@/api/productApi/shipway.js'

const props = defineProps({
    formData: { type: Array, default: () => [] },
    readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['delete-item'])

// 验证规则
const rules = {
    code: [{ required: true, message: '请输入渠道代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
    carrierCode: [{ required: true, message: '请选择承运商物流', trigger: 'change' }]
}

// 表单引用
const formRefs = ref([])
const setFormRef = (el, index) => {
    formRefs.value[index] = el
}
// 对外暴露验证
const validateForms = () => {
    if (!formRefs.value.length) return Promise.resolve()
    const tasks = formRefs.value.map((f) => new Promise((res, rej) => {
        if (!f || !f.validate) return res()
        f.validate(valid => valid ? res() : rej(new Error('表单校验失败')))
    }))
    return Promise.all(tasks)
}
defineExpose({ validateForms })

// 删除行
const handleDelAccount = (index) => {
    emit('delete-item', index)
}

// 承运商列表
const carrierOptions = ref([])

// 拉服务函数
const fetchServices = async (carrierCode, rowIndex, clearCode = false) => {
    const brand = carrierOptions.value.find(b => b.code === carrierCode)
    if (!brand) return
    if (clearCode) {
        props.formData[rowIndex].carrierServiceCode = ''
    }
    // 清空旧 options
    props.formData[rowIndex].carrierServiceOptions = []

    const res = await getProductShipwayListByCarrierIdApi({
        carrierId: brand.id,
        statusId: 10
    })
    props.formData[rowIndex].carrierServiceOptions = res.data
}

// 手动切换
const onCarrierChange = (val, idx) => {
    fetchServices(val, idx, true)
}

// 首次加载：拉承运商 & 初始化所有行的服务列表
onMounted(async () => {
    const r = await getProductShipwayBrandListApi()
    carrierOptions.value = r.data
    // 初始渲染已有行
    props.formData.forEach((item, i) => {
        if (item.carrierCode) {
            fetchServices(item.carrierCode, i, false)
        }
    })
})

// 新增行时：监听 length 变动
let prevLen = props.formData.length
watch(
    () => props.formData.length,
    (len) => {
        if (len > prevLen) {
            for (let i = prevLen; i < len; i++) {
                const item = props.formData[i]
                if (item.carrierCode) {
                    fetchServices(item.carrierCode, i, false)
                }
            }
        }
        prevLen = len
    }
)
</script>

<style scoped lang="scss">
.tableDivItem {
    width: 1200px;
    padding: 15px 0 0 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    display: flex;
    margin: 15px 5px;

    .index-label {
        text-align: center;
        font-size: 22px;
        margin-top: 3px;
        width: 15px;
    }

    .actions {
        text-align: end;
        flex-shrink: 0;

        .el-icon {
            cursor: pointer;
            color: red;
            padding: 5px;
            margin: 0 5px;
        }

        .el-icon:hover {
            background-color: #ced2d6;
            border-radius: 50%;
        }
    }
}
</style>