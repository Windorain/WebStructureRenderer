/**
 * 预览页默认配置（不含 wikiRenderBundle；由 resolveAppPreviewConfigAsync 注入）。
 */

import type { BlockIconCacheOptions } from '@/render/interaction/blockIconCache'
import type { WikiRenderBundle } from '@/render/schema/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export interface AppPreviewConfig {
  /** 与服务端契约一致：document + blockRegistry + materialRegistry + modelRegistry */
  wikiRenderBundle: WikiRenderBundle
  /**
   * 可选：`data/server/scenes/<id>` 场景 id；dev 持久化可覆盖。
   * 为空时使用 `DEFAULT_PREVIEW_SCENE_ID` 拉取 bundle。
   */
  sceneId?: string
  blockIconCacheOptions: BlockIconCacheOptions
  /** -1 = 全部层 */
  initialLayerWorldY: number
  initialProjectionMode: ProjectionMode
  sceneBackground: number
  showBlockStatsSidebar: boolean
  /** 是否挂载开发者配置面板（仅嵌入配置；不受 localStorage 覆盖）。生产嵌入请显式传 false */
  showDeveloperPanel: boolean
  loadingMessage: string
  okMessage: (modelId: string) => string
}

/** 不含 wikiRenderBundle；与预览 HTTP 拉取合并后得到完整 AppPreviewConfig */
export const defaultAppPreviewConfigBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
  blockIconCacheOptions: {
    sizePx: 128,
    orthoHalf: 0.85,
    clearColor: 0x000000,
    clearAlpha: 0,
  },
  initialLayerWorldY: -1,
  initialProjectionMode: 'orthographic',
  sceneBackground: 0x5a5a5a,
  showBlockStatsSidebar: true,
  showDeveloperPanel: Boolean(import.meta.env.DEV),
  loadingMessage: '正在加载数据与构建网格…',
  okMessage: (modelId: string) =>
    `渲染正常 · 模型 ${modelId} · 左键旋转 · 中键平移目标 · 滚轮/右键拖拽缩放 · 右上：世界轴（红+X 东 绿+Y 上 蓝+Z 南，对照 MC）`,
}
