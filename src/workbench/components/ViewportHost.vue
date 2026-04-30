<script setup lang="ts">
/**
 * ViewportHost: 工作台外壳 — 播放器 + 分层条 + WorkbenchViewport。
 */
import { computed, inject } from 'vue'
import WorkbenchViewport from './WorkbenchViewport.vue'
import WorldFramePlayerControls from '@/app/components/WorldFramePlayerControls.vue'
import WorldFrameScrubber from '@/app/components/WorldFrameScrubber.vue'
import LayerPreviewBar from '@/app/components/LayerPreviewBar.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { ALL_FEATURES_OFF, type PreviewConfig } from '@/preview/previewConfig'
import { PreviewSceneContextKey } from '@/preview/sceneStore'

const ctx = useWorkbenchContext()
const store = inject(PreviewSceneContextKey)

defineProps<{
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedBlock', v: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null): void
  (e: 'update:activeTool', v: string): void
}>()

const mergedConfig = computed<PreviewConfig | null>(() => {
  const c = ctx.previewConfig.value
  if (!c) return null
  return { ...c, features: { ...c.features, ...ALL_FEATURES_OFF, frameControls: true, layerBar: true } }
})
</script>

<template>
  <div class="vh-root">
    <WorkbenchViewport
      v-if="mergedConfig"
      :merged-config="mergedConfig"
      :selected-block="selectedBlock"
      @update:selected-block="emit('update:selectedBlock', $event)"
      @update:active-tool="emit('update:activeTool', $event)"
    />
    <div v-else class="vh-placeholder"><span class="vh-placeholder-text">No scene loaded</span></div>
    <div v-if="store?.hasWorldMultiFrame?.value" class="vh-frame-dock">
      <WorldFramePlayerControls />
      <WorldFrameScrubber />
    </div>
    <LayerPreviewBar />
  </div>
</template>

<style scoped>
.vh-root { width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; }
.vh-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #475569; font-size: 14px; }
.vh-frame-dock { display: flex; flex-direction: row; align-items: center; gap: 8px; padding: 4px 8px; background: #1a2332; border-top: 1px solid #1e293b; flex-shrink: 0; }
</style>
