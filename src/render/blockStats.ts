/**
 * 结构体素 → 按 blockId 计数（不含 air），供侧栏等只读展示。
 */

import { buildVoxelGrid } from './grid'
import type { StructureDefinition } from './types'

const AIR = 'air'

export interface BlockStatRow {
  blockId: string
  count: number
}

/** 遍历体素网格，统计每种非空气方块出现次数 */
export function countBlocksById(def: StructureDefinition): Map<string, number> {
  const grid = buildVoxelGrid(def)
  const { sizeA, sizeB, sizeC } = grid
  const counts = new Map<string, number>()

  for (let c = 0; c < sizeC; c++) {
    for (let b = 0; b < sizeB; b++) {
      for (let a = 0; a < sizeA; a++) {
        const id = grid.get(a, b, c)
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
export function buildBlockStatsEntries(def: StructureDefinition): BlockStatRow[] {
  const counts = countBlocksById(def)
  const rows: BlockStatRow[] = []
  for (const [blockId, count] of counts) {
    if (count > 0) rows.push({ blockId, count })
  }
  rows.sort((a, b) => a.blockId.localeCompare(b.blockId))
  return rows
}
