<script setup lang="ts">
/**
 * Wiki 工作台入口：仅用于导出 wiki 专用构建。
 */
import { onErrorCaptured, ref } from 'vue'

import WikiWorkbenchRoot from '@/workbench/WikiWorkbenchRoot.vue'
import { formatUnknownError } from '@/util/formatUnknownError'

const bootError = ref<string | null>(null)

onErrorCaptured((err) => {
  bootError.value = formatUnknownError(err)
  console.error('[StructureRenderer] WikiWorkbenchRoot', err)
  return false
})
</script>

<template>
  <div v-if="bootError" class="wm-boot wm-boot--err">
    {{ bootError }}
  </div>
  <WikiWorkbenchRoot v-else />
</template>

<style scoped>
.wm-boot {
  padding: 16px;
  font-family: system-ui, sans-serif;
  color: var(--nei-text);
  background: var(--nei-viewport-bg);
  min-height: 40vh;
}
.wm-boot--err {
  color: var(--nei-error-text);
  white-space: pre-wrap;
}
</style>
