/**
 * 预览应用配置：默认值 + URL 白名单 + localStorage 补丁 → resolveAppPreviewConfigAsync。
 * 合并顺序（后者覆盖前者）：defaultAppPreviewConfigBase → parseUrlPreviewParams → loadPersistedDevPatch。
 * wikiRenderBundle 由 getWikiRenderBundle(sceneId) 异步注入。
 */

import type { AppPreviewConfig } from './appPreviewConfig'
import { defaultAppPreviewConfigBase } from './appPreviewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, getWikiRenderBundle } from './previewDevServer'
import { parseUrlPreviewParams } from './urlPreviewParams'

export const PREVIEW_DEV_STORAGE_KEY = 'wmr-preview-dev-v2'

function resolveSceneIdForBundle(patch: Partial<AppPreviewConfig>): string {
  const s = patch.sceneId
  if (s === undefined || s === '') return DEFAULT_PREVIEW_SCENE_ID
  return s
}

/**
 * 组装完整 AppPreviewConfig（含从预览 HTTP 拉取的 wikiRenderBundle）。
 */
export async function resolveAppPreviewConfigAsync(): Promise<AppPreviewConfig> {
  const url = parseUrlPreviewParams()
  const patch = loadPersistedDevPatch()
  const mergedBase: Omit<AppPreviewConfig, 'wikiRenderBundle'> = {
    ...defaultAppPreviewConfigBase,
    ...url,
    ...patch,
    blockIconCacheOptions: {
      ...defaultAppPreviewConfigBase.blockIconCacheOptions,
      ...(url.blockIconCacheOptions ?? {}),
      ...(patch.blockIconCacheOptions ?? {}),
    },
  }
  const sceneIdForBundle = resolveSceneIdForBundle(mergedBase)
  const wikiRenderBundle = await getWikiRenderBundle(sceneIdForBundle)

  return {
    ...mergedBase,
    wikiRenderBundle,
    sceneId: mergedBase.sceneId === '' || mergedBase.sceneId === undefined ? undefined : mergedBase.sceneId,
    showDeveloperPanel: defaultAppPreviewConfigBase.showDeveloperPanel,
    okMessage: mergedBase.okMessage ?? defaultAppPreviewConfigBase.okMessage,
    loadingMessage: mergedBase.loadingMessage ?? defaultAppPreviewConfigBase.loadingMessage,
  }
}

export function loadPersistedDevPatch(): Partial<AppPreviewConfig> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PREVIEW_DEV_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    delete parsed.wikiRenderBundle
    delete parsed.showDeveloperPanel
    delete parsed.minimalComplete
    delete parsed.devGlobalBlockRegistry
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
