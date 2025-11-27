/**
 * 将传入的 URL 中以 'https://cos.1tms.net/temp' 或 'http://cos.1tms.net/temp' 开头的部分替换为 '/cos'。
 * 此函数常用于将临时文件的完整 COS 地址转换为本地下载临时文件的相对路径。
 * @param {string} url - 需要进行替换操作的 URL 字符串。
 * @returns {string} - 替换后的新 URL 字符串。
 */
export function toDownloadTempPath(url) {
    if (typeof url !== 'string') {
        return url;
    }
    const ORIGIN = import.meta.env.VITE_COS_ORIGIN         // 如 "http://cos.1tms.net"
    const PREFIX = import.meta.env.VITE_COS_PROXY_PREFIX  // 如 "/cos"
    return url.replace(
        // 只替换掉 “协议+域名” 部分，不管后面子路径是什么
        new RegExp(`^${ORIGIN}`),
        PREFIX
    )
}