/**
 * 本地入口 URL 查询参数（白名单），与 previewConfig 合并；不含 wikiRenderBundle。
 */

import type { AppPreviewConfig } from './appPreviewConfig'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

function parseBool(s: string | null): boolean | undefined {
  if (s === null || s === '') return undefined
  const t = s.toLowerCase()
  if (t === '1' || t === 'true' || t === 'yes') return true
  if (t === '0' || t === 'false' || t === 'no') return false
  return undefined
}

function parseHex6(s: string | null): number | undefined {
  if (s === null || s === '') return undefined
  const m = /^#?([0-9a-fA-F]{6})$/.exec(s.trim())
  if (!m) return undefined
  return parseInt(m[1], 16)
}

/**
 * 合并顺序见 previewConfig：在 defaults 之后、localStorage 之前应用（localStorage 优先覆盖 URL）。
 */
export function parseUrlPreviewParams(search: string = typeof window !== 'undefined' ? window.location.search : ''): Partial<AppPreviewConfig> {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  const out: Partial<AppPreviewConfig> = {}

  const sceneId = params.get('sceneId') ?? params.get('scene')
  if (sceneId !== null && sceneId !== '') {
    out.sceneId = sceneId
  }

  const layer = params.get('layer') ?? params.get('initialLayerWorldY')
  if (layer !== null && layer !== '') {
    const n = Number(layer)
    if (Number.isFinite(n)) out.initialLayerWorldY = n
  }

  const proj = params.get('projection') ?? params.get('initialProjectionMode')
  if (proj === 'orthographic' || proj === 'perspective') {
    out.initialProjectionMode = proj as ProjectionMode
  }

  const stats = parseBool(params.get('stats') ?? params.get('showBlockStatsSidebar'))
  if (stats !== undefined) out.showBlockStatsSidebar = stats

  const bg = parseHex6(params.get('bg') ?? params.get('sceneBackground'))
  if (bg !== undefined) out.sceneBackground = bg

  const bco: Partial<AppPreviewConfig['blockIconCacheOptions']> = {}
  const sizePx = params.get('iconSizePx')
  if (sizePx !== null && sizePx !== '') {
    const n = Math.round(Number(sizePx))
    if (Number.isFinite(n) && n >= 8) bco.sizePx = n
  }
  const orthoHalf = params.get('orthoHalf')
  if (orthoHalf !== null && orthoHalf !== '') {
    const n = Number(orthoHalf)
    if (Number.isFinite(n) && n > 0) bco.orthoHalf = n
  }
  if (Object.keys(bco).length > 0) {
    out.blockIconCacheOptions = bco as AppPreviewConfig['blockIconCacheOptions']
  }

  return out
}
