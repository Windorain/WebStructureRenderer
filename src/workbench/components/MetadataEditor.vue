<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const hasDocument = computed(() => ctx.document.value != null)
const hasApiBase = computed(() => ctx.apiBase.value.length > 0)
const isDirty = computed(() => ctx.dirty.value)
const showSdePatch = computed(() => ctx.workspaceMode.value === 'sde' && hasApiBase.value)

const id = ref('')
const label = ref('')
const author = ref('')
const mode = ref('')
const gtnhVersion = ref('')
const structureId = ref('')

watch(
  () => ctx.document.value,
  (d) => {
    if (!d) {
      id.value = ''
      label.value = ''
      author.value = ''
      mode.value = ''
      gtnhVersion.value = ''
      structureId.value = ''
      return
    }
    id.value = d.id != null ? String(d.id) : ''
    label.value = d.label != null ? String(d.label) : ''
    author.value = d.author != null ? String(d.author) : ''
    mode.value = d.mode != null ? String(d.mode) : ''
    gtnhVersion.value = d.gtnhVersion != null ? String(d.gtnhVersion) : ''
    structureId.value = d.structureId != null ? String(d.structureId) : ''
  },
  { immediate: true, deep: true },
)

function applyLocal(): void {
  const patch: Record<string, unknown> = {}
  if (id.value !== '') patch.id = id.value
  if (label.value !== '') patch.label = label.value
  if (author.value !== '') patch.author = author.value
  if (mode.value !== '') patch.mode = mode.value
  if (gtnhVersion.value !== '') patch.gtnhVersion = gtnhVersion.value
  if (structureId.value !== '') patch.structureId = structureId.value
  ctx.applyMetadataPatch(patch)
}

async function applyServerPatch(): Promise<void> {
  if (!ctx.apiBase.value) return
  try {
    const patch: Record<string, unknown> = {}
    if (id.value !== '') patch.id = id.value
    if (label.value !== '') patch.label = label.value
    if (author.value !== '') patch.author = author.value
    if (mode.value !== '') patch.mode = mode.value
    if (gtnhVersion.value !== '') patch.gtnhVersion = gtnhVersion.value
    if (structureId.value !== '') patch.structureId = structureId.value
    await ctx.saveWorkspaceMetadataPatch(patch)
    ctx.connectionMessage.value = '已 PATCH 元数据'
  } catch (e) {
    ctx.connectionMessage.value = e instanceof Error ? e.message : String(e)
  }
}
</script>

<template>
  <section class="wm-panel">
    <h2 class="wm-panel__title">元数据</h2>
    <p v-if="!hasDocument" class="wm-muted">无文档</p>
    <template v-else>
      <div class="wm-grid">
        <label class="wm-field">
          <span class="wm-field__label">id</span>
          <input v-model="id" class="wm-input" type="text" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">label</span>
          <input v-model="label" class="wm-input" type="text" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">author</span>
          <input v-model="author" class="wm-input" type="text" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">mode</span>
          <input v-model="mode" class="wm-input" type="text" placeholder="multiblock | simple" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">gtnhVersion</span>
          <input v-model="gtnhVersion" class="wm-input" type="text" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">structureId</span>
          <input v-model="structureId" class="wm-input" type="text" />
        </label>
      </div>
      <div class="wm-row">
        <button type="button" class="wm-btn wm-btn--primary" @click="applyLocal">应用到预览</button>
        <button v-if="showSdePatch" type="button" class="wm-btn" @click="applyServerPatch">PATCH 到 SDE</button>
      </div>
      <p v-if="isDirty" class="wm-dirty">有未保存的本地修改</p>
    </template>
  </section>
</template>

<style scoped>
.wm-panel {
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
  margin-bottom: 12px;
}
.wm-panel__title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}
.wm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 900px) {
  .wm-grid {
    grid-template-columns: 1fr;
  }
}
.wm-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.wm-field__label {
  font-size: 11px;
  color: #94a3b8;
}
.wm-input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
}
.wm-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.wm-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
  font-size: 12px;
}
.wm-btn--primary {
  background: #2563eb;
  border-color: #1d4ed8;
}
.wm-muted {
  font-size: 12px;
  color: #64748b;
}
.wm-dirty {
  margin: 8px 0 0;
  font-size: 11px;
  color: #fcd34d;
}
</style>
