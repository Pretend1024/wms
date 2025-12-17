<template>
    <div class="add-container" v-loading="loading">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="配置名称" prop="configName">
                        <el-input v-model="formData.configName" placeholder="请输入配置名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="状态" prop="statusId">
                        <el-select v-model="formData.statusId" placeholder="请选择状态">
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="formData.remark" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="section-title">关联承运商</div>
        <div class="selector-box">
            <div class="panel left-panel">
                <div class="panel-header">
                    <span>待选承运商</span>
                    <span class="count-badge">{{ allCarriers.length }}</span>
                </div>
                <div class="panel-body table-body">
                    <el-table :data="allCarriers" height="100%" size="small"
                        @selection-change="val => carrierSelection = val">
                        <el-table-column type="selection" width="40" />
                        <el-table-column prop="label" label="名称" show-overflow-tooltip />
                    </el-table>
                </div>
                <div class="panel-footer">
                    <el-button type="primary" link @click="handleAddCarriers"
                        :disabled="carrierSelection.length === 0">添加选中</el-button>
                    <el-divider direction="vertical" />
                    <el-button type="primary" link @click="handleAddAllCarriers">添加全部</el-button>
                </div>
            </div>

            <div class="exchange-icon">
                <el-icon>
                    <Right />
                </el-icon>
            </div>

            <div class="panel right-panel">
                <div class="panel-header">
                    <span>已选承运商</span>
                    <div class="header-actions">
                        <span class="count-text">{{ selectedCarriers.length }}项</span>
                        <el-button type="danger" link size="small" @click="clearSelectedCarriers"
                            v-if="selectedCarriers.length > 0">清空</el-button>
                    </div>
                </div>
                <div class="panel-body tag-body">
                    <el-scrollbar>
                        <div class="tag-list">
                            <el-tag v-for="(item, index) in selectedCarriers" :key="item.value" closable
                                @close="removeCarrier(index)" class="custom-tag" effect="plain">
                                {{ item.label }}
                            </el-tag>
                            <div v-if="selectedCarriers.length === 0" class="empty-tip">暂无选择</div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>

        <div class="section-title" style="margin-top: 20px;">关联国家</div>
        <div class="selector-box">
            <div class="panel left-panel">
                <div class="panel-header">
                    <span>待选国家</span>
                    <span class="count-badge">{{ allCountries.length }}</span>
                </div>
                <div class="panel-body table-body">
                    <el-table :data="allCountries" height="100%" size="small"
                        @selection-change="val => countrySelection = val">
                        <el-table-column type="selection" width="40" />
                        <el-table-column prop="label" label="名称" show-overflow-tooltip />
                    </el-table>
                </div>
                <div class="panel-footer">
                    <el-button type="primary" link @click="handleAddCountries"
                        :disabled="countrySelection.length === 0">添加选中</el-button>
                    <el-divider direction="vertical" />
                    <el-button type="primary" link @click="handleAddAllCountries">添加全部</el-button>
                </div>
            </div>

            <div class="exchange-icon">
                <el-icon>
                    <Right />
                </el-icon>
            </div>

            <div class="panel right-panel">
                <div class="panel-header">
                    <span>已选国家</span>
                    <div class="header-actions">
                        <span class="count-text">{{ selectedCountries.length }}项</span>
                        <el-button type="danger" link size="small" @click="clearSelectedCountries"
                            v-if="selectedCountries.length > 0">清空</el-button>
                    </div>
                </div>
                <div class="panel-body tag-body">
                    <el-scrollbar>
                        <div class="tag-list">
                            <el-tag v-for="(item, index) in selectedCountries" :key="item.value" closable
                                @close="removeCountry(index)" class="custom-tag" effect="plain">
                                {{ item.label }}
                            </el-tag>
                            <div v-if="selectedCountries.length === 0" class="empty-tip">暂无选择</div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>

        <div class="section-title"
            style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
            <span>配置关联关系预览</span>
            <el-button type="primary" size="small" plain @click="generatePreview">刷新预览</el-button>
        </div>
        <div class="preview-box">
            <template v-if="previewList.length > 0">
                <div class="preview-grid">
                    <div v-for="(item, index) in previewList" :key="index" class="preview-card">{{ item }}</div>
                </div>
            </template>
            <div v-else class="empty-text">
                <el-icon class="icon">
                    <InfoFilled />
                </el-icon>
                <span>请选择承运商和国家后点击“刷新预览”</span>
            </div>
        </div>

        <div class="section-title"
            style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
            <span>地址字段规则配置</span>
            <el-button type="primary" size="small" @click="addRule">添加规则</el-button>
        </div>
        <el-table :data="rulesList" border style="width: 100%" class="custom-table">
            <el-table-column label="地址校验字段" width="180">
                <template #default="{ row }">
                    <el-select v-model="row.fieldName" placeholder="请选择" filterable>
                        <el-option v-for="opt in fieldOptions" :key="opt.code" :label="opt.name" :value="opt.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="校验规则类型" width="180">
                <template #default="{ row }">
                    <el-select v-model="row.validateTypeId" placeholder="请选择" filterable>
                        <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="验证规则(正则)">
                <template #default="{ row }">
                    <el-input v-model="row.validateRule" placeholder="请输入正则表达式" />
                </template>
            </el-table-column>
            <el-table-column label="中文错误提示">
                <template #default="{ row }">
                    <el-input v-model="row.cnErrorMsg" placeholder="请输入中文提示" />
                </template>
            </el-table-column>
            <el-table-column label="英文错误提示">
                <template #default="{ row }">
                    <el-input v-model="row.enErrorMsg" placeholder="请输入英文提示" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                    <el-button type="danger" link @click="removeRule($index)"
                        :disabled="rulesList.length <= 1">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineExpose, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { Right, InfoFilled } from '@element-plus/icons-vue';
