<script setup lang="ts">
import { computed } from 'vue'
import WorkbenchViewport from './WorkbenchViewport.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { ALL_FEATURES_OFF, type PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

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
  </div>
</template>

<style scoped>
.vh-root { width: 100%; height: 100%; }
.vh-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #475569; font-size: 14px; }
</style>
