<script setup lang="ts">
/**
 * 底栏状态条：模型信息 + 帧信息 + 渲染状态
 */
import { inject } from 'vue'
import { PreviewSceneContextKey, type PreviewSceneStore } from '@/preview/sceneStore'

const store = inject<PreviewSceneStore | null>(PreviewSceneContextKey, null)
</script>

<template>
  <div class="sb-root">
    <span v-if="store?.statusMessage.value" class="sb-item">{{ store.statusMessage.value }}</span>
    <span class="sb-spacer" />
    <span v-if="store?.hasWorldMultiFrame.value" class="sb-item">
      Frame {{ store.worldFrameIndex.value + 1 }} / {{ store.worldFrameCount.value }}
    </span>
  </div>
</template>

<style scoped>
.sb-root {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  color: var(--nei-muted);
}
.sb-item { white-space: nowrap; }
.sb-spacer { flex: 1; }
</style>
