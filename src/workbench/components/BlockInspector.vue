<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { renderTooltipHtml } from './renderTooltipHtml'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { isWorldDocument } from '@/render/data/bundleResolve'
import { t } from '@/workbench/i18n'

const props = defineProps<{
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const ctx = useWorkbenchContext()
const tooltipText = ref('')
const saveFeedback = ref('')

/** ctx.scene 始终为 Raw，直接读取 */
function readCurrentTooltip(): string {
  const doc = ctx.scene.value
  if (!doc || !props.selectedBlock?.voxel) return ''
  const { zSlice, row, column } = props.selectedBlock.voxel
  let tp: unknown, ttg: unknown
  if (isWorldDocument(doc)) {
    tp = doc.tooltipPalette
    const frames = doc.frames
    if (Array.isArray(frames) && frames.length > 0) {
      ttg = ((frames[0] as Record<string, unknown>)?.structure as Record<string, unknown> | undefined)?.cellTooltipGrid
    }
  } else {
    tp = doc.tooltipPalette
    ttg = doc.cellTooltipGrid
  }
  if (!Array.isArray(tp) || tp.length === 0) return ''
  if (!Array.isArray(ttg)) return ''
  const zArr = ttg[zSlice]; if (!Array.isArray(zArr)) return ''
  const rArr = zArr[row]; if (!Array.isArray(rArr)) return ''
  const idx = rArr[column]
  if (typeof idx !== 'number' || idx < 0) return ''
  return String(tp[idx] ?? '')
}

function buildEmptyTooltipGrid(doc: Record<string, unknown>): number[][][] {
  const cg = doc.cellGrid
  if (!Array.isArray(cg) || cg.length === 0) return []
  const grid: number[][][] = []
  for (const zArr of cg) {
    if (!Array.isArray(zArr)) continue
    const rows: number[][] = []
    for (const rArr of zArr) {
      if (!Array.isArray(rArr)) continue
      rows.push(new Array(rArr.length).fill(-1))
    }
    grid.push(rows)
  }
  return grid
}

function setPaletteAndGrid(
  doc: Record<string, unknown>,
  zSlice: number, row: number, column: number,
  text: string,
): void {
  if (isWorldDocument(doc)) {
    if (!Array.isArray(doc.tooltipPalette)) doc.tooltipPalette = []
    const tp = doc.tooltipPalette as string[]
    let idx = tp.indexOf(text)
    if (idx === -1 && text) { idx = tp.length; tp.push(text) }
    const frames = doc.frames
    if (Array.isArray(frames) && frames.length > 0) {
      const st = (frames[0] as Record<string, unknown>)?.structure as Record<string, unknown> | undefined
      if (st) {
        if (!Array.isArray(st.cellTooltipGrid)) st.cellTooltipGrid = buildEmptyTooltipGrid(st)
        const ttg = st.cellTooltipGrid as number[][][]
        if (ttg[zSlice] && ttg[zSlice][row]) ttg[zSlice][row][column] = text ? idx : -1
      }
    }
  } else {
    if (!Array.isArray(doc.tooltipPalette)) doc.tooltipPalette = []
    const tp = doc.tooltipPalette as string[]
    let idx = tp.indexOf(text)
    if (idx === -1 && text) { idx = tp.length; tp.push(text) }
    if (!Array.isArray(doc.cellTooltipGrid)) doc.cellTooltipGrid = buildEmptyTooltipGrid(doc)
    const ttg = doc.cellTooltipGrid as number[][][]
    if (ttg[zSlice] && ttg[zSlice][row]) ttg[zSlice][row][column] = text ? idx : -1
  }
}

async function saveTooltip(): Promise<void> {
  const doc = ctx.scene.value
  if (!doc || !props.selectedBlock?.voxel) return
  const { zSlice, row, column } = props.selectedBlock.voxel
  try {
    setPaletteAndGrid(doc, zSlice, row, column, tooltipText.value)
    ctx.dirty.value = true
    saveFeedback.value = '已保存并同步预览'
  } catch (e) {
    saveFeedback.value = e instanceof Error ? e.message : String(e)
  }
}

const previewHtml = computed(() => {
  if (!tooltipText.value) return ''
  return renderTooltipHtml(tooltipText.value)
})

watch(
  () => props.selectedBlock,
  (b) => { tooltipText.value = b ? readCurrentTooltip() : '' },
  { immediate: true },
)
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">{{ t('blockInspector') }}</div>
    <template v-if="!selectedBlock">
      <p class="pe-muted">{{ t('enterEditMode') }}</p>
    </template>
    <template v-else>
      <div class="bi-field">
        <span class="bi-label">{{ t('block') }}</span>
        <span class="bi-val">{{ selectedBlock.blockId }}</span>
      </div>
      <div v-if="selectedBlock.voxel" class="bi-field">
        <span class="bi-label">{{ t('position') }}</span>
        <span class="bi-val">{{ selectedBlock.voxel.column }}, {{ selectedBlock.voxel.row }}, {{ selectedBlock.voxel.zSlice }}</span>
      </div>
      <div class="bi-field">
        <span class="bi-label">{{ t('tooltipMd') }}</span>
        <textarea v-model="tooltipText" class="bi-textarea" rows="5" placeholder="**粗体** *斜体* `代码`" />
      </div>
      <div v-if="previewHtml" class="bi-preview">
        <span class="bi-label">{{ t('preview') }}</span>
        <div class="bi-preview-box" v-html="previewHtml" />
      </div>
      <div class="bi-row">
        <button class="pe-btn pe-btn--primary" @click="void saveTooltip()">{{ t('saveTooltip') }}</button>
        <button class="pe-btn" @click="tooltipText = ''">{{ t('clear') }}</button>
      </div>
      <p v-if="saveFeedback" class="pe-feedback">{{ saveFeedback }}</p>
    </template>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: #64748b; }
.bi-field { margin-bottom: 8px; }
.bi-label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
.bi-val { font-family: ui-monospace, monospace; font-size: 12px; color: #e2e8f0; }
.bi-textarea {
  width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid #334155;
  background: #0f172a; color: #e2e8f0; font-size: 12px; font-family: ui-monospace, monospace;
  resize: vertical; box-sizing: border-box;
}
.bi-preview { margin: 8px 0; }
.bi-preview-box {
  padding: 8px; border-radius: 4px; border: 1px dashed #334155;
  background: #0f172a; min-height: 24px; font-size: 12px; color: #e2e8f0;
}
.bi-row { display: flex; gap: 6px; margin-top: 6px; }
.pe-btn {
  padding: 4px 10px; border-radius: 4px; border: 1px solid #475569;
  background: #334155; color: #f8fafc; cursor: pointer; font-size: 11px;
}
.pe-btn--primary { background: #2563eb; border-color: #1d4ed8; }
.pe-feedback { margin-top: 6px; font-size: 11px; color: #a5b4fc; }
</style>
