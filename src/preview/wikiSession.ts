/**
 * 单一加载阶段：HTTP 拉取 WikiRenderBundle，并行预取 PNG，构造 SimpleMaterialLibrary。
 */

import * as THREE from 'three'

import { locatorToResourceUrl } from '@/render/assets/resolveAssets'
import { formatUnknownError } from '@/util/formatUnknownError'
import { validateWikiRenderBundle } from '@/render/data/pipeline'
import { SimpleMaterialLibrary, type MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import type { WikiRenderBundle } from '@/render/schema/types'

export const DEFAULT_PREVIEW_SCENE_ID = 'industrial_electrolyzer.simple'

const DEFAULT_API_PREFIX = '/preview-api'

export interface WikiSessionResult {
  wikiRenderBundle: WikiRenderBundle
  materialLibrary: MaterialLibraryApi
}

function resourcesBaseFromApiPrefix(apiPrefix: string): string {
  return `${apiPrefix.replace(/\/$/, '')}/resources`
}

async function fetchBundleJson(sceneId: string, apiPrefix: string): Promise<WikiRenderBundle> {
  const enc = encodeURIComponent(sceneId)
  const path = `${apiPrefix.replace(/\/$/, '')}/scenes/${enc}/bundle`
  const res = await fetch(path)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`拉取 bundle 失败: ${res.status} ${text}`)
  }
  const raw = JSON.parse(text) as WikiRenderBundle
  validateWikiRenderBundle(raw)
  return raw
}

async function loadPngTexture(loader: THREE.TextureLoader, url: string): Promise<THREE.Texture> {
  const res = await fetch(url)
  if (!res.ok) {
    const snippet = await res.text().catch(() => '')
    const detail =
      snippet.length > 0 && snippet.length < 600 ? snippet : `${res.status} ${res.statusText}`
    throw new Error(`纹理 HTTP 失败: ${detail}（${url}）`)
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
        reject(new Error(`${formatUnknownError(err)}（${url}）`))
      },
    )
  })
}

/**
 * 拉取 bundle、按 material_registry 并行预取全部 PNG，构造材质库。
 */
export async function loadWikiPreviewSession(options: {
  sceneId: string
  apiPrefix?: string
}): Promise<WikiSessionResult> {
  const apiPrefix = options.apiPrefix ?? DEFAULT_API_PREFIX
  const wikiRenderBundle = await fetchBundleJson(options.sceneId, apiPrefix)
  const resourcesBase = resourcesBaseFromApiPrefix(apiPrefix)
  const loader = new THREE.TextureLoader()
  const materials = wikiRenderBundle.materialRegistry.materials

  const entries = Object.entries(materials)
  const textures = await Promise.all(
    entries.map(async ([materialId, entry]) => {
      const url = locatorToResourceUrl(entry.locator, resourcesBase)
      const tex = await loadPngTexture(loader, url)
      return [materialId, tex] as const
    }),
  )

  const preloaded = new Map<string, THREE.Texture>(textures)
  const materialLibrary = new SimpleMaterialLibrary(wikiRenderBundle.materialRegistry, preloaded)

  return { wikiRenderBundle, materialLibrary }
}

export async function fetchSceneIdList(apiPrefix: string = DEFAULT_API_PREFIX): Promise<string[]> {
  const res = await fetch(`${apiPrefix.replace(/\/$/, '')}/scenes`)
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
} from './wikiNamespaceHttp'
