/**
 * 结构内 materialPalette 裁剪、遗留注册表合并工具。
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
import { collectMaterialIdsFromBlockEntry } from '../mesh/layerMaterialResolve'

/** block_registry 键收集（遗留 HTTP 裁剪） */
export function collectPaletteBlockKeys(structure: StructureData): Set<string> {
  const keys = new Set<string>()
  for (const v of structure.blockPalette) {
    keys.add(blockRegistryKeyForPalette(v.registryId, v.meta))
    keys.add(v.registryId)
  }
  return keys
}

/** 几何实际引用的 materialPalette 下标 */
export function collectReferencedMaterialIndices(structure: StructureData): Set<number> {
  const s = new Set<number>()
  for (const e of structure.blockPalette) {
    for (const q of e.geometry?.quads ?? []) {
      if (typeof q.materialIndex === 'number' && Number.isInteger(q.materialIndex)) {
        s.add(q.materialIndex)
      }
    }
  }
  return s
}

/** 去除未引用项并重写 quads.materialIndex */
export function compactStructureMaterialPalette(s: StructureData): StructureData {
  const used = collectReferencedMaterialIndices(s)
  const oldPal = s.materialPalette
  const sorted = [...used].filter((i) => i >= 0 && i < oldPal.length).sort((a, b) => a - b)
  const map = new Map<number, number>()
  const newPal = sorted.map((oldI, newI) => {
    map.set(oldI, newI)
    return oldPal[oldI]
  })
  const newBlocks = s.blockPalette.map((entry) => ({
    ...entry,
    geometry: {
      ...entry.geometry,
      quads: entry.geometry.quads.map((q) => {
        const ni = map.get(q.materialIndex)
        if (ni === undefined) {
          throw new Error(`compactMaterialPalette: 未映射的 materialIndex ${q.materialIndex}`)
        }
        return { ...q, materialIndex: ni }
      }),
    },
  }))
  return { ...s, materialPalette: newPal, blockPalette: newBlocks }
}

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

export function mergeManyBlockRegistryLayers(layers: BlockRegistryData[]): BlockRegistryData {
  if (layers.length === 0) return { blocks: {} }
  let blocks = mergeBlockRegistries({}, layers[0].blocks)
  for (let i = 1; i < layers.length; i++) {
    blocks = mergeBlockRegistries(blocks, layers[i].blocks)
  }
  return { blocks }
}

/** @deprecated */
export function collectCaptureMaterialKeys(_structure: StructureData): Set<string> {
  return new Set()
}

/** @deprecated */
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

/** @deprecated */
export function mergeCaptureMaterialsIntoSlice(
  sliced: MaterialRegistryData,
  _global: MaterialRegistryData,
  captureKeys: Set<string>,
): MaterialRegistryData {
  if (captureKeys.size === 0) return sliced
  return sliced
}

export function collectPaletteShellMaterialIdsUnion(_structures: StructureData[]): Set<string> {
  return new Set()
}
