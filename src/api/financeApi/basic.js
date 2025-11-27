import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// ---------------------------------------------------客户账户
// 获取收款账户
export const getAccountPageApi = (data) => {
    return http.post('/finance/basic/collectionAccount/page', data)
}
// 获取收款账户
export const getCollectionAccountListByConditionsApi = createPostRequestWithQuery('/finance/basic/collectionAccount/listByConditions')
// 新增收款账户
export const addAccountApi = (data) => {
    return http.post('/finance/basic/collectionAccount/add', data)
}
// 获取收款方式枚举
export const getPaymentMethodEnumApi = () => {
    return http.post('/finance/basic/collectionAccount/paymentMethodEnum')
}
// 获取账户状态枚举
export const getAccountStatusEnumApi = () => {
    return http.post('/finance/basic/collectionAccount/collectionAccountStatusEnum')
}
// 编辑收款账户
export const updAccountByIdApi = (data) => {
    return http.post('/finance/basic/collectionAccount/updateById', data)
}
// 更新账户状态
export const updAccountStatusApi = createPostRequestWithQuery('/finance/basic/collectionAccount/updateStatus')

// -----------------------------------------------------币种
// 获取币种/finance/basic/currency/page
export const getCurrencyPageApi = (data) => {
    return http.post('/finance/basic/currency/page', data)
}
// 新增币种/finance/basic/currency/add
export const addCurrencyApi = (data) => {
    return http.post('/finance/basic/currency/add', data)
}
// 编辑币种/finance/basic/currency/updateById
export const updCurrencyByIdApi = (data) => {
    return http.post('/finance/basic/currency/updateById', data)
}
// 删除币种/finance/basic/currency/deleteById
export const delCurrencyByIdApi = createPostRequestWithQuery('/finance/basic/currency/deleteById')




