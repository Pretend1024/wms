<template>
    <div class="formatted-input-wrapper">
        <!-- 基础 input 始终渲染，仅在非聚焦时可见文本 -->
        <el-input ref="inputRef" class="form_item_input" :class="{ 'invisible-input': isFocused }" v-model="contentText"
            @focus="handleFocus" :placeholder="placeholder" clearable :disabled="props.disabled" />

        <!-- 聚焦时显示的 textarea 浮层，不影响布局 -->
        <el-input v-if="isFocused" ref="textareaInputRef" class="form_item_input textarea-overlay" type="textarea"
            :rows="5" v-model="contentText" @blur="handleBlur" />
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';

const props = defineProps({
    /** 数据，通过 v-model:listName 传入（数组或JSON字符串，取决于 returnString） */
    listName: {
        type: [Array, String],
        default: () => []
    },
    /** 占位符 */
    placeholder: {
        type: String,
        default: ''
    },
    /** 是否返回JSON字符串（默认返回数组） */
    returnString: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:listName']);

const isFocused = ref(false);
const contentText = ref('');
const textareaInputRef = ref(null);

// 当外部数据变化且非聚焦时，同步到 contentText
watch(
    () => props.listName,
    (newValue) => {
        if (!isFocused.value) {
            if (props.returnString) {
                // 若需要返回JSON字符串，先解析JSON为数组，再转为换行分隔的文本
                try {
                    const arr = Array.isArray(newValue)
                        ? newValue
                        : (typeof newValue === 'string' ? JSON.parse(newValue) : []);
                    contentText.value = Array.isArray(arr) ? arr.join(',') : '';
                } catch (e) {
                    contentText.value = '';
                }
            } else {
                // 若返回数组，直接转为逗号分隔的文本
                contentText.value = Array.isArray(newValue) ? newValue.join(',') : '';
            }
        }
    },
    { immediate: true }
);

function handleFocus() {
    if (!isFocused.value) {
        isFocused.value = true;
        // 聚焦时，将逗号转为换行（方便多行编辑）
        contentText.value = contentText.value.replace(/,/g, '\n');
        nextTick(() => {
            const el = textareaInputRef.value?.textarea || textareaInputRef.value?.input || textareaInputRef.value;
            el?.focus();
        });
    }
}

function handleBlur() {
    isFocused.value = false;
    // 格式化内容：将非字母、数字、中文、连字符的符号替换为逗号
    let text = contentText.value.replace(/[^\w\u4e00-\u9fa5-]+/g, ',');

    // 处理连续逗号的情况
    text = text.replace(/,+/g, ',');
    // 移除首尾逗号
    text = text.replace(/^,|,$/g, '');

    // 按逗号分割为数组，处理空项和空格
    const items = text
        .split(',')
        .map(item => item.trim())
        .filter(item => item); // 过滤空字符串

    // 根据returnString决定返回格式
    if (props.returnString) {
        // 返回JSON字符串
        emit('update:listName', JSON.stringify(items));
    } else {
        // 返回数组
        emit('update:listName', items);
    }

    // 同步显示内容为逗号分隔
    contentText.value = items.join(',');
}
</script>

<style scoped>
.formatted-input-wrapper {
    position: relative;
    overflow: visible;
    width: 100%;
}

.form_item_input {
    width: 100%;
}

.invisible-input>>>.el-input__inner {
    color: transparent;
    text-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.textarea-overlay {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.textarea-overlay>>>.el-textarea__inner {
    padding: 6px 15px;
}
</style>