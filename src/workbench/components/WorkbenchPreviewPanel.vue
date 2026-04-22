<script setup lang="ts">
import { computed } from 'vue'

import AppShell from '@/app/AppShell.vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const previewBusy = computed(() => ctx.previewBusy.value)
const previewErrorText = computed(() => ctx.previewError.value)
const previewCfg = computed(() => ctx.previewConfig.value)

/** 顶栏标题与元数据编辑一致：用 JSON 根上 label，其次 id（World 时与帧内 structure 的占位 id 脱钩） */
const titleFromDocumentRoot = computed((): string | null => {
  const d = ctx.document.value
  if (!d || typeof d !== 'object') return null
  const o = d as Record<string, unknown>
  const lab = typeof o.label === 'string' ? o.label.trim() : ''
  if (lab) return lab
  const id = typeof o.id === 'string' ? o.id.trim() : ''
  if (id) return id
  return null
})

async function onRetryPreview(): Promise<void> {
  await ctx.refreshPreview()
}
</script>

<template>
  <section class="wm-preview">
    <div v-if="previewBusy" class="wm-boot">构建预览…</div>
    <div v-else-if="previewErrorText" class="wm-boot wm-boot--err">
      <p>{{ previewErrorText }}</p>
      <button type="button" class="wm-btn" @click="onRetryPreview">重试预览</button>
    </div>
    <AppShell
      v-else-if="previewCfg"
      :merged-config="previewCfg"
      :title-override="titleFromDocumentRoot"
    />
    <div v-else class="wm-boot wm-boot--muted">
      请先在右上角「设置」中选择数据源并加载文档（须 geometryPhase=baked 且含 textureBlobs 方可预览）。
    </div>
  </section>
</template>

<style scoped>
.wm-preview {
  min-height: 60vh;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #334155;
  overflow: hidden;
}
.wm-boot {
  padding: 16px;
  font-family: system-ui, sans-serif;
  color: #e2e8f0;
}
.wm-boot--err {
  color: #fecaca;
  white-space: pre-wrap;
}
.wm-boot--muted {
  color: #94a3b8;
}
.wm-btn {
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #64748b;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
  font-size: 13px;
}
</style>
