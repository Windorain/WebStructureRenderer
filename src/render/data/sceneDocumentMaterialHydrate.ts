/**
 * 场景 document（StructureData | World）的材质 hydrate：枚举拉图、补全 palette `blend`。
 * 与 {@link buildMaterialRegistryFromSceneDocument} 共用 materialId 规则。
 */

import * as THREE from 'three'

import { locatorToResourceUrl } from '../assets/resolveAssets'
import { inferMaterialBlendModeFromTexture } from '../materials/inferMaterialBlendModeFromTexture'
import type { MaterialPaletteEntry, StructureData } from '../schema/types'
import { isWorldDocument } from './bundleResolve'
import { embeddedStructure } from './worldPlayback'

export interface PaletteTextureFetchItem {
  materialId: string
  url: string
}

/**
 * 枚举需拉取的 palette 纹理（不构建 registry）。
 * materialId：单结构为槽下标字符串；World 为 `` `${frame}:${slot}` ``。
 */
export function listPaletteTexturesToFetch(
  document: unknown,
  resourcesBase: string,
): PaletteTextureFetchItem[] {
  if (!document || typeof document !== 'object') return []
  if (isWorldDocument(document)) {
    const items: PaletteTextureFetchItem[] = []
    for (let fi = 0; fi < document.frames.length; fi++) {
      const st = embeddedStructure(document.frames[fi])
      const pal = st?.materialPalette
      if (!pal?.length) continue
      for (let mi = 0; mi < pal.length; mi++) {
        const entry = pal[mi]
        items.push({
          materialId: `${fi}:${mi}`,
          url: locatorToResourceUrl(entry.locator, resourcesBase),
        })
      }
    }
    return items
  }
  const d = document as Partial<StructureData>
  if (d.mode !== 'voxelPalette' || !Array.isArray(d.materialPalette)) return []
  const pal = d.materialPalette
  const items: PaletteTextureFetchItem[] = []
  for (let i = 0; i < pal.length; i++) {
    items.push({
      materialId: String(i),
      url: locatorToResourceUrl(pal[i].locator, resourcesBase),
    })
  }
  return items
}

function forEachPaletteSlot(
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
 * 对 `blend === undefined` 的槽位写入推断值；已显式设置的 `blend` 不覆盖。
 * 须在纹理已装入 `preloaded` 之后、{@link buildMaterialRegistryFromSceneDocument} 之前调用一次。
 */
export function hydrateMaterialBlendsInSceneDocument(
  document: unknown,
  preloaded: Map<string, THREE.Texture>,
): void {
  forEachPaletteSlot(document, (entry, materialId) => {
    if (entry.blend !== undefined) return
    const tex = preloaded.get(materialId)
    if (!tex) {
      entry.blend = 'opaque'
      return
    }
    entry.blend = inferMaterialBlendModeFromTexture(tex)
  })
}
