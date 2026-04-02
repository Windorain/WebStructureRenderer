<script setup lang="ts">
/**
 * 异步拉取预览配置后挂载 AppShell（bundle 经 /preview-api）。
 */
import { onMounted, ref } from 'vue'

import AppShell from '@/AppShell.vue'
import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { resolveAppPreviewConfigAsync } from '@/preview/previewConfig'

const mergedConfig = ref<AppPreviewConfig | null>(null)
const loadError = ref<string | null>(null)

onMounted(async () => {
  try {
    mergedConfig.value = await resolveAppPreviewConfigAsync()
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e)
    console.error('[WikiMultiStructureRender] resolveAppPreviewConfigAsync', e)
  }
})
</script>

<template>
  <div v-if="loadError" class="wm-boot wm-boot--err">
    {{ loadError }}
  </div>
  <AppShell v-else-if="mergedConfig" :merged-config="mergedConfig" />
  <div v-else class="wm-boot">
    加载预览配置…
  </div>
</template>

<style scoped>
.wm-boot {
  padding: 16px;
  font-family: system-ui, sans-serif;
  color: #e2e8f0;
  background: #0f172a;
  min-height: 40vh;
}
.wm-boot--err {
  color: #fecaca;
  white-space: pre-wrap;
}
</style>
