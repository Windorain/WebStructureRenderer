/**
 * Simple 模式：体素 → 外露面四边形 → 按材质批次合并 → THREE.Group。
 *
 * 数据流：
 *   SimpleDefinition
 *     → buildVoxelGrid（符号 → 方块 id）
 *     → 可选 layerPreview：切片外视为空气（effectiveBlockId）
 *     → 遍历格点：非空气且邻格为空气则该朝向外露
 *     → layersForFace 得到材质层序列；每层生成一个 quad，按「材质+色调+层序+role」分批
 *     → mergeGeometries 合并同批几何体（批次元数据见 `batchDescriptor`）
 *     → 每面 UV / 顶点：`blockFaceUv.uv8ForFace` + `quadGeometryForFace`（与 MyCTMLib `QuadRender` + `UVDomain` 满格约定一致）
 *     → SimpleMaterialLibrary.getMaterialForBatch(descriptor)（纹理 / mcmeta / 动画由库负责）
 *   几何 dispose 在本模块；材质与纹理由库的 dispose() 释放。
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { FaceName, LayerRole, SimpleDefinition } from './types'
import { batchMaterialCacheKey, type BatchDescriptor } from './batchDescriptor'
import { buildVoxelGrid } from './grid'
import { layersForFace, listFaceNames } from './faceResolve'
import { FACE_NORMAL, NEIGHBOR_STRUCTURE_DELTA } from './faceConstants'
import type { SimpleMaterialLibrary } from './materials/simpleMaterialLibrary'
import { structureRowToWorldY } from './structureCoords'
import { uv8ForFace } from './blockFaceUv'
import { effectiveBlockId, type LayerPreviewMode } from './layerPreview'

const AIR = 'air'

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
  def: SimpleDefinition,
  library: SimpleMaterialLibrary,
  options?: BuildSimpleMeshOptions,
): Promise<SimpleMeshResult> {
  const layerPreview: LayerPreviewMode = options?.layerPreview ?? 'all'
  const grid = buildVoxelGrid(def)
  const { sizeA, sizeB, sizeC } = grid

  const batches = new Map<string, { descriptor: BatchDescriptor; geometries: THREE.BufferGeometry[] }>()
  const faces = listFaceNames()

  for (let c = 0; c < sizeC; c++) {
    for (let rowB = 0; rowB < sizeB; rowB++) {
      for (let a = 0; a < sizeA; a++) {
        const id = effectiveBlockId(grid, a, rowB, c, sizeB, layerPreview)
        if (id === AIR) continue

        const block = def.blocks[id]
        if (!block) continue

        for (const face of faces) {
          const [da, db, dc] = NEIGHBOR_STRUCTURE_DELTA[face]
          const neighbor = effectiveBlockId(
            grid,
            a + da,
            rowB + db,
            c + dc,
            sizeB,
            layerPreview,
          )
          if (neighbor !== AIR) continue

          const layerDefs = layersForFace(block, face)
          if (!layerDefs.length) continue

          const n = FACE_NORMAL[face]
          const voxelY = structureRowToWorldY(rowB, sizeB)
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
              a,
              voxelY,
              c,
              sizeA,
              sizeB,
              sizeC,
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
 * 单格单面四边形：a、c 为体素列/片；voxelY 为包围盒内体素层 Y 索引（经 structureRowToWorldY）；略沿法线偏移避免 z-fighting。
 *
 * **顶点**：与 MyCTMLib `QuadRender.drawFace` 中 `addVertexWithUV` 四条顶点顺序一致（Forge 面名见 `faceConstants`）。
 * **UV**：`blockFaceUv.uv8ForFace` 使用同一约定（满 tile 时 minU/maxU/minV/maxV → 0/1）。
 * 三角索引 `(0,1,2)(0,2,3)`。
 */
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
    case '+x': // EAST — QuadRender case EAST
      q0 = p(new THREE.Vector3(maxX, minY, maxZ))
      q1 = p(new THREE.Vector3(maxX, minY, minZ))
      q2 = p(new THREE.Vector3(maxX, maxY, minZ))
      q3 = p(new THREE.Vector3(maxX, maxY, maxZ))
      break
    case '-x': // WEST
      q0 = p(new THREE.Vector3(minX, maxY, maxZ))
      q1 = p(new THREE.Vector3(minX, maxY, minZ))
      q2 = p(new THREE.Vector3(minX, minY, minZ))
      q3 = p(new THREE.Vector3(minX, minY, maxZ))
      break
    case '+y': // UP
      q0 = p(new THREE.Vector3(maxX, maxY, maxZ))
      q1 = p(new THREE.Vector3(maxX, maxY, minZ))
      q2 = p(new THREE.Vector3(minX, maxY, minZ))
      q3 = p(new THREE.Vector3(minX, maxY, maxZ))
      break
    case '-y': // DOWN
      q0 = p(new THREE.Vector3(minX, minY, maxZ))
      q1 = p(new THREE.Vector3(minX, minY, minZ))
      q2 = p(new THREE.Vector3(maxX, minY, minZ))
      q3 = p(new THREE.Vector3(maxX, minY, maxZ))
      break
    case '+z': // SOUTH
      q0 = p(new THREE.Vector3(minX, maxY, maxZ))
      q1 = p(new THREE.Vector3(minX, minY, maxZ))
      q2 = p(new THREE.Vector3(maxX, minY, maxZ))
      q3 = p(new THREE.Vector3(maxX, maxY, maxZ))
      break
    case '-z': // NORTH
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
