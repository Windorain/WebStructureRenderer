/**
 * 预览页默认配置：结构数据、材质表、图标缓存参数等。
 */

import electroDef from '@renderData/structures/industrial_electrolyzer.simple.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'

import type { BlockIconCacheOptions } from '@/render/blockIconCache'
import type { MaterialRegistryData } from '@/render/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export interface AppPreviewConfig {
  /** 原始 JSON（经 pipeline 解析） */
  structureData: unknown
  materialRegistry: MaterialRegistryData
  blockIconCacheOptions: BlockIconCacheOptions
  /** -1 = 全部层 */
  initialLayerWorldY: number
  initialProjectionMode: ProjectionMode
  sceneBackground: number
  /** 是否在主界面展示方块统计侧栏（由嵌入方配置，无运行时开关） */
  showBlockStatsSidebar: boolean
  /** 是否挂载开发者配置面板（仅嵌入配置；不受 localStorage 覆盖）。生产嵌入请显式传 false */
  showDeveloperPanel: boolean
  loadingMessage: string
  okMessage: (modelId: string) => string
}

export const defaultAppPreviewConfig: AppPreviewConfig = {
  structureData: electroDef,
  materialRegistry: materialRegistryJson as MaterialRegistryData,
  blockIconCacheOptions: {
    sizePx: 128,
    /** 正交相机半宽/半高，略小于库默认 1.22，使方块在精灵图中更大；再减小则更「拉近」 */
    orthoHalf: 0.85,
    clearColor: 0x000000,
    clearAlpha: 0,
  },
  initialLayerWorldY: -1,
  initialProjectionMode: 'orthographic',
  sceneBackground: 0x5a5a5a,
  showBlockStatsSidebar: true,
  /** Vite 开发服务器为 true，生产构建为 false；本地若需关闭可改为 false */
  showDeveloperPanel: Boolean(import.meta.env.DEV),
  loadingMessage: '正在加载数据与构建网格…',
  okMessage: (modelId: string) =>
    `渲染正常 · 模型 ${modelId} · 左键旋转 · 中键平移目标 · 滚轮/右键拖拽缩放 · 右上：世界轴（红+X 东 绿+Y 上 蓝+Z 南，对照 MC）`,
}
