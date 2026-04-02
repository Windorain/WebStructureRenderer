/**
 * 按 document 内 palette 裁剪 RenderBundle，减小 HTTP 传输体积。
 * 与 wiki-mock 在返回 bundle 前调用同一实现。
 */

import { blockRegistryKeyForPalette } from './blockRegistryResolve'
import type {
  BlockEntry,
  BlockRegistryData,
  MaterialRegistryData,
  ModelDocument,
  ModelRegistryData,
  RenderBundle,
  StructureData,
  World,
} from '../schema/types'

function isWorldDocument(doc: unknown): doc is World {
  return (
    doc !== null &&
    typeof doc === 'object' &&
    Array.isArray((doc as World).frames) &&
    typeof (doc as World).id === 'string'
  )
}

function extractStructuresForPalette(document: unknown): StructureData[] {
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
    Array.isArray(d.palette) &&
    Array.isArray(d.cellGrid)
  ) {
    return [d]
  }
  return []
}

function collectPaletteBlockKeysUnion(structures: StructureData[]): Set<string> {
  const keys = new Set<string>()
  for (const structure of structures) {
    if (!structure?.palette) continue
    for (const v of structure.palette) {
      keys.add(blockRegistryKeyForPalette(v.registryId, v.meta))
      keys.add(v.registryId)
    }
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

function collectMaterialIdsFromBlockEntry(entry: BlockEntry): Set<string> {
  const ids = new Set<string>()
  const faces = entry.faces ?? {}
  for (const def of Object.values(faces)) {
    if (!def?.layers) continue
    for (const layer of def.layers) {
      ids.add(layer.materialId)
    }
  }
  return ids
}

function stripTextureHash(ref: string): string {
  return ref.startsWith('#') ? ref.slice(1) : ref
}

function collectMaterialIdsFromModelDoc(doc: ModelDocument | undefined): Set<string> {
  const ids = new Set<string>()
  if (!doc?.elements) return ids
  for (const el of doc.elements) {
    const fm = el.faces ?? {}
    for (const f of Object.values(fm)) {
      if (!f) continue
      // 须与 modelMesh.modelFaceToLayerDefs 一致：`[]` 为假长度，回退 `texture`
      if (f.layers && f.layers.length > 0) {
        for (const L of f.layers) {
          if (L.texture) ids.add(stripTextureHash(L.texture))
        }
      } else if (f.texture) {
        ids.add(stripTextureHash(f.texture))
      }
    }
  }
  return ids
}

function sliceMaterialRegistryForBlocks(
  blocks: Record<string, BlockEntry>,
  global: MaterialRegistryData,
  fullModelRegistry?: ModelRegistryData,
): MaterialRegistryData {
  const ids = new Set<string>()
  for (const entry of Object.values(blocks)) {
    collectMaterialIdsFromBlockEntry(entry).forEach((id) => ids.add(id))
    if (entry.meshKind === 'Model' && entry.modelId && fullModelRegistry) {
      const doc = fullModelRegistry.models[entry.modelId]
      collectMaterialIdsFromModelDoc(doc).forEach((id) => ids.add(id))
    }
  }
  const materials: MaterialRegistryData['materials'] = {}
  for (const id of ids) {
    const m = global.materials[id]
    if (m !== undefined) materials[id] = m
  }
  return { materials }
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

/**
 * 若可从 document 解析出结构，则裁剪注册表；否则原样返回。
 */
export function sliceRenderBundleForHttp(bundle: RenderBundle): RenderBundle {
  const structures = extractStructuresForPalette(bundle.document)
  if (structures.length === 0) {
    return bundle
  }
  const needed = collectPaletteBlockKeysUnion(structures)
  const blockRegistry = sliceBlockRegistry(bundle.blockRegistry, needed)
  const materialRegistry = sliceMaterialRegistryForBlocks(
    blockRegistry.blocks,
    bundle.materialRegistry,
    bundle.modelRegistry,
  )
  const modelRegistry = sliceModelRegistry(blockRegistry.blocks, bundle.modelRegistry)
  return {
    document: bundle.document,
    blockRegistry,
    materialRegistry,
    modelRegistry,
  }
}
