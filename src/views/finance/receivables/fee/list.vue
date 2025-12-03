<template>
    <div class="viewArea">
        <!-- <div class="app-container"> -->
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="入库费用" name="inbound">
                <InboundList v-if="activeName === 'inbound'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <el-tab-pane label="出库费用" name="outbound">
                <OutboundList v-if="activeName === 'outbound'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <el-tab-pane label="仓租费用" name="storage">
                <StorageList v-if="activeName === 'storage'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <el-tab-pane label="增值费用" name="valueAdded">
                <ValueAddedList v-if="activeName === 'valueAdded'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>
        </el-tabs>
        <!-- </div> -->
    </div>
</template>

<script setup name="应收费用">
import { onMounted, ref } from 'vue';
import InboundList from './inboundFee/list.vue';
import OutboundList from './outboundFee/list.vue';
import StorageList from './storageFee/list.vue';
import ValueAddedList from './valueAddedFee/list.vue';

// 引入所有公共 API
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js';
import {
    getFeeStatusEnumApi,
    getFeeCreateWayEnumApi,
} from '@/api/financeApi/receivables.js';
import { getCurrencyEnumApi } from '@/api/baseApi/index.js'

const activeName = ref('inbound');
const isDataReady = ref(false); // 控制渲染时机

// 定义公共响应式数据
const companyOptions = ref([]);
const warehouseOptions = ref([]);
const initialCustomerOptions = ref([]); // 初始全部客户
const statusOptions = ref([]);
const createWayOptions = ref([]);
const currencyOptions = ref([]);
onMounted(async () => {
    try {
        // 使用 Promise.all 并行请求所有字典，极大提高速度
        const [
            companyRes,
            whRes,
            customerRes,
            statusRes,
            wayRes,
            currRes
        ] = await Promise.all([
            getOrgListCompanyApi(),
            getWhWarehouseApi(),
            getCustomerLikeQueryApi({ keyword: '*', orgId: '' }),
            getFeeStatusEnumApi(),
            getFeeCreateWayEnumApi(),
            getCurrencyEnumApi()
        ]);

        // 1. 处理公司树
        const convertToTree = (items) => items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
        companyOptions.value = convertToTree(companyRes.data);

        // 2. 处理其他扁平数据
        warehouseOptions.value = whRes.data.map(item => ({ code: item.code, name: item.name }));

        initialCustomerOptions.value = customerRes.data.map(item => ({
            value: item.code,
            label: `${item.code}(${item.name})`
        }));

        statusOptions.value = statusRes.data.map(i => ({ label: i.name, value: i.id }));
        createWayOptions.value = wayRes.data.map(i => ({ label: i.name, value: i.id }));
        currencyOptions.value = currRes.data.map(i => ({ label: i.name, value: i.code }));

        isDataReady.value = true; // 数据准备完毕，渲染 Tab
    } catch (error) {
        console.error("基础数据加载失败", error);
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

.app-container {
    height: 100%;
    box-sizing: border-box;
}

/* 穿透样式，使 tab 内容区铺满 */
:deep(.el-tabs__content) {
    padding: 0;
    height: calc(100% - 40px);
    /* 减去头部高度 */
    overflow: auto;
}

:deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
}

:deep(.el-tabs__header) {
    background: #fff;
    margin-bottom: -2px;
    border-radius: 4px 4px 0 0;
    padding: 0 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
}

:deep(.el-tabs__item) {
    font-size: 18px;
    width: 115px;
    padding: 0;
}

:deep(.el-tab-pane) {
    height: 100%;
}
</style>