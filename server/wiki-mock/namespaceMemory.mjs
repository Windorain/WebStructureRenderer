/**
 * Data 命名空间内存存储：启动时从 scenesRoot 扫描合法场景；聚合语义参考 MongoDB 常见阶段（无真实 Mongo）。
 */
import fsp from 'node:fs/promises'
import path from 'node:path'

function safeSceneId(id) {
  if (typeof id !== 'string' || id.length === 0 || id.length > 200) return null
  if (!/^[a-zA-Z0-9._-]+$/.test(id)) return null
  return id
}

async function listValidSceneIds(scenesRoot) {
  let names
  try {
    names = await fsp.readdir(scenesRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const ids = []
  for (const d of names) {
    if (!d.isFile() || !d.name.endsWith('.json')) continue
    const id = d.name.slice(0, -'.json'.length)
    if (!safeSceneId(id)) continue
    ids.push(id)
  }
  return ids.sort((a, b) => a.localeCompare(b))
}

/**
 * @returns {Promise<{ docs: object[], byTitle: Map<string, object> }>}
 */
export async function loadNamespaceDataFromDisk(scenesRoot) {
  const ids = await listValidSceneIds(scenesRoot)
  const docs = []
  const byTitle = new Map()
  for (const sceneId of ids) {
    let updatedAt = null
    try {
      const st = await fsp.stat(path.join(scenesRoot, `${sceneId}.json`))
      updatedAt = new Date(st.mtimeMs).toISOString()
    } catch {
      /* ignore */
    }
    const doc = {
      _id: sceneId,
      title: sceneId,
      namespace: 'Data',
      payload: { kind: 'scene', sceneId },
      updatedAt,
    }
    docs.push(doc)
    byTitle.set(sceneId, doc)
  }
  return { docs, byTitle }
}

function matchDoc(doc, query) {
  if (!query || typeof query !== 'object') return true
  for (const [k, v] of Object.entries(query)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      if (Object.prototype.hasOwnProperty.call(v, '$eq')) {
        if (doc[k] !== v.$eq) return false
      } else {
        throw new Error(`$match: unsupported operator for field ${k}`)
      }
    } else if (doc[k] !== v) return false
  }
  return true
}

function projectDoc(doc, spec) {
  if (!spec || typeof spec !== 'object') return doc
  const out = {}
  const keys = Object.keys(spec)
  const exclude = keys.some((k) => spec[k] === 0)
  if (exclude) {
    for (const k of Object.keys(doc)) {
      if (spec[k] === 0) continue
      if (spec[k] === 1 || spec[k] === undefined) out[k] = doc[k]
    }
    return out
  }
  for (const k of keys) {
    if (spec[k] === 1) out[k] = doc[k]
  }
  return out
}

function sortDocs(docs, sortSpec) {
  if (!sortSpec || typeof sortSpec !== 'object') return docs
  const entries = Object.entries(sortSpec)
  return [...docs].sort((a, b) => {
    for (const [field, dir] of entries) {
      const va = a[field]
      const vb = b[field]
      if (va === vb) continue
      const c = va < vb ? -1 : 1
      return dir === -1 ? -c : c
    }
    return 0
  })
}

/**
 * @param {object[]} docs
 * @param {unknown} pipeline
 * @returns {object[]}
 */
export function runInMemoryAggregate(docs, pipeline) {
  if (!Array.isArray(pipeline)) {
    throw new Error('aggregation pipeline must be a JSON array')
  }
  let out = docs.map((d) => ({ ...d }))
  for (let i = 0; i < pipeline.length; i++) {
    const stage = pipeline[i]
    if (typeof stage !== 'object' || stage === null) {
      throw new Error(`stage ${i} must be an object`)
    }
    const keys = Object.keys(stage)
    if (keys.length !== 1) {
      throw new Error(`stage ${i} must have exactly one operator`)
    }
    const op = keys[0]
    if (op === '$match') {
      out = out.filter((d) => matchDoc(d, stage.$match))
    } else if (op === '$project') {
      out = out.map((d) => projectDoc(d, stage.$project))
    } else if (op === '$sort') {
      out = sortDocs(out, stage.$sort)
    } else if (op === '$limit') {
      const n = stage.$limit
      if (typeof n !== 'number' || n < 0 || !Number.isFinite(n)) {
        throw new Error('$limit must be a non-negative number')
      }
      out = out.slice(0, Math.floor(n))
    } else if (op === '$count') {
      const name = stage.$count
      if (typeof name !== 'string' || !name) {
        throw new Error('$count must be a non-empty string (output field name)')
      }
      out = [{ [name]: out.length }]
    } else {
      throw new Error(`unsupported aggregation stage: ${op}`)
    }
  }
  return out
}
