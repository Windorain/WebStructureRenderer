<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { readSceneMetaField } from '@/render/data/compactSceneDocument'
import { mergeRootStringFields } from '@/workbench/sceneExportKit'
import { useWorkbenchContext, type WorkbenchScene } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const hasScene = computed(() => ctx.scene.value != null)
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

/** 各字段当前输入是否与已合入 `scene` 的根字段一致（空输入 ↔ 根上无该键） */
const pendingFields = computed(() => {
  const d = ctx.scene.value
  const g = (k: string) => (d ? readSceneMetaField(d, k) : '')
  return {
    label: label.value !== g('label'),
    id: id.value !== g('id'),
    author: author.value !== g('author'),
    mode: mode.value !== g('mode'),
    gtnhVersion: gtnhVersion.value !== g('gtnhVersion'),
    structureId: structureId.value !== g('structureId'),
  }
})

const formNotCommitted = computed(() => {
  const p = pendingFields.value
  return p.label || p.id || p.author || p.mode || p.gtnhVersion || p.structureId
})

watch(
  () => ctx.scene.value,
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
    id.value = readSceneMetaField(d, 'id')
    label.value = readSceneMetaField(d, 'label')
    author.value = readSceneMetaField(d, 'author')
    mode.value = readSceneMetaField(d, 'mode')
    gtnhVersion.value = readSceneMetaField(d, 'gtnhVersion')
    structureId.value = readSceneMetaField(d, 'structureId')
  },
  { immediate: true },
)

/** 将表单合入 `scene`；成功返回 true 并标脏。 */
function syncFormToScene(): boolean {
  saveFeedback.value = ''
  if (!ctx.scene.value) {
    saveFeedback.value = '无场景'
    return false
  }
  try {
    ctx.scene.value = mergeRootStringFields(ctx.scene.value, {
      id: id.value,
      label: label.value,
      author: author.value,
      mode: mode.value,
      gtnhVersion: gtnhVersion.value,
      structureId: structureId.value,
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
  ctx.setMainSection('preview')
}

async function saveToFile(): Promise<void> {
  if (!ctx.scene.value) {
    saveFeedback.value = '无场景可保存'
    return
  }
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

/** 全量 PUT 当前内存文档，与合入后根字段（含删键）一致 */
async function saveToSde(): Promise<void> {
  if (!ctx.apiBase.value) return
  if (!syncFormToScene()) return
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
    <p v-if="!hasScene" class="wm-muted">无场景</p>
    <template v-else>
      <p class="wm-lead">
        字段初值来自当前内存（Raw 根或 Compact 的 meta）。琥珀色边框表示该字段已改、尚未通过「合入并预览」或保存写回内存。
      </p>
      <p v-if="formNotCommitted" class="wm-form-warn">
        上表与内存文档根字段未对齐。若用左侧切到「预览」而未先合入，3D 可能仍是旧元数据；「保存到本机/SDE」会先自动合入。
      </p>
      <div class="wm-grid">
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.label }">
          <span class="wm-field__label">label</span>
          <input
            v-model="label"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.label }"
            type="text"
            autocomplete="off"
            placeholder="顶栏与 Wiki 展示名"
            :aria-invalid="pendingFields.label"
          />
        </label>
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.id }">
          <span class="wm-field__label">id</span>
          <input
            v-model="id"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.id }"
            type="text"
            autocomplete="off"
            :aria-invalid="pendingFields.id"
          />
        </label>
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.author }">
          <span class="wm-field__label">author</span>
          <input
            v-model="author"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.author }"
            type="text"
            autocomplete="off"
            :aria-invalid="pendingFields.author"
          />
        </label>
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.mode }">
          <span class="wm-field__label">mode</span>
          <input
            v-model="mode"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.mode }"
            type="text"
            autocomplete="off"
            placeholder="multiblock | simple"
            :aria-invalid="pendingFields.mode"
          />
        </label>
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.gtnhVersion }">
          <span class="wm-field__label">gtnhVersion</span>
          <input
            v-model="gtnhVersion"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.gtnhVersion }"
            type="text"
            autocomplete="off"
            :aria-invalid="pendingFields.gtnhVersion"
          />
        </label>
        <label class="wm-field" :class="{ 'wm-field--pending': pendingFields.structureId }">
          <span class="wm-field__label">structureId</span>
          <input
            v-model="structureId"
            class="wm-input"
            :class="{ 'wm-input--pending': pendingFields.structureId }"
            type="text"
            autocomplete="off"
            :aria-invalid="pendingFields.structureId"
          />
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
.wm-field--pending .wm-field__label {
  color: #fbbf24;
}
.wm-input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.wm-input--pending {
  border-color: #d97706;
  box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.45);
}
.wm-input--pending:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
  outline: none;
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
