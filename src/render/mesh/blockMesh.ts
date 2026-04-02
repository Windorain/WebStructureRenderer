/**
 * 按 BlockMeshKind 分发：SimpleCube 与 Model 共用批次合并与材质库。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { LayerRole, StructureDefinition } from '../schema/types'
import { isAirState } from '../schema/types'
import { blockRegistryKeyForPalette, getBlockEntry } from '../data/blockRegistryResolve'
import { shouldExposeFaceTowardNeighbor } from '../data/neighborCulling'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { buildVoxelVolume } from '../data/grid'
import { layersForFace, listFaceNames } from './faceResolve'
import { FACE_NORMAL, NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import type { MaterialLibraryApi } from '../materials/simpleMaterialLibrary'
import { structureRowToWorldY } from '../data/grid'
import { quadGeometryForFace } from './quadGeometry'
import { effectiveVoxelState, type LayerPreviewMode } from '../data/layerPreview'
import { collectModelVoxelMeshes, type ModelMeshCollectContext } from './modelMesh'
import { registryFaceForWorldFace } from './facingMap'

export interface BuildBlockMeshOptions {
  layerPreview?: LayerPreviewMode
}

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

/** 未映射 palette 或 meshKind=UNKNOWN 的体素汇总（按 registry 键聚合） */
export interface UndefinedBlockDetail {
  /** 与 `def.blocks` / palette 一致的键 */
  registryKey: string
  reason: 'unknown' | 'missing_palette'
  voxelCount: number
  /** reason=unknown 时来自 BlockEntry */
  label?: string
  description?: string
  renderProfile?: string
}

/** 与体素循环一致：分层预览下的「非空气」计数 */
export interface BlockMeshBuildStats {
  nonAirVoxelCount: number
  /** 无 block 条目或 meshKind=Unknown，网格阶段跳过 */
  skippedUnmappedCount: number
  /** meshKind=Unknown（block_registry 无有效几何），用于 Status 提示 */
  unknownVoxelCount: number
  /** 未定义方块的注册键与条目信息，供状态栏展示 */
  undefinedBlockDetails: UndefinedBlockDetail[]
}

export interface BlockMeshResult {
  group: THREE.Group
  dispose: () => void
  stats: BlockMeshBuildStats
}

