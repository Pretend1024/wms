<template>
    <div class="header">
        <!-- 全部菜单按钮 -->
        <!-- <el-tooltip class="box-item" effect="dark" content="全部菜单" placement="right">
            <div class="menuBtn" @click="menuShowBtn"></div>
        </el-tooltip> -->
        <!-- icon -->
        <div class="logoDiv">
            <img src="@/assets/icon/HYDMaxLogo.png" alt="logo">
        </div>
        <!-- 菜单  menu-trigger="click"-->
        <div style="flex-grow: 1; min-width: 0;">
            <tags></tags>
        </div>

        <!-- <el-menu background-color="linear-gradient(to right, #ffffff, #ecf5ff)" text-color="#606167"
            active-text-color="#ff914e" :default-active="activeIndex" class="custom-menu" mode="horizontal">

            <el-sub-menu v-for="(item, index) in userMenuStore.userMenuList" :key="item.id" :index="item.path"
                popper-class="column-popover">
                <template #title>
                    <span class="column-title">{{ userMenuStore.lang == 'zh' ? item.name : item.nameEn }}</span>
                </template>
<div class="menu-column">
    <div class="menu-group" v-for="(group, idx) in item.children" :key="idx">
        <div class="menu-group-title"> {{ userMenuStore.lang == 'zh' ? group.name :
            group.nameEn }}</div>
        <div class="menu-group-content">
            <div class="menu-group-item" v-for="(ite, ind) in group.children" :key="ind"
                @click="$router.push(ite.path)">
                <span> {{ userMenuStore.lang == 'zh' ? ite.name :
                    ite.nameEn }}</span>
            </div>
        </div>
    </div>
