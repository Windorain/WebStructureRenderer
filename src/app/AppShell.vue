<script setup lang="ts">
/**
 * 预览页薄壳：previewSceneStore + StructureViewport + 侧栏与分层条。
 * 唯一数据入口为 `mergedConfig: PreviewConfig`；场景与顶栏以 `renderBundle.document` 为准（见 `sceneDisplayTitle`）。
 */
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { Scene } from 'three'

import BlockStatsSidebar from '@/app/components/BlockStatsSidebar.vue'
import LayerPreviewBar from '@/app/components/LayerPreviewBar.vue'
import StructureViewport from '@/app/components/StructureViewport.vue'
import ToolTipBox from '@/app/components/ToolTipBox.vue'
import type { PreviewConfig } from '@/preview/previewConfig'
import { readSceneMetaField } from '@/render/data/compactSceneDocument'
import { sceneDisplayTitleFromRootDocument } from '@/preview/sceneDisplayTitle'
import { PreviewSceneContextKey, createPreviewSceneStore } from '@/preview/sceneStore'
import { usePreviewTooltip, resolveBlockTooltip } from '@/preview/tooltip'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

const props = defineProps<{
  mergedConfig: PreviewConfig
}>()

const store = createPreviewSceneStore(props.mergedConfig)
provide(PreviewSceneContextKey, store)

const { hover, setHover, clearHover } = usePreviewTooltip()

const {
  showBlockStatsSidebar,
  loadStatus,
  statusBarTone,
  statusMessage,
  structureDefinition,
  materialLibrary,
  blockIconCache,
  blockStatsEntries,
  projectionMode,
  layerPreviewMode,
  contentGroupRef,
} = store

const showLayerBar = computed(() => props.mergedConfig.features.layerBar)

const sceneDocument = computed(() => props.mergedConfig.renderBundle.document)

/** 标题旁「?」悬停：仅展示非空的作者、版本号（gtnhVersion）。 */
const metaTooltipText = computed(() => {
  const d = sceneDocument.value
  if (!d || typeof d !== 'object') return ''
  const rows: string[] = []
  const pick = (label: string, key: string) => {
    const v = readSceneMetaField(d, key).trim()
    if (v) rows.push(`${label}：${v}`)
  }
  pick('作者', 'author')
  pick('版本号', 'gtnhVersion')
  return rows.join('\n')
})

const showMetaHint = computed(() => metaTooltipText.value.length > 0)

const metaHintPointer = ref<{ clientX: number; clientY: number } | null>(null)

function onMetaHintPointerEnter(e: PointerEvent): void {
  metaHintPointer.value = { clientX: e.clientX, clientY: e.clientY }
}

function onMetaHintPointerMove(e: PointerEvent): void {
  if (!metaHintPointer.value) return
  metaHintPointer.value = { clientX: e.clientX, clientY: e.clientY }
}

function onMetaHintPointerLeave(): void {
  metaHintPointer.value = null
}

function onMetaHintFocusIn(e: FocusEvent): void {
  const t = e.currentTarget as HTMLElement
  const r = t.getBoundingClientRect()
  metaHintPointer.value = { clientX: r.left + r.width / 2, clientY: r.bottom }
}

function onMetaHintFocusOut(): void {
  metaHintPointer.value = null
}

const tooltipDisplayText = computed(() => {
  const def = structureDefinition.value
  const h = hover.value
  if (!def || !h?.blockId) return ''
  return resolveBlockTooltip(h.blockId, def)
})

/**
 * 顶栏：从 `renderBundle.document` 解析（与 3D 同一数据源；支持根/World 内嵌/数字 id），
 * 再退回已解析的 `StructureDefinition`。
 */
const previewTitle = computed(() => {
  const fromDoc = sceneDisplayTitleFromRootDocument(props.mergedConfig.renderBundle.document)
  if (fromDoc) return fromDoc
  const def = structureDefinition.value
  const lab = def?.label?.trim()
  if (lab) return lab
  const id = def?.id?.trim()
  if (id) return id
  return '结构预览'
})

const statusBarClass = computed(() => {
  if (loadStatus.value === 'error') return 'wm-status-bar wm-status-bar--err'
  if (loadStatus.value === 'loading') return 'wm-status-bar wm-status-bar--loading'
  if (statusBarTone.value === 'warn') return 'wm-status-bar wm-status-bar--warn'
  return 'wm-status-bar wm-status-bar--ok'
})

