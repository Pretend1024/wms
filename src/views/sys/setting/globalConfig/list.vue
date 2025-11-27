<template>
    <div class="viewArea">
        <div class="contentDiv">
            <!-- 循环渲染每个配置分组 -->
            <div v-for="(group, groupKey) in groupedConfigs" :key="groupKey" class="config-group">
                <h3 class="group-title">{{ groupKey }}</h3>
                <el-form :model="form" layout="horizontal" class="config-form" label-width="140px">
                    <!-- 循环渲染组内每个配置项 -->
                    <el-form-item v-for="item in group" :key="item.id" class="form-item">
                        <!-- 使用插槽自定义 Label -->
                        <template #label>
                            <span class="custom-label">{{ item.mapKey + ':' }} </span>
                        </template>

                        <!-- 表单控件容器 -->
                        <div class="form-control-wrapper">
                            <!-- 根据options类型显示不同控件 -->
                            <template v-if="!item.options || item.options.length === 0">
                                <el-input v-model="form[item.mapKey]" @blur="handleInputBlur(item)" :id="item.mapKey"
                                    class="form-control" />
                            </template>

                            <template v-else-if="item.options.length === 2">
                                <el-switch v-model="form[item.mapKey]" :active-value="item.options[0].value"
                                    :inactive-value="item.options[1].value" :active-text="item.options[0].label"
                                    :inactive-text="item.options[1].label" @change="handleSwitchChange(item)"
                                    :id="item.mapKey" class="switch-control" />
                            </template>

                            <template v-else>
                                <el-select v-model="form[item.mapKey]" @change="handleSelectChange(item)"
                                    :id="item.mapKey" class="form-control" clearable>
                                    <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                                        :value="option.value" />
                                </el-select>
                            </template>

                            <!-- 描述信息 -->
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

// 获取配置数据
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

// 处理配置数据：分组和排序
const processConfigs = () => {
    const groups = {}

    // 解析options并按type分组
    configs.value.forEach(item => {
        // 解析options字符串为数组
        if (item.options) {
            try {
                item.options = JSON.parse(item.options)
            } catch (e) {
                item.options = []
                console.error('解析options失败', e)
            }
        } else {
            item.options = []
        }

        // 初始化表单数据
        form[item.mapKey] = item.mapValue

        // 按type分组
        if (!groups[item.type]) {
            groups[item.type] = []
        }
        groups[item.type].push(item)
    })

    // 对每个分组按sortNo排序
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => a.sortNo - b.sortNo)
    })

    groupedConfigs.value = groups
}

// 输入框失焦处理
const handleInputBlur = async (item) => {
    await saveConfig(item)
}

// 开关变化处理
const handleSwitchChange = async (item) => {
    await saveConfig(item)
}

// 下拉框变化处理
const handleSelectChange = async (item) => {
    await saveConfig(item)
}

// 保存配置
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
            // 恢复原值
            form[item.mapKey] = item.mapValue
        }
    } catch (error) {
        ElMessage.error('保存时发生错误')
        console.error(error)
        // 恢复原值
        form[item.mapKey] = item.mapValue
    }
}

// 页面挂载时获取配置
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
    // max-width: 100px;
}

// 表单控件容器
.form-control-wrapper {
    display: flex;
    align-items: center;
}

// 输入框和下拉框样式
.form-control {
    width: 480px;
    // max-width: 300px;
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
::v-deep .el-switch__label {
    padding: 0 8px;
    font-size: 14px;
}

::v-deep .el-switch__label--left {
    order: 1;
    margin-right: 5px;
}

::v-deep .el-switch__label--right {
    order: 3;
    margin-left: 5px;
}

::v-deep .el-switch__core {
    order: 2;
}
</style>