/**
 * 体素层（无 Three）：StructureDefinition → VoxelGrid。
 * `def.zSlices[zSlice][row][column]`；row 0 = 结构顶（最高 Y）；世界 Y 见 `structureRowToWorldY`。
 * `findFirstVoxelWithBlockId`：在已有网格上扫描，供 initialCamera 等与 `buildVoxelGrid` 组合为单次构建。
 */

import type { StructureDefinition, VoxelGrid } from './types'

const AIR = 'air'

export interface VoxelCell {
  column: number
  row: number
  zSlice: number
}

/** 在已构建的网格上 O(n) 扫描，不重复 buildVoxelGrid */
export function findFirstVoxelWithBlockId(grid: VoxelGrid, blockId: string): VoxelCell | null {
  const { sizeColumn, sizeRow, sizeZSlice } = grid
  for (let z = 0; z < sizeZSlice; z++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        if (grid.get(col, row, z) === blockId) return { column: col, row, zSlice: z }
      }
    }
  }
  return null
}

export function buildVoxelGrid(def: StructureDefinition): VoxelGrid {
  const zSlices = def.zSlices
  const sizeZSlice = zSlices.length
  const sizeRow = zSlices[0]?.length ?? 0
  const sizeColumn = zSlices[0]?.[0]?.length ?? 0

  const symbolMap = def.symbolMap

  return {
    sizeColumn,
    sizeRow,
    sizeZSlice,
    get(column: number, row: number, zSlice: number): string {
      if (column < 0 || row < 0 || zSlice < 0 || column >= sizeColumn || row >= sizeRow || zSlice >= sizeZSlice)
        return AIR
      const rowStr = zSlices[zSlice]?.[row]
      if (!rowStr) return AIR
      const ch = rowStr[column] ?? ' '
      const sym = symbolMap[ch] ?? AIR
      return sym === 'air' ? AIR : sym
    },
  }
}
