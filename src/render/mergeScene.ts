/**
 * 合并层：StructureData + block_registry → StructureDefinition（外观表来自全局注册表，非 Three）。
 * blockRegistryOverlay 与全局表深合并；overlay 键可为 `registryId@meta`，见 blockRegistryResolve。
 */

import type { BlockEntry, BlockRegistryData, StructureData, StructureDefinition } from './types'

import blockRegistryJson from '@renderData/registries/block_registry.json'

const blockRegistry = blockRegistryJson as BlockRegistryData

function mergeBlockEntry(base: BlockEntry, partial: Partial<BlockEntry>): BlockEntry {
  return { ...base, ...partial }
}

/**
 * 将 overlay 合并进全局 blocks：同键覆盖字段；`registryId@meta` 无独立条目时以 `registryId` 为底。
 */
export function mergeBlockRegistries(
  global: Record<string, BlockEntry>,
  overlay: Record<string, Partial<BlockEntry>> | undefined,
): Record<string, BlockEntry> {
  if (!overlay || Object.keys(overlay).length === 0) {
    return { ...global }
  }
  const out: Record<string, BlockEntry> = { ...global }
  for (const [key, partial] of Object.entries(overlay)) {
    const base = out[key] ?? (key.includes('@') ? out[key.slice(0, key.indexOf('@'))] : undefined)
    if (!base) continue
    out[key] = mergeBlockEntry(base, partial)
  }
  return out
}

export function mergeStructureData(model: StructureData): StructureDefinition {
  const blocks = mergeBlockRegistries(blockRegistry.blocks, model.blockRegistryOverlay?.blocks)
  return {
    schemaVersion: model.schemaVersion,
    mode: 'voxelPalette',
    id: model.id,
    palette: model.palette,
    cellGrid: model.cellGrid,
    blocks,
    initialCamera: model.initialCamera,
  }
}
