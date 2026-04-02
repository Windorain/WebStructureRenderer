/**
 * 本地开发：URL 之外的 localStorage 补丁（不用于 Wiki 生产嵌入）。
 */

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'

export const PREVIEW_DEV_STORAGE_KEY = 'wmr-preview-dev-v3'

export function loadPersistedDevPatch(): Partial<AppPreviewConfig> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PREVIEW_DEV_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    delete parsed.wikiRenderBundle
    return parsed as Partial<AppPreviewConfig>
  } catch {
    return {}
  }
}

function buildSerializablePatch(patch: Partial<AppPreviewConfig>): Record<string, unknown> {
  const serializable: Record<string, unknown> = {}
  if (patch.features !== undefined) serializable.features = patch.features
  if (patch.initialLayerWorldY !== undefined) serializable.initialLayerWorldY = patch.initialLayerWorldY
  if (patch.initialProjectionMode !== undefined) serializable.initialProjectionMode = patch.initialProjectionMode
  if (patch.sceneBackground !== undefined) serializable.sceneBackground = patch.sceneBackground
  if (patch.blockIconCacheOptions !== undefined) serializable.blockIconCacheOptions = patch.blockIconCacheOptions
  if (patch.loadingMessage !== undefined) serializable.loadingMessage = patch.loadingMessage
  if (patch.sceneId !== undefined && patch.sceneId !== '') {
    serializable.sceneId = patch.sceneId
  }
  return serializable
}

export function persistDevPreviewPatch(patch: Partial<AppPreviewConfig>): void {
  if (typeof localStorage === 'undefined') return
  let prev: Record<string, unknown> = {}
  try {
    const raw = localStorage.getItem(PREVIEW_DEV_STORAGE_KEY)
    if (raw) prev = JSON.parse(raw) as Record<string, unknown>
  } catch {
    prev = {}
  }
  const next = { ...prev, ...buildSerializablePatch(patch) }
  if (patch.sceneId === '') {
    delete next.sceneId
  }
  localStorage.setItem(PREVIEW_DEV_STORAGE_KEY, JSON.stringify(next))
}

export function clearPersistedDevPreview(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(PREVIEW_DEV_STORAGE_KEY)
}
