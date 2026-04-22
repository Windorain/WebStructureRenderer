<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { loadStructureOrWorld } from '@/render/data/bundleResolve'
import {
  isCompactSceneEnvelope,
  normalizeSceneDocumentForWiki,
  sceneStableStringIdFromDocument,
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
import {
  bakeIsometricStructurePngDataUrl,
  dataUrlToPngBlob,
} from '@/workbench/exportIsometricImage'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const doc = computed(() => ctx.scene.value)
const hasApiBase = computed(() => ctx.apiBase.value.length > 0)
const showSdeSave = computed(() => ctx.workspaceMode.value === 'sde' && hasApiBase.value)

const baseName = computed(() => (doc.value ? sceneStableStringIdFromDocument(doc.value) : 'scene'))

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

/** Raw：解压 Compact（meta+payload+根壳合并）后的明文 JSON；已是 Raw 则原样导出。与「下载 Compact」相对。 */
async function downloadRaw(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = await normalizeSceneDocumentForWiki(doc.value)
    downloadJson(`${String(baseName.value)}-raw`, raw, true)
    ctx.connectionMessage.value = isCompactSceneEnvelope(doc.value)
      ? '已下载解压后的 Raw JSON'
      : '已下载 Raw JSON'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}

async function downloadCompact(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = await normalizeSceneDocumentForWiki(doc.value)
    const env = buildCompactEnvelope(raw)
    downloadJson(`${String(baseName.value)}-compact`, env, true)
    ctx.connectionMessage.value = '已下载 Compact JSON'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}

async function copyRawJson(): Promise<void> {
  if (!doc.value) return
  try {
    const raw = await normalizeSceneDocumentForWiki(doc.value)
    await copyTextToClipboard(JSON.stringify(raw, null, 2))
    ctx.connectionMessage.value = isCompactSceneEnvelope(doc.value)
      ? '已复制解压后的 Raw JSON'
      : '已复制 Raw JSON'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
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

async function downloadObjBlock(): Promise<void> {
  if (!doc.value) return
  try {
    const normalized = await normalizeSceneDocumentForWiki(doc.value)
    const def = loadStructureOrWorld(normalized, undefined)
    const zip = await buildStructureBundleZip(def, normalized, { mode: 'block' })
    downloadBlob(`${String(baseName.value)}-structure-block.zip`, zip)
    ctx.connectionMessage.value = '已导出 OBJ（方块模式：体素内合并，域内共面保留）'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}

async function downloadObjConnected(): Promise<void> {
  if (!doc.value) return
  try {
    const normalized = await normalizeSceneDocumentForWiki(doc.value)
    const def = loadStructureOrWorld(normalized, undefined)
    const zip = await buildStructureBundleZip(def, normalized, { mode: 'connected' })
    downloadBlob(`${String(baseName.value)}-structure-connected.zip`, zip)
    ctx.connectionMessage.value = '已导出 OBJ（连通模式：外表面 + 每域单 atlas）'
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}

const isoDirectionIndex = ref(0)
const isoPreviewUrl = ref<string | null>(null)
const isoBusy = ref(false)
const isoError = ref<string | null>(null)
let isoBakeSeq = 0

function cycleIsoDirection(): void {
  isoDirectionIndex.value = (isoDirectionIndex.value + 1) % 4
}

async function runIsoBake(): Promise<void> {
  const d = doc.value
  if (!d) {
    isoPreviewUrl.value = null
    isoError.value = null
    isoBusy.value = false
    return
  }
  const seq = ++isoBakeSeq
  isoBusy.value = true
  isoError.value = null
  try {
    const url = await bakeIsometricStructurePngDataUrl(d, isoDirectionIndex.value)
    if (seq !== isoBakeSeq) return
    isoPreviewUrl.value = url
  } catch (e) {
    if (seq !== isoBakeSeq) return
    isoPreviewUrl.value = null
    isoError.value = formatUnknownError(e)
  } finally {
    if (seq === isoBakeSeq) isoBusy.value = false
  }
}

watch(
  () => [doc.value, isoDirectionIndex.value] as const,
  () => {
    void runIsoBake()
  },
  { immediate: true },
)

async function downloadIsoPng(): Promise<void> {
  if (!doc.value || !isoPreviewUrl.value) return
  try {
    const blob = dataUrlToPngBlob(isoPreviewUrl.value)
    downloadBlob(`${String(baseName.value)}-iso-${isoDirectionIndex.value}.png`, blob)
    ctx.connectionMessage.value = `已下载等轴视角 ${isoDirectionIndex.value + 1}/4 PNG`
  } catch (e) {
    ctx.connectionMessage.value = formatUnknownError(e)
  }
}
</script>

<template>
  <p v-if="!doc" class="wm-muted wm-export-lead">无文档</p>

  <template v-else>
    <section class="wm-panel">
      <h2 class="wm-panel__title">数据与网格</h2>
      <div class="wm-row">
        <button
          type="button"
          class="wm-btn"
          title="导出解压合并后的明文结构（Compact 会展开）；与「下载 Compact」相对"
          @click="downloadRaw"
        >
          下载 Raw JSON
        </button>
        <button type="button" class="wm-btn" @click="downloadCompact">下载 Compact</button>
        <button
          type="button"
          class="wm-btn"
          :disabled="!canExportObj"
          :title="canExportObj ? '方块模式：每方块独立 mesh，体素内 Quad 合并；MTL 顺序与 usemtl 首次出现一致；textures/blob_*.png（支持 Compact）' : '须为可解压的 Compact 或 geometryPhase=baked 的 Raw / World'"
          @click="downloadObjBlock"
        >
          OBJ 方块模式
        </button>
        <button
          type="button"
          class="wm-btn"
          :disabled="!canExportObj"
          :title="canExportObj ? '连通模式：6-邻域分组，域内剔除；每连通域一张合并贴图 + UV 重映射' : '须为可解压的 Compact 或 geometryPhase=baked 的 Raw / World'"
          @click="downloadObjConnected"
        >
          OBJ 连通模式
        </button>
        <button
          type="button"
          class="wm-btn"
          title="复制解压合并后的 Raw JSON（与下载 Raw 一致）"
          @click="copyRawJson"
        >
          复制 Raw
        </button>
        <button v-if="showSdeSave" type="button" class="wm-btn wm-btn--primary" @click="saveFullToSde">
          保存工作区到 SDE
        </button>
      </div>
    </section>

    <section class="wm-panel">
      <h2 class="wm-panel__title">导出图片</h2>
      <p class="wm-muted wm-export-hint">
        标准等轴、正交投影离屏烘焙（无透视缩短）；方位与俯仰同主预览对角线，「切换»」绕竖轴每次 90°，共四向。
      </p>
      <div class="wm-iso-layout">
        <div class="wm-iso-frame">
          <img
            v-if="isoPreviewUrl"
            class="wm-iso-img"
            :src="isoPreviewUrl"
            alt="当前等轴导出预览"
          />
          <div v-else-if="isoBusy" class="wm-iso-placeholder">正在烘焙预览…</div>
          <div v-else class="wm-iso-placeholder">暂无预览</div>
          <button
            type="button"
            class="wm-iso-cycle"
            :disabled="isoBusy || !doc"
            :title="`下一等轴方向 (${isoDirectionIndex + 1}/4)`"
            @click="cycleIsoDirection"
          >
            切换 »
          </button>
        </div>
        <div class="wm-row wm-iso-actions">
          <button
            type="button"
            class="wm-btn"
            :disabled="!isoPreviewUrl || isoBusy"
            @click="downloadIsoPng"
          >
            下载当前视角 PNG
          </button>
        </div>
        <p v-if="isoError" class="wm-iso-err" role="alert">{{ isoError }}</p>
      </div>
    </section>
  </template>
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
.wm-export-lead {
  margin: 0 0 8px;
}
.wm-export-hint {
  margin: 0 0 10px;
  line-height: 1.45;
}
.wm-iso-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.wm-iso-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid #475569;
  background: #0f172a;
  overflow: hidden;
}
.wm-iso-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wm-iso-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: #64748b;
}
.wm-iso-cycle {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: rgba(15, 23, 42, 0.92);
  color: #e2e8f0;
  font-size: 12px;
  cursor: pointer;
}
.wm-iso-cycle:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.wm-iso-actions {
  margin: 0;
}
.wm-iso-err {
  margin: 0;
  font-size: 12px;
  color: #f87171;
}
</style>
