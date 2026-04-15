/**
 * 悬停气泡：Vue 状态 + 方块说明文案解析。
 */

import { ref, type Ref } from 'vue'

import { findBlockPaletteEntryByBlockId } from '@/render/data/blockRegistryResolve'
import type { StructureDefinition } from '@/render/schema/types'

export type TooltipHoverSource = 'viewport' | 'sidebar'

export interface PreviewTooltipHover {
  blockId: string
  clientX: number
  clientY: number
  source: TooltipHoverSource
}

export interface UsePreviewTooltip {
  hover: Ref<PreviewTooltipHover | null>
  setHover: (payload: PreviewTooltipHover) => void
  clearHover: (source?: TooltipHoverSource) => void
}

export function usePreviewTooltip(): UsePreviewTooltip {
  const hover = ref<PreviewTooltipHover | null>(null)

  function setHover(payload: PreviewTooltipHover): void {
    const h = hover.value
    // 同方块、同源时只改坐标，避免每帧新对象导致依赖 hover 的计算/子树无谓失效
    if (h && h.blockId === payload.blockId && h.source === payload.source) {
      h.clientX = payload.clientX
      h.clientY = payload.clientY
      return
    }
    hover.value = { ...payload }
  }

  function clearHover(source?: TooltipHoverSource): void {
    const h = hover.value
    if (!h) return
    if (source === undefined || h.source === source) hover.value = null
  }

  return { hover, setHover, clearHover }
}

/** 方块说明文案：来自 blockPalette 条目的 registryId/meta。 */
export function resolveBlockTooltip(blockId: string, def: StructureDefinition): string {
  const entry = findBlockPaletteEntryByBlockId(def, blockId)
  if (!entry) return blockId
  return `${entry.registryId} (meta ${entry.meta})`
}