import {
    getProductShipwayBrandListApi,
    getAddressValidStatusEnumApi,
    getAddressValidateTypeEnumApi,
    getAddressValidateFieldNameEnumApi,
    addAddressValidApi
} from '@/api/productApi/shipway.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { smartAlert } from '@/utils/genericMethods.js';

const emit = defineEmits(['close', 'success']);

const loading = ref(false);
const formRef = ref(null);

// 表单数据
const formData = reactive({
    configName: '',
    statusId: 10,
    remark: ''
});

const rules = {
    configName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
    statusId: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 下拉选项
const statusOptions = ref([]);
const fieldOptions = ref([]);
const typeOptions = ref([]);

// 穿梭框数据
const allCarriers = ref([]);
const carrierSelection = ref([]);
const selectedCarriers = ref([]);

const allCountries = ref([]);
const countrySelection = ref([]);
const selectedCountries = ref([]);

// 预览数据
const previewList = ref([]);

// 规则数据
const rulesList = ref([
    { fieldName: '', validateTypeId: null, validateRule: '', cnErrorMsg: '', enErrorMsg: '', sort: 1 }
]);

// ------------------- 方法 -------------------

// 承运商操作
const handleAddCarriers = () => {
    const newItems = carrierSelection.value.filter(item => !selectedCarriers.value.some(sel => sel.value === item.value));
    selectedCarriers.value.push(...newItems);
};
const handleAddAllCarriers = () => {
    const newItems = allCarriers.value.filter(item => !selectedCarriers.value.some(sel => sel.value === item.value));
    selectedCarriers.value.push(...newItems);
};
const removeCarrier = (index) => selectedCarriers.value.splice(index, 1);
const clearSelectedCarriers = () => selectedCarriers.value = [];

// 国家操作
const handleAddCountries = () => {
    const newItems = countrySelection.value.filter(item => !selectedCountries.value.some(sel => sel.value === item.value));
    selectedCountries.value.push(...newItems);
};
const handleAddAllCountries = () => {
    const newItems = allCountries.value.filter(item => !selectedCountries.value.some(sel => sel.value === item.value));
    selectedCountries.value.push(...newItems);
};
const removeCountry = (index) => selectedCountries.value.splice(index, 1);
const clearSelectedCountries = () => selectedCountries.value = [];

// 预览生成
const generatePreview = () => {
    previewList.value = [];
    if (selectedCarriers.value.length === 0 || selectedCountries.value.length === 0) {
        return ElMessage.warning('请至少选择一个承运商和一个国家');
    }
    selectedCarriers.value.forEach(carrier => {
        selectedCountries.value.forEach(country => {
            // 预览格式：承运商代码 - 国家名(国家代码)
            const countryName = country.nameCn || '';
            const countryDisplay = countryName ? `${countryName}(${country.value})` : country.value;
            previewList.value.push(`${carrier.value} - ${countryDisplay}`);
        });
    });
};

// 规则操作
const addRule = () => {
    rulesList.value.push({ fieldName: '', validateTypeId: null, validateRule: '', cnErrorMsg: '', enErrorMsg: '', sort: rulesList.value.length + 1 });
};
const removeRule = (index) => {
    if (rulesList.value.length > 1) {
        rulesList.value.splice(index, 1);
        rulesList.value.forEach((item, idx) => item.sort = idx + 1);
    }
};

// 提交
const handleSubmit = async () => {
    await formRef.value.validate();

    const relationList = [];
    selectedCarriers.value.forEach(carrier => {
        selectedCountries.value.forEach(country => {
            relationList.push({ carrierCode: carrier.value, countryCode: country.value });
        });
    });

    if (relationList.length === 0) {
        return ElMessage.warning('请选择关联的承运商和国家');
    }

    for (let i = 0; i < rulesList.value.length; i++) {
        const r = rulesList.value[i];
        if (!r.fieldName || !r.validateTypeId) {
            return ElMessage.warning(`第 ${i + 1} 行规则请选择字段和校验类型`);
        }
    }

    const payload = {
        ...formData,
        addressValidRefList: relationList,
        addressValidRuleList: rulesList.value
    };

    loading.value = true;
    try {
        const res = await addAddressValidApi(payload);
        smartAlert(res.msg, res.success, 1000);
        if (res.success) {
            emit('success');
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        const [brandRes, countryRes, statusRes, typeRes, fieldRes] = await Promise.all([
            getProductShipwayBrandListApi(),
            getOrgCountryListApi(),
            getAddressValidStatusEnumApi(),
            getAddressValidateTypeEnumApi(),
            getAddressValidateFieldNameEnumApi()
        ]);

        if (brandRes.success) allCarriers.value = brandRes.data.map(i => ({ label: `${i.code}(${i.name})`, value: i.code }));
        if (countryRes.success) allCountries.value = countryRes.data.map(i => ({
            label: `${i.code}(${i.nameCn})`,
            value: i.code,
            nameCn: i.nameCn
        }));
        if (statusRes.success) statusOptions.value = statusRes.data.map(i => ({ label: i.name, value: i.id }));
        if (typeRes.success) typeOptions.value = typeRes.data.map(i => ({ label: i.name, value: i.id }));
        if (fieldRes.success) fieldOptions.value = fieldRes.data;

    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});

defineExpose({ handleSubmit });
</script>

<style scoped lang="scss">
.add-container {
    padding: 10px 20px;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
    border-left: 4px solid #409EFF;
    padding-left: 10px;
    color: #303133;
}

// 穿梭框样式优化
.selector-box {
    display: flex;
    align-items: center;
    gap: 15px;
    height: 280px;

    .exchange-icon {
        color: #909399;
        font-size: 20px;
    }

    .panel {
        flex: 1;
        height: 100%;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        transition: all 0.3s;

        &:hover {
            border-color: #c0c4cc;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        }

        .panel-header {
            height: 40px;
            padding: 0 15px;
            background: #f5f7fa;
            border-bottom: 1px solid #dcdfe6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #606266;
            font-weight: 500;

            .count-badge {
                background-color: #e4e7ed;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                color: #909399;
            }

            .header-actions {
                display: flex;
                align-items: center;
                gap: 10px;

                .count-text {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }

        .panel-body {
            flex: 1;
            overflow: hidden;

            &.table-body {
                padding: 0;

                // 让表格充满
                :deep(.el-table) {
                    border: none;

                    .el-table__inner-wrapper::before {
                        display: none;
                    }
                }
            }

            &.tag-body {
                padding: 10px;
                background-color: #fff;
            }
        }

        .panel-footer {
            height: 40px;
            border-top: 1px solid #dcdfe6;
            background-color: #fcfcfc;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

// 标签列表
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .custom-tag {
        border-color: #d9ecff;
        background-color: #ecf5ff;
        color: #409eff;

        &:hover {
            background-color: #d9ecff;
        }
    }

    .empty-tip {
        width: 100%;
        text-align: center;
        color: #c0c4cc;
        margin-top: 40px;
        font-size: 13px;
    }
}

// 预览区域
.preview-box {
    height: 160px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background: #fafafa;
    overflow-y: auto;

    .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;

        .preview-card {
            background: #fff;
            border: 1px solid #ebeef5;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            color: #606266;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
    }

    .empty-text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #909399;
        gap: 8px;

        .icon {
            font-size: 24px;
        }
    }
}

.custom-table {
    margin-top: 10px;
}
</style>