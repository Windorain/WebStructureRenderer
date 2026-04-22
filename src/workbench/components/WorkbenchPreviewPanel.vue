<script setup lang="ts">
import { computed } from 'vue'

import AppShell from '@/app/AppShell.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const scene = computed(() => ctx.scene.value)
const previewBusy = computed(() => ctx.previewBusy.value)
const previewErrorText = computed(() => ctx.previewError.value)
const previewCfg = computed(() => ctx.previewConfig.value)
const previewKey = computed(() => ctx.previewEpoch.value)

async function onRetrySync(): Promise<void> {
  await ctx.syncPreview()
}
</script>

<template>
  <section class="wm-preview">
    <p
      v-if="scene && previewErrorText && previewCfg"
      class="wm-preview-banner"
      role="status"
    >
      {{ previewErrorText }}
      <button type="button" class="wm-btn-inline" @click="onRetrySync">重试同步</button>
    </p>

    <div v-if="!scene" class="wm-boot wm-boot--muted">
      请先在右上角「设置」中加载场景（本机 / SDE / 示例）；须含 textureBlobs 与 baked 几何以预览。
    </div>

    <div v-else-if="!previewCfg && previewErrorText" class="wm-boot wm-boot--err">
      <p>{{ previewErrorText }}</p>
      <button type="button" class="wm-btn" @click="onRetrySync">重试</button>
    </div>

    <div v-else-if="!previewCfg" class="wm-boot">
      正在从内存中的场景数据构建三维预览…
    </div>

    <div v-else class="wm-preview-embed" :class="{ 'wm-preview-embed--busy': previewBusy }">
      <AppShell
        :key="`pv-${previewKey}`"
        :merged-config="previewCfg"
      />
      <div v-if="previewBusy" class="wm-preview-veil" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.wm-preview {
  min-height: 60vh;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #334155;
  overflow: hidden;
  position: relative;
}
.wm-preview-banner {
  margin: 0;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.45;
  color: #fecaca;
  background: #450a0a;
  border-bottom: 1px solid #7f1d1d;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.wm-btn-inline {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
}
.wm-preview-embed {
  position: relative;
  min-height: 60vh;
}
.wm-preview-embed--busy {
  pointer-events: none;
  opacity: 0.65;
  transition: opacity 0.12s;
}
.wm-preview-veil {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.25);
  z-index: 2;
  pointer-events: none;
}
.wm-boot {
  padding: 16px;
  font-family: system-ui, sans-serif;
  color: #e2e8f0;
}
.wm-boot--err {
  color: #fecaca;
  white-space: pre-wrap;
}
.wm-boot--muted {
  color: #94a3b8;
}
.wm-btn {
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
  font-size: 12px;
}
</style>
