/**
 * 创建一个带查询参数的 POST 请求函数
 * @param {string} baseUrl - 基础 URL
 * @returns {Function} - 返回一个函数，该函数接受一个对象作为查询参数，并返回一个 Promise 对象
 * @example
 * **/
import http from '@/utils/request/request'
export const createPostRequestWithQuery = (baseUrl) => {
  return (queryParams) => {
    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined && value !== null) // 过滤无效值
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    return http.post(url);
  };
};
