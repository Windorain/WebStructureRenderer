<script setup lang="ts">
/**
 * 中央 Viewport 宿主：始终挂载 AppShell。
 */
import { computed } from 'vue'
import AppShell from '@/app/AppShell.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import type { PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const mergedConfig = computed<PreviewConfig | null>(() => ctx.previewConfig.value)
</script>

<template>
  <div class="vh-root">
    <AppShell v-if="mergedConfig" :merged-config="mergedConfig" />
    <div v-else class="vh-placeholder">
      <span class="vh-placeholder-text">No scene loaded</span>
    </div>
  </div>
</template>

<style scoped>
.vh-root { width: 100%; height: 100%; }
.vh-placeholder {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: #475569; font-size: 14px;
}
</style>

<style scoped>
.vh-root {
  width: 100%;
  height: 100%;
}
</style>
