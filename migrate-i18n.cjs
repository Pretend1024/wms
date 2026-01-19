const fs = require('fs');
const path = require('path');

// 任务配置
const tasks = [
    {
        file: 'src/utils/i18n/i18nColumns.js',
        extract: [{ varName: 'columnTextMap', targetKey: 'columns' }]
    },
    {
        file: 'src/utils/i18n/i18nLabels.js',
        extract: [
            { varName: 'buttonTextMap', targetKey: 'buttons' },
            { varName: 'labelsMap', targetKey: 'labels' }
        ]
    },
    {
        file: 'src/utils/i18n/i18nTitle.js',
        extract: [{ varName: 'tagMap', targetKey: 'titles' }]
    }
];

// 提取对象字符串的正则函数（保持不变）
function extractObjectString(content, varName) {
    const regex = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${varName}\\s*=\\s*`, 'g');
    const match = regex.exec(content);
    if (!match) return null;
    const startIndex = match.index + match[0].length;
    const braceStart = content.indexOf('{', startIndex);
    if (braceStart === -1) return null;
    let braceCount = 1;
    let endIndex = -1;
    for (let i = braceStart + 1; i < content.length; i++) {
        const char = content[i];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }
    return endIndex !== -1 ? content.substring(braceStart, endIndex + 1) : null;
}

// 核心修改：处理 Placeholder
function splitLocales(sourceObj, zhObj, enObj) {
    for (const key in sourceObj) {
        const val = sourceObj[key];

        if (val && typeof val === 'object') {
            // 判断是否是翻译节点（包含 zh 或 en 属性）
            if ('zh' in val || 'en' in val) {

                // 1. 处理常规文本
                if (val.zh) zhObj[key] = val.zh;
                if (val.en) enObj[key] = val.en;

                // 2. 处理 placeholder (自动添加 _placeholder 后缀)
                if (val.placeholderZh) zhObj[`${key}_placeholder`] = val.placeholderZh;
                if (val.placeholderEn) enObj[`${key}_placeholder`] = val.placeholderEn;

            } else {
                // 递归处理子节点
                zhObj[key] = zhObj[key] || {};
                enObj[key] = enObj[key] || {};
                splitLocales(val, zhObj[key], enObj[key]);
            }
        }
    }
}

// 执行逻辑
const finalZh = {};
const finalEn = {};

tasks.forEach(task => {
    const filePath = path.resolve(__dirname, task.file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ 跳过: ${task.file}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf-8');

    task.extract.forEach(item => {
        try {
            const objStr = extractObjectString(content, item.varName);
            if (objStr) {
                const obj = eval(`(${objStr})`);
                finalZh[item.targetKey] = finalZh[item.targetKey] || {};
                finalEn[item.targetKey] = finalEn[item.targetKey] || {};

                splitLocales(obj, finalZh[item.targetKey], finalEn[item.targetKey]);
                console.log(`✅ 成功提取并处理 Placeholder: ${item.varName}`);
            }
        } catch (e) {
            console.error(`❌ 解析错: ${e.message}`);
        }
    });
});

const outputDir = path.resolve(__dirname, 'src/locales');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'zh-migrated.json'), JSON.stringify(finalZh, null, 2));
fs.writeFileSync(path.join(outputDir, 'en-migrated.json'), JSON.stringify(finalEn, null, 2));

console.log('\n🎉 迁移完成！Placeholder 已自动转换为 key_placeholder 格式。');