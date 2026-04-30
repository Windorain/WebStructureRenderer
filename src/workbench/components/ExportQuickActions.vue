<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { loadStructureOrWorld } from '@/render/data/bundleResolve'
import { sceneStableStringIdFromDocument } from '@/render/data/compactSceneDocument'
import { buildCompactEnvelope, copyTextToClipboard, downloadBlob, downloadJson } from '@/workbench/sceneExportKit'
import { buildStructureBundleZip } from '@/workbench/structureBundleExport'
import { bakeIsometricStructurePngDataUrl, dataUrlToPngBlob } from '@/workbench/exportIsometricImage'
import { formatUnknownError } from '@/util/formatUnknownError'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()
const doc = computed(() => ctx.scene.value)
const baseName = computed(() => (doc.value ? sceneStableStringIdFromDocument(doc.value) : 'scene'))
const showSdeSave = computed(() => ctx.workspaceMode.value === 'sde' && ctx.apiBase.value.length > 0)

async function downloadRaw(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = doc.value
    downloadJson(`${String(baseName.value)}-raw`, raw, true)
    ctx.connectionMessage.value = '已下载 Raw JSON'
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}

async function downloadCompact(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = doc.value
    downloadJson(`${String(baseName.value)}-compact`, buildCompactEnvelope(raw), true)
    ctx.connectionMessage.value = '已下载 Compact JSON'
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}

async function copyRawJson(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = doc.value
    await copyTextToClipboard(JSON.stringify(raw, null, 2))
    ctx.connectionMessage.value = '已复制 Raw JSON'
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}

async function downloadObjBlock(): Promise<void> {
  if (!doc.value) return
  try {
    const normalized = doc.value
    const def = loadStructureOrWorld(normalized, undefined)
    const zip = await buildStructureBundleZip(def, normalized, { mode: 'block' })
    downloadBlob(`${String(baseName.value)}-block.zip`, zip)
    ctx.connectionMessage.value = '已导出 OBJ (block)'
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}

async function downloadObjConnected(): Promise<void> {
  if (!doc.value) return
  try {
    const normalized = doc.value
    const def = loadStructureOrWorld(normalized, undefined)
    const zip = await buildStructureBundleZip(def, normalized, { mode: 'connected' })
    downloadBlob(`${String(baseName.value)}-connected.zip`, zip)
    ctx.connectionMessage.value = '已导出 OBJ (connected)'
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}

const isoDirectionIndex = ref(0)
const isoPreviewUrl = ref<string | null>(null)
const isoBusy = ref(false)
const isoError = ref<string | null>(null)
let isoBakeSeq = 0

function cycleIsoDirection(): void { isoDirectionIndex.value = (isoDirectionIndex.value + 1) % 4 }

async function runIsoBake(): Promise<void> {
  const d = doc.value
  if (!d) { isoPreviewUrl.value = null; isoError.value = null; isoBusy.value = false; return }
  const seq = ++isoBakeSeq
  isoBusy.value = true; isoError.value = null
  try {
    const url = await bakeIsometricStructurePngDataUrl(d, isoDirectionIndex.value)
    if (seq !== isoBakeSeq) return
    isoPreviewUrl.value = url
  } catch (e) {
    if (seq !== isoBakeSeq) return
    isoPreviewUrl.value = null; isoError.value = formatUnknownError(e)
  } finally { if (seq === isoBakeSeq) isoBusy.value = false }
}

watch(() => [doc.value, isoDirectionIndex.value] as const, () => { void runIsoBake() }, { immediate: true })

async function downloadIsoPng(): Promise<void> {
  if (!doc.value || !isoPreviewUrl.value) return
  try {
    downloadBlob(`${String(baseName.value)}-iso-${isoDirectionIndex.value}.png`, dataUrlToPngBlob(isoPreviewUrl.value))
  } catch (e) { ctx.connectionMessage.value = formatUnknownError(e) }
}
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">Export</div>
    <div class="eq-section">
      <div class="eq-label">JSON</div>
      <button class="pe-btn" @click="void downloadRaw()">Raw ↓</button>
      <button class="pe-btn" @click="void downloadCompact()">Compact ↓</button>
      <button class="pe-btn" @click="void copyRawJson()">Copy 📋</button>
    </div>
    <div class="eq-section">
      <div class="eq-label">OBJ</div>
      <button class="pe-btn" @click="void downloadObjBlock()">Block .zip</button>
      <button class="pe-btn" @click="void downloadObjConnected()">Connected .zip</button>
    </div>
    <div class="eq-section">
      <div class="eq-label">Isometric PNG
        <button class="pe-btn-sm" @click="cycleIsoDirection" :disabled="isoBusy">↻ {{ isoDirectionIndex + 1 }}/4</button>
      </div>
      <div v-if="isoBusy" class="pe-feedback">渲染中…</div>
      <img v-else-if="isoPreviewUrl" :src="isoPreviewUrl" class="eq-iso-preview" alt="Iso preview" />
      <div v-if="isoError" class="pe-feedback" style="color:#f87171">{{ isoError }}</div>
      <button v-if="isoPreviewUrl" class="pe-btn" @click="void downloadIsoPng()">Download PNG</button>
    </div>
    <div v-if="showSdeSave" class="eq-section">
      <button class="pe-btn pe-btn--primary" @click="void ctx.saveWorkspaceFull()">同步到 SDE</button>
    </div>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.eq-section { margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.eq-label { width: 100%; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
.pe-btn {
  padding: 4px 10px; border-radius: 4px; border: 1px solid #475569;
  background: #334155; color: #f8fafc; cursor: pointer; font-size: 11px;
}
.pe-btn--primary { background: #2563eb; border-color: #1d4ed8; }
.pe-btn-sm { padding: 1px 6px; font-size: 10px; border-radius: 3px; border: 1px solid #475569; background: #1e293b; color: #94a3b8; cursor: pointer; }
.eq-iso-preview { max-width: 100%; border-radius: 4px; border: 1px solid #334155; margin-top: 4px; }
.pe-feedback { font-size: 11px; color: #a5b4fc; }
</style>
