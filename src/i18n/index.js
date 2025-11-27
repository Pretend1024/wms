import { createI18n } from 'vue-i18n';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';
const lang = localStorage.getItem('userMenuList') ? JSON.parse(localStorage.getItem('userMenuList')).lang : 'zh';
const messages = {
    en,
    zh
};

const i18n = createI18n({
    legacy: false, // 兼容模式
    locale: lang, // 默认语言
    fallbackLocale: 'en', // 回退语言
    messages
});

export default i18n;