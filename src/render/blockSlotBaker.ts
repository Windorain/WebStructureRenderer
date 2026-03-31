/**
 * 单方块 1×1×1 六面外露 + MC 物品栏视角组，仅由 BlockIconCache 调用以 RTT 烘焙。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { layersForFace, listFaceNames } from './faceResolve'
import { FACE_NORMAL } from './faceConstants'
import { createMcItemSlotViewRoot } from './mcItemViewMatrix'
import type { SimpleMaterialLibrary } from './materials/simpleMaterialLibrary'
import { structureRowToWorldY } from './structureCoords'
import { quadGeometryForFace } from './simpleMesh'
import type { BlockEntry, LayerRole, StructureDefinition } from './types'

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

export interface SingleBlockBakeResult {
  group: THREE.Group
  dispose: () => void
}

/**
 * 使用与结构网格相同的 1×1×1 体素坐标（column=0, row=0, zSlice=0），六面均生成面片。
 */
export async function buildSingleBlockPreviewGroup(
  block: BlockEntry,
  library: SimpleMaterialLibrary,
): Promise<SingleBlockBakeResult> {
  const rendererKind = block.renderer ?? 'SimpleCube'
  if (rendererKind !== 'SimpleCube') {
    throw new Error(`物品预览未实现渲染器: ${rendererKind}`)
  }

  const sizeColumn = 1
  const sizeRow = 1
  const sizeZSlice = 1
  const column = 0
  const row = 0
  const zSlice = 0
  const voxelY = structureRowToWorldY(row, sizeRow)
  const faces = listFaceNames()

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()

  for (const face of faces) {
    const layerDefs = layersForFace(block, face)
    if (!layerDefs.length) continue

    const n = FACE_NORMAL[face]
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
        column,
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

  const { root, meshParent } = createMcItemSlotViewRoot()

  const meshes: THREE.Mesh[] = []

  for (const { descriptor, geometries } of batches.values()) {
    if (!geometries.length) continue
    const merged = mergeGeometries(geometries, false)
    if (!merged) continue
    const mat = await library.getMaterialForBatch(descriptor)
    const mesh = new THREE.Mesh(merged, mat)
    mesh.renderOrder = descriptor.layerIdx
    meshParent.add(mesh)
    meshes.push(mesh)
  }

  const dispose = () => {
    for (const m of meshes) {
      m.geometry.dispose()
    }
  }

  return { group: root, dispose }
}

/** 用于缓存失效：对 blocks 表做稳定摘要（无加密，仅变更检测） */
export function summarizeBlocksForCache(blocks: StructureDefinition['blocks']): string {
  const keys = Object.keys(blocks).sort()
  return keys.map((k) => `${k}:${JSON.stringify(blocks[k])}`).join('|')
}
