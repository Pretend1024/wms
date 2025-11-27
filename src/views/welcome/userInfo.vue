<template>
    <div class="viewArea">
        <div class="userInfo">
            <div class="userInfoTitle">
                <el-icon>
                    <Avatar />
                </el-icon>
                <p>用户信息</p>

            </div>
            <div class="userInfoContent">
                <div class="userInfoContentLeft">
                    <el-avatar v-if="userInfo.headImg != ''" :size="130" :src="userInfo.headImg" />
                    <el-avatar v-else :size="130">
                        <img src="@/assets/images/headerImg2.png" />
                    </el-avatar>
                    <!-- <el-avatar v-else :size="130"  src="../../assets/images/headerImg2.png" /> -->
                    <el-upload v-model:file-list="fileList" class="upload-demo" :auto-upload="true"
                        :http-request="handleUpload" :before-upload="beforeUpload" :on-remove="handleRemove" :limit="1"
                        :show-file-list="false">
                        <el-button type="primary" style="margin-top: 25px;">上传头像</el-button>
                    </el-upload>
                </div>
                <div class="userInfoContentRight">
                    <div class="userInfoContentRightForm">
                        <el-form label-width="102px" :model="userInfo">
                            <el-row :gutter="24">
                                <el-col :span="12">
                                    <el-form-item label="用户昵称：">
                                        <div v-if="!isEdit" class="userInfoContentRightFormInput">
                                            <p>{{ userInfo.nickName }}</p>
                                        </div>

                                        <div v-else class="userInfoContentRightFormInput">
                                            <el-input style="width: 70%;" placeholder="请输入昵称"
                                                v-model="userInfo.setNickName" clearable></el-input>
                                        </div>
                                    </el-form-item>
                                </el-col>        
                                <el-col :span="12">
                                    <el-form-item label="用户代码：">
                                        <p> {{ userInfo.code }}</p>
                                    </el-form-item>
                                </el-col>               
                                <el-col :span="12">
                                    <el-form-item label="账号状态：">
                                        <p style="color: green;"> {{ userInfo.statusName }}</p>
                                    </el-form-item>
                                </el-col>  
                                <el-col :span="12">
                                    <el-form-item label="最近登录：">
                                        <p> {{ userInfo.lastLoginTime }}
                                        </p>
                                    </el-form-item>
                                </el-col>   
                                <el-col :span="12">
                                    <el-form-item label="公司：">
                                        <p> {{userInfo.employee.orgName}}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="部门：">
                                        <p> {{ userInfo.employee.departmentName}}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="工号：">
                                        <p> {{ userInfo.employee.num}}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="入职时间：">
                                        <p> {{ userInfo.employee.entryTime }}</p>
                                    </el-form-item>
                                </el-col>                                                                
                                <el-col :span="12">
                                    <el-form-item label="员工姓名：">
                                        <p> {{  userInfo.employee.name }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="民族：">
                                        <p> {{  userInfo.employee.nationName }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="国家：">
                                        <p> {{ userInfo.employee.countryName }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="省份：">
                                        <p> {{ userInfo.employee.provinc}}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="城市：">
                                        <p> {{ userInfo.employee.city}}
                                        </p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="详细地址：">
                                        <p> {{ userInfo.employee.address}}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="手机：">
                                        <p> {{ userInfo.mobilePhone }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="邮箱：">
                                        <p style="overflow-wrap: break-word; word-break: break-all; white-space: normal;">
                                            {{userInfo.employee.email}}
                                        </p>
                                    </el-form-item>
                                </el-col>                              
                            </el-row>
                        </el-form>
                        <div style="width: 100%; display: flex; justify-content: center;">
                            <el-button v-if="isEdit" type="success" style="margin-top: 25px;"
                                @click="changeNickname">{{getButtonText ('save') }}</el-button>
                            <el-button v-if="isEdit" type="info" style="margin-top: 25px;"
                                @click="cancel">{{getButtonText ('cancel') }}</el-button>
                            <el-button v-else type="primary" style="margin-top: 25px;"
                                @click="isEdit = true">修改</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="用户信息">
import { Edit, Check, Avatar } from '@element-plus/icons-vue'
import { updateUserInfoApi } from '@/api/userApi/index.js'
import { uploadApi } from '@/api/baseApi/index.js'
import userInfoStore from '@/store/userInfo.js'
let useUserInfoStore = userInfoStore();
const userInfo = ref({
    setNickName: useUserInfoStore.userInfo.nickName, // 昵称
    ...useUserInfoStore.userInfo
})
// console.log(userInfo.value, '用户信息')
const isEdit = ref(false)
// 修改昵称
const changeNickname = async () => {
    userInfo.value.nickName = userInfo.value.setNickName
    const res = await updateUserInfoApi(userInfo.value)

    if (res.success) {
        ElMessage({
            type: 'success',
            message: res.msg,
        })
        console.log(res, '修改昵称返回值')
        useUserInfoStore.userInfo.nickName = userInfo.value.nickName
        isEdit.value = false

    }
}
// 取消修改昵称
const cancel = () => {
    isEdit.value = false
    userInfo.value.setNickName = userInfo.value.nickName
}

// 文件上传前校验
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
        ElMessage.error('只能上传图片格式!');
        return false;
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过2MB!');
        return false;
    }
    return true;
};

// 自定义上传处理
const handleUpload = async (options) => {
    try {
        const res = await uploadApi(options.file, { path: 'temp' });
        console.log(res, '上传头像返回值')
        // 更新头像显示
        userInfo.value.headImg = res.data;
        const res2 = await updateUserInfoApi(userInfo.value)
        ElMessage({
            type: 'success',
            message: res2.msg,
        })
        useUserInfoStore.userInfo.headImg = res.data
    } catch (error) {
        console.log('上传失败，请重试', error);
    }
};

</script>

<style scoped lang="scss">
.viewArea {
    display: flex;
    justify-content: center;
    align-items: center;

    .userInfo {
        width: 80%;
        height: 75%;
        // 渐变背景色
        // background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        // background-image:linear-gradient(0deg,#accbee 0%, #e7f0fd 100%);
        // background-image:linear-gradient(45deg,#93a5cf 0%, #e4efe9 100%);
        background-image: linear-gradient(0deg, #cfd9df 0%, #e2ebf0 100%);
        border-radius: 30px;
        padding: 15px 25px;

        .userInfoTitle {
            margin: 10px 0 0 25px;
            font-size: 20px;
            height: 20px;
            line-height: 20px;
            display: flex;
            color: #4b4a4a;
            font-weight: 550;
        }



        .userInfoContent {
            margin-top: 50px;
            display: flex;
            height: 70%;

            .userInfoContentLeft {
                height: 100%;
                padding-top: 15px;
                width: 25%;
                display: flex;
                align-items: center;
                flex-direction: column;
                // 虚线边框
                border-right: 2px #999 dashed;
            }
        }

        .userInfoContentRight {
            flex: 1;
            justify-content: center;
            display: flex;
            align-items: center;

            p {
                font-size: 18px;
                color: #4b4a4a;
                font-weight: 550;
            }

            .userInfoContentRightForm {
                width: 80%;

                .userInfoContentRightFormInput {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
            }
        }
    }
}

:deep(.el-form-item__label) {
    font-size: 18px;
}

:deep(.el-form-item) {
    margin: 0;
    padding: 10px 18px 10px 0;
}

:deep(.el-col) {
    border-bottom: 1px solid #999;
}
</style>