<script setup lang="ts">
import { computed } from 'vue'

import { loadStructureOrWorld } from '@/render/data/bundleResolve'
import {
  isCompactSceneEnvelope,
  normalizeSceneDocumentForWiki,
} from '@/render/data/compactSceneDocument'
import { COMPACT_PAYLOAD_ENCODING } from '@/render/schema/types'
import {
  buildCompactEnvelope,
  copyTextToClipboard,
  downloadBlob,
  downloadJson,
} from '@/workbench/sceneExportKit'
import { buildStructureBundleZip } from '@/workbench/structureBundleExport'
import { formatUnknownError } from '@/util/formatUnknownError'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const doc = computed(() => ctx.document.value)
const hasApiBase = computed(() => ctx.apiBase.value.length > 0)
const showSdeSave = computed(() => ctx.workspaceMode.value === 'sde' && hasApiBase.value)

const baseName = computed(() => {
  const id = doc.value?.id
  if (typeof id === 'string' && id.length > 0) return id
  return 'scene'
})

/**
 * OBJ 须解析后的 Raw 结构；Compact 信封根上无 cellGrid，须先 normalize（与预览加载链一致）。
 */
const canExportObj = computed(() => {
  if (!doc.value) return false
  const d = doc.value
  if (isCompactSceneEnvelope(d)) {
    return (
      d.payloadEncoding === COMPACT_PAYLOAD_ENCODING &&
      typeof d.payload === 'string' &&
      d.payload.length > 0
    )
  }
  try {
    loadStructureOrWorld(d, undefined)
    return true
  } catch {
    return false
  }
})

function downloadRaw(): void {
  if (!doc.value) return
  downloadJson(`${String(baseName.value)}-raw`, doc.value, true)
}

function downloadCompact(): void {
  if (!doc.value) return
  const env = buildCompactEnvelope(doc.value)
  downloadJson(`${String(baseName.value)}-compact`, env, true)
}

async function copyRawJson(): Promise<void> {
  if (!doc.value) return
  await copyTextToClipboard(JSON.stringify(doc.value, null, 2))
  ctx.connectionMessage.value = '已复制 Raw JSON'
}

async function saveFullToSde(): Promise<void> {
  if (!ctx.apiBase.value || !doc.value) return
  try {
    await ctx.saveWorkspaceFull()
    ctx.connectionMessage.value = '工作区已保存 (PUT)'
  } catch (e) {
    ctx.connectionMessage.value = e instanceof Error ? e.message : String(e)
  }
}

async function downloadObj(): Promise<void> {
  if (!doc.value) return
  try {
    const normalized = await normalizeSceneDocumentForWiki(doc.value)
    const def = loadStructureOrWorld(normalized, undefined)
    const zip = await buildStructureBundleZip(def, normalized)
    downloadBlob(`${String(baseName.value)}-structure.zip`, zip)
    ctx.connectionMessage.value = '已导出 OBJ+MTL+贴图（ZIP）'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}
</script>

<template>
  <section class="wm-panel">
    <h2 class="wm-panel__title">导出</h2>
    <p v-if="!doc" class="wm-muted">无文档</p>
    <div v-else class="wm-row">
      <button type="button" class="wm-btn" @click="downloadRaw">下载 Raw JSON</button>
      <button type="button" class="wm-btn" @click="downloadCompact">下载 Compact</button>
      <button
        type="button"
        class="wm-btn"
        :disabled="!canExportObj"
        :title="canExportObj ? 'ZIP：structure.obj + structure.mtl + textures/；按方块×材质合并；动画贴为首帧（支持 Compact）' : '须为可解压的 Compact 或 geometryPhase=baked 的 Raw / World'"
        @click="downloadObj"
      >
        下载 OBJ 包
      </button>
      <button type="button" class="wm-btn" @click="copyRawJson">复制 Raw</button>
      <button v-if="showSdeSave" type="button" class="wm-btn wm-btn--primary" @click="saveFullToSde">保存工作区到 SDE</button>
    </div>
  </section>
</template>

<style scoped>
.wm-panel {
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
  margin-bottom: 12px;
}
.wm-panel__title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}
.wm-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.wm-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
  font-size: 12px;
}
.wm-btn--primary {
  background: #0d9488;
  border-color: #0f766e;
}
.wm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.wm-muted {
  font-size: 12px;
  color: #64748b;
}
</style>
