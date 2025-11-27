<template>
    <div class="viewArea">
        <div class="formDiv">
            <el-form :model="printData" :rules="rules" ref="formRef" label-width="105px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('btypeId')">
                            <el-select v-model="printData.btypeId" @change="changeType">
                                <el-option label="一维码" :value=116 />
                                <el-option label="二维码" :value=117 />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('templateId')" prop="templateId">
                            <el-select v-model="printData.templateId">
                                <el-option v-for="item in printTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('barcodes')" prop="barcodes">
                            <el-input type="textarea" v-model="printData.barcodes"
                                :placeholder="getPlaceholder('barcodes')" clearable @focus="handleFocus"
                                @blur="handleBlur" :rows="6" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item :label="getLabel('printQty')">
                            <el-input v-model.number="printData.printQty" :placeholder="getPlaceholder('printQty')"
                                type="number" @input="handlePrintQtyInput" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="formBtn">
                <el-button type="primary" :icon="View" @click="preview">{{ getButtonText('preview') }}</el-button>
                <el-button type="primary" :icon="Printer" @click="print">{{ getButtonText('print') }}</el-button>
                <el-button style="margin-left: 60px;" @click="reset" :icon="CloseBold">{{ getButtonText('reset')
                    }}</el-button>
            </div>
        </div>
        <div class="previewDiv">
            <Barcode :content="content" :codeType="printData.btypeId" />
        </div>
    </div>
</template>

<script setup name="条码打印">
import { View, CloseBold, Printer } from '@element-plus/icons-vue'
import { printToolsBarcodeApi, printToolsPrintQrcodeApi } from '@/api/baseApi/printApi.js'
import { getTemplateApi } from '@/api/baseApi/index.js'
import Barcode from '@/components/Barcode.vue'
import { ref, onMounted } from 'vue'

const printData = ref({
    btypeId: 116,
    barcodes: '',
    templateId: '',
    printQty: 1,
})
// 选择类型
const changeType = async (val) => {
    printData.value.templateId = ''
    content.value = ''
    const res = await getTemplateApi({ atypeId: 3, btypeId: printData.value.btypeId, })
    printTypeOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.id
    }))
}

const formRef = ref(null)

// 强化表单验证规则
const rules = ref({
    barcodes: [
        { required: true, message: '请输入条码', trigger: 'blur' },
    ],
    templateId: [
        { required: true, message: '请选择格式', trigger: 'change' },
    ]
})

const content = ref('')

const preview = async () => {
    if (printData.value.barcodes === '') {
        ElMessage.error('请输入条码')
        return
    }
    content.value = printData.value.barcodes
    console.log(content.value, '预览内容')
}

// 打印
const print = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        const loading = ElLoading.service({
            lock: true,
            text: '正在准备打印...',
        })
        let res
        if (printData.value.btypeId === 117) {
            printData.value.qrcodes = printData.value.barcodes
            res = await printToolsPrintQrcodeApi(printData.value)
        } if (printData.value.btypeId === 116) {
            res = await printToolsBarcodeApi(printData.value)
        }
        loading.close()
        if (res.success && res.data) {
            window.open(res.data, '_blank')
            // const iframe = document.createElement('iframe')
            // iframe.style.display = 'none'
            // iframe.src = res.data
            // iframe.onload = () => {
            //     setTimeout(() => {
            //         try {
            //             iframe.contentWindow.focus()
            //             iframe.contentWindow.print()
            //         } catch (e) {
            //             console.error('调用打印失败', e)
            //         } finally {
            //             document.body.removeChild(iframe)
            //         }
            //     }, 500)
            // }
            // document.body.appendChild(iframe)
        } else {
            ElMessage.error(res.msg || '打印失败，请重试')
        }
    } catch (error) {
        console.log('表单验证失败:', error)
    }
}

// 重置
const reset = () => {
    printData.value = {
        barcodes: '',
        templateId: '',
        printQty: 1,
        btypeId: 116,
    }
    formRef.value?.resetFields()
}
// 聚焦
const handleFocus = () => {
    printData.value.barcodes = printData.value.barcodes.replace(/，|,/g, '\n')
}
// 失焦
const handleBlur = () => {
    let text = printData.value.barcodes.replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]+/g, ',')
    if (text.endsWith(',')) {
        text = text.slice(0, -1)
    }
    printData.value.barcodes = text
}

// 改进输入处理
const handlePrintQtyInput = (e) => {
    // 过滤非数字字符
    let value = e.toString().replace(/[^\d]/g, '')
    // 限制范围
    if (value !== '') {
        let num = parseInt(value)
        num = Math.max(1, Math.min(100, num))
        printData.value.printQty = num
    } else {
        printData.value.printQty = 1
    }
}

const printTypeOptions = ref([])

onMounted(async () => {
    const res = await getTemplateApi({ atypeId: 3, btypeId: printData.value.btypeId, })
    printTypeOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.id
    }))
})
</script>


<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.viewArea {
    flex-direction: row;
    height: auto !important;

    .formDiv {
        min-width: 400px;
        max-width: 435px;
        height: 340px;
        background-color: white;
        border-radius: 10px;
        padding: 15px 25px 15px 0;

        .formBtn {
            padding-left: 85px;
        }
    }

    .previewDiv {
        margin-left: 15px;
        width: 700px;
        min-height: 450px;
        max-height: 500px;
        border-radius: 10px;
        background-color: white;
        overflow-y: auto;
        padding: 15px;
    }
}
</style>