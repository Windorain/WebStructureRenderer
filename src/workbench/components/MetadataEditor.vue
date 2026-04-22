<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { mergeRootStringFields } from '@/workbench/sceneExportKit'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const hasDocument = computed(() => ctx.document.value != null)
const hasApiBase = computed(() => ctx.apiBase.value.length > 0)
const isDirty = computed(() => ctx.dirty.value)
const showSdePatch = computed(() => ctx.workspaceMode.value === 'sde' && hasApiBase.value)
const showSaveToFile = computed(() => {
  const m = ctx.workspaceMode.value
  return m === 'local-file' || m === 'local-bundle'
})

const id = ref('')
const label = ref('')
const author = ref('')
const mode = ref('')
const gtnhVersion = ref('')
const structureId = ref('')
/** 保存结果：编辑页不展示 connectionMessage（其在设置抽屉内），此处单独提示 */
const saveFeedback = ref('')

/** 表单项与当前 document 根级元数据是否一致（空输入表示根上无该键） */
const formNotCommitted = computed(() => {
  const d = ctx.document.value
  if (!d) return false
  const g = (k: string) =>
    Object.prototype.hasOwnProperty.call(d, k) && d[k] != null ? String(d[k]) : ''
  return (
    id.value !== g('id') ||
    label.value !== g('label') ||
    author.value !== g('author') ||
    mode.value !== g('mode') ||
    gtnhVersion.value !== g('gtnhVersion') ||
    structureId.value !== g('structureId')
  )
})

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

/** 将表单合入 `document`；成功返回 true 并标脏。 */
function syncFormToDocument(): boolean {
  saveFeedback.value = ''
  if (!ctx.document.value) {
    saveFeedback.value = '无文档'
    return false
  }
  try {
    ctx.document.value = mergeRootStringFields(ctx.document.value, {
      id: id.value,
      label: label.value,
      author: author.value,
      mode: mode.value,
      gtnhVersion: gtnhVersion.value,
      structureId: structureId.value,
    }) as Record<string, unknown>
    ctx.dirty.value = true
    return true
  } catch (e) {
    saveFeedback.value = e instanceof Error ? e.message : String(e)
    return false
  }
}

function commitAndOpenPreview(): void {
  if (!syncFormToDocument()) return
  void ctx.refreshPreview()
  ctx.setMainSection('preview')
}

async function saveToFile(): Promise<void> {
  if (!ctx.document.value) {
    saveFeedback.value = '无文档可保存'
    return
  }
  if (!syncFormToDocument()) return
  saveFeedback.value = '正在保存…'
  try {
    await ctx.saveDocumentToDisk()
    saveFeedback.value = ctx.connectionMessage.value.trim() || '已完成'
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    ctx.connectionMessage.value = msg
    saveFeedback.value = msg
  }
}

/** 全量 PUT 当前内存文档，与合入后根字段（含删键）一致 */
async function saveToSde(): Promise<void> {
  if (!ctx.apiBase.value) return
  if (!syncFormToDocument()) return
  try {
    await ctx.saveWorkspaceFull()
    saveFeedback.value = '已保存到 SDE 工作区'
    ctx.connectionMessage.value = saveFeedback.value
    ctx.setMainSection('preview')
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    ctx.connectionMessage.value = msg
    saveFeedback.value = msg
  }
}
</script>

<template>
  <section class="wm-panel">
    <h2 class="wm-panel__title">元数据</h2>
    <p v-if="!hasDocument" class="wm-muted">无文档</p>
    <template v-else>
      <p class="wm-lead">保存到本机或 SDE 前，会先把上表合入当前内存中的 JSON；「合入并预览」只更新内存与 3D 预览。</p>
      <p v-if="formNotCommitted" class="wm-form-warn">
        上表与内存文档根字段未对齐。若用左侧切到「预览」而未先合入，3D 可能仍是旧元数据；「保存到本机/SDE」会先自动合入。
      </p>
      <div class="wm-grid">
        <label class="wm-field">
          <span class="wm-field__label">label</span>
          <input v-model="label" class="wm-input" type="text" placeholder="顶栏与 Wiki 展示名" />
        </label>
        <label class="wm-field">
          <span class="wm-field__label">id</span>
          <input v-model="id" class="wm-input" type="text" />
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
      <div class="wm-row" role="group" aria-label="合入与保存">
        <button type="button" class="wm-btn wm-btn--primary" @click="commitAndOpenPreview">合入并预览</button>
        <button v-if="showSaveToFile" type="button" class="wm-btn" @click="saveToFile">保存到本机</button>
        <button v-if="showSdePatch" type="button" class="wm-btn" @click="saveToSde">保存到 SDE</button>
      </div>
      <p v-if="saveFeedback" class="wm-save-feedback">{{ saveFeedback }}</p>
      <p v-if="isDirty" class="wm-dirty">文档有未写入磁盘/远程的变更</p>
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
.wm-lead {
  margin: 0 0 10px;
  font-size: 11px;
  line-height: 1.5;
  color: #94a3b8;
}
.wm-form-warn {
  margin: 0 0 10px;
  font-size: 11px;
  line-height: 1.45;
  color: #fbbf24;
}
.wm-dirty {
  margin: 8px 0 0;
  font-size: 11px;
  color: #fcd34d;
}
.wm-save-feedback {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: #a5b4fc;
  white-space: pre-wrap;
}
</style>
