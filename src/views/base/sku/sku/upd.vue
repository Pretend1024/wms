<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>SKU信息</p>

            <el-form :model="formData" :rules="rules" ref="formRef" label-width="125px">
                <el-row>
                    <!-- 客户代码 -->
                    <el-col :span="8">
                        <el-form-item label="客户代码:" class="compact-item" prop="customerCode">
                            <el-select v-model="formData.customerCode" filterable placeholder="请输入客户代码"
                                popper-class="multi-column-select" clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- SKU -->
                    <el-col :span="8">
                        <el-form-item label="sku:" prop="sku">
                            <el-input v-model="formData.sku" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="条码:" prop="barcode">
                            <el-input v-model="formData.barcode" />
                        </el-form-item>
                    </el-col>
                    <!-- 中文品名 -->
                    <el-col :span="8">
                        <el-form-item label="中文品名:" prop="nameCn">
                            <el-input v-model="formData.nameCn" />
                        </el-form-item>
                    </el-col>
                    <!-- 英文品名 -->
                    <el-col :span="8">
                        <el-form-item label="英文品名:" prop="nameEn">
                            <el-input v-model="formData.nameEn" />
                        </el-form-item>
                    </el-col>
                    <!-- 规格型号 -->
                    <el-col :span="8">
                        <el-form-item label="规格型号:">
                            <el-input v-model="formData.model" />
                        </el-form-item>
                    </el-col>
                    <!-- 报关品名 -->
                    <el-col :span="8">
                        <el-form-item label="报关品名:">
                            <el-input v-model="formData.customsName" />
                        </el-form-item>
                    </el-col>
                    <!-- 单位毛重 -->
                    <el-col :span="8">
                        <el-form-item label="单位毛重(KG):" prop="grossWeight">
                            <el-input v-model="formData.grossWeight" v-number />
                        </el-form-item>
                    </el-col>
                    <!-- 单位净重 -->
                    <el-col :span="8">
                        <el-form-item label="单位净重(KG):" prop="netWeight">
                            <el-input v-model="formData.netWeight" v-number />
                        </el-form-item>
                    </el-col>
                    <!-- 单位价格 -->
                    <el-col :span="8">
                        <el-form-item label="单位价格:" prop="unitValue">
                            <el-input v-model="formData.unitValue" v-number />
                        </el-form-item>
                    </el-col>
                    <!-- 报关价格 -->
                    <el-col :span="8">
                        <el-form-item label="报关价格:" prop="customsValue">
                            <el-input v-model="formData.customsValue" v-number />
                        </el-form-item>
                    </el-col>
                    <!-- 币种代码 -->
                    <el-col :span="8">
                        <el-form-item label="币种代码:">
                            <el-select v-model="formData.currency" value-key="id" filterable placeholder="请选择币种">
                                <el-option v-for="item in nationOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 原产国代码 -->
                    <el-col :span="8">
                        <el-form-item label="原产国代码:">
                            <el-select v-model="formData.originCountry" value-key="id" filterable placeholder="请选择国家">
                                <el-option v-for="item in countryOptions" :key="item.id"
                                    :label="`${item.code} - ${item.nameCn} - ${item.nameEn}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 海关编码 -->
                    <el-col :span="8">
                        <el-form-item label="海关编码:">
                            <el-input v-model="formData.hsCode" />
                        </el-form-item>
                    </el-col>
                    <!-- 商品备注 -->
                    <el-col :span="24">
                        <el-form-item label="商品备注:">
                            <el-input type="textarea" v-model="formData.remark" />
                        </el-form-item>
                    </el-col>
                    <!-- 危险/带电 类型 -->
                    <el-col :span="8">
                        <el-form-item label="危险类型:">
                            <el-select v-model="formData.dangerId" value-key="id" placeholder="请选择">
                                <el-option v-for="item in dangerOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="带电类型:">
                            <el-select v-model="formData.electrifiedId" value-key="id" placeholder="请选择">
                                <el-option v-for="item in electrifiedOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 预报信息 -->
                    <el-col :span="24">
                        <p class="itemTitle">预报尺寸</p>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预报长度(CM):" prop="cusLength">
                            <el-input v-model="formData.cusLength" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预报宽度(CM):" prop="cusWidth">
                            <el-input v-model="formData.cusWidth" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预报高度(CM):" prop="cusHeight">
                            <el-input v-model="formData.cusHeight" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预报体积(M³):">
                            <el-input v-model="formData.cusVolume" v-number disabled placeholder="保存时自动计算" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否新品:">
                            <el-select v-model="formData.isNew" placeholder="请选择是否新品" clearable>
                                <el-option :label="$t('yes')" :value=true />
                                <el-option :label="$t('no')" :value=false />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="仓库审核:">
                            <el-select v-model="formData.statusId" placeholder="请选择仓库审核" clearable>
                                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 仓库信息 -->
                    <el-col :span="24">
                        <p class="itemTitle">复测尺寸</p>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复测长度(CM):" prop="length">
                            <el-input v-model="formData.length" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复测宽度(CM):" prop="width">
                            <el-input v-model="formData.width" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复测高度(CM):" prop="height">
                            <el-input v-model="formData.height" v-number />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复测体积(M³):">
                            <el-input v-model="formData.volume" v-number disabled placeholder="保存时自动计算" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否复测:">
                            <el-select v-model="formData.isCheckedSize" placeholder="请选择是否复测" clearable>
                                <el-option :label="$t('yes')" :value=true />
                                <el-option :label="$t('no')" :value=false />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <p class="itemTitle">销售周转统计属性</p>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="周转率:" prop="turnoverRate">
                            <el-input v-model="formData.turnoverRate" v-number placeholder="周期内出货量/平均库存" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="周转率等级:" prop="turnoverLevel">
                            <el-input v-model="formData.turnoverLevel" v-number placeholder="1=最高,5=最低" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="周期订单量:" prop="orderQty">
                            <el-input v-model="formData.orderQty" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="周期出货量:" prop="outQty">
                            <el-input v-model="formData.outQty" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="统计周期起始:" prop="statsBegin">
                            <el-date-picker v-model="formData.statsBegin" type="date"
                                :disabled-date="disabledBeginDate" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="统计周期截至:" prop="statsEnd">
                            <el-date-picker v-model="formData.statsEnd" type="date" :disabled-date="disabledEndDate" />
                        </el-form-item>
                    </el-col>
                    <!-- 图片附件 -->
                    <el-col :span="24">
                        <p class="itemTitle">图片附件</p>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 自动上传组件 -->
            <el-upload :file-list="fileList" :multiple="true" list-type="picture-card" accept="image/*" :limit="5"
                :auto-upload="true" :http-request="handleUpload" @remove="handleRemove" @exceed="handleExceed"
                @change="handleChange" @preview="handlePictureCardPreview" @success="handleSuccess">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <div style="margin-top: 10px;">
                <span>{{ formData.imgList.length }} / 5 张已上传</span>
            </div>

            <el-dialog v-model="dialogVisible" destroy-on-close>
                <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>

            <div class="btns">
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="编辑SKU">
import * as api from '@/api/baseApi/sku.js'
import { uploadApi } from '@/api/baseApi/index.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { smartAlert } from '@/utils/genericMethods.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
import tagsStore from '@/store/tags.js'
import { useRefreshStore } from '@/store/refresh.js'

