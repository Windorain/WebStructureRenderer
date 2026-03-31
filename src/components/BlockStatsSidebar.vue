<script setup lang="ts">
import { computed, ref } from 'vue'

import type { BlockIconCache } from '@/render/blockIconCache'
import type { BlockStatRow } from '@/render/blockStats'

import BlockSlotPreview from './BlockSlotPreview.vue'

const props = withDefaults(
  defineProps<{
    entries: BlockStatRow[]
    cache: BlockIconCache
    collapsible?: boolean
    defaultCollapsed?: boolean
  }>(),
  {
    collapsible: true,
    defaultCollapsed: false,
  },
)

const collapsed = ref(props.defaultCollapsed)

const panelId = 'wm-block-stats-panel'
const headerId = 'wm-block-stats-header'

const toggle = (): void => {
  if (!props.collapsible) return
  collapsed.value = !collapsed.value
}

const empty = computed(() => props.entries.length === 0)

const emit = defineEmits<{
  'tooltip-hover': [
    payload: {
      blockId: string
      clientX: number
      clientY: number
      source: 'sidebar'
    } | null,
  ]
}>()

function onRowPointerEnter(e: PointerEvent, blockId: string): void {
  emit('tooltip-hover', {
    blockId,
    clientX: e.clientX,
    clientY: e.clientY,
    source: 'sidebar',
  })
}

function onRowPointerMove(e: PointerEvent, blockId: string): void {
  emit('tooltip-hover', {
    blockId,
    clientX: e.clientX,
    clientY: e.clientY,
    source: 'sidebar',
  })
}

function onRowPointerLeave(): void {
  emit('tooltip-hover', null)
}
</script>

<template>
  <aside
    class="wm-block-stats"
    aria-label="方块统计"
  >
    <div class="wm-block-stats-head">
      <button
        v-if="collapsible"
        :id="headerId"
        type="button"
        class="wm-block-stats-toggle"
        :aria-expanded="!collapsed"
        :aria-controls="panelId"
        @click="toggle"
      >
        <span class="wm-block-stats-chevron" :data-collapsed="collapsed" aria-hidden="true">▸</span>
        <span>方块统计</span>
      </button>
      <div
        v-else
        :id="headerId"
        class="wm-block-stats-title"
      >
        方块统计
      </div>
    </div>
    <div
      v-show="!collapsed"
      :id="panelId"
      role="region"
      :aria-labelledby="headerId"
      class="wm-block-stats-panel"
    >
      <p
        v-if="empty"
        class="wm-block-stats-empty"
      >
        无方块数据
      </p>
      <ul
        v-else
        class="wm-block-stats-list"
        role="list"
      >
        <li
          v-for="row in entries"
          :key="row.blockId"
          class="wm-block-stats-row"
          @pointerenter="onRowPointerEnter($event, row.blockId)"
          @pointermove="onRowPointerMove($event, row.blockId)"
          @pointerleave="onRowPointerLeave"
        >
          <BlockSlotPreview
            :block-id="row.blockId"
            :count="row.count"
            :cache="cache"
          />
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.wm-block-stats {
  display: flex;
  flex-direction: column;
  width: 220px;
  max-width: min(220px, 40vw);
  flex-shrink: 0;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 8px 0 0 8px;
  border-right: none;
  font-size: 12px;
  color: #e2e8f0;
  min-height: 0;
}
.wm-block-stats-head {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}
.wm-block-stats-toggle,
.wm-block-stats-title {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: #cbd5e1;
  background: transparent;
  border: none;
  cursor: default;
  text-align: left;
}
.wm-block-stats-toggle {
  cursor: pointer;
}
.wm-block-stats-toggle:hover {
  background: rgba(30, 41, 59, 0.85);
}
.wm-block-stats-chevron {
  display: inline-block;
  transition: transform 0.15s ease;
  width: 1em;
  color: #94a3b8;
}
.wm-block-stats-chevron[data-collapsed='false'] {
  transform: rotate(90deg);
}
.wm-block-stats-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 10px 10px;
}
.wm-block-stats-empty {
  margin: 0;
  opacity: 0.75;
  font-size: 11px;
}
.wm-block-stats-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wm-block-stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}
</style>
