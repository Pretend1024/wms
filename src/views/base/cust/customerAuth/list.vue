<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable
                                popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('authType')">
                            <el-select v-model="formData.authType" :placeholder="getPlaceholder('authType')" clearable>
                                <el-option v-for="item in authTypeOptions" :key="item.value" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('idCardNum')">
                            <el-input v-model="formData.idCardNum" :placeholder="getPlaceholder('idCardNum')"
                                clearable />
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>

        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort">

                <template #table-buttons>
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <el-button type="primary" @click="handleBatchAudit" :icon="Check">{{ getButtonText('audit')
                                }}</el-button>
                        </div>
                    </div>
                </template>

                <template #authType="{ row }">
                    <el-tag :type="row.authType === 2 ? 'warning' : ''">{{ row.authTypeName }}</el-tag>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: getStatusColor(row.authStatus) }">{{ row.authStatusName }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <template #idNum="{ row }">
                    {{ row.authType === 2 ? row.socialCreditCode : row.idCardNum }}
                </template>

                <template #customBtn="{ row }">
                    <div class="cursor-pointer" @click="handleView(row)">
                        <el-icon>
                            <View />
                        </el-icon>
                        <span>{{ getButtonText('view') }}</span>
                    </div>
                </template>
            </hydTable>
        </div>

        <el-dialog v-model="dialogVisible" :title="isAuditMode ? '审核认证信息' : '查看认证详情'" width="900px" align-center
            destroy-on-close class="audit-dialog" append-to-body>
            <div class="detail-container" v-loading="detailLoading">

                <div class="section-title">基础信息</div>
                <el-descriptions :column="3" border class="mb-20">
                    <el-descriptions-item label="客户信息" label-class-name="desc-label">
                        {{ detailData.customerCode }} <br v-if="detailData.customerName"> ({{ detailData.customerName
                        }})
                    </el-descriptions-item>
                    <el-descriptions-item label="主体类型" label-class-name="desc-label">
                        <el-tag size="small" :type="detailData.authType === 2 ? 'warning' : ''">
                            {{ detailData.authTypeName }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="当前状态" label-class-name="desc-label">
                        <span :style="{ color: getStatusColor(detailData.authStatus), fontWeight: 'bold' }">
                            {{ detailData.authStatusName }}
                        </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="联系人" label-class-name="desc-label">{{ detailData.contact
                        }}</el-descriptions-item>
                    <el-descriptions-item label="手机号" label-class-name="desc-label">{{ detailData.mobilePhone
                        }}</el-descriptions-item>
                    <el-descriptions-item label="邮箱" label-class-name="desc-label">{{ detailData.email
                        }}</el-descriptions-item>
                    <el-descriptions-item label="所在地区" label-class-name="desc-label" :span="3">
                        {{ detailData.countryName }} {{ detailData.province }} {{ detailData.city }}
                    </el-descriptions-item>
                    <el-descriptions-item label="详细地址" label-class-name="desc-label" :span="3">
                        {{ detailData.address }}
                    </el-descriptions-item>
                </el-descriptions>

                <div class="section-title">证件信息</div>
                <el-descriptions :column="2" border class="mb-20">
                    <el-descriptions-item label="证件类型" label-class-name="desc-label">
                        {{ detailData.authType === 2 ? '统一社会信用代码' : '身份证号码' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="证件号码" label-class-name="desc-label">
                        <span class="text-bold">{{ detailData.authType === 2 ? detailData.socialCreditCode :
                            detailData.idCardNum }}</span>
                    </el-descriptions-item>
                </el-descriptions>

                <div class="section-title">附件资料</div>
                <div class="img-list-wrapper">
                    <template v-if="detailData.authType === 1">
                        <div class="img-card" v-if="detailData.idCardFrontUrl">
                            <el-image :src="detailData.idCardFrontUrl" :preview-src-list="[detailData.idCardFrontUrl]"
                                preview-teleported fit="contain" loading="lazy" />
                            <span class="img-label">身份证人像面</span>
                        </div>
                        <div class="img-card" v-if="detailData.idCardBackUrl">
                            <el-image :src="detailData.idCardBackUrl" :preview-src-list="[detailData.idCardBackUrl]"
                                preview-teleported fit="contain" loading="lazy" />
                            <span class="img-label">身份证国徽面</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="img-card" v-if="detailData.businessLicenseUrl">
                            <el-image :src="detailData.businessLicenseUrl"
                                :preview-src-list="[detailData.businessLicenseUrl]" preview-teleported fit="contain"
                                loading="lazy" />
                            <span class="img-label">营业执照</span>
                        </div>
                        <div class="img-card" v-if="detailData.idCardFrontUrl">
                            <el-image :src="detailData.idCardFrontUrl" :preview-src-list="[detailData.idCardFrontUrl]"
                                preview-teleported fit="contain" loading="lazy" />
                            <span class="img-label">法人身份证正面</span>
                        </div>
                        <div class="img-card" v-if="detailData.idCardBackUrl">
                            <el-image :src="detailData.idCardBackUrl" :preview-src-list="[detailData.idCardBackUrl]"
                                preview-teleported fit="contain" loading="lazy" />
                            <span class="img-label">法人身份证反面</span>
                        </div>
                    </template>
                    <div v-if="!hasImages" class="no-img-tip">暂无附件</div>
                </div>

                <div v-if="isAuditMode" class="audit-panel">
                    <div class="audit-header">
                        <el-icon>
                            <Check />
                        </el-icon> 审核处理
                    </div>
                    <el-form :model="auditForm" label-width="90px">
                        <el-form-item label="审核结果" required>
                            <el-radio-group v-model="auditForm.type" @change="handleAuditTypeChange">
                                <el-radio :label="1" border class="radio-success">通过</el-radio>
                                <el-radio :label="2" border class="radio-danger">拒绝</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="auditForm.type === 2" label="拒绝原因" required prop="rejectReason">
                            <el-input v-model="auditForm.rejectReason" type="textarea" placeholder="请输入拒绝原因（必填）"
                                :rows="3" maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <template v-if="isAuditMode">
                        <el-button type="primary" @click="submitAudit(false)">提交</el-button>
                        <el-button type="success" @click="submitAudit(true)" :disabled="isLastItem">提交并继续下一条</el-button>
                    </template>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="实名认证">
import { ref, shallowRef, reactive, onMounted, computed } from 'vue'
import { View, Check } from '@element-plus/icons-vue'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { ElMessage } from 'element-plus'
import hydFilterBox from "@/components/table/hyd-filterBox.vue"
import hydTable from "@/components/table/hyd-table.vue"
// 接口引入
import {
    getCustomerAuthCountGroupByStatusApi,
    getCustomerAuthListApi,
    getCustomerAuthByIdApi,
    approvalCustomerAuthApi,
    getCustomerAuthTypeEnumApi
} from "@/api/baseApi/cust.js"
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// ================== 搜索与筛选配置 ==================
// 搜索表单配置
const formConfig = ref([
    { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 搜索初始值
const initValues = ref({
    customerCodeList: '',
    authType: '',
    idCardNum: '',
    createdTimeBegin: '',
    createdTimeEnd: '',
    authStatusList: []
})

// 下拉选项数据
const customerOptions = ref([])
const authTypeOptions = ref([])
const statusIdsList = ref([]) // 状态统计列表
const statusIdsArr = ref([])  // 当前选中的状态筛选

// 加载客户下拉数据
const loadCustomer = async () => {
    const result = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
}

// 加载认证类型下拉数据
const loadAuthTypes = async () => {
    const res = await getCustomerAuthTypeEnumApi()
    if (res.success) {
        authTypeOptions.value = res.data
    }
}

// 获取状态统计数据
const getStatusCount = async () => {
    const params = { ...trimObjectStrings(initValues.value) }
    delete params.authStatusList
    const res = await getCustomerAuthCountGroupByStatusApi(params)
    statusIdsList.value = res.data
}

// ================== 表格配置与数据 ==================
const tableData = shallowRef([])
const pagination = ref({ currentPage: 1, pageSize: 100, total: 0 })
const loading = ref(true)
const orderBy = ref('')
const selectionRows = ref([]) // 表格选中行

const columns = ref([
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true },
    { label: '主体类型', prop: 'authTypeName', width: '120', slot: 'authType', sortable: true },
    { label: '证件号码', prop: 'idCardNum', width: '180', slot: 'idNum' },
    { label: '状态', prop: 'authStatusName', width: '120', slot: 'statusName', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '170', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '170', sortable: true },
    { label: '操作', prop: 'action', width: '100', fixed: 'right', slot: 'customBtn' }
])

// 获取表格数据列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getCustomerAuthListApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    loading.value = false
}

// 获取状态对应颜色
const getStatusColor = (status) => {
    // 假设 10:待审核, 20:通过, 30:拒绝
    if (status === 10) return '#409eff'
    if (status === 20) return '#67c23a'
    if (status === 30) return '#f56c6c'
    return ''
}

// ================== 事件处理 ==================
// 搜索事件
const handleSearch = (data) => {
    loading.value = true
    initValues.value = {
        ...data,
        authStatusList: statusIdsArr.value
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatusCount()
}

// 重置事件
const handleReset = (data) => {
    loading.value = true
    initValues.value = {
        ...data,
        authStatusList: []
    }
    statusIdsArr.value = []
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatusCount()
}

// 分页页码/条数改变事件
const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 表格排序事件
const handleTableSort = (sortString) => {
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 状态复选框改变事件
const handleStatusChange = () => {
    loading.value = true
    initValues.value.authStatusList = statusIdsArr.value
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}

// 表格勾选改变事件
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
}

// 表格行点击事件
const handleRowClick = (row) => {
    // selection.value = row
}

// ================== 查看与审核逻辑 ==================
const dialogVisible = ref(false)
const detailLoading = ref(false)
const isAuditMode = ref(false) // 是否为审核模式
const detailData = ref({}) // 详情数据

// 审核相关状态
const auditForm = reactive({ type: 1, rejectReason: '' })
const auditQueue = ref([]) // 待审核队列
const currentAuditIndex = ref(0) // 当前审核索引
const isLastItem = ref(false) // 是否为队列最后一条

// 计算属性：判断是否有附件图片
const hasImages = computed(() => {
    const d = detailData.value;
    return d.idCardFrontUrl || d.idCardBackUrl || d.businessLicenseUrl;
})

// 加载详情数据接口
const loadDetail = async (id) => {
    detailLoading.value = true
    detailData.value = {}
    try {
        const res = await getCustomerAuthByIdApi({ id })
        if (res.success) {
            detailData.value = res.data
        }
    } finally {
        detailLoading.value = false
    }
}

// 点击“查看”按钮
const handleView = (row) => {
    isAuditMode.value = false
    dialogVisible.value = true
    loadDetail(row.id)
}

// 点击“批量审核”按钮
const handleBatchAudit = () => {
    if (selectionRows.value.length === 0) {
        return ElMessage.warning('请先勾选需要审核的数据！')
    }

    // 筛选出状态为10（待审核）的数据
    const pendingList = selectionRows.value.filter(item => item.authStatus === 10)

    if (pendingList.length === 0) {
        return smartAlert('所选数据中没有待审核的记录！', false)
    }

    // 初始化审核队列
    auditQueue.value = pendingList
    currentAuditIndex.value = 0
    isAuditMode.value = true
    auditForm.type = 1
    auditForm.rejectReason = ''

    // 打开弹窗加载第一条
    dialogVisible.value = true
    loadAuditItem()
}

// 加载当前队列中的审核项数据
const loadAuditItem = () => {
    if (currentAuditIndex.value >= auditQueue.value.length) {
        dialogVisible.value = false
        smartAlert('已无待审核记录', false)
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        getStatusCount()
        return
    }

    isLastItem.value = currentAuditIndex.value === auditQueue.value.length - 1
    const currentItem = auditQueue.value[currentAuditIndex.value]

    // 重置表单
    auditForm.type = 1
    auditForm.rejectReason = ''

    // 加载详情
    loadDetail(currentItem.id)
}

// 切换审核结果时清空备注
const handleAuditTypeChange = (val) => {
    if (val === 1) {
        auditForm.rejectReason = ''
    }
}

// 提交审核结果
const submitAudit = async (isNext) => {
    // 校验逻辑：仅当拒绝操作时校验原因必填
    if (auditForm.type === 2 && !auditForm.rejectReason.trim()) {
        return smartAlert('请填写拒绝原因', false)
    }

    const currentId = auditQueue.value[currentAuditIndex.value].id

    try {
        // 构建参数：审核通过时不传递备注
        const res = await approvalCustomerAuthApi({
            id: currentId,
            type: auditForm.type, // 1:通过, 2:拒绝
            rejectReason: auditForm.type === 2 ? auditForm.rejectReason : ''
        })
        smartAlert(res.msg, res.success, 1000)
        if (res.success) {
            if (isNext) {
                // 继续下一条
                currentAuditIndex.value++
                if (currentAuditIndex.value < auditQueue.value.length) {
                    loadAuditItem()
                } else {
                    dialogVisible.value = false
                    smartAlert('所有选定记录审核完毕', true, 1000)
                    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
                    getStatusCount()
                }
            } else {
                // 仅提交当前条
                dialogVisible.value = false
                getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
                getStatusCount()
            }
        }
    } catch (e) {
        console.error(e)
    }
}

// 页面挂载时加载基础数据
onMounted(() => {
    loadCustomer()
    loadAuthTypes()
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

// --- 详情弹窗样式优化 ---
.detail-container {
    padding: 0 10px;
    max-height: 600px;
    overflow-y: auto;
}

.section-title {
    font-size: 15px;
    font-weight: bold;
    color: #303133;
    margin: 20px 0 12px 0;
    padding-left: 10px;
    border-left: 4px solid #409eff;
    line-height: 1;

    &:first-child {
        margin-top: 0;
    }
}

.mb-20 {
    margin-bottom: 20px;
}

.text-bold {
    font-weight: 600;
    color: #303133;
}

// 覆盖 descriptions label 样式
:deep(.desc-label) {
    width: 120px;
    color: #606266;
    background-color: #fafafa;
}

// 图片列表样式
.img-list-wrapper {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    background: #fdfdfd;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;

    .img-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        padding: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .el-image {
            width: 180px;
            height: 120px;
            border-radius: 4px;
            margin-bottom: 8px;
            background-color: #f5f7fa;
            // 确保预览时鼠标变为手型
            cursor: pointer;
        }

        .img-label {
            font-size: 13px;
            color: #606266;
            font-weight: 500;
        }
    }

    .no-img-tip {
        color: #909399;
        font-size: 13px;
        width: 100%;
        text-align: center;
        padding: 10px;
    }
}

// 审核操作面板样式
.audit-panel {
    margin-top: 25px;
    background-color: #f0f9eb; // 浅绿背景
    border: 1px solid #e1f3d8;
    border-radius: 6px;
    padding: 15px 20px;

    .audit-header {
        font-size: 15px;
        font-weight: bold;
        color: #67c23a;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    // 审核单选按钮样式优化
    .radio-success.is-checked {
        :deep(.el-radio__inner) {
            border-color: #67c23a;
            background: #67c23a;
        }

        :deep(.el-radio__label) {
            color: #67c23a;
        }
    }

    .radio-danger.is-checked {
        :deep(.el-radio__inner) {
            border-color: #f56c6c;
            background: #f56c6c;
        }

        :deep(.el-radio__label) {
            color: #f56c6c;
        }
    }
}

:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>