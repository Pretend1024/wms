import { ElMessageBox } from 'element-plus'
import { getButtonText } from './i18n/i18nLabels';

/**
 * 消息提示框
 * @param {string} content - 显示的内容
 * @param {boolean} success - 消息类型
 * @param {number} time - 延迟时间
 */
export const smartAlert = (content, success, time) => {
    const baseConfig = {
        title: getButtonText('Prompt'),
        customClass: 'smart-message-box'
    }

    if (success) {
        // 成功类型提示
        ElMessageBox({
            ...baseConfig,
            message: content,
            showConfirmButton: false,
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,

        })

        // 5秒后自动关闭
        setTimeout(() => {
            ElMessageBox.close(false)
        }, time ? time : 5000)
    } else {
        // 需确认的提示
        ElMessageBox({
            ...baseConfig,
            message: content,
            confirmButtonText: getButtonText('GotIt'),
            showCancelButton: false,
            closeOnClickModal: false,
            showClose: false,
        })
    }
}


/**
 * 去除对象中所有字符串属性值的首尾空白字符
 * @param {Object} obj - 要处理的对象
 * @returns {Object} - 返回一个新对象，其字符串属性值的首尾空白字符已被去除
 */
export const trimObjectStrings = (obj) => {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            newObj[key] = value.trim();
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}