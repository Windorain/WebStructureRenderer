/**
 * 开发者本地覆盖：仅与默认配置合并后用于 createPreviewSceneStore，不修改 defaultAppPreviewConfig。
 * 不持久化 structureData / materialRegistry / showDeveloperPanel。
 */

import type { AppPreviewConfig } from './appPreviewConfig'

export const DEV_CONFIG_OVERRIDES_STORAGE_KEY = 'wmr-dev-config-overrides'

export function mergeAppPreviewConfig(base: AppPreviewConfig, patch: Partial<AppPreviewConfig>): AppPreviewConfig {
  return {
    ...base,
    ...patch,
    structureData: base.structureData,
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

/** 仅序列化可 JSON 化的覆盖项（不含函数，除非调用方单独处理） */
export function saveDevOverrides(patch: Partial<AppPreviewConfig>): void {
  if (typeof localStorage === 'undefined') return
  const serializable: Record<string, unknown> = {}
  if (patch.showBlockStatsSidebar !== undefined) serializable.showBlockStatsSidebar = patch.showBlockStatsSidebar
  if (patch.initialLayerWorldY !== undefined) serializable.initialLayerWorldY = patch.initialLayerWorldY
  if (patch.initialProjectionMode !== undefined) serializable.initialProjectionMode = patch.initialProjectionMode
  if (patch.sceneBackground !== undefined) serializable.sceneBackground = patch.sceneBackground
  if (patch.blockIconCacheOptions !== undefined) serializable.blockIconCacheOptions = patch.blockIconCacheOptions
  if (patch.loadingMessage !== undefined) serializable.loadingMessage = patch.loadingMessage
  localStorage.setItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY, JSON.stringify(serializable))
}

export function clearDevOverrides(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(DEV_CONFIG_OVERRIDES_STORAGE_KEY)
}

export function buildActiveAppPreviewConfig(base: AppPreviewConfig): AppPreviewConfig {
  return mergeAppPreviewConfig(base, loadDevOverrides())
}
