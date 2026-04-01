/**
 * 合并层：StructureData + block_registry → StructureDefinition（外观表来自全局注册表，非 Three）。
 * 合并顺序：可选 `globalBlockRegistry`（缺省空）→ `exportBlockRegistry`（服务端/导出片段）→ 可选结构内 `blockRegistryOverlay`；键可为 `registryId@meta`，见 blockRegistryResolve。
 * `faces` 按面键深合并：overlay 某面若含非空 `layers` 则覆盖该面，否则保留基底。
 */

import type {
  BlockEntry,
  BlockRegistryData,
  FaceLayersDef,
  MaterialRegistryData,
  StructureData,
  StructureDefinition,
} from './types'

function mergeFaceLayersDef(
  base: FaceLayersDef | undefined,
  override: FaceLayersDef | undefined,
): FaceLayersDef | undefined {
  if (override?.layers && override.layers.length > 0) return override
  return base
}

function mergeFacesDeep(
  base: BlockEntry['faces'],
  partial: Partial<BlockEntry['faces']> | undefined,
): BlockEntry['faces'] {
  if (!partial) return base
  const out: BlockEntry['faces'] = { ...base }
  for (const key of Object.keys(partial) as (keyof BlockEntry['faces'])[]) {
    const def = partial[key]
    if (!def) continue
    const prev = base[key as keyof BlockEntry['faces']]
    const merged = mergeFaceLayersDef(prev, def as FaceLayersDef)
    if (merged) out[key] = merged
  }
  return out
}

function mergeBlockEntry(base: BlockEntry, partial: Partial<BlockEntry>): BlockEntry {
  return {
    ...base,
    ...partial,
    faces: mergeFacesDeep(base.faces ?? {}, partial.faces),
  }
}

/**
 * 无全局底稿时由导出/覆盖片段补全为可渲染条目。
 * `meshKind` 与 `simpleMesh` 对齐：JSON 常省略 meshKind，运行时按 `?? 'SimpleCube'`；仅当既无 meshKind 又无面数据时视为 Unknown（跳过网格）。
 */
function completeBlockEntry(partial: Partial<BlockEntry>): BlockEntry {
  const faces = partial.faces ?? {}
  const hasFaceData = Object.keys(faces).length > 0
  return {
    ...partial,
    meshKind: partial.meshKind ?? (hasFaceData ? 'SimpleCube' : 'Unknown'),
    faces,
  }
}

/**
 * 将 overlay 合并进全局 blocks：同键覆盖字段；`registryId@meta` 无独立条目时以 `registryId` 为底。
 * 键在全局与 meta 回退均不存在时，仍写入（供独立 `*.block_registry.json` 与 palette 专有键）。
 */
export function mergeBlockRegistries(
  global: Record<string, BlockEntry>,
  overlay: Record<string, Partial<BlockEntry>> | undefined,
): Record<string, BlockEntry> {
  if (!overlay || Object.keys(overlay).length === 0) {
    return { ...global }
  }
  const out: Record<string, BlockEntry> = { ...global }
  for (const [key, partial] of Object.entries(overlay)) {
    const base = out[key] ?? (key.includes('@') ? out[key.slice(0, key.indexOf('@'))] : undefined)
    if (!base) {
      out[key] = completeBlockEntry(partial)
      continue
    }
    out[key] = mergeBlockEntry(base, partial)
  }
  return out
}

/** 导出材质覆盖内置：同 materialId 以 overlay 为准 */
export function mergeMaterialRegistries(
  base: MaterialRegistryData,
  overlay?: MaterialRegistryData,
): MaterialRegistryData {
  if (!overlay?.materials || Object.keys(overlay.materials).length === 0) {
    return base
  }
  return {
    schemaVersion: Math.max(base.schemaVersion, overlay.schemaVersion),
    materials: { ...base.materials, ...overlay.materials },
  }
}

export interface MergeStructureDataOptions {
  /**
   * 合并链第一层；缺省为空对象。线上由服务端切片填满 `exportBlockRegistry`，此处通常省略。
   * 仅本地调试可注入完整 `block_registry.json` 等底稿。
   */
  globalBlockRegistry?: BlockRegistryData
  /** 与 `export.json` 同 stem 的 `*.block_registry.json` 或服务端切片；在 global 之后、结构内 overlay 之前合并 */
  exportBlockRegistry?: BlockRegistryData
}

export function mergeStructureData(model: StructureData, options?: MergeStructureDataOptions): StructureDefinition {
  const globalBlocks = options?.globalBlockRegistry?.blocks ?? {}
  let blocks = mergeBlockRegistries(globalBlocks, options?.exportBlockRegistry?.blocks)
  blocks = mergeBlockRegistries(blocks, model.blockRegistryOverlay?.blocks)
  return {
    schemaVersion: model.schemaVersion,
    mode: 'voxelPalette',
    id: model.id,
    palette: model.palette,
    cellGrid: model.cellGrid,
    blocks,
    initialCamera: model.initialCamera,
  }
}
