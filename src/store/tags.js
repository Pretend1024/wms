import { defineStore } from "pinia";

export const tagsStore = defineStore('tagsStore', () => {
    const tagsStore = ref([])
    const tagsStoreAdd = (add) => {
        tagsStore.value.push(add)
    }
    const removeKeepAliveName = (path) => {
        // 移除缓存逻辑，这里简单示例，可按需修改
        const index = tagsStore.value.findIndex(tag => tag.path === path);
        if (index !== -1) {
            tagsStore.value[index].keepAlive = false;
        }
    }
    const addKeepAliveName = (path) => {
        // 添加缓存逻辑，这里简单示例，可按需修改
        const index = tagsStore.value.findIndex(tag => tag.path === path);
        if (index !== -1) {
            tagsStore.value[index].keepAlive = true;
        }
    }
    // 清空数据
    const clearTagsStore = () => {
        tagsStore.value = []
    }
    return {
        tagsStore,
        tagsStoreAdd,
        removeKeepAliveName,
        addKeepAliveName,
        clearTagsStore
    }
}, {
    // 开启持久数据缓存
    persist: {
        key: 'tagsStore',
        storage: localStorage,
        paths: ['tagsStore']
    }
})

export default tagsStore