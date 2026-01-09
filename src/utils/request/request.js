import axios from "axios"
import { ElMessage, ElMessageBox } from 'element-plus'
import router from "@/router/index.js"
import useUserMenuStore from '@/store/userMenu';
const userMenuStore = useUserMenuStore()
// 是否显示登录过期提示框
let isLoginExpiredAlertShown = false;
// 是否显示加载提示框
let loadingInstance = null;
let activeRequests = 0;

let http = axios.create({
    baseURL: import.meta.env.VITE_APP_AXIOS_BASEURL,
    timeout: 1000 * 60 * 60,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    }
})


//请求拦截器
http.interceptors.request.use(config => {
    // 排除不需要加载动画的请求
    if (config.headers?.['loading']) {
        showLoading();
    }

    let token = localStorage.getItem('token')
    //获取时间差
    const offset = new Date().getTimezoneOffset();
    const timezone = -(offset / 60);
    config.headers.timeZone = timezone;
    config.headers.language = userMenuStore.lang
    if (token) {
        config.headers.token = token
    } else {
        router.push('/login')
    }
    return config
}, error => {
    hideLoading();
    return Promise.reject(error)
})

http.interceptors.response.use(res => {
    hideLoading();
    if (res.data.code === '301' && !isLoginExpiredAlertShown) {
        isLoginExpiredAlertShown = true;
        ElMessageBox.alert(res.data.msg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
                localStorage.removeItem('token')
                router.push('/login')
                isLoginExpiredAlertShown = false;
            }
        })
        return
    }
    return res.status === 200 ? res.data : { success: false, msg: `HTTP ${res.status}` };
}, err => {
    hideLoading();
    // 网络或服务器错误
    // console.error('HTTP Error:', err.response)
    const errorMsg = err.response?.data?.error || '网络错误'
    return Promise.resolve({ success: false, msg: errorMsg })
}
)

// 显示加载动画
const showLoading = () => {
    if (activeRequests === 0 && !loadingInstance) {
        const targetDom = document.querySelector('.el-main') || document.body;
        loadingInstance = ElLoading.service({
            target: targetDom,
            lock: true,
            text: 'loading...'
        });
    }
    activeRequests++;
}

// 隐藏加载动画
const hideLoading = () => {
    activeRequests--;
    if (activeRequests <= 0) {
        activeRequests = 0;
        if (loadingInstance) {
            loadingInstance.close();
            loadingInstance = null;
        }
    }
}


export default http


