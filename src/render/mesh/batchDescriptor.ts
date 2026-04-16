/**
 * Simple 网格合并批次：一次算清描述符，材质库按同一键缓存，避免字符串解析往返。
 * MC 顶点色（多为 `setColorOpaque_I` 的 0xRRGGBB）映射到材质 `color`，同贴图不同染色分批次。
 */

import * as THREE from 'three'

import type { MaterialBlendMode } from '../schema/types'

const BATCH_SEP = '|' as const

export interface BatchDescriptor {
  materialId: string
  blend: MaterialBlendMode
  tint: THREE.Color
}

/** 与 SimpleMaterialLibrary 中 materialByBatchKey 一致 */
export function batchMaterialCacheKey(d: BatchDescriptor): string {
  return [d.materialId, d.blend, d.tint.getHex()].join(BATCH_SEP)
}
