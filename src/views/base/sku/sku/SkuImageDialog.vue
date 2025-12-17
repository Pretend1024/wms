<template>
    <el-dialog v-model="isVisible" title="SKU图片管理" width="800px" align-center destroy-on-close
        :close-on-click-modal="false" @open="handleOpen" @close="handleClose">

        <div class="header-info">
            <el-descriptions :column="3" border size="small">
                <el-descriptions-item label="客户代码">{{ skuData.customerCode + '(' + skuData.customerName + ')' || '-'
                    }}</el-descriptions-item>
                <el-descriptions-item label="SKU">{{ skuData.sku || '-' }}</el-descriptions-item>
                <el-descriptions-item label="品名">{{ skuData.nameCn + '/' + skuData.nameEn || '-'
                    }}</el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="content-body">
            <div class="left-preview">
                <div class="preview-box">
                    <el-image v-if="currentImgUrl" :src="currentImgUrl" fit="contain" class="main-image"
                        :preview-src-list="imgList.map(i => i.url)">
                        <template #error>
                            <div class="image-slot">
                                <el-icon>
                                    <Picture />
                                </el-icon>
                                <span>暂无图片</span>
                            </div>
                        </template>
                    </el-image>
                    <div v-else class="empty-text">请在右侧选择或上传图片</div>
                </div>
                <div class="current-index-tip" v-if="currentImgUrl">
                    当前显示：第 {{ currentIndex + 1 }} 张
                </div>
            </div>

            <div class="right-operate">
                <div class="upload-bar">
                    <el-upload class="upload-demo" action="#" :http-request="customUpload" :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.webp" :disabled="loading">
                        <el-button type="primary" :icon="Upload" :loading="loading">上传图片</el-button>
                    </el-upload>
                </div>

                <el-table :data="imgList" border height="400px" highlight-current-row @row-click="handleRowClick"
                    style="width: 100%">
                    <el-table-column label="序号" type="index" width="60" align="center">
                        <template #default="scope">
                            <span class="cursor-pointer index-text">{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="url" label="缩略图" width="80" align="center">
                        <template #default="{ row }">
                            <el-image :src="row.url" style="width: 40px; height: 40px" fit="cover" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="140" align="center">
                        <template #default="{ row }">
                            <el-button v-if="row.url !== localMainImgUrl" link type="primary" size="small"
                                @click.stop="handleSetMain(row)">设为主图</el-button>
                            <el-tag v-else type="success" size="small" style="margin-right: 2px">当前主图</el-tag>

                            <el-button link type="danger" size="small" @click.stop="handleDelete(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="isVisible = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Picture } from '@element-plus/icons-vue'
import { uploadApi } from '@/api/baseApi/index.js'
// 预留接口位置
import { getSkuImgListApi, addSkuImgDataApi, delBasicAddressApi, updateSkuMainImgApi } from '@/api/baseApi/sku.js'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    skuData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue', 'closed'])

const loading = ref(false)
const imgList = ref([])
const currentIndex = ref(0)
const isDataChanged = ref(false)
const localMainImgUrl = ref('')

const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const currentImgUrl = computed(() => {
    if (imgList.value.length > 0 && imgList.value[currentIndex.value]) {
        return imgList.value[currentIndex.value].url
    }
    return ''
})

// --- 模拟接口 ---
const mockGetImages = async (skuId) => {
    return Promise.resolve({
        success: true, data: [
            { id: 1, skuId: 101, url: 'http://cos.1tms.net/temp/20251107163738-20171023214422_P8AfR.jpeg' },
            { id: 2, skuId: 101, url: 'http://cos.1tms.net/temp/20251209161401-%E6%89%93%E5%8D%B0%E6%B5%8B%E8%AF%95.jpg' },
            { id: 3, skuId: 101, url: 'http://cos.1tms.net/temp/20251209145018-1765263015034_-4f9205f11c0b695c.jpg' }]
    })
}
const mockSaveImage = async (data) => {
    return Promise.resolve({ success: true, msg: '保存成功' })
}
const mockDeleteImage = async (id) => {
    return Promise.resolve({ success: true, msg: '删除成功' })
}
const mockSetMain = async (id, skuId) => {
    return Promise.resolve({ success: true, msg: '设置成功' })
}
// ----------------

