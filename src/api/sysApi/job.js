import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 导出任务提交
export const exportJobAddApi = (data) => {
    return http.post('/sys/job/exportJob/add', { ...data }, { headers: { 'loading': true } })
}
// 导入任务提交
export const importJobAddApi = (data) => {
    return http.post('/sys/job/importJob/add', { ...data }, { headers: { 'loading': true } })
}
// 获取导入结果
export const getImportJobByIdApi = createPostRequestWithQuery('/sys/job/importJob/getById')