/**
 * 物品栏 RTT：MC 1.7 `RenderItem` + `RenderBlocks.renderBlockAsItem`（立方体）的模型矩阵，
 * 并补 mirror / 屏角修正（与主视口一致）。槽位平移与 scale(10) 由相机承担，不写入矩阵。
 */

import * as THREE from 'three'

/** 矩阵或光照变更时递增，用于缓存失效 */
export const MC_ITEM_SLOT_BAKE_REVISION = '10'

const DEG = Math.PI / 180

/**
 * 矩阵变换顺序：
 */
export function makeMcItemSlotBlockMatrix(): THREE.Matrix4 {
  const m = new THREE.Matrix4()
  m.identity()
  m.multiply(new THREE.Matrix4().makeScale(-1, 1, 1))
  m.multiply(new THREE.Matrix4().makeRotationZ(Math.PI))
  m.multiply(new THREE.Matrix4().makeScale(1, 1, -1))
  m.multiply(new THREE.Matrix4().makeRotationX(150 * DEG))
  m.multiply(new THREE.Matrix4().makeRotationY(-45 * DEG))

  return m
}

/** 单 Group + `matrix`，子级挂 mesh */
export function createMcItemSlotViewRoot(): { root: THREE.Group; meshParent: THREE.Group } {
  const root = new THREE.Group()
  const g = new THREE.Group()
  g.matrixAutoUpdate = false
  g.matrix.copy(makeMcItemSlotBlockMatrix())
  g.updateMatrixWorld(true)
  root.add(g)
  return { root, meshParent: g }
}
