import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// name 增强
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// gzip
import viteCompression from 'vite-plugin-compression'
// 打包分析
import { visualizer } from 'rollup-plugin-visualizer';
// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd())
    const COS_ORIGIN = env.VITE_COS_ORIGIN        // http://cos.1tms.net
    const COS_PROXY_PREFIX = env.VITE_COS_PROXY_PREFIX  // /cos

    return {
        plugins: [
            vue(),
            vueSetupExtend(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'], // 自动导入 vue, router, pinia API
                resolvers: [ElementPlusResolver(), ArcoResolver()],
                dts: false
            }),
            Components({
                resolvers: [
                    // 配置 Element Plus 自动按需引入
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                    ArcoResolver({ sideEffect: true })
                ],
                dts: false
            }),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240, // 大于10kb的文件才压缩
                algorithm: 'gzip',
                ext: '.gz',
            }),
            visualizer({
                open: false,             // 打包完成后自动在浏览器打开报告
                gzipSize: true,         // 显示 gzip 压缩后的大小
                brotliSize: true,       // 显示 brotli 压缩后的大小
                filename: "stats.html"  // 生成报告的文件名
            })
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
            // 开启混淆
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            //分包策略：解决 vendor.js 过大的问题
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            // 将 Element Plus 单独拆包
                            if (id.includes('element-plus')) {
                                return 'element-plus'
                            }
                            // 将 Echarts 单独拆包 (如果项目用了的话)
                            if (id.includes('echarts')) {
                                return 'echarts'
                            }
                            // 其他依赖打入 vendor
                            return 'vendor'
                        }
                    }
                }
            }
        }
    }
})
