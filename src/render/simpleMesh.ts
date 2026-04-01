/**
 * voxelPalette 模式：体素 → 外露面四边形 → 按材质批次合并 → THREE.Group。
 *
 * 数据流：
 *   StructureDefinition
 *     → buildVoxelVolume
 *     → 可选 layerPreview：effectiveVoxelState
 *     → 遍历格点：非空气且邻格为空气则该朝向外露
 *     → layersForFace；meshKind（非 WebGLRenderer）为 SimpleCube 等
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { FaceName, LayerRole, StructureDefinition } from './types'
import { isAirState } from './types'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { buildVoxelVolume } from './grid'
import { layersForFace, listFaceNames } from './faceResolve'
import { FACE_NORMAL, NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import type { SimpleMaterialLibrary } from './materials/simpleMaterialLibrary'
import { structureRowToWorldY } from './structureCoords'
import { uv8ForFace } from './blockFaceUv'
import { effectiveVoxelState, type LayerPreviewMode } from './layerPreview'

export interface BuildSimpleMeshOptions {
  /** 默认 `all`：显示全部；指定 `worldY` 时仅该世界体素 Y 层（0=底） */
  layerPreview?: LayerPreviewMode
}

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

export interface SimpleMeshResult {
  group: THREE.Group
  /** 仅释放合并后的几何体；材质由 SimpleMaterialLibrary.dispose 释放 */
  dispose: () => void
}

export async function buildSimpleMesh(
  def: StructureDefinition,
  library: SimpleMaterialLibrary,
  options?: BuildSimpleMeshOptions,
): Promise<SimpleMeshResult> {
  const layerPreview: LayerPreviewMode = options?.layerPreview ?? 'all'
  const volume = buildVoxelVolume(def)
  const { sizeColumn, sizeRow, sizeZSlice } = volume

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()
  const faces = listFaceNames()

  for (let zSlice = 0; zSlice < sizeZSlice; zSlice++) {
    for (let row = 0; row < sizeRow; row++) {
      for (let col = 0; col < sizeColumn; col++) {
        const state = effectiveVoxelState(volume, col, row, zSlice, sizeRow, layerPreview)
        if (isAirState(state)) continue

        const block = def.blocks[state.registryId]
        if (!block) continue

        const meshKind = block.meshKind ?? 'SimpleCube'
        if (meshKind !== 'SimpleCube') {
          throw new Error(`未实现的网格构建策略: ${meshKind}`)
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
          if (!isAirState(neighborState)) continue

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

/**
 * 单格单面四边形：column、zSlice 为体素索引；voxelY 为包围盒内体素层 Y 索引（经 structureRowToWorldY）；略沿法线偏移避免 z-fighting。
 */
/** 导出供物品栏 RTT 单方块烘焙复用（与体素网格同一套顶点/UV 约定） */
export function quadGeometryForFace(
  face: FaceName,
  column: number,
  voxelY: number,
  zSlice: number,
  sizeColumn: number,
  sizeRow: number,
  sizeZSlice: number,
  normal: THREE.Vector3,
  layerIdx: number,
): THREE.BufferGeometry {
  const ox = 0.002 * layerIdx
  const push = normal.clone().multiplyScalar(ox)

  const minX = column - sizeColumn / 2
  const maxX = column + 1 - sizeColumn / 2
  const minY = voxelY - sizeRow / 2
  const maxY = voxelY + 1 - sizeRow / 2
  const minZ = zSlice - sizeZSlice / 2
  const maxZ = zSlice + 1 - sizeZSlice / 2

  const p = (v: THREE.Vector3) => v.add(push)

  let q0: THREE.Vector3
  let q1: THREE.Vector3
  let q2: THREE.Vector3
  let q3: THREE.Vector3

  switch (face) {
    case '+x':
      q0 = p(new THREE.Vector3(maxX, minY, maxZ))
      q1 = p(new THREE.Vector3(maxX, minY, minZ))
      q2 = p(new THREE.Vector3(maxX, maxY, minZ))
      q3 = p(new THREE.Vector3(maxX, maxY, maxZ))
      break
    case '-x':
      q0 = p(new THREE.Vector3(minX, maxY, maxZ))
      q1 = p(new THREE.Vector3(minX, maxY, minZ))
      q2 = p(new THREE.Vector3(minX, minY, minZ))
      q3 = p(new THREE.Vector3(minX, minY, maxZ))
      break
    case '+y':
      q0 = p(new THREE.Vector3(maxX, maxY, maxZ))
      q1 = p(new THREE.Vector3(maxX, maxY, minZ))
      q2 = p(new THREE.Vector3(minX, maxY, minZ))
      q3 = p(new THREE.Vector3(minX, maxY, maxZ))
      break
    case '-y':
      q0 = p(new THREE.Vector3(minX, minY, maxZ))
      q1 = p(new THREE.Vector3(minX, minY, minZ))
      q2 = p(new THREE.Vector3(maxX, minY, minZ))
      q3 = p(new THREE.Vector3(maxX, minY, maxZ))
      break
    case '+z':
      q0 = p(new THREE.Vector3(minX, maxY, maxZ))
      q1 = p(new THREE.Vector3(minX, minY, maxZ))
      q2 = p(new THREE.Vector3(maxX, minY, maxZ))
      q3 = p(new THREE.Vector3(maxX, maxY, maxZ))
      break
    case '-z':
      q0 = p(new THREE.Vector3(minX, maxY, minZ))
      q1 = p(new THREE.Vector3(maxX, maxY, minZ))
      q2 = p(new THREE.Vector3(maxX, minY, minZ))
      q3 = p(new THREE.Vector3(minX, minY, minZ))
      break
    default:
      throw new Error(`unknown face ${face}`)
  }

  const nx = normal.x
  const ny = normal.y
  const nz = normal.z

  const positions = new Float32Array([
    q0.x, q0.y, q0.z,
    q1.x, q1.y, q1.z,
    q2.x, q2.y, q2.z,
    q3.x, q3.y, q3.z,
  ])
  const normals = new Float32Array([
    nx, ny, nz,
    nx, ny, nz,
    nx, ny, nz,
    nx, ny, nz,
  ])
  const uvs = uv8ForFace(face)
  const index = new Uint16Array([0, 1, 2, 0, 2, 3])

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(new THREE.BufferAttribute(index, 1))

  return geo
}
