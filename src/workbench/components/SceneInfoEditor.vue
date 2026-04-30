<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { readSceneMetaField } from '@/render/data/compactSceneDocument'
import { mergeRootStringFields } from '@/workbench/sceneExportKit'
import { useWorkbenchContext, type WorkbenchScene } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const hasScene = computed(() => ctx.scene.value != null)
const showSaveToFile = computed(() => {
  const m = ctx.workspaceMode.value
  return m === 'local-file' || m === 'local-bundle'
})
const showSdePatch = computed(() => ctx.workspaceMode.value === 'sde' && ctx.apiBase.value.length > 0)

const id = ref('')
const label = ref('')
const author = ref('')
const mode = ref('')
const gtnhVersion = ref('')
const structureId = ref('')
const saveFeedback = ref('')

const pendingFields = computed(() => {
  const d = ctx.scene.value
  const g = (k: string) => (d ? readSceneMetaField(d, k) : '')
  return {
    label: label.value !== g('label'), id: id.value !== g('id'),
    author: author.value !== g('author'), mode: mode.value !== g('mode'),
    gtnhVersion: gtnhVersion.value !== g('gtnhVersion'), structureId: structureId.value !== g('structureId'),
  }
})

watch(
  () => ctx.scene.value,
  (d) => {
    id.value = d ? readSceneMetaField(d, 'id') : ''
    label.value = d ? readSceneMetaField(d, 'label') : ''
    author.value = d ? readSceneMetaField(d, 'author') : ''
    mode.value = d ? readSceneMetaField(d, 'mode') : ''
    gtnhVersion.value = d ? readSceneMetaField(d, 'gtnhVersion') : ''
    structureId.value = d ? readSceneMetaField(d, 'structureId') : ''
  },
  { immediate: true },
)

function syncFormToScene(): boolean {
  saveFeedback.value = ''
  if (!ctx.scene.value) { saveFeedback.value = '无场景'; return false }
  try {
    ctx.scene.value = mergeRootStringFields(ctx.scene.value, {
      id: id.value, label: label.value, author: author.value,
      mode: mode.value, gtnhVersion: gtnhVersion.value, structureId: structureId.value,
    }) as WorkbenchScene
    ctx.dirty.value = true
    return true
  } catch (e) {
    saveFeedback.value = e instanceof Error ? e.message : String(e)
    return false
  }
}

async function commitAndOpenPreview(): Promise<void> {
  if (!syncFormToScene()) return
  await ctx.syncPreview()
}

async function saveToFile(): Promise<void> {
  if (!ctx.scene.value) { saveFeedback.value = '无场景可保存'; return }
  if (!syncFormToScene()) return
  saveFeedback.value = '正在保存…'
  try {
    await ctx.writeSceneToLocalDisk()
    saveFeedback.value = ctx.connectionMessage.value.trim() || '已完成'
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    ctx.connectionMessage.value = msg
    saveFeedback.value = msg
  }
}

async function saveToSde(): Promise<void> {
  if (!ctx.apiBase.value) return
  if (!syncFormToScene()) return
  saveFeedback.value = '正在保存到 SDE 工作区…'
  try {
    await ctx.saveWorkspaceFull()
    saveFeedback.value = '已保存到 SDE 工作区'
    ctx.connectionMessage.value = saveFeedback.value
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    ctx.connectionMessage.value = msg
    saveFeedback.value = msg
  }
}
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">Scene Info</div>
    <p v-if="!hasScene" class="pe-muted">无场景数据</p>
    <template v-else>
      <div class="se-grid">
        <label class="se-field" v-for="f in [
          { key: 'label', v: label, ph: '场景标题' },
          { key: 'id', v: id, ph: '场景 ID' },
          { key: 'author', v: author, ph: '作者' },
          { key: 'gtnhVersion', v: gtnhVersion, ph: '版本号' },
          { key: 'structureId', v: structureId, ph: '结构注册名' },
        ]" :key="f.key">
          <span :class="{ 'se-dirty': pendingFields[f.key as keyof typeof pendingFields] }">{{ f.key }}</span>
          <input v-model="f.v" :placeholder="f.ph" type="text" autocomplete="off" />
        </label>
        <label class="se-field">
          <span :class="{ 'se-dirty': pendingFields.mode }">mode</span>
          <select v-model="mode">
            <option value="">(unset)</option>
            <option value="multiblock">multiblock</option>
            <option value="simple">simple</option>
          </select>
        </label>
      </div>

      <div class="se-row">
        <button class="pe-btn pe-btn--primary" @click="void commitAndOpenPreview()">同步预览</button>
        <button v-if="showSaveToFile" class="pe-btn" @click="void saveToFile()">保存到文件</button>
        <button v-if="showSdePatch" class="pe-btn" @click="void saveToSde()">同步到 SDE</button>
      </div>
      <p v-if="saveFeedback" class="pe-feedback">{{ saveFeedback }}</p>
    </template>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: #64748b; }
.se-grid { display: flex; flex-direction: column; gap: 6px; }
.se-field { display: flex; flex-direction: column; gap: 3px; }
.se-field span { font-size: 10px; color: #94a3b8; }
.se-field span.se-dirty { color: #f59e0b; }
.se-field input, .se-field select {
  padding: 4px 6px; border-radius: 4px; border: 1px solid #334155;
  background: #0f172a; color: #e2e8f0; font-size: 11px;
}
.se-row { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.pe-btn {
  padding: 4px 10px; border-radius: 4px; border: 1px solid #475569;
  background: #334155; color: #f8fafc; cursor: pointer; font-size: 11px;
}
.pe-btn--primary { background: #2563eb; border-color: #1d4ed8; }
.pe-feedback { margin: 6px 0 0; font-size: 11px; color: #a5b4fc; }
</style>
