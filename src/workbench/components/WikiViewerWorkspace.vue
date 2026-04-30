<script setup lang="ts">
/**
 * Wiki 查看器标签页：EmbedViewer + 组件开关 + 宽高校准。
 */
import { computed, ref } from 'vue'
import EmbedViewer from '@/app/EmbedViewer.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import type { PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

const features = ref({
  titleBar: true,
  blockStatsSidebar: true,
  frameControls: true,
  layerBar: true,
  debugStatusBar: false,
})

const viewWidth = ref(800)
const viewHeight = ref(600)

const mergedConfig = computed<PreviewConfig | null>(() => {
  const c = ctx.previewConfig.value
  if (!c) return null
  return {
    ...c,
    features: { ...c.features, ...features.value },
    debug: features.value.debugStatusBar,
  }
})
</script>

<template>
  <div class="ww-root">
    <div class="ww-config">
      <h3>组件开关</h3>
      <div class="ww-grid">
        <label v-for="(_, key) in features" :key="key" class="ww-check">
          <input type="checkbox" v-model="features[key]" />
          <span>{{ key }}</span>
        </label>
      </div>
      <h3>视口尺寸</h3>
      <div class="ww-grid">
        <label class="ww-field"><span>宽</span><input v-model.number="viewWidth" type="number" min="200" max="2000" step="10" /></label>
        <label class="ww-field"><span>高</span><input v-model.number="viewHeight" type="number" min="150" max="1500" step="10" /></label>
      </div>
    </div>

    <div class="ww-preview-wrap">
      <div class="ww-preview" :style="{ width: `${viewWidth}px`, height: `${viewHeight}px` }">
        <EmbedViewer v-if="mergedConfig" :key="ctx.previewEpoch.value" :merged-config="mergedConfig" />
        <div v-else class="ww-placeholder">No scene loaded</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ww-root { display: flex; height: 100%; overflow: hidden; }
.ww-config { flex-shrink: 0; width: 220px; padding: 12px; border-right: 1px solid #1e293b; overflow-y: auto; background: #1a2332; }
.ww-config h3 { font-size: 13px; font-weight: 600; color: #f1f5f9; margin: 0 0 8px; }
.ww-grid { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.ww-check { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #cbd5e1; cursor: pointer; }
.ww-check input[type="checkbox"] { width: 14px; height: 14px; accent-color: #2563eb; }
.ww-field { display: flex; flex-direction: column; gap: 2px; }
.ww-field span { font-size: 10px; color: #64748b; }
.ww-field input { padding: 4px 6px; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 11px; width: 80px; }
.ww-preview-wrap { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow: auto; background: #0a0f19; }
.ww-preview { border: 1px solid #334155; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.ww-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #475569; font-size: 14px; }
</style>
