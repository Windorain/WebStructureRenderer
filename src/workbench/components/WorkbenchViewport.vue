<script setup lang="ts">
/**
 * 工作台 3D 视口：始终可编辑，点击选取方块，浮动 ToolShelf。
 * 与 EmbedViewer（Wiki 嵌入）分离，不共享 editMode/features 开关。
 */
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { Scene } from 'three'

import StructureViewport from '@/app/components/StructureViewport.vue'
import LayerPreviewBar from '@/app/components/LayerPreviewBar.vue'
import WorldFramePlayerControls from '@/app/components/WorldFramePlayerControls.vue'
import WorldFrameScrubber from '@/app/components/WorldFrameScrubber.vue'
import ToolTipBox from '@/app/components/ToolTipBox.vue'
import type { PreviewConfig } from '@/preview/previewConfig'
import {
  PreviewSceneContextKey,
  createPreviewSceneStore,
} from '@/preview/sceneStore'
import { usePreviewTooltip, resolvePreviewTooltipText } from '@/preview/tooltip'
import type { ProjectionMode } from '@/render/viewport/renderViewport'
import { t } from '@/workbench/i18n'

const props = defineProps<{
  mergedConfig: PreviewConfig
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedBlock', v: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null): void
  (e: 'update:activeTool', v: string): void
}>()

const store = createPreviewSceneStore(props.mergedConfig)
provide(PreviewSceneContextKey, store)

const { hover, setHover, clearHover } = usePreviewTooltip()

const {
  loadStatus,
  structureDefinition,
  materialLibrary,
  projectionMode,
  layerPreviewMode,
  contentGroupRef,
  tooltipPalette,
  hasWorldMultiFrame,
} = store

const tooltipDisplayText = computed(() => {
  const def = structureDefinition.value
  const h = hover.value
  if (!def || !h?.blockId) return ''
  return resolvePreviewTooltipText(def, tooltipPalette.value, h)
})

/* ---- ToolShelf ---- */
const activeTool = ref('select')

function setTool(tool: string): void {
  activeTool.value = tool
  emit('update:activeTool', tool)
}

/* ---- Viewport events ---- */
async function onViewportReady(scene: Scene): Promise<void> {
  store.registerScene(scene)
  try { await store.rebuildContentMesh() } catch (e) { console.error('[Workbench] onViewportReady', e) }
}

function onViewportHover(
  p: { blockId: string; clientX: number; clientY: number; voxel: { column: number; row: number; zSlice: number } } | null,
): void {
  if (p) setHover({ ...p, source: 'viewport' })
  else clearHover('viewport')
}

function onViewportSelect(
  p: { blockId: string; voxel: { column: number; row: number; zSlice: number } } | null,
): void {
  emit('update:selectedBlock', p ? { blockId: p.blockId, voxel: p.voxel } : null)
}

onMounted(async () => { await store.loadStructureAndResources() })
onBeforeUnmount(() => { store.disposeCachesAndLibrary() })
</script>

<template>
  <div class="wv-root">
    <!-- 3D Viewport -->
    <div class="wv-viewport-wrap">
    <StructureViewport
      v-if="loadStatus === 'ok' && structureDefinition && materialLibrary"
      :definition="structureDefinition"
      :material-library="materialLibrary"
      :projection-mode="projectionMode"
      :content-group="contentGroupRef"
      :layer-preview-mode="layerPreviewMode"
      :scene-background="mergedConfig.sceneBackground"
      :edit-mode="true"
      :selected-voxel="props.selectedBlock?.voxel ?? null"
      @ready="onViewportReady"
      @update:projection-mode="(m: ProjectionMode) => (store.projectionMode.value = m)"
      @hover-block="onViewportHover"
      @select-block="onViewportSelect"
    />
    </div>

    <!-- 悬浮 ToolShelf -->
    <div class="wv-shelf">
      <div class="wv-shelf-panel">
        <div class="wv-shelf-title">{{ t('tools') }}</div>
        <button
          v-for="tool in [{ id: 'select', label: t('select') }, { id: 'annotation', label: t('annotation') }]"
          :key="tool.id"
          class="wv-tool-btn"
          :class="{ 'wv-tool-btn--active': activeTool === tool.id }"
          @click="setTool(tool.id)"
        >{{ tool.label }}</button>
      </div>
    </div>

    <!-- 播放器 + 分层条 -->
    <div v-if="hasWorldMultiFrame" class="wv-frame-dock">
      <WorldFramePlayerControls />
      <WorldFrameScrubber />
    </div>
    <LayerPreviewBar />

    <!-- ToolTip -->
    <ToolTipBox
      v-if="hover && tooltipDisplayText"
      :text="tooltipDisplayText"
      :client-x="hover.clientX"
      :client-y="hover.clientY"
    />
  </div>
</template>

<style scoped>
.wv-root { width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; }
.wv-viewport-wrap { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.wv-frame-dock { display: flex; flex-direction: row; align-items: center; gap: 8px; padding: 4px 8px; background: #1a2332; border-top: 1px solid #1e293b; flex-shrink: 0; }

.wv-shelf {
  position: absolute; top: 8px; left: 4px; z-index: 20;
}
.wv-shelf-panel {
  padding: 6px;
  background: rgba(15, 23, 42, 0.92);
  border-radius: 6px;
  border: 1px solid #1e293b;
  min-width: 72px;
  width: max-content;
  backdrop-filter: blur(6px);
}
.wv-shelf-title {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;
  color: #64748b; margin-bottom: 4px; padding: 0 4px;
}
.wv-tool-btn {
  display: block; padding: 3px 6px; border: none;
  background: transparent; color: #94a3b8; font-size: 11px;
  text-align: left; cursor: pointer; border-radius: 3px; margin-bottom: 1px;
}
.wv-tool-btn:hover { background: #1e293b; color: #e2e8f0; }
.wv-tool-btn--active { background: #1e3a5f; color: #f8fafc; }
</style>
