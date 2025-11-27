<template>
    <div class="WeclomeViewArea">
        <div class="WeclomeViewAreaTop" :style="{ width: getWidth }">
            <div class="bolckDiv background">
                <div class="bolckTitle">
                    <span class="iconfont icon-gongsigonggao"></span>
                    <p>
                        {{ $t('InformationBulletin') }}
                    </p>
                    <span class="bolckTitleRight" @click="() => router.push('/messageNotices')">
                        <span>{{ getButtonText('more') }}</span>
                        <el-icon size="14" style="float: right">
                            <ArrowRight />
                        </el-icon>
                    </span>
                </div>
                <div class="msgContentDiv" :style="{ width: getLeftWidth }">
                    <ul>
                        <li v-for="(item, index) in msgList" :key="index" @click="msgClick(item)">
                            <div class="msgContent">
                                <p>
                                    {{ item.title }}
                                </p>
                                <p>{{ item.createdTime }}</p>
                            </div>
                            <el-icon size="14" style="float: right;margin-left: auto;">
                                <ArrowRight />
                            </el-icon>
                        </li>
                    </ul>
                </div>
                <div class="bolckTitle">
                    <span class="iconfont icon-wendang"></span>
                    <p>
                        {{ $t('DocumentArea') }}
                    </p>
                </div>
                <div class="documentDiv">
                    <ul>
                        <li>
                            <span class="iconfont icon-shu1"></span>
                            <p>
                                API接口文档
                            </p>
                        </li>
                        <li>
                            <span class="iconfont icon-shouji"></span>
                            <p>
                                操作APP安装包
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="bolckDiv background">
                <div class="bolckTitle">
                    <span class="iconfont icon-renwu"></span>
                    <p>
                        {{ $t('StatusOfTheMission') }}
                    </p>
                </div>
                <div class="missionContentDiv" :style="{ width: getRightWidth }">
                    <div class="missionContent">
                        <div class="missionContentItemTile">
                            <span class="iconfont icon-tiaoma" style="color: #fda32c;"></span>
                            <span>SKU任务</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/base/sku/sku/list')">
                            <span style="color: #fda32c;">1</span>
                            <span>待审核SKU</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/base/sku/sku/list')">
                            <span style="color: #fda32c;">12</span>
                            <span>待复测SKU</span>
                        </div>
                    </div>
                    <div class="missionContent">
                        <div class="missionContentItemTile">
                            <span class="iconfont icon-ruku" style="color: #0fc6c2;"></span>
                            <span>入库任务</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/instock/order/inOrder/list')">
                            <span style="color: #0fc6c2;">123</span>
                            <span>在途中</span>
                        </div>
                        <div class="missionContentItem">
                            <span style="color: #0fc6c2;"
                                @click="() => router.push('/instock/order/inOrder/list')">4532</span>
                            <span>待收货</span>
                        </div>
                        <div class="missionContentItem">
                            <span style="color: #0fc6c2;"
                                @click="() => router.push('/instock/order/inOrder/list')">45321</span>
                            <span>待上架</span>
                        </div>
                    </div>
                    <div class="missionContent">
                        <div class="missionContentItemTile">
                            <span class="iconfont icon-chuku" style="color: #00b42a;"></span>
                            <span>出库任务</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/outstock/op/outShipped/index')">
                            <span style="color: #00b42a;">123453</span>
                            <span>待下架</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/outstock/op/outShipped/index')">
                            <span style="color: #00b42a;">4213427</span>
                            <span>待打包</span>
                        </div>
                        <div class="missionContentItem" @click="() => router.push('/outstock/op/outShipped/index')">
                            <span style="color: #00b42a;">561</span>
                            <span>待出库</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="WeclomeViewAreaEcharts" :style="{ width: getWidth }">
            <orderTrend></orderTrend>
        </div>
        <div class="WeclomeViewAreaEcharts"
            :style="{ width: getWidth, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }">
            <div :style="{ width: getEchartsWidth }">
                <orderPercentage :customerData="echartsData" :title="'客户订单比例'" :iconfont="'icon-kehugenjin'">
                </orderPercentage>
            </div>
            <div :style="{ width: getEchartsWidth }">
                <orderPercentage :customerData="echartsData" :title="'国家订单比例'" :iconfont="'icon-diqiu'">
                </orderPercentage>
            </div>
            <div :style="{ width: getEchartsWidth }">
                <orderPercentage :customerData="echartsData" :title="'电商平台订单比例'" :iconfont="'icon-icon01'">
                </orderPercentage>
            </div>
        </div>
    </div>
    <!-- 消息详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="消息详情" width="900" align-center @close="handleClose" destroy-on-close>
        <el-form :model="addData">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="消息类型:" label-width="110px">
                        <el-input v-model="addData.typeName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="通知范围:" label-width="110px">
                        <el-input v-model="addData.notifyScopeName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="标题:" label-width="110px">
                        <el-input v-model="addData.title" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="内容:" label-width="110px">
                        <div class="htmlContent" v-html="addData.content"> </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="addData.fileUrl">
                    <el-form-item label="附件:" label-width="110px">
                        <a :href="toDownloadTempPath(addData.fileUrl)" target="_blank" class="ellipsis-link">
                            {{ addData.fileUrl }}
                        </a>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="addData.link">
                    <el-form-item label="链接:" label-width="110px">
                        <a :href="toDownloadTempPath(addData.link)" target="_blank" class="ellipsis-link">
                            {{ addData.link }}
                        </a>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间:" label-width="110px">
                        <el-input v-model="addData.createdTime" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ getButtonText('close') }}</el-button>
                <el-button type="primary" @click="handleConfirm">
                    下一条
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="欢迎">
import { useWindowSize } from '@vueuse/core';
import { checkTokenApi } from '@/api/loginApi'
import { getMessageNoticesApi } from "@/api/userApi/index.js"
import { getBatchReadByIdApi } from '@/api/userApi/index.js'
import router from '@/router'
import useUserMenuStore from '@/store/userMenu';
const userMenuStore = useUserMenuStore()
import orderPercentage from '@/components/echarts/orderPercentage.vue'
import orderTrend from '@/components/echarts/orderTrend.vue'
import { smartAlert } from '@/utils/genericMethods.js'
import { toDownloadTempPath } from '@/utils/downLoad.js'
// 消息列表
const msgList = ref([])
// 消息详情对话框
const dialogVisible = ref(false)
// 消息详情数据
const addData = ref({})
// 当前消息索引
const currentIndex = ref(-1) // 初始化为-1表示未选中

