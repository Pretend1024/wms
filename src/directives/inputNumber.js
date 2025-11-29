export const inputNumber = {
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
                // 异步更新以确保视图同步
                setTimeout(() => {
                    e.target.value = newValue;
                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                }, 0);
            }
        };

        input.addEventListener('input', onInput);
        // 保存引用以便销毁
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