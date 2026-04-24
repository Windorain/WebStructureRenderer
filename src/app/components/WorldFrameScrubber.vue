<script setup lang="ts">
/**
 * World 多帧时间轴：类视频进度条。拖动/键盘时调用 store.setCurrentWorldFrame，并在交互开始时暂停轮播。
 */
import { computed, inject } from 'vue'

import { PreviewSceneContextKey } from '@/preview/sceneStore'

const store = inject(PreviewSceneContextKey)

const visible = computed(() => store?.hasWorldMultiFrame.value ?? false)
const frameIndex = computed(() => store?.worldFrameIndex.value ?? 0)
const frameCount = computed(() => store?.worldFrameCount.value ?? 0)
const isPlaying = computed(() => store?.framesPlaybackIsPlaying.value ?? false)
const meshBusy = computed(() => store?.meshBusy.value ?? false)

const maxIdx = computed(() => Math.max(0, frameCount.value - 1))
const fillPct = computed(() => {
  if (frameCount.value <= 1) {
    return 0
  }
  return (frameIndex.value / maxIdx.value) * 100
})

function pauseIfPlaying(): void {
  if (isPlaying.value) {
    store?.toggleWorldFramesPlayback()
  }
}

function onRangeInput(e: Event): void {
  const t = e.target as HTMLInputElement
  pauseIfPlaying()
  void store?.setCurrentWorldFrame(Number(t.value))
}

function onRangePointerDown(): void {
  pauseIfPlaying()
}
</script>

<template>
  <div v-if="visible" class="wm-wfs" :class="{ 'wm-wfs--busy': meshBusy }">
    <div class="wm-wfs__slider">
      <div class="wm-wfs__track" />
      <div class="wm-wfs__fill" :style="{ width: `${fillPct}%` }" />
      <input
        class="wm-wfs__range"
        type="range"
        :min="0"
        :max="maxIdx"
        :value="frameIndex"
        :disabled="meshBusy"
        :aria-label="`当前帧，共 ${frameCount} 帧`"
        :aria-valuetext="`帧 ${frameIndex + 1}，共 ${frameCount} 帧`"
        :aria-valuemin="0"
        :aria-valuemax="maxIdx"
        :aria-valuenow="frameIndex"
        @pointerdown="onRangePointerDown"
        @input="onRangeInput"
      />
    </div>
    <span class="wm-wfs__label" aria-hidden="true">{{ frameIndex + 1 }} / {{ frameCount }}</span>
  </div>
</template>

<style scoped>
.wm-wfs {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 10px;
  user-select: none;
}
.wm-wfs--busy {
  opacity: 0.65;
  pointer-events: none;
}
.wm-wfs__slider {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 28px;
  display: flex;
  align-items: center;
}
.wm-wfs__track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 8px;
  margin-top: -4px;
  background: var(--nei-inset-bg, #0f172a);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  box-sizing: border-box;
  pointer-events: none;
}
.wm-wfs__fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 6px;
  margin-top: -3px;
  margin-left: 2px;
  max-width: calc(100% - 4px);
  background: #2563eb;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  pointer-events: none;
  box-sizing: border-box;
  z-index: 1;
}
.wm-wfs__range {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 28px;
  margin: 0;
  background: none;
  cursor: pointer;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
}
.wm-wfs__range:disabled {
  cursor: not-allowed;
}
.wm-wfs__range:focus-visible {
  outline: 2px solid var(--nei-focus-ring);
  outline-offset: 2px;
}
/* WebKit thumb：与扁平条协调 */
.wm-wfs__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 16px;
  border-radius: 0;
  background: var(--nei-bg);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  box-shadow: none;
}
.wm-wfs__range::-webkit-slider-runnable-track {
  height: 0;
  background: transparent;
}
.wm-wfs__range::-moz-range-thumb {
  width: 12px;
  height: 16px;
  border-radius: 0;
  background: var(--nei-bg);
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  box-shadow: none;
}
.wm-wfs__range::-moz-range-track {
  background: transparent;
  border: none;
  height: 0;
}
.wm-wfs__label {
  flex-shrink: 0;
  font-size: 11px;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: var(--nei-text-muted, #94a3b8);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
  min-width: 4.5em;
  text-align: right;
}
</style>
