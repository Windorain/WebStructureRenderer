/**
 * 邻格外露面：与 MC 一致，在生成 Quad 前决定是否露面。
 * - 空气邻格 → 露面；
 * - 邻格遮挡（实体等）→ 不露面；
 * - 邻格不遮挡（玻璃）且本格为实体 → 露面（透过玻璃看内）；
 * - 邻格与本格均不遮挡且为同一 palette 键 → 不露面（玻璃–玻璃共面剔除）。
 */

import type { BlockEntry, VoxelState } from './types'
import { isAirState } from './types'
import { getBlockEntry } from './blockRegistryResolve'

export function resolveOccludesAdjacentFaces(entry: BlockEntry | undefined): boolean {
  if (entry === undefined) return true
  return entry.occludesAdjacentFaces !== false
}

function samePaletteIdentity(a: VoxelState, b: VoxelState): boolean {
  return a.registryId === b.registryId && a.meta === b.meta
}

/**
 * 本格朝某方向生成 Quad 前：是否应生成该外露面（剔除在几何生成前完成）。
 */
export function shouldExposeFaceTowardNeighbor(
  current: VoxelState,
  neighbor: VoxelState,
  blocks: Record<string, BlockEntry>,
): boolean {
  if (isAirState(neighbor)) return true

  const neighborEntry = getBlockEntry(blocks, neighbor.registryId, neighbor.meta)
  if (resolveOccludesAdjacentFaces(neighborEntry)) return false

  const currentEntry = getBlockEntry(blocks, current.registryId, current.meta)
  if (resolveOccludesAdjacentFaces(currentEntry)) {
    return true
  }

  if (samePaletteIdentity(current, neighbor)) {
    return false
  }
  return true
}
