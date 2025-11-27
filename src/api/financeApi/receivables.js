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


// ---------------------------------------------------应收费用
// 加入账单
export const joinBillApi = (data) => {
    return http.post('/finance/receivables/customerBill/joinBill', data)
}
// -----入库单应收
// 获取入库单应收/finance/receivables/inOrderFee/page
export const getInOrderFeePageApi = (data) => {
    return http.post('/finance/receivables/inOrderFee/page', data)
}
// 添加入库单应收/finance/receivables/inOrderFee/add
export const addInOrderFeeApi = (data) => {
    return http.post('/finance/receivables/inOrderFee/add', data)
}
// 编辑入库单应收/finance/receivables/inOrderFee/updateById
export const updInOrderFeeByIdApi = (data) => {
    return http.post('/finance/receivables/inOrderFee/updateById', data)
}
// 删除入库单应收/finance/receivables/inOrderFee/deleteById
export const delInOrderFeeByIdApi = createPostRequestWithQuery('/finance/receivables/inOrderFee/deleteById')
// 退出账单/finance/receivables/inOrderFee/exitBill
export const exitInOrderFeeBillApi = createPostRequestWithQuery('/finance/receivables/inOrderFee/exitBill')


// -----出库应收
// 获取出库应收/finance/receivables/outOrderFee/page
export const getOutOrderFeePageApi = (data) => {
    return http.post('/finance/receivables/outOrderFee/page', data)
}
// 添加入库单应收/finance/receivables/outOrderFee/add
export const addOutOrderFeeApi = (data) => {
    return http.post('/finance/receivables/outOrderFee/add', data)
}
// 编辑入库单应收/finance/receivables/outOrderFee/updateById
export const updOutOrderFeeByIdApi = (data) => {
    return http.post('/finance/receivables/outOrderFee/updateById', data)
}
// 删除入库单应收/finance/receivables/outOrderFee/deleteById
export const delOutOrderFeeByIdApi = createPostRequestWithQuery('/finance/receivables/outOrderFee/deleteById')

// -----增值应收
// 获取增值应收/vas/vas/vasOrderFee/page
export const getVasOrderPageApi = (data) => {
    return http.post('/vas/vas/vasOrderFee/page', data)
}
// 添加入库单应收/vas/vas/vasOrderFee/add
export const addVasOrderFeeApi = (data) => {
    return http.post('/vas/vas/vasOrderFee/add', data)
}
// 删除入库单应收/vas/vas/vasOrderFee/deleteById
export const delVasOrderFeeByIdApi = createPostRequestWithQuery('/vas/vas/vasOrderFee/deleteById')