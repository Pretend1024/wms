const numberInputDirective = {
    mounted(el, binding) {
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        if (!input) return;

        // 指定保留小数位数，默认 2
        const decimalPlaces = Number(binding.value) || 2;

        let lastValid = input.value || '';

        const onInput = (e) => {
            let value = e.target.value;

            // 移除非数字和小数点字符
            value = value.replace(/[^0-9.]/g, '');

            // 只保留第一个小数点
            const parts = value.split('.');
            const intPart = parts[0];
            const decParts = parts.slice(1);

            let newValue = intPart;
            if (decParts.length > 0) {
                newValue += '.' + decParts.join('').substring(0, decimalPlaces);
            }

            // 允许仅输入小数点
            if (value === '.') {
                newValue = '.';
            }

            // 验证合法性
            const regex = new RegExp(`^\\d*(?:\\.\\d{0,${decimalPlaces}})?$`);
            if (regex.test(newValue)) {
                lastValid = newValue;
            } else {
                newValue = lastValid;
            }

            if (newValue !== e.target.value) {
                setTimeout(() => {
                    e.target.value = newValue;
                    e.target.dispatchEvent(new CompositionEvent('input', { bubbles: true }));
                }, 0);
            }
        };

        input.addEventListener('input', onInput);
        el._numberDirective = onInput;
    },

    beforeUnmount(el) {
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        if (input && el._numberDirective) {
            input.removeEventListener('input', el._numberDirective);
            delete el._numberDirective;
        }
    }
};

export function setupNumberInputDirective(app) {
    app.directive('number', numberInputDirective);
}


const positiveIntegerDirective = {
    mounted(el, binding) {
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        if (!input) return;

        // binding.value: 是否允许输入 0，默认 false
        const allowZero = !!binding.value;

        // lastValid: 记录上一次合法值（合法值：正整数或 0 或空字符串）
        let lastValid = allowZero
            ? (/^\d+$/.test(input.value) ? input.value : '')
            : (/^[1-9]\d*$/.test(input.value) ? input.value : '');

        // 初始同步（如果初始值不合法，则设为空）
        if (input.value !== lastValid) {
            input.value = lastValid;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const onInput = (e) => {
            let value = e.target.value;

            // 移除非数字字符
            value = value.replace(/[^0-9]/g, '');

            // 去除前导零（如果长度>1）
            if (value.length > 1 && value.startsWith('0')) {
                value = value.replace(/^0+/, '');
            }

            // 允许空字符串
            if (value === '') {
                lastValid = '';
                if (e.target.value !== '') {
                    setTimeout(() => {
                        e.target.value = '';
                        e.target.dispatchEvent(new Event('input', { bubbles: true }));
                    }, 0);
                }
                return;
            }

            // 校验合法性
            let isValid;
            if (allowZero) {
                // 允许 0
                isValid = /^\d+$/.test(value);
            } else {
                // 不允许 0，只允许正整数
                isValid = /^[1-9]\d*$/.test(value);
            }

            let newValue = isValid ? value : lastValid;
            if (isValid) lastValid = value;

            if (newValue !== e.target.value) {
                setTimeout(() => {
                    e.target.value = newValue;
                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                }, 0);
            }
        };

        input.addEventListener('input', onInput);
        el._positiveIntegerDirective = onInput;
    },

    beforeUnmount(el) {
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        if (input && el._positiveIntegerDirective) {
            input.removeEventListener('input', el._positiveIntegerDirective);
            delete el._positiveIntegerDirective;
        }
    }
};

/**
 * 注册正整数输入指令（可传参数 allowZero）
 */
export function setupPositiveIntegerDirective(app) {
    app.directive('intNumber', positiveIntegerDirective);
}
