import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 工作台 SPA 构建：产物目录 dist-workbench/（已 gitignore）。
 * `bundled/` 内为 Vite Rollup 输出的 JS/CSS 哈希文件，与源码 `src/render/assets`、场景导出 ZIP 无关。
 * 入口构建后为 dist-workbench/index.html（由插件自 index-workbench.html 重命名）。
 */
function workbenchRenameIndexHtml(): Plugin {
  return {
    name: 'workbench-rename-index-html',
    closeBundle() {
      const oldPath = path.resolve(__dirname, 'dist-workbench/index-workbench.html')
      const newPath = path.resolve(__dirname, 'dist-workbench/index.html')
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath)
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), workbenchRenameIndexHtml()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@renderData': fileURLToPath(new URL('./data', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-workbench',
    /** 避免与业务「资源 / 导出素材」语义混淆，不用默认名 `assets` */
    assetsDir: 'bundled',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index-workbench.html'),
    },
  },
})
