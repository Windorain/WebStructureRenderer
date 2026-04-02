<script setup lang="ts">
/**
 * 本地 dev：URL 带参链接、下载当前 bundle（数据来自 HTTP，非 localStorage）。
 */
import { computed, onMounted, ref, watch } from 'vue'

import type { PreviewConfig } from '@/preview/previewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, fetchSceneIdList } from '@/preview/previewSession'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

import pkg from '../../../package.json'

const props = defineProps<{
  mergedConfig: PreviewConfig
}>()

const selectableSceneIds = ref<string[]>([])
const showBlockStatsSidebar = ref(false)
const showLayerBar = ref(true)
const showDeveloperPanel = ref(false)
const initialLayerWorldY = ref(-1)
const initialProjectionMode = ref<ProjectionMode>('orthographic')
const sceneBackgroundHex = ref('#5a5a5a')
const iconSizePx = ref(128)
const orthoHalf = ref(0.85)
const clearColorHex = ref('#000000')
const clearAlpha = ref(0)
const sceneId = ref('')

const devInfoLines = computed(() => {
  const sid = props.mergedConfig.sceneId ?? ''
  const resolved = sid === '' ? DEFAULT_PREVIEW_SCENE_ID : sid
  return [
    `场景 id（解析用）: ${resolved}`,
    `URL sceneId: ${sid || '（空=默认）'}`,
    `bundle 来源: GET /preview-api/scenes/:id/bundle（wiki-mock；按 palette 裁剪注册表）`,
    `import.meta.env.MODE: ${import.meta.env.MODE}`,
    `应用版本: ${'version' in pkg && typeof pkg.version === 'string' ? pkg.version : '—'}`,
  ]
})

/** 与当前表单一致的入口 URL（白名单键，见 dev/devPreviewConfig.ts 内 parseUrlPreviewParams） */
const previewEntryUrl = computed(() => {
  const p = new URLSearchParams()
  const sid = sceneId.value.trim() || props.mergedConfig.sceneId || DEFAULT_PREVIEW_SCENE_ID
  if (sid) p.set('sceneId', sid)
  p.set('layer', String(initialLayerWorldY.value))
  p.set('projection', initialProjectionMode.value)
  p.set('stats', showBlockStatsSidebar.value ? '1' : '0')
  p.set('layerBar', showLayerBar.value ? '1' : '0')
  p.set('devPanel', showDeveloperPanel.value ? '1' : '0')
  const bg = parseHexColor(sceneBackgroundHex.value)
  if (bg !== null) p.set('bg', `#${(bg >>> 0).toString(16).padStart(6, '0')}`)
  const cc = parseHexColor(clearColorHex.value)
  if (cc !== null) p.set('clearColor', `#${(cc >>> 0).toString(16).padStart(6, '0')}`)
  p.set('clearAlpha', String(clearAlpha.value))
  p.set('iconSizePx', String(Math.round(iconSizePx.value)))
  p.set('orthoHalf', String(orthoHalf.value))
  const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''
  return `${base}?${p.toString()}`
})

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
  showBlockStatsSidebar.value = c.features.blockStatsSidebar
  showLayerBar.value = c.features.layerBar
  showDeveloperPanel.value = c.features.developerPanel
  initialLayerWorldY.value = c.initialLayerWorldY
  initialProjectionMode.value = c.initialProjectionMode
  sceneBackgroundHex.value = numToHex6(c.sceneBackground)
  iconSizePx.value = c.blockIconCacheOptions.sizePx ?? 128
  orthoHalf.value = c.blockIconCacheOptions.orthoHalf ?? 1.22
  clearColorHex.value = numToHex6(c.blockIconCacheOptions.clearColor ?? 0)
  clearAlpha.value = c.blockIconCacheOptions.clearAlpha ?? 0
  sceneId.value = c.sceneId ?? ''
}

onMounted(async () => {
  try {
    selectableSceneIds.value = await fetchSceneIdList()
  } catch (e) {
    console.error('[DeveloperConfigPanel] fetchSceneIdList', e)
    selectableSceneIds.value = []
  }
  syncFromMerged()
})

watch(() => props.mergedConfig, syncFromMerged, { deep: true })

function applyUrlAndNavigate(): void {
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

  window.location.assign(previewEntryUrl.value)
}

function clearQueryAndReload(): void {
  const path =
    typeof window !== 'undefined' ? `${window.location.pathname}${window.location.hash}` : '/'
  window.location.assign(path)
}

function copyPreviewLink(): void {
  void navigator.clipboard.writeText(previewEntryUrl.value).then(
    () => window.alert('已复制入口链接'),
    () => window.alert('复制失败'),
  )
}

