/**
 * BlockMeshKind.Model：MC 方块模型 JSON 子集（elements + faces）→ 与 SimpleCube 同批次合并策略。
 */

import * as THREE from 'three'

import type {
  BlockEntry,
  FaceLayerDef,
  FaceName,
  ModelDocument,
  ModelElement,
  ModelElementFaceDef,
  ModelFaceName,
  ModelRegistryData,
  StructureDefinition,
} from './types'
import { isAirState } from './types'
import { getBlockEntry } from './blockRegistryResolve'
import { shouldExposeFaceTowardNeighbor } from './neighborCulling'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { buildVoxelVolume } from './grid'
import { FACE_NORMAL } from './faceConstants'
import { NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import { structureRowToWorldY } from './structureCoords'
import { uv8ForFace } from './blockFaceUv'
import { effectiveVoxelState, type LayerPreviewMode } from './layerPreview'
import type { LayerRole } from './types'

const MC_FACE_TO_WORLD: Record<ModelFaceName, FaceName> = {
  east: '+x',
  west: '-x',
  up: '+y',
  down: '-y',
  south: '+z',
  north: '-z',
}

function stripTextureRef(ref: string): string {
  if (ref.startsWith('#')) return ref.slice(1)
  return ref
}

function modelFaceToLayerDefs(def: ModelElementFaceDef): FaceLayerDef[] {
  if (def.layers && def.layers.length > 0) {
    return def.layers.map((L) => ({
      materialId: stripTextureRef(L.texture),
      layerRole: L.layerRole,
      tint: L.tint,
    }))
  }
  if (def.texture) {
    return [{ materialId: stripTextureRef(def.texture), layerRole: 'base' }]
  }
  return []
}

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

/** 像素 UV [u1,v1,u2,v2]（0–16）→ 四角归一化，顶点顺序与 uv8ForFace 一致 */
function normalizedUvForFace(
  face: FaceName,
  uv: [number, number, number, number] | undefined,
): Float32Array {
  if (!uv) return uv8ForFace(face)
  const [a, b, c, d] = uv
  const uMin = Math.min(a, c) / 16
  const uMax = Math.max(a, c) / 16
  const vMin = Math.min(b, d) / 16
  const vMax = Math.max(b, d) / 16
  const base = uv8ForFace(face)
  const map = (bu: number, bv: number) => {
    const u = uMin + bu * (uMax - uMin)
    const v = vMin + bv * (vMax - vMin)
    return [u, v] as const
  }
  const out = new Float32Array(8)
  for (let i = 0; i < 4; i++) {
    const [nu, nv] = map(base[i * 2], base[i * 2 + 1])
    out[i * 2] = nu
    out[i * 2 + 1] = nv
  }
  return out
}

/**
 * 轴对齐盒上一外露面；法线朝外，顶点顺序与 blockFaceUv / quadGeometryForFace 一致。
 */
export function quadGeometryForAxisFace(
  face: FaceName,
  worldMinX: number,
  worldMaxX: number,
  worldMinY: number,
  worldMaxY: number,
  worldMinZ: number,
  worldMaxZ: number,
  uvs: Float32Array,
  layerIdx: number,
): THREE.BufferGeometry {
  const normal = FACE_NORMAL[face]
  const ox = 0.002 * layerIdx
  const push = normal.clone().multiplyScalar(ox)

  const p = (v: THREE.Vector3) => v.add(push)

  const minX = worldMinX
  const maxX = worldMaxX
  const minY = worldMinY
  const maxY = worldMaxY
  const minZ = worldMinZ
  const maxZ = worldMaxZ

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
  const index = new Uint16Array([0, 1, 2, 0, 2, 3])

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(new THREE.BufferAttribute(index, 1))
  return geo
}

function elementWorldBounds(
  el: ModelElement,
  col: number,
  row: number,
  zSlice: number,
  sizeColumn: number,
  sizeRow: number,
  sizeZSlice: number,
): { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number } {
  const [fx, fy, fz] = el.from
  const [tx, ty, tz] = el.to
  const ax = Math.min(fx, tx)
  const bx = Math.max(fx, tx)
  const ay = Math.min(fy, ty)
  const by = Math.max(fy, ty)
  const az = Math.min(fz, tz)
  const bz = Math.max(fz, tz)

  const baseX = col - sizeColumn / 2
  const baseZ = zSlice - sizeZSlice / 2
  const voxelY = structureRowToWorldY(row, sizeRow)
  const baseY = voxelY - sizeRow / 2

  return {
    minX: baseX + ax / 16,
    maxX: baseX + bx / 16,
    minY: baseY + ay / 16,
    maxY: baseY + by / 16,
    minZ: baseZ + az / 16,
    maxZ: baseZ + bz / 16,
  }
}

function getModelDoc(registry: ModelRegistryData, modelId: string): ModelDocument {
  const doc = registry.models[modelId]
  if (!doc || !doc.elements?.length) {
    throw new Error(`model_registry 缺少模型: ${modelId}`)
  }
  return doc
}

export interface ModelMeshCollectContext {
  batches: Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>
  def: StructureDefinition
  volume: ReturnType<typeof buildVoxelVolume>
  layerPreview: LayerPreviewMode
  sizeColumn: number
  sizeRow: number
  sizeZSlice: number
}

/** 将某体素的 Model 几何并入 batches（与 buildBlockMesh 共享批次表） */
export function collectModelVoxelMeshes(ctx: ModelMeshCollectContext, col: number, row: number, zSlice: number): void {
  const state = effectiveVoxelState(ctx.volume, col, row, zSlice, ctx.sizeRow, ctx.layerPreview)
  if (isAirState(state)) return

  const block = getBlockEntry(ctx.def.blocks, state.registryId, state.meta)
  if (!block || block.meshKind !== 'Model') return
  const modelId = block.modelId
  if (!modelId) throw new Error(`Model 方块缺少 modelId: ${state.registryId}`)

  const doc = getModelDoc(ctx.def.modelRegistry, modelId)

  for (const el of doc.elements) {
    const { minX, maxX, minY, maxY, minZ, maxZ } = elementWorldBounds(
      el,
      col,
      row,
      zSlice,
      ctx.sizeColumn,
      ctx.sizeRow,
      ctx.sizeZSlice,
    )
    const faces = el.faces ?? {}
    for (const mcFace of Object.keys(faces) as ModelFaceName[]) {
      const faceDef = faces[mcFace]
      if (!faceDef) continue
      const worldFace = MC_FACE_TO_WORLD[mcFace]
      if (!worldFace) continue

      const [dCol, dRow, dZ] = NEIGHBOR_STRUCTURE_DELTA[worldFace]
      const neighborState = effectiveVoxelState(
        ctx.volume,
        col + dCol,
        row + dRow,
        zSlice + dZ,
        ctx.sizeRow,
        ctx.layerPreview,
      )
      if (!shouldExposeFaceTowardNeighbor(state, neighborState, ctx.def.blocks)) continue

      const layerDefs = modelFaceToLayerDefs(faceDef)
      if (!layerDefs.length) continue

      const uvs = normalizedUvForFace(worldFace, faceDef.uv)

      layerDefs.forEach((layer, layerIdx) => {
        const descriptor: BatchDescriptor = {
          materialId: layer.materialId,
          tint: parseTint(layer.tint),
          layerIdx,
          role: effectiveLayerRole(layer, layerIdx),
        }
        const key = batchMaterialCacheKey(descriptor)
        const geom = quadGeometryForAxisFace(
          worldFace,
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          uvs,
          layerIdx,
        )
        let bucket = ctx.batches.get(key)
        if (!bucket) {
          bucket = { descriptor, geometries: [] }
          ctx.batches.set(key, bucket)
        }
        bucket.geometries.push(geom)
      })
    }
  }
}

/** 单方块 1×1×1 预览（物品栏 RTT）：column=0,row=0,zSlice=0 */
export function collectSingleBlockModelMeshes(
  block: BlockEntry,
  modelRegistry: ModelRegistryData,
  batches: ModelMeshCollectContext['batches'],
): void {
  if (block.meshKind !== 'Model' || !block.modelId) return
  const doc = getModelDoc(modelRegistry, block.modelId)
  const sizeColumn = 1
  const sizeRow = 1
  const sizeZSlice = 1
  const col = 0
  const row = 0
  const zSlice = 0

  for (const el of doc.elements) {
    const { minX, maxX, minY, maxY, minZ, maxZ } = elementWorldBounds(
      el,
      col,
      row,
      zSlice,
      sizeColumn,
      sizeRow,
      sizeZSlice,
    )
    const faceMap = el.faces ?? {}
    for (const mcFace of Object.keys(faceMap) as ModelFaceName[]) {
      const faceDef = faceMap[mcFace]
      if (!faceDef) continue
      const worldFace = MC_FACE_TO_WORLD[mcFace]
      if (!worldFace) continue
      const layerDefs = modelFaceToLayerDefs(faceDef)
      if (!layerDefs.length) continue
      const uvs = normalizedUvForFace(worldFace, faceDef.uv)
      layerDefs.forEach((layer, layerIdx) => {
        const descriptor: BatchDescriptor = {
          materialId: layer.materialId,
          tint: parseTint(layer.tint),
          layerIdx,
          role: effectiveLayerRole(layer, layerIdx),
        }
        const key = batchMaterialCacheKey(descriptor)
        const geom = quadGeometryForAxisFace(
          worldFace,
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          uvs,
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
