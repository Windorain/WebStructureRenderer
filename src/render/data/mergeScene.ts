/**
 * 合并层：终态 StructureData 已自包含；本模块仅保留遗留注册表合并工具（HTTP 裁剪等可选路径）。
 */

import type {
  BlockEntry,
  BlockRegistryData,
  FaceLayersDef,
  MaterialRegistryData,
  ModelRegistryData,
  StructureData,
  StructureDefinition,
} from '../schema/types'

function mergeFaceLayersDef(
  base: FaceLayersDef | undefined,
  override: FaceLayersDef | undefined,
): FaceLayersDef | undefined {
  if (override?.layers && override.layers.length > 0) return override
  return base
}

function mergeFacesDeep(
  base: BlockEntry['faces'] | undefined,
  partial: Partial<BlockEntry['faces']> | undefined,
): BlockEntry['faces'] | undefined {
  if (!partial || Object.keys(partial).length === 0) return base
  const b = base ?? {}
  const out: NonNullable<BlockEntry['faces']> = { ...b }
  for (const key of Object.keys(partial) as (keyof NonNullable<BlockEntry['faces']>)[]) {
    const def = partial[key]
    if (!def) continue
    const prev = b[key as keyof typeof b]
    const merged = mergeFaceLayersDef(prev, def as FaceLayersDef)
    if (merged) out[key] = merged
  }
  return out
}

function mergeBlockEntry(base: BlockEntry, partial: Partial<BlockEntry>): BlockEntry {
  const mergedFaces = mergeFacesDeep(base.faces, partial.faces)
  return {
    ...base,
    ...partial,
    ...(mergedFaces !== undefined ? { faces: mergedFaces } : {}),
  }
}

function completeBlockEntry(partial: Partial<BlockEntry>): BlockEntry {
  if (partial.meshKind === undefined) {
    throw new Error('block_registry 片段缺少 meshKind')
  }
  const { meshKind } = partial
  if (meshKind === 'Model' && (partial.modelId === undefined || partial.modelId === '')) {
    throw new Error('meshKind=Model 时 modelId 必填')
  }
  return {
    ...partial,
    meshKind,
    ...(partial.modelId !== undefined ? { modelId: partial.modelId } : {}),
    ...(partial.faces !== undefined ? { faces: partial.faces } : {}),
  } as BlockEntry
}

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

export function mergeMaterialRegistries(
  base: MaterialRegistryData,
  overlay?: MaterialRegistryData,
): MaterialRegistryData {
  if (!overlay?.materials || Object.keys(overlay.materials).length === 0) {
    return base
  }
  return {
    materials: { ...base.materials, ...overlay.materials },
  }
}

export function mergeModelRegistries(
  base: ModelRegistryData,
  overlay?: ModelRegistryData,
): ModelRegistryData {
  if (!overlay?.models || Object.keys(overlay.models).length === 0) {
    return base
  }
  return {
    models: { ...base.models, ...overlay.models },
  }
}

/** @deprecated 终态 StructureData 无需合并输入；保留签名供旧调用点渐进迁移 */
export interface MergeStructureDataInput {
  blockRegistry?: BlockRegistryData
  modelRegistry?: ModelRegistryData
}

export function mergeStructureData(model: StructureData, _input?: MergeStructureDataInput): StructureDefinition {
  return { ...model }
}
