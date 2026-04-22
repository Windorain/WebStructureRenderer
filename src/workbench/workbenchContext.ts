/**
 * 工作台共享状态（provide / inject）。
 *
 * 数据流（单向）：
 * 1. **入口**：本机文件 / SDE 列表或工作区 / 内置示例 → 写入 `scene`（内存中唯一一份场景 JSON）
 * 2. **编辑**：元数据等仅修改 `scene`，不直接改预览配置
 * 3. **预览**：`syncPreview()` 从当前 `scene` 深拷贝后异步构建 `PreviewConfig`；不先抹掉旧配置，成功后再整体替换
 * 4. **导出/落盘**：从 `scene` 读数据，按各面板格式输出（与预览构建独立）
 */

import type { InjectionKey, Ref, ShallowRef } from 'vue'
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
import { isCompactSceneEnvelope, normalizeSceneDocumentForWiki } from '@/render/data/compactSceneDocument'
import { canonicalizeCompactInPlace, downloadJson, patchSceneMetadataRoot } from '@/workbench/sceneExportKit'
import { documentLooksPreviewable, previewConfigFromDocument } from '@/workbench/previewFromDocument'

export type WorkbenchWorkspaceMode = 'sde' | 'local-file' | 'local-bundle'
export type WorkbenchMainSection = 'preview' | 'edit' | 'export'
/** 内存中的场景包（结构 JSON 根对象） */
export type WorkbenchScene = Record<string, unknown>

export interface WorkbenchContext {
  mainSection: Ref<WorkbenchMainSection>
  settingsOpen: Ref<boolean>
  workspaceMode: Ref<WorkbenchWorkspaceMode>
  localFileName: Ref<string | null>
  apiBase: Ref<string>
  token: Ref<string>
  connectionOk: Ref<boolean | null>
  connectionMessage: Ref<string>
  exportFiles: Ref<ExportFileInfo[]>
  exportsLoading: Ref<boolean>
  selectedExportName: Ref<string | null>
  /** 当前内存中的完整场景数据（所有入口与编辑只改此对象） */
  scene: Ref<WorkbenchScene | null>
  dirty: Ref<boolean>
  /** 由 `syncPreview` 从 `scene` 派生；成功前保留上一成功帧，避免闪断 */
  previewConfig: ShallowRef<PreviewConfig | null>
  /** 每成功 `syncPreview` 一次 +1，用于 AppShell 与上一配置实例隔离 */
  previewEpoch: Ref<number>
  /** 每次从本机/SDE/示例完整载入场景 +1，供元数据表单 `:key` 强制与磁盘快照对齐 */
  sceneLoadEpoch: Ref<number>
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
  saveWorkspaceMetadataPatch(patch: Record<string, unknown>): Promise<void>
  applyMetadataPatch(patch: Record<string, unknown>): void
  /**
   * 以当前 `scene` 为源重建预览会话（`PreviewConfig`）；失败时保留旧预览，仅写 `previewError`。
   */
  syncPreview(): Promise<void>
  loadLocalScene(sceneId?: string): Promise<void>
  loadSceneFromFile(file: File, options?: { saveHandle?: FileSystemFileHandle | null }): Promise<void>
  /** 将当前 `scene` 以 JSON 写回本机/触发下载 */
  writeSceneToLocalDisk(): Promise<void>
}

export const workbenchContextKey: InjectionKey<WorkbenchContext> = Symbol('workbenchContext')

function cloneDoc(doc: unknown): WorkbenchScene | null {
  if (doc === null || typeof doc !== 'object') return null
  return JSON.parse(JSON.stringify(doc)) as WorkbenchScene
}

