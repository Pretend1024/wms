<template>
    <el-form :model="formData" ref="formRef" label-width="110px" class="inventory-range-form">
        <h3>库存范围</h3>
        <el-row :gutter="20">
            <!-- 入库单 -->
            <el-col :span="24">
                <el-form-item :label="getLabel('inOrderNoList')" prop="inOrderNoList">
                    <canonicalInput v-model:listName="formData.inOrderNoList" :placeholder="getPlaceholder('inOrderNoList')"
                        clearable :returnString="true" :disabled="props.disabled" />
                </el-form-item>
            </el-col>

            <!-- 上架时间 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('onShelfStartTime')" prop="onShelfStartTime">
                    <el-date-picker v-model="formData.onShelfStartTime" type="date"
                        :placeholder="getPlaceholder('onShelfStartTime')" value-format="YYYY-MM-DD" clearable
                        :disabled="props.disabled" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('onShelfEndTime')" prop="onShelfEndTime">
                    <el-date-picker v-model="formData.onShelfEndTime" type="date"
                        :placeholder="getPlaceholder('onShelfEndTime')" value-format="YYYY-MM-DD" clearable
                        :disabled="props.disabled" />
                </el-form-item>
            </el-col>

            <!-- 库区 / 库位 / 排除 -->
            <el-col :span="12">
                <el-form-item :label="getLabel('zoneCodes')" prop="zoneCodes">
                    <canonicalInput v-model:listName="formData.zoneCodes" :placeholder="getPlaceholder('zoneCodes')"
                        clearable :returnString="true" :disabled="props.disabled" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('locationCodes')" prop="locationCodes">
                    <canonicalInput v-model:listName="formData.locationCodes"
                        :placeholder="getPlaceholder('locationCodes')" clearable :returnString="true"
                        :disabled="props.disabled" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('excludeZoneCodes')" prop="excludeZoneCodes">
                    <canonicalInput v-model:listName="formData.excludeZoneCodes"
                        :placeholder="getPlaceholder('excludeZoneCodes')" clearable :returnString="true"
                        :disabled="props.disabled" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="getLabel('excludeLocationCodes')" prop="excludeLocationCodes">
                    <canonicalInput v-model:listName="formData.excludeLocationCodes"
                        :placeholder="getPlaceholder('excludeLocationCodes')" clearable :returnString="true"
                        :disabled="props.disabled" />
                </el-form-item>
            </el-col>

            <el-divider />

            <!-- 排序 -->
            <el-col :span="24">
                <!-- 外层包一层专用 wrapper，避免 el-dialog 的 overflow 影响 -->
                <div class="draggable-dialog-body">
                    <h3>分配优先级策略</h3>
                    <Draggable v-model="draggableList" :animation="300" handle=".drag-handle" item-key="id"
                        @change="handleDragChange" :disabled="props.disabled" class="draggable-container">
                        <template #item="{ element, index }">
                            <div class="draggable-item" :data-id="element.id">
                                <span class="item-index">#{{ index + 1 }}</span>
                                <span class="item-name">{{ element.name }}</span>
                                <span class="drag-handle" @mousedown.stop v-if="props.disabled === false">
                                    <i class="iconfont icon-tuodong" aria-hidden="true"></i>
                                </span>
                            </div>
                        </template>
                    </Draggable>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted, watch, readonly } from 'vue';
import { getLabel } from '@/utils/i18n/i18nLabels.js';
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { getAllocateInventoryPriorityEnumApi } from '@/api/outstockApi/order.js';
import Draggable from 'vuedraggable';

const props = defineProps({
    formData: {
        type: Object,
        default: () => ({
            inOrderNoList: '',
            onShelfStartTime: '',
            onShelfEndTime: '',
            zoneCodes: '',
            locationCodes: '',
            excludeZoneCodes: '',
            excludeLocationCodes: '',
            priorityList: []
        })
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

// 表单数据
const formData = ref({ ...props.formData });
const formRef = ref(null);

defineExpose({
    getFormData: () => ({ ...formData.value }),
    resetForm: () => {
        formRef.value && formRef.value.resetFields && formRef.value.resetFields();
    }
});

const priorityEnum = ref([]);
const draggableList = ref([]);

// 父 props 同步到本地（回显场景）
watch(
    () => props.formData,
    (newVal) => {
        formData.value = { ...newVal };
        if (priorityEnum.value.length && Array.isArray(formData.value.priorityList) && formData.value.priorityList.length) {
            const map = new Map(priorityEnum.value.map((it) => [it.id, it]));
            draggableList.value = formData.value.priorityList.map((id) => map.get(id)).filter(Boolean).map(it => ({ ...it }));
        }
    },
    { deep: true }
);

onMounted(async () => {
    try {
        const res = await getAllocateInventoryPriorityEnumApi();
        priorityEnum.value = Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
        priorityEnum.value = [];
        console.error('获取优先级枚举失败: ', e);
    }

    // 初始化 draggableList（使用枚举副本）
    draggableList.value = priorityEnum.value.map((it) => ({ ...it }));

    // 如果外部有回显 priorityList，按回显顺序排列 draggableList
    if (Array.isArray(formData.value.priorityList) && formData.value.priorityList.length) {
        const map = new Map(priorityEnum.value.map((it) => [it.id, it]));
        const arranged = formData.value.priorityList.map((id) => map.get(id)).filter(Boolean);
        if (arranged.length) draggableList.value = arranged.map(it => ({ ...it }));
    }

    // 初始化 formData.priorityList（如果为空）
    if (!Array.isArray(formData.value.priorityList) || !formData.value.priorityList.length) {
        formData.value.priorityList = draggableList.value.map((it) => it.id);
    }
});

const handleDragChange = () => {
    formData.value.priorityList = draggableList.value.map((item) => item.id);
};
</script>

<style scoped lang="scss">
.inventory-range-form {
    width: 100%;
}

/* 确保 el-input 在这个组件内部宽度正常 */
:deep(.el-input) {
    width: 100%;
}

/* ========= 关键：修复 el-dialog 弹窗内拖拽被阻断的问题 ========= */
/* 允许弹窗 body 溢出，以便拖拽过程中鼠标移出弹窗也能继续被捕获 */
:deep(.el-dialog__body) {
    overflow: visible !important;
}

/* draggable 外层 wrapper，确保 z-index 和 overflow 不遮挡 */
.draggable-dialog-body {
    position: relative;
    z-index: 2;
    /* 保证处于弹窗内容之上 */
    /* 防止 touch 设备自动滚动/滑动干扰 */
    touch-action: none;
    -ms-touch-action: none;

    h3 {
        margin: 0 0 10px 0;
    }
}

/* 拖拽容器样式 */
.draggable-container {
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
    padding: 8px;
    background: transparent;
}

/* 单项样式 */
.draggable-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    user-select: none;
}

/* 确保真正可以接收事件（pointer-events）并显示抓手光标 */
.drag-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    margin-right: 8px;
    cursor: grab;
    pointer-events: all !important;
    user-select: none;
    font-size: 25px;
}

.drag-handle:active {
    cursor: grabbing;
}

.icon-tuodong {
    font-size: 24px;
}

.item-name {
    flex: 1;
    font-size: 18px;
}

.item-index {
    margin-left: 8px;
    color: #999;
    font-size: 18px;
    margin-right: 10px;
}

:deep(.vuedraggable--ghost) {
    opacity: 0.6;
}
</style>