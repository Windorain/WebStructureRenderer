/**
 * 合并层：StructureData + 本请求 block 注册表 → StructureDefinition（非 Three）。
 * 注册表由调用方或服务端预先定稿；库内仅将 `blockRegistry.blocks` 拷贝进 `StructureDefinition.blocks`。
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

const EMPTY_MODEL_REGISTRY: ModelRegistryData = { models: {} }

/**
 * 无基底时由片段补全；**meshKind 必填**（破坏性契约）。
 */
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
    materials: { ...base.materials, ...overlay.materials },
  }
}

/** 同 modelId 以 overlay 为准 */
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

export interface MergeStructureDataInput {
  /** 本请求已确定的 block 表（服务端或 Mock 给全） */
  blockRegistry: BlockRegistryData
  /** 与 block 配套的模型表；可省略，等价于空表 */
  modelRegistry?: ModelRegistryData
}

export function mergeStructureData(model: StructureData, input: MergeStructureDataInput): StructureDefinition {
  const blocks = { ...input.blockRegistry.blocks }
  const modelRegistry = input.modelRegistry ?? EMPTY_MODEL_REGISTRY
  return {
    mode: 'voxelPalette',
    id: model.id,
    palette: model.palette,
    cellGrid: model.cellGrid,
    blocks,
    modelRegistry,
    capture: model.capture,
    initialCamera: model.initialCamera,
  }
}
