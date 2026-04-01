/**
 * 构建时扫描 data/structures 下 JSON，供开发者面板列出可选结构。
 * 同 stem 的 `*.block_registry.json`、`*.material_registry.json` 一并索引（与 StructureDataExporter 导出约定一致）。
 */

import type { BlockRegistryData, MaterialRegistryData } from '@/render/types'

const structureJsonGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/structures/**/*.json',
  { eager: true },
)

const blockRegistryGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/structures/**/*.block_registry.json',
  { eager: true },
)

const materialRegistryGlob = import.meta.glob<{ default?: unknown } | Record<string, unknown>>(
  '../../data/structures/**/*.material_registry.json',
  { eager: true },
)

function globKeyToModuleId(key: string): string {
  const name = key.split(/[/\\]/).pop() ?? key
  return name.replace(/\.json$/i, '')
}

function siblingStemToModuleId(key: string, suffix: string): string {
  const name = key.split(/[/\\]/).pop() ?? key
  if (!name.toLowerCase().endsWith(suffix.toLowerCase())) return ''
  return name.slice(0, -suffix.length)
}

function modulePayload(data: { default?: unknown } | Record<string, unknown>): unknown {
  if (data && typeof data === 'object' && 'default' in data && data.default !== undefined) {
    return (data as { default: unknown }).default
  }
  return data
}

const idToData = new Map<string, unknown>()

for (const [key, mod] of Object.entries(structureJsonGlob)) {
  const base = globKeyToModuleId(key)
  if (base.endsWith('.block_registry') || base.endsWith('.material_registry')) continue
  const id = base
  idToData.set(id, modulePayload(mod as { default?: unknown }))
}

const idToBlockRegistry = new Map<string, BlockRegistryData>()
for (const [key, mod] of Object.entries(blockRegistryGlob)) {
  const id = siblingStemToModuleId(key, '.block_registry.json')
  if (id) idToBlockRegistry.set(id, modulePayload(mod) as BlockRegistryData)
}

const idToMaterialRegistry = new Map<string, MaterialRegistryData>()
for (const [key, mod] of Object.entries(materialRegistryGlob)) {
  const id = siblingStemToModuleId(key, '.material_registry.json')
  if (id) idToMaterialRegistry.set(id, modulePayload(mod) as MaterialRegistryData)
}

/** 已扫描到的结构模块 id（文件名去掉 .json），按字典序 */
export function listStructureModuleIds(): string[] {
  return [...idToData.keys()].sort((a, b) => a.localeCompare(b))
}

export function getStructureDataByModuleId(id: string): unknown | undefined {
  return idToData.get(id)
}

/** 与结构同 stem 的 `data/structures/<id>.block_registry.json` */
export function getExportBlockRegistryByModuleId(id: string): BlockRegistryData | undefined {
  return idToBlockRegistry.get(id)
}

/** 与结构同 stem 的 `data/structures/<id>.material_registry.json` */
export function getExportMaterialRegistryByModuleId(id: string): MaterialRegistryData | undefined {
  return idToMaterialRegistry.get(id)
}
