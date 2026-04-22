/**
 * 预览与嵌入运行时配置：场景数据、预加载材质库与 UI 默认值。
 */

import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { MaterialLibraryApi } from '@/render/materials/simpleMaterialLibrary'
import type { RenderBundle } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

/** 功能块开关 */
export interface PreviewFeatures {
  blockStatsSidebar: boolean
  layerBar: boolean
}

export interface PreviewConfig {
  sceneId: string
  renderBundle: RenderBundle
  materialLibrary: MaterialLibraryApi
  features: PreviewFeatures
  blockIconCacheOptions: BlockIconCacheOptions
  initialLayerWorldY: number
  initialProjectionMode: ProjectionMode
  sceneBackground: number
  loadingMessage: string
  okMessage: (modelId: string) => string
}

export const defaultEmbedUi: Omit<PreviewConfig, 'renderBundle' | 'materialLibrary' | 'sceneId'> = {
  features: {
    blockStatsSidebar: false,
    layerBar: false,
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
