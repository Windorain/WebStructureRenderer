/**
 * 数据入口：unknown → StructureData 校验 → mergeStructureData → StructureDefinition（无 Three）。
 */

import type { FaceName, StructureData, StructureDefinition } from './types'
import { mergeStructureData } from './mergeScene'

export const STRUCTURE_SCHEMA_VERSION = 6 as const

const INITIAL_CAMERA_KEYS = new Set(['focusBlockId', 'frontFace', 'distance'])

const FACE_NAMES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

function isFaceName(s: string): s is FaceName {
  return (FACE_NAMES as string[]).includes(s)
}

function focusBlockIdUsedInCellGrid(data: StructureData, focusBlockId: string): boolean {
  const paletteIndices = new Set<number>()
  data.palette.forEach((p, i) => {
    if (p.registryId === focusBlockId) paletteIndices.add(i)
  })
  if (paletteIndices.size === 0) return false
  for (const slice of data.cellGrid) {
    for (const row of slice) {
      for (const cell of row) {
        if (paletteIndices.has(cell)) return true
      }
    }
  }
  return false
}

/** 校验 cellGrid 各切片行数、行宽一致 */
function validateCellGridUniform(data: StructureData): void {
  const { cellGrid } = data
  if (cellGrid.length === 0) throw new Error('cellGrid 不能为空')
  const sizeRow = cellGrid[0]?.length ?? 0
  const sizeColumn = cellGrid[0]?.[0]?.length ?? 0
  if (sizeRow === 0 || sizeColumn === 0) throw new Error('cellGrid 首片必须至少含一行且行宽大于 0')
  for (let i = 0; i < cellGrid.length; i++) {
    const slice = cellGrid[i]
    if (!slice || slice.length !== sizeRow) {
      throw new Error(`cellGrid[${i}] 行数须与首片一致（${sizeRow}）`)
    }
    for (let r = 0; r < slice.length; r++) {
      const row = slice[r]
      if (!row || row.length !== sizeColumn) {
        throw new Error(`cellGrid[${i}][${r}] 行宽须为 ${sizeColumn}`)
      }
    }
  }
}

function validatePalette(data: StructureData): void {
  const { palette, cellGrid } = data
  if (!palette?.length) throw new Error('palette 不能为空')
  if (!palette.some((p) => p.registryId === 'air')) {
    throw new Error('palette 须含 registryId 为 air 的条目')
  }
  const n = palette.length
  for (let i = 0; i < palette.length; i++) {
    const p = palette[i]
    if (!p || typeof p.registryId !== 'string' || p.registryId.length === 0) {
      throw new Error(`palette[${i}] 须含非空 registryId`)
    }
    if (typeof p.meta !== 'number' || !Number.isInteger(p.meta) || p.meta < 0) {
      throw new Error(`palette[${i}].meta 须为非负整数`)
    }
  }
  for (let zi = 0; zi < cellGrid.length; zi++) {
    const slice = cellGrid[zi]
    for (let r = 0; r < slice.length; r++) {
      const row = slice[r]
      for (let c = 0; c < row.length; c++) {
        const idx = row[c]
        if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= n) {
          throw new Error(`cellGrid[${zi}][${r}][${c}] 调色板下标无效: ${idx}`)
        }
      }
    }
  }
}

/** 磁盘 StructureData 形状与语义校验（schemaVersion 6） */
export function validateStructureData(m: StructureData): void {
  if (m.schemaVersion !== STRUCTURE_SCHEMA_VERSION) {
    throw new Error(`StructureData.schemaVersion 必须为 ${STRUCTURE_SCHEMA_VERSION}，当前为 ${m.schemaVersion}`)
  }
  if (m.mode !== 'voxelPalette') {
    throw new Error('仅支持 mode=voxelPalette')
  }

  validatePalette(m)
  validateCellGridUniform(m)

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
  const registryIds = new Set(m.palette.map((p) => p.registryId))
  if (!registryIds.has(ic.focusBlockId)) {
    throw new Error(`initialCamera.focusBlockId "${ic.focusBlockId}" 未在 palette 中出现`)
  }
  if (!focusBlockIdUsedInCellGrid(m, ic.focusBlockId)) {
    throw new Error(`结构中无任何体素对应 initialCamera.focusBlockId "${ic.focusBlockId}"`)
  }
}

export function loadStructureData(raw: unknown): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  const m = raw as Partial<StructureData>
  if (m.mode !== 'voxelPalette') throw new Error('仅支持 mode=voxelPalette')
  if (!m.cellGrid?.length) throw new Error('缺少 cellGrid')
  if (!m.palette?.length) throw new Error('缺少 palette')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('StructureData 不应包含 blocks，外观由 data/registries/block_registry.json 提供')
  }
  validateStructureData(m as StructureData)
  return mergeStructureData(m as StructureData)
}
