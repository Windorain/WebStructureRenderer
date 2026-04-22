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

/**
 * 预览壳（`AppShell`）唯一入口：由 `loadPreviewSessionFromDocument` / `resolveBootstrapToPreviewConfig`
 * 自场景 document 生成。几何与顶栏所读**场景真源**为 `renderBundle.document`（已 normalize，与材质库同批构建）。
 */
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
  /**
   * 为 false 时隐藏底部调试状态栏（模型 id、非空气体素数等）。
   * 默认 false；工作台可在预览区面板中打开。
   */
  debug: boolean
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
  /** 状态条成功态已改由 sceneStore 拼调试摘要；保留回调供宿主覆盖（极少使用）。 */
  okMessage: () => '',
  debug: false,
}
