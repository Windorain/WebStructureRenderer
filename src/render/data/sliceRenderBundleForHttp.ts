/**
 * 按 document 内结构裁剪 RenderBundle，减小 HTTP 体积。
 * 终态 StructureData：压缩各帧 materialPalette；材质表为各帧 palette 合并（同 materialId 冲突时后者覆盖，多帧宜共用调色盘）。
 */

import type {
  BlockEntry,
  BlockRegistryData,
  MaterialEntry,
  MaterialRegistryData,
  ModelRegistryData,
  RenderBundle,
  StructureData,
  World,
} from '../schema/types'
import { materialPaletteToMaterialRegistry } from './materialPaletteBridge'
import { mergeMaterialRegistries } from './mergeScene'
import { collectPaletteBlockKeys, compactStructureMaterialPalette } from './registrySlice'

const EMPTY_BLOCKS: BlockRegistryData = { blocks: {} }
const EMPTY_MODELS: ModelRegistryData = { models: {} }

function isWorldDocument(doc: unknown): doc is World {
  return (
    doc !== null &&
    typeof doc === 'object' &&
    Array.isArray((doc as World).frames) &&
    typeof (doc as World).id === 'string'
  )
}

function extractStructuresForSlice(document: unknown): StructureData[] {
  if (isWorldDocument(document)) {
    const out: StructureData[] = []
    for (const f of document.frames) {
      if (f?.structure && typeof f.structure === 'object') {
        out.push(f.structure as StructureData)
      }
    }
    return out
  }
  const d = document as StructureData | null
  if (
    d &&
    d.mode === 'voxelPalette' &&
    Array.isArray(d.blockPalette) &&
    Array.isArray(d.cellGrid)
  ) {
    return [d]
  }
  return []
}

function cloneWorldWithCompactStructures(w: World, compacted: Map<StructureData, StructureData>): World {
  return {
    ...w,
    frames: w.frames.map((f) => {
      if (!f.structure) return f
      const c = compacted.get(f.structure)
      return { ...f, structure: c ?? f.structure }
    }),
  }
}

function compactDocumentInPlace(document: unknown): unknown {
  const structures = extractStructuresForSlice(document)
  if (structures.length === 0) return document
  const compacted = new Map<StructureData, StructureData>()
  for (const s of structures) {
    compacted.set(s, compactStructureMaterialPalette(s))
  }
  if (isWorldDocument(document)) {
    return cloneWorldWithCompactStructures(document, compacted)
  }
  return compacted.get(structures[0]) ?? document
}

function collectPaletteBlockKeysUnion(structures: StructureData[]): Set<string> {
  const keys = new Set<string>()
  for (const structure of structures) {
    if (!structure?.blockPalette) continue
    for (const k of collectPaletteBlockKeys(structure)) keys.add(k)
  }
  return keys
}

function sliceBlockRegistry(global: BlockRegistryData, neededKeys: Set<string>): BlockRegistryData {
  const blocks: Record<string, BlockEntry> = {}
  for (const k of neededKeys) {
    if (global.blocks[k] !== undefined) blocks[k] = global.blocks[k]
  }
  return { blocks }
}

function sliceModelRegistry(
  blocks: Record<string, BlockEntry>,
  fullModelRegistry: ModelRegistryData,
): ModelRegistryData {
  const modelIds = new Set<string>()
  for (const e of Object.values(blocks)) {
    if (e?.meshKind === 'Model' && e.modelId) modelIds.add(e.modelId)
  }
  const models: ModelRegistryData['models'] = {}
  for (const id of modelIds) {
    if (fullModelRegistry.models[id] !== undefined) models[id] = fullModelRegistry.models[id]
  }
  return { models }
}

export function sliceRenderBundleForHttp(bundle: RenderBundle): RenderBundle {
  const structures = extractStructuresForSlice(bundle.document)
  if (structures.length === 0) {
    return bundle
  }

  const newDoc = compactDocumentInPlace(bundle.document) as typeof bundle.document
  const compacted = extractStructuresForSlice(newDoc)

  let materialRegistry: MaterialRegistryData = { materials: {} as Record<string, MaterialEntry> }
  for (const s of compacted) {
    materialRegistry = mergeMaterialRegistries(materialRegistry, materialPaletteToMaterialRegistry(s.materialPalette))
  }
  materialRegistry = mergeMaterialRegistries(materialRegistry, bundle.materialRegistry ?? { materials: {} })

  const needed = collectPaletteBlockKeysUnion(compacted)
  const globalBlocks = bundle.blockRegistry ?? EMPTY_BLOCKS
  const globalModels = bundle.modelRegistry ?? EMPTY_MODELS
  const blockRegistry = sliceBlockRegistry(globalBlocks, needed)
  const modelRegistry = sliceModelRegistry(blockRegistry.blocks, globalModels)

  return {
    ...bundle,
    document: newDoc,
    blockRegistry,
    materialRegistry,
    modelRegistry,
  }
}
