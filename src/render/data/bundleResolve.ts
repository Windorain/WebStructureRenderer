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
import { indexedRegistryFromMaterialPalette, registryEntryFromPaletteSlot } from './materialPaletteBridge'
import { toStructureDefinition } from './structureDefinition'
import { embeddedStructure, frameAt, getDefaultFrameIndex } from './worldPlayback'

/**
 * 由场景 document（StructureData 或 World）构建材质注册表。
 * World：`materialId` = `` `${frameIndex}:${slotIndex}` ``；单结构：`"0"`..`"n-1"`。
 * 须在 {@link hydrateMaterialBlendsInSceneDocument} 之后调用，以便 `blend` 已写入 palette。
 */
export function buildMaterialRegistryFromSceneDocument(document: unknown): MaterialRegistryData {
  if (!document || typeof document !== 'object') return { materials: {} }
  if (isWorldDocument(document)) {
    const materials: Record<string, MaterialEntry> = {}
    for (let fi = 0; fi < document.frames.length; fi++) {
      const st = embeddedStructure(document.frames[fi])
      const pal = st?.materialPalette
      if (!pal?.length) continue
      for (let mi = 0; mi < pal.length; mi++) {
        materials[`${fi}:${mi}`] = registryEntryFromPaletteSlot(pal[mi])
      }
    }
    return { materials }
  }
  const d = document as Partial<StructureData>
  if (d.mode === 'voxelPalette' && Array.isArray(d.materialPalette) && d.materialPalette.length > 0) {
    return indexedRegistryFromMaterialPalette(d.materialPalette)
  }
  return { materials: {} }
}

export function loadStructureData(raw: unknown): StructureDefinition {
  if (!raw || typeof raw !== 'object') throw new Error('StructureData 无效')
  return toStructureDefinition(raw as StructureData)
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

/** 不校验根级 schemaVersion；终态 StructureData 以 mode=voxelPalette 与字段形态为准 */
export function validateRenderBundle(_b: RenderBundle): void {}

export interface RenderBundleResolveResult {
  definition: StructureDefinition
  /** World 时为 `frameIndex:`，与 buildMaterialRegistryFromSceneDocument 的 materialId 前缀一致；单结构为 undefined */
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
