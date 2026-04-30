<script setup lang="ts">
/**
 * PS 风格菜单栏：File / Edit / View / Help
 * 右侧显示 SDE 连接状态。
 */
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

defineProps<{
  editMode?: boolean
}>()

defineEmits<{
  (e: 'update:editMode', v: boolean): void
}>()
</script>

<template>
  <div class="mb-root">
    <div class="mb-left">
      <div class="mb-menu-item">File ▾</div>
      <div class="mb-menu-item">Edit ▾</div>
      <div class="mb-menu-item">View ▾</div>
      <div class="mb-menu-item">Help ▾</div>
    </div>
    <div class="mb-right">
      <span class="mb-status-dot" :class="ctx.connectionOk.value ? 'mb-online' : 'mb-offline'" />
      <span class="mb-status-label">{{ ctx.connectionOk.value ? 'SDE Connected' : 'SDE Offline' }}</span>
    </div>
  </div>
</template>

<style scoped>
.mb-root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 8px;
  font-size: 12px;
}
.mb-left, .mb-right { display: flex; align-items: center; gap: 2px; }
.mb-menu-item {
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  color: #cbd5e1;
}
.mb-menu-item:hover { background: #334155; }
.mb-status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.mb-online { background: #22c55e; box-shadow: 0 0 4px #22c55e; }
.mb-offline { background: #64748b; }
.mb-status-label {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 4px;
}
</style>