</div>
</el-sub-menu>
</el-menu> -->
        <!-- 右侧按钮 -->
        <div class="otherBtn">
            <el-input v-model="searchLog" @change="handleSearch" class="moduleWidth" placeholder="search log"
                :suffix-icon="Search" />
            <!-- <el-select v-model="selectBranch" :placeholder="$t('SelectStation')" class="moduleWidth">
                <el-option v-for="item in Branch" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="selectSite" :placeholder="$t('SelectBranch')" class="moduleWidth">
                <el-option v-for="item in Site" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <!-- <el-tooltip :content="$t('FullScreen')" placement="bottom" effect="light" offset="18">
                <i class="iconfont icon-quanping" @click="fullScreen"></i>
            </el-tooltip> -->
            <!-- 工具 -->
            <el-dropdown>
                <i class="iconfont icon-gongju"></i>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item style="font-size: 16px;" @click="fullScreen">
                            {{ $t('fullScreen') }}
                        </el-dropdown-item>
                        <el-dropdown-item style="font-size: 16px;" @click="$router.push('/print')">
                            {{ $t('print') }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 消息列表 -->
            <el-tooltip :content="$t('Message')" placement="bottom" effect="light" offset="18">
                <el-badge v-if="msgCount > 0" :value="msgCount" :max="99">
                    <i class="iconfont icon-xiaoxitongzhi" @click="moreMsg"></i>
                </el-badge>
                <i v-else class="iconfont icon-xiaoxitongzhi" @click="moreMsg"></i>
            </el-tooltip>
            <!-- 文件 -->
            <el-dropdown>
                <i class="iconfont icon-wenjianjia"></i>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item style="font-size: 16px;" @click="myImport">
                            {{ $t('MyImport') }}
                        </el-dropdown-item>
                        <el-dropdown-item style="font-size: 16px;" @click="exportJob">
                            {{ $t('Download') }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- <el-tooltip :content="$t('Download')" placement="bottom" effect="light" offset="18">
                <i @click='exportJob' class="iconfont icon-yunxiazai"></i>
            </el-tooltip> -->
            <div class="userDiv">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <div style="display: flex;align-items: center;">
                            <div class="iconBoder">
                                <img v-if="userInfo.headImg" :src="userInfo.headImg" alt="用户头像">
                                <img v-else src="@/assets/images/headerImg2.png" alt="用户头像">
                            </div>
                            <div class="userNameDiv">{{ userInfo.nickName }}</div>
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </div>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item style="font-size: 16px;" @click="$router.push('/userInfo')">
                                <span class="iconfont icon-yonghu" style="margin-right: 8px; font-size: 20px;"></span>
                                {{ $t('UserInfo') }}
                            </el-dropdown-item>
                            <el-dropdown-item style="font-size: 16px;" @click="updatePassword">
                                <span class="iconfont icon-xiugaimima01"
                                    style="margin-right: 8px;font-size: 20px;"></span>
                                {{ $t('ChangePassword') }}
                            </el-dropdown-item>
                            <el-dropdown-item style="font-size: 16px;" @click="logout">
                                <span class="iconfont icon-tuichudenglu"
                                    style="margin-right: 8px;font-size: 20px;"></span>
                                {{ $t('Logout') }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" destroy-on-close>
        <el-form :model="passwordForm">
            <el-form-item label="用户名：" label-width="82px">
                <el-input v-model="passwordForm.code" disabled autocomplete="off" />
            </el-form-item>
            <el-form-item label="旧密码：" label-width="82px">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password
                    autocomplete="new-password" />
            </el-form-item>
            <el-form-item label="新密码：" label-width="82px">
                <el-input v-model="passwordForm.newPassword" type="password" show-password
                    autocomplete="new-password" />
            </el-form-item>
            <el-form-item label="确认密码：" label-width="82px">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password
                    autocomplete="new-password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{ getButtonText('cancel') }}</el-button>
                <el-button type="primary" @click="updatePasswordConfirm">
                    {{ getButtonText('confirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 消息通知提醒 -->
    <el-dialog v-model="msgDialogVisible" title="通知" width="900" align-center @close="handleClose" destroy-on-close>
        <div>
            <el-row>
                <el-col :span="24">
                    <h2 style="text-align: center;margin: 0;margin-bottom: 10px;">{{ msgContent.title }}</h2>
                </el-col>
                <el-col :span="24">
                    <div class="htmlContent" v-html="msgContent.content"></div>
                </el-col>
                <el-col :span="12" v-if="msgContent.link">
                    <el-form-item label="链接:">
                        <!-- 超出显示省略号 -->
                        <a :href="toDownloadTempPath(msgContent.link)" target="_blank" class="ellipsis-link">{{
                            msgContent.link
                        }}</a>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="msgContent.fileUrl">
                    <el-form-item label="附件:">
                        <a :href="toDownloadTempPath(msgContent.fileUrl)" target="_blank" class="ellipsis-link">{{
                            msgContent.fileUrl }}</a>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="msgDialogVisible = false">{{ getButtonText('close') }}</el-button>
                <el-button type="primary" @click='previous'> 上一条</el-button>
                <el-button type="primary" @click="next"> 下一条</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 全部菜单 -->
    <el-dialog v-model="menuShow" :show-close="false" :modal='false' width="100%" class="all-menu-dialog" top='60px'
        style=" height: calc(100vh - 60px); margin-bottom: 0;  padding: 0;" header-class="no-header-dialog"
        destroy-on-close>
        <div class="custom-menu custom-all-menu">
            <div v-for="(item, index) in userMenuStore.userMenuList" :key="item.id"
                :class="{ 'active': activeIndex === item.path }"
                style="color: var(--active-color, #606167);width: 750px;">
                <div class="column-title" style="font-size: 25px;" @click="toggleSubMenu(index)">
                    {{ userMenuStore.lang == 'zh' ? item.name : item.nameEn }}
                </div>
                <div class="menu-column" style="max-width: none;background: none;">
                    <div class="menu-group" v-for="(group, idx) in item.children" :key="idx">
                        <div class="menu-group-title" style="font-size: 18px;width: 80px;">
                            {{ userMenuStore.lang == 'zh' ? group.name : group.nameEn }}
                        </div>
                        <div class="menu-group-content" style="max-width: none; ">
                            <div class="menu-group-item" v-for="(ite, ind) in group.children" :key="ind"
                                @click="$router.push(ite.path), menuShow ? menuShow = false : ''">
                                <span style="font-size: 16px;margin: 8px 0  ;">
                                    {{ userMenuStore.lang == 'zh' ? ite.name : ite.nameEn }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script setup name="顶部导肮">
import { getUserInfoApi, updateUserPasswordApi, getNewMessageCountApi } from '@/api/userApi/index.js'
import { Search } from '@element-plus/icons-vue';
import { logoutApi } from '@/api/loginApi';
import { getBatchReadByIdApi } from '@/api/userApi/index.js'
import { toDownloadTempPath } from '@/utils/downLoad.js'
import router from '@/router';
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import useUserMenuStore from '@/store/userMenu';
const userMenuStore = useUserMenuStore()
import userInfoStore from '@/store/userInfo.js'
let useUserInfoStore = userInfoStore();
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'

import tags from '@/layout/tags.vue';
// 全部菜单
const menuShow = ref(false)
const menuShowBtn = () => {
    menuShow.value = !menuShow.value
}
// 搜索
const searchLog = ref('')
// 搜索回车事件
const handleSearch = () => {
    searchLog.value = searchLog.value.replace(/\s/g, '')
    refreshStore.indexNo = searchLog.value
    searchLog.value = ''
    router.push('/sys/log/opLog/list')
}
// 网点选择
const selectBranch = ref('')
// 站点选择
const selectSite = ref('')
// 用户信息
const userInfo = ref({})

const Branch = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
]
const Site = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
]

// 按钮点击事件---------------------------------------------
// 全屏
const fullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen()
    }
}
// 消息数量
const msgCount = ref(0)
// 更多消息
const moreMsg = () => {
    router.push('/messageNotices')
}
// 下载
const exportJob = () => {
    router.push('/exportJob')
}
// 导入
const myImport = () => {
    router.push('/myImport')
}
// 修改密码弹窗
const dialogFormVisible = ref(false)
// 修改密码表单
const passwordForm = reactive({
    code: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
// 修改密码
const updatePassword = () => {
    passwordForm.code = userInfo.value.code
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    dialogFormVisible.value = true
}
// 确定修改密码
const updatePasswordConfirm = async () => {
    const res = await updateUserPasswordApi(trimObjectStrings(passwordForm))
    smartAlert(res.msg, res.success, 1000)
    if (res.success) {
        dialogFormVisible.value = false
    }
    console.log(res)
}
// 退出登录
const logout = async () => {
    const res = await logoutApi()
    localStorage.removeItem('token')
    useTagsStore.clearTagsStore()
    userMenuStore.clearMenuData()
    useUserInfoStore.clearUserInfoData()
    router.push('/login')
    ElMessage({
        message: res.msg,
        type: 'success',
    })
}
// 弹窗提醒
const msgDialogVisible = ref(false)
// 提醒内容
const msgContent = ref({})
// 提醒id列表
const forceIdList = ref([])
// 信息下标
const msgIndex = ref(0)
// 上一条
const previous = async () => {
    if (msgIndex.value > 0) {
        msgIndex.value--
        const res = await getBatchReadByIdApi({ id: forceIdList.value[msgIndex.value] })
        msgContent.value = res.data
    } else {
        ElMessage({
            message: '已经是第一条了',
            type: 'warning',
        })
    }
}
// 下一条
const next = async () => {
    console.log(msgContent.value)
    if (msgIndex.value < forceIdList.value.length - 1) {
        msgIndex.value++
        const res = await getBatchReadByIdApi({ id: forceIdList.value[msgIndex.value] })
        msgContent.value = res.data
    }
    else {
        ElMessage({
            message: '已经是最后一条了',
            type: 'warning',
        })
    }
}
// 关闭
const handleClose = async () => {
    msgIndex.value = 0
    msgDialogVisible.value = false
    const res = await getNewMessageCountApi()
    console.log('新消息数量:', res)
    msgCount.value = res.data.total
}
// 获取消息数量和内容
const getMsgList = async () => {
    const res = await getNewMessageCountApi()
    // console.log('新消息数量:', res.data)
    msgCount.value = res.data.total
    if (res.data.force != 0) {
        forceIdList.value = res.data.forceIdList
        ElLoading.service({
            fullscreen: true,
            lock: true,
            text: '加载中...',
        })
        // 获取最新消息内容
        const msgRes = await getBatchReadByIdApi({ id: res.data.forceIdList[msgIndex.value] })
        msgContent.value = msgRes.data
        msgDialogVisible.value = true
        ElLoading.service().close()
    }
}
onMounted(async () => {
    if (!useUserInfoStore.userInfo.code) {
        const res = await getUserInfoApi()
        useUserInfoStore.updateUserInfo(res.data)
    }
    userInfo.value = useUserInfoStore.userInfo
    // 获取缓存messageReminding
    const messageReminding = localStorage.getItem('messageReminding')
    if (messageReminding == '1') {
        // 获取新消息数量
        getMsgList()
        localStorage.setItem('messageReminding', '0')
    } else {
        const msgRes = await getNewMessageCountApi()
        msgCount.value = msgRes.data.total
    }
})
// 定时获取新消息数量
setInterval(async () => {
    const res = await getNewMessageCountApi()
    msgCount.value = res.data.total
}, 180000)

</script>

<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    height: 60px;
    // #ecf5ff  c5d9f0
    background: linear-gradient(to right, #ffffff, #ffdcbc);

    .menuBtn {
        box-sizing: border-box;
        width: 10px;
        height: 60px;
        background-color: rgb(255, 255, 255);
        border-radius: 2px;
        position: relative;
    }

    .menuBtn:hover {
        cursor: pointer;
        background-color: #e2ecf7;
        border: none;
        transition: background-color .7s ease;
    }

    // 添加伪元素
    .menuBtn::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 10px;
        height: 35px;
        border-right: 2px solid #c2e4ff;
        box-sizing: border-box;
    }

    .menuBtn:hover::after {
        border-right-color: transparent;
        transition: border-right-color .7s ease;
    }

    .logoDiv {
        width: 180px;
        height: 60px;
        margin: 8px 0 0 15px;

        img {
            width: 180px;
            height: 60px;
        }
    }

    .el-menu {
        flex: 1;
        overflow: hidden;

        .column-title {
            font-size: 16px;
        }
    }

    :deep(.el-sub-menu__title:hover) {
        color: #ff914e !important;
    }

    .otherBtn {
        // min-width: 775px;
        width: 430px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-left: auto;
        flex-shrink: 0;

        .moduleWidth {
            width: 140px;
        }

        i {
            font-size: 22px;
            color: #43515c;
        }

        i:hover {
            // 鼠标悬停时变小手
            cursor: pointer;
            color: #ff914e;
        }

        .userDiv {
            max-width: 150px;

            .iconBoder {
                border-radius: 50%;
                overflow: hidden;
                margin-right: 5px;
                width: 40px;
            }

            .userNameDiv {
                font-size: 16px;
                color: #43515c;
                max-width: 65px;
                // 超出省略号
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .userDiv:hover {
            cursor: pointer;
        }

        .userDiv:hover .userNameDiv,
        .userDiv:hover i {
            color: #ff914e;
        }
    }

    img {
        width: 100%;
    }
}

.menu-column {
    max-width: 415px;
    padding: 10px 20px;
    background: linear-gradient(125deg, #ffffff, #ecf5ff);
    margin: -5px 0;
    display: flex;
    flex-direction: column;

    .menu-group {
        display: flex;
    }


    .menu-group-title {
        font-size: 15px;
        line-height: 50px;
        width: 70px;
        margin-right: 15px;
        flex-shrink: 0;
        cursor: pointer;
    }

    .menu-group-title:hover {
        // 下划线
        text-decoration: underline;
        text-underline-offset: 5px;
    }

    .menu-group-content {
        margin: 10px 0;
        display: flex;
        max-width: 330px;
        flex-wrap: wrap;
        justify-content: start;

        .menu-group-item {
            width: 110px;
            font-size: 14px;
            padding: 5px 0;
            color: #57595d;
        }

        .menu-group-item:hover {
            color: #ff914e;
            cursor: pointer;
            background-color: #d7fdda;
            // 阴影
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            // 修改阴影效果
            transition: all 0.3s ease;
        }
    }
}

.headImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
    }
}

.msgContent {
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-left: 15px;
    flex: 1;
}

.content {
    width: 189px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.msgUl {
    list-style: none;
    width: 100%;
    padding: 0;
}

.msgLi {
    display: flex;
    align-items: center;
    height: 70px;
    padding: 0 5px;
}

.msgLi:hover {
    cursor: pointer;
    background-color: #f0f1f3;
    border-radius: 10px;
}

.htmlContent {
    height: 550px;
    background-color: #f5f7fa;
    width: 100%;
    border: 1px solid #e4e7ed;
    border-radius: 3px;
    overflow-y: auto;
    padding: 5px;
}

.ellipsis-link {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}

// 全部菜单
.all-menu-dialog {
    .custom-all-menu {
        background: linear-gradient(to right, #ffffff, #ffdcbc);
        color: #606167;
        overflow-y: auto;
        height: calc(100vh - 75px);
        padding: 15px 15px 0 15px;
        display: flex;
        flex-wrap: wrap;
    }
}

:deep(.el-tabs__header) {
    margin: 0;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}

:deep(.el-menu) {
    border: none;
}

:deep(.el-menu--popup-bottom-start) {
    // padding: 15px 10px;
    padding: 0 !important;
}

// 头像下拉菜单
:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
    background-color: #f8eddc;
    color: #ff914e;
}
</style>