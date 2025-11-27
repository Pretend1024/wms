<template>
    <div class="viewArea">
        <div class="el-upload__tip">
            <p>请仔细阅读模板说明</p>
            <p>并注意从其他文件复制数据时不要带格式粘贴，如出现科学计数格式、公式等，都是会导入失败的。</p>
            <p>温馨提示，请确保使用最新Excel模板</p>
        </div>
        <div class="templateDownload">
            <div class="templateItem" v-for="(item, index) in templateList" :key="index">
                <a :href="toDownloadTempPath(item.fileUrl)">{{ item.name }}</a>
                ({{ item.updatedTime ? item.updatedTime : item.createdTime }})
            </div>
        </div>
        <el-upload ref="uploadRef" class="uploadView" v-model:file-list="fileList" drag :show-file-list="false" multiple
            :auto-upload="true" :http-request="handleUpload" :before-upload="beforeUpload" :limit="1">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖放文件 或 <em>点击选择</em>
            </div>
            <template #tip>
                <div class="tip">
                    <el-button type="primary" @click="commit" style="margin-right: 10px;">提交导入</el-button>
                    <p v-if="fileUrl" style=" ">
                        文件URL: <a :href=fileUrl>{{ fileUrl }}</a> </p>
                    <p v-else>
                        请上传文件!</p>
                </div>
            </template>
        </el-upload>
        <div class="commit">
            <el-table :data="filteredTableData" style="width: 100%;height: 100%;" border max-height="100%">
                <el-table-column prop="index" label="行号" width="75" />
                <el-table-column prop="isSuccess" label="成功/失败" width="100">
                    <template #default="{ row }">
                        <span :style="row.isSuccess ? 'color: green' : 'color: red'">{{ row.isSuccess ? '成功' : '失败'
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" label="消息">
                    <template #header>
                        <div style="display: flex;align-items: center;">
                            <span>消息</span>
                            <el-select v-model="filterStatus" placeholder="筛选状态"
                                style="width: 80px;margin-left: auto;margin-right: none;">
                                <el-option label="全部" value="all" />
                                <el-option label="成功" value="success" />
                                <el-option label="失败" value="fail" />
                            </el-select>
                        </div>
                    </template>
                    <template #default="{ row }">
                        <p style="text-align: start;">{{ row.msg }}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup name="导入">
import { smartAlert } from '@/utils/genericMethods.js'
import { toDownloadTempPath } from '@/utils/downLoad.js'
import * as api from '@/api/baseApi/importApi.js'
import { uploadApi } from '@/api/baseApi/index.js'
import { getTemplateApi } from '@/api/baseApi/index.js'

const props = defineProps({
    typeId: {
        type: Number,
        required: true
    },
    typeName: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: false,
        default: null
    }
})

const templateList = ref([])
const tableData = ref([])
const filterStatus = ref('all')
const fileUrl = ref('')
const fileList = ref([])
const uploadRef = ref()
// 筛选
const filteredTableData = computed(() => {
    if (filterStatus.value === 'all') return tableData.value
    return filterStatus.value === 'success'
        ? tableData.value.filter(item => item.isSuccess)
        : tableData.value.filter(item => !item.isSuccess)
})
// 映射接口
const apiMap = {
    111: api.importSkuAddApi,
    112: api.importSkuUpdApi,
    113: api.importSkuMappingAddApi,


    305: api.importInventorySnAddApi,

    400: api.importOutboundAddApi,

    521: api.importLocationAddApi,
    522: api.importLocationUpdApi,
    541: api.importShipwayRegionAddApi,
    561: api.importRemoteDetailAddApi,


    606: api.importInOrderFeeAddApi,
    607: api.importOutOrderFeeAddApi,
    609: api.importVasOrderFeeAddApi,
};
// 提交
const commit = async () => {
    if (!fileUrl.value) {
        smartAlert('请先上传文件', false)
        return
    }
    const loadingInstance = ElLoading.service({ lock: true, text: 'Loading' })
    try {
        const res = await apiMap[props.typeId]({
            async: true,
            fileUrl: fileUrl.value,
            typeId: props.typeId,
            id: props.id
        })
        tableData.value = res.data
        smartAlert(res.msg, res.success, 1000)

        // 提交成功后重置状态
        fileUrl.value = ''
        fileList.value = []
        uploadRef.value?.clearFiles() // 清空上传组件状态
    } catch (error) {
        console.error('导入失败:', error)
        smartAlert('导入请求失败', false)
    } finally {
        loadingInstance.close()
    }
}
// 文件类型校验
const beforeUpload = (file) => {
    if (!file.name.endsWith('.xlsx')) {
        smartAlert('请上传Excel文件', false)
        return false
    }
}
// 上传文件
const handleUpload = async (options) => {
    const loadingInstance = ElLoading.service({ lock: true, text: 'Loading' })
    try {
        // 覆盖上传时清除旧文件信息
        fileUrl.value = ''
        fileList.value = []

        const res = await uploadApi(options.file, { path: 'temp' })
        fileUrl.value = res.data
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        console.error('上传失败:', error)
        smartAlert('文件上传失败', false)
    } finally {
        loadingInstance.close()
    }
}

onMounted(async () => {
    const templateRes = await getTemplateApi({ atypeId: 1, btypeId: props.typeId })
    templateList.value = templateRes.data
})
</script>

<style scoped lang="scss">
.viewArea {
    display: flex;
    flex-direction: column;
    max-width: 1100px;
    min-width: 720px;

    .title {
        display: flex;
        font-size: 16px;
        color: #323233;
        margin-bottom: 10px;
        font-weight: 550;
        padding-left: 5px;
    }

    .el-upload__tip {
        font-size: 16px;
        padding-left: 5px;

        p:last-of-type {
            margin-top: 10px;
            color: red;
        }
    }

    .tip {
        display: flex;
        height: 45px;
        align-items: center;
        background-color: white;
        padding: 0 10px;
        border-radius: 3px;
    }

    .templateDownload {
        background-color: white;
        padding: 10px 5px;
        display: flex;
        flex-wrap: wrap;
        font-size: 15px;
        margin-bottom: 10px;

        .templateItem {
            margin: 5px 15px;

            a {
                color: #409eff;
                font-weight: 550;
            }
        }
    }

    .commit {
        background-color: white;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 10px 5px;
        min-height: 300px;
        flex: 1;
        overflow: hidden;

        .commitForm {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            p {
                margin: 0 10px;
            }
        }

        .el-select {
            width: 240px;
            margin-right: 10px;
        }
    }
}

:deep(.el-upload-dragger) {
    padding: 15px 0;
}
</style>