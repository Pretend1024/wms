// hex转rgb
const hexToRgb = (str) => {
    let hexs = "";
    let reg = /^\#?[0-9a-fA-F]{6}$/;
    if (!reg.test(str)) return alert("输入错误的hex");
    str = str.replace("#", "");
    hexs = str.match(/../g);
    for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
    return hexs;
};

// rgb转hex
const rgbToHex = (r, g, b) => {
    let hexs = [r.toString(16), g.toString(16), b.toString(16)];
    for (let i = 0; i < 3; i++) {
        if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
    }
    return "#" + hexs.join("");
};

// 颜色混合 (color1: 主色, color2: 白色/黑色, weight: 混合比例 0-1)
export const mix = (color1, color2, weight) => {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    let r1 = hexToRgb(color1)[0];
    let g1 = hexToRgb(color1)[1];
    let b1 = hexToRgb(color1)[2];
    let r2 = hexToRgb(color2)[0];
    let g2 = hexToRgb(color2)[1];
    let b2 = hexToRgb(color2)[2];
    let r = Math.round(r1 * (1 - weight) + r2 * weight);
    let g = Math.round(g1 * (1 - weight) + g2 * weight);
    let b = Math.round(b1 * (1 - weight) + b2 * weight);
    return rgbToHex(r, g, b);
};