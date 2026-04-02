/**
 * 方块说明文案：来自合并后的 StructureDefinition.blocks（block_registry 等）。
 */

import type { StructureDefinition } from '../schema/types'

export function resolveBlockTooltip(blockId: string, def: StructureDefinition): string {
  const entry = def.blocks[blockId]
  if (!entry) return blockId
  const title = entry.label?.trim()
  const desc = entry.description?.trim()
  if (title && desc) return `${title}\n${desc}`
  if (title) return title
  if (desc) return desc
  return blockId
}
