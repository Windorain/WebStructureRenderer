import type { InjectionKey, Ref, ShallowRef } from 'vue'
import { inject, provide, ref, shallowRef } from 'vue'

import type { SceneContext, WorkbenchScene } from '@/workbench/sceneContext'
import { cloneDocument } from '@/workbench/utils/sceneHelpers'
import { buildWikiEditSummary, WIKI_EDIT_SUMMARY_MAX_BYTES } from '@/workbench/wikiDiff'
import { fetchWikiDataPage, normalizeWikiDataTitle, saveWikiDataPage } from '@/workbench/wikiDataPage'
import { buildEnvelopePackage } from '@/render/data/sceneExport'

export interface WikiDataContext {
  readonly wikiDataTitle: Ref<string | null>
  readonly wikiDataRevisionId: Ref<number | null>
  readonly wikiDataSummaryPreview: Ref<string>
  readonly wikiDataSummaryTooLong: Ref<boolean>
  readonly wikiDataSummaryByteLength: Ref<number>
  readonly wikiDataSummaryMaxBytes: Ref<number>
  readonly wikiDataError: Ref<string | null>
  readonly wikiDataOriginalDocument: ShallowRef<WorkbenchScene | null>

  loadWikiDataPage(title: string): Promise<void>
  saveToWikiDataPage(): Promise<void>
  refreshWikiSummaryPreview(): void
}

export const wikiDataContextKey: InjectionKey<WikiDataContext> = Symbol('wikiDataContext')

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(x => typeof x === 'string')
}

function remapTooltipGridIndexes(grid: unknown, localPalette: readonly string[], rootIndexByText: Map<string, number>): boolean {
  if (!Array.isArray(grid)) return false
  let changed = false
  for (const zArr of grid) {
    if (!Array.isArray(zArr)) continue
    for (const rArr of zArr) {
      if (!Array.isArray(rArr)) continue
      for (let column = 0; column < rArr.length; column++) {
        const idx = rArr[column]
        if (typeof idx !== 'number' || !Number.isFinite(idx) || idx < 0) continue
        const text = localPalette[Math.floor(idx)]
        if (typeof text !== 'string') continue
        const rootIdx = rootIndexByText.get(text)
        if (rootIdx === undefined || rootIdx === idx) continue
        rArr[column] = rootIdx
        changed = true
      }
    }
  }
  return changed
}

function normalizeLegacyWorldTooltipPalette(doc: WorkbenchScene | null): boolean {
  if (!isRecord(doc) || !Array.isArray(doc.frames)) return false
  const rootPalette = isStringArray(doc.tooltipPalette) ? [...doc.tooltipPalette] : []

  const rootIndexByText = new Map<string, number>()
  for (let i = 0; i < rootPalette.length; i++) {
    const text = rootPalette[i]
    if (!rootIndexByText.has(text)) {
      rootIndexByText.set(text, i)
    }
  }

  function ensureRootTooltip(text: string): number {
    const existing = rootIndexByText.get(text)
    if (existing !== undefined) return existing
    const idx = rootPalette.length
    rootPalette.push(text)
    rootIndexByText.set(text, idx)
    return idx
  }

  let changed = false
  for (const frame of doc.frames) {
    if (!isRecord(frame) || !isRecord(frame.structure)) continue
    const structure = frame.structure
    const localPalette = structure.tooltipPalette
    if (!isStringArray(localPalette) || localPalette.length === 0) continue
    for (const text of localPalette) {
      ensureRootTooltip(text)
    }
    changed = remapTooltipGridIndexes(structure.cellTooltipGrid, localPalette, rootIndexByText) || changed
    delete structure.tooltipPalette
    changed = true
  }

  if (rootPalette.length > 0) {
    doc.tooltipPalette = rootPalette
    changed = true
  }
  return changed
}

