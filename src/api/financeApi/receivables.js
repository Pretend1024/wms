import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// ---------------------------------------------------客户授信
// 获取授信管理
export const getCustomerCreditPageApi = (data) => {
    return http.post('/finance/receivables/customerCredit/page', data)
}
// 添加授信
export const addCustomerCreditApi = (data) => {
    return http.post('/finance/receivables/customerCredit/add', data)
}
// 编辑
export const updCustomerCreditByIdApi = (data) => {
    return http.post('/finance/receivables/customerCredit/updateById', data)
}
// 删除授信
export const delCustomerCreditByIdApi = createPostRequestWithQuery('/finance/receivables/customerCredit/deleteById')
// 授信类型
export const getCustomerCreditTypeEnumApi = () => {
    return http.post('/finance/receivables/customerCredit/customerCreditTypeEnum')
}
// 审批状态
export const getCustomerCreditAuditStatusEnumApi = () => {
    return http.post('/finance/receivables/customerCredit/customerCreditAuditStatusEnum')
}
// 生效状态
export const getCustomerCreditEffectStatusEnumApi = () => {
    return http.post('/finance/receivables/customerCredit/customerCreditEffectiveStatusEnum')
}
// 授信冻结
export const lockCustomerCreditByIdApi = createPostRequestWithQuery('/finance/receivables/customerCredit/takeBack')

// 授权审核
export const approvalCustomerCreditByIdApi = (data) => {
    return http.post('/finance/receivables/customerCredit/approval', data)
}


// ---------------------------------------------------客户钱包
// 获取客户账号
export const getCustomerAccountPageApi = (data) => {
    return http.post('/finance/receivables/customerAccount/page', data)
}
// 新增客户账号
export const addCustomerAccountApi = (data) => {
    return http.post('/finance/receivables/customerAccount/add', data)
}

// ---------------------------------------------------充值管理
// 获取充值管理
export const getCustomerRechargePageApi = (data) => {
    return http.post('/finance/receivables/customerRecharge/page', data)
}
// 新增充值管理
export const addCustomerRechargeApi = (data) => {
    return http.post('/finance/receivables/customerRecharge/add', data)
}
// 编辑充值管理
export const updCustomerRechargeByIdApi = (data) => {
    return http.post('/finance/receivables/customerRecharge/updateById', data)
}
// 删除充值管理
export const delCustomerRechargeByIdApi = createPostRequestWithQuery('/finance/receivables/customerRecharge/deleteById')
// 支付结果枚举
export const getCustomerRechargePlatformStatusEnumApi = () => {
    return http.post('/finance/receivables/customerRecharge/customerRechargePlatformStatusEnum')
}
// 充值状态
export const getCustomerRechargeStatusEnumApi = () => {
    return http.post('/finance/receivables/customerRecharge/customerRechargeStatusEnum')
}
// 审核充值
export const auditCustomerRechargeApi = createPostRequestWithQuery('/finance/receivables/customerRecharge/audit')
// 获取充值凭证
export const getCustomerRechargeCertificateApi = createPostRequestWithQuery('/finance/receivables/customerRecharge/viewCertificate')

// 通过客户和币种获取客户充值
export const getRechargeByCustomerCodeAndCurrencyApi = createPostRequestWithQuery('/finance/receivables/customerRecharge/listByCustomerCodeAndCurrency')


// ---------------------------------------------------应收费用
// 加入账单
export const joinBillApi = (data) => {
    return http.post('/finance/receivables/customerBill/joinBill', data)
}
// 获取费用
export const getFeePageApi = (data) => {
    return http.post('/finance/receivables/receivableFee/page', data)
}
// 添加费用
export const addFeeApi = (data) => {
    return http.post('/finance/receivables/receivableFee/add', data)
}
// 编辑费用
export const updFeeByIdApi = (data) => {
    return http.post('/finance/receivables/receivableFee/updateById', data)
}
// 删除费用
export const delFeeByIdApi = createPostRequestWithQuery('/finance/receivables/receivableFee/deleteById')
// 费用大类型
export const getFeeMainTypeEnumApi = () => {
    return http.post('/finance/receivables/receivableFee/feeMainTypeEnum')
}
// 费用小类型
export const getFeeTypeEnumApi = createPostRequestWithQuery('/finance/receivables/receivableFee/feeSubTypeEnum')

// 费用状态
export const getFeeStatusEnumApi = () => {
    return http.post('/finance/receivables/receivableFee/receivableFeeStatusEnum')
}
// 状态统计
export const getFeeStatusCountApi = (data) => {
    return http.post('/finance/receivables/receivableFee/countGroupByStatus', data)
}
// 金额统计
export const getFeeStatAmountApi = (data) => {
    return http.post('/finance/receivables/receivableFee/statAmount', data)
}
// 创建方式
export const getFeeCreateWayEnumApi = () => {
    return http.post('/finance/receivables/receivableFee/receivableFeeCreateWayEnum')
}


// ---------------------------------------------------应收账单
// 获取账单
export const getBillPageApi = (data) => {
    return http.post('/finance/receivables/customerBill/page', data)
}
// 获取账单详情
export const getBillByIdApi = createPostRequestWithQuery('/finance/receivables/customerBill/getById')
// 添加账单
export const addBillApi = (data) => {
    return http.post('/finance/receivables/customerBill/add', data)
}
// 编辑账单
export const updBillByIdApi = (data) => {
    return http.post('/finance/receivables/customerBill/updateById', data)
}
// 删除账单
export const delBillByIdApi = createPostRequestWithQuery('/finance/receivables/customerBill/deleteById')
// 账单状态枚举
export const getBillStatusEnumApi = () => {
    return http.post('/finance/receivables/customerBill/customerBillStatusEnum')
}
// 确定账单
export const confirmBillByIdApi = createPostRequestWithQuery('/finance/receivables/customerBill/confirmCustomerBill')
// 确定支付
export const payBillByIdApi = createPostRequestWithQuery('/finance/receivables/customerBill/payBill')
// 根据id获取账单
export const getPayBillListByIdApi = (data) => {
    return http.post('/finance/receivables/customerBill/payBillList', data)
}
// 账单分类统计
export const getFeeCategoryApi = createPostRequestWithQuery('/finance/receivables/receivableFee/feeCategory')

// 账单付款记录
export const getBillPaymentPageApi = (data) => {
    return http.post('/finance/receivables/customerPaymentDetail/page', data)
}

// 账单状态统计
export const getBillStatusCountApi = (data) => {
    return http.post('/finance/receivables/customerBill/countGroupByStatus', data)
}
// 账单金额统计
export const getBillStatAmountApi = (data) => {
    return http.post('/finance/receivables/customerBill/statAmount', data)
}

