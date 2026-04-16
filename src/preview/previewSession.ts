/**
 * 单一加载阶段：自内嵌 Base64 池解码 PNG，构造 SimpleMaterialLibrary（零 HTTP）。
 */

import * as THREE from 'three'

import {
  buildMaterialRegistryFromSceneDocument,
  validateRenderBundle,
} from '@/render/data/bundleResolve'
import {
  hydrateMaterialBlendsInSceneDocument,
  listPaletteTextureDataUrls,
} from '@/render/data/sceneDocumentMaterialHydrate'
import { SimpleMaterialLibrary, type MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import type { RenderBundle } from '@/render/schema/types'
import { formatUnknownError } from '@/util/formatUnknownError'

/** 默认 dev 场景文件名（无 URL 参数时）：`data/scenes/<id>.json` */
export const DEFAULT_PREVIEW_SCENE_ID = 'export'

export interface PreviewSessionResult {
  renderBundle: RenderBundle
  materialLibrary: MaterialLibraryApi
}

function loadTextureDataUrl(loader: THREE.TextureLoader, dataUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(dataUrl, resolve, undefined, reject)
  })
}

/**
 * 由已解析的打包场景 document（StructureData | World）构建材质库与 RenderBundle。
 */
export async function loadPreviewSessionFromDocument(document: unknown): Promise<PreviewSessionResult> {
  const renderBundle: RenderBundle = { document }
  validateRenderBundle(renderBundle)

  const loader = new THREE.TextureLoader()
  const fetchList = listPaletteTextureDataUrls(document)
  const textures = await Promise.all(
    fetchList.map(async ({ materialId, dataUrl }) => {
      try {
        const tex = await loadTextureDataUrl(loader, dataUrl)
        return [materialId, tex] as const
      } catch (e) {
        throw new Error(
          `解码 textureBlobs 项失败（materialId=${materialId}）：${formatUnknownError(e)}`,
        )
      }
    }),
  )

  const preloaded = new Map<string, THREE.Texture>(textures)
  hydrateMaterialBlendsInSceneDocument(document, preloaded)
  const registry = buildMaterialRegistryFromSceneDocument(document)
  const materialLibrary = new SimpleMaterialLibrary(registry, preloaded)

  return { renderBundle, materialLibrary }
}
