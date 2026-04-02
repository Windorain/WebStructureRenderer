/**
 * 分层预览：在 VoxelVolume 读路径上投影，非当前 Y 层视为空气（与 simpleMesh / 拾取 / 统计一致）。
 * 世界 Y 与结构行 row 的关系见 `structureCoords.structureRowToWorldY`。
 */

import type { VoxelState, VoxelVolume } from './types'
import { AIR_VOXEL } from './types'
import { structureRowToWorldY } from './structureCoords'

export type LayerPreviewMode = 'all' | { worldY: number }

/**
 * 分层模式下，仅当 `structureRowToWorldY(row, sizeRow) === mode.worldY` 时返回真实体素；
 * 否则返回空气态。
 */
export function effectiveVoxelState(
  volume: VoxelVolume,
  column: number,
  row: number,
  zSlice: number,
  sizeRow: number,
  mode: LayerPreviewMode,
): VoxelState {
  if (mode === 'all') {
    return volume.get(column, row, zSlice)
  }
  const wy = structureRowToWorldY(row, sizeRow)
  if (wy !== mode.worldY) return AIR_VOXEL
  return volume.get(column, row, zSlice)
}

/**
 * 与 `effectiveVoxelState` 等价，仅返回 `registryId`（与旧 string 网格 id 对齐）。
 */
export function effectiveBlockId(
  volume: VoxelVolume,
  column: number,
  row: number,
  zSlice: number,
  sizeRow: number,
  mode: LayerPreviewMode,
): string {
  return effectiveVoxelState(volume, column, row, zSlice, sizeRow, mode).registryId
}
