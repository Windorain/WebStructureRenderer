/**
 * Simple 模式：体素 → 外露面四边形 → 按材质批次合并 → THREE.Group。
 *
 * 数据流：
 *   SimpleDefinition
 *     → buildVoxelGrid（符号 → 方块 id）
 *     → 遍历格点：非空气且邻格为空气则该朝向外露
 *     → layersForFace 得到材质层序列；每层生成一个 quad，按「材质+色调+层序+role」分批
 *     → mergeGeometries 合并同批几何体
 *     → 每面 UV：`blockFaceUv.uv8ForFace`（Minecraft 方块面约定，见该文件 Wiki 注释）
 *     → SimpleMaterialLibrary.getMaterialForBatch（纹理 / mcmeta / 动画由库负责）
 *   几何 dispose 在本模块；材质与纹理由库的 dispose() 释放。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { FaceName, LayerRole, SimpleDefinition } from './types'
import { buildVoxelGrid } from './grid'
import { layersForFace, listFaceNames } from './faceResolve'
import type { SimpleMaterialLibrary } from './materials/simpleMaterialLibrary'
import { structureRowToWorldY } from './structureCoords'
import { uv8ForFace } from './blockFaceUv'

const AIR = 'air'

/** 批次 Map 的键：材质 id | 色调 hex | 层序 | role（材质 id 勿含分隔符 '|'） */
const BATCH_SEP = '|' as const

const FACE_NORMAL: Record<FaceName, THREE.Vector3> = {
  '+x': new THREE.Vector3(1, 0, 0),
  '-x': new THREE.Vector3(-1, 0, 0),
  '+y': new THREE.Vector3(0, 1, 0),
  '-y': new THREE.Vector3(0, -1, 0),
  '+z': new THREE.Vector3(0, 0, 1),
  '-z': new THREE.Vector3(0, 0, -1),
}

/**
 * 邻格在 (a, structureRowB, c) 空间中的增量；structureRowB 与 layers[c][b] 的 b 一致（0=顶行）。
 * 世界 +Y 对应更小 structureRowB（StructureLib 的 b 轴为 DOWN）。
 */
const NEIGHBOR_D: Record<FaceName, [number, number, number]> = {
  '+x': [1, 0, 0],
  '-x': [-1, 0, 0],
  '+y': [0, -1, 0],
  '-y': [0, 1, 0],
  '+z': [0, 0, 1],
  '-z': [0, 0, -1],
}

