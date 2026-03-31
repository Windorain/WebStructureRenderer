/**
 * MC 1.7 物品栏方块视角：`RenderItem.renderItemIntoGUI` 与 `RenderBlocks.renderBlockAsItem`（type 0）
 * 中旋转/缩放的合成矩阵（忽略像素级 translate/scale(10)，由相机与视口代替）。
 */

import * as THREE from 'three'

/**
 * 将单位立方体（中心原点、与 simpleMesh 1×1×1 一致）变换到物品栏观察空间。
 * 顶点变换：v' = M * v（列向量）。
 */
export function makeMcItemSlotBlockMatrix(): THREE.Matrix4 {
  const m = new THREE.Matrix4().makeRotationY(Math.PI / 2)
  m.premultiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2))
  m.premultiply(new THREE.Matrix4().makeRotationY(Math.PI / 4))
  m.premultiply(new THREE.Matrix4().makeRotationX((210 * Math.PI) / 180))
  m.premultiply(new THREE.Matrix4().makeScale(1, 1, -1))
  return m
}
