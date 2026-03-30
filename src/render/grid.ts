/**
 * 由 SimpleDefinition 构建体素网格查询。
 *
 * 与 StructureLib `addShape` 一致：`def.layers[c][b]` 为第 c 片、第 b 行字符串；
 * 行内下标为 a。`get(a,b,c)` 与 `symbolMap` 得到方块逻辑 id。
 *
 * 越界或缺行/缺字符视为空气；symbolMap 中未定义的字符映射为 'air'。
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
