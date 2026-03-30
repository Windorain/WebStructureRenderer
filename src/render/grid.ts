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
