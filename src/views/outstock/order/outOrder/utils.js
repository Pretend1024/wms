import { smartAlert } from '@/utils/genericMethods.js'

/**
 * 通用表格校验函数
 * @param {Object} tableRef 表格Ref对象
 * @param {Array} columns 表格列定义
 * @param {String} tableName 报错时显示的表格名称
 * @param {Object} customValidators 自定义特殊字段的校验逻辑 (可选)
 * @returns {Object} { success: Boolean, data: Array }
 */
export const validateTableHelper = (tableRef, columns, tableName, customValidators = {}) => {
    // 1. 获取表格数据
    const rawData = tableRef.value?.getTableData() || [];
    const validData = [];

    // 2. 提取需要检查的字段列表 (所有在columns里定义的prop)
    const allProps = columns.map(col => col.prop);
    // 3. 提取必填字段列表
    const requiredCols = columns.filter(col => col.required);

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];

        // --- A. 判断是否为空行 ---
        // 规则：只要该行在 columns 定义的任意一个字段中有值，就视为"非空行"
        let hasValue = false;

        // 先检查常规字段
        hasValue = allProps.some(prop => {
            // 如果有自定义校验器（比如 size），使用自定义逻辑检查是否有值
            if (customValidators[prop]) {
                return customValidators[prop](row, 'hasValue');
            }
            // 常规检查
            const val = row[prop];
            if (Array.isArray(val)) return val.length > 0;
            return val !== null && val !== undefined && val !== '';
        });

        // 如果是纯空行，直接跳过，不报错也不提交
        if (!hasValue) continue;

        // --- B. 校验必填项 ---
        // 既然不是空行，那么所有 required: true 的列都必须有值
        for (const col of requiredCols) {
            const prop = col.prop;
            const label = col.label;
            let isValid = true;

            if (customValidators[prop]) {
                // 使用自定义逻辑校验必填 (返回 true/false)
                isValid = customValidators[prop](row, 'validate');
            } else {
                // 常规逻辑校验必填
                const val = row[prop];
                isValid = (val !== null && val !== undefined && val !== '');
                if (Array.isArray(val)) isValid = val.length > 0;
            }

            if (!isValid) {
                smartAlert(`【${tableName}】第 ${i + 1} 行检测到数据，但缺少必填项：${label}`, false);
                return { success: false, data: [] };
            }
        }

        // --- C. 校验通过，加入结果 ---
        validData.push(row);
    }

    return { success: true, data: validData };
};

// 定义特殊字段的校验逻辑 (配置器)
// 参数 mode: 'hasValue' (检查是否有值用于判断空行) | 'validate' (检查是否满足必填)
export const fieldCustomCheck = {
    // 处理 "长/宽/高" (prop: size)
    size: (row, mode) => {
        const hasL = row.length || row.length === 0;
        const hasW = row.width || row.width === 0;
        const hasH = row.height || row.height === 0;
        if (mode === 'hasValue') return hasL || hasW || hasH;
        // 必填模式下，三个都必须有
        return hasL && hasW && hasH;
    },
    // 处理 "SKU/数量" (prop: skus) - 针对物流包裹
    skus: (row, mode) => {
        const hasList = row.skuList && row.skuList.length > 0;
        if (mode === 'hasValue') return hasList;
        // 必填模式下，必须有子SKU且子SKU数据完整 (这里简单判断长度，详细的交给内部逻辑)
        return hasList;
    },
    // 处理 "耗材" (prop: consumablesList)
    consumablesList: (row, mode) => {
        return row.consumablesList && row.consumablesList.length > 0;
    }
};