<template>
    <div class="barcode-list">
        <div v-for="(code, index) in codes" :key="index" class="barcode-item">
            <div class="barcode-wrapper">
                <svg :ref="el => svgRefs[index] = el"></svg>
            </div>
            <div v-if="props.codeType === 117" class="qr-text">{{ code }}</div>
        </div>
        <div v-if="codes.length === 0" class="empty">暂无条码</div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

const props = defineProps({
    content: { type: String, required: true },
    renderAs: { type: String, default: 'svg' },
    codeType: { type: Number, default: 116 },
    options: {
        type: Object,
        default: () => ({
            format: 'CODE128',
            displayValue: true,
            lineColor: '#000',
            width: 2,
            height: 80,
            fontSize: 17,
            textMargin: 5,
        })
    },
})

const codes = ref([])
const svgRefs = ref([])

function parseContent() {
    codes.value = props.content
        .split(',')
        .map(item => item.trim())
        .filter(item => item)
}

function renderAll() {
    nextTick(() => {
        codes.value.forEach((code, idx) => {
            const el = svgRefs.value[idx]
            if (!el) return

            el.innerHTML = '' // 清空旧内容，避免重复渲染

            if (props.codeType === 116) {
                JsBarcode(el, code, props.options)
            } else if (props.codeType === 117) {
                const qrOpts = {
                    margin: 2,
                    width: 200,
                    color: {
                        dark: props.options.lineColor || '#000',
                        light: '#FFFFFF',
                    },
                }

                QRCode.toString(code, { ...qrOpts, type: 'svg' })
                    .then(svgString => {
                        const parser = new DOMParser()
                        const doc = parser.parseFromString(svgString, 'image/svg+xml')
                        const newSvg = doc.documentElement
                        newSvg.setAttribute('width', '200')
                        newSvg.setAttribute('height', '200')
                        el.appendChild(newSvg)
                    })
                    .catch(err => {
                        console.error('二维码生成失败', err)
                    })
            }
        })
    })
}

onMounted(() => {
    parseContent()
    renderAll()
})

watch(() => props.content, () => {
    parseContent()
    renderAll()
})

watch(() => props.codeType, () => {
    renderAll()
})
</script>

<style scoped>
.barcode-list {
    width: 100%;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    align-items: center;
}

.barcode-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.barcode-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible;
    width: 200px;
    height: 200px;
}

svg {
    display: block;
    width: 100%;
    height: 100%;
}

.qr-text {
    margin-top: -4px;
    font-size: 20px;
    color: #333;
    text-align: center;
    word-break: break-word;
    max-width: 90%;
}

.empty {
    color: #888;
    font-size: 14px;
}
</style>