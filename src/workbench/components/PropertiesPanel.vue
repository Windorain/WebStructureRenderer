<script setup lang="ts">
/**
 * 右侧属性面板：Blender 风格的编辑器容器。
 * 顶部下拉切换编辑器类型；KeepAlive 缓存各编辑器状态。
 * 内容随上下文（editMode + selectedBlock）自动切换。
 */
import { computed, ref, type Component } from 'vue'
import SceneInfoEditor from './SceneInfoEditor.vue'
import PreviewConfigEditor from './PreviewConfigEditor.vue'
import BlockInspector from './BlockInspector.vue'

const props = defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()

const EDITORS = [
  { id: 'scene' as const, label: 'Scene Info', icon: '📋', comp: SceneInfoEditor },
  { id: 'config' as const, label: 'Preview Config', icon: '⚙', comp: PreviewConfigEditor },
  { id: 'inspector' as const, label: 'Block Inspector', icon: '🔍', comp: BlockInspector },
] as const

type EditorId = (typeof EDITORS)[number]['id']

const activeEditorId = ref<EditorId>('scene')

const activeEditor = computed<Component>(() => {
  return EDITORS.find((e) => e.id === activeEditorId.value)?.comp ?? SceneInfoEditor
})

const visibleEditors = computed(() => {
  return EDITORS.filter((e) => {
    if (e.id === 'inspector') return props.editMode
    return true
  })
})
</script>

<template>
  <div class="pp-root">
    <div class="pp-header">
      <select v-model="activeEditorId" class="pp-editor-select">
        <option v-for="ed in visibleEditors" :key="ed.id" :value="ed.id">
          {{ ed.icon }} {{ ed.label }}
        </option>
      </select>
    </div>
    <div class="pp-body">
      <KeepAlive>
        <component :is="activeEditor" v-bind="props" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.pp-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.pp-header {
  flex-shrink: 0;
  padding: 6px 8px;
  border-bottom: 1px solid #1e293b;
}
.pp-editor-select {
  width: 100%;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
}
.pp-body {
  flex: 1;
  overflow-y: auto;
}
</style>
