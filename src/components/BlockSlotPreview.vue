<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { BlockIconCache } from '@/render/blockIconCache'

const props = defineProps<{
  blockId: string
  count: number
  cache: BlockIconCache
}>()

/** 订阅缓存更新，驱动 computed 重算 */
const bump = ref(0)
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = props.cache.subscribe(() => {
    bump.value++
  })
})

onBeforeUnmount(() => {
  unsub?.()
})

const entry = computed(() => {
  void bump.value
  return props.cache.get(props.blockId)
})

const iconHost = ref<HTMLDivElement | null>(null)

watch(
  [entry, iconHost],
  () => {
    const host = iconHost.value
    const canvas = entry.value.canvas
    if (!host) return
    host.replaceChildren()
    if (entry.value.status === 'ready' && canvas) {
      canvas.classList.add('wm-slot-canvas')
      host.appendChild(canvas)
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="wm-slot" role="listitem">
    <div
      ref="iconHost"
      class="wm-slot-icon"
      aria-hidden="true"
    />
    <div
      v-if="entry.status === 'pending' || entry.status === 'idle'"
      class="wm-slot-skeleton"
    />
    <div
      v-if="entry.status === 'error'"
      class="wm-slot-fallback"
      :title="entry.error?.message ?? '预览失败'"
    />
    <span
      v-if="count > 1"
      class="wm-slot-count"
      aria-label="数量"
    >{{ count }}</span>
  </div>
</template>

<style scoped>
.wm-slot {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.9);
  box-sizing: border-box;
}
.wm-slot-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 3px;
}
.wm-slot-icon :deep(.wm-slot-canvas) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  display: block;
}
.wm-slot-skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    rgba(51, 65, 85, 0.4) 0%,
    rgba(71, 85, 105, 0.65) 50%,
    rgba(51, 65, 85, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: wm-shimmer 1.1s ease-in-out infinite;
  pointer-events: none;
}
@keyframes wm-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.wm-slot-fallback {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 3px;
  background: repeating-linear-gradient(
    45deg,
    #334155,
    #334155 4px,
    #1e293b 4px,
    #1e293b 8px
  );
  pointer-events: none;
}
.wm-slot-count {
  position: absolute;
  right: 1px;
  bottom: 0;
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  font-family: 'Minecraftia', ui-monospace, 'Cascadia Code', monospace;
  color: #fff;
  text-shadow:
    1px 1px 0 #1e293b,
    -1px -1px 0 #1e293b,
    1px -1px 0 #1e293b,
    -1px 1px 0 #1e293b;
  pointer-events: none;
  user-select: none;
}
</style>
