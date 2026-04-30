<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ProjectionMode } from '@/render/viewport/renderViewport'
import { formatSdeError } from '@/workbench/sdeApi'
import { previewConfigFromDocument } from '@/workbench/previewFromDocument'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { t } from '@/workbench/i18n'

const ctx = useWorkbenchContext()
const cfg = computed(() => ctx.previewConfig.value)

const debug = ref(false)
const blockStatsSidebar = ref(false)
const layerBar = ref(false)
const initialLayerWorldY = ref(-1)
const initialProjectionMode = ref<ProjectionMode>('orthographic')
const sceneBackgroundHex = ref('#5a5a5a')
const loadingMessage = ref('')
const iconSizePx = ref(128)
const iconOrthoHalf = ref(0.85)
const iconClearHex = ref('#000000')
const iconClearAlpha = ref(0)
const applyFeedback = ref('')

function numToHex6(n: number): string {
  const x = Math.max(0, Math.min(0xffffff, Math.floor(n)))
  return `#${x.toString(16).padStart(6, '0')}`
}
function parseHex6(s: string): number | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(s.trim())
  if (!m) return null
  return parseInt(m[1], 16)
}

function syncFormFromConfig(): void {
  const c = cfg.value
  if (!c) { applyFeedback.value = ''; return }
  debug.value = c.debug
  blockStatsSidebar.value = c.features.blockStatsSidebar
  layerBar.value = c.features.layerBar
  initialLayerWorldY.value = c.initialLayerWorldY
  initialProjectionMode.value = c.initialProjectionMode
  sceneBackgroundHex.value = numToHex6(c.sceneBackground)
  loadingMessage.value = c.loadingMessage
  const b = c.blockIconCacheOptions
  iconSizePx.value = b.sizePx ?? 128
  iconOrthoHalf.value = b.orthoHalf ?? 0.85
  iconClearHex.value = numToHex6(b.clearColor ?? 0)
  iconClearAlpha.value = b.clearAlpha ?? 0
}

watch(cfg, () => syncFormFromConfig(), { immediate: true })

function clamp01(x: number): number {
  return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0
}

async function applyToPreview(): Promise<void> {
  if (!ctx.previewConfig.value) { applyFeedback.value = '无当前 PreviewConfig'; return }
  const raw = ctx.scene.value
  if (!raw) { applyFeedback.value = '无场景数据，无法重建材质库'; return }
  const bg = parseHex6(sceneBackgroundHex.value)
  if (bg === null) { applyFeedback.value = '场景背景色须为 #RRGGBB'; return }
  const ic = parseHex6(iconClearHex.value)
  if (ic === null) { applyFeedback.value = '图标 clearColor 须为 #RRGGBB'; return }
  const layerY = Number(initialLayerWorldY.value)
  ctx.previewBusy.value = true
  applyFeedback.value = '正在重建预览…'
  try {
    const snapshot = JSON.parse(JSON.stringify(raw)) as unknown
    const base = await previewConfigFromDocument(snapshot)
    ctx.previewConfig.value = {
      ...base, debug: debug.value,
      features: { blockStatsSidebar: blockStatsSidebar.value, layerBar: layerBar.value },
      initialLayerWorldY: Number.isFinite(layerY) ? Math.round(layerY) : base.initialLayerWorldY,
      initialProjectionMode: initialProjectionMode.value,
      sceneBackground: bg, loadingMessage: loadingMessage.value,
      blockIconCacheOptions: {
        ...base.blockIconCacheOptions,
        sizePx: Math.max(8, Math.round(Number(iconSizePx.value)) || 128),
        orthoHalf: Math.max(0.01, Number(iconOrthoHalf.value) || 0.85),
        clearColor: ic, clearAlpha: clamp01(Number(iconClearAlpha.value)),
      },
    }
    ctx.previewEpoch.value += 1
    applyFeedback.value = '已应用并重载预览壳'
  } catch (e) {
    applyFeedback.value = formatSdeError(e)
  } finally {
    ctx.previewBusy.value = false
  }
}
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">{{ t('previewConfig') }}</div>
    <p v-if="!cfg" class="pe-muted">{{ t('noPreviewConfig') }}</p>
    <template v-else>
      <div class="pe-grid">
        <label class="pe-field"><span>debug</span><input v-model="debug" type="checkbox" /></label>
        <label class="pe-field"><span>blockStatsSidebar</span><input v-model="blockStatsSidebar" type="checkbox" /></label>
        <label class="pe-field"><span>layerBar</span><input v-model="layerBar" type="checkbox" /></label>
        <label class="pe-field"><span>initialLayerWorldY</span><input v-model.number="initialLayerWorldY" type="number" step="1" /></label>
        <label class="pe-field"><span>投影模式</span>
          <select v-model="initialProjectionMode">
            <option value="orthographic">正交</option>
            <option value="perspective">透视</option>
          </select>
        </label>
        <label class="pe-field"><span>背景色 #RRGGBB</span><input v-model="sceneBackgroundHex" type="text" autocomplete="off" /></label>
        <label class="pe-field pe-field--wide"><span>loadingMessage</span><input v-model="loadingMessage" type="text" autocomplete="off" /></label>
        <label class="pe-field"><span>图标 sizePx</span><input v-model.number="iconSizePx" type="number" min="8" step="1" /></label>
        <label class="pe-field"><span>图标 orthoHalf</span><input v-model.number="iconOrthoHalf" type="number" min="0.01" step="0.05" /></label>
        <label class="pe-field"><span>图标 clearColor</span><input v-model="iconClearHex" type="text" autocomplete="off" /></label>
        <label class="pe-field"><span>图标 clearAlpha</span><input v-model.number="iconClearAlpha" type="number" min="0" max="1" step="0.05" /></label>
      </div>
      <div class="pe-row">
        <button class="pe-btn pe-btn--primary" @click="void applyToPreview()">{{ t('applyToPreview') }}</button>
        <button class="pe-btn" @click="syncFormFromConfig">{{ t('restoreFromConfig') }}</button>
      </div>
      <p v-if="applyFeedback" class="pe-feedback">{{ applyFeedback }}</p>
    </template>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: #64748b; margin: 0 0 8px; }
.pe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.pe-field { display: flex; flex-direction: column; gap: 3px; }
.pe-field span { font-size: 10px; color: #94a3b8; }
.pe-field input, .pe-field select {
  padding: 4px 6px; border-radius: 4px; border: 1px solid #334155;
  background: #0f172a; color: #e2e8f0; font-size: 11px;
}
.pe-field input[type="checkbox"] { width: 16px; height: 16px; accent-color: #2563eb; align-self: flex-start; }
.pe-field--wide { grid-column: 1 / -1; }
.pe-row { display: flex; gap: 6px; margin-top: 10px; }
.pe-btn {
  padding: 4px 10px; border-radius: 4px; border: 1px solid #475569;
  background: #334155; color: #f8fafc; cursor: pointer; font-size: 11px;
}
.pe-btn--primary { background: #2563eb; border-color: #1d4ed8; }
.pe-feedback { margin: 6px 0 0; font-size: 11px; color: #a5b4fc; }
</style>
