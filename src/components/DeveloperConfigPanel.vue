<script setup lang="ts">
/**
 * 本地模拟服务端：选场景、上传/下载三件套、dev 覆盖项、开发者信息。
 */
import { computed, onMounted, ref } from 'vue'

import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import {
  clearPersistedDevPreview,
  persistDevPreviewPatch,
} from '@/preview/previewConfig'
import {
  DEFAULT_PREVIEW_SCENE_ID,
  isUploadedScene,
  listSelectableSceneIds,
  removeUploadedScene,
  saveUploadedWikiRenderBundle,
} from '@/preview/previewDevServer'
import { validateWikiRenderBundle } from '@/render/pipeline'
import type { WikiRenderBundle } from '@/render/types'
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
const uploadSceneIdInput = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const devInfoLines = computed(() => {
  const sid = props.mergedConfig.sceneId ?? ''
  const resolved = sid === '' ? DEFAULT_PREVIEW_SCENE_ID : sid
  const src = isUploadedScene(resolved) ? '浏览器上传（localStorage）' : '仓库 data/server/scenes'
  return [
    `场景 id（解析用）: ${resolved}`,
    `持久化 sceneId: ${sid || '（空=默认）'}`,
    `bundle 来源: ${src}`,
    `import.meta.env.MODE: ${import.meta.env.MODE}`,
    `应用版本: ${'version' in pkg && typeof pkg.version === 'string' ? pkg.version : '—'}`,
  ]
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

onMounted(() => {
  selectableSceneIds.value = listSelectableSceneIds()
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

function triggerFilePick(): void {
  fileInputRef.value?.click()
}

function pickName(
  map: Map<string, string>,
  ...names: string[]
): string | undefined {
  for (const n of names) {
    const t = map.get(n.toLowerCase())
    if (t !== undefined) return t
  }
  return undefined
}

async function onUploadFiles(ev: Event): Promise<void> {
  const input = ev.target as HTMLInputElement
  const files = input.files
  input.value = ''
  if (!files?.length) return

  const map = new Map<string, string>()
  for (const f of files) {
    map.set(f.name.toLowerCase(), await f.text())
  }

  const docRaw = pickName(map, 'document.json', 'export.json')
  const blockRaw = pickName(map, 'block_registry.json', 'export.block_registry.json')
  const matRaw = pickName(map, 'material_registry.json', 'export.material_registry.json')
  const modelRaw = pickName(map, 'model_registry.json', 'export.model_registry.json')

  if (!docRaw || !blockRaw || !matRaw) {
    window.alert('至少需要：document.json 或 export.json；block_registry；material_registry（model_registry 可省略，将使用空表）')
    return
  }

  let document: unknown
  try {
    document = JSON.parse(docRaw) as unknown
  } catch {
    window.alert('document JSON 解析失败')
    return
  }

  let blockRegistry: WikiRenderBundle['blockRegistry']
  let materialRegistry: WikiRenderBundle['materialRegistry']
  let modelRegistry: WikiRenderBundle['modelRegistry']
  try {
    blockRegistry = JSON.parse(blockRaw) as WikiRenderBundle['blockRegistry']
    materialRegistry = JSON.parse(matRaw) as WikiRenderBundle['materialRegistry']
    modelRegistry = modelRaw
      ? (JSON.parse(modelRaw) as WikiRenderBundle['modelRegistry'])
      : { schemaVersion: 1, models: {} }
  } catch {
    window.alert('注册表 JSON 解析失败')
    return
  }

  const bundle: WikiRenderBundle = { document, blockRegistry, materialRegistry, modelRegistry }
  try {
    validateWikiRenderBundle(bundle)
  } catch (e) {
    window.alert(e instanceof Error ? e.message : String(e))
    return
  }

  const id =
    uploadSceneIdInput.value.trim() ||
    (typeof document === 'object' &&
      document !== null &&
      'id' in document &&
      typeof (document as { id: unknown }).id === 'string'
      ? (document as { id: string }).id
      : '')
  if (!id) {
    window.alert('请填写上传场景 id，或确保 document 含字符串 id')
    return
  }

  try {
    saveUploadedWikiRenderBundle(id, bundle)
  } catch (e) {
    window.alert(e instanceof Error ? e.message : String(e))
    return
  }

  persistDevPreviewPatch({ sceneId: id })
  window.location.reload()
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

function removeUploadedAndReload(): void {
  const sid = sceneId.value.trim() || props.mergedConfig.sceneId
  if (!sid) {
    window.alert('请先选择已上传的场景 id')
    return
  }
  if (!isUploadedScene(sid)) {
    window.alert('当前选中场景不是本地上传项')
    return
  }
  if (!window.confirm(`删除本地上传场景「${sid}」？`)) return
  removeUploadedScene(sid)
  persistDevPreviewPatch({ sceneId: '' })
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
      开发者配置（本地模拟服务端）
    </h2>
    <p class="wm-dev-panel-hint">
      保存后将写入 localStorage 并刷新；数据目录为 <code>data/server/scenes</code>；上传覆盖存于浏览器。
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

    <div class="wm-dev-panel-grid">
      <label class="wm-dev-field wm-dev-field--full">
        <span>场景 id（data/server/scenes/&lt;id&gt;/document.json）</span>
        <select v-model="sceneId">
          <option value="">
            默认（{{ DEFAULT_PREVIEW_SCENE_ID }}）
          </option>
          <option
            v-for="id in selectableSceneIds"
            :key="id"
            :value="id"
          >
            {{ id }}{{ isUploadedScene(id) ? ' · 上传' : '' }}
          </option>
        </select>
      </label>

      <div class="wm-dev-field wm-dev-field--full wm-dev-upload-row">
        <label class="wm-dev-field">
          <span>上传场景 id（可留空用 document.id）</span>
          <input v-model="uploadSceneIdInput" type="text" spellcheck="false" placeholder="例如 my_scene">
        </label>
        <input
          ref="fileInputRef"
          type="file"
          multiple
          accept=".json,application/json"
          class="wm-dev-file-hidden"
          @change="onUploadFiles"
        >
        <button type="button" class="wm-dev-btn" @click="triggerFilePick">
          上传三 JSON…
        </button>
        <button type="button" class="wm-dev-btn" @click="downloadCurrentBundle">
          下载当前 bundle
        </button>
        <button type="button" class="wm-dev-btn wm-dev-btn--danger" @click="removeUploadedAndReload">
          删除选中上传场景
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
.wm-dev-upload-row .wm-dev-field {
  flex: 1;
  min-width: 160px;
}
.wm-dev-file-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
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
