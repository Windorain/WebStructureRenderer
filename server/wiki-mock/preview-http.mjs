/**
 * Mock Wiki 数据服务：`/preview-api`、`/namespace`、静态资源。
 * 场景 JSON 为 `data/scenes/<id>.json` 原文（StructureData 或 World），不拼注册表、不裁剪。
 * `--static dist` 托管构建产物。
 */
import http from 'node:http'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadNamespaceDataFromDisk, runInMemoryAggregate } from './namespaceMemory.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_DATA_SCENES = path.join(REPO_ROOT, 'data', 'scenes')
const DEFAULT_DATA_RESOURCES = path.join(REPO_ROOT, 'data', 'resources')
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
  const ids = new Set()
  for (const d of names) {
    if (d.isFile() && d.name.endsWith('.json')) {
      const id = d.name.slice(0, -'.json'.length)
      if (safeSceneId(id)) ids.add(id)
      continue
    }
    if (d.isDirectory()) {
      const id = d.name
      if (!safeSceneId(id)) continue
      try {
        await fsp.access(path.join(scenesRoot, id, 'document.json'))
        ids.add(id)
      } catch {
        /* ignore */
      }
    }
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}

/** 依次尝试路径，仅 ENOENT 继续；与迁移前 `data/server/scenes/<id>/document.json` 及当前 `data/scenes/<id>.json` 兼容 */
async function readFirstExistingUtf8(paths) {
  let last
  for (const p of paths) {
    try {
      return await fsp.readFile(p, 'utf8')
    } catch (e) {
      last = e
      if (e.code !== 'ENOENT') throw e
    }
  }
  throw last
}

/** 场景文件 UTF-8 原文（合法 JSON） */
async function readSceneFileUtf8(scenesRoot, sceneId) {
  return readFirstExistingUtf8([
    path.join(scenesRoot, `${sceneId}.json`),
    path.join(scenesRoot, sceneId, 'document.json'),
    path.join(DEFAULT_DATA_SCENES, `${sceneId}.json`),
  ])
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

/** 灰机风格 JSON 外层（Mock；与 src/preview/namespaceHttp.ts 成对） */
function jsonHuijiOk(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify({ success: true, data }))
}

function jsonHuijiErr(res, status, code, message) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify({ success: false, error: { code, message } }))
}

function decodeBase64Url(s) {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  if (pad) b64 += '='.repeat(4 - pad)
  return Buffer.from(b64, 'base64').toString('utf8')
}

/** 不依赖 Host；兼容 `GET /path` 与 `GET http://host/path`（部分代理会发绝对 URL） */
function pathnameOnly(req) {
  const raw = req.url || '/'
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      return new URL(raw).pathname
    } catch {
      return '/'
    }
  }
  const q = raw.indexOf('?')
  return q >= 0 ? raw.slice(0, q) : raw
}

/** 折叠 `//`、`/preview-api//resources/` 等，避免正则不命中 */
function normalizePathnameSlashes(p) {
  if (!p || p === '/') return '/'
  return '/' + p.split('/').filter(Boolean).join('/')
}

function fileIsUnderDir(dir, file) {
  const d = path.resolve(dir)
  const f = path.resolve(file)
  if (f === d) return true
  const rel = path.relative(d, f)
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}

