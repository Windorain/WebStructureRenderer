<script setup lang="ts">
/** 中央 Viewport 宿主：始终挂载 AppShell，传递 editMode + select-block。 */
import { computed } from 'vue'
import AppShell from '@/app/AppShell.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { t } from '@/workbench/i18n'
import type { PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

const props = defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedBlock', v: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null): void
}>()

const mergedConfig = computed<PreviewConfig | null>(() => ctx.previewConfig.value)

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
    <div v-else class="vh-placeholder">
      <span class="vh-placeholder-text">{{ t('noSceneHint') }}</span>
    </div>
  </div>
</template>

<style scoped>
.vh-root { width: 100%; height: 100%; }
.vh-placeholder {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: #475569; font-size: 14px;
}
.vh-placeholder-text { color: #64748b; }
</style>
