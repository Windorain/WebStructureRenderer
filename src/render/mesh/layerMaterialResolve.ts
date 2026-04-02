/**
 * `FaceLayerDef.materialResolve`：在 blockMesh 中把声明式规则解析为最终 materialId。
 */

import type { BlockEntry, FaceLayerDef, VoxelVolume } from '../schema/types'
import { isAirState } from '../schema/types'
import { blockRegistryKeyForPalette } from '../data/blockRegistryResolve'
import { effectiveVoxelState, type LayerPreviewMode } from '../data/layerPreview'
import { NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import { listFaceNames } from './faceResolve'

export interface NeighborShellResolveContext {
  volume: VoxelVolume
  col: number
  row: number
  zSlice: number
  sizeRow: number
  layerPreview: LayerPreviewMode
  /** `neighborShell`：邻格 casing 映射用 */
  blocks?: Record<string, BlockEntry>
  /** `neighborShellBlock`：当前格 `palette.shellMaterialId`（SDE 采样）；优先于 layer 静态贴图 */
  voxelShellMaterialId?: string
}

/** 无结构邻接时（单块预览）用回退；结构内 neighborShell 用邻格 casing 映射 */
export function resolveFaceLayerMaterialId(
  layer: FaceLayerDef,
  ctx: NeighborShellResolveContext | null,
): string {
  const rule = layer.materialResolve
  if (!rule) return layer.materialId

  if (rule.type === 'neighborShellBlock') {
    const fallback = rule.fallbackMaterialId ?? layer.materialId
    const sampled = ctx?.voxelShellMaterialId
    if (typeof sampled === 'string' && sampled.length > 0) {
      return sampled
    }
    return fallback
  }

  if (rule.type !== 'neighborShell') return layer.materialId
  const fallback = rule.fallbackMaterialId ?? layer.materialId
  if (!ctx) return fallback

  for (const face of listFaceNames()) {
    const [dCol, dRow, dZ] = NEIGHBOR_STRUCTURE_DELTA[face]
    const neighbor = effectiveVoxelState(
      ctx.volume,
      ctx.col + dCol,
      ctx.row + dRow,
      ctx.zSlice + dZ,
      ctx.sizeRow,
      ctx.layerPreview,
    )
    if (isAirState(neighbor)) continue
    const keyFull = blockRegistryKeyForPalette(neighbor.registryId, neighbor.meta)
    const mid = rule.casingToMaterialId[keyFull]
    if (mid !== undefined) return mid
    const midBare = rule.casingToMaterialId[neighbor.registryId]
    if (midBare !== undefined) return midBare
  }
  return fallback
}

export function collectMaterialIdsFromFaceLayer(layer: FaceLayerDef): string[] {
  const ids = [layer.materialId]
  const rule = layer.materialResolve
  if (rule?.type === 'neighborShellBlock') {
    if (rule.fallbackMaterialId) ids.push(rule.fallbackMaterialId)
    return ids
  }
  if (rule?.type === 'neighborShell') {
    if (rule.fallbackMaterialId) ids.push(rule.fallbackMaterialId)
    for (const v of Object.values(rule.casingToMaterialId)) {
      if (v) ids.push(v)
    }
  }
  return ids
}

export function collectMaterialIdsFromBlockEntry(entry: BlockEntry): Set<string> {
  const ids = new Set<string>()
  const faces = entry.faces ?? {}
  for (const def of Object.values(faces)) {
    if (!def?.layers) continue
    for (const layer of def.layers) {
      collectMaterialIdsFromFaceLayer(layer).forEach((id) => ids.add(id))
    }
  }
  return ids
}