const handleOpen = async () => {
    isDataChanged.value = false
    currentIndex.value = 0
    // 初始化本地主图URL，优先使用传入的skuData中的mainImgUrl
    localMainImgUrl.value = props.skuData.mainImgUrl || ''
    await getImages()
}

const handleClose = () => {
    emit('closed', isDataChanged.value)
    imgList.value = []
    localMainImgUrl.value = ''
}

const getImages = async () => {
    loading.value = true
    try {
        const res = await getSkuImgListApi({ skuId: props.skuData.id })
        if (res.success) {
            imgList.value = res.data.rows || []
            if (imgList.value.length > 0 && currentIndex.value >= imgList.value.length) {
                currentIndex.value = 0
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const customUpload = async (options) => {
    const { file } = options
    loading.value = true
    try {
        const res = await uploadApi(file, { path: 'temp' })
        if (res.success) {
            const fileUrl = res.data
            const saveRes = await addSkuImgDataApi({
                skuId: props.skuData.id,
                url: fileUrl
            })

            if (saveRes.success) {
                ElMessage.success('上传成功')
                isDataChanged.value = true
                await getImages()
                currentIndex.value = imgList.value.length - 1
            } else {
                ElMessage.error(saveRes.msg || '保存图片信息失败')
            }
        } else {
            ElMessage.error(res.msg || '文件上传失败')
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('上传异常')
    } finally {
        loading.value = false
    }
}

const handleRowClick = (row) => {
    const index = imgList.value.findIndex(item => item === row)
    if (index !== -1) {
        currentIndex.value = index
    }
}

// 设为主图
const handleSetMain = async (row) => {
    try {
        console.log(row)
        const res = await updateSkuMainImgApi({ mainImgUrl: row.url, id: props.skuData.id })
        if (res.success) {
            ElMessage.success('设置主图成功')
            isDataChanged.value = true
            // 更新本地的主图URL，使表格按钮状态立即刷新
            localMainImgUrl.value = row.url
            await getImages()
        } else {
            ElMessage.error(res.msg || '设置失败')
        }
    } catch (error) {
        console.error(error)
    }
}

// 删除图片
const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除这张图片吗?', '提示', {
        type: 'warning'
    }).then(async () => {
        try {
            const res = await delBasicAddressApi({ id: row.id })
            if (res.success) {
                ElMessage.success('删除成功')
                isDataChanged.value = true

                // 如果删除的是当前主图，清空本地主图标记
                if (row.url === localMainImgUrl.value) {
                    localMainImgUrl.value = ''
                }

                await getImages()
            } else {
                ElMessage.error(res.msg || '删除失败')
            }
        } catch (error) {
            console.error(error)
        }
    }).catch(() => { })
}
</script>

<style scoped lang="scss">
.header-info {
    margin-bottom: 20px;
}

.content-body {
    display: flex;
    gap: 20px;
    height: 500px;
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.left-preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 10px;

    .preview-box {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        .main-image {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .image-slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #909399;
        font-size: 14px;

        .el-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
    }

    .empty-text {
        color: #909399;
    }

    .current-index-tip {
        margin-top: 10px;
        font-size: 14px;
        color: #606266;
        font-weight: bold;
    }
}

.right-operate {
    flex: 1;
    display: flex;
    flex-direction: column;

    .upload-bar {
        margin-bottom: 15px;
        display: flex;
        justify-content: flex-end;
    }
}

.cursor-pointer {
    cursor: pointer;
    color: #409eff;
    font-weight: bold;
}
</style>