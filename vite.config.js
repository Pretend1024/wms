import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// name 增强
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd())
    const COS_ORIGIN = env.VITE_COS_ORIGIN        // http://cos.1tms.net
    const COS_PROXY_PREFIX = env.VITE_COS_PROXY_PREFIX  // /cos

    return {
        plugins: [
            vue(),
            vueSetupExtend(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [ElementPlusResolver()],
                dts: false
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: false
            }),
        ],
        resolve: {
            alias: {
                '@': '/src'
            }
        },
        server: {
            host: '0.0.0.0',
            port: 8080,
            open: true,
            // 配置下载临时文件的代理
            proxy: {
                [COS_PROXY_PREFIX]: {
                    target: COS_ORIGIN,
                    changeOrigin: true,
                    rewrite: path => path.replace(
                        new RegExp(`^${COS_PROXY_PREFIX}`),
                        ''
                    )
                }
            }
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
    }
})
