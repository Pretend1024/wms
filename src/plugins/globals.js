import { getLabel, getPlaceholder, getButtonText } from '@/utils/i18n/i18nLabels'
import { copyToClipboard } from '@/utils/copyBtn.js'
import { openMainLoading, closeMainLoading, forceCloseMainLoading } from '@/utils/genericMethods.js'

// 注册全局方法
export function setupGlobals(app) {
    app.config.globalProperties.getLabel = getLabel
    app.config.globalProperties.getPlaceholder = getPlaceholder
    app.config.globalProperties.getButtonText = getButtonText
    app.config.globalProperties.copyToClipboard = copyToClipboard
    window.openMainLoading = openMainLoading
    window.closeMainLoading = closeMainLoading
    window.forceCloseMainLoading = forceCloseMainLoading
}