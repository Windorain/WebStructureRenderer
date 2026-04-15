/**
 * block_registry 键解析：全局表多为 `registryId`；导出表与 overlay 可为 `registryId@meta`。
 * 见 StructureDataExporter 与 `.refs/DESIGN_MEMO` 约定。
 */

import type { BlockEntry, BlockPaletteEntry, StructureDefinition } from '../schema/types'

/**
 * Palette 体素在合并后 `blocks` 表中的键：`meta === 0` 用 `registryId`，否则 `registryId@meta`。
 */
export function blockRegistryKeyForPalette(registryId: string, meta: number): string {
  return meta === 0 ? registryId : `${registryId}@${meta}`
}

function resolveBaseEntry(
  key: string,
  blocks: Record<string, BlockEntry>,
): BlockEntry | undefined {
  if (blocks[key] !== undefined) return blocks[key]
  const at = key.indexOf('@')
  if (at > 0) {
    const idOnly = key.slice(0, at)
    return blocks[idOnly]
  }
  return undefined
}

/**
 * 解析当前体素对应的 `BlockEntry`：先试 `registryId@meta`，再回退 `registryId`。
 */
export function getBlockEntry(
  blocks: Record<string, BlockEntry>,
  registryId: string,
  meta: number,
): BlockEntry | undefined {
  const k = blockRegistryKeyForPalette(registryId, meta)
  return resolveBaseEntry(k, blocks)
}

export function findBlockPaletteEntryByBlockId(
  def: StructureDefinition,
  blockId: string,
): BlockPaletteEntry | undefined {
  for (const e of def.blockPalette) {
    if (blockRegistryKeyForPalette(e.registryId, e.meta) === blockId) return e
    if (e.registryId === blockId) return e
  }
  return undefined
}