function parseTint(hex?: string): THREE.Color {
  if (!hex) return new THREE.Color(0xffffff)
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`)
}

function effectiveLayerRole(layer: { layerRole?: LayerRole }, layerIdx: number): LayerRole {
  return layer.layerRole ?? (layerIdx === 0 ? 'base' : 'cutout')
}

function makeBatchKey(
  materialId: string,
  tint: THREE.Color,
  layerIdx: number,
  role: LayerRole,
): string {
  return [materialId, tint.getHexString(), String(layerIdx), role].join(BATCH_SEP)
}

function parseBatchKey(key: string): {
  materialId: string
  tintHex: string
  layerIdx: number
  role: LayerRole
} {
  const parts = key.split(BATCH_SEP)
  const materialId = parts[0] ?? ''
  const tintHex = parts[1] ?? 'ffffff'
  const layerIdx = Number(parts[2] ?? 0)
  const role = (parts[3] ?? 'base') as LayerRole
  return { materialId, tintHex, layerIdx, role }
}

export interface SimpleMeshResult {
  group: THREE.Group
  /** 仅释放合并后的几何体；材质由 SimpleMaterialLibrary.dispose 释放 */
  dispose: () => void
}

export async function buildSimpleMesh(
  def: SimpleDefinition,
  library: SimpleMaterialLibrary,
): Promise<SimpleMeshResult> {
  const grid = buildVoxelGrid(def)
  const { sizeA, sizeB, sizeC } = grid

  type BatchKey = string
  const batches = new Map<BatchKey, THREE.BufferGeometry[]>()
  const faces = listFaceNames()

  for (let c = 0; c < sizeC; c++) {
    for (let rowB = 0; rowB < sizeB; rowB++) {
      for (let a = 0; a < sizeA; a++) {
        const id = grid.get(a, rowB, c)
        if (id === AIR) continue

        const block = def.blocks[id]
        if (!block) continue

        for (const face of faces) {
          const [da, db, dc] = NEIGHBOR_D[face]
          const neighbor = grid.get(a + da, rowB + db, c + dc)
          if (neighbor !== AIR) continue

          const layerDefs = layersForFace(block, face)
          if (!layerDefs.length) continue

          const n = FACE_NORMAL[face]
          const voxelY = structureRowToWorldY(rowB, sizeB)
          layerDefs.forEach((layer, layerIdx) => {
            const materialId = layer.materialId
            const tint = parseTint(layer.tint)
            const role = effectiveLayerRole(layer, layerIdx)
            const key = makeBatchKey(materialId, tint, layerIdx, role)
            const geom = quadGeometryForFace(
              face,
              a,
              voxelY,
              c,
              sizeA,
              sizeB,
              sizeC,
              n,
              layerIdx,
            )
            const arr = batches.get(key) ?? []
            arr.push(geom)
            batches.set(key, arr)
          })
        }
      }
    }
  }

  const group = new THREE.Group()
  const meshes: THREE.Mesh[] = []

  for (const [key, geoms] of batches) {
    if (!geoms.length) continue
    const { materialId, tintHex, layerIdx, role } = parseBatchKey(key)

    const merged = mergeGeometries(geoms, false)
    if (!merged) continue
    const tint = new THREE.Color(`#${tintHex}`)
    const mat = await library.getMaterialForBatch(key, materialId, tint, role)
    const mesh = new THREE.Mesh(merged, mat)
    mesh.renderOrder = layerIdx
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

/** 单格单面四边形：a、c 为体素列/片；voxelY 为世界体素 Y（0=包围盒底）；略沿法线偏移避免 z-fighting */
function quadGeometryForFace(
  face: FaceName,
  a: number,
  voxelY: number,
  c: number,
  sa: number,
  sb: number,
  sc: number,
  normal: THREE.Vector3,
  layerIdx: number,
): THREE.BufferGeometry {
  const ox = 0.002 * layerIdx
  const push = normal.clone().multiplyScalar(ox)

  const minX = a - sa / 2
  const maxX = a + 1 - sa / 2
  const minY = voxelY - sb / 2
  const maxY = voxelY + 1 - sb / 2
  const minZ = c - sc / 2
  const maxZ = c + 1 - sc / 2

  const p = (v: THREE.Vector3) => v.add(push)

  let q0: THREE.Vector3
  let q1: THREE.Vector3
  let q2: THREE.Vector3
  let q3: THREE.Vector3

  switch (face) {
    case '+x':
      q0 = p(new THREE.Vector3(maxX, minY, minZ))
      q1 = p(new THREE.Vector3(maxX, maxY, minZ))
      q2 = p(new THREE.Vector3(maxX, maxY, maxZ))
      q3 = p(new THREE.Vector3(maxX, minY, maxZ))
      break
    case '-x':
      q0 = p(new THREE.Vector3(minX, minY, maxZ))
      q1 = p(new THREE.Vector3(minX, maxY, maxZ))
      q2 = p(new THREE.Vector3(minX, maxY, minZ))
      q3 = p(new THREE.Vector3(minX, minY, minZ))
      break
    case '+y':
      q0 = p(new THREE.Vector3(minX, maxY, minZ))
      q1 = p(new THREE.Vector3(minX, maxY, maxZ))
      q2 = p(new THREE.Vector3(maxX, maxY, maxZ))
      q3 = p(new THREE.Vector3(maxX, maxY, minZ))
      break
    case '-y':
      q0 = p(new THREE.Vector3(minX, minY, minZ))
      q1 = p(new THREE.Vector3(maxX, minY, minZ))
      q2 = p(new THREE.Vector3(maxX, minY, maxZ))
      q3 = p(new THREE.Vector3(minX, minY, maxZ))
      break
    case '+z':
      q0 = p(new THREE.Vector3(minX, minY, maxZ))
      q1 = p(new THREE.Vector3(maxX, minY, maxZ))
      q2 = p(new THREE.Vector3(maxX, maxY, maxZ))
      q3 = p(new THREE.Vector3(minX, maxY, maxZ))
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
