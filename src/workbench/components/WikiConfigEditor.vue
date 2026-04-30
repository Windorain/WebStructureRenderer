<script setup lang="ts">
import { wikiConfig } from '@/workbench/wikiConfig'
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">Wiki 配置</div>

    <h3>组件开关</h3>
    <div class="wc-grid">
      <label v-for="(_, key) in wikiConfig.features" :key="key" class="wc-check">
        <input type="checkbox" v-model="wikiConfig.features[key]" />
        <span>{{ key }}</span>
      </label>
    </div>

    <h3>视口尺寸</h3>
    <div class="wc-grid">
      <label class="wc-field"><span>宽</span><input v-model.number="wikiConfig.viewWidth" type="number" min="200" max="2000" step="10" /></label>
      <label class="wc-field"><span>高</span><input v-model.number="wikiConfig.viewHeight" type="number" min="150" max="1500" step="10" /></label>
    </div>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
h3 { font-size: 11px; font-weight: 600; color: #94a3b8; margin: 10px 0 4px; text-transform: uppercase; letter-spacing: 0.3px; }
.wc-grid { display: flex; flex-direction: column; gap: 4px; }
.wc-check { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #cbd5e1; cursor: pointer; }
.wc-check input[type="checkbox"] { width: 14px; height: 14px; accent-color: #2563eb; }
.wc-field { display: flex; flex-direction: column; gap: 2px; }
.wc-field span { font-size: 10px; color: #64748b; }
.wc-field input, .wc-field select { padding: 4px 6px; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 11px; }
</style>
