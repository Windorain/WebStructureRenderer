/**
 * 由 SimpleDefinition 构建体素网格查询。
 *
 * 数据流：
 *   def.layers[y][z] 为一行字符；def.symbolMap 将字符映射为方块 id（或 'air'）。
 *   索引约定：x 沿行宽，y 沿层，z 沿行方向（与 layers 二维数组一致）。
 *
 * 越界或缺行/缺字符视为空气；symbolMap 中未定义的字符映射为 'air'。
 */

import type { SimpleDefinition, VoxelGrid } from './types'

const AIR = 'air'

export function buildVoxelGrid(def: SimpleDefinition): VoxelGrid {
  const layers = def.layers
  const sizeY = layers.length
  const sizeZ = layers[0]?.length ?? 0
  const sizeX = layers[0]?.[0]?.length ?? 0

  const symbolMap = def.symbolMap

  return {
    sizeX,
    sizeY,
    sizeZ,
    get(x: number, y: number, z: number): string {
      if (x < 0 || y < 0 || z < 0 || x >= sizeX || y >= sizeY || z >= sizeZ) return AIR
      const row = layers[y]?.[z]
      if (!row) return AIR
      const ch = row[x] ?? ' '
      const sym = symbolMap[ch] ?? AIR
      return sym === 'air' ? AIR : sym
    },
  }
}
