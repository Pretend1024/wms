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


// 不需要切换的输入框id
// const specificInputIds = ['loginPassword'];
// const handleEnterKey = (e) => {
//   // 检查按下的键是否为回车键
//   if (e.key === 'Enter') {
//     // 获取当前聚焦的元素
//     const currentElement = document.activeElement;
//     // 判断当前元素是否是指定 id 的输入框
//     const isSpecificInput = specificInputIds.includes(currentElement.id);

//     if (isSpecificInput) {
//       // 若为指定输入框，不进行焦点切换
//       e.preventDefault();
//       return;
//     }

//     // 选择所有的输入框、文本框、下拉框和具有 tabindex 属性且 tabindex 不为 -1 的元素 select
//     const formElements = Array.from(
//       document.querySelectorAll('input, textarea, [tabindex]:not([tabindex="-1"])')
//     )
//       // 过滤掉禁用的元素、tabindex 为 -1 的元素和隐藏的输入框
//       .filter(el => !el.disabled && el.tabIndex !== -1 && el.type !== 'hidden');

//     // 获取当前聚焦元素在表单元素数组中的索引
//     const currentIndex = formElements.indexOf(document.activeElement);
//     // 检查当前聚焦元素是否存在于表单元素数组中，并且不是最后一个元素
//     if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
//       // 获取下一个可聚焦的元素
//       const nextElement = formElements[currentIndex + 1];
//       // 将焦点移动到下一个元素
//       nextElement.focus();
//       // 阻止回车键的默认行为（例如提交表单）
//       e.preventDefault();
//     }
//   }
// };

// onMounted(() => {
//   window.addEventListener('keydown', handleEnterKey);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener('keydown', handleEnterKey);
// });
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
