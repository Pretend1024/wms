import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 获取轨迹
export const getOutstockOrderTraceListApi = (data) => {
    return http.post('/outstock/trace/outTrack/page', data)
}
// 优先抓取
export const outstockOrderTracePrioritizeFetchApi = createPostRequestWithQuery('/outstock/trace/outTrack/prioritizeFetch')
// 获取轨迹状态
export const getOutstockOrderTraceStatusApi = (data) => {
    return http.post('/outstock/trace/outTrack/countGroupByStatus', data)
}

// 轨迹明细添加
export const addOutstockOrderTraceApi = (data) => {
    return http.post('/outstock/trace/outTrace/add', data)
}
// 轨迹明细删除
export const deleteOutstockOrderTraceApi = (data) => {
    return http.post('/outstock/trace/outTrace/delete', data)
}
// 根据id删除明细
export const deleteOutstockOrderTraceByIdApi = createPostRequestWithQuery('/outstock/trace/outTrace/deleteById')
// 查询轨迹明细
export const getOutstockOrderTraceDetailListApi = createPostRequestWithQuery('/outstock/trace/outTrace/listByTrackId')