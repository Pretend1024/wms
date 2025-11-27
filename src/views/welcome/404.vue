<template>
    <el-empty :image="errorImage" description="页面不存在" image-size="500">
        <el-button type="primary" link @click="goBack">返回上一页</el-button>
    </el-empty>
</template>

<script setup>
import { useRouter } from 'vue-router';
import errorImage from '@/assets/images/404Img.webp';

const router = useRouter();
const goBack = () => {
    router.go(-1); // 返回上一页
};
</script>

<style scoped>
.el-empty {
    text-align: center;
    padding: 50px 0;
}

:deep(.el-empty__description>p) {
    font-size: 22px;
}
</style>