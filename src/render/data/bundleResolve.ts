/**
 * 数据入口：unknown → StructureData 校验 → mergeStructureData → StructureDefinition（无 Three）。
 * 支持顶层为 **World**（多帧）时取某一内嵌帧的 StructureData。
 */

import type {
  BlockRegistryData,
  FaceName,
  MaterialRegistryData,
  ModelRegistryData,
  RenderBundle,
  StructureData,
  StructureDefinition,
  World,
} from '../schema/types'
import { STRUCTURE_DATA_SCHEMA_FINAL } from '../schema/types'
import { mergeStructureData, type MergeStructureDataInput } from './mergeScene'
import { embeddedStructure, frameAt, getDefaultFrameIndex } from './worldPlayback'
import { materialPaletteToMaterialRegistry } from './materialPaletteBridge'

const INITIAL_CAMERA_KEYS = new Set(['focusBlockId', 'frontFace', 'distance'])

const FACE_NAMES: FaceName[] = ['+x', '-x', '+y', '-y', '+z', '-z']

function isFaceName(s: string): s is FaceName {
  return (FACE_NAMES as string[]).includes(s)
}

function focusBlockIdUsedInCellGrid(data: StructureData, focusBlockId: string): boolean {
  const paletteIndices = new Set<number>()
  data.blockPalette.forEach((p, i) => {
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

function validateMaterialPalette(data: StructureData): void {
  const { materialPalette } = data
  if (!materialPalette?.length) throw new Error('materialPalette 不能为空')
  for (let i = 0; i < materialPalette.length; i++) {
    const m = materialPalette[i]
    if (!m || typeof m.locator !== 'string' || m.locator.length === 0) {
      throw new Error(`materialPalette[${i}].locator 须为非空字符串`)
    }
    if (m.kind !== 'static16' && m.kind !== 'animated') {
      throw new Error(`materialPalette[${i}].kind 无效`)
    }
  }
}

function validateBlockPaletteAndRefs(data: StructureData): void {
  const { blockPalette, cellGrid, materialPalette } = data
  if (!blockPalette?.length) throw new Error('blockPalette 不能为空')
  if (!blockPalette.some((p) => p.registryId === 'air')) {
    throw new Error('blockPalette 须含 registryId 为 air 的条目')
  }
  const matN = materialPalette.length
  const n = blockPalette.length
  for (let i = 0; i < blockPalette.length; i++) {
    const p = blockPalette[i]
    if (!p || typeof p.registryId !== 'string' || p.registryId.length === 0) {
      throw new Error(`blockPalette[${i}] 须含非空 registryId`)
    }
    if (typeof p.meta !== 'number' || !Number.isInteger(p.meta) || p.meta < 0) {
      throw new Error(`blockPalette[${i}].meta 须为非负整数`)
    }
    if (p.facing !== undefined) {
      if (typeof p.facing !== 'string' || !isFaceName(p.facing)) {
        throw new Error(`blockPalette[${i}].facing 须为 FaceName，当前: ${String(p.facing)}`)
      }
    }
    if (p.renderMode !== 'BakedQuads' && p.renderMode !== 'Special') {
      throw new Error(`blockPalette[${i}].renderMode 无效`)
    }
    const geo = p.geometry
    if (!geo || typeof geo.encoding !== 'string') {
      throw new Error(`blockPalette[${i}].geometry 无效`)
    }
    const quads = geo.quads ?? []
    for (let qi = 0; qi < quads.length; qi++) {
      const q = quads[qi]
      if (!q || typeof q.materialIndex !== 'number' || !Number.isInteger(q.materialIndex)) {
        throw new Error(`blockPalette[${i}].geometry.quads[${qi}].materialIndex 无效`)
      }
      if (q.materialIndex < 0 || q.materialIndex >= matN) {
        throw new Error(
          `blockPalette[${i}].geometry.quads[${qi}].materialIndex=${q.materialIndex} 超出 materialPalette（长度 ${matN}）`,
        )
      }
      const verts = q.vertices
      if (!Array.isArray(verts) || verts.length !== 4) {
        throw new Error(`blockPalette[${i}].geometry.quads[${qi}] 须含 4 个顶点`)
      }
    }
  }
  for (let zi = 0; zi < cellGrid.length; zi++) {
    const slice = cellGrid[zi]
    for (let r = 0; r < slice.length; r++) {
      const row = slice[r]
      for (let c = 0; c < row.length; c++) {
        const idx = row[c]
        if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= n) {
          throw new Error(`cellGrid[${zi}][${r}][${c}] blockPalette 下标无效: ${idx}`)
        }
      }
    }
  }
}

/** 磁盘 StructureData 形状与语义校验 */
export function validateStructureData(m: StructureData): void {
  if (m.mode !== 'voxelPalette') {
    throw new Error('仅支持 mode=voxelPalette')
  }
  const sv = m.schemaVersion
  if (sv === undefined || sv < STRUCTURE_DATA_SCHEMA_FINAL) {
    throw new Error(
      `StructureData.schemaVersion 须 >= ${STRUCTURE_DATA_SCHEMA_FINAL}（终态 BakedQuads）；当前 ${String(sv)}`,
    )
  }

  validateMaterialPalette(m)
  validateBlockPaletteAndRefs(m)
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
  const registryIds = new Set(m.blockPalette.map((p) => p.registryId))
  if (!registryIds.has(ic.focusBlockId)) {
    throw new Error(`initialCamera.focusBlockId "${ic.focusBlockId}" 未在 blockPalette 中出现`)
  }
  if (!focusBlockIdUsedInCellGrid(m, ic.focusBlockId)) {
    throw new Error(`结构中无任何体素对应 initialCamera.focusBlockId "${ic.focusBlockId}"`)
  }
}

export function loadStructureData(raw: unknown, input?: MergeStructureDataInput): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  const m = raw as Partial<StructureData>
  if (m.mode !== 'voxelPalette') throw new Error('仅支持 mode=voxelPalette')
  if (!m.cellGrid?.length) throw new Error('缺少 cellGrid')
  if (!m.blockPalette?.length) throw new Error('缺少 blockPalette')
  if (!m.materialPalette?.length) throw new Error('缺少 materialPalette')
  if ((m as { blocks?: unknown }).blocks !== undefined) {
    throw new Error('StructureData 不应包含顶层 blocks')
  }
  validateStructureData(m as StructureData)
  return mergeStructureData(m as StructureData, input)
}

export function isWorldDocument(raw: unknown): raw is World {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  return Array.isArray(o.frames) && typeof o.id === 'string'
}

export function validateWorldDocument(w: World): void {
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

export function loadWorldEmbeddedFrame(
  raw: unknown,
  frameIndex: number | undefined,
  input?: MergeStructureDataInput,
): StructureDefinition {
  if (!isWorldDocument(raw)) throw new Error('不是 World 文档')
  const w = raw
  validateWorldDocument(w)
  const idx = frameIndex !== undefined ? Math.floor(frameIndex) : getDefaultFrameIndex(w)
  const frame = frameAt(w, idx)
  if (!frame) throw new Error(`World 无帧索引 ${idx}`)
  const data = embeddedStructure(frame)
  if (!data) {
    throw new Error(`World.frames[${idx}] 无内嵌 structure（仅 structureRef 的帧尚无法加载）`)
  }
  return loadStructureData(data, input)
}

export function loadStructureOrWorld(
  raw: unknown,
  frameIndex: number | undefined,
  input?: MergeStructureDataInput,
): StructureDefinition {
  if (isWorldDocument(raw)) {
    return loadWorldEmbeddedFrame(raw, frameIndex, input)
  }
  return loadStructureData(raw, input)
}

function validateBlockRegistryData(r: BlockRegistryData, label: string): void {
  if (!r.blocks || typeof r.blocks !== 'object') {
    throw new Error(`${label}.blocks 须为对象`)
  }
}

function validateMaterialRegistryData(r: MaterialRegistryData, label: string): void {
  if (!r.materials || typeof r.materials !== 'object') {
    throw new Error(`${label}.materials 须为对象`)
  }
}

function validateModelRegistryData(r: ModelRegistryData, label: string): void {
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

function documentHasEmbeddedMaterialPalette(document: unknown): boolean {
  if (!document || typeof document !== 'object') return false
  const d = document as Record<string, unknown>
  if (d.mode === 'voxelPalette' && Array.isArray(d.materialPalette) && d.materialPalette.length > 0) {
    return true
  }
  if (Array.isArray(d.frames)) {
    for (const f of d.frames as unknown[]) {
      if (!f || typeof f !== 'object') continue
      const st = (f as Record<string, unknown>).structure
      if (
        st &&
        typeof st === 'object' &&
        Array.isArray((st as StructureData).materialPalette) &&
        (st as StructureData).materialPalette!.length > 0
      ) {
        return true
      }
    }
  }
  return false
}

const EMPTY_BLOCK_REGISTRY: BlockRegistryData = { blocks: {} }
const EMPTY_MODEL_REGISTRY: ModelRegistryData = { models: {} }
const EMPTY_MATERIAL_REGISTRY: MaterialRegistryData = { materials: {} }

/**
 * 渲染包内用于预取纹理的材质表：结构内 materialPalette 优先，键为 "0".."n-1"，
 * bundle.materialRegistry.materials 可覆盖同名键（遗留）。
 */
export function resolveBundleMaterialRegistry(bundle: RenderBundle, definition: StructureDefinition): MaterialRegistryData {
  const fromPalette = materialPaletteToMaterialRegistry(definition.materialPalette)
  const overlay = bundle.materialRegistry
  if (!overlay?.materials || Object.keys(overlay.materials).length === 0) {
    return fromPalette
  }
  return {
    materials: { ...fromPalette.materials, ...overlay.materials },
  }
}

export function validateRenderBundle(b: RenderBundle): void {
  if (!b || typeof b !== 'object') throw new Error('RenderBundle 无效')
  if (b.document === undefined || b.document === null) {
    throw new Error('RenderBundle.document 必填')
  }
  const blockRegistry = b.blockRegistry ?? EMPTY_BLOCK_REGISTRY
  const modelRegistry = b.modelRegistry ?? EMPTY_MODEL_REGISTRY
  const materialRegistry = b.materialRegistry ?? EMPTY_MATERIAL_REGISTRY
  validateBlockRegistryData(blockRegistry, 'RenderBundle.blockRegistry')
  validateModelRegistryData(modelRegistry, 'RenderBundle.modelRegistry')

  const embedded = documentHasEmbeddedMaterialPalette(b.document)
  if (embedded) {
    validateMaterialRegistryData(materialRegistry, 'RenderBundle.materialRegistry')
    return
  }
  validateMaterialRegistryData(materialRegistry, 'RenderBundle.materialRegistry')
  validateBlockRegistryBlocksHaveMeshKind(blockRegistry, 'RenderBundle')
}

export interface RenderBundleResolveResult {
  definition: StructureDefinition
  materialRegistry: MaterialRegistryData
  modelRegistry: ModelRegistryData
}

export function resolveRenderBundle(bundle: RenderBundle, frameIndex?: number): RenderBundleResolveResult {
  validateRenderBundle(bundle)
  const definition = loadStructureOrWorld(bundle.document, frameIndex, {})
  const materialRegistry = resolveBundleMaterialRegistry(bundle, definition)
  return {
    definition,
    materialRegistry,
    modelRegistry: bundle.modelRegistry ?? EMPTY_MODEL_REGISTRY,
  }
}

export type { MergeStructureDataInput } from './mergeScene'
export { mergeMaterialRegistries, mergeModelRegistries, mergeStructureData } from './mergeScene'
export type { BlockRegistryData, MaterialRegistryData, ModelRegistryData, RenderBundle } from '../schema/types'
