/**
 * 将内存中的定义序列化为 JSON 字符串（导出/调试）。
 * 不负责读文件；调用方决定写入位置。
 */

import type { SimpleDefinition, SimpleModel } from './types'

export function exportSimpleDefinitionJson(def: SimpleDefinition): string {
  return JSON.stringify(def, null, 2)
}

export function exportSimpleModelJson(model: SimpleModel): string {
  return JSON.stringify(model, null, 2)
}
