<script setup lang="ts">
/**
 * 本地入口初始状态：持久化补丁、带参链接、下载 bundle。
 */
import { computed, onMounted, ref, watch } from 'vue'

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import {
  clearPersistedDevPreview,
  persistDevPreviewPatch,
} from '@/preview/previewConfig'
import { DEFAULT_PREVIEW_SCENE_ID, listSelectableSceneIds } from '@/preview/previewDevServer'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

import pkg from '../../package.json'

const props = defineProps<{
  mergedConfig: AppPreviewConfig
}>()

const selectableSceneIds = ref<string[]>([])
const showBlockStatsSidebar = ref(false)
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
    `持久化 sceneId: ${sid || '（空=默认）'}`,
    `bundle 来源: GET /preview-api/scenes/:id/bundle（服务端按 palette 裁剪注册表）`,
    `import.meta.env.MODE: ${import.meta.env.MODE}`,
    `应用版本: ${'version' in pkg && typeof pkg.version === 'string' ? pkg.version : '—'}`,
  ]
})

/** 与当前表单一致的入口 URL（白名单键，见 urlPreviewParams.ts） */
const previewEntryUrl = computed(() => {
  const p = new URLSearchParams()
  const sid = sceneId.value.trim() || props.mergedConfig.sceneId || DEFAULT_PREVIEW_SCENE_ID
  if (sid) p.set('sceneId', sid)
  p.set('layer', String(initialLayerWorldY.value))
  p.set('projection', initialProjectionMode.value)
  p.set('stats', showBlockStatsSidebar.value ? '1' : '0')
  const bg = parseHexColor(sceneBackgroundHex.value)
  if (bg !== null) p.set('bg', `#${(bg >>> 0).toString(16).padStart(6, '0')}`)
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
  showBlockStatsSidebar.value = c.showBlockStatsSidebar
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
    selectableSceneIds.value = await listSelectableSceneIds()
  } catch (e) {
    console.error('[DeveloperConfigPanel] listSelectableSceneIds', e)
    selectableSceneIds.value = []
  }
  syncFromMerged()
})

watch(() => props.mergedConfig, syncFromMerged, { deep: true })

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

  persistDevPreviewPatch({
    sceneId: sceneId.value,
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
  clearPersistedDevPreview()
  window.location.reload()
}

function copyPreviewLink(): void {
  void navigator.clipboard.writeText(previewEntryUrl.value).then(
    () => window.alert('已复制入口链接'),
    () => window.alert('复制失败'),
  )
}

function downloadCurrentBundle(): void {
  const b = props.mergedConfig.wikiRenderBundle
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
        开发者配置（入口初始状态）
      </h2>
      <p class="wm-dev-panel-hint">
        保存后将写入 localStorage（<code>wmr-preview-dev-v2</code>）并刷新。场景数据由本机
        <code>preview-http</code> 提供 <code>/preview-api</code>；开发请使用 <code>npm run dev</code>（同时启动预览 HTTP 与 Vite）。
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
          <span>场景 id（<code>data/server/scenes/&lt;id&gt;/</code> 四件套 JSON）</span>
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
