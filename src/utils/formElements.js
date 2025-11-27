import { ElLoading, ElMessage } from 'element-plus';
/**
 * 公共表单提交方法
 * @param {Object} params - 配置对象
 * @param {Object} params.formRef - 表单引用
 * @param {Object} params.data - 提交数据
 * @param {Function} params.addApi - 新增API方法
 * @param {Function} params.updateApi - 更新API方法
 * @param {Function} [params.handleSuccess] - 自定义成功处理器
 * @param {Function} [params.handleError] - 自定义失败处理器
 * @param {Object} [params.loadingOptions] - 加载配置选项
 */
export const commonFormSubmit = async ({
    formRef,
    data,
    addApi,
    updateApi,
    handleSuccess,
    handleError,
    loadingOptions
}) => {
    if (!formRef) return;

    try {
        // 表单验证
        await formRef.validate();

        // 初始化加载效果
        const loadingInstance = ElLoading.service({
            lock: true,
            text: 'Loading',
            // background: 'rgba(0, 0, 0, 0.7)',
            ...loadingOptions,
        });

        try {
            // 根据是否存在ID选择API
            const api = data.id ? updateApi : addApi;
            const res = await api(data);

            if (res.success) {
                // 执行自定义成功处理
                if (typeof handleSuccess === 'function') {
                    await handleSuccess(res);
                } else {
                    // 默认成功处理
                    ElMessage.success(res.msg);
                }
            } else {
                // 执行自定义成功处理
                if (typeof handleError === 'function') {
                    await handleError(res);
                } else {
                    // 默认失败处理
                    ElMessage.error(res.msg || '操作失败');
                }
            }
            return res; // 返回响应结果
        } finally {
            loadingInstance.close();
        }
    } catch (error) {
        // 错误处理
        // if (error?.message !== 'VALIDATE_FAILED') {
        //     ElMessage.error(error.message || '提交失败');
        // }
        throw error; // 抛出错误以便外部处理
    }
};