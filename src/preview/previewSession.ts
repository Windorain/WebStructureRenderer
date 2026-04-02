/**
 * 单一加载阶段：HTTP 拉取 RenderBundle，并行预取 PNG，构造 SimpleMaterialLibrary。
 */

import * as THREE from 'three'

import { locatorToResourceUrl } from '@/render/assets/resolveAssets'
import { validateRenderBundle } from '@/render/data/bundleResolve'
import { SimpleMaterialLibrary, type MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import type { RenderBundle } from '@/render/schema/types'
import { formatUnknownError } from '@/util/formatUnknownError'

/** 默认场景：`data/scenes/<id>.json`，palette 使用 MC/registryId@meta 键 */
export const DEFAULT_PREVIEW_SCENE_ID = 'export'

const DEFAULT_API_PREFIX = '/preview-api'

export interface PreviewSessionResult {
  renderBundle: RenderBundle
  materialLibrary: MaterialLibraryApi
}

function resourcesBaseFromApiPrefix(apiPrefix: string): string {
  return `${apiPrefix.replace(/\/$/, '')}/resources`
}

async function fetchBundleJson(sceneId: string, apiPrefix: string): Promise<RenderBundle> {
  const enc = encodeURIComponent(sceneId)
  const path = `${apiPrefix.replace(/\/$/, '')}/scenes/${enc}/bundle`
  const res = await fetch(path)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`拉取 bundle 失败: ${res.status} ${text}`)
  }
  const raw = JSON.parse(text) as RenderBundle
  validateRenderBundle(raw)
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
export async function loadPreviewSession(options: {
  sceneId: string
  apiPrefix?: string
}): Promise<PreviewSessionResult> {
  const apiPrefix = options.apiPrefix ?? DEFAULT_API_PREFIX
  const renderBundle = await fetchBundleJson(options.sceneId, apiPrefix)
  const resourcesBase = resourcesBaseFromApiPrefix(apiPrefix)
  const loader = new THREE.TextureLoader()
  const materials = renderBundle.materialRegistry.materials

  const entries = Object.entries(materials)
  const textures = await Promise.all(
    entries.map(async ([materialId, entry]) => {
      const url = locatorToResourceUrl(entry.locator, resourcesBase)
      const tex = await loadPngTexture(loader, url)
      return [materialId, tex] as const
    }),
  )

  const preloaded = new Map<string, THREE.Texture>(textures)
  const materialLibrary = new SimpleMaterialLibrary(renderBundle.materialRegistry, preloaded)

  return { renderBundle, materialLibrary }
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
} from './namespaceHttp'
