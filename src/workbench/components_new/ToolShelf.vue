<script setup lang="ts">
/**
 * 左侧工具架：编辑模式下显示 Gizmo + 工具列表。
 */

defineProps<{
  editMode: boolean
}>()

defineEmits<{
  (e: 'update:editMode', v: boolean): void
}>()
</script>

<template>
  <div class="ts-root">
    <div class="ts-gizmo">
      <button
        class="ts-gizmo-btn"
        :class="{ 'ts-gizmo-btn--active': !editMode }"
        title="预览模式"
        @click="$emit('update:editMode', false)"
      >▶</button>
      <button
        class="ts-gizmo-btn"
        :class="{ 'ts-gizmo-btn--active': editMode }"
        title="编辑模式"
        @click="$emit('update:editMode', true)"
      >✏</button>
    </div>
    <div v-if="editMode" class="ts-tools">
      <div class="ts-tools-title">Tools</div>
      <button class="ts-tool-btn ts-tool-btn--active">Select</button>
      <button class="ts-tool-btn">Annotation</button>
    </div>
  </div>
</template>

<style scoped>
.ts-root { padding: 6px; }
.ts-gizmo {
  display: flex;
  gap: 2px;
  margin-bottom: 10px;
  padding: 4px;
  background: #1e293b;
  border-radius: 6px;
}
.ts-gizmo-btn {
  flex: 1;
  padding: 6px 0;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}
.ts-gizmo-btn:hover { color: #e2e8f0; }
.ts-gizmo-btn--active {
  background: #2563eb;
  color: #fff;
}
.ts-tools-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 6px;
  padding: 0 4px;
}
.ts-tool-btn {
  display: block;
  width: 100%;
  padding: 5px 8px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 1px;
}
.ts-tool-btn:hover { background: #1e293b; color: #e2e8f0; }
.ts-tool-btn--active { background: #1e3a5f; color: #f8fafc; }
</style>
