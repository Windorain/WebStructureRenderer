/**
 * 与 src/render/data/registrySlice.ts 对齐：按 document 内 palette 从全局注册表切最小子集。
 * 供 preview-http（及 Wiki 侧同源实现）在返回 WikiRenderBundle 前调用，避免把全量 block/material/model 表交给嵌入页解析。
 */

function blockRegistryKeyForPalette(registryId, meta) {
  return meta === 0 ? registryId : `${registryId}@${meta}`
}

function isWorldDocument(doc) {
  return doc && typeof doc === 'object' && Array.isArray(doc.frames) && typeof doc.id === 'string'
}

/** 从 StructureData 或 World 内嵌帧收集用于切片的 StructureData 列表 */
function extractStructuresForPalette(document) {
  if (isWorldDocument(document)) {
    const out = []
    for (const f of document.frames) {
      if (f && f.structure && typeof f.structure === 'object') {
        out.push(f.structure)
      }
    }
    return out
  }
  if (
    document &&
    document.mode === 'voxelPalette' &&
    Array.isArray(document.palette) &&
    Array.isArray(document.cellGrid)
  ) {
    return [document]
  }
  return []
}

function collectPaletteBlockKeysUnion(structures) {
  const keys = new Set()
  for (const structure of structures) {
    if (!structure?.palette) continue
    for (const v of structure.palette) {
      keys.add(blockRegistryKeyForPalette(v.registryId, v.meta))
      keys.add(v.registryId)
    }
  }
  return keys
}

function sliceBlockRegistry(global, neededKeys) {
  const blocks = {}
  for (const k of neededKeys) {
    if (global.blocks[k] !== undefined) blocks[k] = global.blocks[k]
  }
  return { schemaVersion: global.schemaVersion, blocks }
}

function collectMaterialIdsFromBlockEntry(entry) {
  const ids = new Set()
  const faces = entry.faces ?? {}
  for (const def of Object.values(faces)) {
    if (!def?.layers) continue
    for (const layer of def.layers) {
      ids.add(layer.materialId)
    }
  }
  return ids
}

function stripTextureHash(ref) {
  return ref.startsWith('#') ? ref.slice(1) : ref
}

function collectMaterialIdsFromModelDoc(doc) {
  const ids = new Set()
  if (!doc?.elements) return ids
  for (const el of doc.elements) {
    const fm = el.faces ?? {}
    for (const f of Object.values(fm)) {
      if (!f) continue
      if (f.layers) {
        for (const L of f.layers) ids.add(stripTextureHash(L.texture))
      } else if (f.texture) {
        ids.add(stripTextureHash(f.texture))
      }
    }
  }
  return ids
}

function sliceMaterialRegistryForBlocks(blocks, global, fullModelRegistry) {
  const ids = new Set()
  for (const entry of Object.values(blocks)) {
    collectMaterialIdsFromBlockEntry(entry).forEach((id) => ids.add(id))
    if (entry.meshKind === 'Model' && entry.modelId && fullModelRegistry) {
      const doc = fullModelRegistry.models[entry.modelId]
      collectMaterialIdsFromModelDoc(doc).forEach((id) => ids.add(id))
    }
  }
  const materials = {}
  for (const id of ids) {
    const m = global.materials[id]
    if (m !== undefined) materials[id] = m
  }
  return { schemaVersion: global.schemaVersion, materials }
}

function sliceModelRegistry(blocks, fullModelRegistry) {
  const modelIds = new Set()
  for (const e of Object.values(blocks)) {
    if (e && e.meshKind === 'Model' && e.modelId) modelIds.add(e.modelId)
  }
  const models = {}
  for (const id of modelIds) {
    if (fullModelRegistry.models[id] !== undefined) models[id] = fullModelRegistry.models[id]
  }
  return { schemaVersion: fullModelRegistry.schemaVersion, models }
}

/**
 * 若可从 document 解析出结构，则裁剪注册表；否则原样返回（无法识别或仅 structureRef 时）。
 * @param {{ document: unknown, blockRegistry: object, materialRegistry: object, modelRegistry: object }} bundle
 */
export function sliceWikiRenderBundleForHttp(bundle) {
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
