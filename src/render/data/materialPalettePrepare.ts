/**
 * 渲染前唯一写 materialPalette[].blend 的阶段（缺省则按纹理 Alpha 推断）。
 */

import * as THREE from 'three'

import { locatorToResourceUrl } from '../assets/resolveAssets'
import { inferBlendFromTexture } from '../materials/inferBlendFromTexture'
import type { MaterialPaletteEntry, StructureData } from '../schema/types'
import { isWorldDocument } from './bundleResolve'
import { embeddedStructure } from './worldPlayback'

export interface MaterialTextureJob {
  materialId: string
  url: string
}

/**
 * 从 document 收集待加载纹理（不构建 MaterialRegistryData），键与 {@link materialRegistryFromDocument} 一致。
 */
export function collectMaterialTextureJobs(
  document: unknown,
  resourcesBase: string,
): MaterialTextureJob[] {
  if (!document || typeof document !== 'object') return []
  if (isWorldDocument(document)) {
    const jobs: MaterialTextureJob[] = []
    for (let fi = 0; fi < document.frames.length; fi++) {
      const st = embeddedStructure(document.frames[fi])
      const pal = st?.materialPalette
      if (!pal?.length) continue
      for (let mi = 0; mi < pal.length; mi++) {
        const entry = pal[mi]
        jobs.push({
          materialId: `${fi}:${mi}`,
          url: locatorToResourceUrl(entry.locator, resourcesBase),
        })
      }
    }
    return jobs
  }
  const d = document as Partial<StructureData>
  if (d.mode !== 'voxelPalette' || !Array.isArray(d.materialPalette)) return []
  const pal = d.materialPalette
  const jobs: MaterialTextureJob[] = []
  for (let i = 0; i < pal.length; i++) {
    jobs.push({
      materialId: String(i),
      url: locatorToResourceUrl(pal[i].locator, resourcesBase),
    })
  }
  return jobs
}

function forEachPaletteEntry(
  document: unknown,
  fn: (entry: MaterialPaletteEntry, materialId: string) => void,
): void {
  if (!document || typeof document !== 'object') return
  if (isWorldDocument(document)) {
    for (let fi = 0; fi < document.frames.length; fi++) {
      const st = embeddedStructure(document.frames[fi])
      const pal = st?.materialPalette
      if (!pal?.length) continue
      for (let mi = 0; mi < pal.length; mi++) {
        fn(pal[mi], `${fi}:${mi}`)
      }
    }
    return
  }
  const d = document as Partial<StructureData>
  if (d.mode !== 'voxelPalette' || !Array.isArray(d.materialPalette)) return
  const pal = d.materialPalette
  for (let i = 0; i < pal.length; i++) {
    fn(pal[i], String(i))
  }
}

/**
 * 对 `blend === undefined` 的条目写入推断值；显式 `blend` 不覆盖。
 * 须在纹理已装入 `preloaded` 之后、构建 MaterialRegistry 之前调用一次。
 */
export function prepareMaterialPaletteBlends(
  document: unknown,
  preloaded: Map<string, THREE.Texture>,
): void {
  forEachPaletteEntry(document, (entry, materialId) => {
    if (entry.blend !== undefined) return
    const tex = preloaded.get(materialId)
    if (!tex) {
      entry.blend = 'opaque'
      return
    }
    entry.blend = inferBlendFromTexture(tex)
  })
}
