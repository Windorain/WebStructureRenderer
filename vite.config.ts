import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getPreviewHttpProxyTarget(): string {
  const portFile = path.join(__dirname, '.wmr-preview-port')
  try {
    if (existsSync(portFile)) {
      const s = readFileSync(portFile, 'utf8').trim()
      const n = Number(s)
      if (Number.isFinite(n) && n > 0 && n <= 65535) {
        return `http://127.0.0.1:${n}`
      }
    }
  } catch {
    /* ignore */
  }
  return 'http://127.0.0.1:8787'
}

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/preview-api': {
        target: getPreviewHttpProxyTarget(),
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@renderData': fileURLToPath(new URL('./data', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
      name: 'WikiMultiStructureRender',
      fileName: 'wiki-multi-structure-render',
      formats: ['iife'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: 'wiki-multi-structure-render.js',
        globals: {
          vue: 'cockpitVue',
        },
      },
    },
  },
})
