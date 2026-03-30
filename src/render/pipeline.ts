/**
 * 数据入口：unknown → SimpleModel 校验 → mergeSimpleModel → SimpleDefinition（无 Three）。
 */

import type { SimpleDefinition, SimpleModel } from './types'
import { mergeSimpleModel } from './mergeScene'

export function loadSimpleModel(raw: unknown): SimpleDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('SimpleModel 无效')
  const m = raw as Partial<SimpleModel>
  if (m.mode !== 'simple') throw new Error('仅支持 mode=simple')
  if (!m.layers?.length) throw new Error('缺少 layers')
  if (!m.symbolMap) throw new Error('缺少 symbolMap')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('SimpleModel 不应包含 blocks，外观由 data/registries/block_registry.json 提供')
  }
  return mergeSimpleModel(m as SimpleModel)
}
