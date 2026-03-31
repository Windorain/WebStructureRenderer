<script setup lang="ts">
/**
 * 预览页薄壳：previewSceneStore + StructureViewport + 侧栏与分层条。
 */
import { computed, onBeforeUnmount, onMounted, provide } from 'vue'
import type { Scene } from 'three'

import BlockStatsSidebar from '@/components/BlockStatsSidebar.vue'
import LayerPreviewBar from '@/components/LayerPreviewBar.vue'
import StructureViewport from '@/components/StructureViewport.vue'
import { defaultAppPreviewConfig } from '@/preview/appPreviewConfig'
import { PreviewSceneContextKey } from '@/preview/context'
import { createPreviewSceneStore } from '@/preview/previewSceneStore'
import type { ProjectionMode } from '@/render/viewport/renderViewport'

const store = createPreviewSceneStore(defaultAppPreviewConfig)
provide(PreviewSceneContextKey, store)

const {
  loadStatus,
  statusMessage,
  structureDefinition,
  materialLibrary,
  blockIconCache,
  blockStatsEntries,
  projectionMode,
} = store

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
        v-if="loadStatus === 'ok' && blockIconCache"
        :entries="blockStatsEntries"
        :cache="blockIconCache"
      />
      <div class="wm-viewport-column">
        <StructureViewport
          v-if="loadStatus === 'ok' && structureDefinition && materialLibrary"
          :definition="structureDefinition"
          :material-library="materialLibrary"
          :projection-mode="projectionMode"
          :scene-background="defaultAppPreviewConfig.sceneBackground"
          @ready="onViewportReady"
          @update:projection-mode="onProjectionUpdate"
        />
        <LayerPreviewBar v-if="loadStatus === 'ok'" />
      </div>
    </div>
    <div :class="statusBarClass" role="status" aria-live="polite">
      <span class="wm-status-dot" aria-hidden="true" />
      <span class="wm-status-text">{{ statusMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
.wm-root {
  font-family: system-ui, sans-serif;
  color: #e5e5e5;
  padding: 8px;
}
.wm-title {
  margin: 0 0 8px;
  font-size: 14px;
  opacity: 0.9;
}
.wm-main-stage {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: none;
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
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: none;
  background: #1e293b;
  color: #cbd5e1;
}
.wm-status-bar--loading {
  border-color: rgba(251, 191, 36, 0.35);
  color: #fde68a;
}
.wm-status-bar--ok {
  border-color: rgba(52, 211, 153, 0.35);
  color: #a7f3d0;
}
.wm-status-bar--err {
  border-color: rgba(248, 113, 113, 0.45);
  color: #fecaca;
  background: #3f1518;
}
.wm-status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.85;
}
.wm-status-text {
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
