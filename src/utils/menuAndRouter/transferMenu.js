/**
 * 将树形菜单数据转换为特定格式的菜单数据
 * @param {Object|Array} tree - 树形菜单数据=
 * @returns {Object|Array|null} - 转换后的菜单数据
 */
export function transitionMenu(tree) {
    if (!tree) {
        return null;
    }
    if (Array.isArray(tree)) {
        return tree.map(item => transitionMenu(item));
    }
    const { nameCn, nameEn, url, children, id, ...rest } = tree;
    let path = '';
    if (url) {
        path = `/${url.slice(0, -4)}`; // 移除 .vue 扩展名
    }
    const newNode = {
        // ...rest,
        name: nameCn,
        nameEn: nameEn,
        path: path || id,
        // 唯一标识符
        id: id,
        icon: rest.iconCls || 'icon-shu',
    };
    if (children) {
        newNode.children = transitionMenu(children);
    }
    return newNode;
}

// 将树形结构转换为扁平化的路由数组
export function flattenRoutes(tree) {
    const routes = [];
    function traverse(node) {
        routes.push(node);
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    if (Array.isArray(tree)) {
        tree.forEach(traverse);
    } else {
        traverse(tree);
    }
    return routes;
}



