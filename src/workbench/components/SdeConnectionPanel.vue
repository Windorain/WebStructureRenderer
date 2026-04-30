<script setup lang="ts">
import { computed } from 'vue'

import { useWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = useWorkbenchContext()

const connectionOk = computed(() => ctx.connectionOk.value)
const connectionMessageText = computed(() => ctx.connectionMessage.value)
const showConnectionHint = computed(() => ctx.connectionOk.value !== null)

async function onConnect(): Promise<void> {
  await ctx.testConnection()
  if (ctx.connectionOk.value && ctx.apiBase.value) {
    await ctx.refreshExportList()
    await ctx.loadWorkspaceFromServer()
  }
}
</script>

<template>
  <section class="dash-card">
    <h2 class="dash-card__title">连接 SDE Web</h2>
    <p class="dash-card__desc">填写游戏内 <code class="dash-code">/sde web</code> 打印的地址与 Token，与 <code class="dash-code">structure_exports</code> 目录同步。</p>
    <label class="dash-field">
      <span class="dash-field__label">API 基址</span>
      <input v-model="ctx.apiBase" class="dash-input" type="text" autocomplete="off" placeholder="http://127.0.0.1:37564" />
    </label>
    <label class="dash-field">
      <span class="dash-field__label">Token</span>
      <input v-model="ctx.token" class="dash-input" type="password" autocomplete="off" placeholder="Bearer" />
    </label>
    <div class="dash-row">
      <button type="button" class="dash-btn dash-btn--primary" @click="onConnect">连接并刷新</button>
      <span
        v-if="showConnectionHint"
        class="dash-hint"
        :class="{ 'dash-hint--ok': connectionOk, 'dash-hint--err': connectionOk === false }"
      >
        {{ connectionMessageText }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.dash-card {
  padding: 16px;
  border: 1px solid var(--nei-border);
  border-radius: 10px;
  background: var(--nei-bg-deep);
  margin-bottom: 14px;
}
.dash-card__title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--nei-text);
}
.dash-card__desc {
  margin: 0 0 14px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--nei-label);
}
.dash-code {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--nei-bg);
  color: var(--nei-text-dark);
}
.dash-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.dash-field__label {
  font-size: 11px;
  color: var(--nei-label);
}
.dash-input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--nei-panel-hover);
  background: var(--nei-bg);
  color: var(--nei-text-dark);
  font-size: 13px;
}
.dash-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.dash-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--nei-muted);
  background: var(--nei-border);
  color: var(--nei-text);
  cursor: pointer;
  font-size: 13px;
}
.dash-btn--primary {
  background: var(--nei-accent);
  border-color: #1d4ed8;
}
.dash-btn:hover {
  filter: brightness(1.06);
}
.dash-hint {
  font-size: 12px;
  color: var(--nei-label);
}
.dash-hint--ok {
  color: #86efac;
}
.dash-hint--err {
  color: #fecaca;
}
</style>
