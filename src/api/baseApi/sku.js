import http from '@/utils/request/request'
// ---------------------------------------------------------SKU
// 获取sku仓库信息
export const getSkuSkuListApi = (data) => {
    return http.post('/base/sku/sku/page', { ...data })
}
export const getSkuSkuDataBySkuApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/sku/getBySku?${queryString}`
        : '/base/sku/sku/getBySku';
    return http.post(url);
}
// 获取sku仓库
export const getSkuSkuDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/sku/getById?${queryString}`
        : '/base/sku/sku/getById';

    return http.post(url);
};
// 添加sku仓库
export const addSkuSkuDataApi = (data) => {
    return http.post('/base/sku/sku/add', { ...data }, { headers: { 'loading': true } })
}
// 删除sku仓库
export const delSkuSkuDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/sku/deleteById?${queryString}`
        : '/base/sku/sku/deleteById';

    return http.post(url);
};
// 修改sku仓库
export const updateSkuSkuDataApi = (data) => {
    return http.post('/base/sku/sku/updateById', { ...data }, { headers: { 'loading': true } })
}

// 模糊搜索客户代码
export const getCustomerLikeQueryApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/cust/customer/likeQuery?${queryString}`
        : '/base/cust/customer/likeQuery';

    return http.post(url);
};

// 获取sku状态菜单
export const getSkuStatusEnumListApi = () => {
    return http.post('/base/sku/sku/statusEnum')
}
// 获取客户状态菜单
export const getSkuCusStatusEnumListApi = () => {
    return http.post('/base/sku/sku/cusStatusEnum')
}
// 获取带电类型
export const getSkuElectrifiedEnumListApi = () => {
    return http.post('/base/sku/sku/electrifiedEnum')
}
// 获取危险类型
export const getSkuDangerEnumListApi = () => {
    return http.post('/base/sku/sku/dangerEnum')
}

// 修改sku审核状态
export const updateSkuStatusApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/sku/updateStatus?${queryString}`
        : '/base/sku/sku/updateStatus';

    return http.post(url);
};

// ----------------------------------------------------------SKU映射
// 获取sku映射信息
export const getSkuMappingListApi = (data) => {
    return http.post('/base/sku/skuMapping/page', { ...data })
}
export const getSkuMappingDataByIdApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/skuMapping/getById?${queryString}`
        : '/base/sku/skuMapping/getById';

    return http.post(url);
}
// 添加sku映射
export const addSkuMappingDataApi = (data) => {
    return http.post('/base/sku/skuMapping/add', { ...data }, { headers: { 'loading': true } })
}
// 删除sku映射
export const delSkuMappingDataApi = (queryParams) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const url = queryString
        ? `/base/sku/skuMapping/deleteById?${queryString}`
        : '/base/sku/skuMapping/deleteById';

    return http.post(url);
}
// 修改sku映射
export const updateSkuMappingDataApi = (data) => {
    return http.post('/base/sku/skuMapping/updateById', { ...data }, { headers: { 'loading': true } })
}