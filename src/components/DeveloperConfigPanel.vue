<script setup lang="ts">
/**
 * 开发者专用：仅编辑可序列化覆盖项并写入 localStorage，保存后整页刷新。
 * 不 inject store、不调用 pipeline。
 */
import { onMounted, ref } from 'vue'

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { clearDevOverrides, saveDevOverrides } from '@/preview/devConfigOverrides'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

const props = defineProps<{
  mergedConfig: AppPreviewConfig
}>()

const showBlockStatsSidebar = ref(false)
const initialLayerWorldY = ref(-1)
const initialProjectionMode = ref<ProjectionMode>('orthographic')
const sceneBackgroundHex = ref('#5a5a5a')
const iconSizePx = ref(128)
const orthoHalf = ref(0.85)
const clearColorHex = ref('#000000')
const clearAlpha = ref(0)

function numToHex6(n: number): string {
  const u = n >>> 0
  return `#${u.toString(16).padStart(6, '0')}`
}

function parseHexColor(s: string): number | null {
  const t = s.trim()
  const m = /^#?([0-9a-fA-F]{6})$/.exec(t)
  if (!m) return null
  return parseInt(m[1], 16)
}

function syncFromMerged(): void {
  const c = props.mergedConfig
  showBlockStatsSidebar.value = c.showBlockStatsSidebar
  initialLayerWorldY.value = c.initialLayerWorldY
  initialProjectionMode.value = c.initialProjectionMode
  sceneBackgroundHex.value = numToHex6(c.sceneBackground)
  iconSizePx.value = c.blockIconCacheOptions.sizePx ?? 128
  orthoHalf.value = c.blockIconCacheOptions.orthoHalf ?? 1.22
  clearColorHex.value = numToHex6(c.blockIconCacheOptions.clearColor ?? 0)
  clearAlpha.value = c.blockIconCacheOptions.clearAlpha ?? 0
}

onMounted(() => {
  syncFromMerged()
})

function applyAndReload(): void {
  const bg = parseHexColor(sceneBackgroundHex.value)
  const cc = parseHexColor(clearColorHex.value)
  if (bg === null || cc === null) {
    window.alert('场景背景或清屏色：请输入 #RRGGBB 六位十六进制')
    return
  }
  if (!Number.isFinite(orthoHalf.value) || orthoHalf.value <= 0) {
    window.alert('orthoHalf 须为正数')
    return
  }
  if (!Number.isFinite(iconSizePx.value) || iconSizePx.value < 8) {
    window.alert('sizePx 过小')
    return
  }
  const ca = clearAlpha.value
  if (!Number.isFinite(ca) || ca < 0 || ca > 1) {
    window.alert('clearAlpha 须在 0～1')
    return
  }

  saveDevOverrides({
    showBlockStatsSidebar: showBlockStatsSidebar.value,
    initialLayerWorldY: initialLayerWorldY.value,
    initialProjectionMode: initialProjectionMode.value,
    sceneBackground: bg,
    blockIconCacheOptions: {
      sizePx: Math.round(iconSizePx.value),
      orthoHalf: orthoHalf.value,
      clearColor: cc,
      clearAlpha: ca,
    },
  })
  window.location.reload()
}

function clearAndReload(): void {
  clearDevOverrides()
  window.location.reload()
}
</script>

<template>
  <section
    class="wm-dev-panel"
    aria-label="开发者配置"
  >
    <div class="wm-dev-panel-inner">
    <h2 class="wm-dev-panel-title">
      开发者配置（本地覆盖）
    </h2>
    <p class="wm-dev-panel-hint">
      保存后将写入 localStorage 并刷新页面；<code>showDeveloperPanel</code> 仅在 appPreviewConfig 中配置，不在此修改。
    </p>
    <div class="wm-dev-panel-grid">
      <label class="wm-dev-field wm-dev-field--row">
        <input v-model="showBlockStatsSidebar" type="checkbox" />
        <span>方块统计侧栏</span>
      </label>
      <label class="wm-dev-field">
        <span>initialLayerWorldY（-1=全部层）</span>
        <input v-model.number="initialLayerWorldY" type="number" step="1" />
      </label>
      <label class="wm-dev-field">
        <span>初始投影</span>
        <select v-model="initialProjectionMode">
          <option value="orthographic">
            orthographic
          </option>
          <option value="perspective">
            perspective
          </option>
        </select>
      </label>
      <label class="wm-dev-field">
        <span>场景背景 #RRGGBB</span>
        <input v-model="sceneBackgroundHex" type="text" spellcheck="false" />
      </label>
      <label class="wm-dev-field">
        <span>图标 sizePx</span>
        <input v-model.number="iconSizePx" type="number" min="8" step="8" />
      </label>
      <label class="wm-dev-field">
        <span>图标 orthoHalf（越小越大）</span>
        <input v-model.number="orthoHalf" type="number" min="0.1" step="0.01" />
      </label>
      <label class="wm-dev-field">
        <span>图标清屏色 #RRGGBB</span>
        <input v-model="clearColorHex" type="text" spellcheck="false" />
      </label>
      <label class="wm-dev-field">
        <span>图标 clearAlpha（0=透明底）</span>
        <input v-model.number="clearAlpha" type="number" min="0" max="1" step="0.05" />
      </label>
    </div>
    <div class="wm-dev-panel-actions">
      <button type="button" class="wm-dev-btn" @click="applyAndReload">
        保存覆盖并刷新
      </button>
      <button type="button" class="wm-dev-btn wm-dev-btn--danger" @click="clearAndReload">
        清除覆盖并刷新
      </button>
    </div>
    </div>
  </section>
</template>

<style scoped>
/* 与主界面 NEI 分层条 / 视口底栏一致：浅灰外框 + 深色内凹内容区 + 浅色字 */
.wm-dev-panel {
  margin-top: 10px;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  background: var(--nei-bg);
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  z-index: 1;
}
.wm-dev-panel-inner {
  padding: 8px 10px 10px;
  background: var(--nei-inset-bg);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  margin: 0;
  box-sizing: border-box;
}
.wm-dev-panel-title {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
}
.wm-dev-panel-hint {
  margin: 0 0 10px;
  line-height: 1.45;
  color: var(--nei-text-muted);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
}
.wm-dev-panel-hint code {
  font-size: 11px;
  color: var(--nei-text);
  background: var(--nei-inset-bg-mid);
  padding: 0 4px;
  border-radius: 0;
}
.wm-dev-panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 14px;
  align-items: center;
}
.wm-dev-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.wm-dev-field--row {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.wm-dev-field--row span {
  font-weight: 600;
}
.wm-dev-field span {
  font-weight: 600;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
}
.wm-dev-field input[type='checkbox'] {
  width: 1em;
  height: 1em;
  accent-color: var(--nei-focus-ring);
}
.wm-dev-field input[type='text'],
.wm-dev-field input[type='number'],
.wm-dev-field select {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  padding: 4px 6px;
  max-width: 100%;
  box-sizing: border-box;
  color: var(--nei-text-muted);
  background: var(--nei-inset-bg-mid);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  border-radius: 0;
}
.wm-dev-field select {
  cursor: pointer;
}
.wm-dev-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.wm-dev-btn {
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  background: var(--nei-bg);
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
  font-family: inherit;
}
.wm-dev-btn:hover {
  filter: brightness(1.05);
}
.wm-dev-btn--danger {
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  background: var(--nei-inset-bg-mid);
  color: var(--nei-text-muted);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
}
</style>
