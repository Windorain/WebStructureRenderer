/**
 * 合并层：StructureData + 本请求 block 注册表 → StructureDefinition（非 Three）。
 * 注册表由调用方或服务端预先定稿；库内仅将 `blockRegistry.blocks` 拷贝进 `StructureDefinition.blocks`。
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
 * 无基底时由片段补全为可渲染条目。
 * `meshKind` 与 `simpleMesh` 对齐：JSON 常省略 meshKind；仅当既无 meshKind 又无面数据时视为 Unknown。
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
 * 将 overlay 合并进基底 blocks（供 `registrySlice` 等纯函数复用；渲染主路径不经过多层合并）。
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

/** 同 materialId 以 overlay 为准 */
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

export interface MergeStructureDataInput {
  /** 本请求已确定的 block 表（服务端或 Mock 给全） */
  blockRegistry: BlockRegistryData
}

export function mergeStructureData(model: StructureData, input: MergeStructureDataInput): StructureDefinition {
  const blocks = { ...input.blockRegistry.blocks }
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
