<template>
    <div class="viewArea">
        <div class="contentDiv">
            <el-splitter>
                <el-splitter-panel size="350" :resizable="false">
                    <div class="partitionTitle">
                        <span>分区列表</span>
                        <el-popover :visible="visible" placement="bottom" :width="100" trigger="click" title="添加分区"
                            @show='handleShow'>
                            <template #reference>
                                <div class="iconDiv" @click="visible = true">
                                    +
                                </div>
                            </template>
                            <el-input placeholder="请输入添加个数" v-model="partitionNum" ref="partitionNumRef"
                                @blur="handleBlur" v-number></el-input>
                            <div style="text-align: right; margin-top: 7px">
                                <el-button size="small" type="primary" @click="submitPartition">
                                    确定
                                </el-button>
                            </div>
                        </el-popover>
                    </div>
                    <div class="partitionList">
                        <div class="partitionListItem " :class="{ active: item.code === currentPartition }"
                            v-for="(item, index) in partitionList" :key="index" @click="handleSelect(item)">
                            <div class="partitionListItemTitle">
                                <span>{{ item.code }}</span>
                                <el-icon @click="handleDelete(item)">
                                    <Delete />
                                </el-icon>
                            </div>
                            <span class="partitionListItemText">创建/更新时间： {{ item.createdTime }}/{{ item.
                                updatedTime }}</span>
                        </div>
                    </div>
                </el-splitter-panel>
                <el-splitter-panel style="flex-basis: 1000px;display: flex;flex-direction: column;">
                    <div class="partitionTitle" style="margin-left: 10px;">
                        <span>分区明细</span>
                        <div>
                            <el-button type="success" :icon="UploadFilled" @click="handleImportAdd">{{getButtonText ('import') }}</el-button>
                            <el-button type="primary" :icon="Plus" @click="addDetail">添加明细</el-button>
                        </div>
                    </div>
                    <div class="filterDiv">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="国家:" style="margin: 5px;">
                                    <el-select v-model="filterData.countryCode" filterable placeholder="请选择国家">
                                        <el-option v-for="item in countryOptions" :key="item.id"
                                            :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="规则类型:" style="margin: 5px;">
                                    <el-select v-model="filterData.ruleId" filterable placeholder="请选择规则类型">
                                        <el-option v-for="item in ruleTypeOptions" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" style="margin: 5px 0 5px 35px;">
                                <el-button type="primary" :icon="Search" @click="getPartitionList">搜索</el-button>
                                <el-button :icon="RefreshLeft" @click="reset">{{getButtonText ('reset') }}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="detailList">
                        <div class="detailListItem" v-for="(item, index) in detailList" :key="index">
                            <div class="detailListItemCenter" style="display: flex;">
                                <span class="detailListItemTitle" v-if="!item.disabled">{{ item.countryName }}</span>
                                <el-select v-model="item.countryCode" v-else style="width: 300px;margin-right: 15px;"
                                    filterable placeholder="请选择国家">
                                    <el-option v-for="item in countryOptions" :key="item.id"
                                        :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                                </el-select>
                                <span v-if="!item.disabled">{{ item.ruleName }}：{{ item.ruleId ==
                                    1 ? item.postalCodeStart + '-' + item.postalCodeEnd : item.content }}</span>
                                <div v-else style="display: flex;align-items: center;">
                                    <el-select v-model="item.ruleId" style="width: 150px;" filterable
                                        placeholder="请选择规则类型">
                                        <el-option v-for="item in ruleTypeOptions" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                    ：
                                    <div v-show="item.ruleId === 1">
                                        <el-input v-model="item.postalCodeStart" placeholder="起始邮编"
                                            style="width: 150px;" />
                                        -
                                        <el-input v-model="item.postalCodeEnd" placeholder="结束邮编"
                                            style="width: 150px;" />
                                    </div>
                                    <div v-show="item.ruleId === 2">
                                        <el-input v-model="item.content" placeholder="邮编前缀" style="width: 150px;" />
                                    </div>
                                    <div v-show="item.ruleId === 3">
                                        <el-input v-model="item.content" placeholder="地址名" style="width: 150px;" />
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <el-button v-if="item.disabled" type="success" :icon="Check" circle
                                    @click="submitDetail(item)" />
                                <el-button v-else type="primary" :icon="Edit" circle @click="updDetail(item)" />
                                <el-button type="danger" :icon="Delete" circle @click="delDetail(item)" />
                            </div>
                        </div>
                    </div>
                </el-splitter-panel>
            </el-splitter>
        </div>
        <!-- 导入弹窗 -->
        <importDialog ref="importDialogRef" :typeId="541" :id="importId" :importTitle="'导入分区'" @close='getPartitionList'>
        </importDialog>
        <!-- <el-dialog v-model="centerDialogVisible" title="导入分区" width="900" align-center @close="getPartitionList">
            <importDialog :typeId="41" :id="importId"></importDialog>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">{{getButtonText ('close') }}</el-button>
                </div>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup name="配置分区">
