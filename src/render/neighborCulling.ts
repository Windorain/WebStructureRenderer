/**
 * 邻格外露面：邻格为空气，或邻格方块「不遮挡」邻面（如玻璃）时，本格该方向生成面片。
 */

import type { BlockEntry, VoxelState } from './types'
import { isAirState } from './types'
import { getBlockEntry } from './blockRegistryResolve'

export function resolveOccludesAdjacentFaces(entry: BlockEntry | undefined): boolean {
  if (entry === undefined) return true
  return entry.occludesAdjacentFaces !== false
}

/**
 * 从本格朝外方向看，邻格是否允许本格在该方向生成外露面。
 */
export function shouldExposeFaceTowardNeighbor(
  neighbor: VoxelState,
  blocks: Record<string, BlockEntry>,
): boolean {
  if (isAirState(neighbor)) return true
  const entry = getBlockEntry(blocks, neighbor.registryId, neighbor.meta)
  return !resolveOccludesAdjacentFaces(entry)
}
