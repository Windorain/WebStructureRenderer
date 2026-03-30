import type { SimpleDefinition } from './types'

/** 运行时导出（与 load 对称，便于灰机侧序列化缓存） */
export function exportSimpleDefinitionJson(def: SimpleDefinition): string {
  return JSON.stringify(def, null, 2)
}
