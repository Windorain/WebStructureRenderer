/**
 * 检测控制器体素并设置初始相机：轨道中心对准控制器中心，相机位于「正面」外侧，
 * camera.up 与体素世界 +Y（顶面法线）一致；正面法线由 initialCamera.controllerFacing 指定。
 *
 * GT5U / StructureLib 约定（见 StructureLib `ExtendedFacing`）：
 * - `ExtendedFacing.DEFAULT` = `NORTH_NORMAL_NONE`，即控制器默认朝北（ForgeDirection.NORTH）。
 * - 对 NORTH，`getRelativeForwardInWorld()` 为世界 -Z（玩家站在控制器北侧朝向南看 GUI）。
 * - 故「正面朝外法线」与 Minecraft 北面对应 **-z**（Three 世界 +Y 上、+X 东、+Z 南时与 MC 一致）。
 */

import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { FaceName, SimpleDefinition } from './types'
import { buildVoxelGrid } from './grid'

const WORLD_UP = new THREE.Vector3(0, 1, 0)

const FACE_NORMAL: Record<FaceName, THREE.Vector3> = {
  '+x': new THREE.Vector3(1, 0, 0),
  '-x': new THREE.Vector3(-1, 0, 0),
  '+y': new THREE.Vector3(0, 1, 0),
  '-y': new THREE.Vector3(0, -1, 0),
  '+z': new THREE.Vector3(0, 0, 1),
  '-z': new THREE.Vector3(0, 0, -1),
}

/** 与 StructureLib `ExtendedFacing.DEFAULT`（朝北）一致，勿与「南 +Z」混淆 */
const DEFAULT_FACING: FaceName = '-z'
const DEFAULT_DISTANCE = 10

/** 与 simpleMesh 中体素中心一致：格点 (x,y,z) 对应世界中心 (x+0.5-sx/2, …) */
export function voxelCenterWorld(
  x: number,
  y: number,
  z: number,
  sizeX: number,
  sizeY: number,
  sizeZ: number,
  out?: THREE.Vector3,
): THREE.Vector3 {
  const v = out ?? new THREE.Vector3()
  v.set(x + 0.5 - sizeX / 2, y + 0.5 - sizeY / 2, z + 0.5 - sizeZ / 2)
  return v
}

/** 在网格中查找第一个方块 id 为 controller 的体素（symbolMap 中 ~ → controller 等） */
export function findFirstControllerVoxel(def: SimpleDefinition): { x: number; y: number; z: number } | null {
  const grid = buildVoxelGrid(def)
  for (let y = 0; y < grid.sizeY; y++) {
    for (let z = 0; z < grid.sizeZ; z++) {
      for (let x = 0; x < grid.sizeX; x++) {
        if (grid.get(x, y, z) === 'controller') return { x, y, z }
      }
    }
  }
  return null
}

/**
 * 正面朝外法线与 world up 几乎平行时，lookAt 与 up 退化，改用 +Z 作为 camera.up。
 */
function setCameraUpParallelToControllerTop(
  camera: THREE.PerspectiveCamera,
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
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  def: SimpleDefinition,
  fallbackTarget: THREE.Vector3,
  fallbackPosition: THREE.Vector3,
  options?: ApplyInitialCameraOptions,
): void {
  const cell = findFirstControllerVoxel(def)
  if (!cell) {
    controls.target.copy(fallbackTarget)
    camera.position.copy(fallbackPosition)
    camera.up.copy(WORLD_UP)
    camera.lookAt(fallbackTarget)
    return
  }

  const grid = buildVoxelGrid(def)
  const { sizeX, sizeY, sizeZ } = grid
  const target = voxelCenterWorld(cell.x, cell.y, cell.z, sizeX, sizeY, sizeZ)

  const facing = (def.initialCamera?.controllerFacing ?? DEFAULT_FACING) as FaceName
  const frontOut = FACE_NORMAL[facing]?.clone() ?? FACE_NORMAL[DEFAULT_FACING].clone()
  const dist = options?.distance ?? def.initialCamera?.distance ?? DEFAULT_DISTANCE

  setCameraUpParallelToControllerTop(camera, frontOut)
  camera.position.copy(target).add(frontOut.multiplyScalar(dist))
  camera.lookAt(target)
  controls.target.copy(target)
}
