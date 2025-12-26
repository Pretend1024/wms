import http from '@/utils/request/request'
import { createPostRequestWithQuery } from '@/utils/request/createPostRequestWithQuery'

// 导出
export const exportJobAddApi = (data) => {
    return http.post('/sys/job/exportJob/add', { ...data })
}
// 导入
export const importJobAddApi = (data) => {
    return http.post('/sys/job/importJob/add', { ...data })
}
// 获取导入结果
export const getImportJobByIdApi = createPostRequestWithQuery('/sys/job/importJob/getById') 