/**
 * 检测控制器体素并设置初始相机：轨道中心对准控制器中心，相机位于「正面」外侧，
 * camera.up 为世界 +Y（Minecraft 竖直向上）；正面法线由 initialCamera.controllerFacing 指定。
 *
 * GT5U / StructureLib（`ExtendedFacing` NORTH）：
 * - `getRelativeForwardInWorld()` = 世界 **-Z**（北），GUI 常从南侧看。
 * - 结构行 b 与世界 Y：`structureRowToWorldY`（首行 = 顶 = 高 Y），勿把数组行下标直接当世界 Y。
 * - `applyInitialCamera` 内只调用一次 `buildVoxelGrid`，再用 `findFirstVoxelWithBlockId` 查 controller，避免重复构建。
 */

import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { FaceName, SimpleDefinition } from './types'
import { FACE_NORMAL } from './faceConstants'
import { buildVoxelGrid, findFirstVoxelWithBlockId } from './grid'
import { structureRowToWorldY } from './structureCoords'

const WORLD_UP = new THREE.Vector3(0, 1, 0)

/** 与 StructureLib `ExtendedFacing.DEFAULT`（朝北）一致，勿与「南 +Z」混淆 */
const DEFAULT_FACING: FaceName = '-z'
const DEFAULT_DISTANCE = 10

/**
 * 与 simpleMesh 体素中心一致：a、c 为体素列/片下标；b 为 **StructureLib 行下标**（0=顶行），
 * 世界 Y 由 `structureRowToWorldY(b, sizeB)` 得到。
 */
export function voxelCenterWorld(
  a: number,
  structureRowB: number,
  c: number,
  sizeA: number,
  sizeB: number,
  sizeC: number,
  out?: THREE.Vector3,
): THREE.Vector3 {
  const y = structureRowToWorldY(structureRowB, sizeB)
  const v = out ?? new THREE.Vector3()
  v.set(a + 0.5 - sizeA / 2, y + 0.5 - sizeB / 2, c + 0.5 - sizeC / 2)
  return v
}

/** 在网格中查找第一个方块 id 为 controller 的体素（symbolMap 中 ~ → controller 等） */
export function findFirstControllerVoxel(def: SimpleDefinition) {
  return findFirstVoxelWithBlockId(buildVoxelGrid(def), 'controller')
}

/**
 * 正面朝外法线与 world up 几乎平行时，lookAt 与 up 退化，改用 +Z 作为 camera.up。
 */
function setCameraUpParallelToControllerTop(
  camera: THREE.Camera,
  frontOutward: THREE.Vector3,
): void {
  const f = frontOutward
  if (Math.abs(f.dot(WORLD_UP)) > 0.98) {
    camera.up.set(0, 0, 1)
  } else {
    camera.up.copy(WORLD_UP)
  }
}

export interface ApplyInitialCameraOptions {
  /** 覆盖 JSON 中的 distance */
  distance?: number
}

/**
 * 若存在控制器体素：target = 体素中心；相机在正面法线外侧；up 与顶面 (+Y) 对齐（非退化时）。
 * 若无控制器：使用 fallbackTarget / fallbackPosition（均为世界坐标）。
 */
export function applyInitialCamera(
  camera: THREE.Camera,
  controls: OrbitControls,
  def: SimpleDefinition,
  fallbackTarget: THREE.Vector3,
  fallbackPosition: THREE.Vector3,
  options?: ApplyInitialCameraOptions,
): void {
  const grid = buildVoxelGrid(def)
  const cell = findFirstVoxelWithBlockId(grid, 'controller')
  if (!cell) {
    controls.target.copy(fallbackTarget)
    camera.position.copy(fallbackPosition)
    camera.up.copy(WORLD_UP)
    camera.lookAt(fallbackTarget)
    return
  }

  const { sizeA, sizeB, sizeC } = grid
  const target = voxelCenterWorld(cell.a, cell.b, cell.c, sizeA, sizeB, sizeC)

  const facing = (def.initialCamera?.controllerFacing ?? DEFAULT_FACING) as FaceName
  const frontOut = FACE_NORMAL[facing]?.clone() ?? FACE_NORMAL[DEFAULT_FACING].clone()
  const dist = options?.distance ?? def.initialCamera?.distance ?? DEFAULT_DISTANCE

  setCameraUpParallelToControllerTop(camera, frontOut)
  camera.position.copy(target).add(frontOut.multiplyScalar(dist))
  camera.lookAt(target)
  controls.target.copy(target)
}
