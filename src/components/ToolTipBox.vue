<script setup lang="ts">
defineProps<{
  text: string
  clientX: number
  clientY: number
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="wm-tooltip-box"
      role="tooltip"
      :style="{
        left: `${clientX + 12}px`,
        top: `${clientY + 12}px`,
      }"
    >
      <pre class="wm-tooltip-pre">{{ text }}</pre>
    </div>
  </Teleport>
</template>

<style scoped>
.wm-tooltip-box {
  position: fixed;
  z-index: 2147483646;
  max-width: min(320px, 90vw);
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.45;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}
.wm-tooltip-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
