<script setup lang="ts">
/**
 * 预览页薄壳：previewSceneStore + StructureViewport + 侧栏与分层条。
 */
import { computed, onBeforeUnmount, onMounted, provide } from 'vue'
import type { Scene } from 'three'

import BlockStatsSidebar from '@/components/BlockStatsSidebar.vue'
import LayerPreviewBar from '@/components/LayerPreviewBar.vue'
import StructureViewport from '@/components/StructureViewport.vue'
import ToolTipBox from '@/components/ToolTipBox.vue'
import { defaultAppPreviewConfig } from '@/preview/appPreviewConfig'
import { PreviewSceneContextKey } from '@/preview/context'
import { createPreviewSceneStore } from '@/preview/previewSceneStore'
import { usePreviewTooltip } from '@/preview/usePreviewTooltip'
import { resolveBlockTooltip } from '@/render/blockTooltip'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

const store = createPreviewSceneStore(defaultAppPreviewConfig)
provide(PreviewSceneContextKey, store)

const { hover, setHover, clearHover } = usePreviewTooltip()

const {
  showBlockStatsSidebar,
  loadStatus,
  statusMessage,
  structureDefinition,
  materialLibrary,
  blockIconCache,
  blockStatsEntries,
  projectionMode,
  layerPreviewMode,
  contentGroupRef,
} = store

const tooltipDisplayText = computed(() => {
  const def = structureDefinition.value
  const h = hover.value
  if (!def || !h?.blockId) return ''
  return resolveBlockTooltip(h.blockId, def)
})

const statusBarClass = computed(() => {
  if (loadStatus.value === 'ok') return 'wm-status-bar wm-status-bar--ok'
  if (loadStatus.value === 'error') return 'wm-status-bar wm-status-bar--err'
  return 'wm-status-bar wm-status-bar--loading'
})

async function onViewportReady(scene: Scene): Promise<void> {
  store.registerScene(scene)
  await store.rebuildContentMesh()
  const def = store.structureDefinition.value
  if (def) {
    store.statusMessage.value = defaultAppPreviewConfig.okMessage(def.id)
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
    <p class="wm-title">Industrial Electrolyzer — Simple 结构预览（GT5U 数据）</p>
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
          :scene-background="defaultAppPreviewConfig.sceneBackground"
          @ready="onViewportReady"
          @update:projection-mode="onProjectionUpdate"
          @hover-block="onViewportHover"
        />
        <LayerPreviewBar v-if="loadStatus === 'ok'" />
      </div>
    </div>
    <div :class="statusBarClass" role="status" aria-live="polite">
      <span class="wm-status-dot" aria-hidden="true" />
      <span class="wm-status-text">{{ statusMessage }}</span>
    </div>
    <ToolTipBox
      v-if="hover && tooltipDisplayText"
      :text="tooltipDisplayText"
      :client-x="hover.clientX"
      :client-y="hover.clientY"
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
