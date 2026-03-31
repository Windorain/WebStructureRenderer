/**
 * 分层预览：切片外体素视为空气，供 simpleMesh 邻接剔除复用。
 * 世界 Y 与结构行 b 的关系见 `structureCoords.structureRowToWorldY`。
 */

import type { VoxelGrid } from './types'
import { structureRowToWorldY } from './structureCoords'

const AIR = 'air'

export type LayerPreviewMode = 'all' | { worldY: number }

/**
 * 在分层模式下，仅当 `structureRowToWorldY(rowB, sizeB) === mode.worldY` 时返回 `grid.get`；
 * 否则返回 `air`（与 `grid` 边界外一致）。
 */
export function effectiveBlockId(
  grid: VoxelGrid,
  a: number,
  rowB: number,
  c: number,
  sizeB: number,
  mode: LayerPreviewMode,
): string {
  if (mode === 'all') {
    return grid.get(a, rowB, c)
  }
  const wy = structureRowToWorldY(rowB, sizeB)
  if (wy !== mode.worldY) return AIR
  return grid.get(a, rowB, c)
}
