/**
 * 使用 SDE `structure.capture`（Block→Quad→顶点）构建网格，不依赖 block/model 注册表。
 * 与 {@link ./blockMesh buildBlockMesh} 体素路径互斥：仅当存在 `capture.instances` 时进入本路径。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { MaterialLibraryApi } from '../materials/simpleMaterialLibrary'
import type { MeshCaptureInstance, MeshCaptureQuad, StructureDefinition } from '../schema/types'
import { isAirState } from '../schema/types'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import type { BlockMeshBuildStats, BlockMeshResult, BuildBlockMeshOptions, UndefinedBlockDetail } from './blockMesh'

function countCellGridNonAir(def: StructureDefinition): number {
  const { cellGrid, palette } = def
  let n = 0
  for (const slice of cellGrid) {
    for (const row of slice) {
      for (const idx of row) {
        const v = palette[idx]
        if (v && !isAirState(v)) n++
      }
    }
  }
  return n
}

function parseTintFromArgb(argb: number | undefined): THREE.Color {
  if (argb === undefined || !Number.isFinite(argb)) return new THREE.Color(0xffffff)
  const a = (argb >>> 24) & 0xff
  const r = (argb >>> 16) & 0xff
  const g = (argb >>> 8) & 0xff
  const b = argb & 0xff
  if (a < 8) return new THREE.Color(0xffffff)
  const c = new THREE.Color(r / 255, g / 255, b / 255)
  return c
}

/**
 * SDE 顶点为方块局部 [0,1]³；instance.x/y/z 为结构内格点（与 cellGrid 列 / 局部 Y / Z 切片一致，见 MeshCaptureService）。
 * 与 {@link ../data/grid voxelCenterWorld} 对齐：居中世界坐标 = 格点 + 局部 − 各向尺寸的一半。
 */
function bufferGeometryFromCapturedQuad(
  quad: MeshCaptureQuad,
  inst: MeshCaptureInstance,
  sizeColumn: number,
  sizeRow: number,
  sizeZSlice: number,
): THREE.BufferGeometry | null {
  const v = quad.vertices
  if (!v || v.length !== 4) return null
  const ox = inst.x - sizeColumn / 2
  const oy = inst.y - sizeRow / 2
  const oz = inst.z - sizeZSlice / 2
  const positions = new Float32Array(18)
  const uvs = new Float32Array(12)
  const triCorners = [
    [0, 1, 2],
    [0, 2, 3],
  ] as const
  let pi = 0
  let ui = 0
  for (const [i0, i1, i2] of triCorners) {
    for (const i of [i0, i1, i2]) {
      const p = v[i]
      positions[pi++] = p.x + ox
      positions[pi++] = p.y + oy
      positions[pi++] = p.z + oz
      uvs[ui++] = p.u
      uvs[ui++] = p.v
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  g.computeVertexNormals()
  return g
}

export async function buildCapturedMesh(
  def: StructureDefinition,
  library: MaterialLibraryApi,
  _options?: BuildBlockMeshOptions,
): Promise<BlockMeshResult> {
  const cap = def.capture
  if (!cap?.instances?.length) {
    throw new Error('buildCapturedMesh: 缺少 capture.instances')
  }
  if (cap.schemaVersion !== 2 || cap.uvSpace !== 'spriteLocal') {
    throw new Error(
      'buildCapturedMesh: 仅支持 capture.schemaVersion===2 且 uvSpace==="spriteLocal"（须先通过 validateStructureData）',
    )
  }

  const sizeZSlice = def.cellGrid.length
  const sizeRow = def.cellGrid[0]?.length ?? 0
  const sizeColumn = def.cellGrid[0]?.[0]?.length ?? 0
  if (sizeRow === 0 || sizeColumn === 0) {
    throw new Error('buildCapturedMesh: cellGrid 尺寸无效')
  }

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()

  for (const inst of cap.instances) {
    for (const quad of inst.quads ?? []) {
      const geom = bufferGeometryFromCapturedQuad(quad, inst, sizeColumn, sizeRow, sizeZSlice)
      if (!geom) continue
      const tint = parseTintFromArgb(quad.vertices[0]?.color)
      const descriptor: BatchDescriptor = {
        materialId: quad.materialKey,
        tint,
        layerIdx: 0,
        role: 'base',
      }
      const key = batchMaterialCacheKey(descriptor)
      let bucket = batches.get(key)
      if (!bucket) {
        bucket = { descriptor, geometries: [] }
        batches.set(key, bucket)
      }
      bucket.geometries.push(geom)
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

  const capturedInstanceCount = cap.instances.length
  const cellGridNonAirCount = countCellGridNonAir(def)
  const undefinedBlockDetails: UndefinedBlockDetail[] = []
  const stats: BlockMeshBuildStats = {
    nonAirVoxelCount: cellGridNonAirCount,
    capturedInstanceCount,
    skippedUnmappedCount: 0,
    unknownVoxelCount: 0,
    undefinedBlockDetails,
  }

  return { group, dispose, stats }
}
