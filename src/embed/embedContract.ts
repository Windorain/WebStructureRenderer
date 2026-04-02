/**
 * 嵌入端公开契约；HTTP 形状见 server/wiki-mock/README.md。
 * 含 bootstrap → PreviewConfig（含 HTTP 加载阶段）。
 */

import type { PreviewConfig, PreviewFeatures } from '@/preview/previewConfig'
import { defaultEmbedUi } from '@/preview/previewConfig'
import { loadPreviewSession } from '@/preview/previewSession'
import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export type { PreviewFeatures }

export interface EmbedData {
  sceneId: string
  /** 默认 `/preview-api` */
  apiPrefix?: string
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
  const features = {
    ...defaultEmbedUi.features,
    ...options.features,
  }
  const ui = options.ui ?? {}

  const { sceneId, apiPrefix } = options.data
  const { renderBundle, materialLibrary } = await loadPreviewSession({
    sceneId,
    apiPrefix,
  })

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
