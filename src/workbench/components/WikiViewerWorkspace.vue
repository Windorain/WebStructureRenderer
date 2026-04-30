<script setup lang="ts">
import { computed } from 'vue'
import EmbedViewer from '@/app/EmbedViewer.vue'
import PropertiesPanel from './PropertiesPanel.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { wikiConfig } from '@/workbench/wikiConfig'
import type { PreviewConfig } from '@/preview/previewConfig'

const ctx = useWorkbenchContext()

function parseHex6(s: string): number {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(s.trim())
  if (!m) return 0x5a5a5a
  return parseInt(m[1], 16)
}

const mergedConfig = computed<PreviewConfig | null>(() => {
  const c = ctx.previewConfig.value
  if (!c) return null
  return {
    ...c,
    features: { ...c.features, ...wikiConfig.features },
    debug: wikiConfig.features.debugStatusBar,
    sceneBackground: parseHex6(wikiConfig.sceneBackgroundHex),
    initialProjectionMode: wikiConfig.projectionMode,
    blockIconCacheOptions: {
      ...c.blockIconCacheOptions,
      sizePx: wikiConfig.iconSizePx,
      orthoHalf: wikiConfig.iconOrthoHalf,
    },
  }
})
</script>

<template>
  <div class="ww-root">
    <div class="ww-preview-wrap">
      <div class="ww-preview" :style="{ width: `${wikiConfig.viewWidth}px`, height: `${wikiConfig.viewHeight}px` }">
        <EmbedViewer v-if="mergedConfig" :key="ctx.previewEpoch.value" :merged-config="mergedConfig" />
        <div v-else class="ww-placeholder">No scene loaded</div>
      </div>
    </div>
    <div class="ww-panel">
      <PropertiesPanel editors="wiki" />
    </div>
  </div>
</template>

<style scoped>
.ww-root { display: flex; height: 100%; overflow: hidden; }
.ww-panel { flex-shrink: 0; width: 260px; border-left: 1px solid #1e293b; background: #1a2332; overflow-y: auto; }
.ww-preview-wrap { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow: auto; background: #0a0f19; }
.ww-preview { border: 1px solid #334155; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.ww-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #475569; font-size: 14px; }
</style>
