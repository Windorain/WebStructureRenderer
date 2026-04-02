/**
 * 嵌入端公开契约：与 Mock Wiki HTTP（server/wiki-mock）REST 形状成对维护。
 * 见 server/wiki-mock/README.md
 */

import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { WikiRenderBundle } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

/** 功能块开关；Wiki 最小嵌入默认全 false（仅视口 + 状态条） */
export interface WikiRendererFeatures {
  blockStatsSidebar: boolean
  layerBar: boolean
  developerPanel: boolean
}

export const defaultWikiRendererFeatures: WikiRendererFeatures = {
  blockStatsSidebar: false,
  layerBar: false,
  developerPanel: false,
}

/** 内联 bundle（生产 Wiki 注入） */
export type WikiRendererDataInline = {
  mode: 'inline'
  bundle: WikiRenderBundle
}

/**
 * 从 HTTP 拉取 bundle（开发/Mock；与 GET /preview-api/scenes/:id/bundle 一致）。
 * `apiPrefix` 默认 `/preview-api`（经 Vite 代理到 wiki-mock）。
 */
export type WikiRendererDataFetch = {
  mode: 'fetch'
  sceneId: string
  apiPrefix?: string
}

export type WikiRendererData = WikiRendererDataInline | WikiRendererDataFetch

export interface WikiRendererUiOptions {
  blockIconCacheOptions?: Partial<BlockIconCacheOptions>
  initialLayerWorldY?: number
  initialProjectionMode?: ProjectionMode
  sceneBackground?: number
  loadingMessage?: string
  okMessage?: (modelId: string) => string
}

/**
 * `mountWikiRenderer` / WikiRendererRoot 使用的显式启动参数。
 */
export interface WikiRendererBootstrapOptions {
  data: WikiRendererData
  /** 未指定字段使用 defaultWikiRendererFeatures */
  features?: Partial<WikiRendererFeatures>
  ui?: WikiRendererUiOptions
}
