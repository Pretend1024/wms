<template>
  <el-config-provider :locale="getRoute.lang == 'zh' ? zhCn : en">
    <div class="viewArea">
      <!-- 路由视图 -->
      <router-view></router-view>
    </div>
  </el-config-provider>

</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import router from '@/router/index.js';
import userMenu from '@/store/userMenu.js';
let getRoute = userMenu();
// 刷新页面时，重新加载路由
if (getRoute.userMenuList.length > 0) {
  router.isReady().then(() => {
    //获取刷新前路由
    const url = window.location.href.substring(window.location.href.indexOf('/', 10));
    //重新跳转
    router.push(url)
  })
}
</script>
<style scoped lang="scss">
.viewArea {
  height: 100%;
  width: 100%;
}

// 选中行样式
:deep(.el-table__body tr.current-row>td) {
  background-color: #ffdab9 !important;
  color: #606266;
}
</style>

<style lang="scss">
/* 下拉框三列布局 */
.multi-column-select {
  width: 600px !important;

  .el-select-dropdown__wrap {
    padding: 0;

    .el-select-dropdown__list {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 0;
      padding: 5px 0;
      overflow: visible !important;

      .el-select-dropdown__item {
        padding: 8px 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }
    }
  }

  .el-select-dropdown__wrap {
    max-height: 400px;
  }
}
</style>
