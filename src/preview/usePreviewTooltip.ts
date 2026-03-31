/**
 * 悬停气泡 UI 状态（局部，不并入 previewSceneStore）。
 */

import { ref, type Ref } from 'vue'

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
    hover.value = payload
  }

  function clearHover(source?: TooltipHoverSource): void {
    const h = hover.value
    if (!h) return
    if (source === undefined || h.source === source) hover.value = null
  }

  return { hover, setHover, clearHover }
}
