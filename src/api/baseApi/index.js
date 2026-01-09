import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 文件上传
export const uploadApi = (file, queryParams = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    return http.post('/base/common/upload/upload', formData, {
        params: queryParams,
        headers: {
            'Content-Type': 'multipart/form-data',
            'loading': true
        }
    });
};
// 获取处理类型
export const getImportHandlerWayEnumApi = () => {
    return http.post('/base/common/enums/importHandlerWayEnum')
}

// 获取汇率币种
export const getCurrencyEnumApi = () => {
    return http.post('/base/common/enums/currencyEnum')
}
// 获取币种
export const getCurrencyListApi = () => {
    return http.post('/finance/basic/currency/listCurrency')
}

// 格式
export const getTemplateApi = createPostRequestWithQuery('/base/basic/template/listTemplate')

// 获取操作日志
export const getOpLogApi = createPostRequestWithQuery('/sys/log/opLog/listByObjId')
// 获取操作日志
export const getOpLogByDataApi = (data) => {
    return http.post('/inventory/inventory/inventory/listLog', { ...data })
}

