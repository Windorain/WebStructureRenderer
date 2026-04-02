/**
 * 数据入口：unknown → StructureData 校验 → mergeStructureData → StructureDefinition（无 Three）。
 * 支持顶层为 **World**（多帧）时取某一内嵌帧的 StructureData。
 */

import type {
  BlockRegistryData,
  FaceName,
  MaterialRegistryData,
  ModelRegistryData,
  StructureData,
  StructureDefinition,
  WikiRenderBundle,
  World,
} from './types'
import { mergeStructureData, type MergeStructureDataInput } from './mergeScene'
import {
  WORLD_DOCUMENT_SCHEMA_VERSION,
  embeddedStructure,
  frameAt,
  getDefaultFrameIndex,
} from './worldPlayback'

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

export function loadStructureData(raw: unknown, input: MergeStructureDataInput): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  const m = raw as Partial<StructureData>
  if (m.mode !== 'voxelPalette') throw new Error('仅支持 mode=voxelPalette')
  if (!m.cellGrid?.length) throw new Error('缺少 cellGrid')
  if (!m.palette?.length) throw new Error('缺少 palette')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('StructureData 不应包含顶层 blocks；方块外观请使用独立 block_registry 并在 WikiRenderBundle 中传入')
  }
  validateStructureData(m as StructureData)
  return mergeStructureData(m as StructureData, input)
}

/** 顶层 JSON 是否为 World（多帧）文档 */
export function isWorldDocument(raw: unknown): raw is World {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  return Array.isArray(o.frames) && typeof o.id === 'string'
}

/** 校验 World 文档形状（内嵌帧会递归校验 StructureData） */
export function validateWorldDocument(w: World): void {
  if (w.schemaVersion !== WORLD_DOCUMENT_SCHEMA_VERSION) {
    throw new Error(`World.schemaVersion 必须为 ${WORLD_DOCUMENT_SCHEMA_VERSION}`)
  }
  if (typeof w.id !== 'string' || w.id.length === 0) throw new Error('World.id 必填')
  if (!Array.isArray(w.frames) || w.frames.length === 0) throw new Error('World.frames 不能为空')
  let embedded = 0
  for (let i = 0; i < w.frames.length; i++) {
    const f = w.frames[i]
    if (!f || typeof f !== 'object') throw new Error(`World.frames[${i}] 无效`)
    if (f.structure !== undefined) {
      embedded++
      validateStructureData(f.structure)
    }
    if (f.structureRef !== undefined && typeof f.structureRef !== 'string') {
      throw new Error(`World.frames[${i}].structureRef 须为字符串`)
    }
  }
  if (embedded === 0) {
    throw new Error('World 至少需要一帧含内嵌 structure（structureRef 远程加载尚未实现）')
  }
}

/**
 * 从 World 文档加载指定帧的内嵌 StructureData（仅支持 `frame.structure` 已嵌入；`structureRef` 待实现）。
 */
export function loadWorldEmbeddedFrame(
  raw: unknown,
  frameIndex: number | undefined,
  input: MergeStructureDataInput,
): StructureDefinition {
  if (!isWorldDocument(raw)) throw new Error('不是 World 文档')
  const w = raw
  validateWorldDocument(w)
  const idx = frameIndex !== undefined ? Math.floor(frameIndex) : getDefaultFrameIndex(w)
  const frame = frameAt(w, idx)
  if (!frame) throw new Error(`World 无帧索引 ${idx}`)
  const data = embeddedStructure(frame)
  if (!data) {
    throw new Error(
      `World.frames[${idx}] 无内嵌 structure（仅 structureRef 的帧尚无法加载）`,
    )
  }
  return loadStructureData(data, input)
}

/** 自动识别顶层为 StructureData 或 World，返回当前可渲染的 StructureDefinition */
export function loadStructureOrWorld(
  raw: unknown,
  frameIndex: number | undefined,
  input: MergeStructureDataInput,
): StructureDefinition {
  if (isWorldDocument(raw)) {
    return loadWorldEmbeddedFrame(raw, frameIndex, input)
  }
  return loadStructureData(raw, input)
}

function validateBlockRegistryData(r: BlockRegistryData, label: string): void {
  if (typeof r.schemaVersion !== 'number' || !Number.isFinite(r.schemaVersion)) {
    throw new Error(`${label}.schemaVersion 须为数字`)
  }
  if (!r.blocks || typeof r.blocks !== 'object') {
    throw new Error(`${label}.blocks 须为对象`)
  }
}

function validateMaterialRegistryData(r: MaterialRegistryData, label: string): void {
  if (typeof r.schemaVersion !== 'number' || !Number.isFinite(r.schemaVersion)) {
    throw new Error(`${label}.schemaVersion 须为数字`)
  }
  if (!r.materials || typeof r.materials !== 'object') {
    throw new Error(`${label}.materials 须为对象`)
  }
}

function validateModelRegistryData(r: ModelRegistryData, label: string): void {
  if (typeof r.schemaVersion !== 'number' || !Number.isFinite(r.schemaVersion)) {
    throw new Error(`${label}.schemaVersion 须为数字`)
  }
  if (!r.models || typeof r.models !== 'object') {
    throw new Error(`${label}.models 须为对象`)
  }
}

function validateBlockRegistryBlocksHaveMeshKind(r: BlockRegistryData, label: string): void {
  for (const [id, entry] of Object.entries(r.blocks)) {
    if (!entry || typeof entry.meshKind !== 'string') {
      throw new Error(`${label}.blocks[${id}].meshKind 必填`)
    }
  }
}

/** 校验 Wiki 渲染包形状（document 的语义校验在 loadStructureData / validateWorldDocument 中） */
export function validateWikiRenderBundle(b: WikiRenderBundle): void {
  if (!b || typeof b !== 'object') throw new Error('WikiRenderBundle 无效')
  if (b.document === undefined || b.document === null) {
    throw new Error('WikiRenderBundle.document 必填')
  }
  validateBlockRegistryData(b.blockRegistry, 'WikiRenderBundle.blockRegistry')
  validateMaterialRegistryData(b.materialRegistry, 'WikiRenderBundle.materialRegistry')
  validateModelRegistryData(b.modelRegistry, 'WikiRenderBundle.modelRegistry')
  validateBlockRegistryBlocksHaveMeshKind(b.blockRegistry, 'WikiRenderBundle')
}

export interface WikiRenderResolveResult {
  definition: StructureDefinition
  materialRegistry: MaterialRegistryData
  modelRegistry: ModelRegistryData
}

/**
 * 单次装配：校验 bundle → StructureDefinition + 材质表（document 为 StructureData 或 World）。
 */
export function resolveWikiRenderBundle(
  bundle: WikiRenderBundle,
  frameIndex?: number,
): WikiRenderResolveResult {
  validateWikiRenderBundle(bundle)
  const input: MergeStructureDataInput = { blockRegistry: bundle.blockRegistry, modelRegistry: bundle.modelRegistry }
  const definition = loadStructureOrWorld(bundle.document, frameIndex, input)
  return { definition, materialRegistry: bundle.materialRegistry, modelRegistry: bundle.modelRegistry }
}

export type { MergeStructureDataInput } from './mergeScene'
export { mergeMaterialRegistries, mergeModelRegistries, mergeStructureData } from './mergeScene'
export type { BlockRegistryData, MaterialRegistryData, ModelRegistryData, WikiRenderBundle } from './types'
