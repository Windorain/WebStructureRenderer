/**
 * Mock Wiki 数据服务：仅实现与渲染器约定的 /preview-api 契约；不依赖 src/。
 * 设 PREVIEW_BUNDLE_NO_SLICE=1 可关闭注册表裁剪。
 * 可选：--static dist 托管构建产物。
 */
import http from 'node:http'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sliceWikiRenderBundleForHttp } from './bundleSliceServer.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_DATA_SCENES = path.join(REPO_ROOT, 'data', 'server', 'scenes')
const PORT_FILE = path.join(REPO_ROOT, '.wmr-preview-port')

const PORT_CANDIDATES = process.env.PREVIEW_HTTP_PORT
  ? [Number(process.env.PREVIEW_HTTP_PORT)]
  : [8787, 8788, 8789, 8790, 8791]

function parseArgs(argv) {
  let staticRoot = null
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--static' && argv[i + 1]) {
      staticRoot = path.resolve(REPO_ROOT, argv[++i])
    }
  }
  return { staticRoot }
}

function safeSceneId(id) {
  if (typeof id !== 'string' || id.length === 0 || id.length > 200) return null
  if (!/^[a-zA-Z0-9._-]+$/.test(id)) return null
  return id
}

async function listSceneIds(scenesRoot) {
  let names
  try {
    names = await fsp.readdir(scenesRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const ids = []
  for (const d of names) {
    if (!d.isDirectory()) continue
    const id = d.name
    if (!safeSceneId(id)) continue
    const base = path.join(scenesRoot, id)
    const need = ['document.json', 'block_registry.json', 'material_registry.json', 'model_registry.json']
    let ok = true
    for (const f of need) {
      try {
        await fsp.access(path.join(base, f))
      } catch {
        ok = false
        break
      }
    }
    if (ok) ids.push(id)
  }
  return ids.sort((a, b) => a.localeCompare(b))
}

async function readBundleJson(scenesRoot, sceneId) {
  const base = path.join(scenesRoot, sceneId)
  const read = async (name) => {
    const raw = await fsp.readFile(path.join(base, name), 'utf8')
    return JSON.parse(raw)
  }
  const document = await read('document.json')
  const blockRegistry = await read('block_registry.json')
  const materialRegistry = await read('material_registry.json')
  const modelRegistry = await read('model_registry.json')
  return { document, blockRegistry, materialRegistry, modelRegistry }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

async function tryStaticFile(staticRoot, urlPath, res) {
  if (!staticRoot) return false
  const clean = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const filePath = path.join(staticRoot, clean === '/' ? 'index.html' : clean)
  if (!filePath.startsWith(staticRoot)) {
    res.writeHead(403)
    res.end('Forbidden')
    return true
  }
  try {
    const st = await fsp.stat(filePath)
    if (st.isDirectory()) {
      const idx = path.join(filePath, 'index.html')
      try {
        const html = await fsp.readFile(idx, 'utf8')
        res.writeHead(200, { 'Content-Type': MIME['.html'] })
        res.end(html)
        return true
      } catch {
        return false
      }
    }
    const ext = path.extname(filePath).toLowerCase()
    const body = await fsp.readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(body)
    return true
  } catch {
    return false
  }
}

function createServer(scenesRoot, staticRoot) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const pathname = url.pathname

    if (pathname === '/preview-api/scenes' && req.method === 'GET') {
      try {
        const ids = await listSceneIds(scenesRoot)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(ids))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end(e instanceof Error ? e.message : String(e))
      }
      return
    }

    const m = /^\/preview-api\/scenes\/([^/]+)\/bundle$/.exec(pathname)
    if (m && req.method === 'GET') {
      const id = safeSceneId(decodeURIComponent(m[1]))
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Invalid scene id')
        return
      }
      try {
        let bundle = await readBundleJson(scenesRoot, id)
        if (!process.env.PREVIEW_BUNDLE_NO_SLICE) {
          bundle = sliceWikiRenderBundleForHttp(bundle)
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(bundle))
      } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end(e instanceof Error ? e.message : String(e))
      }
      return
    }

    if (staticRoot) {
      if (await tryStaticFile(staticRoot, pathname, res)) return
      const indexHtml = path.join(staticRoot, 'index.html')
      try {
        const html = await fsp.readFile(indexHtml, 'utf8')
        res.writeHead(200, { 'Content-Type': MIME['.html'] })
        res.end(html)
      } catch {
        res.writeHead(404)
        res.end('Not found')
      }
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found (preview API only; use --static dist for SPA)')
  })
}

const { staticRoot } = parseArgs(process.argv)
const scenesRoot = process.env.PREVIEW_DATA_SCENES
  ? path.resolve(process.env.PREVIEW_DATA_SCENES)
  : DEFAULT_DATA_SCENES

function writePortFile(port) {
  try {
    fs.writeFileSync(PORT_FILE, String(port), 'utf8')
  } catch (e) {
    console.warn('[wiki-mock] could not write .wmr-preview-port:', e instanceof Error ? e.message : e)
  }
}

function removePortFile() {
  try {
    fs.unlinkSync(PORT_FILE)
  } catch {
    /* ignore */
  }
}

function listenServer(server, port, host) {
  return new Promise((resolve, reject) => {
    const onError = (e) => {
      cleanup()
      if (e && e.code === 'EADDRINUSE') resolve({ ok: false })
      else reject(e)
    }
    const onListen = () => {
      cleanup()
      resolve({ ok: true })
    }
    function cleanup() {
      server.removeListener('error', onError)
      server.removeListener('listening', onListen)
    }
    server.once('error', onError)
    server.once('listening', onListen)
    server.listen(port, host)
  })
}

async function main() {
  let server
  let boundPort
  for (const port of PORT_CANDIDATES) {
    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
      console.error('[wiki-mock] Invalid PREVIEW_HTTP_PORT')
      process.exit(1)
    }
    server = createServer(scenesRoot, staticRoot)
    const r = await listenServer(server, port, '127.0.0.1')
    if (r.ok) {
      boundPort = port
      break
    }
    server.close()
  }
  if (boundPort === undefined) {
    console.error('[wiki-mock] No free port in candidate range (8787–8791). Set PREVIEW_HTTP_PORT or free a port.')
    process.exit(1)
  }

  writePortFile(boundPort)
  const shutdown = () => {
    removePortFile()
    try {
      server.close()
    } catch {
      /* ignore */
    }
  }
  process.once('SIGINT', () => {
    shutdown()
    process.exit(0)
  })
  process.once('SIGTERM', () => {
    shutdown()
    process.exit(0)
  })

  console.log(`[wiki-mock] scenes root: ${scenesRoot}`)
  console.log(`[wiki-mock] listening http://127.0.0.1:${boundPort}`)
  if (staticRoot) console.log(`[wiki-mock] static root: ${staticRoot}`)
  console.log(`[wiki-mock] GET /preview-api/scenes`)
  console.log(`[wiki-mock] GET /preview-api/scenes/:id/bundle`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