const props = defineProps({ id: Number, name: String });
const route = useRoute()
const useTags = tagsStore()
const refreshStore = useRefreshStore()

// 客户代码过滤器
const customerOptions = ref([])

// 图片上传
const fileList = ref([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const formData = ref({
    customerCode: '',
    sku: '',
    nameCn: '',
    nameEn: '',
    model: '',
    customsName: '',
    grossWeight: null,
    netWeight: null,
    cusLength: null,
    cusWidth: null,
    cusHeight: null,
    cusVolume: null,
    length: null,
    width: null,
    height: null,
    volume: null,
    unitValue: null,
    customsValue: null,
    currency: '',
    originCountry: '',
    hsCode: '',
    remark: '',
    dangerId: null,
    electrifiedId: null,
    orderQty: null, // 周期订单量
    outQty: null, // 周期出货量
    turnoverRate: null, // 周转率
    dailyOutQty: null, // 日均销量
    statsBegin: null, // 统计周期起始
    statsEnd: null, // 统计周期截至
    imgList: []
})
const formRef = ref(null)

// 验证规则略同
const rules = {
    customerCode: [
        { required: true, message: '请输入客户代码', trigger: 'blur' }
    ],
    sku: [
        { required: true, message: '请输入sku', trigger: 'blur' }
    ],
    barcode: [
        { required: true, message: '请输入条码', trigger: 'blur' }
    ],
    nameCn: [
        { required: true, message: '请输入中文品名', trigger: 'blur' }
    ],
    nameEn: [
        { required: true, message: '请输入英文品名', trigger: 'blur' }
    ],
    model: [
        { required: true, message: '请输入规格型号', trigger: 'blur' }
    ],
    customsName: [
        { required: true, message: '请输入报关品名', trigger: 'blur' }
    ],
    grossWeight: [
        { required: true, message: '请输入单位毛重', trigger: 'blur' }
    ],
    netWeight: [
        { required: true, message: '请输入单位净重', trigger: 'blur' }
    ],
    cusLength: [
        { required: true, message: '请输入预报长度', trigger: 'blur' }
    ],
    cusWidth: [
        { required: true, message: '请输入预报宽度', trigger: 'blur' }
    ],
    cusHeight: [
        { required: true, message: '请输入预报高度', trigger: 'blur' }
    ],
    cusVolume: [
        { required: true, message: '请输入预报体积', trigger: 'blur' }
    ],
    length: [
        { required: true, message: '请输入复测长度', trigger: 'blur' }
    ],
    width: [
        { required: true, message: '请输入复测宽度', trigger: 'blur' }
    ],
    height: [
        { required: true, message: '请输入复测高度', trigger: 'blur' }
    ],
    volume: [
        { required: true, message: '请输入复测体积', trigger: 'blur' }
    ],
    unitValue: [
        { required: true, message: '请输入单位价格', trigger: 'blur' }
    ],
    customsValue: [
        { required: true, message: '请输入报关价格', trigger: 'blur' }
    ],
    currency: [
        { required: true, message: '请输入币种代码', trigger: 'blur' }
    ],
    originCountry: [
        { required: true, message: '请选择原产国代码', trigger: 'change' }
    ],
    hsCode: [
        { required: true, message: '请输入海关编码', trigger: 'blur' }
    ],
    dangerId: [
        { required: true, message: '请选择是否危险品', trigger: 'change' }
    ],
    electrifiedId: [
        { required: true, message: '请选择是否带电', trigger: 'change' }
    ],
    turnoverLevel: [
        {
            validator: (rule, value, callback) => {
                // 允许空值（如果非必填），否则添加required: true
                if (value === '' || value === null || value === undefined) {
                    return callback(); // 非必填时不验证
                }
                // 转换为数字后检查是否为整数
                const num = Number(value);
                if (isNaN(num) || !Number.isInteger(num)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change'] // 增加change触发，输入时即时验证
        }
    ],
    outQty: [
        {
            validator: (rule, value, callback) => {
                if (value === '' || value === null || value === undefined) {
                    return callback();
                }
                const num = Number(value);
                if (isNaN(num) || !Number.isInteger(num)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change']
        }
    ],
    orderQty: [
        {
            validator: (rule, value, callback) => {
                if (value === '' || value === null || value === undefined) {
                    return callback();
                }
                const num = Number(value);
                if (isNaN(num) || !Number.isInteger(num)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change']
        }
    ]
}
// 自动上传
const handleUpload = async params => {
    try {
        const res = await uploadApi(params.file, { path: 'temp' })
        return res
    } catch (err) {
        smartAlert('上传失败', false)
        throw err
    }
}
// 上传成功
const handleSuccess = response => {
    formData.value.imgList.push(response.data)
}
// 上传改变
const handleChange = (file, newList) => {
    newList.forEach(item => { if (item.raw && !item.url) item.url = URL.createObjectURL(item.raw) })
    fileList.value = newList.slice(-5)
}
// 删除图片
const handleRemove = file => {
    fileList.value = fileList.value.filter(i => i.uid !== file.uid)
    const idx = formData.value.imgList.findIndex(url => url === file.url)
    if (idx !== -1) formData.value.imgList.splice(idx, 1)
}
// 超出限制提示
const handleExceed = () => smartAlert('最多只能上传5张图片', false)
// 预览图片
const handlePictureCardPreview = file => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}

const disabledBeginDate = (time) => {
    // 如果结束时间已选择，开始时间不能超过结束时间
    if (formData.value.statsEnd) {
        // 转换为当天的结束时间（23:59:59）进行比较，避免日期相同但时间导致的问题
        const endTime = new Date(formData.value.statsEnd);
        endTime.setHours(23, 59, 59); // 确保当天的日期都被允许
        return time.getTime() > endTime.getTime();
    }
    return false; // 未选择结束时间时不限制
}

// 限制结束时间：不能早于已选择的开始时间
const disabledEndDate = (time) => {
    // 如果开始时间已选择，结束时间不能早于开始时间
    if (formData.value.statsBegin) {
        // 转换为当天的开始时间（00:00:00）进行比较
        const beginTime = new Date(formData.value.statsBegin);
        beginTime.setHours(0, 0, 0); // 确保当天及之后的日期都被允许
        return time.getTime() < beginTime.getTime();
    }
    return false; // 未选择开始时间时不限制
}
// 币种数据
const nationOptions = ref([])
// 国家数据
const countryOptions = ref([])
// 带电类型
const electrifiedOptions = ref([])
// 危险类型
const dangerOptions = ref([])
// 审核状态
const statusOptions = ref([])
// 保存
const handleSave = async () => {
    await formRef.value.validate(async valid => {
        if (!valid) {
            smartAlert('请检查必填项！', false)
            return console.log('验证失败')
        }
        const submitData = { ...formData.value }
        // 将需要转换的字段转换为数字
        const numberFields = [
            'grossWeight', 'netWeight', 'cusLength', 'cusWidth',
            'cusHeight', 'cusVolume', 'unitValue', 'customsValue',
            'height', 'volume', 'width', 'length'
        ];

        numberFields.forEach(field => {
            const value = submitData[field];
            submitData[field] = value === '' ? null : Number(value);
        });
        const res = await api.updateSkuSkuDataApi(submitData)
        smartAlert(res.msg, res.success, 1000)
        if (res.success) {
            refreshStore.shouldRefreshSkuList = true
            useTags.tagsStore = useTags.tagsStore.filter(i => i.path !== route.fullPath)
            router.push('/base/sku/sku/list')
        }
    })
}
const handleClose = () => {
    useTags.tagsStore = useTags.tagsStore.filter(i => i.path !== route.fullPath)
    router.push('/base/sku/sku/list')
}

onMounted(async () => {
    const loading = ElLoading.service({ lock: true, target: ".contentDiv", text: "loading..." });
    try {
        // 1. 下拉框接口配置
        const apiTasks = [
            {
                key: "客户",
                api: api.getCustomerLikeQueryApi({ keyword: "*" }),
                handleSuccess: (data) =>
                (customerOptions.value = data.map((i) => ({
                    value: i.code,
                    label: `${i.code}(${i.name})`,
                }))),
            },
            {
                key: "国家",
                api: getOrgCountryListApi(),
                handleSuccess: (data) => (countryOptions.value = data || []),
            },
            {
                key: "币种",
                api: getCurrencyEnumApi(),
                handleSuccess: (data) => (nationOptions.value = data || []),
            },
            {
                key: "带电类型",
                api: api.getSkuElectrifiedEnumListApi(),
                handleSuccess: (data) => (electrifiedOptions.value = data || []),
            },
            {
                key: "危险品类型",
                api: api.getSkuDangerEnumListApi(),
                handleSuccess: (data) => (dangerOptions.value = data || []),
            },
            {
                key: "审核状态",
                api: api.getSkuStatusEnumListApi(),
                handleSuccess: (data) => (statusOptions.value = data || []),
            },
        ];

        // 2. 执行并行请求
        const dropdownResults = await Promise.allSettled(
            apiTasks.map((task) => task.api)
        );

        // 3. 统一处理结果
        dropdownResults.forEach((result, index) => {
            const task = apiTasks[index];
            if (result.status === "fulfilled") {
                const res = result.value;
                if (res.success !== false) {
                    task.handleSuccess(res.data);
                } else {
                    smartAlert(`【${task.key}】数据加载失败：${res.msg}`, false);
                }
            } else {
                smartAlert(`【${task.key}】接口请求失败`, false);
                console.error(`[${task.key}] error:`, result.reason);
            }
        });

        // 4. 获取详情（单独写，因为依赖 props.id）
        const skuRes = await api.getSkuSkuDataApi({ id: props.id });
        if (skuRes.success !== false) {
            formData.value = {
                ...skuRes.data,
                imgList: skuRes.data.imgList.map((img) => img.url),
            };

            // 初始化已上传文件
            fileList.value = formData.value.imgList.map((url) => ({
                uid: Date.now() + Math.random(),
                url,
            }));
        } else {
            smartAlert(`获取SKU详情失败：${skuRes.msg}`, false);
        }
    } finally {
        loading.close();
    }
});

</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.el-form,
.btns {
    width: 1120px !important;
}

.itemTitle {
    font-size: 16px !important;
    color: #4e4e4e !important;
}
</style>
