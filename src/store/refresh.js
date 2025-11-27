import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRefreshStore = defineStore('refresh', () => {
    // SKU
    const shouldRefreshSkuList = ref(false);
    // 员工
    const shouldRefreshEmployeeList = ref(false);
    // 客户
    const shouldRefreshCustomerList = ref(false);
    // 入库单
    const shouldRefreshInOrderList = ref(false);
    // 供应商
    const shouldRefreshSupplierList = ref(false);
    // 物流产品
    const shouldRefreshShipwayList = ref(false);
    // 退件单
    const shouldRefreshReturnOrderList = ref(false);
    // 出库单
    const shouldRefreshOutOrderList = ref(false);
    // 波次
    const shouldRefreshWaveList = ref(false);
    // 增值服务
    const shouldRefreshAddServiceList = ref(false);
    // 工单
    const shouldRefreshWorkOrderList = ref(false);


    // 搜索操作日志条件
    const indexNo = ref('')

    return {
        shouldRefreshSkuList,
        shouldRefreshEmployeeList,
        shouldRefreshCustomerList,
        shouldRefreshInOrderList,
        shouldRefreshSupplierList,
        shouldRefreshShipwayList,
        shouldRefreshReturnOrderList,
        shouldRefreshOutOrderList,
        shouldRefreshWaveList,
        shouldRefreshAddServiceList,
        shouldRefreshWorkOrderList,
        indexNo,
    };
});
