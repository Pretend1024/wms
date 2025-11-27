<template>
    <div class="viewArea">
        <div class="contentDiv">
            <p>承运商信息</p>
            <el-form :model="formData" :rules="mainRules" ref="mainFormRef" label-width="115px" class="brand-form">
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('code')" prop="code">
                            <el-input v-model="formData.code" :placeholder="getPlaceholder('code')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('name')" prop="name">
                            <el-input v-model="formData.name" :placeholder="getPlaceholder('name')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="getLabel('statusId')" prop="statusId">
                            <el-select v-model="formData.statusId" :placeholder="getPlaceholder('statusId')">
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="getLabel('remark')">
                            <el-input type="textarea" autosize v-model="formData.remark"
                                :placeholder="getPlaceholder('remark')" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 承运商服务 -->
            <div class="titleDiv">
                <p class="active">承运商服务</p>
            </div>
            <div class="actions">
                <el-button type="primary" @click="addLogisticsService">新增服务</el-button>
            </div>

            <div class="tableDiv">
                <div class="tableDivItem" v-for="(item, index) in formData.carrierServiceAddDTOList" :key="index">
                    <div class="index-label">{{ index + 1 }}</div>
                    <el-form :model="item" :rules="serviceRules" :ref="el => setServiceRef(el, index)"
                        label-width="105px" class="service-form">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item :label="getLabel('serviceCode')" prop="code">
                                    <el-input v-model="item.code" :placeholder="getPlaceholder('serviceCode')" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="getLabel('serviceName')" prop="name">
                                    <el-input v-model="item.name" :placeholder="getPlaceholder('serviceName')" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="getLabel('statusId')" prop="statusId">
                                    <el-select v-model="item.statusId" :placeholder="getPlaceholder('statusId')">
                                        <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label"
                                            :value="opt.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="getLabel('remark')">
                                    <el-input type="textarea" autosize v-model="item.remark"
                                        :placeholder="getPlaceholder('remark')" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="actions">
                        <el-icon :size="22" @click="deleteLogisticsService(index)">
                            <CloseBold />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { CloseBold } from '@element-plus/icons-vue';

const props = defineProps({
    formData: { type: Object, required: true },
    statusOptions: { type: Array, default: () => [] }
});

// 表单ref
const mainFormRef = ref(null);
const serviceFormRefs = ref([]);


const mainRules = {
    code: [{ required: true, message: '请输入服务商代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
    statusId: [{ required: true, message: '请选择状态', trigger: 'change' },]
};
const serviceRules = {
    code: [{ required: true, message: '请输入渠道代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
    statusId: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 添加承运商服务
const addLogisticsService = () => {
    if (!Array.isArray(props.formData.carrierServiceAddDTOList)) {
        props.formData.carrierServiceAddDTOList = [];
    }
    props.formData.carrierServiceAddDTOList.push({
        code: '',
        name: '',
        statusId: '',
        remark: ''
    });
}

// 删除承运商服务
const deleteLogisticsService = (index) => {
    props.formData.carrierServiceAddDTOList.splice(index, 1);
    serviceFormRefs.value.splice(index, 1);
}
// 设置表单ref
const setServiceRef = (el, index) => {
    serviceFormRefs.value[index] = el;
}

// 表单验证方法
const validateMain = () => {
    return new Promise((resolve, reject) => {
        mainFormRef.value.validate(valid => {
            valid ? resolve() : reject(new Error('主表单校验失败'));
        });
    });
}
const validateServices = () => {
    const validForms = serviceFormRefs.value.filter(f => f && typeof f.validate === 'function');
    if (!validForms.length) return Promise.resolve();
    const promises = validForms.map(form =>
        new Promise((resolve, reject) => {
            form.validate(valid => {
                valid ? resolve() : reject(new Error('承运商服务校验失败'));
            });
        })
    );
    return Promise.all(promises);
}


defineExpose({
    validateMain,
    validateServices
});
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.viewArea .contentDiv .el-form {
    width: 1200px;
}

.titleDiv {
    display: flex;
    width: 100%;
    height: 45px;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;

    p {
        border: none !important;
        margin-bottom: 0 !important;
        font-size: 18px !important;
        padding: 0 15px 10px !important;
    }

    p:hover {
        font-size: 22px !important;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    p.active {
        color: #ff914e;
        height: 30px !important;
        font-size: 22px !important;
        border-bottom: 2px solid #ff914e !important;
    }
}

.tableDiv {
    overflow: hidden;
    overflow-y: auto;
    height: 280px;
}

.tableDivItem {
    width: 1210px;
    padding: 15px 0 0 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    display: flex;
    margin: 15px 5px;

    .index-label {
        text-align: center;
        font-size: 22px;
        margin-top: 3px;
        width: 40px;
    }

    .actions {
        text-align: end;
        flex-shrink: 0;

        .el-icon {
            cursor: pointer;
            color: red;
            padding: 5px;
            margin: 0 5px;
        }

        .el-icon:hover {
            background-color: #ced2d6;
            border-radius: 50%;
        }
    }
}
</style>