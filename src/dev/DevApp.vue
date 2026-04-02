<script setup lang="ts">
/**
 * 本地 Vite 入口：异步拉取 dev 配置后挂载 AppShell（bundle 经 Mock /preview-api）。
 */
import { onMounted, ref } from 'vue'

import AppShell from '@/AppShell.vue'
import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { resolveDevPreviewConfigAsync } from '@/dev/previewBootstrap'
import { formatUnknownError } from '@/util/formatUnknownError'

const mergedConfig = ref<AppPreviewConfig | null>(null)
const loadError = ref<string | null>(null)

onMounted(async () => {
  try {
    mergedConfig.value = await resolveDevPreviewConfigAsync()
  } catch (e) {
    loadError.value = formatUnknownError(e)
    console.error('[WikiMultiStructureRender] resolveDevPreviewConfigAsync', e)
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
