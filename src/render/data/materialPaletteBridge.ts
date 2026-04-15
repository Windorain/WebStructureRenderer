/**
 * materialPalette（数组）↔ SimpleMaterialLibrary 使用的 MaterialRegistryData（materialId → MaterialEntry）。
 * 烘焙网格使用 materialId = 十进制下标字符串 "0".."n-1"。
 */

import type { MaterialEntry, MaterialPaletteEntry, MaterialRegistryData } from '../schema/types'

export function materialPaletteEntryToMaterialEntry(e: MaterialPaletteEntry): MaterialEntry {
  return {
    locator: e.locator,
    kind: e.kind,
    blend: e.blend,
    emissive: e.emissive,
    animation: e.animation,
  }
}

export function materialPaletteToMaterialRegistry(palette: MaterialPaletteEntry[]): MaterialRegistryData {
  const materials: Record<string, MaterialEntry> = {}
  for (let i = 0; i < palette.length; i++) {
    materials[String(i)] = materialPaletteEntryToMaterialEntry(palette[i])
  }
  return { materials }
}
