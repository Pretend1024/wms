<template>
  <div v-show="isAnimating" :class="['route-border-progress', { 'fade-out': isFading }]"
    :style="{ backgroundColor: borderColor }"></div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAnimating = ref(false);
const borderColor = ref('#007bff');
const isFading = ref(false);

onBeforeMount(() => {
  router.beforeEach(() => {
    isAnimating.value = true;
    isFading.value = false;
    borderColor.value = '#007bff';
  });

  router.afterEach(() => {
    setTimeout(() => {
      isFading.value = true;
      setTimeout(() => {
        isAnimating.value = false;
        isFading.value = false;
      }, 500); // 匹配淡出动画时间
    }, 800); // 在进度条动画完成80%时启动淡出（更自然过渡）
  });
});
</script>

<style scoped>
.route-border-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  animation:
    borderProgress 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  z-index: 9999;
}

.fade-out {
  animation:
    fadeOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes borderProgress {
  to {
    width: 100%;
  }
}

@keyframes fadeOut {
  from {
    width: 100%;
    opacity: 1;
  }

  to {
    width: 100%;
    opacity: 0;
    transform: translateY(-100%);
    /* 增加滑动效果 */
  }
}
</style>