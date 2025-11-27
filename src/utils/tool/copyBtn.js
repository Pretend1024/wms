import { ElMessage } from "element-plus";
/**
 * 复制内容到剪贴板
 * @param {string} content - 需要复制的内容
 * @returns {Promise<boolean>} - 复制成功返回true，失败返回false
 */
export const copyToClipboard = async (content) => {
    try {
        // 尝试使用现代浏览器的Clipboard API
        await navigator.clipboard.writeText(String(content));
        ElMessage({
            message: 'Copy Success',
            type: 'success',
        });
        return true;
    } catch (err) {
        // 兼容性处理：使用传统方法
        try {
            // 创建临时文本区域
            const textarea = document.createElement('textarea');
            textarea.value = String(content);
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            // 选中并复制
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            ElMessage({
                message: 'Copy Success',
                type: 'success',
            })
            return true;
        } catch (innerErr) {
            console.error('复制失败:', innerErr);
            return false;
        }
    }
}
