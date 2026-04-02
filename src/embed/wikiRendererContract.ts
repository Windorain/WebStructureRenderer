/**
 * 嵌入端公开契约；HTTP 形状见 server/wiki-mock/README.md。
 */

import type { WikiRendererFeatures } from '@/preview/appPreviewConfig'
import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export type { WikiRendererFeatures }

export interface WikiRendererData {
  sceneId: string
  /** 默认 `/preview-api` */
  apiPrefix?: string
}

export interface WikiRendererUiOptions {
  blockIconCacheOptions?: Partial<BlockIconCacheOptions>
  initialLayerWorldY?: number
  initialProjectionMode?: ProjectionMode
  sceneBackground?: number
  loadingMessage?: string
  okMessage?: (modelId: string) => string
}

export interface WikiRendererBootstrapOptions {
  data: WikiRendererData
  /** 未指定字段使用 defaultWikiEmbedUi（appPreviewConfig） */
  features?: Partial<WikiRendererFeatures>
  ui?: WikiRendererUiOptions
}
