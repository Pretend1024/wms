<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item :label="getLabel('typeId')" class="compact-item">
                            <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')" clearable>
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')" class="compact-item">
                            <el-select v-model="formData.customerCode" filterable
                                :placeholder="getPlaceholder('customerCode')" popper-class="multi-column-select"
                                clearable>
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="getLabel('addressCode')">
                            <canonicalInput v-model:listName="formData.addressCodeList"
                                :placeholder="getPlaceholder('addressCode')" clearable>
                            </canonicalInput>
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
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'add'" :icon="Plus">{{ getButtonText('add') }}</el-button>
                    <el-button type="danger" @click="handleDel" v-permission="'delete'" :icon="Delete">{{ getButtonText('del') }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex;">
                        <div class="cursor-pointer" @click="handleEdit(row)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                    </div>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode ? row.customerCode + '(' + row.customerName + ')' : '' }}
                </template>
                <template #country="{ row }">
                    {{ row.countryCode }}({{ row.countryName }})
                </template>
            </hydTable>
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="1000" align-center destroy-on-close>
            <!-- 动态加载新增或编辑的表单组件 -->
            <component :is="currentForm" ref="childFormRef" :formData="addData" :typeOptions="typeOptions"
                :customerOptions="customerOptions" :productOptions="productOptions" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm') }}</el-button>
                </div>
            </template>
        </el-dialog>


        <batchOperationn :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'" :nameLabel="'地址代码'"
            successValue="删除成功" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="地址库">
import { Plus, Delete } from '@element-plus/icons-vue'
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import { getBasicAddressTypeEnumApi, delBasicAddressApi, updBasicAddressApi, addBasicAddressApi, getBasicAddressPageApi } from '@/api/baseApi/basic.js'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'date', label: '创建时间', prop: 'createdTimeBegin', useEndOfDay: false },
    { type: 'date', label: '截至时间', prop: 'createdTimeEnd', useEndOfDay: true },
])

// 初始化表单数据
const initValues = ref({})

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
    }
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 表格列配置
const columns = ref([
    { label: '配置类型', prop: 'typeName', width: '125', sortable: true },
    { label: '地址代码', prop: 'addressCode', width: '125', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', sortable: true, slot: 'customer' },
    { label: '国家', prop: 'countryCode', width: '120', sortable: true, slot: 'country' },
    { label: '省份', prop: 'province', width: '120' },
    { label: '城市', prop: 'city', width: '120' },
    { label: '区', prop: 'county', width: '120' },
    { label: '地址', prop: 'addressLine1', width: '200', sortable: true },
    { label: '备用地址', prop: 'addressLine2', width: '200', sortable: true },
    { label: '门牌号', prop: 'houseNumber', width: '120' },
    { label: '邮编', prop: 'postalCode', width: '100', sortable: true },
    { label: '公司名', prop: 'company', width: '175', sortable: true },
    { label: '联系人名', prop: 'name', width: '150', sortable: true },
    { label: '邮箱', prop: 'email', width: '220', sortable: true },
    { label: '证件号码', prop: 'identityNumber', width: '200', sortable: true },
    { label: '联系电话', prop: 'phoneNumber1', width: '150' },
    { label: '备用电话', prop: 'phoneNumber2', width: '150' },
    { label: '备注', prop: 'remark', width: '200', sortable: true },
    { label: '创建人', prop: 'createdBy', width: '110', sortable: true },
    { label: '创建时间', prop: 'createdTime', width: '200', sortable: true },
    { label: '更新人', prop: 'updatedBy', width: '120', sortable: true },
    { label: '更新时间', prop: 'updatedTime', width: '200', sortable: true },
    { label: '操作', prop: 'action', width: '120', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
    console.log('选中的数据：', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 弹窗
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`base_basic_address_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        await childFormRef.value.validate();
        const bodyLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
        })
        loading.value = true;
        let res;
        const data = { ...addData.value };
        if (data.typeId === 1) {
            data.customerCode = '';
            data.shipwayId = '';
        }
        if (data.typeId === 2) {
            data.customerCode = '';
        }
        if (data.typeId === 3) {
            data.shipwayId = '';
        }
        if (addData.value.id) {
            res = await updBasicAddressApi(data);
            console.log('修改数据:', res);
        } else {
            res = await addBasicAddressApi(data);
        }
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            centerDialogVisible.value = false;
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
        }
        loading.value = false;
        bodyLoading.close();
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};
// 编辑
const handleEdit = (row) => {
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
}
// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加
const handleAdd = async () => {
    addData.value = {}
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
}

// 删除
const delData = ref([]);
const delDialogVisible = ref(false);
const promptMessage = ref('')
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            delDialogVisible.value = true;
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await delBasicAddressApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].addressCode,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
};

// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getBasicAddressPageApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value)
    })
    tableData.value = Object.freeze(res.data.rows)
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}

// 配置类型
const typeOptions = ref([]);
// 客户代码
const customerOptions = ref([]);

onMounted(async () => {
    const typeRes = await getBasicAddressTypeEnumApi()
    typeOptions.value = typeRes.data.map(item => ({
        value: item.id,
        label: item.name
    }))
    const custRes = await getCustomerLikeQueryApi({ keyword: '*' });
    customerOptions.value = custRes.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';
</style>