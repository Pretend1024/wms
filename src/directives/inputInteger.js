export const inputInteger = {
    mounted(el, binding) {
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
        if (!input) return;

        // binding.value: 是否允许输入 0，默认 false
        const allowZero = !!binding.value;

        // lastValid: 记录上一次合法值
        let lastValid = allowZero
            ? (/^\d+$/.test(input.value) ? input.value : '')
            : (/^[1-9]\d*$/.test(input.value) ? input.value : '');

        // 初始同步
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
                isValid = /^\d+$/.test(value);
            } else {
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