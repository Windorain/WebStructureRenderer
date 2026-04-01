/**
 * 预览应用配置：默认值 + localStorage 可序列化补丁 → 唯一装配入口 `resolveAppPreviewConfig`。
 * `wikiRenderBundle` 仅由 `previewDevServer.getWikiRenderBundle(sceneId)` 填入，不持久化整包。
 */

import type { AppPreviewConfig } from './appPreviewConfig'
import { defaultAppPreviewConfig } from './appPreviewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, getWikiRenderBundle } from './previewDevServer'

/** 当前 dev 覆盖存储键（破坏性更新自 `wmr-dev-config-overrides`） */
export const PREVIEW_DEV_STORAGE_KEY = 'wmr-preview-dev-v2'

const LEGACY_DEV_STORAGE_KEY = 'wmr-dev-config-overrides'

function resolveSceneIdForBundle(patch: Partial<AppPreviewConfig>): string {
  const s = patch.sceneId
  if (s === undefined || s === '') return DEFAULT_PREVIEW_SCENE_ID
  return s
}

/**
 * 唯一对外入口：组装完整 `AppPreviewConfig`（含从 `data/server` 或上传解析的 `wikiRenderBundle`）。
 */
export function resolveAppPreviewConfig(): AppPreviewConfig {
  const base = defaultAppPreviewConfig
  const patch = loadPersistedDevPatch()
  const sceneIdForBundle = resolveSceneIdForBundle(patch)
  const wikiRenderBundle = getWikiRenderBundle(sceneIdForBundle)

  return {
    ...base,
    ...patch,
    wikiRenderBundle,
    sceneId: patch.sceneId === '' || patch.sceneId === undefined ? undefined : patch.sceneId,
    showDeveloperPanel: base.showDeveloperPanel,
    blockIconCacheOptions: {
      ...base.blockIconCacheOptions,
      ...(patch.blockIconCacheOptions ?? {}),
    },
    okMessage: patch.okMessage ?? base.okMessage,
    loadingMessage: patch.loadingMessage ?? base.loadingMessage,
  }
}

export function loadPersistedDevPatch(): Partial<AppPreviewConfig> {
  if (typeof localStorage === 'undefined') return {}
  try {
    let raw = localStorage.getItem(PREVIEW_DEV_STORAGE_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_DEV_STORAGE_KEY)
      if (raw) {
        localStorage.setItem(PREVIEW_DEV_STORAGE_KEY, raw)
      }
    }
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    delete parsed.wikiRenderBundle
    delete parsed.showDeveloperPanel
    delete parsed.minimalComplete
    delete parsed.devGlobalBlockRegistry
    if (typeof parsed.structureModuleId === 'string' && parsed.sceneId === undefined) {
      parsed.sceneId = parsed.structureModuleId
    }
    delete parsed.structureModuleId
    return parsed as Partial<AppPreviewConfig>
  } catch {
    return {}
  }
}

function buildSerializablePatch(patch: Partial<AppPreviewConfig>): Record<string, unknown> {
  const serializable: Record<string, unknown> = {}
  if (patch.showBlockStatsSidebar !== undefined) serializable.showBlockStatsSidebar = patch.showBlockStatsSidebar
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

/** 持久化 dev UI 补丁（非整包 bundle） */
export function persistDevPreviewPatch(patch: Partial<AppPreviewConfig>): void {
  if (typeof localStorage === 'undefined') return
  let prev: Record<string, unknown> = {}
  try {
    const raw = localStorage.getItem(PREVIEW_DEV_STORAGE_KEY)
    if (raw) prev = JSON.parse(raw) as Record<string, unknown>
  } catch {
    prev = {}
  }
  delete prev.structureModuleId
  const next = { ...prev, ...buildSerializablePatch(patch) }
  if (patch.sceneId === '') {
    delete next.sceneId
  }
  localStorage.setItem(PREVIEW_DEV_STORAGE_KEY, JSON.stringify(next))
}

export function clearPersistedDevPreview(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(PREVIEW_DEV_STORAGE_KEY)
  localStorage.removeItem(LEGACY_DEV_STORAGE_KEY)
}
