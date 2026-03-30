import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
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
