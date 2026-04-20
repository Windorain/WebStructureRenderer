<script setup lang="ts">
import { computed } from 'vue'

import type { WorkbenchMainSection } from '@/workbench/workbenchContext'
import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const section = computed(() => ctx.mainSection.value)

function select(s: WorkbenchMainSection): void {
  ctx.setMainSection(s)
}
</script>

<template>
  <aside class="dash-side">
    <div class="dash-side__brand">
      <span class="dash-side__logo">SDE</span>
      <div class="dash-side__titles">
        <div class="dash-side__title">Structure Workbench</div>
        <div class="dash-side__sub">场景工作台</div>
      </div>
    </div>

    <nav class="dash-side__nav" aria-label="主功能">
      <button
        type="button"
        class="dash-nav-item"
        :class="{ 'dash-nav-item--active': section === 'preview' }"
        @click="select('preview')"
      >
        <span class="dash-nav-item__icon" aria-hidden="true">◉</span>
        <span class="dash-nav-item__text">
          <span class="dash-nav-item__label">预览</span>
          <span class="dash-nav-item__hint">三维场景与校验状态</span>
        </span>
      </button>

      <button
        type="button"
        class="dash-nav-item"
        :class="{ 'dash-nav-item--active': section === 'edit' }"
        @click="select('edit')"
      >
        <span class="dash-nav-item__icon" aria-hidden="true">✎</span>
        <span class="dash-nav-item__text">
          <span class="dash-nav-item__label">编辑</span>
          <span class="dash-nav-item__hint">元数据与根字段</span>
        </span>
      </button>

      <button
        type="button"
        class="dash-nav-item"
        :class="{ 'dash-nav-item--active': section === 'export' }"
        @click="select('export')"
      >
        <span class="dash-nav-item__icon" aria-hidden="true">↓</span>
        <span class="dash-nav-item__text">
          <span class="dash-nav-item__label">导出</span>
          <span class="dash-nav-item__hint">下载、Compact、同步 SDE</span>
        </span>
      </button>
    </nav>

    <p class="dash-side__foot">数据源与 SDE 连接请使用右上角「设置」。</p>
  </aside>
</template>

<style scoped>
.dash-side {
  width: 248px;
  flex-shrink: 0;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px 14px;
  background: linear-gradient(180deg, #0b1220 0%, #0f172a 40%);
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
}
.dash-side__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 0 4px;
}
.dash-side__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #f8fafc;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.02em;
}
.dash-side__title {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.2;
}
.dash-side__sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}
.dash-side__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.dash-nav-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 12px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.dash-nav-item:hover {
  background: #1e293b;
  border-color: #334155;
}
.dash-nav-item--active {
  background: #1e3a5f;
  border-color: #3b82f6;
  color: #f1f5f9;
}
.dash-nav-item__icon {
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.85;
  flex-shrink: 0;
  width: 1.25rem;
  text-align: center;
}
.dash-nav-item__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dash-nav-item__label {
  font-size: 13px;
  font-weight: 600;
}
.dash-nav-item__hint {
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}
.dash-nav-item--active .dash-nav-item__hint {
  color: #94a3b8;
}
.dash-side__foot {
  margin: 16px 4px 0;
  font-size: 10px;
  line-height: 1.45;
  color: #475569;
}
</style>
