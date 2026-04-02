<script setup lang="ts">
/**
 * 嵌入根：显式 bootstrap → AppPreviewConfig → AppShell。
 */
import { ref, watch } from 'vue'

import AppShell from '@/AppShell.vue'
import type { AppPreviewConfig } from '@/preview/appPreviewConfig'
import { resolveBootstrapToAppConfig } from '@/embed/resolveBootstrapToAppConfig'
import { formatUnknownError } from '@/util/formatUnknownError'
import type { WikiRendererBootstrapOptions } from '@/embed/wikiRendererContract'

const props = defineProps<{
  bootstrap: WikiRendererBootstrapOptions
}>()

const mergedConfig = ref<AppPreviewConfig | null>(null)
const loadError = ref<string | null>(null)

async function load() {
  loadError.value = null
  mergedConfig.value = null
  try {
    mergedConfig.value = await resolveBootstrapToAppConfig(props.bootstrap)
  } catch (e) {
    loadError.value = formatUnknownError(e)
    console.error('[WikiMultiStructureRender] resolveBootstrapToAppConfig', e)
  }
}

watch(
  () => props.bootstrap,
  () => {
    void load()
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div v-if="loadError" class="wm-boot wm-boot--err">
    {{ loadError }}
  </div>
  <AppShell v-else-if="mergedConfig" :merged-config="mergedConfig" />
  <div v-else class="wm-boot">
    加载中…
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
