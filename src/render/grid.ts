/**
 * 体素层（无 Three）：SimpleDefinition → VoxelGrid。
 * 与 StructureLib `addShape` 一致：`def.layers[c][b]`，行内下标 a；`get(a,b,c)` + symbolMap → 方块 id。
 */

import type { SimpleDefinition, VoxelGrid } from './types'

const AIR = 'air'

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