function downloadCurrentBundle(): void {
  const b = props.mergedConfig.renderBundle
  const sid = props.mergedConfig.sceneId ?? DEFAULT_PREVIEW_SCENE_ID
  const prefix = sid.replace(/[/\\:]/g, '_')
  const trigger = (filename: string, text: string) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
    a.download = `${prefix}.${filename}`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  trigger('document.json', JSON.stringify(b.document, null, 2))
  trigger('block_registry.json', JSON.stringify(b.blockRegistry, null, 2))
  trigger('material_registry.json', JSON.stringify(b.materialRegistry, null, 2))
  trigger('model_registry.json', JSON.stringify(b.modelRegistry, null, 2))
}
</script>

<template>
  <section
    class="wm-dev-panel"
    aria-label="开发者配置"
  >
    <div class="wm-dev-panel-inner">
      <h2 class="wm-dev-panel-title">
        开发者配置（URL 参数）
      </h2>
      <p class="wm-dev-panel-hint">
        场景与 bundle 仅通过 HTTP（<code>/preview-api</code>、<code>/namespace</code> 经 Vite 代理到
        <code>server/wiki-mock</code> 拉取）。本面板用查询参数表达「应用并跳转」，不写入 localStorage。开发请使用
        <code>npm run dev</code>。
      </p>

      <div class="wm-dev-devinfo" role="region" aria-label="开发者信息">
        <div class="wm-dev-devinfo-title">
          开发者信息
        </div>
        <div
          v-for="(line, i) in devInfoLines"
          :key="i"
          class="wm-dev-devinfo-line"
        >
          {{ line }}
        </div>
      </div>

      <div class="wm-dev-field wm-dev-field--full">
        <span>当前入口链接（含 URL 白名单参数）</span>
        <div class="wm-dev-link-row">
          <input class="wm-dev-link-input" type="text" readonly :value="previewEntryUrl">
          <button type="button" class="wm-dev-btn" @click="copyPreviewLink">
            复制
          </button>
        </div>
      </div>

      <div class="wm-dev-panel-grid">
        <label class="wm-dev-field wm-dev-field--full">
          <span>场景 id（wiki-mock 从磁盘目录提供对应 bundle）</span>
          <select v-model="sceneId">
            <option value="">
              默认（{{ DEFAULT_PREVIEW_SCENE_ID }}）
            </option>
            <option
              v-for="id in selectableSceneIds"
              :key="id"
              :value="id"
            >
              {{ id }}
            </option>
          </select>
        </label>

        <div class="wm-dev-field wm-dev-field--full wm-dev-upload-row">
          <button type="button" class="wm-dev-btn" @click="downloadCurrentBundle">
            下载当前 bundle（四 JSON）
          </button>
        </div>

        <label class="wm-dev-field wm-dev-field--row">
          <input v-model="showBlockStatsSidebar" type="checkbox">
          <span>方块统计侧栏</span>
        </label>
        <label class="wm-dev-field wm-dev-field--row">
          <input v-model="showLayerBar" type="checkbox">
          <span>分层条（Y）</span>
        </label>
        <label class="wm-dev-field wm-dev-field--row">
          <input v-model="showDeveloperPanel" type="checkbox">
          <span>开发者面板</span>
        </label>
        <label class="wm-dev-field">
          <span>initialLayerWorldY（-1=全部层）</span>
          <input v-model.number="initialLayerWorldY" type="number" step="1">
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
          <input v-model="sceneBackgroundHex" type="text" spellcheck="false">
        </label>
        <label class="wm-dev-field">
          <span>图标 sizePx</span>
          <input v-model.number="iconSizePx" type="number" min="8" step="8">
        </label>
        <label class="wm-dev-field">
          <span>图标 orthoHalf（越小越大）</span>
          <input v-model.number="orthoHalf" type="number" min="0.1" step="0.01">
        </label>
        <label class="wm-dev-field">
          <span>图标清屏色 #RRGGBB</span>
          <input v-model="clearColorHex" type="text" spellcheck="false">
        </label>
        <label class="wm-dev-field">
          <span>图标 clearAlpha（0=透明底）</span>
          <input v-model.number="clearAlpha" type="number" min="0" max="1" step="0.05">
        </label>
      </div>
      <div class="wm-dev-panel-actions">
        <button type="button" class="wm-dev-btn" @click="applyUrlAndNavigate">
          应用为 URL 并跳转
        </button>
        <button type="button" class="wm-dev-btn wm-dev-btn--danger" @click="clearQueryAndReload">
          清除查询参数并刷新
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
.wm-dev-devinfo {
  margin: 0 0 12px;
  padding: 8px 10px;
  background: var(--nei-inset-bg-mid);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
}
.wm-dev-devinfo-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
}
.wm-dev-devinfo-line {
  line-height: 1.5;
  color: var(--nei-text-muted);
  word-break: break-all;
}
.wm-dev-link-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
  margin-top: 4px;
}
.wm-dev-link-input {
  flex: 1;
  min-width: 0;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  padding: 4px 6px;
  color: var(--nei-text-muted);
  background: var(--nei-inset-bg-mid);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
}
.wm-dev-panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 14px;
  align-items: center;
}
.wm-dev-upload-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px;
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
.wm-dev-field--full {
  grid-column: 1 / -1;
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
