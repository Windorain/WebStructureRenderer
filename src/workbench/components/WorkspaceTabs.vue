<script setup lang="ts">
/**
 * 工作空间标签栏：类似 Blender 顶部的 Workspace tabs。
 * 内置 Preview / Export，点击切换激活的 workspace。
 */
import { ref } from 'vue'

const tabs = [
  { id: 'preview' as const, label: 'Preview' },
  { id: 'export' as const, label: 'Export' },
]

const active = ref<'preview' | 'export'>('preview')

defineExpose({ active })
</script>

<template>
  <div class="wt-root">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="wt-tab"
      :class="{ 'wt-tab--active': active === tab.id }"
      @click="active = tab.id"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.wt-root {
  display: flex;
  align-items: stretch;
  height: 100%;
  padding: 0 6px;
  gap: 1px;
}
.wt-tab {
  padding: 0 14px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.wt-tab:hover { color: #e2e8f0; }
.wt-tab--active {
  color: #f8fafc;
  border-bottom-color: #2563eb;
}
</style>
