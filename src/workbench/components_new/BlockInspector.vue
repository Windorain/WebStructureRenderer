<script setup lang="ts">
/**
 * 方块检查器：编辑模式下选中方块后显示。
 * Tooltip 编辑 + Markdown 实时预览。
 */
defineProps<{
  editMode: boolean
  selectedBlock: { blockId: string; voxel?: { column: number; row: number; zSlice: number } } | null
}>()
</script>
<template>
  <div class="pe-panel">
    <div class="pe-title">Block Inspector</div>
    <template v-if="!editMode || !selectedBlock">
      <p class="pe-muted">进入编辑模式并点击方块以查看</p>
    </template>
    <template v-else>
      <div class="bi-field">
        <span class="bi-label">Block</span>
        <span class="bi-value">{{ selectedBlock.blockId }}</span>
      </div>
      <div v-if="selectedBlock.voxel" class="bi-field">
        <span class="bi-label">Position</span>
        <span class="bi-value">{{ selectedBlock.voxel.column }}, {{ selectedBlock.voxel.row }}, {{ selectedBlock.voxel.zSlice }}</span>
      </div>
      <div class="bi-field">
        <span class="bi-label">Tooltip (Markdown)</span>
        <textarea class="bi-textarea" rows="4" placeholder="**Bold** *italic* `code`" />
      </div>
    </template>
  </div>
</template>
<style scoped>
.pe-panel { padding: 10px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: #64748b; }
.bi-field { margin-bottom: 8px; }
.bi-label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
.bi-value { font-size: 12px; color: #e2e8f0; font-family: ui-monospace, monospace; }
.bi-textarea {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  resize: vertical;
  box-sizing: border-box;
}
</style>