// 消息点击事件
const msgClick = async (row) => {
    if (!row.id) return // 防御性判断

    dialogVisible.value = true
    addData.value = { ...row } // 赋值详情数据

    // 标记消息为已读
    try {
        const res = await getBatchReadByIdApi({ id: row.id })
        if (res.success) {
            const index = msgList.value.findIndex(item => item.id === row.id)
            if (index !== -1) {
                msgList.value[index].isReaded = true
            }
        }
    } catch (error) {
        ElMessage.error('标记已读失败')
    }

    // 设置当前索引
    currentIndex.value = msgList.value.findIndex(item => item.id === row.id)
}

// 下一条消息逻辑
const handleConfirm = async () => {
    const nextIndex = currentIndex.value + 1
    if (nextIndex < msgList.value.length) {
        // 存在下一条消息，更新数据
        currentIndex.value = nextIndex
        const row = msgList.value[nextIndex]
        const res = await getBatchReadByIdApi({
            id: row.id
        })
        addData.value = res.data
    } else {
        // 已是最后一条消息
        ElMessage({ message: '已经是最后一条消息', type: 'info' })
    }
}

// 关闭弹窗时重置索引
const handleClose = () => {
    dialogVisible.value = false
    currentIndex.value = -1
}
// 图表数据
const echartsData = ref([
    { value: 1500, name: '客户A' },
    { value: 1200, name: '客户B' },
    { value: 900, name: '客户C' },
    { value: 800, name: '客户D' },
    { value: 700, name: '客户E' },
    { value: 600, name: '客户F' },
    { value: 500, name: '客户G' },
    { value: 400, name: '客户H' },
    { value: 300, name: '客户I' },
    { value: 250, name: '客户J' },
    { value: 200, name: '客户K' },
    { value: 150, name: '客户L' },
    { value: 100, name: '客户M' },
    { value: 50, name: '客户N' }
])
// 响应式窗口大小
const { width } = useWindowSize();
const getRightWidth = computed(() => {
    if (width.value < 1660) {
        return '840px';
    } else if (width.value < 1880) {
        return '920px';
    }
    return '1080px';
});
const getLeftWidth = computed(() => {
    if (width.value < 1660) {
        return '310px';
    } else if (width.value < 1880) {
        return '420px';
    }
    return '450px';
});
const getWidth = computed(() => {
    if (width.value < 1660) {
        return '1240px';
    } else if (width.value < 1880) {
        return '1425px';
    }
    return '1623px';
});
const getEchartsWidth = computed(() => {
    if (width.value < 1660) {
        return '400px';
    } else if (width.value < 1880) {
        return '450px';
    }
    return '520px';
});

