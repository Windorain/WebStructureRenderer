/**
 * 单一加载阶段：HTTP 拉取场景 JSON（StructureData | World），并行预取 PNG，构造 SimpleMaterialLibrary。
 */

import * as THREE from 'three'

import { buildMaterialRegistryFromSceneDocument, validateRenderBundle } from '@/render/data/bundleResolve'
import {
  hydrateMaterialBlendsInSceneDocument,
  listPaletteTexturesToFetch,
} from '@/render/data/sceneDocumentMaterialHydrate'
import { SimpleMaterialLibrary, type MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import type { RenderBundle } from '@/render/schema/types'
import { formatUnknownError } from '@/util/formatUnknownError'

/** 默认场景：`data/scenes/<id>.json`，终态 StructureData（blockPalette + materialPalette） */
export const DEFAULT_PREVIEW_SCENE_ID = 'export'

const DEFAULT_API_PREFIX = '/preview-api'

/** 1×1 PNG，缺资源或网络异常时避免预览整体失败 */
const MISSING_TEXTURE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

function isLikelyNetworkFetchFailure(e: unknown): boolean {
  if (!(e instanceof Error)) return false
  const m = e.message.toLowerCase()
  return (
    m.includes('failed to fetch') ||
    m.includes('load failed') ||
    m.includes('networkerror') ||
    m.includes('network request failed')
  )
}

/** 浏览器原生 fetch 失败（无 HTTP 响应）时给出可操作的排查说明 */
function wrapPreviewApiFetchError(requestUrl: string, e: unknown): never {
  const orig = formatUnknownError(e)
  if (e instanceof TypeError || isLikelyNetworkFetchFailure(e)) {
    throw new Error(
      `${orig}\n\n` +
        `请求地址：${requestUrl}\n` +
        `常见原因：① 未启动 wiki-mock（仓库根目录执行 npm run preview:http，或使用 npm run dev 同时拉起 mock）；② 使用 vite preview 时已启动 wiki-mock（需最新 vite 配置中的 preview 代理；仍失败则检查 .wmr-preview-port 端口）；③ 嵌入页与 API 不同源——为 bootstrap.data.apiPrefix 设置完整 URL并配置服务端 CORS。\n` +
        `（若为纹理路径：缺 PNG 时 wiki-mock 一般返回 404，预览会改用占位图；若仍出现本说明，则为请求未到达服务器的网络层问题。）`,
    )
  }
  throw e instanceof Error ? e : new Error(orig)
}

export interface PreviewSessionResult {
  renderBundle: RenderBundle
  materialLibrary: MaterialLibraryApi
}

function resourcesBaseFromApiPrefix(apiPrefix: string): string {
  return `${apiPrefix.replace(/\/$/, '')}/resources`
}

/** GET /preview-api/scenes/:id — 响应体为 StructureData 或 World JSON */
async function fetchSceneDocument(sceneId: string, apiPrefix: string): Promise<unknown> {
  const enc = encodeURIComponent(sceneId)
  const path = `${apiPrefix.replace(/\/$/, '')}/scenes/${enc}`
  let res: Response
  try {
    res = await fetch(path)
  } catch (e) {
    wrapPreviewApiFetchError(path, e)
  }
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`拉取场景失败: ${res.status} ${text}`)
  }
  return JSON.parse(text) as unknown
}

function loadTextureDataUrl(loader: THREE.TextureLoader, dataUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(dataUrl, resolve, undefined, reject)
  })
}

/**
 * 从 wiki-mock `/preview-api/resources/...` 拉 PNG；404或 fetch 失败时使用占位图，不中断整页加载。
 */
async function loadPngTexture(loader: THREE.TextureLoader, url: string): Promise<THREE.Texture> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      const snippet = await res.text().catch(() => '')
      const detail =
        snippet.length > 0 && snippet.length < 200 ? snippet : `${res.status} ${res.statusText}`
      console.warn(
        `[previewSession] 纹理不可用（${detail}），已用占位图。请将 PNG 置于 data/resources 下相对路径：${url.replace(/^.*\/resources\//, '')}`,
      )
      return loadTextureDataUrl(loader, MISSING_TEXTURE_DATA_URL)
    }
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    return new Promise((resolve, reject) => {
      loader.load(
        objectUrl,
        (tex) => {
          URL.revokeObjectURL(objectUrl)
          resolve(tex)
        },
        undefined,
        (err) => {
          URL.revokeObjectURL(objectUrl)
          console.warn(`[previewSession] 纹理解码失败，已用占位图：${url}`, err)
          void loadTextureDataUrl(loader, MISSING_TEXTURE_DATA_URL).then(resolve).catch(reject)
        },
      )
    })
  } catch (e) {
    console.warn(
      `[previewSession] 纹理 fetch 失败，已用占位图：${url} — ${formatUnknownError(e)}`,
    )
    return loadTextureDataUrl(loader, MISSING_TEXTURE_DATA_URL)
  }
}

/**
 * 拉取场景 JSON、按结构内（及 World 全帧）materialPalette 并行预取 PNG，构造材质库。
 */
export async function loadPreviewSession(options: {
  sceneId: string
  apiPrefix?: string
}): Promise<PreviewSessionResult> {
  const apiPrefix = options.apiPrefix ?? DEFAULT_API_PREFIX
  const document = await fetchSceneDocument(options.sceneId, apiPrefix)
  const renderBundle: RenderBundle = { document }
  validateRenderBundle(renderBundle)

  const resourcesBase = resourcesBaseFromApiPrefix(apiPrefix)
  const loader = new THREE.TextureLoader()
  const fetchList = listPaletteTexturesToFetch(document, resourcesBase)
  const textures = await Promise.all(
    fetchList.map(async ({ materialId, url }) => {
      const tex = await loadPngTexture(loader, url)
      return [materialId, tex] as const
    }),
  )

  const preloaded = new Map<string, THREE.Texture>(textures)
  hydrateMaterialBlendsInSceneDocument(document, preloaded)
  const registry = buildMaterialRegistryFromSceneDocument(document)
  const materialLibrary = new SimpleMaterialLibrary(registry, preloaded)

  return { renderBundle, materialLibrary }
}

export async function fetchSceneIdList(apiPrefix: string = DEFAULT_API_PREFIX): Promise<string[]> {
  const path = `${apiPrefix.replace(/\/$/, '')}/scenes`
  let res: Response
  try {
    res = await fetch(path)
  } catch (e) {
    wrapPreviewApiFetchError(path, e)
  }
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`预览 API /scenes 失败: ${res.status} ${text}`)
  }
  return JSON.parse(text) as string[]
}

export { DEFAULT_API_PREFIX }
export {
  encodeNamespaceAggrSegment,
  fetchNamespaceDataAggregate,
  fetchNamespaceDataByTitle,
  fetchNamespaceDataList,
  type NamespaceDataDoc,
} from './namespaceHttp'