export function provideWikiDataContext(scene: SceneContext): WikiDataContext {
  const wikiDataTitle = ref<string | null>(null)
  const wikiDataRevisionId = ref<number | null>(null)
  const wikiDataSummaryPreview = ref('')
  const wikiDataSummaryTooLong = ref(false)
  const wikiDataSummaryByteLength = ref(0)
  const wikiDataSummaryMaxBytes = ref(WIKI_EDIT_SUMMARY_MAX_BYTES)
  const wikiDataError = ref<string | null>(null)
  const wikiDataOriginalDocument: ShallowRef<WorkbenchScene | null> = shallowRef(null)

  function refreshWikiSummaryPreview(): void {
    const current = scene.scene.value
    const original = wikiDataOriginalDocument.value
    if (!current || !original) {
      wikiDataSummaryPreview.value = ''
      wikiDataSummaryTooLong.value = false
      wikiDataSummaryByteLength.value = 0
      return
    }
    const result = buildWikiEditSummary(original, current, wikiDataSummaryMaxBytes.value)
    wikiDataSummaryPreview.value = result.summary
    wikiDataSummaryTooLong.value = result.tooLong
    wikiDataSummaryByteLength.value = result.byteLength
  }

  async function loadWikiDataPage(title: string): Promise<void> {
    const normalized = normalizeWikiDataTitle(title)
    wikiDataError.value = null
    try {
      const data = await fetchWikiDataPage(normalized)
      await scene.loadSceneDocument(data.document, {
        mode: 'local-bundle',
        fileName: `${normalized.slice('Data:'.length)}.json`,
      })
      if (normalizeLegacyWorldTooltipPalette(scene.scene.value)) {
        await scene.syncPreview()
      }
      wikiDataTitle.value = normalized
      wikiDataRevisionId.value = data.revid
      wikiDataOriginalDocument.value = cloneDocument(scene.scene.value)
      refreshWikiSummaryPreview()
    } catch (e) {
      wikiDataError.value = e instanceof Error ? e.message : String(e)
      throw e
    }
  }

  async function saveToWikiDataPage(): Promise<void> {
    const doc = scene.scene.value
    const title = wikiDataTitle.value
    if (!doc || !title) {
      throw new Error('未加载 wiki Data 页面')
    }
    try {
      const original = wikiDataOriginalDocument.value
      if (!original) {
        throw new Error('缺少原始 wiki 文档快照')
      }
      const result = buildWikiEditSummary(original, doc, wikiDataSummaryMaxBytes.value)
      wikiDataSummaryPreview.value = result.summary
      wikiDataSummaryTooLong.value = result.tooLong
      wikiDataSummaryByteLength.value = result.byteLength
      if (result.tooLong) {
        throw new Error(`编辑摘要超出限制：${result.byteLength}/${result.maxBytes} bytes`)
      }
      if (!result.entries.length) {
        throw new Error('没有可保存的审计字段变化')
      }
      const text = `${JSON.stringify(buildEnvelopePackage(doc), null, 2)}\n`
      await saveWikiDataPage(title, text, result.summary, wikiDataRevisionId.value)
      const fetched = await fetchWikiDataPage(title)
      wikiDataRevisionId.value = fetched.revid
      await scene.loadSceneDocument(fetched.document, {
        mode: 'local-bundle',
        fileName: `${title.slice('Data:'.length)}.json`,
      })
      if (normalizeLegacyWorldTooltipPalette(scene.scene.value)) {
        await scene.syncPreview()
      }
      wikiDataOriginalDocument.value = cloneDocument(scene.scene.value)
      scene.markClean()
      wikiDataError.value = null
      refreshWikiSummaryPreview()
    } catch (e) {
      wikiDataError.value = e instanceof Error ? e.message : String(e)
      throw e
    }
  }

  const ctx: WikiDataContext = {
    wikiDataTitle: wikiDataTitle as unknown as Ref<string | null>,
    wikiDataRevisionId: wikiDataRevisionId as unknown as Ref<number | null>,
    wikiDataSummaryPreview: wikiDataSummaryPreview as unknown as Ref<string>,
    wikiDataSummaryTooLong: wikiDataSummaryTooLong as unknown as Ref<boolean>,
    wikiDataSummaryByteLength: wikiDataSummaryByteLength as unknown as Ref<number>,
    wikiDataSummaryMaxBytes: wikiDataSummaryMaxBytes as unknown as Ref<number>,
    wikiDataError: wikiDataError as unknown as Ref<string | null>,
    wikiDataOriginalDocument: wikiDataOriginalDocument as unknown as ShallowRef<WorkbenchScene | null>,
    loadWikiDataPage,
    saveToWikiDataPage,
    refreshWikiSummaryPreview,
  }

  provide(wikiDataContextKey, ctx)
  return ctx
}

export function useWikiDataContext(): WikiDataContext {
  const ctx = inject(wikiDataContextKey)
  if (!ctx) throw new Error('useWikiDataContext() 须在 WikiWorkbenchRoot 子树内调用')
  return ctx
}
