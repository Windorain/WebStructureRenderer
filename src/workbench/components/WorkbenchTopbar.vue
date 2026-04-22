<script setup lang="ts">
import { computed } from 'vue'

import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const isDirty = computed(() => ctx.dirty.value)
const showApiBadge = computed(() => ctx.workspaceMode.value === 'sde' && ctx.connectionOk.value === true)

const crumbs = computed(() => {
  const out: { label: string; dim?: boolean }[] = [{ label: '工作台' }]
  const sec = ctx.mainSection.value
  out.push({
    label: sec === 'preview' ? '预览' : sec === 'edit' ? '编辑' : '导出',
  })
  const m = ctx.workspaceMode.value
  if (m === 'sde') {
    out.push({ label: 'SDE 远程' })
    const base = ctx.apiBase.value
    if (base) {
      out.push({ label: base.replace(/^https?:\/\//, ''), dim: true })
    }
    const ok = ctx.connectionOk.value
    if (ok === true) {
      out.push({ label: '已连接', dim: true })
    } else if (ok === false) {
      out.push({ label: '未连接', dim: true })
    }
    const name = ctx.selectedExportName.value
    if (name) {
      out.push({ label: name })
    } else if (ctx.scene.value) {
      out.push({ label: '工作区文档' })
    }
  } else if (m === 'local-file') {
    out.push({ label: '本地文件' })
    const fn = ctx.localFileName.value
    out.push({ label: fn ?? '未选择文件', dim: !fn })
  } else {
    out.push({ label: '内置示例' })
    const fn = ctx.localFileName.value
    if (fn) {
      out.push({ label: fn })
    }
  }
  return out
})
</script>

<template>
  <header class="dash-top">
    <nav class="dash-breadcrumb" aria-label="面包屑">
      <template v-for="(c, i) in crumbs" :key="i">
        <span v-if="i > 0" class="dash-breadcrumb__sep" aria-hidden="true">/</span>
        <span class="dash-breadcrumb__item" :class="{ 'dash-breadcrumb__item--dim': c.dim }">{{ c.label }}</span>
      </template>
    </nav>
    <div class="dash-top__meta">
      <span v-if="isDirty" class="dash-badge">未保存</span>
      <span v-if="showApiBadge" class="dash-badge dash-badge--ok">API</span>
      <button type="button" class="dash-settings" @click="ctx.setSettingsOpen(true)">设置</button>
    </div>
  </header>
</template>

<style scoped>
.dash-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
  padding: 0 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}
.dash-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #e2e8f0;
}
.dash-breadcrumb__sep {
  color: #475569;
  user-select: none;
}
.dash-breadcrumb__item {
  font-weight: 500;
}
.dash-breadcrumb__item--dim {
  font-weight: 400;
  color: #94a3b8;
}
.dash-top__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dash-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #422006;
  color: #fdba74;
  border: 1px solid #78350f;
}
.dash-badge--ok {
  background: #052e16;
  color: #86efac;
  border-color: #166534;
}
.dash-settings {
  margin-left: 4px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.dash-settings:hover {
  background: #334155;
  border-color: #475569;
}
</style>
