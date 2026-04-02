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

<!-- 样式见 @/styles/nei-tokens.css（Teleport 到 body，需全局类） -->
