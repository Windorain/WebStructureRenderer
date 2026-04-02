/**
 * 按 document 内 palette 裁剪 RenderBundle，减小 HTTP 传输体积。
 * 与 wiki-mock 在返回 bundle 前调用同一实现。
 */

import { blockRegistryKeyForPalette } from './blockRegistryResolve'
import { collectPaletteShellMaterialIdsUnion, sliceMaterialRegistryForBlocks } from './registrySlice'
import type { BlockEntry, BlockRegistryData, ModelRegistryData, RenderBundle, StructureData, World } from '../schema/types'

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
  const shellMaterialIds = collectPaletteShellMaterialIdsUnion(structures)
  const materialRegistry = sliceMaterialRegistryForBlocks(
    blockRegistry.blocks,
    bundle.materialRegistry,
    bundle.modelRegistry,
    shellMaterialIds,
  )
  const modelRegistry = sliceModelRegistry(blockRegistry.blocks, bundle.modelRegistry)
  return {
    document: bundle.document,
    blockRegistry,
    materialRegistry,
    modelRegistry,
  }
}