import { Plus, Search, RefreshLeft, Delete, Edit, UploadFilled, Check } from '@element-plus/icons-vue'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import { getProductShipwayRegionProjectIdApi, addProductShipwayRegionApi, getProductShipwayRegionInfoApi, addProductShipwayRegionDetailApi, getProductShipwayRegionDetailRuleEnumApi, delProductShipwayRegionDetailApi, updProductShipwayRegionDetailApi, delProductShipwayRegionApi } from '@/api/productApi/shipway.js'
import router from '@/router/index.js'
import { onMounted } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const filterData = ref({
    countryCode: '', // 国家
    ruleId: '', // 规则类型
})
// 分区列表数据
const partitionList = ref([]);
// 当前选中的分区
const currentPartition = ref(1);
// 处理分区选择
const handleSelect = (item) => {
    currentPartition.value = item.code;
    // 获取当前分区的明细数据
    getPartitionDetail();
}
// 添加分区
const partitionNum = ref(null);
const partitionNumRef = ref(null);
const visible = ref(false);
const handleShow = () => {
    // 弹出时聚焦输入框
    nextTick(() => {
        partitionNumRef.value.focus();
    });
}
const handleBlur = () => {
    visible.value = false;
}
// 提交分区
const submitPartition = async () => {
    const num = parseInt(partitionNum.value, 10);
    // 检查输入是否为有效的正整数
    if (isNaN(num) || num <= 0) {
        ElMessage.error('请输入有效的正整数');
        return;
    }

    let lastCode = 0;
    if (partitionList.value.length > 0) {
        lastCode = parseInt(partitionList.value[partitionList.value.length - 1].code, 10);
    }
    const newPartitions = [];
    for (let i = 1; i <= num; i++) {
        const newCode = lastCode + i;
        newPartitions.push(newCode.toString());
    }
    const res = await addProductShipwayRegionApi({
        regionProjectId: props.id,
        codeList: newPartitions,
    })
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        getPartitionList();
        // 关闭弹窗
        visible.value = false;
        // 清空输入框
        partitionNum.value = null;
    }
    console.log('添加分区返回结果', res);
}
// 删除分区
const handleDelete = (item) => {
    ElMessageBox.confirm(
        `是否要删除该条分区?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const res = await delProductShipwayRegionApi({ id: item.id });
            smartAlert(res.msg, res.success, 1000)
            if (res.success) {
                getPartitionList();
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 明细列表数据
const detailList = ref([])
// 添加明细
const addDetail = () => {
    detailList.value.unshift({
        countryCode: '',
        countryName: '',
        ruleId: '',
        postalCodeStart: '',
        postalCodeEnd: '',
        content: '',
        createdTime: '',
        updatedTime: '',
        disabled: true
    })
}
// 提交明细
const submitDetail = async (item) => {
    console.log('提交明细', item);
    if (item.ruleId != 1) {
        // 清空邮编起始和结束
        item.postalCodeStart = '';
        item.postalCodeEnd = '';
    } else {
        // 清空内容
        item.content = '';
    }
    let res
    if (item.id) {
        res = await updProductShipwayRegionDetailApi({
            ...item,
            regionCode: currentPartition.value,
            regionProjectId: props.id,
        })
    } else {
        res = await addProductShipwayRegionDetailApi({
            ...item,
            regionCode: currentPartition.value,
            regionProjectId: props.id,
        })
    }
    console.log('提交明细返回结果', res);
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        getPartitionDetail();
    }
}
// 编辑明细
const updDetail = (item) => {
    item.disabled = true;
    console.log('编辑明细', item);
}
// 删除明细
const delDetail = (item) => {
    if (!item.id) {
        const index = detailList.value.findIndex(item => item.disabled);
        detailList.value.splice(index, 1);
    } else {
        ElMessageBox.confirm(
            `是否要删除该条明细?`,
            '提醒',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
            .then(async () => {
                const res = await delProductShipwayRegionDetailApi({ id: item.id });
                smartAlert(res.msg, res.success, 1000)
                if (res.success) {
                    getPartitionDetail();
                }
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消'
                });
            });
    }
}
// 重置筛选条件
const reset = () => {
    filterData.value = {
        countryCode: '', // 国家
        ruleId: '', // 规则类型
    }
    getPartitionDetail();
}
// 导入
const handleImportAdd = async () => {
    importId.value = props.id;
    importDialogRef.value.openImportDialog(); // 调用导入弹窗方法
}
// 弹窗相关
const importDialogRef = ref(null);
const importId = ref('');
// 获取分区别表
const getPartitionList = async () => {
    const res = await getProductShipwayRegionProjectIdApi({ regionProjectId: props.id });
    if (res.success) {
        partitionList.value = res.data;
        getPartitionDetail();
    }
}
// 获取分区明细
const getPartitionDetail = async () => {
    const res = await getProductShipwayRegionInfoApi({ regionProjectId: props.id, regionCode: currentPartition.value, ...filterData.value });
    if (res.success) {
        detailList.value = res.data.rows;
    }
}
// 国家数据
const countryOptions = ref([])
// 分区规则类型数据
const ruleTypeOptions = ref([])
onMounted(async () => {
    // 获取国家数据
    const countryRes = await getOrgCountryListApi();
    countryOptions.value = countryRes.data
    // 获取分区规则类型数据
    const ruleTypeRes = await getProductShipwayRegionDetailRuleEnumApi();
    ruleTypeOptions.value = ruleTypeRes.data
    // 获取分区列表数据
    getPartitionList();
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

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
            font-size: 12px;
            margin: 10px 20px 5px 10px;
            color: #606266;
        }
    }

    .active {
        background-color: #e7eeff;
        border-left: 2px solid #409eff;
    }
}

.filterDiv {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin: 10px;

    .el-form {
        width: 100% !important;
    }
}

.detailList {
    width: 100%;
    flex: 1;
    overflow-y: auto;

    .detailListItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        margin: 10px;
        padding: 15px;
        border-radius: 4px;

        .detailListItemTitle {
            font-size: 22px;
            height: 32px;
            line-height: 32px;
            color: #303133;
            width: 150px;
            // 溢出省略号
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .detailListItemCenter {
            font-size: 18px;
            color: #606266;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
        }

        .detailListItemText {
            font-size: 12px;
            color: #606266;
        }
    }
}
</style>