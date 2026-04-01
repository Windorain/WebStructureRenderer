/**
 * 构建时扫描 `data/server/scenes/<sceneId>/`，与线上一致的三件套：document + block_registry + material_registry。
 * 缺省表时回退到 `data/registries/*`。
 */

import fallbackBlockRegistryJson from '@renderData/registries/block_registry.json'
import fallbackMaterialRegistryJson from '@renderData/registries/material_registry.json'

import type { BlockRegistryData, MaterialRegistryData, WikiRenderBundle } from '@/render/types'

const fallbackBlockRegistry = fallbackBlockRegistryJson as BlockRegistryData
const fallbackMaterialRegistry = fallbackMaterialRegistryJson as MaterialRegistryData

const documentGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/server/scenes/*/document.json',
  { eager: true },
)

const blockRegistryGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/server/scenes/*/block_registry.json',
  { eager: true },
)

const materialRegistryGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/server/scenes/*/material_registry.json',
  { eager: true },
)

function modulePayload(data: { default?: unknown } | Record<string, unknown>): unknown {
  if (data && typeof data === 'object' && 'default' in data && data.default !== undefined) {
    return (data as { default: unknown }).default
  }
  return data
}

function sceneIdFromPath(key: string, file: string): string {
  const lower = key.toLowerCase()
  if (!lower.endsWith(file.toLowerCase())) return ''
  const dir = key.slice(0, -file.length).replace(/[/\\]+$/, '')
  return dir.split(/[/\\]/).pop() ?? ''
}

const idToDocument = new Map<string, unknown>()
for (const [key, mod] of Object.entries(documentGlob)) {
  const id = sceneIdFromPath(key, 'document.json')
  if (id) idToDocument.set(id, modulePayload(mod as { default?: unknown }))
}

const idToBlockRegistry = new Map<string, BlockRegistryData>()
for (const [key, mod] of Object.entries(blockRegistryGlob)) {
  const id = sceneIdFromPath(key, 'block_registry.json')
  if (id) idToBlockRegistry.set(id, modulePayload(mod) as BlockRegistryData)
}

const idToMaterialRegistry = new Map<string, MaterialRegistryData>()
for (const [key, mod] of Object.entries(materialRegistryGlob)) {
  const id = sceneIdFromPath(key, 'material_registry.json')
  if (id) idToMaterialRegistry.set(id, modulePayload(mod) as MaterialRegistryData)
}

/** 仓库内 `data/server/scenes` 下的场景 id（目录名），字典序 */
export function listDiskSceneIds(): string[] {
  return [...idToDocument.keys()].sort((a, b) => a.localeCompare(b))
}

export function getDiskWikiRenderBundle(sceneId: string): WikiRenderBundle {
  const document = idToDocument.get(sceneId)
  if (document === undefined) {
    throw new Error(`未知场景 id（data/server/scenes）: ${sceneId}`)
  }
  return {
    document,
    blockRegistry: idToBlockRegistry.get(sceneId) ?? fallbackBlockRegistry,
    materialRegistry: idToMaterialRegistry.get(sceneId) ?? fallbackMaterialRegistry,
  }
}
