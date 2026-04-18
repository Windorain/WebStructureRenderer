/**
 * 嵌入端公开契约：宿主传入已打包 document（含 textureBlobs），无 HTTP 加载阶段。
 */

import type { PreviewConfig, PreviewFeatures } from '@/preview/previewConfig'
import { defaultEmbedUi } from '@/preview/previewConfig'
import { loadPreviewSessionFromDocument } from '@/preview/previewSession'
import { previewFeaturesForDisplayMode, sceneDisplayModeFromDocument } from '@/render/data/sceneDisplay'
import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export type { PreviewFeatures }

function sceneKeyFromDocument(document: unknown): string {
  if (document && typeof document === 'object' && 'id' in document) {
    const id = (document as { id: unknown }).id
    if (typeof id === 'string' && id.length > 0) return id
  }
  return 'scene'
}

export interface EmbedData {
  /** SDE 打包后的 StructureData 或 World（根级含 `textureBlobs`） */
  document: unknown
}

export interface EmbedUiOptions {
  blockIconCacheOptions?: Partial<BlockIconCacheOptions>
  initialLayerWorldY?: number
  initialProjectionMode?: ProjectionMode
  sceneBackground?: number
  loadingMessage?: string
  okMessage?: (modelId: string) => string
}

export interface EmbedBootstrapOptions {
  data: EmbedData
  /** 未指定字段使用 defaultEmbedUi（previewConfig） */
  features?: Partial<PreviewFeatures>
  ui?: EmbedUiOptions
}

export async function resolveBootstrapToPreviewConfig(
  options: EmbedBootstrapOptions,
): Promise<PreviewConfig> {
  const ui = options.ui ?? {}

  const { document } = options.data
  const { renderBundle, materialLibrary } = await loadPreviewSessionFromDocument(document)
  const docMode = sceneDisplayModeFromDocument(renderBundle.document)
  const docUi = previewFeaturesForDisplayMode(docMode)
  const features: PreviewFeatures = {
    ...defaultEmbedUi.features,
    ...docUi,
    ...options.features,
  }
  const sceneId = sceneKeyFromDocument(renderBundle.document)

  const out: PreviewConfig = {
    sceneId,
    renderBundle,
    materialLibrary,
    features,
    blockIconCacheOptions: {
      ...defaultEmbedUi.blockIconCacheOptions,
      ...ui.blockIconCacheOptions,
    },
    initialLayerWorldY: ui.initialLayerWorldY ?? defaultEmbedUi.initialLayerWorldY,
    initialProjectionMode: ui.initialProjectionMode ?? defaultEmbedUi.initialProjectionMode,
    sceneBackground: ui.sceneBackground ?? defaultEmbedUi.sceneBackground,
    loadingMessage: ui.loadingMessage ?? defaultEmbedUi.loadingMessage,
    okMessage: ui.okMessage ?? defaultEmbedUi.okMessage,
  }
  return out
}
