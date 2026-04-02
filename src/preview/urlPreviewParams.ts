/**
 * 本地 dev 入口 URL 查询参数（白名单）。与 dev/previewBootstrap 合并（覆盖默认值）；不含 wikiRenderBundle。
 */

import type { WikiRendererFeatures } from '@/embed/wikiRendererContract'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

import type { AppPreviewConfig } from './appPreviewConfig'

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

export function parseUrlPreviewParams(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): Partial<AppPreviewConfig> {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  const out: Partial<AppPreviewConfig> = {}
  const feat: Partial<WikiRendererFeatures> = {}

  const sceneId = params.get('sceneId')
  if (sceneId !== null && sceneId !== '') {
    out.sceneId = sceneId
  }

  const layer = params.get('layer')
  if (layer !== null && layer !== '') {
    const n = Number(layer)
    if (Number.isFinite(n)) out.initialLayerWorldY = n
  }

  const proj = params.get('projection')
  if (proj === 'orthographic' || proj === 'perspective') {
    out.initialProjectionMode = proj as ProjectionMode
  }

  const stats = parseBool(params.get('stats'))
  if (stats !== undefined) feat.blockStatsSidebar = stats

  const layerBar = parseBool(params.get('layerBar'))
  if (layerBar !== undefined) feat.layerBar = layerBar

  const devPanel = parseBool(params.get('devPanel'))
  if (devPanel !== undefined) feat.developerPanel = devPanel

  if (Object.keys(feat).length > 0) {
    out.features = { ...feat } as AppPreviewConfig['features']
  }

  const bg = parseHex6(params.get('bg'))
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
  const clearColor = parseHex6(params.get('clearColor'))
  if (clearColor !== undefined) bco.clearColor = clearColor
  const clearAlphaParam = params.get('clearAlpha')
  if (clearAlphaParam !== null && clearAlphaParam !== '') {
    const n = Number(clearAlphaParam)
    if (Number.isFinite(n) && n >= 0 && n <= 1) bco.clearAlpha = n
  }
  if (Object.keys(bco).length > 0) {
    out.blockIconCacheOptions = bco as AppPreviewConfig['blockIconCacheOptions']
  }

  return out
}
