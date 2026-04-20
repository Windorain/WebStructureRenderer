/**
 * 工作台共享状态：由 WorkbenchRoot provide，子面板 inject。
 */

import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref, shallowRef } from 'vue'

import type { PreviewConfig } from '@/preview/previewConfig'
import { DEFAULT_PREVIEW_SCENE_ID } from '@/preview/previewSession'
import { getDevSceneDocument } from '@/dev/devScenes'
import {
  formatSdeError,
  sdeGetExportFile,
  sdeGetWorkspaceDocument,
  sdeListExports,
  sdePing,
  sdePatchWorkspaceDocument,
  sdePutWorkspaceDocument,
  type ExportFileInfo,
} from '@/workbench/sdeApi'
import { normalizeSceneDocumentForWiki } from '@/render/data/compactSceneDocument'
import { patchSceneMetadataRoot } from '@/workbench/sceneExportKit'
import { documentLooksPreviewable, previewConfigFromDocument } from '@/workbench/previewFromDocument'

/** 界面工作模式：右上角「设置」中选择（数据源） */
export type WorkbenchWorkspaceMode = 'sde' | 'local-file' | 'local-bundle'

/** 左侧主导航：预览 / 编辑 / 导出 */
export type WorkbenchMainSection = 'preview' | 'edit' | 'export'

export interface WorkbenchContext {
  /** 左侧当前板块 */
  mainSection: Ref<WorkbenchMainSection>
  /** 右上角设置抽屉是否打开 */
  settingsOpen: Ref<boolean>
  /** 当前主工作区模式（SDE / 本地磁盘 / 内置示例场景） */
  workspaceMode: Ref<WorkbenchWorkspaceMode>
  /** 本地文件模式：当前打开的文件名（仅展示） */
  localFileName: Ref<string | null>
  apiBase: Ref<string>
  token: Ref<string>
  connectionOk: Ref<boolean | null>
  connectionMessage: Ref<string>

  exportFiles: Ref<ExportFileInfo[]>
  exportsLoading: Ref<boolean>
  selectedExportName: Ref<string | null>

  document: Ref<Record<string, unknown> | null>
  dirty: Ref<boolean>

  previewConfig: Ref<PreviewConfig | null>
  previewBusy: Ref<boolean>
  previewError: Ref<string | null>

  setMainSection(section: WorkbenchMainSection): void
  setSettingsOpen(open: boolean): void
  setWorkspaceMode(mode: WorkbenchWorkspaceMode): void
  setApiBase(raw: string): void
  setToken(raw: string): void
  testConnection(): Promise<void>
  refreshExportList(): Promise<void>
  loadExportByName(name: string): Promise<void>
  loadWorkspaceFromServer(): Promise<void>
  saveWorkspaceFull(): Promise<void>
  /** 服务端浅合并元数据（PATCH）并刷新本地文档与预览 */
  saveWorkspaceMetadataPatch(patch: Record<string, unknown>): Promise<void>
  applyMetadataPatch(patch: Record<string, unknown>): void
  refreshPreview(): Promise<void>
  loadLocalScene(sceneId?: string): Promise<void>
  loadDocumentFromFile(file: File): Promise<void>
}

export const workbenchContextKey: InjectionKey<WorkbenchContext> = Symbol('workbenchContext')

function cloneDoc(doc: unknown): Record<string, unknown> | null {
  if (doc === null || typeof doc !== 'object') return null
  return JSON.parse(JSON.stringify(doc)) as Record<string, unknown>
}

function parseWorkbenchQuery(): { apiBase: string; token: string } {
  if (typeof window === 'undefined') return { apiBase: '', token: '' }
  const q = new URLSearchParams(window.location.search)
  const apiBase = (q.get('apiBase') ?? q.get('api') ?? '').trim().replace(/\/+$/, '')
  const token = (q.get('token') ?? '').trim()
  return { apiBase, token }
}

