/**
 * 数据入口：unknown → StructureData 校验 → mergeStructureData → StructureDefinition（无 Three）。
 */

import type { StructureData, StructureDefinition } from './types'
import { mergeStructureData } from './mergeScene'

export function loadStructureData(raw: unknown): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  const m = raw as Partial<StructureData>
  if (m.mode !== 'simple') throw new Error('仅支持 mode=simple')
  if (!m.layers?.length) throw new Error('缺少 layers')
  if (!m.symbolMap) throw new Error('缺少 symbolMap')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('StructureData 不应包含 blocks，外观由 data/registries/block_registry.json 提供')
  }
  return mergeStructureData(m as StructureData)
}
