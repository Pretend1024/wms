import { createI18n } from 'vue-i18n';

// 读取指定目录下的所有 json 文件并合并
function loadLocales(modules) {
    const messages = {};

    // 遍历所有匹配的文件
    for (const path in modules) {
        const content = modules[path].default; // 获取 JSON 内容

        // 合并策略：直接将所有 JSON 的顶层属性混合在一起
        // 比如 common.json 有 { login: ... }, legacy.json 有 { columns: ... }
        // 最终变成 { login: ..., columns: ... }
        Object.assign(messages, content);
    }
    return messages;
}
// glob 导入 (eager: true 表示同步加载，打包时会直接打进去)
const zhModules = import.meta.glob('../locales/zh/*.json', { eager: true });
const enModules = import.meta.glob('../locales/en/*.json', { eager: true });

// messages 对象
const messages = {
    zh: loadLocales(zhModules),
    en: loadLocales(enModules)
};
// const lang = localStorage.getItem('userMenuList') ? JSON.parse(localStorage.getItem('userMenuList')).lang : 'zh';
const lang = 'zh';
try {
    const localData = localStorage.getItem('userMenuList');
    if (localData) {
        lang = JSON.parse(localData).lang || 'zh';
    }
} catch (e) {
    console.warn('读取语言配置失败，使用默认 zh', e);
}

// 5. 创建实例
const i18n = createI18n({
    legacy: false,
    locale: lang,
    fallbackLocale: 'en', // 缺省回退
    globalInjection: true, // 允许在模板中使用 $t
    messages
});

export default i18n;