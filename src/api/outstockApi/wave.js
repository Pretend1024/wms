import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 拦截管理列表
export const outstockOrderHoldupListApi = (data) => {
    return http.post('/outstock/order/outOrderHoldup/page', data)
}
// 拦截失败
export const outstockOrderHoldupFailApi = createPostRequestWithQuery('/outstock/order/outOrderHoldup/failHoldUp')


// 获取波次列表/outstock/wave/outWave/page
export const getOutstockWaveListApi = (data) => {
    return http.post('/outstock/wave/outWave/page', data)
}

// 新增波次/outstock/wave/outWave/add
export const addOutstockWaveApi = (data) => {
    return http.post('/outstock/wave/outWave/add', data)
}
// 波次记录/outstock/wave/outWaveTask/page
export const getOutstockWaveRecordApi = (data) => {
    return http.post('/outstock/wave/outWaveTask/page', data)
}

// 波次状态枚举/outstock/wave/outWave/outWaveStatusEnum
export const getOutstockWaveStatusEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWaveStatusEnum')
}
// 波次类型枚举/outstock/wave/outWave/outWaveTypeEnum
export const getOutstockWaveTypeEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWaveTypeEnum')
}

// 新增波次任务/outstock/wave/outWaveTask/add
export const addOutstockWaveTaskApi = (data) => {
    return http.post('/outstock/wave/outWaveTask/add', data)
}
// 波次任务详情/outstock/wave/outWaveTask/getById
export const getOutstockWaveTaskByIdApi = createPostRequestWithQuery('/outstock/wave/outWaveTask/getById')

// 打印拣货单/outstock/wave/outWave/printWavePick
export const printWavePickApi = (data) => {
    return http.post('/outstock/wave/outWave/printWavePick', data)
}
// 打印类型/outstock/wave/outWave/outWavePrintFormatEnum
export const getOutstockWavePrintFormatEnumApi = () => {
    return http.post('/outstock/wave/outWave/outWavePrintFormatEnum')
}
// 手动开启波次/outstock/wave/outWaveTask/startAction
export const startActionApi = (id) => {
    return http.post(`/outstock/wave/outWaveTask/startAction/${id}`, {});
}
// 分配拣货人/outstock/wave/outWave/allocatePickingUser
export const allocatePickingUserApi = (body, query) => {
    return http.post(`/outstock/wave/outWave/allocatePickingUser`, body, { params: query });
}
// 取消分配/outstock/wave/outWave/cancelAllocatePickingUser
export const cancelAllocatePickingUserApi = (data) => {
    return http.post(`/outstock/wave/outWave/cancelAllocatePickingUser`, data);
}
// 状态数量/outstock/wave/outWave/countGroupByStatus
export const getOutstockWaveStatusCountApi = (data) => {
    return http.post('/outstock/wave/outWave/countGroupByStatus', data)
}

