<script setup lang="ts">
import { computed, inject } from 'vue'

import { PreviewSceneContextKey } from '@/preview/context'

const store = inject(PreviewSceneContextKey)
if (!store) {
  throw new Error('LayerPreviewBar: PreviewSceneContext missing')
}

const { layerPreviewLabel, sizeB: sizeBRef, meshBusy } = store

const layerWorldY = computed({
  get: () => store.layerWorldY.value,
  set: (v: number) => {
    store.layerWorldY.value = v
  },
})

const maxY = computed(() => Math.max(0, sizeBRef.value - 1))
</script>

<template>
  <div
    v-if="sizeBRef > 0"
    class="wm-layer-bar"
  >
    <label class="wm-layer-label" for="wm-layer-range">分层预览</label>
    <input
      id="wm-layer-range"
      v-model.number="layerWorldY"
      class="wm-layer-range"
      type="range"
      :min="-1"
      :max="maxY"
      step="1"
      :disabled="meshBusy"
      aria-label="分层预览：ALL 或按世界 Y 单层显示"
    />
    <span class="wm-layer-value" aria-live="polite">{{ layerPreviewLabel }}</span>
  </div>
</template>

<style scoped>
.wm-layer-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #0f172a;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: #cbd5e1;
}
.wm-layer-label {
  flex-shrink: 0;
  user-select: none;
}
.wm-layer-range {
  flex: 1;
  min-width: 0;
  accent-color: #38bdf8;
}
.wm-layer-range:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.wm-layer-value {
  flex-shrink: 0;
  min-width: 4.5em;
  text-align: right;
  color: #e2e8f0;
}
</style>
