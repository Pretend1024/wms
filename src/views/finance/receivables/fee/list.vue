<template>
    <div class="viewArea">
        <el-tabs v-model="activeName" class="tabs">
            <!-- 全部标签 -->
            <el-tab-pane :label="t('finance_receivables_fee_list.all')" name="all">
                <AllList v-show="activeName === 'all'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <!-- 入库费用标签 -->
            <el-tab-pane :label="t('finance_receivables_fee_list.inboundFee')" name="inbound">
                <InboundList v-show="activeName === 'inbound'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <!-- 出库费用标签 -->
            <el-tab-pane :label="t('finance_receivables_fee_list.outboundFee')" name="outbound">
                <OutboundList v-show="activeName === 'outbound'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <!-- 仓租费用标签 -->
            <el-tab-pane :label="t('finance_receivables_fee_list.storageRentFee')" name="storage">
                <StorageList v-show="activeName === 'storage'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>

            <!-- 增值费用标签 -->
            <el-tab-pane :label="t('finance_receivables_fee_list.valueAddedFee')" name="valueAdded">
                <ValueAddedList v-show="activeName === 'valueAdded'" :companyOptions="companyOptions"
                    :warehouseOptions="warehouseOptions" :initialCustomerOptions="initialCustomerOptions"
                    :statusOptions="statusOptions" :createWayOptions="createWayOptions"
                    :currencyOptions="currencyOptions" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup name="应收费用">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'; // 1. 引入I18n核心方法

// 引入组件
import AllList from './allFee/list.vue';
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
import { getCurrencyListApi } from '@/api/baseApi/index.js'

// 2. 初始化I18n，指定全局作用域（关键解决t is not a function）
const { t } = useI18n({
    useScope: 'global' // 强制使用全局I18n实例
});

// 响应式数据
const activeName = ref('all'); // 默认显示全部
const isDataReady = ref(false);

// 定义公共响应式数据
const companyOptions = ref([]);
const warehouseOptions = ref([]);
const initialCustomerOptions = ref([]);
const statusOptions = ref([]);
const createWayOptions = ref([]);
const currencyOptions = ref([]);

onMounted(async () => {
    try {
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
            getCurrencyListApi()
        ]);

        const convertToTree = (items) => items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
        companyOptions.value = convertToTree(companyRes.data);

        warehouseOptions.value = whRes.data.map(item => ({ code: item.code, name: item.name }));

        initialCustomerOptions.value = customerRes.data.map(item => ({
            value: item.code,
            label: `${item.code}(${item.name})`
        }));

        statusOptions.value = statusRes.data.map(i => ({ label: i.name, value: i.id }));
        createWayOptions.value = wayRes.data.map(i => ({ label: i.name, value: i.id }));
        currencyOptions.value = currRes.data.map(i => ({ label: i.currencyName, value: i.currency }));

        isDataReady.value = true;
    } catch (error) {
        console.error("基础数据加载失败", error);
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

/* 穿透样式，使 tab 内容区铺满 */
:deep(.el-tabs__content) {
    padding: 0;
    height: calc(100% - 40px);
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
    padding: 0 13px;
}

:deep(.el-tab-pane) {
    height: 100%;
}
</style>