type FileSystemFileHandleWritable = FileSystemFileHandle & {
  queryPermission(descriptor?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
  requestPermission(descriptor?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
}

async function ensureFileWritePermission(handle: FileSystemFileHandle): Promise<void> {
  const h = handle as FileSystemFileHandleWritable
  const opts = { mode: 'readwrite' as const }
  if ((await h.queryPermission(opts)) === 'granted') return
  if ((await h.requestPermission(opts)) === 'granted') return
  throw new Error('未授予文件写入权限')
}

type SaveFilePickerOptions = {
  suggestedName?: string
  types?: Array<{ description: string; accept: Record<string, string[]> }>
}

function getShowSaveFilePicker():
  | ((options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>)
  | undefined {
  if (typeof window === 'undefined' || !window.isSecureContext) return undefined
  const w = window as Window & { showSaveFilePicker?: (o: SaveFilePickerOptions) => Promise<FileSystemFileHandle> }
  return typeof w.showSaveFilePicker === 'function' ? w.showSaveFilePicker : undefined
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

  const scene = ref<WorkbenchScene | null>(null)
  const dirty = ref(false)

  const previewConfig = shallowRef<PreviewConfig | null>(null)
  const previewEpoch = ref(0)
  const sceneLoadEpoch = ref(0)
  const previewBusy = ref(false)
  const previewError = ref<string | null>(null)
  const localFileSaveHandle: ShallowRef<FileSystemFileHandle | null> = shallowRef(null)

  /** 写入 `scene`：Compact 先 canonicalize（根键折入 meta + 净化 payload）；非空则 bump `sceneLoadEpoch`。 */
  function commitScene(next: WorkbenchScene | null): void {
    if (next && isCompactSceneEnvelope(next)) {
      canonicalizeCompactInPlace(next)
    }
    if (next) {
      sceneLoadEpoch.value += 1
    }
    scene.value = next
  }

  function resetSessionState(): void {
    scene.value = null
    dirty.value = false
    previewConfig.value = null
    previewEpoch.value = 0
    sceneLoadEpoch.value = 0
    previewError.value = null
    selectedExportName.value = null
    localFileName.value = null
    localFileSaveHandle.value = null
  }

  function setMainSection(s: WorkbenchMainSection): void {
    mainSection.value = s
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

  async function syncPreview(): Promise<void> {
    const raw = scene.value
    previewError.value = null
    if (!raw) {
      previewError.value = '无场景数据'
      previewConfig.value = null
      previewEpoch.value = 0
      return
    }
    let normalizedForCheck: unknown
    try {
      normalizedForCheck = await normalizeSceneDocumentForWiki(raw)
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
      const snapshot = JSON.parse(JSON.stringify(raw)) as unknown
      const cfg = await previewConfigFromDocument(snapshot)
      previewConfig.value = cfg
      previewEpoch.value += 1
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
    localFileSaveHandle.value = null
    selectedExportName.value = name
    const data = await sdeGetExportFile(apiBase.value, token.value, name)
    const next = cloneDoc(data)
    commitScene(next)
    dirty.value = false
    await syncPreview()
  }

  async function loadWorkspaceFromServer(): Promise<void> {
    if (!apiBase.value) return
    localFileSaveHandle.value = null
    const data = await sdeGetWorkspaceDocument(apiBase.value, token.value)
    const c = cloneDoc(data)
    if (c && Object.keys(c).length > 0) {
      commitScene(c)
      dirty.value = false
      await syncPreview()
    }
  }

  async function saveWorkspaceFull(): Promise<void> {
    if (!apiBase.value || !scene.value) return
    await sdePutWorkspaceDocument(apiBase.value, token.value, scene.value)
    dirty.value = false
    await syncPreview()
  }

  async function saveWorkspaceMetadataPatch(patch: Record<string, unknown>): Promise<void> {
    if (!apiBase.value) return
    const merged = await sdePatchWorkspaceDocument(apiBase.value, token.value, patch)
    const next = cloneDoc(merged)
    commitScene(next)
    dirty.value = false
    await syncPreview()
  }

  function applyMetadataPatch(patch: Record<string, unknown>): void {
    if (!scene.value) return
    scene.value = patchSceneMetadataRoot(scene.value, patch) as WorkbenchScene
    dirty.value = true
    void syncPreview()
  }

  async function loadLocalScene(sceneId?: string): Promise<void> {
    const id = sceneId && sceneId.length > 0 ? sceneId : DEFAULT_PREVIEW_SCENE_ID
    const raw = getDevSceneDocument(id)
    workspaceMode.value = 'local-bundle'
    localFileName.value = null
    localFileSaveHandle.value = null
    selectedExportName.value = null
    const next = cloneDoc(raw)
    commitScene(next)
    localFileName.value = `示例 · ${id}.json`
    dirty.value = false
    await syncPreview()
  }

  async function loadSceneFromFile(
    file: File,
    options?: { saveHandle?: FileSystemFileHandle | null },
  ): Promise<void> {
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
    localFileSaveHandle.value = options?.saveHandle ?? null
    commitScene(parsed)
    localFileName.value = file.name
    dirty.value = false
    await syncPreview()
  }

  function suggestedLocalJsonFilename(): string {
    let base = localFileName.value?.replace(/^示例 · /, '') ?? 'structure-export'
    if (!base.toLowerCase().endsWith('.json')) base = `${base}.json`
    return base
  }

  async function writeSceneToLocalDisk(): Promise<void> {
    const doc = scene.value
    if (!doc) {
      connectionMessage.value = '无场景数据可保存'
      return
    }
    const text = `${JSON.stringify(doc, null, 2)}\n`
    const downloadBaseName = suggestedLocalJsonFilename().replace(/\.json$/i, '')

    let handle = localFileSaveHandle.value
    const showSavePicker = getShowSaveFilePicker()

    if (!handle && showSavePicker) {
      try {
        const newHandle = await showSavePicker({
          suggestedName: suggestedLocalJsonFilename(),
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        })
        localFileSaveHandle.value = newHandle
        localFileName.value = newHandle.name
        handle = newHandle
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          connectionMessage.value = '已取消保存'
          return
        }
        console.warn('[Workbench] showSaveFilePicker 失败，将尝试下载 JSON', e)
        handle = null
      }
    }

    if (handle) {
      try {
        await ensureFileWritePermission(handle)
        const writable = await handle.createWritable()
        await writable.write(text)
        await writable.close()
        dirty.value = false
        connectionMessage.value = `已保存到 ${handle.name}`
        return
      } catch (e) {
        console.warn('[Workbench] 写入本地文件失败，将尝试下载 JSON', e)
        localFileSaveHandle.value = null
      }
    }

    downloadJson(downloadBaseName, doc, true)
    dirty.value = false
    connectionMessage.value =
      '已触发浏览器下载 JSON。若没有出现文件，请检查地址栏是否拦截了下载，或允许本站弹出窗口。'
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
    scene,
    dirty,
    previewConfig,
    previewEpoch,
    sceneLoadEpoch,
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
    syncPreview,
    loadLocalScene,
    loadSceneFromFile,
    writeSceneToLocalDisk,
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
