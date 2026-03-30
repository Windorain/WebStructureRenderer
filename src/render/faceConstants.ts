/**
 * 与 StructureLib / Minecraft 轴约定一致的面法线与结构索引空间邻接增量。
 * 供 simpleMesh（外露判定 + 四边形）、initialCamera（正面朝向）共用，避免重复定义。
 */

import * as THREE from 'three'

import type { FaceName } from './types'

/** 世界空间外法线（与 FaceName 一一对应） */
export const FACE_NORMAL: Record<FaceName, THREE.Vector3> = {
  '+x': new THREE.Vector3(1, 0, 0),
  '-x': new THREE.Vector3(-1, 0, 0),
  '+y': new THREE.Vector3(0, 1, 0),
  '-y': new THREE.Vector3(0, -1, 0),
  '+z': new THREE.Vector3(0, 0, 1),
  '-z': new THREE.Vector3(0, 0, -1),
}

/**
 * 邻格在 (a, structureRowB, c) 中的增量；structureRowB 与 layers[c][b] 的 b 一致（0=顶行）。
 * 世界 +Y 对应更小 structureRowB（StructureLib 的 b 轴为 DOWN）。
 */
export const NEIGHBOR_STRUCTURE_DELTA: Record<FaceName, [number, number, number]> = {
  '+x': [1, 0, 0],
  '-x': [-1, 0, 0],
  '+y': [0, -1, 0],
  '-y': [0, 1, 0],
  '+z': [0, 0, 1],
  '-z': [0, 0, -1],
}
