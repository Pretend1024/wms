import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 拦截管理列表
export const outstockOrderHoldupListApi = (data) => {
    return http.post('/outstock/order/outOrderHoldup/page', data)
}
// 拦截失败
export const outstockOrderHoldupFailApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/failHoldUp')

// 获取波次列表
export const getOutstockWaveListApi = (data) => {
    return http.post('/outstock/wave/outWave/page', data)
}

// 新增波次
export const addOutstockWaveApi = (data) => {
    return http.post('/outstock/wave/outWave/add', data, { headers: { 'loading': true } })
}
// 波次记录
export const getOutstockWaveRecordApi = (data) => {
    return http.post('/outstock/wave/outWaveTask/page', data)
}

// 波次状态枚举
export const getOutstockWaveStatusEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWaveStatusEnum')
}
// 波次类型枚举
export const getOutstockWaveTypeEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWaveTypeEnum')
}
// 波次分配状态枚举
export const getOutstockWaveAllocateStatusEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWaveAllocateStatusEnum')
}

// 新增波次任务
export const addOutstockWaveTaskApi = (data) => {
    return http.post('/outstock/wave/outWaveTask/add', data, { headers: { 'loading': true } })
}
// 波次任务详情
export const getOutstockWaveTaskByIdApi = createPostRequestWithQuery('/outstock/wave/outWaveTask/getById')

// 打印拣货单
export const printWavePickApi = (data) => {
    return http.post('/outstock/wave/outWave/printWavePick', data)
}
// 打印类型
export const getOutstockWavePrintFormatEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWavePrintFormatEnum')
}
// 手动开启波次
export const startActionApi = (id) => {
    return http.post(`/outstock/wave/outWaveTask/startAction/${id}`, {}, { headers: { 'loading': true } });
}
// 获取波次任务状态枚举
export const getOutstockWaveTaskStatusEnumApi = () => {
    return http.post(`/outstock/wave/outWaveTask/taskStatusEnum`, {});
}
// 分配拣货人
export const allocatePickingUserApi = (body, query) => {
    return http.post(`/outstock/wave/outWave/allocatePickingUser`, body, { params: query, headers: { 'loading': true } });
}
// 取消分配
export const cancelAllocatePickingUserApi = (data) => {
    return http.post(`/outstock/wave/outWave/cancelAllocatePickingUser`, data, { headers: { 'loading': true } });
}
// 状态数量
export const getOutstockWaveStatusCountApi = (data) => {
    return http.post('/outstock/wave/outWave/countGroupByStatus', data)
}