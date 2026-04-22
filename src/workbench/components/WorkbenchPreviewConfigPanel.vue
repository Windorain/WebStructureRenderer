<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { ProjectionMode } from '@/render/viewport/renderViewport'
import { formatSdeError } from '@/workbench/sdeApi'
import { previewConfigFromDocument } from '@/workbench/previewFromDocument'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

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
  if (!c) {
    applyFeedback.value = ''
    return
  }
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

watch(
  cfg,
  () => {
    syncFormFromConfig()
  },
  { immediate: true },
)

const summaryJson = computed(() => {
  const c = cfg.value
  if (!c) {
    return '（尚无预览配置，请先同步预览）'
  }
  const doc = c.renderBundle?.document
  let textureBlobsCount: string | number = '—'
  if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
    const b = (doc as { textureBlobs?: unknown }).textureBlobs
    textureBlobsCount = Array.isArray(b) ? b.length : 0
  }
  return JSON.stringify(
    {
      sceneId: c.sceneId,
      debug: c.debug,
      features: c.features,
      initialLayerWorldY: c.initialLayerWorldY,
      initialProjectionMode: c.initialProjectionMode,
      sceneBackground: `0x${c.sceneBackground.toString(16)}`,
      loadingMessage: c.loadingMessage,
      blockIconCacheOptions: c.blockIconCacheOptions,
      renderBundle: { textureBlobsCount },
      materialLibrary: 'SimpleMaterialLibrary（运行时实例，不可序列化）',
      okMessage: 'function',
    },
    null,
    2,
  )
})

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0
  return Math.min(1, Math.max(0, x))
}

/**
 * 须从当前 scene 重新跑 loadPreviewSessionFromDocument（与 syncPreview 一致），
 * 否则 previewEpoch++ 卸载旧 AppShell 会 dispose 旧 materialLibrary，复用同一引用会报「纹理未预取」等。
 */
async function applyToPreview(): Promise<void> {
  if (!ctx.previewConfig.value) {
    applyFeedback.value = '无当前 PreviewConfig'
    return
  }
  const raw = ctx.scene.value
  if (!raw) {
    applyFeedback.value = '无场景数据，无法重建材质库'
    return
  }
  const bg = parseHex6(sceneBackgroundHex.value)
  if (bg === null) {
    applyFeedback.value = '场景背景色须为 #RRGGBB'
    return
  }
  const ic = parseHex6(iconClearHex.value)
  if (ic === null) {
    applyFeedback.value = '图标 clearColor 须为 #RRGGBB'
    return
  }
  const layerY = Number(initialLayerWorldY.value)
  ctx.previewBusy.value = true
  applyFeedback.value = '正在重建预览…'
  try {
    const snapshot = JSON.parse(JSON.stringify(raw)) as unknown
    const base = await previewConfigFromDocument(snapshot)
    ctx.previewConfig.value = {
      ...base,
      debug: debug.value,
      features: {
        blockStatsSidebar: blockStatsSidebar.value,
        layerBar: layerBar.value,
      },
      initialLayerWorldY: Number.isFinite(layerY) ? Math.round(layerY) : base.initialLayerWorldY,
      initialProjectionMode: initialProjectionMode.value,
      sceneBackground: bg,
      loadingMessage: loadingMessage.value,
      blockIconCacheOptions: {
        ...base.blockIconCacheOptions,
        sizePx: Math.max(8, Math.round(Number(iconSizePx.value)) || 128),
        orthoHalf: Math.max(0.01, Number(iconOrthoHalf.value) || 0.85),
        clearColor: ic,
        clearAlpha: clamp01(Number(iconClearAlpha.value)),
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
  <section class="wm-panel">
    <h2 class="wm-panel__title">PreviewConfig</h2>
    <p v-if="!cfg" class="wm-muted">同步预览成功后可编辑下列项；`renderBundle` / `materialLibrary` 由场景构建，此处仅展示摘要。</p>
    <template v-else>
      <p class="wm-muted wm-muted--tip">
        修改后点「应用到预览」会重载预览壳。再次执行左侧「同步预览」时，侧栏/分层条会按场景
        <code class="wm-code">mode</code>
        重新合并。
      </p>
      <div class="wm-grid">
        <label class="wm-field">
          <span class="wm-field__label">debug（调试状态栏）</span>
          <input v-model="debug" type="checkbox" class="wm-check" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">blockStatsSidebar</span>
          <input v-model="blockStatsSidebar" type="checkbox" class="wm-check" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">layerBar</span>
          <input v-model="layerBar" type="checkbox" class="wm-check" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">initialLayerWorldY</span>
          <input v-model.number="initialLayerWorldY" class="wm-input" type="number" step="1" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">initialProjectionMode</span>
          <select v-model="initialProjectionMode" class="wm-input">
            <option value="orthographic">orthographic</option>
            <option value="perspective">perspective</option>
          </select>
        </label>
        <label class="wm-field">
          <span class="wm-field__label">sceneBackground (#RRGGBB)</span>
          <input v-model="sceneBackgroundHex" class="wm-input" type="text" autocomplete="off" />
        </label>
        <label class="wm-field wm-field--wide">
          <span class="wm-field__label">loadingMessage</span>
          <input v-model="loadingMessage" class="wm-input" type="text" autocomplete="off" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">图标 sizePx</span>
          <input v-model.number="iconSizePx" class="wm-input" type="number" min="8" step="1" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">图标 orthoHalf</span>
          <input v-model.number="iconOrthoHalf" class="wm-input" type="number" min="0.01" step="0.05" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">图标 clearColor</span>
          <input v-model="iconClearHex" class="wm-input" type="text" autocomplete="off" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">图标 clearAlpha</span>
          <input v-model.number="iconClearAlpha" class="wm-input" type="number" min="0" max="1" step="0.05" />
        </label>
      </div>
      <div class="wm-row">
        <button type="button" class="wm-btn wm-btn--primary" @click="void applyToPreview()">应用到预览</button>
        <button type="button" class="wm-btn" @click="syncFormFromConfig">从当前配置还原表单</button>
      </div>
      <p v-if="applyFeedback" class="wm-feedback">{{ applyFeedback }}</p>
      <details class="wm-details">
        <summary>当前配置摘要（JSON）</summary>
        <pre class="wm-json">{{ summaryJson }}</pre>
      </details>
    </template>
  </section>
</template>

<style scoped>
.wm-panel {
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
  margin-top: 12px;
}
.wm-panel__title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}
.wm-muted {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}
.wm-muted--tip {
  margin-bottom: 10px;
}
.wm-code {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #94a3b8;
}
.wm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 900px) {
  .wm-grid {
    grid-template-columns: 1fr;
  }
}
.wm-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.wm-field--wide {
  grid-column: 1 / -1;
}
.wm-field__label {
  font-size: 11px;
  color: #94a3b8;
}
.wm-input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
}
.wm-check {
  width: 18px;
  height: 18px;
  accent-color: #2563eb;
}
.wm-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
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
  background: #2563eb;
  border-color: #1d4ed8;
}
.wm-feedback {
  margin: 8px 0 0;
  font-size: 12px;
  color: #a5b4fc;
}
.wm-details {
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}
.wm-details summary {
  cursor: pointer;
  user-select: none;
  color: #cbd5e1;
}
.wm-json {
  margin: 8px 0 0;
  padding: 10px;
  border-radius: 6px;
  background: #0f172a;
  border: 1px solid #334155;
  font-size: 11px;
  line-height: 1.45;
  color: #e2e8f0;
  overflow: auto;
  max-height: 280px;
}
</style>
