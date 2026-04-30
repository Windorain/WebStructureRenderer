<script setup lang="ts">
/**
 * ViewportHost: 包裹 AppShell + ToolShelf 浮层。
 */
import { computed } from 'vue'
import AppShell from '@/app/AppShell.vue'
import ToolShelf from './ToolShelf.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { ALL_FEATURES_OFF, type PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

const props = defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const emit = defineEmits<{
  (e: 'update:editMode', v: boolean): void
  (e: 'update:selectedBlock', v: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null): void
  (e: 'update:activeTool', v: string): void
}>()

const workbenchFeatures = {
  ...ALL_FEATURES_OFF,
  layerBar: true,
  frameControls: true,
}

const mergedConfig = computed<PreviewConfig | null>(() => {
  const c = ctx.previewConfig.value
  if (!c) return null
  return { ...c, features: { ...c.features, ...workbenchFeatures } }
})

function onSelectBlock(payload: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null): void {
  emit('update:selectedBlock', payload)
}
</script>

<template>
  <div class="vh-root">
    <AppShell
      v-if="mergedConfig"
      :merged-config="mergedConfig"
      :edit-mode="props.editMode"
      :selected-voxel="props.selectedBlock?.voxel ?? null"
      @select-block="onSelectBlock"
    />
    <div v-else class="vh-placeholder"><span class="vh-placeholder-text">No scene loaded</span></div>
    <ToolShelf
      :edit-mode="props.editMode"
      @update:edit-mode="emit('update:editMode', $event)"
      @update:active-tool="emit('update:activeTool', $event)"
    />
  </div>
</template>

<style scoped>
.vh-root { width: 100%; height: 100%; position: relative; }
.vh-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #475569; font-size: 14px; }
</style>
