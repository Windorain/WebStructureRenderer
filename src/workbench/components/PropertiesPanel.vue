<script setup lang="ts">
/**
 * 右侧属性面板：Blender 风格的编辑器容器。
 * 顶部下拉切换编辑器类型；KeepAlive 缓存各编辑器状态。
 */
import { computed, ref, type Component } from 'vue'
import { t } from '@/workbench/i18n'
import SceneInfoEditor from './SceneInfoEditor.vue'
import PreviewConfigEditor from './PreviewConfigEditor.vue'
import BlockInspector from './BlockInspector.vue'
import BlockStatsEditor from './BlockStatsEditor.vue'

const props = defineProps<{
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const EDITORS = [
  { id: 'scene' as const, comp: SceneInfoEditor },
  { id: 'config' as const, comp: PreviewConfigEditor },
  { id: 'inspector' as const, comp: BlockInspector },
  { id: 'stats' as const, comp: BlockStatsEditor },
] as const

type EditorId = (typeof EDITORS)[number]['id']

const activeEditorId = ref<EditorId>('scene')

const activeEditor = computed<Component>(() => {
  return EDITORS.find((e) => e.id === activeEditorId.value)?.comp ?? SceneInfoEditor
})
</script>

<template>
  <div class="pp-root">
    <div class="pp-header">
      <select v-model="activeEditorId" class="pp-editor-select">
        <option v-for="ed in EDITORS" :key="ed.id" :value="ed.id">
          {{ t(ed.id === 'scene' ? 'sceneInfo' : ed.id === 'config' ? 'previewConfig' : ed.id === 'inspector' ? 'blockInspector' : 'blockStats') }}
        </option>
      </select>
    </div>
    <div class="pp-body">
      <KeepAlive>
        <component :is="activeEditor" :selected-block="props.selectedBlock" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.pp-root { display: flex; flex-direction: column; height: 100%; }
.pp-header { flex-shrink: 0; padding: 6px 8px; border-bottom: 1px solid #1e293b; }
.pp-editor-select { width: 100%; padding: 4px 6px; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 12px; }
.pp-body { flex: 1; overflow-y: auto; }
</style>
