import { ElMessageBox, ElMessage } from 'element-plus'
import { getButtonText } from './i18n/i18nLabels';

/**
 * 消息提示框
 * @param {string} content - 显示的内容
 * @param {boolean} success - 消息类型
 * @param {number} [time] - 延迟时间 (可选)
 * @param {boolean} [isHtml=false] - 是否开启HTML解析并自动处理换行
 */
export const smartAlert = (content, success, time, isHtml = false) => {
    // 预处理内容，如果开启HTML且content存在，则替换换行符
    let messageContent = (isHtml && content)
        ? content.replace(/\n/g, '<br/>')
        : content;

    const baseConfig = {
        title: getButtonText('Prompt'),
        customClass: 'smart-message-box',
        dangerouslyUseHTMLString: isHtml
    }

    if (success) {
        // 成功类型提示
        ElMessageBox({
            ...baseConfig,
            message: messageContent,
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
        let extraConfig = {};
        const stackSplitKey = "栈消息：";

        // 新功能：检查是否包含“栈消息:”，进行内容分割与折叠处理
        if (content && content.includes(stackSplitKey)) {
            const splitIndex = content.indexOf(stackSplitKey);
            const mainMsg = content.substring(0, splitIndex); // 截取前半部分
            const stackMsg = content.substring(splitIndex);   // 截取后半部分（包含“栈消息:”）

            // 处理前半部分显示的换行逻辑（保持原有逻辑）
            const displayMainMsg = isHtml ? mainMsg.replace(/\n/g, '<br/>') : mainMsg;

            // 构建带有折叠功能的HTML结构
            // 使用 <details> 和 <summary> 实现原生折叠
            messageContent = `
                <div>${displayMainMsg}</div>
                <details style="margin-top: 8px; border-top: 1px dashed #ccc; padding-top: 8px;">
                    <summary style="cursor: pointer; color: #409eff; outline: none; user-select: none;">
                        ${getButtonText('viewDetail')}
                    </summary>
                    <div style="
                        margin-top: 5px; 
                        padding: 8px; 
                        background-color: #f5f7fa; 
                        border-radius: 4px; 
                        color: #909399; 
                        font-size: 12px; 
                        max-height: 200px; 
                        overflow-y: auto; 
                        white-space: pre-wrap; 
                        word-break: break-all;
                    ">
                        ${stackMsg}
                    </div>
                </details>
            `;

            // 强制开启HTML解析以支持 <details> 标签
            extraConfig.dangerouslyUseHTMLString = true;
            // 开启取消按钮，作为“复制并关闭”按钮使用
            extraConfig.showCancelButton = true;
            extraConfig.cancelButtonText = getButtonText('copyAndClose'); // 按钮文本
            extraConfig.cancelButtonClass = 'el-button--primary is-plain'; // 可选：设置样式区别于默认取消
        }

        ElMessageBox({
            ...baseConfig,
            ...extraConfig, // 合并特殊配置
            message: messageContent,
            confirmButtonText: getButtonText('close'),
            // showCancelButton: false, // 移除此行，因为extraConfig可能会覆盖它
            // 如果没有栈消息，默认还是 false，通过合并逻辑控制
            showCancelButton: extraConfig.showCancelButton || false,
            closeOnClickModal: false,
            showClose: false,
        }).then(() => {
            // 点击“GotIt”确认按钮，不做额外操作
        }).catch((action) => {
            // 捕获“复制并关闭”按钮点击事件 (action === 'cancel')
            if (action === 'cancel' && extraConfig.showCancelButton) {
                // 执行复制逻辑
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(content).then(() => {
                        ElMessage.success('详细信息已复制到剪贴板');
                    }).catch(err => {
                        console.error('复制失败:', err);
                        ElMessage.warning('复制失败，请手动复制');
                    });
                }
            }
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