export async function buildBlockMesh(
  def: StructureDefinition,
  library: MaterialLibraryApi,
  options?: BuildBlockMeshOptions,
): Promise<BlockMeshResult> {
  const layerPreview: LayerPreviewMode = options?.layerPreview ?? 'all'
  const volume = buildVoxelVolume(def)
  const { sizeColumn, sizeRow, sizeZSlice } = volume

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()
  const faces = listFaceNames()

  const modelCtx: ModelMeshCollectContext = {
    batches,
    def,
    volume,
    layerPreview,
    sizeColumn,
    sizeRow,
    sizeZSlice,
  }

  let nonAirVoxelCount = 0
  let skippedUnmappedCount = 0
  let unknownVoxelCount = 0
  const unknownAgg = new Map<
    string,
    { count: number; label?: string; description?: string; renderProfile?: string }
  >()
  const missingAgg = new Map<string, number>()

  for (let zSlice = 0; zSlice < sizeZSlice; zSlice++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        const state = effectiveVoxelState(volume, col, row, zSlice, sizeRow, layerPreview)
        if (isAirState(state)) continue

        nonAirVoxelCount++
        const paletteKey = blockRegistryKeyForPalette(state.registryId, state.meta)
        const block = getBlockEntry(def.blocks, state.registryId, state.meta)
        if (!block) {
          skippedUnmappedCount++
          missingAgg.set(paletteKey, (missingAgg.get(paletteKey) ?? 0) + 1)
          continue
        }

        const meshKind = block.meshKind
        if (meshKind === 'Unknown') {
          unknownVoxelCount++
          skippedUnmappedCount++
          const prev = unknownAgg.get(paletteKey)
          unknownAgg.set(paletteKey, {
            count: (prev?.count ?? 0) + 1,
            label: block.label ?? prev?.label,
            description: block.description ?? prev?.description,
            renderProfile: block.renderProfile ?? prev?.renderProfile,
          })
          continue
        }

        if (meshKind === 'Model') {
          collectModelVoxelMeshes(modelCtx, col, row, zSlice)
          continue
        }

        if (meshKind !== 'SimpleCube') {
          throw new Error(`未实现的网格构建策略: ${String(meshKind)}`)
        }

        for (const face of faces) {
          const [dCol, dRow, dZ] = NEIGHBOR_STRUCTURE_DELTA[face]
          const neighborState = effectiveVoxelState(
            volume,
            col + dCol,
            row + dRow,
            zSlice + dZ,
            sizeRow,
            layerPreview,
          )
          if (!shouldExposeFaceTowardNeighbor(state, neighborState, def.blocks)) continue

          const registryFace =
            state.facing !== undefined ? registryFaceForWorldFace(face, state.facing) : face
          const layerDefs = layersForFace(block, registryFace)
          if (!layerDefs.length) continue

          const n = FACE_NORMAL[face]
          const voxelY = structureRowToWorldY(row, sizeRow)
          layerDefs.forEach((layer, layerIdx) => {
            const descriptor: BatchDescriptor = {
              materialId: layer.materialId,
              tint: parseTint(layer.tint),
              layerIdx,
              role: effectiveLayerRole(layer, layerIdx),
            }
            const key = batchMaterialCacheKey(descriptor)
            const geom = quadGeometryForFace(
              face,
              col,
              voxelY,
              zSlice,
              sizeColumn,
              sizeRow,
              sizeZSlice,
              n,
              layerIdx,
            )
            let bucket = batches.get(key)
            if (!bucket) {
              bucket = { descriptor, geometries: [] }
              batches.set(key, bucket)
            }
            bucket.geometries.push(geom)
          })
        }
      }
    }
  }

  const group = new THREE.Group()
  const meshes: THREE.Mesh[] = []

  for (const { descriptor, geometries } of batches.values()) {
    if (!geometries.length) continue

    const merged = mergeGeometries(geometries, false)
    if (!merged) continue
    const mat = await library.getMaterialForBatch(descriptor)
    const mesh = new THREE.Mesh(merged, mat)
    mesh.renderOrder = descriptor.layerIdx
    group.add(mesh)
    meshes.push(mesh)
  }

  const dispose = () => {
    for (const m of meshes) {
      m.geometry.dispose()
    }
  }

  const undefinedBlockDetails: UndefinedBlockDetail[] = []
  for (const [registryKey, row] of unknownAgg) {
    undefinedBlockDetails.push({
      registryKey,
      reason: 'unknown',
      voxelCount: row.count,
      label: row.label,
      description: row.description,
      renderProfile: row.renderProfile,
    })
  }
  for (const [registryKey, count] of missingAgg) {
    undefinedBlockDetails.push({ registryKey, reason: 'missing_palette', voxelCount: count })
  }
  undefinedBlockDetails.sort((a, b) => {
    const ra = a.reason === 'unknown' ? 0 : 1
    const rb = b.reason === 'unknown' ? 0 : 1
    if (ra !== rb) return ra - rb
    return a.registryKey.localeCompare(b.registryKey)
  })

  return {
    group,
    dispose,
    stats: {
      nonAirVoxelCount,
      skippedUnmappedCount,
      unknownVoxelCount,
      undefinedBlockDetails,
    },
  }
}

const STATUS_DETAIL_MAX = 520

/**
 * 状态栏用：列出未定义方块的注册键、原因与条目信息（过长截断）。
 */
export function formatUndefinedBlockDetailsForStatus(details: UndefinedBlockDetail[]): string {
  if (!details.length) return ''
  const segments: string[] = []
  for (const d of details) {
    const tag = d.reason === 'unknown' ? 'UNKNOWN' : 'palette 无条目'
    const bits: string[] = []
    if (d.label) bits.push(d.label)
    if (d.renderProfile) bits.push(`profile:${d.renderProfile}`)
    if (d.description && d.description.length <= 72) bits.push(d.description)
    const info = bits.length ? `（${bits.join(' · ')}）` : ''
    segments.push(`${tag} ${d.registryKey}${info}×${d.voxelCount}`)
  }
  let out = ` · ${segments.join('；')}`
  if (out.length > STATUS_DETAIL_MAX) {
    out = `${out.slice(0, STATUS_DETAIL_MAX - 1)}…`
  }
  return out
}
