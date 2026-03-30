/**
 * Simple 网格合并批次：一次算清描述符，材质库按同一键缓存，避免字符串解析往返。
 */

import * as THREE from 'three'

import type { LayerRole } from './types'

const BATCH_SEP = '|' as const

export interface BatchDescriptor {
  materialId: string
  tint: THREE.Color
  layerIdx: number
  role: LayerRole
}

/** 与 SimpleMaterialLibrary 中 materialByBatchKey 一致 */
export function batchMaterialCacheKey(d: BatchDescriptor): string {
  return [d.materialId, d.tint.getHexString(), String(d.layerIdx), d.role].join(BATCH_SEP)
}
