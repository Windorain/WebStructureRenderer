<script setup lang="ts">
/**
 * 悬浮工具架：类似 Blender Tool Shelf，叠加在视口上方。
 * T 键或点击 tab 切换展开/收起。
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { t } from '@/workbench/i18n'

defineProps<{ editMode: boolean }>()

const emit = defineEmits<{
  (e: 'update:editMode', v: boolean): void
  (e: 'update:activeTool', v: string): void
}>()

const open = ref(false)
const activeTool = ref('select')

function setTool(tool: string): void { activeTool.value = tool; emit('update:activeTool', tool) }
function toggle(): void { open.value = !open.value }

function onKey(e: KeyboardEvent): void {
  if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="ts-float" :class="{ 'ts-float--open': open }">
    <button class="ts-tab" @click="toggle" :title="open ? '收起工具架 (T)' : '展开工具架 (T)'">
      <span class="ts-tab-icon">{{ open ? '◀' : '▶' }}</span>
    </button>

    <div v-if="open" class="ts-panel">
      <!-- Gizmo -->
      <div class="ts-gizmo">
        <button class="ts-gizmo-btn" :class="{ 'ts-gizmo-btn--active': !editMode }" title="预览模式" @click="$emit('update:editMode', false)">▶</button>
        <button class="ts-gizmo-btn" :class="{ 'ts-gizmo-btn--active': editMode }" title="编辑模式" @click="$emit('update:editMode', true)">✏</button>
      </div>

      <!-- 工具列表 -->
      <div v-if="editMode" class="ts-tools">
        <div class="ts-tools-title">{{ t('tools') }}</div>
        <button class="ts-tool-btn" :class="{ 'ts-tool-btn--active': activeTool === 'select' }" @click="setTool('select')">{{ t('select') }}</button>
        <button class="ts-tool-btn" :class="{ 'ts-tool-btn--active': activeTool === 'annotation' }" @click="setTool('annotation')">{{ t('annotation') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ts-float {
  position: absolute; top: 4px; left: 0; z-index: 20;
  display: flex; flex-direction: row;
}
.ts-tab {
  width: 20px; min-height: 48px; padding: 4px 0; border: none;
  background: rgba(15, 23, 42, 0.92); color: #64748b;
  font-size: 10px; cursor: pointer; border-radius: 0 4px 4px 0;
  display: flex; align-items: center; justify-content: center;
  writing-mode: vertical-lr;
}
.ts-tab:hover { color: #e2e8f0; background: rgba(30, 41, 59, 0.95); }
.ts-panel {
  padding: 6px; background: rgba(15, 23, 42, 0.94);
  border-radius: 0 6px 6px 0; border: 1px solid #1e293b;
  border-left: none; min-width: 140px;
}
.ts-gizmo { display: flex; gap: 2px; margin-bottom: 8px; padding: 3px; background: #1e293b; border-radius: 5px; }
.ts-gizmo-btn { flex: 1; padding: 5px 0; border: none; background: transparent; color: #64748b; font-size: 13px; cursor: pointer; border-radius: 3px; transition: background 0.15s, color 0.15s; }
.ts-gizmo-btn:hover { color: #e2e8f0; }
.ts-gizmo-btn--active { background: #2563eb; color: #fff; }
.ts-tools-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; padding: 0 4px; }
.ts-tool-btn { display: block; width: 100%; padding: 4px 8px; border: none; background: transparent; color: #94a3b8; font-size: 12px; text-align: left; cursor: pointer; border-radius: 3px; margin-bottom: 1px; }
.ts-tool-btn:hover { background: #1e293b; color: #e2e8f0; }
.ts-tool-btn--active { background: #1e3a5f; color: #f8fafc; }
</style>
