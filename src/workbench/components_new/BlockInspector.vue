<script setup lang="ts">
/**
 * 方块检查器：编辑模式下选中方块后的 tooltip 编辑器 + Markdown 实时预览。
 */
import { computed, ref, watch } from 'vue'
import snarkdown from 'snarkdown'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { isWorldDocument } from '@/render/data/bundleResolve'

const props = defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const ctx = useWorkbenchContext()

const tooltipText = ref('')
const saveFeedback = ref('')

/** 从 tooltipPalette + cellTooltipGrid 读取当前方块的 tooltip */
function readCurrentTooltip(): string {
  const doc = ctx.scene.value
  if (!doc || !props.selectedBlock?.voxel) return ''
  const { zSlice, row, column } = props.selectedBlock.voxel

  let ttg: unknown = undefined
  let tp: unknown = undefined

  if (isWorldDocument(doc)) {
    // World: read from root tooltipPalette, cellTooltipGrid from current frame
    tp = doc.tooltipPalette
    const frames = doc.frames
    if (Array.isArray(frames) && frames.length > 0) {
      const st = (frames[0] as Record<string, unknown>)?.structure as Record<string, unknown> | undefined
      ttg = st?.cellTooltipGrid
    }
  } else {
    const d = doc as Record<string, unknown>
    tp = d.tooltipPalette
    ttg = d.cellTooltipGrid
  }

  if (!Array.isArray(tp) || tp.length === 0) return ''
  if (!Array.isArray(ttg)) return ''

  const zArr = ttg[zSlice]
  if (!Array.isArray(zArr)) return ''
  const rArr = zArr[row]
  if (!Array.isArray(rArr)) return ''
  const idx = rArr[column]
  if (typeof idx !== 'number' || idx < 0) return ''
  return String(tp[idx] ?? '')
}

/** 将 tooltip 写回 tooltipPalette + cellTooltipGrid */
function saveTooltip(): void {
  const doc = ctx.scene.value
  if (!doc || !props.selectedBlock?.voxel) return
  const { zSlice, row, column } = props.selectedBlock.voxel

  try {
    if (isWorldDocument(doc)) {
      // 确保根级 tooltipPalette 存在
      if (!Array.isArray(doc.tooltipPalette)) {
        (doc as Record<string, unknown>).tooltipPalette = []
      }
      const tp = doc.tooltipPalette as string[]
      // 查找或追加
      let idx = tp.indexOf(tooltipText.value)
      if (idx === -1 && tooltipText.value) {
        idx = tp.length
        tp.push(tooltipText.value)
      }
      // 写入 cellTooltipGrid（当前帧的 structure）
      const frames = doc.frames
      if (Array.isArray(frames) && frames.length > 0) {
        const st = (frames[0] as Record<string, unknown>)?.structure as Record<string, unknown> | undefined
        if (st) {
          if (!Array.isArray(st.cellTooltipGrid)) {
            st.cellTooltipGrid = buildEmptyTooltipGrid(st)
          }
          const ttg = st.cellTooltipGrid as number[][][]
          if (ttg[zSlice] && ttg[zSlice][row]) {
            ttg[zSlice][row][column] = tooltipText.value ? idx : -1
          }
        }
      }
    } else {
      const d = doc as Record<string, unknown>
      if (!Array.isArray(d.tooltipPalette)) {
        d.tooltipPalette = []
      }
      const tp = d.tooltipPalette as string[]
      let idx = tp.indexOf(tooltipText.value)
      if (idx === -1 && tooltipText.value) {
        idx = tp.length
        tp.push(tooltipText.value)
      }
      if (!Array.isArray(d.cellTooltipGrid)) {
        d.cellTooltipGrid = buildEmptyTooltipGrid(d)
      }
      const ttg = d.cellTooltipGrid as number[][][]
      if (ttg[zSlice] && ttg[zSlice][row]) {
        ttg[zSlice][row][column] = tooltipText.value ? idx : -1
      }
    }
    ctx.dirty.value = true
    saveFeedback.value = '已保存到内存（同步预览生效）'
    void ctx.syncPreview()
  } catch (e) {
    saveFeedback.value = e instanceof Error ? e.message : String(e)
  }
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

const previewHtml = computed(() => {
  if (!tooltipText.value) return ''
  return snarkdown(tooltipText.value)
})

watch(
  () => props.selectedBlock,
  (b) => {
    if (b) tooltipText.value = readCurrentTooltip()
    else tooltipText.value = ''
  },
  { immediate: true },
)
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">Block Inspector</div>
    <template v-if="!editMode || !selectedBlock">
      <p class="pe-muted">进入编辑模式并点击方块以查看</p>
    </template>
    <template v-else>
      <div class="bi-field">
        <span class="bi-label">Block</span>
        <span class="bi-val">{{ selectedBlock.blockId }}</span>
      </div>
      <div v-if="selectedBlock.voxel" class="bi-field">
        <span class="bi-label">Position</span>
        <span class="bi-val">{{ selectedBlock.voxel.column }}, {{ selectedBlock.voxel.row }}, {{ selectedBlock.voxel.zSlice }}</span>
      </div>

      <div class="bi-field">
        <span class="bi-label">Tooltip (Markdown + MC codes)</span>
        <textarea
          v-model="tooltipText"
          class="bi-textarea"
          rows="5"
          placeholder="**Bold** *italic* `code`&#10;&#167;aGreen text&#10;&#167;6Golden bold"
        />
      </div>

      <div v-if="previewHtml" class="bi-preview">
        <span class="bi-label">Preview</span>
        <div class="bi-preview-box" v-html="previewHtml" />
      </div>

      <div class="bi-row">
        <button class="pe-btn pe-btn--primary" @click="saveTooltip">Save Tooltip</button>
        <button class="pe-btn" @click="tooltipText = ''">Clear</button>
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
