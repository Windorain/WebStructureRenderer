/**
 * 视口内鼠标 → 体素 blockId：Raycaster + 命中点推入体内 + 与 simpleMesh 一致的格点映射 + effectiveBlockId。
 */

import * as THREE from 'three'

import { buildVoxelGrid } from './grid'
import { effectiveBlockId, type LayerPreviewMode } from './layerPreview'
import type { StructureDefinition } from './types'

const AIR = 'air'
const NUDGE = 0.002

export interface PickBlockIdParams {
  clientX: number
  clientY: number
  domElement: HTMLElement
  camera: THREE.Camera
  contentGroup: THREE.Group
  def: StructureDefinition
  layerPreview: LayerPreviewMode
}

/**
 * 与 `quadGeometryForFace` 包围盒一致：世界坐标 → 体素索引。
 */
export function worldPointToVoxelIndices(
  p: THREE.Vector3,
  sizeA: number,
  sizeB: number,
  sizeC: number,
): { a: number; voxelY: number; c: number } {
  const a = Math.min(sizeA - 1, Math.max(0, Math.floor(p.x + sizeA / 2)))
  const voxelY = Math.min(sizeB - 1, Math.max(0, Math.floor(p.y + sizeB / 2)))
  const c = Math.min(sizeC - 1, Math.max(0, Math.floor(p.z + sizeC / 2)))
  return { a, voxelY, c }
}

export function pickBlockIdFromPointer(params: PickBlockIdParams): string | null {
  const { clientX, clientY, domElement, camera, contentGroup, def, layerPreview } = params

  const rect = domElement.getBoundingClientRect()
  const x = ((clientX - rect.left) / rect.width) * 2 - 1
  const y = -((clientY - rect.top) / rect.height) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

  const hits = raycaster.intersectObject(contentGroup, true)
  if (!hits.length) return null

  const hit = hits[0]
  const mesh = hit.object as THREE.Mesh
  if (!hit.face) return null

  const normalWorld = hit.face.normal
    .clone()
    .transformDirection(mesh.matrixWorld)
    .normalize()

  const inside = hit.point.clone().addScaledVector(normalWorld, -NUDGE)

  const grid = buildVoxelGrid(def)
  const { sizeA, sizeB, sizeC } = grid

  let { a, voxelY, c } = worldPointToVoxelIndices(inside, sizeA, sizeB, sizeC)
  const rowB = sizeB - 1 - voxelY

  let id = effectiveBlockId(grid, a, rowB, c, sizeB, layerPreview)
  if (id === AIR) {
    const p2 = hit.point.clone().addScaledVector(normalWorld, -NUDGE * 4)
    ;({ a, voxelY, c } = worldPointToVoxelIndices(p2, sizeA, sizeB, sizeC))
    id = effectiveBlockId(grid, a, sizeB - 1 - voxelY, c, sizeB, layerPreview)
  }

  if (id === AIR) return null
  return id
}
