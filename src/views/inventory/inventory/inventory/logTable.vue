<template>
    <div class="filterDiv">
        <div class="tags">
            <div style="background-color: white;" @click="tagsItemClick(item)" v-for="item in tags" :key="item.value"
                :class="{ active: item.value == view }">
                <div class="tagsItem"
                    :class="{ active: item.value == view, activeNext: item.value == view + 1, activeLast: item.value == view - 1 }"
                    type="warning" effect="light">
                    {{ item.label }}
                </div>
            </div>
        </div>

        <hydFilterBox :form-items="formConfig" :initial-value="initValues" :loading="loading" @search="handleSearch"
            @reset="handleReset">
            <template #custom-form="{ formData }">
                <el-col>
                    <el-form-item label="操作类型:">
                        <el-select v-model="formData.opTypeId" placeholder="请选择操作类型" clearable
                            popper-class="multi-column-select" filterable>
                            <el-option v-for="item in opTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
        </hydFilterBox>
    </div>
    <div class="tableDiv">
        <hydTable :tableData="tableData" :columns="columns" :pagination="pagination" :enableSelection="true"
            :pageSizes="[20, 50, 100, 200, 500]" @page-change="handlePageChange">
        </hydTable>
    </div>

</template>
<script setup>
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { trimObjectStrings } from '@/utils/genericMethods.js'
import { getInventoryInventoryLogQtyTypeApi, getInventoryInventoryLogOpTypeApi, getInventoryInventoryLogListLogApi } from '@/api/inventoryApi/inventory.js'
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    view: {
        type: Number,
        required: true
    }
});
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
])

// 初始化表单数据
const initValues = ref({})
const loading = ref(true)

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '操作类型', prop: 'opTypeName', width: '140', fixed: 'left' },
    { label: '操作前数量', prop: 'qtyBefore', width: '120' },
    { label: '操作数量', prop: 'changeQty', width: '120' },
    { label: '操作后数量', prop: 'qtyAfter', width: '120' },
    { label: '单据号码', prop: 'opRefNo', width: '150' },
    { label: '操作时间', prop: 'createdTime', width: '200' },
    { label: '操作人', prop: 'createdBy', width: '110' },
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})


const handlePageChange = ({ pageSize, currentPage }) => {
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize)
}

// 获取列表
const getList = async (currentPage, pageSize) => {
    const res = await getInventoryInventoryLogListLogApi({
        page: currentPage,
        pageSize: pageSize,
        inventoryId: props.formData.id,
        view: props.view,
        qtyType: qtyType.value,
        ...trimObjectStrings(initValues.value),
    })
    tableData.value = Object.freeze(res.data.rows)
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
    loading.value = false
}
const getOpType = async (e) => {
    const res = await getInventoryInventoryLogOpTypeApi({ qtyType: e })
    opTypeOptions.value = res.data.map(item => ({ label: item.name, value: item.id }))
}
const tags = ref([])
const view = ref(1)
const qtyType = ref(1)
const tagsItemClick = (item) => {
    loading.value = true
    view.value = item.value
    qtyType.value = item.value
    getList(pagination.value.currentPage, pagination.value.pageSize)
    getOpType(qtyType.value)
}
// 操作类型选项
const opTypeOptions = ref([])
onMounted(async () => {
    // 日志参数
    const qtyTypeRes = await getInventoryInventoryLogQtyTypeApi()
    tags.value = qtyTypeRes.data.map(item => ({ label: item.name, value: item.id }))
    getOpType(qtyType.value)
})

</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.filterDiv {
    background-color: #f0f1f3;
    border-radius: 5px 5px 0 0;
    padding: 7px 5px 5px;
}

.tableDiv {
    height: 420px;
}

.tags {
    display: flex;
    font-size: 17px;
    color: #474849;

    .tagsItem {
        padding: 5px 15px;
        background-color: #f0f1f3;
        // 字体
        font-family: sans-serif;
        cursor: pointer;
        transition: all 0.5s ease;
    }

    .active {
        background-color: #fff;
        border-radius: 15px 15px 0 0;
        color: #ff914e;
        transform: translateY(0);
    }

    .activeNext {
        border-radius: 0 0 0 15px;
    }

    .activeLast {
        border-radius: 0 0 15px 0;
    }
}

/* 针对自定义类名的下拉框样式 */
:deep(.multi-column-select) {
    width: 600px;
    /* 调整下拉框总宽度（三列的总宽度） */
}

/* 选项容器使用Grid布局，拆分为3列 */
:deep(.multi-column-select .el-select-dropdown__list) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3列平均分配宽度 */
    gap: 0;
    /* 列之间的间距 */
    padding: 5px 0;
    /* 适当调整内边距 */
}

/* 单个选项的样式调整 */
:deep(.multi-column-select .el-select-dropdown__item) {
    padding: 8px 15px;
    /* 调整选项内边距 */
    white-space: nowrap;
    /* 防止文字换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 超出显示省略号 */
}
</style>

<style lang="scss">
/* 下拉框三列布局 */
.multi-column-select {
    width: 600px !important;

    .el-select-dropdown__wrap {
        padding: 0;

        .el-select-dropdown__list {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0;
            padding: 5px 0;
            overflow: visible !important;

            .el-select-dropdown__item {
                padding: 8px 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                align-items: center;
            }
        }
    }

    .el-select-dropdown__wrap {
        max-height: 400px;
    }
}
</style>