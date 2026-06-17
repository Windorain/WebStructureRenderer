import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function wikiRenameIndexHtml(): Plugin {
  return {
    name: 'wiki-rename-index-html',
    closeBundle() {
      const oldPath = path.resolve(__dirname, 'dist-workbench-huiji/index-wiki-workbench.html')
      const newPath = path.resolve(__dirname, 'dist-workbench-huiji/index.html')
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath)
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), wikiRenameIndexHtml()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@renderData': fileURLToPath(new URL('./data', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-workbench-huiji',
    assetsDir: 'bundled',
    cssCodeSplit: false,
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index-wiki-workbench.html'),
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'bundled/StructureWorkbench.js',
        chunkFileNames: 'bundled/StructureWorkbench-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'bundled/StructureWorkbench.css'
          }
          return 'bundled/[name][extname]'
        },
      },
    },
  },
})
