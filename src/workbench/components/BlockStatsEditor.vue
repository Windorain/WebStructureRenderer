<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/workbench/i18n'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { loadStructureOrWorld, isWorldDocument } from '@/render/data/bundleResolve'
import { buildBlockStatsEntries } from '@/render/interaction/blockStats'

const ctx = useWorkbenchContext()

const entries = computed(() => {
  const doc = ctx.scene.value
  if (!doc) return []
  try {
    let def
    if (isWorldDocument(doc) && doc.frames.length > 0) {
      const st = (doc.frames[0] as Record<string, unknown>)?.structure
      def = st ? loadStructureOrWorld(st, undefined) : null
    } else {
      def = loadStructureOrWorld(doc, undefined)
    }
    if (!def) return []
    return buildBlockStatsEntries(def, 'all')
  } catch {
    return []
  }
})

defineEmits<{
  (e: 'hover-block', payload: { blockId: string; clientX: number; clientY: number } | null): void
}>()
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">{{ t('blockInspector') }}</div>
    <p v-if="entries.length === 0" class="pe-muted">无方块数据</p>
    <div v-else class="bs-list">
      <div
        v-for="row in entries" :key="row.blockId"
        class="bs-row"
      >
        <span class="bs-id">{{ row.blockId }}</span>
        <span class="bs-count">{{ row.count }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.pe-muted { font-size: 11px; color: #64748b; }
.bs-list { display: flex; flex-direction: column; gap: 2px; max-height: 360px; overflow-y: auto; }
.bs-row { display: flex; justify-content: space-between; align-items: center; padding: 3px 6px; border-radius: 3px; background: #0f172a; }
.bs-id { font-family: ui-monospace, monospace; font-size: 11px; color: #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bs-count { font-family: ui-monospace, monospace; font-size: 11px; color: #64748b; margin-left: 8px; flex-shrink: 0; }
</style>
