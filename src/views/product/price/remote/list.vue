<template>
    <div class="viewArea">
        <div class="contentDiv">
            <el-splitter>
                <el-splitter-panel size="350" :resizable="false">
                    <div class="partitionTitle">
                        <span>偏远库列表</span>
                        <div class="iconDiv" @click="handleAdd" v-permission="'add'">
                            +
                        </div>
                    </div>
                    <div class="partitionList">
                        <div class="partitionListItem " :class="{ active: item.id === currentPartition }"
                            v-for="(item, index) in tableData" :key="index" @click="handleSelect(item)">
                            <div class="partitionListItemTitle">
                                <span>{{ item.name }}</span>
                                <el-icon @click="handleEdit(item)">
                                    <Edit />
                                </el-icon>
                            </div>
                            <p class="partitionListItemText">
                                {{ item.remark }}
                            </p>
                            <p class="partitionListItemText">
                                {{ item.updatedTime ? '更新时间:' + item.updatedTime : '创建时间:' + item.createdTime }}
                            </p>
                        </div>
                    </div>
                </el-splitter-panel>
                <el-splitter-panel style="display: flex;flex-direction: column;">
                    <info ref="infoDialogRef" :infoData="infoData"></info>
                </el-splitter-panel>
            </el-splitter>

            <!-- 弹窗 -->
            <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="600" align-center destroy-on-close>
                <!-- 动态加载新增或编辑的表单组件 -->
                <component :is="currentForm" ref="childFormRef" :formData="addData" />
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="handleDialogCancel">{{ getButtonText('cancel') }}</el-button>
                        <el-button type="primary" @click="handleDialogConfirm">{{ getButtonText('confirm')
                            }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup name='偏远库'>
import { ref, computed, onMounted } from 'vue';
import info from "./info.vue";
import AddForm from './add.vue';
import UpdForm from './upd.vue';
import { smartAlert } from '@/utils/genericMethods.js'
import { getProductShipwayRemoteApi, addProductShipwayRemoteApi, updProductShipwayRemoteApi } from '@/api/productApi/shipway.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 表格数据与列配置
const tableData = shallowRef([]);
// 当前选中的分区
const currentPartition = ref(1);
// 处理分区选择
const handleSelect = (item) => {
    currentPartition.value = item.id;
    infoData.value = {
        id: item.id,
        name: item.name,
    }
}
// 弹窗相关
const centerDialogVisible = ref(false);
const addData = ref({});
const childFormRef = ref(null);
// 使用 dialogMode 区分新增与编辑
const dialogMode = ref('add'); // 'add' 或 'upd'
const dialogTitle = computed(() => t(`product_price_remote_list.${dialogMode.value}Title`)); // 可根据模式调整标题
const currentForm = computed(() => dialogMode.value === 'add' ? AddForm : UpdForm);

// 新增按钮
const handleAdd = () => {
    addData.value = {
        id: null,
        name: '',
        remark: ''
    };
    dialogMode.value = 'add';
    centerDialogVisible.value = true;
};

// 编辑按钮
const handleEdit = async (row) => {
    addData.value = {
        ...row,
    };
    dialogMode.value = 'upd';
    centerDialogVisible.value = true;
};
const infoData = ref({}); // 偏远库明细数据
const infoDialogRef = ref(null); // 偏远库明细组件引用

// 弹窗确定按钮，调用子组件的表单校验及提交
const handleDialogConfirm = async () => {
    if (!childFormRef.value) return;
    try {
        loading.value = true;
        await childFormRef.value.validate();
        let res;
        if (addData.value.id) {
            res = await updProductShipwayRemoteApi(addData.value);
            console.log('修改数据:', res);
        } else {
            res = await addProductShipwayRemoteApi(addData.value);
        }
        if (res.success) {
            centerDialogVisible.value = false;
            getList();
        }
        loading.value = false;
        smartAlert(res.msg, res.success, 1000)
    } catch (error) {
        console.error('表单验证失败:', error);
    }
};
// 弹窗取消按钮
const handleDialogCancel = () => {
    centerDialogVisible.value = false;
};

// 获取列表数据
const getList = async () => {
    const res = await getProductShipwayRemoteApi({});
    tableData.value = res.data.rows;
    currentPartition.value = tableData.value.length > 0 ? tableData.value[0].id : null;
    handleSelect(tableData.value[0]);
};
onMounted(() => {
    getList();
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea {
    background-color: white;
}

.partitionTitle {
    display: flex;
    height: 50px;
    font-size: 18px;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    margin-right: 10px;
    border-bottom: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;

    .iconDiv {
        width: 35px;
        height: 35px;
        line-height: 30px;
        font-size: 30px;
        font-weight: 500;
        background-color: #e7eeff;
        text-align: center;
        color: #165dff;
        cursor: pointer;
    }

    .iconDiv:hover {
        background-color: #d0d9ff;
    }
}

.partitionList {
    .partitionListItem {
        font-size: 14px;
        cursor: pointer;
        padding-bottom: 10px;

        .partitionListItemTitle {
            display: flex;
            padding: 15px 20px 5px 10px;
            justify-content: space-between;
            font-size: 20px;

            span {
                display: inline-block;
                width: 270px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .el-icon {
                font-size: 20px;
                cursor: pointer;
                margin: 0 0 0 15px;
            }

            .el-icon:hover {
                color: #409eff;
            }
        }

        .partitionListItemText {
            width: 285px;
            font-size: 12px;
            margin: 5px 0px 5px 10px;
            color: #606266;
            border: none;
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .active {
        background-color: #e7eeff;
        border-left: 2px solid #409eff;
    }
}
</style>