export function provideWorkbenchContext(): WorkbenchContext {
  const initial = parseWorkbenchQuery()

  const mainSection = ref<WorkbenchMainSection>('preview')
  const settingsOpen = ref(false)
  const workspaceMode = ref<WorkbenchWorkspaceMode>(initial.apiBase ? 'sde' : 'local-file')
  const localFileName = ref<string | null>(null)
  const apiBase = ref(initial.apiBase)
  const token = ref(initial.token)
  const connectionOk = ref<boolean | null>(null)
  const connectionMessage = ref('')

  const exportFiles = ref<ExportFileInfo[]>([])
  const exportsLoading = ref(false)
  const selectedExportName = ref<string | null>(null)

  const document = ref<Record<string, unknown> | null>(null)
  const dirty = ref(false)

  const previewConfig = shallowRef<PreviewConfig | null>(null)
  const previewBusy = ref(false)
  const previewError = ref<string | null>(null)

  function resetSessionState(): void {
    document.value = null
    dirty.value = false
    previewConfig.value = null
    previewError.value = null
    selectedExportName.value = null
    localFileName.value = null
  }

  function setMainSection(section: WorkbenchMainSection): void {
    mainSection.value = section
  }

  function setSettingsOpen(open: boolean): void {
    settingsOpen.value = open
  }

  function setWorkspaceMode(mode: WorkbenchWorkspaceMode): void {
    if (workspaceMode.value === mode) return
    workspaceMode.value = mode
    connectionMessage.value = ''
    connectionOk.value = null
    exportFiles.value = []
    exportsLoading.value = false
    resetSessionState()
  }

  async function refreshPreview(): Promise<void> {
    const doc = document.value
    previewError.value = null
    previewConfig.value = null
    if (!doc) {
      previewError.value = '无文档'
      return
    }
    let normalizedForCheck: unknown
    try {
      normalizedForCheck = await normalizeSceneDocumentForWiki(doc)
    } catch (e) {
      previewError.value = formatSdeError(e)
      return
    }
    if (!documentLooksPreviewable(normalizedForCheck)) {
      previewError.value =
        '当前文档缺少 textureBlobs 或非 geometryPhase=baked，无法内嵌预览（可继续编辑元数据并导出）。'
      return
    }
    previewBusy.value = true
    try {
      previewConfig.value = await previewConfigFromDocument(JSON.parse(JSON.stringify(doc)))
    } catch (e) {
      previewError.value = formatSdeError(e)
    } finally {
      previewBusy.value = false
    }
  }

  function setApiBase(raw: string): void {
    apiBase.value = raw.trim().replace(/\/+$/, '')
  }

  function setToken(raw: string): void {
    token.value = raw.trim()
  }

  async function testConnection(): Promise<void> {
    connectionOk.value = null
    connectionMessage.value = ''
    if (!apiBase.value) {
      connectionMessage.value = '请填写 API 基址（例如 http://127.0.0.1:37564）'
      connectionOk.value = false
      return
    }
    try {
      await sdePing(apiBase.value, token.value)
      connectionOk.value = true
      connectionMessage.value = '已连接'
    } catch (e) {
      connectionOk.value = false
      connectionMessage.value = formatSdeError(e)
    }
  }

  async function refreshExportList(): Promise<void> {
    if (!apiBase.value) return
    exportsLoading.value = true
    try {
      exportFiles.value = await sdeListExports(apiBase.value, token.value)
    } catch (e) {
      exportFiles.value = []
      connectionMessage.value = formatSdeError(e)
    } finally {
      exportsLoading.value = false
    }
  }

  async function loadExportByName(name: string): Promise<void> {
    if (!apiBase.value) return
    workspaceMode.value = 'sde'
    localFileName.value = null
    selectedExportName.value = name
    const data = await sdeGetExportFile(apiBase.value, token.value, name)
    document.value = cloneDoc(data)
    dirty.value = false
    await refreshPreview()
  }

  async function loadWorkspaceFromServer(): Promise<void> {
    if (!apiBase.value) return
    const data = await sdeGetWorkspaceDocument(apiBase.value, token.value)
    const c = cloneDoc(data)
    if (c && Object.keys(c).length > 0) {
      document.value = c
      dirty.value = false
      await refreshPreview()
    }
  }

  async function saveWorkspaceFull(): Promise<void> {
    if (!apiBase.value || !document.value) return
    await sdePutWorkspaceDocument(apiBase.value, token.value, document.value)
    dirty.value = false
  }

  async function saveWorkspaceMetadataPatch(patch: Record<string, unknown>): Promise<void> {
    if (!apiBase.value) return
    const merged = await sdePatchWorkspaceDocument(apiBase.value, token.value, patch)
    document.value = cloneDoc(merged)
    dirty.value = false
    await refreshPreview()
  }

  function applyMetadataPatch(patch: Record<string, unknown>): void {
    if (!document.value) return
    document.value = patchSceneMetadataRoot(document.value, patch) as Record<string, unknown>
    dirty.value = true
    void refreshPreview()
  }

  async function loadLocalScene(sceneId?: string): Promise<void> {
    const id = sceneId && sceneId.length > 0 ? sceneId : DEFAULT_PREVIEW_SCENE_ID
    const raw = getDevSceneDocument(id)
    workspaceMode.value = 'local-bundle'
    localFileName.value = null
    selectedExportName.value = null
    document.value = cloneDoc(raw)
    localFileName.value = `示例 · ${id}.json`
    dirty.value = false
    await refreshPreview()
  }

  async function loadDocumentFromFile(file: File): Promise<void> {
    const text = await file.text()
    let data: unknown
    try {
      data = JSON.parse(text) as unknown
    } catch (e) {
      throw new Error(`JSON 解析失败：${formatSdeError(e)}`)
    }
    const parsed = cloneDoc(data)
    if (!parsed) {
      throw new Error('JSON 根须为对象')
    }
    workspaceMode.value = 'local-file'
    selectedExportName.value = null
    document.value = parsed
    localFileName.value = file.name
    dirty.value = false
    await refreshPreview()
  }

  const ctx: WorkbenchContext = {
    mainSection,
    settingsOpen,
    workspaceMode,
    localFileName,
    apiBase,
    token,
    connectionOk,
    connectionMessage,
    exportFiles,
    exportsLoading,
    selectedExportName,
    document,
    dirty,
    previewConfig,
    previewBusy,
    previewError,
    setMainSection,
    setSettingsOpen,
    setWorkspaceMode,
    setApiBase,
    setToken,
    testConnection,
    refreshExportList,
    loadExportByName,
    loadWorkspaceFromServer,
    saveWorkspaceFull,
    saveWorkspaceMetadataPatch,
    applyMetadataPatch,
    refreshPreview,
    loadLocalScene,
    loadDocumentFromFile,
  }

  provide(workbenchContextKey, ctx)
  return ctx
}

export function useWorkbenchContext(): WorkbenchContext {
  const ctx = inject(workbenchContextKey)
  if (!ctx) {
    throw new Error('useWorkbenchContext() 须在 WorkbenchRoot 子树内调用')
  }
  return ctx
}
