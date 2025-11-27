<template>
    <div class="rich-text-editor">
        <div v-show="props.toolbar" ref="toolbarRef" class="toolbar-container"></div>
        <div :style="{ height: props.height, overflowY: 'auto' }">
            <div ref="editorRef" class="editor-container"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'
import { uploadApi } from '@/api/baseApi/index.js';
// 组件 props
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    toolbar: {
        type: Boolean,
        default: true
    },
    readOnly: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    },
    height: {
        type: String,
        default: '330px'
    },
    toolbarKeys: {
        type: Array,
        default: () => [
            // 加粗
            'bold',
            // 下划线
            'underline',
            // 斜体
            'italic',
            // 删除线
            'through',
            // 代码样式
            // 'code',
            // 下标
            'sub',
            // 上标
            'sup',
            // 清除样式
            'clearStyle',
            // 文字颜色
            'color',
            // 文字背景颜色
            'bgColor',
            // 字体大小
            'fontSize',
            // 字体类型
            'fontFamily',
            // 增加缩进
            'indent',
            // 减少缩进
            'delIndent',
            // 左对齐
            'justifyLeft',
            // 右对齐
            'justifyRight',
            // 居中对齐
            'justifyCenter',
            // 两端对齐
            'justifyJustify',
            // 行高设置
            'lineHeight',
            // 插入图片
            'insertImage',
            // 上传图片
            'uploadImage',
            // 删除图片
            // 'deleteImage',
            // 编辑图片
            // 'editImage',
            // 查看图片链接
            // 'viewImageLink',
            // 设置图片宽度为 30%
            // 'imageWidth30',
            // 设置图片宽度为 50%
            // 'imageWidth50',
            // 设置图片宽度为 100%
            // 'imageWidth100',
            // 分割线
            'divider',
            // 插入表情
            'emotion',
            // 插入链接
            'insertLink',
            // 编辑链接
            // 'editLink',
            // 取消链接
            // 'unLink',
            // 查看链接
            // 'viewLink',
            // 插入代码块
            // 'codeBlock',
            // 插入引用块
            'blockquote',
            // 选择标题样式
            'headerSelect',
            // 一级标题
            'header1',
            // 二级标题
            'header2',
            // 三级标题
            'header3',
            // 四级标题
            // 'header4',
            // 五级标题
            // 'header5',
            // 插入待办事项
            'todo',
            // 重做操作
            'redo',
            // 撤销操作
            'undo',
            // 全屏显示
            // 'fullScreen',
            // 换行
            // 'enter',
            // 插入无序列表
            'bulletedList',
            // 插入有序列表
            'numberedList',
            // 插入表格
            'insertTable',
            // 删除表格
            // 'deleteTable',
            // 插入表格行
            // 'insertTableRow',
            // 删除表格行
            // 'deleteTableRow',
            // 插入表格列
            // 'insertTableCol',
            // 删除表格列
            // 'deleteTableCol',
            // 设置表格表头
            // 'tableHeader',
            // 设置表格宽度为 100%
            // 'tableFullWidth',
            // 插入视频
            // 'insertVideo',
            // 上传视频
            // 'uploadVideo',
            // 编辑视频尺寸
            // 'editVideoSize',
        ]
    },

})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const toolbarRef = ref(null)

let editor = null
let toolbar = null
onMounted(() => {
    // 创建编辑器
    editor = createEditor({
        selector: editorRef.value,
        config: {
            placeholder: props.placeholder,
            readOnly: props.readOnly,
            onChange(editor) {
                emit('update:modelValue', editor.getHtml())
            },
            MENU_CONF: {
                uploadImage: {
                    // 必填，给空字符串就行，不会真的调用这个地址
                    server: '',
                    // 你的自定义上传逻辑，拿到 URL 后调用 insertFn
                    async customUpload(file, insertFn) {
                        // 加载动画
                        ElLoading.service({
                            fullscreen: true,
                            lock: true,
                            text: '上传中...',
                        })
                        try {
                            const res = await uploadApi(file, { path: 'temp' })
                            insertFn(res.data)
                            ElMessage.success('上传成功')
                        } catch (err) {
                            console.error('上传失败', err)
                            ElMessage.error('上传失败')
                        }
                        // 关闭加载动画
                        ElLoading.service().close()
                    },
                }
            },
            mode: 'default'
        }
    })

    // 设置初始内容
    editor.setHtml(props.modelValue || '')

    // 创建工具栏，并使用传入的 toolbarKeys
    toolbar = createToolbar({
        editor,
        selector: toolbarRef.value,
        config: {
            toolbarKeys: props.toolbarKeys
        },
        mode: 'default'
    })
})

// 监听 v-model 更新内容
watch(() => props.modelValue, (newVal) => {
    if (editor && newVal !== editor.getHtml()) {
        editor.setHtml(newVal || '')
    }
})

// 销毁编辑器
onBeforeUnmount(() => {
    editor?.destroy()
    toolbar?.destroy()
})
</script>

<style scoped lang="scss">
.rich-text-editor {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 100%;
}

.toolbar-container {
    border-bottom: 1px solid #dcdfe6;
}

.editor-container {
    min-height: 250px;
    height: 285px;
    padding: 10px;
}
</style>