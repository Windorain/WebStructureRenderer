<script setup lang="ts">
/**
 * World 多帧：播放/暂停。状态来自 PreviewSceneContext（由 AppShell 提供 store）。
 */
import { computed, inject } from 'vue'

import { PreviewSceneContextKey } from '@/preview/sceneStore'

const store = inject(PreviewSceneContextKey)

const visible = computed(() => store?.hasWorldMultiFrame.value ?? false)
const playing = computed(() => store?.framesPlaybackIsPlaying.value ?? false)

function onToggle(): void {
  store?.toggleWorldFramesPlayback()
}
</script>

<template>
  <div v-if="visible" class="wm-wfp-controls">
    <button
      type="button"
      class="wm-wfp-btn"
      :title="playing ? '暂停多帧轮播' : '播放 World.frames 多帧'"
      :aria-pressed="playing"
      @click="onToggle"
    >
      {{ playing ? '⏸' : '▶' }}
    </button>
  </div>
</template>

<style scoped>
.wm-wfp-controls {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.wm-wfp-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: var(--nei-text);
  text-shadow: var(--nei-label-shadow);
  background: var(--nei-bg);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}
.wm-wfp-btn:hover {
  filter: brightness(1.06);
}
.wm-wfp-btn:active {
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  padding-top: 1px;
  padding-left: 1px;
}
.wm-wfp-btn:focus-visible {
  outline: 2px solid var(--nei-focus-ring);
  outline-offset: 2px;
}
</style>
