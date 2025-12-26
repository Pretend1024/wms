import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 文件上传
export const uploadApi = (file, queryParams = {}) => {
    const formData = new FormData();
    formData.append('file', file); // 添加文件到formData

    // 处理query参数
    const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');

    const url = queryString
        ? `/base/common/upload/upload?${queryString}`
        : '/base/common/upload/upload';

    return http.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 覆盖默认JSON格式
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
export const getTemplateApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/basic/template/listTemplate?${queryString}`
        : '/base/basic/template/listTemplate';

    return http.post(url);
}

// 获取操作日志
export const getOpLogApi = createPostRequestWithQuery('/sys/log/opLog/listByObjId')
// 获取操作日志
export const getOpLogByDataApi = (data) => {
    return http.post('/inventory/inventory/inventory/listLog', { ...data })
}

