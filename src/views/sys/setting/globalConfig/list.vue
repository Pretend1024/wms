<template>
    <div class="viewArea">
        <div class="contentDiv">
            <div v-for="(group, groupKey) in groupedConfigs" :key="groupKey" class="config-group">
                <h3 class="group-title">{{ groupKey }}</h3>
                <el-form :model="form" layout="horizontal" class="config-form" label-width="140px">
                    <el-form-item v-for="item in group" :key="item.id" class="form-item">
                        <template #label>
                            <span class="custom-label" @click.prevent>{{ item.mapKey + ':' }} </span>
                        </template>

                        <div class="form-control-wrapper">
                            <template v-if="!item.options || item.options.length === 0">
                                <el-input v-model="form[item.mapKey]" @change="handleConfigChange(item)"
                                    class="form-control" />
                            </template>

                            <template v-else-if="item.options.length === 2">
                                <div class="switch-wrapper">
                                    <span class="switch-label"
                                        :class="{ 'is-active': form[item.mapKey] === item.options[1].value }">
                                        {{ item.options[1].label }}
                                    </span>

                                    <el-switch v-model="form[item.mapKey]" :active-value="item.options[0].value"
                                        :inactive-value="item.options[1].value" @change="handleConfigChange(item)"
                                        class="switch-core" />

                                    <span class="switch-label"
                                        :class="{ 'is-active': form[item.mapKey] === item.options[0].value }">
                                        {{ item.options[0].label }}
                                    </span>
                                </div>
                            </template>

                            <template v-else>
                                <el-select v-model="form[item.mapKey]" @change="handleConfigChange(item)"
                                    class="form-control" clearable>
                                    <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                                        :value="option.value" />
                                </el-select>
                            </template>

                            <span class="description">{{ item.description }}</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getGlobalConfigApi, setGlobalConfigApi } from '@/api/sysApi/setting.js'
import { ElMessage } from 'element-plus'

// 表单数据
const form = reactive({})
// 原始配置数据
const configs = ref([])
// 分组后的配置数据
const groupedConfigs = ref({})

const fetchConfigs = async () => {
    try {
        const response = await getGlobalConfigApi()
        if (response.success) {
            configs.value = response.data
            processConfigs()
        } else {
            ElMessage.error('获取配置失败：' + response.msg)
        }
    } catch (error) {
        ElMessage.error('获取配置时发生错误')
        console.error(error)
    }
}

const processConfigs = () => {
    const groups = {}
    configs.value.forEach(item => {
        if (item.options) {
            try {
                item.options = JSON.parse(item.options)
            } catch (e) {
                item.options = []
            }
        } else {
            item.options = []
        }
        form[item.mapKey] = item.mapValue
        if (!groups[item.type]) {
            groups[item.type] = []
        }
        groups[item.type].push(item)
    })
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => a.sortNo - b.sortNo)
    })
    groupedConfigs.value = groups
}

const handleConfigChange = async (item) => {
    await saveConfig(item)
}

const saveConfig = async (item) => {
    try {
        const params = {
            id: item.id,
            mapKey: item.mapKey,
            mapValue: form[item.mapKey]
        }
        const response = await setGlobalConfigApi(params)
        if (response.success) {
            ElMessage.success('保存成功')
        } else {
            ElMessage.error('保存失败：' + response.msg)
            form[item.mapKey] = item.mapValue
        }
    } catch (error) {
        ElMessage.error('保存时发生错误')
        form[item.mapKey] = item.mapValue
    }
}

onMounted(() => {
    fetchConfigs()
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.contentDiv {
    padding: 20px;
}

.config-group {
    margin-bottom: 30px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
        border-color: #dcdfe6;
    }
}

.group-title {
    margin: 0;
    padding: 12px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e5e7eb;
    font-size: 16px;
    font-weight: 500;
    color: #1f2329;
}

.config-form {
    padding: 20px;
}

// 表单项整体布局
.el-form-item {
    margin-bottom: 18px;

    &:last-child {
        margin-bottom: 0;
    }
}

// 自定义 Label 样式
.custom-label {
    font-weight: 500;
    color: #606266;
    // 溢出省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    // 【建议】将鼠标样式改为默认箭头，暗示该文本不可点击交互
    cursor: default;
}

// 表单控件容器
.form-control-wrapper {
    display: flex;
    align-items: center;
}

// 输入框和下拉框样式
.form-control {
    width: 480px;
    margin-right: 10px;
}

// 开关控件样式
.switch-control {
    margin-right: 10px;
}

// 描述信息样式
.description {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
    flex-shrink: 0;
}

// 开关文本样式调整
:deep(.el-switch__label) {
    padding: 0 8px;
    font-size: 14px;
}

:deep(.el-switch__label--left) {
    order: 1;
    margin-right: 5px;
}

:deep(.el-switch__label--right) {
    order: 3;
    margin-left: 5px;
}

:deep(.el-switch__core) {
    order: 2;
}

/* --- 开关自定义样式 --- */
.switch-wrapper {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.switch-label {
    font-size: 14px;
    color: #909399;
    /* 默认未选中颜色 */
    cursor: default;
    /* 鼠标变为箭头，提示不可点击 */
    transition: color 0.3s;

    &.is-active {
        color: #409eff;
        /* 选中时的高亮颜色 */
        font-weight: 500;
    }
}

.switch-core {
    margin: 0 8px;
    /* 开关与文字的间距 */
}
</style>