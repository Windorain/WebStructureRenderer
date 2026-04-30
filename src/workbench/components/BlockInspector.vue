<script setup lang="ts">
import { computed } from 'vue'
import { renderTooltipHtml } from './renderTooltipHtml'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { isWorldDocument, loadStructureOrWorld } from '@/render/data/bundleResolve'
import type { BlockPaletteEntry } from '@/render/schema/types'

const ctx = useWorkbenchContext()
const selectedBlock = computed(() => ctx.selectedBlock.value)

const paletteEntry = computed<BlockPaletteEntry | null>(() => {
  if (!selectedBlock.value) return null
  const doc = ctx.scene.value
  if (!doc) return null
  try {
    const def = loadStructureOrWorld(doc, undefined)
    return def.blockPalette.find(e => e.registryId === selectedBlock.value!.blockId) ?? null
  } catch { return null }
})

const materialIndices = computed<number[]>(() => {
  const quads = paletteEntry.value?.geometry?.quads
  if (!quads || quads.length === 0) return []
  const seen = new Set<number>()
  for (const q of quads) seen.add(q.materialIndex)
  return [...seen].sort((a, c) => a - c)
})

function materialName(index: number): string {
  const doc = ctx.scene.value
  if (!doc) return `#${index}`
  let pal: unknown
  if (isWorldDocument(doc)) {
    pal = doc.materialPalette
  } else {
    pal = (doc as Record<string, unknown>).materialPalette
  }
  if (!Array.isArray(pal) || !pal[index]) return `#${index}`
  return (pal[index] as { locator?: string }).locator ?? `#${index}`
}

const tooltipPreview = computed(() => {
  const doc = ctx.scene.value
  if (!doc || !selectedBlock.value?.voxel) return ''
  const { zSlice, row, column } = selectedBlock.value.voxel
  let tp: unknown, ttg: unknown
  if (isWorldDocument(doc)) {
    tp = doc.tooltipPalette
    const frames = doc.frames
    if (Array.isArray(frames) && frames.length > 0) {
      ttg = ((frames[0] as Record<string, unknown>)?.structure as Record<string, unknown> | undefined)?.cellTooltipGrid
    }
  } else {
    tp = (doc as Record<string, unknown>).tooltipPalette
    ttg = (doc as Record<string, unknown>).cellTooltipGrid
  }
  if (!Array.isArray(tp) || tp.length === 0) return ''
  if (!Array.isArray(ttg)) return ''
  const zArr = ttg[zSlice]; if (!Array.isArray(zArr)) return ''
  const rArr = zArr[row]; if (!Array.isArray(rArr)) return ''
  const idx = rArr[column]
  if (typeof idx !== 'number' || idx < 0) return ''
  return String(tp[idx] ?? '')
})

const tooltipHtml = computed(() => tooltipPreview.value ? renderTooltipHtml(tooltipPreview.value) : '')
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">方块检查器</div>
    <template v-if="!selectedBlock">
      <p class="pe-muted">点击 3D 视口选取方块</p>
    </template>
    <template v-else>
      <h3>身份</h3>
      <table class="bi-table">
        <tr><td>registryId</td><td class="bi-td-val">{{ selectedBlock.blockId }}</td></tr>
        <tr v-if="paletteEntry"><td>meta</td><td class="bi-td-val">{{ paletteEntry.meta }}</td></tr>
        <tr v-if="paletteEntry?.facing"><td>facing</td><td class="bi-td-val">{{ paletteEntry.facing }}</td></tr>
        <tr v-if="paletteEntry"><td>renderMode</td><td class="bi-td-val">{{ paletteEntry.renderMode }}</td></tr>
      </table>

      <template v-if="selectedBlock.voxel">
        <h3>位置</h3>
        <span class="bi-pos">{{ selectedBlock.voxel.column }}, {{ selectedBlock.voxel.row }}, {{ selectedBlock.voxel.zSlice }}</span>
      </template>

      <h3>注解</h3>
      <div v-if="tooltipHtml" class="bi-preview" v-html="tooltipHtml" />
      <p v-else class="pe-muted">无注解</p>

      <h3>材质引用</h3>
      <template v-if="materialIndices.length">
        <div v-for="mi in materialIndices" :key="mi" class="bi-mat-row">
          <span class="bi-mat-idx">{{ mi }}</span>
          <span class="bi-mat-name">{{ materialName(mi) }}</span>
        </div>
      </template>
      <p v-else class="pe-muted">无材质信息</p>
    </template>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: var(--nei-text); text-shadow: var(--nei-label-shadow); margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: var(--nei-muted); }
h3 { font-size: 10px; font-weight: 600; color: var(--nei-label); text-transform: uppercase; letter-spacing: 0.3px; margin: 10px 0 4px; }
.bi-table { width: 100%; border-collapse: collapse; }
.bi-table td { padding: 2px 6px 2px 0; font-size: 11px; }
.bi-table td:first-child { color: var(--nei-label); width: 80px; }
.bi-td-val { font-family: ui-monospace, monospace; color: var(--nei-text-dark); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background: var(--nei-bg); padding: 1px 4px; border: 1px solid var(--nei-border); }
.bi-pos { font-family: ui-monospace, monospace; font-size: 12px; color: var(--nei-text-dark); }
.bi-preview { padding: 6px; border-radius: 4px; border: var(--nei-bevel-w) solid; border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow); background: var(--nei-inset-bg); font-size: 12px; color: var(--nei-text); min-height: 20px; word-break: break-word; }
.bi-preview :deep(strong) { font-weight: 700; }
.bi-preview :deep(em) { font-style: italic; }
.bi-preview :deep(code) { font-family: ui-monospace, monospace; background: rgba(0,0,0,0.2); padding: 1px 3px; border-radius: 2px; }
.bi-mat-row { display: flex; gap: 6px; padding: 2px 0; }
.bi-mat-idx { font-family: ui-monospace, monospace; font-size: 11px; color: var(--nei-label); min-width: 24px; }
.bi-mat-name { font-family: ui-monospace, monospace; font-size: 11px; color: var(--nei-text-dark); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
