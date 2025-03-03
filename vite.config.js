import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 设置开发服务器端口为8888
  server: {
    port: 8888,
    // 如果8888端口被占用则尝试其他端口
    strictPort: false,
    // 自动打开浏览器，并导航到指定URL
    open: '/index.html#/login',
  },
  // 设置基本公共路径
  base: './',
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 资源引用方式（相对路径）
    assetsDir: 'assets',
    // 确保生成index.html
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      }
    }
  }
})