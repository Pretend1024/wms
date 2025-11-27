<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="1000px" align-center destroy-on-close @close="handleClose">
        <!-- 表格区域 -->
        <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%;" height="400"
            :row-key="(row) => row.id">
            <el-table-column type="index" label="序号" width="55" align="center" fixed />
            <el-table-column prop="createWayName" label="创建方式" width="100" />
            <el-table-column prop="packageSize" label="长/宽/高(CM)" width="120">
                <template #default="scope">
                    <div v-if="scope.row.length">
                        {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }}
                    </div>
                    <div v-else>无</div>
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量(KG)" width="85" />
            <el-table-column prop="skus" label="SKUS" min-width="180">
                <template #default="scope">
                    <div v-if="scope.row.skus && scope.row.skus.length > 0">
                        <div v-for="(item, index) in JSON.parse(scope.row.skus)" :key="index">
                            {{ item.sku }}*{{ item.qty }}
                        </div>
                    </div>
                    <div v-else>无</div>
                </template>
            </el-table-column>
            <el-table-column prop="trackingNo" label="跟踪单号" width="150" />
            <el-table-column label="运单url" width="150">
                <template #default="scope">
                    <a v-if="scope.row.labelUrl" @click.prevent="handleDownload(scope.row, 'labelUrl')">
                        下载运单
                    </a>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column label="报关单url" width="150">
                <template #default="scope">
                    <a v-if="scope.row.customLabelUrl" @click.prevent="handleDownload(scope.row, 'customLabelUrl')">
                        下载报关单
                    </a>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="shipwayCode" label="耗材" width="150">
                <template #default="{ row }">
                    <div class="tableFormSlot" v-for="(item, index) in row.consumablesList" :key="index">
                        {{ item.consumablesName }}*{{ item.quantity }}
                        <!-- <el-select style="width: 180px;" v-model="item.consumablesCode" placeholder="请选择耗材">
                            <el-option v-for="item in consumablesOptions" :key="item.code" :label="item.name"
                                :value="item.code" />
                        </el-select>
                        <el-input style="width: 150px !important;margin: 0 4px;" v-model="item.quantity"
                            placeholder="请输入数量" v-number />
                        <el-button icon="Plus" type="success" circle @click="addConsumables(row)" />
                        <el-button icon="Minus" type="danger" circle @click="delConsumables(row, index)" /> -->
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shipwayCode" label="物流产品代码" width="150" />
            <el-table-column prop="supplierCode" label="服务商代码" width="150" />
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-container mt-4">
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">{{ getButtonText('close') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getOutstockOrderTrackingNoApi } from '@/api/outstockApi/order.js';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

const { t } = useI18n();

// 定义组件抛出的事件
const emit = defineEmits(['cancel', 'close']);


// 弹窗显示状态
const visible = ref(false);

// 表格数据
const tableData = ref([]);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 50,
    total: 0
});

// 弹窗标题
const dialogTitle = '物流跟踪信息';

// 当前订单ID
let outOrderId = ref('');

// 打开弹窗方法
const open = (id) => {
    visible.value = true;
    // 重置分页
    pagination.currentPage = 1;
    outOrderId.value = id;
    // 获取表格数据
    getTrackingList(id);
};

// 关闭弹窗方法
const close = () => {
    visible.value = false;
};

// 处理取消按钮
const handleCancel = () => {
    emit('cancel');
    close();
};

// 处理关闭事件
const handleClose = () => {
    outOrderId.value = '';
    emit('close');
};

// 获取跟踪信息列表
const getTrackingList = async (id) => {
    try {
        loading.value = true;
        if (id) {
            outOrderId.value = id
        }
        const res = await getOutstockOrderTrackingNoApi({
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            outOrderId: outOrderId.value,
        });

        tableData.value = res.data.rows || [];
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.page || 1;
    } catch (error) {
        ElMessage.error(t('common.fetchFailed') + (error.message || ''));
        console.error('获取跟踪信息列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 处理下载
const handleDownload = async (row, type) => {
    console.log('下载文件:', row, type);
    try {
        // 根据类型获取正确的下载URL
        let downloadUrl;
        if (type === 'labelUrl') {
            downloadUrl = row.labelUrl;
        } else {
            downloadUrl = row.customLabelUrl;
        }

        // 检查URL是否存在
        if (!downloadUrl) {
            ElMessage.warning('文件地址不存在，无法下载');
            return;
        }

        // 创建a标签模拟下载
        const link = document.createElement('a');
        link.href = downloadUrl; // 正确设置href属性

        // 处理文件名（优先使用row中的文件名，否则从URL提取）
        let fileName = row.fileName || 'download_file';
        if (!fileName && downloadUrl) {
            // 从URL中提取文件名
            const urlParts = downloadUrl.split('/');
            fileName = urlParts[urlParts.length - 1].split('?')[0];
        }
        link.download = fileName;

        document.body.appendChild(link);
        link.click(); // 触发点击下载
        // 延迟移除a标签，避免某些浏览器下载失败
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    } catch (error) {
        ElMessage.error('文件下载失败: ' + (error.message || ''));
        console.error('文件下载失败:', error);
    }
};


// 分页大小改变
const handleSizeChange = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    getTrackingList();
};

// 当前页改变
const handleCurrentChange = (currentPage) => {
    pagination.currentPage = currentPage;
    getTrackingList();
};


// 暴露方法给父组件
defineExpose({
    open,
    close
});
</script>

<style scoped>
.pagination-container {
    text-align: right;
}

.el-pagination {
    justify-content: center;
    margin-top: 15px;
}

a {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
}

a:hover {
    color: #66b1ff;
}
</style>
