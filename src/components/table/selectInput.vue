<template>
    <div class="select-input">
        <el-select v-model="formData[selectKey]" clearable :disabled="disabled">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span>:</span>

        <!-- 条件渲染：默认普通输入框 / 启用时用 canonicalInput -->
        <template v-if="useCanonicalInput">
            <!-- 完全匹配你的使用方式：仅 v-model:listName + clearable -->
            <canonicalInput v-model:listName="formData[formData[selectKey]]" clearable
                :style="{ width: labelWidth + 'px' }" />
        </template>
        <template v-else>
            <!-- 原有普通输入框 -->
            <el-input v-model="formData[formData[selectKey]]" :style="{ width: labelWidth + 'px' }"
                :placeholder="placeholder" clearable />
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import useUserMenuStore from '@/store/userMenu';
import canonicalInput from '@/components/table/canonicalInpt.vue';

const userMenuStore = useUserMenuStore()
const labelWidth = computed(() => (userMenuStore.lang === 'zh' ? 157 : 212))
const placeholder = computed(() => (userMenuStore.lang === 'zh' ? '模糊搜索' : 'fuzzy search'))

const props = defineProps({
    options: { // 下拉数据 [{label:'名称', value:'xxx'}]
        type: Array,
        required: true
    },
    formData: { // 外部表单对象
        type: Object,
        required: true
    },
    selectKey: { // 存储当前选择项的 key（如 'way'）
        type: String,
        default: 'way'
    },
    useCanonicalInput: { // 控制使用哪个输入框：true=canonicalInput，false=普通el-input（默认）
        type: Boolean,
        default: false
    }
})

</script>

<style scoped>
.select-input {
    display: inline-flex;
    align-items: center;
}

.el-select {
    width: 100px;
    margin-left: 10px;
}

/* 确保 canonicalInput 与普通输入框布局对齐 */
:deep(.formatted-input-wrapper) {
    vertical-align: middle;
}
</style>