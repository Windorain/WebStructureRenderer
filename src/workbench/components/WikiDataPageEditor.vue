<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSceneContext } from '@/workbench/sceneContext'
import { useWikiDataContext } from '@/workbench/wikiDataContext'
import { buildWikiEditSummary } from '@/workbench/wikiDiff'
import { t } from '@/workbench/i18n'

const scene = useSceneContext()
const ctx = useWikiDataContext()
const inputTitle = ref('')
const localError = ref('')

const hasDataPage = computed(() => ctx.wikiDataTitle.value !== null)
const canSaveDataPage = computed(() => hasDataPage.value && inputTitle.value === ctx.wikiDataTitle.value)
const diffResult = computed(() => {
  const original = ctx.wikiDataOriginalDocument.value
  const current = scene.scene.value
  if (!original || !current) return null
  return buildWikiEditSummary(original, current, ctx.wikiDataSummaryMaxBytes.value)
})

watch(diffResult, (res) => {
  if (!res) {
    ctx.wikiDataSummaryPreview.value = ''
    ctx.wikiDataSummaryTooLong.value = false
    ctx.wikiDataSummaryByteLength.value = 0
    return
  }
  ctx.wikiDataSummaryPreview.value = res.summary
  ctx.wikiDataSummaryTooLong.value = res.tooLong
  ctx.wikiDataSummaryByteLength.value = res.byteLength
}, { immediate: true })

watch(
  () => ctx.wikiDataTitle.value,
  (title) => {
    inputTitle.value = title ?? ''
  },
  { immediate: true },
)

async function loadPage(): Promise<void> {
  localError.value = ''
  try {
    await ctx.loadWikiDataPage(inputTitle.value)
  } catch (e) {
    localError.value = e instanceof Error ? e.message : String(e)
  }
}

async function savePage(): Promise<void> {
  localError.value = ''
  try {
    await ctx.saveToWikiDataPage()
  } catch (e) {
    localError.value = e instanceof Error ? e.message : String(e)
  }
}

function newSummaryText(): string {
  if (!ctx.wikiDataTitle.value) return '未加载 Data 页面'
  if (!diffResult.value) return '无可保存变更'
  if (diffResult.value.tooLong) return `摘要超限 ${diffResult.value.byteLength}/${diffResult.value.maxBytes} bytes`
  return diffResult.value.summary
}
</script>

<template>
  <div class="pe-panel">
    <div class="pe-title">{{ t('wikiDataPage') }}</div>

    <div class="wd-row">
      <label class="wd-field">
        <span>Data 页面</span>
        <input v-model="inputTitle" type="text" placeholder="Data:Structures/Example.json" autocomplete="off" />
      </label>
      <div class="wd-actions">
        <button class="pe-btn" @click="void loadPage()">载入</button>
        <button class="pe-btn pe-btn--primary" :disabled="!canSaveDataPage" @click="void savePage()">保存到 Wiki</button>
      </div>
    </div>

    <p class="wd-meta">
      <span v-if="ctx.wikiDataTitle.value">页面: {{ ctx.wikiDataTitle.value }}</span>
      <span v-if="ctx.wikiDataRevisionId.value !== null">r{{ ctx.wikiDataRevisionId.value }}</span>
    </p>

    <label class="wd-field wd-field--stack">
      <span>审计摘要预览</span>
      <textarea class="wd-summary" rows="6" readonly :value="newSummaryText()" />
    </label>

    <p v-if="ctx.wikiDataSummaryPreview.value" class="wd-count">
      {{ ctx.wikiDataSummaryByteLength.value }}/{{ ctx.wikiDataSummaryMaxBytes.value }} bytes
    </p>
    <p v-if="ctx.wikiDataSummaryTooLong.value" class="wd-error">摘要超出限制，需缩小变更或拆分保存</p>
    <p v-if="localError || ctx.wikiDataError.value" class="wd-error">{{ localError || ctx.wikiDataError.value }}</p>
  </div>
</template>

<style scoped>
.pe-panel { padding: 10px; font-size: 12px; }
.pe-title { font-size: 13px; font-weight: 600; color: var(--nei-text); text-shadow: var(--nei-label-shadow); margin-bottom: 8px; }
.pe-btn {
  padding: 4px 10px; border-radius: 4px; border: var(--nei-bevel-w) solid;
  border-color: var(--nei-highlight) var(--nei-shadow) var(--nei-shadow) var(--nei-highlight);
  background: var(--nei-btn-bg); color: var(--nei-btn-text); cursor: pointer; font-size: 11px;
}
.pe-btn--primary {
  background: var(--nei-accent); border-color: var(--nei-accent-shadow);
  color: var(--nei-accent-text); text-shadow: var(--nei-accent-shadow);
}
.pe-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.wd-row { display: flex; flex-direction: column; gap: 8px; }
.wd-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.wd-field { display: flex; flex-direction: column; gap: 3px; }
.wd-field span { font-size: 10px; color: var(--nei-label); text-transform: uppercase; }
.wd-field input,
.wd-summary {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  border-radius: 4px;
  border: var(--nei-bevel-w) solid;
  border-color: var(--nei-shadow) var(--nei-highlight) var(--nei-highlight) var(--nei-shadow);
  background: var(--nei-inset-bg);
  color: var(--nei-text);
  font-size: 11px;
  font-family: ui-monospace, monospace;
}
.wd-field--stack { margin-top: 8px; }
.wd-summary { resize: vertical; min-height: 96px; }
.wd-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 0; font-size: 10px; color: var(--nei-muted); }
.wd-count { margin: 6px 0 0; font-size: 10px; color: var(--nei-muted); }
.wd-error { margin: 6px 0 0; font-size: 11px; color: var(--nei-error-text); white-space: pre-wrap; }
</style>
