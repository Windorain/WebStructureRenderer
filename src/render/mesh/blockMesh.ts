/**
 * 按 BlockMeshKind 分发：SimpleCube 与 Model 共用批次合并与材质库。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { LayerRole, StructureDefinition } from '../schema/types'
import { isAirState } from '../schema/types'
import { getBlockEntry } from '../data/blockRegistryResolve'
import { shouldExposeFaceTowardNeighbor } from '../data/neighborCulling'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { buildVoxelVolume } from '../data/grid'
import { layersForFace, listFaceNames } from './faceResolve'
import { FACE_NORMAL, NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import type { SimpleMaterialLibrary } from '../materials/simpleMaterialLibrary'
import { structureRowToWorldY } from '../data/structureCoords'
import { quadGeometryForFace } from './quadGeometry'
import { effectiveVoxelState, type LayerPreviewMode } from '../data/layerPreview'
import { collectModelVoxelMeshes, type ModelMeshCollectContext } from './modelMesh'

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

export interface BlockMeshResult {
  group: THREE.Group
  dispose: () => void
}

export async function buildBlockMesh(
  def: StructureDefinition,
  library: SimpleMaterialLibrary,
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

  for (let zSlice = 0; zSlice < sizeZSlice; zSlice++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        const state = effectiveVoxelState(volume, col, row, zSlice, sizeRow, layerPreview)
        if (isAirState(state)) continue

        const block = getBlockEntry(def.blocks, state.registryId, state.meta)
        if (!block) continue

        const meshKind = block.meshKind
        if (meshKind === 'Unknown') continue

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

          const layerDefs = layersForFace(block, face)
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

  return { group, dispose }
}
