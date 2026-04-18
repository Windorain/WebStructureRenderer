/**
 * 场景根级 `mode`（展示策略）→ 预览 UI 功能开关。
 */

import type { PreviewFeatures } from '@/preview/previewConfig'
import type { SceneDisplayMode, StructureDataBaked, World } from '@/render/schema/types'

import { isWorldDocument } from './bundleResolve'

const DEFAULT_DISPLAY_MODE: SceneDisplayMode = 'multiblock'

export function normalizeSceneDisplayMode(raw: unknown): SceneDisplayMode {
  if (raw === 'simple' || raw === 'multiblock') return raw
  return DEFAULT_DISPLAY_MODE
}

/** 由 document 根推断展示模式（World 用根级 `mode`；单结构用 structure.mode） */
export function sceneDisplayModeFromDocument(document: unknown): SceneDisplayMode {
  if (!document || typeof document !== 'object') return DEFAULT_DISPLAY_MODE
  if (isWorldDocument(document)) {
    return normalizeSceneDisplayMode((document as World).mode)
  }
  const o = document as Partial<StructureDataBaked>
  return normalizeSceneDisplayMode(o.mode)
}

/** `multiblock`：统计 + 分层；`simple`：二者关闭 */
export function previewFeaturesForDisplayMode(mode: SceneDisplayMode): Pick<PreviewFeatures, 'blockStatsSidebar' | 'layerBar'> {
  if (mode === 'simple') {
    return { blockStatsSidebar: false, layerBar: false }
  }
  return { blockStatsSidebar: true, layerBar: true }
}