async function onViewportReady(scene: Scene): Promise<void> {
  store.registerScene(scene)
  try {
    await store.rebuildContentMesh()
  } catch (e) {
    console.error('[WikiMultiStructureRender] onViewportReady', e)
  }
}

function onProjectionUpdate(mode: ProjectionMode): void {
  store.projectionMode.value = mode
}

function onViewportHover(
  payload: {
    blockId: string
    clientX: number
    clientY: number
    source: 'viewport'
  } | null,
): void {
  if (payload) setHover(payload)
  else clearHover('viewport')
}

function onSidebarTooltipHover(
  payload: {
    blockId: string
    clientX: number
    clientY: number
    source: 'sidebar'
  } | null,
): void {
  if (payload) setHover(payload)
  else clearHover('sidebar')
}

onMounted(async () => {
  await store.loadStructureAndResources()
})

onBeforeUnmount(() => {
  store.disposeCachesAndLibrary()
})
</script>

<template>
  <div class="wm-root">
    <p class="wm-title">
      <abbr
        v-if="showMetaHint"
        class="wm-title-meta-hint"
        tabindex="0"
        aria-label="作者与版本号"
        title=""
        @pointerenter="onMetaHintPointerEnter"
        @pointermove="onMetaHintPointerMove"
        @pointerleave="onMetaHintPointerLeave"
        @focusin="onMetaHintFocusIn"
        @focusout="onMetaHintFocusOut"
      >?</abbr>
      <span class="wm-title-text">{{ previewTitle }}</span>
    </p>
    <div class="wm-main-stage">
      <BlockStatsSidebar
        v-if="showBlockStatsSidebar && loadStatus === 'ok' && blockIconCache"
        :entries="blockStatsEntries"
        :cache="blockIconCache"
        @tooltip-hover="onSidebarTooltipHover"
      />
      <div class="wm-viewport-column">
        <StructureViewport
          v-if="loadStatus === 'ok' && structureDefinition && materialLibrary"
          :definition="structureDefinition"
          :material-library="materialLibrary"
          :projection-mode="projectionMode"
          :content-group="contentGroupRef"
          :layer-preview-mode="layerPreviewMode"
          :scene-background="mergedConfig.sceneBackground"
          @ready="onViewportReady"
          @update:projection-mode="onProjectionUpdate"
          @hover-block="onViewportHover"
        />
        <LayerPreviewBar v-if="showLayerBar && loadStatus === 'ok'" />
      </div>
    </div>
    <div
      v-if="mergedConfig.debug"
      :class="statusBarClass"
      role="status"
      aria-live="polite"
    >
      <span class="wm-status-dot" aria-hidden="true" />
      <span class="wm-status-text">{{ statusMessage }}</span>
    </div>
    <ToolTipBox
      v-if="hover && tooltipDisplayText"
      :text="tooltipDisplayText"
      :client-x="hover.clientX"
      :client-y="hover.clientY"
    />
    <ToolTipBox
      v-if="metaHintPointer && metaTooltipText"
      :text="metaTooltipText"
      :client-x="metaHintPointer.clientX"
      :client-y="metaHintPointer.clientY"
    />
  </div>
</template>

<style scoped>
.wm-root {
  font-family: system-ui, 'Segoe UI', sans-serif;
  color: var(--nei-text-dark);
  background: var(--nei-bg);
  padding: 8px;
  box-sizing: border-box;
}
.wm-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.wm-title-text {
  min-width: 0;
}
.wm-title-meta-hint {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  border-radius: 50%;
  background: var(--nei-inset-bg);
  cursor: help;
  user-select: none;
}
.wm-title-meta-hint:hover {
  filter: brightness(1.08);
}
.wm-title-meta-hint:focus-visible {
  outline: 2px solid var(--nei-focus-ring);
  outline-offset: 2px;
}
.wm-main-stage {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  border-bottom: none;
  background: var(--nei-bg);
}
.wm-viewport-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.wm-status-bar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 0;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.45;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  border-radius: 0;
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  border-top: none;
  background: var(--nei-inset-bg);
  color: var(--nei-text-muted);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
}
.wm-status-bar--loading {
  color: #fcd34d;
}
.wm-status-bar--ok {
  color: #86efac;
}
.wm-status-bar--warn {
  color: #fde047;
}
.wm-status-bar--err {
  color: #fecaca;
  background: #3d1518;
}
.wm-status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 0;
  background: currentColor;
  opacity: 0.9;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
}
.wm-status-text {
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
