/**
 * 结构体素 → 按 blockId 计数（不含 air），供侧栏等只读展示。
 * 与 `simpleMesh` 一致：`LayerPreviewMode` 下切片外体素视为空气。
 */

import { buildVoxelGrid } from './grid'
import { effectiveBlockId, type LayerPreviewMode } from './layerPreview'
import type { StructureDefinition } from './types'

const AIR = 'air'

export interface BlockStatRow {
  blockId: string
  count: number
}

/** 遍历体素网格，统计每种非空气方块出现次数（与 `effectiveBlockId` 语义一致） */
export function countBlocksById(
  def: StructureDefinition,
  layerPreview: LayerPreviewMode = 'all',
): Map<string, number> {
  const grid = buildVoxelGrid(def)
  const { sizeColumn, sizeRow, sizeZSlice } = grid
  const counts = new Map<string, number>()

  for (let zSlice = 0; zSlice < sizeZSlice; zSlice++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        const id = effectiveBlockId(grid, col, row, zSlice, sizeRow, layerPreview)
        if (id === AIR) continue
        counts.set(id, (counts.get(id) ?? 0) + 1)
      }
    }
  }
  return counts
}

/**
 * 生成侧栏行：按 blockId 字典序排序，仅含 count > 0。
 */
export function buildBlockStatsEntries(
  def: StructureDefinition,
  layerPreview: LayerPreviewMode = 'all',
): BlockStatRow[] {
  const counts = countBlocksById(def, layerPreview)
  const rows: BlockStatRow[] = []
  for (const [blockId, count] of counts) {
    if (count > 0) rows.push({ blockId, count })
  }
  rows.sort((a, b) => a.blockId.localeCompare(b.blockId))
  return rows
}
