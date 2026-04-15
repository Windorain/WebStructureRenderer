/**
 * 按 palette 从全局注册表切片、多段 block 表合并、按方块条目收集材质。
 * HTTP 返回 bundle 前的裁剪见 `sliceRenderBundleForHttp`。
 */

import { normalizeLocatorForBundle } from '../assets/resolveAssets'
import { blockRegistryKeyForPalette } from './blockRegistryResolve'
import { mergeBlockRegistries } from './mergeScene'
import type {
  BlockEntry,
  BlockRegistryData,
  MaterialEntry,
  MaterialRegistryData,
  ModelDocument,
  ModelRegistryData,
  StructureData,
} from '../schema/types'
import { mergeMaterialRegistries } from './mergeScene'
import { collectMaterialIdsFromBlockEntry } from '../mesh/layerMaterialResolve'

/** palette 解析所需的 block 键（含 `registryId@meta` 与裸 `registryId` 回退） */
export function collectPaletteBlockKeys(structure: StructureData): Set<string> {
  const keys = new Set<string>()
  for (const v of structure.palette) {
    keys.add(blockRegistryKeyForPalette(v.registryId, v.meta))
    keys.add(v.registryId)
  }
  return keys
}

/** 结构 palette 中 `shellMaterialId`（GT 仓室壳层）的 union，用于材质表裁剪 */
export function collectPaletteShellMaterialIdsUnion(structures: StructureData[]): Set<string> {
  const ids = new Set<string>()
  for (const structure of structures) {
    for (const v of structure.palette) {
      const s = v.shellMaterialId
      if (typeof s === 'string' && s.length > 0) ids.add(s)
    }
  }
  return ids
}

/** 从全局 block 表中只保留 palette 可能用到的键（服务端组最小包） */
export function sliceBlockRegistryByPalette(
  structure: StructureData,
  global: BlockRegistryData,
): BlockRegistryData {
  const needed = collectPaletteBlockKeys(structure)
  const blocks: Record<string, BlockEntry> = {}
  for (const k of needed) {
    if (global.blocks[k] !== undefined) blocks[k] = global.blocks[k]
  }
  return { blocks }
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

/** 根据已切片的方块表，从全局材质表中只保留被引用的 materialId；可选并入 palette 采样的壳层 locator */
export function sliceMaterialRegistryForBlocks(
  blocks: Record<string, BlockEntry>,
  global: MaterialRegistryData,
  modelRegistry?: ModelRegistryData,
  extraMaterialIds?: Iterable<string>,
): MaterialRegistryData {
  const ids = new Set<string>()
  for (const entry of Object.values(blocks)) {
    collectMaterialIdsFromBlockEntry(entry).forEach((id) => ids.add(id))
    if (entry.meshKind === 'Model' && entry.modelId && modelRegistry) {
      const doc = modelRegistry.models[entry.modelId]
      collectMaterialIdsFromModelDoc(doc).forEach((id) => ids.add(id))
    }
  }
  if (extraMaterialIds) {
    for (const id of extraMaterialIds) {
      ids.add(id)
    }
  }
  const materials: Record<string, MaterialEntry> = {}
  for (const id of ids) {
    const m = global.materials[id]
    if (m !== undefined) materials[id] = m
  }
  return { materials }
}

/** 多上传方/多包 block 片段顺序合并（与 mergeStructureData 内链一致） */
export function mergeManyBlockRegistryLayers(layers: BlockRegistryData[]): BlockRegistryData {
  if (layers.length === 0) return { blocks: {} }
  let blocks = mergeBlockRegistries({}, layers[0].blocks)
  for (let i = 1; i < layers.length; i++) {
    blocks = mergeBlockRegistries(blocks, layers[i].blocks)
  }
  return { blocks }
}

/** `structure.capture` 中出现的 materialKey / sampler.texture，用于裁剪或补全材质表 */
export function collectCaptureMaterialKeys(structure: StructureData): Set<string> {
  const keys = new Set<string>()
  const cap = structure.capture
  if (!cap) return keys
  for (const s of cap.samplers ?? []) {
    if (typeof s.texture === 'string' && s.texture.length > 0) keys.add(s.texture)
  }
  for (const inst of cap.instances ?? []) {
    for (const q of inst.quads ?? []) {
      if (typeof q.materialKey === 'string' && q.materialKey.length > 0) keys.add(q.materialKey)
    }
  }
  return keys
}

/**
 * 为捕获中出现的键提供材质条目：优先用全局注册表，否则用与 SDE `samplers.texture` 相同的键经 {@link normalizeLocatorForBundle} 得 locator。
 */
export function ensureMaterialsForCaptureKeys(
  global: MaterialRegistryData,
  keys: Set<string>,
): MaterialRegistryData {
  const materials: Record<string, MaterialEntry> = {}
  for (const id of keys) {
    const existing = global.materials[id]
    if (existing) {
      materials[id] = existing
    } else {
      const loc = id.includes(':') ? id : `minecraft:${id}`
      materials[id] = { locator: normalizeLocatorForBundle(loc), kind: 'static16' }
    }
  }
  return { materials }
}

/** 将捕获所需材质合并进已切片材质表（overlay 覆盖同名键） */
export function mergeCaptureMaterialsIntoSlice(
  sliced: MaterialRegistryData,
  global: MaterialRegistryData,
  captureKeys: Set<string>,
): MaterialRegistryData {
  if (captureKeys.size === 0) return sliced
  return mergeMaterialRegistries(sliced, ensureMaterialsForCaptureKeys(global, captureKeys))
}
