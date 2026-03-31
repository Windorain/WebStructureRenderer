/**
 * 开发者本地覆盖：仅与默认配置合并后用于 createPreviewSceneStore，不修改 defaultAppPreviewConfig。
 * 不持久化完整 structureData / materialRegistry / showDeveloperPanel；可持久化 structureModuleId（结构文件名 id）。
 */

import type { AppPreviewConfig } from './appPreviewConfig'
import { getStructureDataByModuleId } from './structureModuleCatalog'

export const DEV_CONFIG_OVERRIDES_STORAGE_KEY = 'wmr-dev-config-overrides'

export function mergeAppPreviewConfig(base: AppPreviewConfig, patch: Partial<AppPreviewConfig>): AppPreviewConfig {
  let structureData = base.structureData
  let structureModuleId = base.structureModuleId

  if (patch.structureModuleId !== undefined) {
    if (patch.structureModuleId === '') {
      structureData = base.structureData
      structureModuleId = undefined
    } else {
      const data = getStructureDataByModuleId(patch.structureModuleId)
      if (data !== undefined) {
        structureData = data
        structureModuleId = patch.structureModuleId
      } else {
        structureData = base.structureData
        structureModuleId = base.structureModuleId
      }
    }
  }

  return {
    ...base,
    ...patch,
    structureData,
    structureModuleId,
    materialRegistry: base.materialRegistry,
    showDeveloperPanel: base.showDeveloperPanel,
    blockIconCacheOptions: {
      ...base.blockIconCacheOptions,
      ...(patch.blockIconCacheOptions ?? {}),
    },
    okMessage: patch.okMessage ?? base.okMessage,
    loadingMessage: patch.loadingMessage ?? base.loadingMessage,
  }
}

export function loadDevOverrides(): Partial<AppPreviewConfig> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    delete parsed.structureData
    delete parsed.materialRegistry
    delete parsed.showDeveloperPanel
    return parsed as Partial<AppPreviewConfig>
  } catch {
    return {}
  }
}

function buildSerializableFromPatch(patch: Partial<AppPreviewConfig>): Record<string, unknown> {
  const serializable: Record<string, unknown> = {}
  if (patch.showBlockStatsSidebar !== undefined) serializable.showBlockStatsSidebar = patch.showBlockStatsSidebar
  if (patch.initialLayerWorldY !== undefined) serializable.initialLayerWorldY = patch.initialLayerWorldY
  if (patch.initialProjectionMode !== undefined) serializable.initialProjectionMode = patch.initialProjectionMode
  if (patch.sceneBackground !== undefined) serializable.sceneBackground = patch.sceneBackground
  if (patch.blockIconCacheOptions !== undefined) serializable.blockIconCacheOptions = patch.blockIconCacheOptions
  if (patch.loadingMessage !== undefined) serializable.loadingMessage = patch.loadingMessage
  if (patch.structureModuleId !== undefined && patch.structureModuleId !== '') {
    serializable.structureModuleId = patch.structureModuleId
  }
  return serializable
}

/** 与已有 localStorage 合并；structureModuleId 为 '' 时移除该项 */
export function saveDevOverrides(patch: Partial<AppPreviewConfig>): void {
  if (typeof localStorage === 'undefined') return
  let prev: Record<string, unknown> = {}
  try {
    const raw = localStorage.getItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY)
    if (raw) prev = JSON.parse(raw) as Record<string, unknown>
  } catch {
    prev = {}
  }
  const next = { ...prev, ...buildSerializableFromPatch(patch) }
  if (patch.structureModuleId === '') {
    delete next.structureModuleId
  }
  localStorage.setItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY, JSON.stringify(next))
}

export function clearDevOverrides(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY)
}

export function buildActiveAppPreviewConfig(base: AppPreviewConfig): AppPreviewConfig {
  return mergeAppPreviewConfig(base, loadDevOverrides())
}
