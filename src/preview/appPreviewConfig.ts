/**
 * 运行时预览/嵌入配置。功能开关集中在 `features`（无旧版顶栏 boolean 兼容字段）。
 */

import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { WikiRenderBundle } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

import type { WikiRendererFeatures } from '@/embed/wikiRendererContract'

export type { WikiRendererFeatures }

export interface AppPreviewConfig {
  wikiRenderBundle: WikiRenderBundle
  /** fetch 模式解析场景 id；内联 bundle 时可为空 */
  sceneId?: string
  features: WikiRendererFeatures
  blockIconCacheOptions: BlockIconCacheOptions
  initialLayerWorldY: number
  initialProjectionMode: ProjectionMode
  sceneBackground: number
  loadingMessage: string
  okMessage: (modelId: string) => string
}

/** Wiki 嵌入默认 UI（不含 bundle）；与 mountWikiRenderer 默认一致 */
export const defaultWikiEmbedUi: Omit<AppPreviewConfig, 'wikiRenderBundle' | 'sceneId'> = {
  features: {
    blockStatsSidebar: false,
    layerBar: false,
    developerPanel: false,
  },
  blockIconCacheOptions: {
    sizePx: 128,
    orthoHalf: 0.85,
    clearColor: 0x000000,
    clearAlpha: 0,
  },
  initialLayerWorldY: -1,
  initialProjectionMode: 'orthographic',
  sceneBackground: 0x5a5a5a,
  loadingMessage: '正在加载数据与构建网格…',
  okMessage: (modelId: string) =>
    `渲染正常 · 模型 ${modelId} · 左键旋转 · 中键平移目标 · 滚轮/右键拖拽缩放 · 右上：世界轴（红+X 东 绿+Y 上 蓝+Z 南，对照 MC）`,
}
