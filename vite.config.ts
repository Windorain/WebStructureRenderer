import http from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import type { Connect, Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEW_PORT_FILE = path.join(__dirname, '.wmr-preview-port')

/**
 * 每次请求读取端口（wiki-mock 可能在 8787–8791 间择端口）。
 * 若仅在加载 vite 配置时读一次，易与 `.wmr-preview-port` 不一致，代理会连错进程并出现
 * 「Not found (preview API only…)」等假 404。
 */
function readPreviewHttpProxyTarget(): string {
  try {
    if (existsSync(PREVIEW_PORT_FILE)) {
      const s = readFileSync(PREVIEW_PORT_FILE, 'utf8').trim()
      const n = Number(s)
      if (Number.isFinite(n) && n > 0 && n <= 65535) {
        return `http://127.0.0.1:${n}`
      }
      console.warn(
        `[preview-wiki-mock-proxy] ${PREVIEW_PORT_FILE} 内容无效 (${JSON.stringify(s)})，将使用默认 8787`,
      )
    } else {
      console.warn(
        `[preview-wiki-mock-proxy] 未找到 ${PREVIEW_PORT_FILE}，将使用默认 8787；请确认已先启动 wiki-mock（npm run dev 或 npm run preview:http）`,
      )
    }
  } catch {
    /* ignore */
  }
  return 'http://127.0.0.1:8787'
}

/** dev 与 vite preview 共用：否则仅 dev 能访问 /preview-api，preview 会触发浏览器 Failed to fetch */
function createWikiMockProxyMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const raw = req.url ?? ''
    if (!raw.startsWith('/preview-api') && !raw.startsWith('/namespace')) {
      return next()
    }
    const target = readPreviewHttpProxyTarget()
    const u = new URL(target)
    const port =
      u.port !== ''
        ? Number(u.port)
        : u.protocol === 'https:'
          ? 443
          : 80
    const headers = { ...req.headers, host: `${u.hostname}:${port}` }
    const proxyReq = http.request(
      {
        hostname: u.hostname,
        port,
        path: raw,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      }
      res.end(`[vite] 无法连接 wiki-mock ${target}: ${err.message}`)
    })
    req.pipe(proxyReq)
  }
}

function previewWikiMockProxy(): Plugin {
  const mw = createWikiMockProxyMiddleware()
  return {
    name: 'preview-wiki-mock-proxy',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(mw)
    },
    configurePreviewServer(server) {
      server.middlewares.use(mw)
    },
  }
}

export default defineConfig({
  plugins: [previewWikiMockProxy(), vue()],
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
