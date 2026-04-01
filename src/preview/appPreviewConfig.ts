/**
 * 预览页默认配置：最小完备集（结构 + block/material 表）、图标缓存参数等。
 */

import electroDef from '@renderData/structures/industrial_electrolyzer.simple.json'
import blockRegistryJson from '@renderData/registries/block_registry.json'
import materialRegistryJson from '@renderData/registries/material_registry.json'

import type { BlockIconCacheOptions } from '@/render/blockIconCache'
import type { BlockRegistryData, MaterialRegistryData, MinimalCompletePayload, StructureData } from '@/render/types'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

export interface AppPreviewConfig {
  /** 与服务端契约一致：一次 payload 内含 structure + blockRegistry + materialRegistry */
  minimalComplete: MinimalCompletePayload
  /**
   * 可选：仅本地/调试。在 mergeStructureData 合并链最前注入（模拟服务端全局库底稿）。
   * 线上应省略，由 `minimalComplete.blockRegistry` 已含切片。
   */
  devGlobalBlockRegistry?: BlockRegistryData
  /**
   * 可选：data/structures 下文件名（不含 .json），与 dev 扫描一致。
   * 若 localStorage 覆盖指定，则 `minimalComplete` 由该 id 与同 stem 的导出表解析；否则以 `minimalComplete` 为准。
   */
  structureModuleId?: string
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
  minimalComplete: {
    structure: electroDef as StructureData,
    blockRegistry: blockRegistryJson as BlockRegistryData,
    materialRegistry: materialRegistryJson as MaterialRegistryData,
  },
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