async function serveResourcesFile(res, resourcesRoot, relEncoded, sendBody) {
  let relRaw
  try {
    relRaw = decodeURIComponent(relEncoded)
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Bad path encoding')
    return
  }
  const normalized = path.normalize(relRaw).replace(/^(\.\.(\/|\\|$))+/, '')
  if (normalized.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Forbidden')
    return
  }
  const filePath = path.join(resourcesRoot, normalized)
  if (!fileIsUnderDir(resourcesRoot, filePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Forbidden')
    return
  }
  try {
    const body = await fsp.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    if (sendBody) res.end(body)
    else res.end()
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
  }
}

function createServer(scenesRoot, staticRoot, namespaceStore, resourcesRoot) {
  return http.createServer(async (req, res) => {
    const pathname = normalizePathnameSlashes(pathnameOnly(req))

    if (
      req.method === 'OPTIONS' &&
      (pathname.startsWith('/preview-api') || pathname.startsWith('/namespace'))
    ) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || '*',
      })
      res.end()
      return
    }

    const resPrefix = '/preview-api/resources/'
    const altPrefix = '/resources/'
    let resourceRel = null
    if (pathname.startsWith(resPrefix)) resourceRel = pathname.slice(resPrefix.length)
    else if (pathname.startsWith(altPrefix)) resourceRel = pathname.slice(altPrefix.length)

    if (resourceRel != null && resourceRel.length > 0 && (req.method === 'GET' || req.method === 'HEAD')) {
      await serveResourcesFile(res, resourcesRoot, resourceRel, req.method === 'GET')
      return
    }

    if (req.method === 'GET' && pathname === '/namespace/data') {
      try {
        jsonHuijiOk(res, namespaceStore.docs)
      } catch (e) {
        jsonHuijiErr(res, 500, 'INTERNAL', e instanceof Error ? e.message : String(e))
      }
      return
    }

    const mDataTitle = /^\/namespace\/data\/(.+)$/.exec(pathname)
    if (req.method === 'GET' && mDataTitle) {
      const title = decodeURIComponent(mDataTitle[1])
      const doc = namespaceStore.byTitle.get(title)
      if (!doc) {
        jsonHuijiErr(res, 404, 'NOT_FOUND', `no Data namespace document for title: ${title}`)
        return
      }
      jsonHuijiOk(res, doc)
      return
    }

    const mAggr = /^\/namespace\/data_aggr\/(.+)$/.exec(pathname)
    if (req.method === 'GET' && mAggr) {
      const raw = mAggr[1]
      if (!raw) {
        jsonHuijiErr(res, 400, 'BAD_REQUEST', 'empty data_aggr segment')
        return
      }
      try {
        const json = decodeBase64Url(raw)
        const pipeline = JSON.parse(json)
        const result = runInMemoryAggregate(namespaceStore.docs, pipeline)
        jsonHuijiOk(res, result)
      } catch (e) {
        jsonHuijiErr(
          res,
          400,
          'BAD_PIPELINE',
          e instanceof Error ? e.message : String(e),
        )
      }
      return
    }

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

    const mScene = /^\/preview-api\/scenes\/([^/]+)(?:\/bundle)?$/.exec(pathname)
    if (mScene && req.method === 'GET') {
      const id = safeSceneId(decodeURIComponent(mScene[1]))
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Invalid scene id')
        return
      }
      try {
        const body = await readSceneFileUtf8(scenesRoot, id)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(body)
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
const resourcesRoot = process.env.PREVIEW_DATA_RESOURCES
  ? path.resolve(process.env.PREVIEW_DATA_RESOURCES)
  : DEFAULT_DATA_RESOURCES

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
  const namespaceStore = await loadNamespaceDataFromDisk(scenesRoot)
  console.log(`[wiki-mock] namespace Data: ${namespaceStore.docs.length} document(s) in memory`)

  let server
  let boundPort
  for (const port of PORT_CANDIDATES) {
    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
      console.error('[wiki-mock] Invalid PREVIEW_HTTP_PORT')
      process.exit(1)
    }
    server = createServer(scenesRoot, staticRoot, namespaceStore, resourcesRoot)
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

  console.log(`[wiki-mock] scenes root (single .json per id): ${scenesRoot}`)
  console.log(`[wiki-mock] resources root: ${resourcesRoot}`)
  console.log(`[wiki-mock] listening http://127.0.0.1:${boundPort}`)
  if (staticRoot) console.log(`[wiki-mock] static root: ${staticRoot}`)
  console.log(`[wiki-mock] GET /preview-api/scenes`)
  console.log(`[wiki-mock] GET /preview-api/scenes/:id（兼容 :id/bundle）`)
  console.log(`[wiki-mock] GET /preview-api/resources/*`)
  console.log(`[wiki-mock] GET /namespace/data`)
  console.log(`[wiki-mock] GET /namespace/data/:title`)
  console.log(`[wiki-mock] GET /namespace/data_aggr/:base64url_pipeline`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