onMounted(async () => {
    // 加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...'
    })
    const res = await checkTokenApi()
    if (!res.success) {
        smartAlert('登录超时，请重新登录', true, 1000)
        localStorage.removeItem('token')
        userMenuStore.clearMenuData()
        router.push('/login')
        loading.close()
        return
    }
    if (msgList.value.length > 0) return
    console.log(msgList.value)
    const msgRes = await getMessageNoticesApi({
        page: 1,
        pageSize: 5,
    })
    msgList.value = msgRes.data.rows
    loading.close()
})

</script>

<style scoped lang="scss">
$default-margin: 15px;
$default-padding: 15px;

.WeclomeViewArea {
    background: #f0f1f3;

    .WeclomeViewAreaTop {
        margin: 0 auto;
        height: 600px;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }

    .WeclomeViewAreaEcharts {
        margin: 0 auto;
        overflow: hidden;
    }

    .bolckDiv {
        padding: $default-padding;
        margin: 10px 0;
        border-radius: 15px;

        .bolckTitle {
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;

            .bolckTitleRight {
                margin-left: auto;
                font-size: 14px;
                color: #1890ff;
                line-height: 14px;
                cursor: pointer;
            }

            p {
                font-weight: 550;
                margin: 0;
            }
        }

        .msgContentDiv {

            ul {
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                justify-content: start;
                flex-direction: column;

                li {
                    margin: 10px;
                    padding: 3px 10px;
                    width: 90%;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-left: 2px solid #6f9af0;
                    overflow: hidden;

                    .msgContent {
                        width: 93%;

                        p:nth-child(1) {
                            font-size: 16px;
                            font-weight: 550;
                            margin: 7px 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #333;

                        }

                        p:nth-child(2) {
                            font-size: 14px;
                            color: #666;
                            margin: 0;
                        }
                    }

                }

                li:hover {
                    background-color: #f0f0f0;
                }

                li:hover p:nth-child(1) {
                    color: #1890ff;
                }
            }

        }

        .missionContentDiv {
            height: 96%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            overflow: hidden;

            .missionContent {
                display: flex;
                align-content: center;
                width: 100%;
                height: 25%;

                .missionContentItemTile {
                    display: flex;
                    width: 15%;
                    align-items: center;
                    font-size: 19px;
                }

                .missionContentItem {
                    width: 25%;
                    height: 100%;
                    margin: 0 10px;
                    background-color: #f2f3f5;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    span:nth-child(1) {
                        font-size: 22px;
                        font-weight: 550;
                        margin-bottom: 26px;
                    }

                    span:nth-child(2) {
                        font-size: 14px;
                        color: #666;
                    }
                }

                .missionContentItem:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .missionContentItem:hover span:nth-child(1) {
                    font-size: 28px;
                    transition: all 0.3s ease;
                }

                .missionContentItem:hover span:nth-child(2) {
                    font-size: 16px;
                    transition: all 0.3s ease;
                }
            }
        }

        .documentDiv {
            ul {
                display: flex;
                padding: 0;
                justify-content: space-around;

                li {
                    display: flex;
                    align-items: center;
                    width: 48%;
                    justify-content: center;
                    background-color: #f2f3f5;
                    height: 45px;
                    border-radius: 5px;
                    cursor: pointer;

                    p {
                        margin-left: 7px;
                    }
                }

                li:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }
            }
        }
    }

    .background {
        background-color: white;
    }

    .iconfont {
        color: #1677ff;
        font-size: 24px;
        margin-right: 5px;
    }
}

.htmlContent {
    height: 450px;
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
</style>