<template>
    <div :class="['container', { 'sign-up-mode': isLogin }]">
        <div class="left-panel">
            <img src="@/assets/images/signin.svg" class="image" alt="" />
        </div>
        <div class="right-panel">
            <div class="imgDiv rightLogo">
                <img src="@/assets/icon/HYDMaxLogo.png" alt="">
            </div>
            <div v-if="!isLogin" class="loginDiv">
                <h2 class="title">{{ $t('Login') }}</h2>
                <div class="loginForm">
                    <div class="inputDiv">
                        <el-input ref="userCodeInputRef" v-model="userData.userCode"
                            :placeholder="$t('UserNamePlaceholder')" @keyup.enter.stop="tryLogin">
                            <template #prefix>
                                <el-icon size="25">
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="inputDiv">
                        <el-input :placeholder="$t('PasswordPlaceholder')" v-model="userData.password"
                            @keyup.enter.stop="tryLogin" type="password" show-password id="loginPassword">
                            <template #prefix>
                                <el-icon size="25">
                                    <Lock />
                                </el-icon>
                            </template></el-input>
                    </div>
                </div>
                <!-- 语言选择 -->
                <div class="selectLanguage">
                    <el-select v-model="userMenuStore.lang" @change="localeChange"
                        style="width: 80px;box-shadow: none;">
                        <el-option v-for="item in languageList" :key="item.code" :label="item.name" :value="item.code">
                            <p style="margin: 0 auto;text-align: center;">{{ item.name }}</p>
                        </el-option>
                    </el-select>
                </div>
                <div @click="loginBtn" class="loginClick">
                    {{ $t('SignInNow') }}
                </div>
                <div class="forgetWord">
                    <span @click="switchLogin">{{ $t('ForgotPassword') }}</span>
                </div>
            </div>
            <div v-else class="forgetWordDiv loginDiv ">
                <h2 class="title">{{ $t('ResetPassword') }}</h2>
                <div class="loginForm" style="height: 300px;">
                    <div class="inputDiv">
                        <el-input v-model="userData.userCode" :placeholder="$t('PhonePlaceholder')"
                            @keyup.enter.stop="tryLogin">
                            <template #prefix>
                                <el-icon size="25">
                                    <Iphone />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="inputDiv" style="display: flex;">
                        <el-input v-model="userData.userCode" :placeholder="$t('CaptchaPlaceholder')"
                            @keyup.enter.stop="tryLogin">
                            <template #prefix>
                                <el-icon size="25">
                                    <Message />
                                </el-icon>
                            </template>
                        </el-input>
                        <div class="sendBtn">
                            {{
                                $t('Send') }}
                        </div>
                    </div>
                    <div class="inputDiv">
                        <el-input :placeholder="$t('NewPasswordPlaceholder')" v-model="userData.password"
                            @keyup.enter.stop="tryLogin" type="password" show-password>
                            <template #prefix>
                                <el-icon size="25">
                                    <Lock />
                                </el-icon>
                            </template></el-input>
                    </div>
                </div>
                <div class="loginClick">
                    {{ $t('ConfirmChange') }}
                </div>
                <div class="forgetWord">
                    <span @click="switchLogin">{{ $t('BackToLogin') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="登录">
import { Lock, Message, User } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import { loginApi, getUserMenuApi, getLangEnumApi } from '@/api/loginApi';
import router from '@/router';
import { transitionMenu } from '@/utils/menuAndRouter/transferMenu.js'
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
import useUserMenuStore from '@/store/userMenu';
import { onMounted, ref } from 'vue';
const userMenuStore = useUserMenuStore()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()

const userCodeInputRef = ref(null)
// 是否显示登录表单
const isLogin = ref(false)
// 切换登录修改
const switchLogin = () => {
    isLogin.value = !isLogin.value
}
// 登录表单数据
const userData = ref({
    language: userMenuStore.lang.value,
    mobilePhone: "",
    password: "",
    smsCode: "",
    terminal: 1,
    userCode: ''
})
// 语言列表
const languageList = ref([])
// 语言切换事件
const localeChange = () => {
    locale.value = userMenuStore.lang
}
// 登录按钮点击事件
const loginBtn = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        userData.value.language = userMenuStore.lang
        const res = await loginApi(userData.value)
        if (res.success) {
            localStorage.setItem('token', res.data)
            try {
                const menu = await getUserMenuApi()
                userMenuStore.userRoleList = menu.data[0].children
                userMenuStore.userMenuList = transitionMenu(menu.data[0].children)
                useTagsStore.clearTagsStore()
                // 缓存消息标识
                localStorage.setItem('messageReminding', '1')
                router.push('/')
                ElMessage({
                    message: res.msg,
                    type: 'success',
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            userData.value.password = ''
            loading.close()
            ElMessage({
                message: res.msg,
                type: 'error',
            })
        }
    } catch (error) {
        console.log(error)
    }
    finally {
        loading.close()
    }
};
// 回车键登录
const tryLogin = () => {
    if (userData.value.userCode && userData.value.password) {
        loginBtn()
    }
}
onMounted(async () => {
    if (!userData.value.userCode) {
        userCodeInputRef.value.focus();
    }
    const res = await getLangEnumApi()
    languageList.value = res.data
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,
input {
    font-family: 'Poppins', sans-serif;
}

.container {
    display: flex;
    width: 100%;
    background-color: #fff;
    min-height: 100vh;
    overflow: hidden;
}

.left-panel {
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #749aec;
}

.right-panel {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}



.loginDiv {
    /* width: 48%; */
    height: 400px;
    min-height: 360px;
    min-width: 490px;
    max-width: 680px;
    /* background-color: #acacac; */
    padding: 40px;
    border-radius: 10px;
    /* 阴影 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.forgetWordDiv {
    height: 500px;
}

.loginForm {
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.inputDiv {
    border-bottom: 1px solid #acacac;
    margin: 15px 0;
}

:deep(.el-input__wrapper) {
    box-shadow: none;
}

:deep(.el-input) {
    height: 50px;
}

:deep(.el-input__inner) {
    height: 50px;
    line-height: 50px;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
}

.loginClick {
    width: 100%;
    height: 50px;
    background-color: #5995fd;
    border-radius: 10px;
    line-height: 50px;
    text-align: center;
    font-size: 19px;
    font-weight: 600;
    color: #fff;
}

.loginClick:hover {
    background-color: #4d84e2;
    cursor: pointer;
}

.forgetWord {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #747474;
    font-size: 15px;
    margin-bottom: 50px;
}

.forgetWord>span:hover {
    color: #5995fd;
    cursor: pointer;
}

.sendBtn {
    width: 85px;
    line-height: 46px;
    background-color: rgb(235, 235, 235);
    height: 46px;
    text-align: center;
    color: rgb(87, 87, 87);
    border-radius: 10px;
    font-weight: 550;
    font-size: 16px;
}

.sendBtn:hover {
    color: #5995fd;
    cursor: pointer;
    background-color: rgb(223, 223, 223);
}

.imgDiv {
    width: 410px;
    height: 128px;
    position: absolute;
    top: 0;
    right: 0;
}

img {
    width: 100%;
}

.rightLogo {
    position: absolute;
}

.title {
    font-size: 2.2rem;
    color: #444;
    margin-bottom: 15px;
}

.input-field {
    max-width: 380px;
    width: 100%;
    background-color: #f0f0f0;
    margin: 10px 0;
    height: 55px;
    border-radius: 55px;
    display: grid;
    grid-template-columns: 15% 85%;
    padding: 0 0.4rem;
    position: relative;
}

.selectLanguage {
    width: 100%;
    margin: 0px 0 20px 0;
    display: flex;
    justify-content: end;
}

.input-field i {
    text-align: center;
    line-height: 55px;
    color: #acacac;
    transition: 0.5s;
    font-size: 1.1rem;
}

.input-field input {
    background: none;
    outline: none;
    border: none;
    line-height: 1;
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
}

.input-field input::placeholder {
    color: #aaa;
    font-weight: 500;
}

.btn {
    width: 150px;
    background-color: #5995fd;
    border: none;
    outline: none;
    height: 49px;
    border-radius: 49px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    margin: 10px 0;
    cursor: pointer;
    transition: 0.5s;
}

.btn:hover {
    background-color: #4d84e2;
}

:deep(.el-select__wrapper) {
    box-shadow: none !important;
}
</style>