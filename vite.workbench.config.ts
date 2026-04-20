import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 计划约定产物为 dist-workbench/index.html；入口文件名仍为 index-workbench.html 以免与根 index.html 冲突。 */
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
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index-workbench.html'),
    },
  },
})
