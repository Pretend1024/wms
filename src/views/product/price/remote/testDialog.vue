<template>
    <el-dialog title="偏远库测试" v-model="dialogVisible" width="1000px" align-center @close="handleReset" destroy-on-close>
        <el-splitter>
            <el-splitter-panel size="350" :resizable="false">
                <div style="margin: 0 10px;">
                    <el-form ref="formRef" :model="form" label-width="55px" :rules="rules">
                        <el-form-item label="国家" prop="countryCode">
                            <el-select v-model="form.countryCode" filterable placeholder="请选择国家">
                                <el-option v-for="item in countryOptions" :key="item.id"
                                    :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="邮编">
                            <el-input v-model="form.postalCode" placeholder="请输入邮编" clearable />
                        </el-form-item>
                    </el-form>
                    <div style="display: flex;justify-content: space-evenly;">
                        <el-button type="primary" @click="handleSearch">{{ getButtonText('search') }}</el-button>
                        <el-button @click="handleReset">{{ getButtonText('reset') }}</el-button>
                    </div>
                </div>
            </el-splitter-panel>
            <el-splitter-panel style="flex-basis: 1000px;display: flex;flex-direction: column;">
                <el-table :data="tableData" border style="width: 100%" height="300px">
                    <el-table-column prop="countryCode" label="国家" width="120" />
                    <el-table-column prop="typeName" label="偏远类型" width="120" />
                    <el-table-column prop="ruleName" label="规则名称" width="120" />
                    <el-table-column prop="postalCodeStart" label="邮编范围">
                        <template #default="scope">
                            <span v-if="scope.row.postalCodeStart"> {{ scope.row.postalCodeStart }}-{{
                                scope.row.postalCodeEnd }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="匹配内容" />
                </el-table>
            </el-splitter-panel>
        </el-splitter>

        <!-- 底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getProductShipwayRemoteSearchApi } from '@/api/productApi/shipway.js'
// 接收外部参数
const props = defineProps({
    remoteId: {
        type: String,
        required: true
    }
})

// 弹窗显示状态
const dialogVisible = ref(false)

// 表单数据
const form = ref({
    countryCode: '', postalCode: ''
})

// 国家下拉选项
const countryOptions = ref([])

// 表格数据
const tableData = ref([])
const formRef = ref(null)
const rules = {
    countryCode: [
        { required: true, message: '请选择国家', trigger: 'change' }
    ]
}

// 查询按钮逻辑
const handleSearch = async () => {
    formRef.value.validate(async (valid) => {
        if (!valid) return;
        const res = await getProductShipwayRemoteSearchApi({
            ...form.value,
            remoteId: props.remoteId
        })
        console.log('查询结果', res)
        smartAlert(res.msg, res.success, 1000)
        if (res.success) {
            tableData.value = res.data;
        }
    });
}

// 重置表单
const handleReset = () => {
    form.value = {
        countryCode: '',
        postalCode: ''
    }
    tableData.value = []
}

// 暴露打开方法
const openDialog = () => {
    dialogVisible.value = true
}

defineExpose({
    openDialog
})
onMounted(async () => {
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data;
})
</script>