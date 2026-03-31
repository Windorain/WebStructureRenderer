/**
 * 数据入口：unknown → StructureData 校验 → mergeStructureData → StructureDefinition（无 Three）。
 */

import type { FaceName, StructureData, StructureDefinition } from './types'
import { mergeStructureData } from './mergeScene'

const STRUCTURE_SCHEMA_VERSION = 5

const INITIAL_CAMERA_KEYS = new Set(['focusBlockId', 'frontFace', 'distance'])

const FACE_NAMES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

function isFaceName(s: string): s is FaceName {
  return (FACE_NAMES as string[]).includes(s)
}

function focusBlockIdUsedInZSlices(data: StructureData, focusBlockId: string): boolean {
  const chars = Object.entries(data.symbolMap)
    .filter(([, id]) => id === focusBlockId)
    .map(([ch]) => ch)
  if (chars.length === 0) return false
  for (const slice of data.zSlices) {
    for (const row of slice) {
      for (const ch of chars) {
        if (row.includes(ch)) return true
      }
    }
  }
  return false
}

/** 校验 zSlices 各切片行数一致、行宽一致 */
function validateZSlicesUniform(data: StructureData): void {
  const { zSlices } = data
  if (zSlices.length === 0) throw new Error('zSlices 不能为空')
  const sizeRow = zSlices[0]?.length ?? 0
  const sizeColumn = zSlices[0]?.[0]?.length ?? 0
  if (sizeRow === 0 || sizeColumn === 0) throw new Error('zSlices 首片必须至少含一行且行宽大于 0')
  for (let i = 0; i < zSlices.length; i++) {
    const slice = zSlices[i]
    if (!slice || slice.length !== sizeRow) {
      throw new Error(`zSlices[${i}] 行数须与首片一致（${sizeRow}）`)
    }
    for (let r = 0; r < slice.length; r++) {
      const row = slice[r]
      if (row.length !== sizeColumn) {
        throw new Error(`zSlices[${i}][${r}] 行宽须为 ${sizeColumn}`)
      }
    }
  }
}

/** 磁盘 StructureData 形状与语义校验（仅支持 schemaVersion 5） */
export function validateStructureData(m: StructureData): void {
  if (m.schemaVersion !== STRUCTURE_SCHEMA_VERSION) {
    throw new Error(`StructureData.schemaVersion 必须为 ${STRUCTURE_SCHEMA_VERSION}，当前为 ${m.schemaVersion}`)
  }

  validateZSlicesUniform(m)

  const ic = m.initialCamera
  if (ic === undefined) return
  if (ic === null || typeof ic !== 'object') {
    throw new Error('initialCamera 必须为对象或省略')
  }
  for (const k of Object.keys(ic)) {
    if (!INITIAL_CAMERA_KEYS.has(k)) {
      throw new Error(`initialCamera 非法字段: ${k}`)
    }
  }
  if (typeof ic.focusBlockId !== 'string' || ic.focusBlockId.length === 0) {
    throw new Error('initialCamera.focusBlockId 必填且为非空字符串')
  }
  if (typeof ic.frontFace !== 'string' || !isFaceName(ic.frontFace)) {
    throw new Error(`initialCamera.frontFace 必须为 FaceName 之一，当前: ${String(ic.frontFace)}`)
  }
  if (ic.distance !== undefined && (typeof ic.distance !== 'number' || !Number.isFinite(ic.distance))) {
    throw new Error('initialCamera.distance 必须为有限数字')
  }
  const symbolValues = new Set(Object.values(m.symbolMap))
  if (!symbolValues.has(ic.focusBlockId)) {
    throw new Error(`initialCamera.focusBlockId "${ic.focusBlockId}" 未在 symbolMap 的值中出现`)
  }
  if (!focusBlockIdUsedInZSlices(m, ic.focusBlockId)) {
    throw new Error(`结构中无任何体素对应 initialCamera.focusBlockId "${ic.focusBlockId}"`)
  }
}

export function loadStructureData(raw: unknown): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  const m = raw as Partial<StructureData>
  if (m.mode !== 'simple') throw new Error('仅支持 mode=simple')
  if (!m.zSlices?.length) throw new Error('缺少 zSlices')
  if (!m.symbolMap) throw new Error('缺少 symbolMap')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('StructureData 不应包含 blocks，外观由 data/registries/block_registry.json 提供')
  }
  validateStructureData(m as StructureData)
  return mergeStructureData(m as StructureData)
}
