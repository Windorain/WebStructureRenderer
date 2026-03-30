/**
 * 体素层（无 Three）：SimpleDefinition → VoxelGrid。
 * `def.layers[c][b][a]` 与 StructureLib 一致；b 为 slice 内行下标（0=GT 源码首行=结构顶）。
 * 世界 Y 放置见 `structureRowToWorldY`（simpleMesh / initialCamera）。
 * `findFirstVoxelWithBlockId`：在已有网格上扫描，供 initialCamera 等与 `buildVoxelGrid` 组合为单次构建。
 */

import type { SimpleDefinition, VoxelGrid } from './types'

const AIR = 'air'

export interface VoxelCell {
  a: number
  b: number
  c: number
}

/** 在已构建的网格上 O(n) 扫描，不重复 buildVoxelGrid */
export function findFirstVoxelWithBlockId(grid: VoxelGrid, blockId: string): VoxelCell | null {
  const { sizeA, sizeB, sizeC } = grid
  for (let c = 0; c < sizeC; c++) {
    for (let b = 0; b < sizeB; b++) {
      for (let a = 0; a < sizeA; a++) {
        if (grid.get(a, b, c) === blockId) return { a, b, c }
      }
    }
  }
  return null
}

export function buildVoxelGrid(def: SimpleDefinition): VoxelGrid {
  const layers = def.layers
  const sizeC = layers.length
  const sizeB = layers[0]?.length ?? 0
  const sizeA = layers[0]?.[0]?.length ?? 0

  const symbolMap = def.symbolMap

  return {
    sizeA,
    sizeB,
    sizeC,
    get(a: number, b: number, c: number): string {
      if (a < 0 || b < 0 || c < 0 || a >= sizeA || b >= sizeB || c >= sizeC) return AIR
      const row = layers[c]?.[b]
      if (!row) return AIR
      const ch = row[a] ?? ' '
      const sym = symbolMap[ch] ?? AIR
      return sym === 'air' ? AIR : sym
    },
  }
}
