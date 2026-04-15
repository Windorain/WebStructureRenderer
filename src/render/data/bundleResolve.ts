/**
 * 数据入口：document（StructureData | World）→ StructureDefinition；材质表仅由结构内 palette 汇总。
 */

import type {
  MaterialEntry,
  MaterialRegistryData,
  RenderBundle,
  StructureData,
  StructureDefinition,
  World,
} from '../schema/types'
import { materialPaletteEntryToMaterialEntry, materialPaletteToMaterialRegistry } from './materialPaletteBridge'
import { mergeStructureData } from './mergeScene'
import { embeddedStructure, frameAt, getDefaultFrameIndex } from './worldPlayback'

/** 自场景 document 汇总材质（World 为每帧 `frameIndex:materialIndex`，单结构为 `0`..`n-1`） */
export function mergeMaterialRegistryFromDocument(document: unknown): MaterialRegistryData {
  if (!document || typeof document !== 'object') return { materials: {} }
  if (isWorldDocument(document)) {
    const materials: Record<string, MaterialEntry> = {}
    for (let fi = 0; fi < document.frames.length; fi++) {
      const st = embeddedStructure(document.frames[fi])
      const pal = st?.materialPalette
      if (!pal?.length) continue
      for (let mi = 0; mi < pal.length; mi++) {
        materials[`${fi}:${mi}`] = materialPaletteEntryToMaterialEntry(pal[mi])
      }
    }
    return { materials }
  }
  const d = document as Partial<StructureData>
  if (d.mode === 'voxelPalette' && Array.isArray(d.materialPalette) && d.materialPalette.length > 0) {
    return materialPaletteToMaterialRegistry(d.materialPalette)
  }
  return { materials: {} }
}

export function loadStructureData(raw: unknown): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  return mergeStructureData(raw as StructureData)
}

export function isWorldDocument(raw: unknown): raw is World {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  return Array.isArray(o.frames) && typeof o.id === 'string'
}

export function loadWorldEmbeddedFrame(raw: unknown, frameIndex: number | undefined): StructureDefinition {
  if (!isWorldDocument(raw)) throw new Error('不是 World 文档')
  const w = raw
  const idx = frameIndex !== undefined ? Math.floor(frameIndex) : getDefaultFrameIndex(w)
  const frame = frameAt(w, idx)
  if (!frame) throw new Error(`World 无帧索引 ${idx}`)
  const data = embeddedStructure(frame)
  if (!data) {
    throw new Error(`World.frames[${idx}] 无内嵌 structure（仅 structureRef 的帧尚无法加载）`)
  }
  return loadStructureData(data)
}

export function loadStructureOrWorld(raw: unknown, frameIndex: number | undefined): StructureDefinition {
  if (isWorldDocument(raw)) {
    return loadWorldEmbeddedFrame(raw, frameIndex)
  }
  return loadStructureData(raw)
}

/** 按 plan：不校验 schema、不拒绝旧字段 */
export function validateRenderBundle(_b: RenderBundle): void {}

export interface RenderBundleResolveResult {
  definition: StructureDefinition
  /** World 时为 `frameIndex:`，与 mergeMaterialRegistryFromDocument 的键一致；单结构为 undefined */
  materialKeyPrefix: string | undefined
}

export function resolveRenderBundle(bundle: RenderBundle, frameIndex?: number): RenderBundleResolveResult {
  const doc = bundle?.document
  let materialKeyPrefix: string | undefined
  if (isWorldDocument(doc)) {
    const idx = frameIndex !== undefined ? Math.floor(frameIndex) : getDefaultFrameIndex(doc)
    materialKeyPrefix = `${idx}:`
  } else {
    materialKeyPrefix = undefined
  }
  const definition = loadStructureOrWorld(doc, frameIndex)
  return { definition, materialKeyPrefix }
}

export type { MaterialRegistryData, RenderBundle } from '../schema/types'
